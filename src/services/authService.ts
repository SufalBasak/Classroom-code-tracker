import { User, Role } from '../types';
import { supabase } from '../lib/supabase';

const USER_STORAGE_KEY = 'codesnap_user_session';
const ROLE_STORAGE_KEY = 'codesnap_user_role';

const ADMIN_EMAIL = 'classroomplus07@gmail.com';
const DEFAULT_USER_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
const DEFAULT_ADMIN_AVATAR = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';

function isAdminEmail(email: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}

const AUTH_REQUEST_TIMEOUT_MS = 20000;

// Supabase occasionally has slow or hung requests during platform incidents
// (see status.supabase.com). Without a bound, the UI would spin forever
// instead of telling the user something went wrong.
function withTimeout<T>(promise: Promise<T>, timeoutMessage: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(timeoutMessage)), AUTH_REQUEST_TIMEOUT_MS);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

// Supabase returns plain-English error messages; we only rewrite the ones
// whose default wording would confuse an end user.
function mapAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('invalid login credentials')) return 'Incorrect email or password.';
  if (lower.includes('email not confirmed')) {
    return 'Please confirm your email address before signing in — check your inbox for the confirmation link.';
  }
  if (lower.includes('user already registered')) return 'An account with this email already exists. Please sign in instead.';
  return message;
}

function mapProfileToUser(profile: Record<string, any>, fallbackEmail: string): User {
  const role: Role = profile.role === 'ADMIN' ? 'ADMIN' : 'USER';
  return {
    id: profile.id,
    name: profile.name || fallbackEmail.split('@')[0],
    username: profile.username || fallbackEmail.split('@')[0],
    email: profile.email || fallbackEmail,
    role,
    joinedDate: profile.created_at
      ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : 'Recently',
    avatar: profile.avatar || (role === 'ADMIN' ? DEFAULT_ADMIN_AVATAR : DEFAULT_USER_AVATAR),
    bio: role === 'ADMIN' ? 'Platform administrator & course creator.' : 'Software developer practicing coding challenges.',
    points: profile.points ?? 0,
    streak: 0,
    totalSolved: profile.total_solved ?? 0,
    joinedCourseIds: profile.joined_course_ids ?? []
  };
}

function mapPendingUserToUser(authUser: { id: string; email?: string | null }, name: string, username: string): User {
  const email = authUser.email || '';
  const role: Role = isAdminEmail(email) ? 'ADMIN' : 'USER';
  return {
    id: authUser.id,
    name: name || email.split('@')[0],
    username: username || email.split('@')[0],
    email,
    role,
    joinedDate: 'Just now',
    avatar: role === 'ADMIN' ? DEFAULT_ADMIN_AVATAR : DEFAULT_USER_AVATAR,
    bio: role === 'ADMIN' ? 'Platform administrator & course creator.' : 'Software developer practicing coding challenges.',
    points: 0,
    streak: 0,
    totalSolved: 0,
    joinedCourseIds: []
  };
}

export const authService = {
  isAuthenticated(): boolean {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    return Boolean(savedUser);
  },

  getCurrentUser(): User | null {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse stored user session', e);
      }
    }
    return null;
  },

  // Fetches the profile row created by the on_auth_user_created DB trigger.
  // Self-heals by creating the row if, for any reason, the trigger didn't run.
  async fetchOrCreateProfile(id: string, email: string, name = '', username = ''): Promise<User> {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
    if (profile) {
      return mapProfileToUser(profile, email);
    }

    const fallbackProfile = {
      id,
      email,
      name: name || email.split('@')[0],
      username: username || email.split('@')[0],
      role: isAdminEmail(email) ? 'ADMIN' : 'USER',
      avatar: isAdminEmail(email) ? DEFAULT_ADMIN_AVATAR : DEFAULT_USER_AVATAR
    };

    const { data: inserted, error: insertError } = await supabase
      .from('profiles')
      .upsert(fallbackProfile)
      .select()
      .single();

    if (insertError || !inserted) {
      console.error('Failed to create profile row for authenticated user:', insertError?.message);
      return mapProfileToUser(fallbackProfile, email);
    }
    return mapProfileToUser(inserted, email);
  },

  /**
   * Registers a new account with Supabase Auth. Role is never taken from the
   * client — only the fixed admin email is granted ADMIN, every other
   * signup is a regular USER, to prevent self-service privilege escalation.
   */
  async registerUser(data: {
    name: string;
    username: string;
    email: string;
    password: string;
  }): Promise<{ user: User; needsEmailConfirmation: boolean }> {
    const email = data.email.trim();
    const name = data.name.trim();
    const username = data.username.trim();
    const password = data.password;

    if (!email || !password) {
      throw new Error('Email and password are required.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const { data: authData, error } = await withTimeout(
      supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, username }
        }
      }),
      'Registration is taking longer than expected. Supabase may be experiencing issues right now — please try again in a moment.'
    );

    if (error) {
      throw new Error(mapAuthError(error.message));
    }
    if (!authData.user) {
      throw new Error('Registration failed. Please try again.');
    }

    // Supabase silently returns a user with an empty `identities` array (no
    // error) when the email is already registered, to avoid leaking which
    // emails exist. Surface that as a real registration failure.
    if (authData.user.identities && authData.user.identities.length === 0) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const needsEmailConfirmation = !authData.session;

    if (needsEmailConfirmation) {
      return { user: mapPendingUserToUser(authData.user, name, username), needsEmailConfirmation: true };
    }

    const user = await this.fetchOrCreateProfile(authData.user.id, email, name, username);
    localStorage.setItem(ROLE_STORAGE_KEY, user.role);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return { user, needsEmailConfirmation: false };
  },

  async loginUser(email: string, password: string): Promise<User> {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      throw new Error('Email and password are required.');
    }

    const { data: authData, error } = await withTimeout(
      supabase.auth.signInWithPassword({ email: trimmedEmail, password }),
      'Sign in is taking longer than expected. Supabase may be experiencing issues right now — please try again in a moment.'
    );

    if (error) {
      throw new Error(mapAuthError(error.message));
    }
    if (!authData.user) {
      throw new Error('Sign in failed. Please try again.');
    }

    const user = await this.fetchOrCreateProfile(authData.user.id, trimmedEmail);
    localStorage.setItem(ROLE_STORAGE_KEY, user.role);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  /**
   * Validates the cached local session against the real Supabase session on
   * app start (and whenever auth state changes), so a stale or forged
   * localStorage entry can never grant access on its own.
   */
  async restoreSession(): Promise<User | null> {
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    if (!session) {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(ROLE_STORAGE_KEY);
      return null;
    }

    const user = await this.fetchOrCreateProfile(session.user.id, session.user.email || '');
    localStorage.setItem(ROLE_STORAGE_KEY, user.role);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  updateUserProfile(updates: Partial<User>): User {
    const current = this.getCurrentUser();
    if (!current) {
      throw new Error('No active session.');
    }
    const updated = { ...current, ...updates };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));

    supabase
      .from('profiles')
      .update({
        name: updated.name,
        username: updated.username,
        avatar: updated.avatar,
        points: updated.points,
        total_solved: updated.totalSolved
      })
      .eq('id', current.id)
      .then(({ error }) => {
        if (error) console.error('Failed to sync profile update to Supabase:', error.message);
      });

    return updated;
  },

  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Supabase sign-out error:', e);
    }
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(ROLE_STORAGE_KEY);
  },

  logoutMock(): void {
    this.logout();
  }
};
