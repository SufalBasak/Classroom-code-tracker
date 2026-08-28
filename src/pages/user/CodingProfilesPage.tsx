import React, { useEffect, useState } from 'react';
import { CodingProfile, PlatformId, User } from '../../types';
import { platformService } from '../../services/platformService';
import { PlatformSyncCard } from '../../components/profiles/PlatformSyncCard';
import { PlatformConnectModal } from '../../components/profiles/PlatformConnectModal';
import { useToast } from '../../components/common/Toast';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export interface CodingProfilesPageProps {
  user: User;
}

export const CodingProfilesPage: React.FC<CodingProfilesPageProps> = ({ user }) => {
  const { showToast } = useToast();
  const [profiles, setProfiles] = useState<CodingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectModalPlatform, setConnectModalPlatform] = useState<PlatformId | null>(null);

  const loadProfiles = async () => {
    const data = await platformService.getProfiles(user.id);
    setProfiles(data);
  };

  useEffect(() => {
    setLoading(true);
    loadProfiles().finally(() => setLoading(false));
  }, [user.id]);

  const handleConnect = async (platform: PlatformId, username: string) => {
    const updated = await platformService.connectAccount(user.id, platform, username);
    setProfiles(updated);
    showToast(`Connected ${platform} account @${username}`, 'success');
  };

  const handleSync = async (platform: PlatformId, username: string) => {
    const updated = await platformService.syncAccount(user.id, platform, username);
    setProfiles(updated);
    showToast(`${platform} stats synced.`, 'success');
  };

  const handleDisconnect = async (platform: PlatformId) => {
    const updated = await platformService.disconnectAccount(user.id, platform);
    setProfiles(updated);
    showToast(`Disconnected ${platform} account.`, 'info');
  };

  return (
    <div className="space-y-6 animate-element">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Connected Coding Accounts</h1>
        <p className="text-sm text-slate-500 mt-1">Connect your public handles on external coding platforms to sync your problem solving progress.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profiles.map((prof) => (
            <PlatformSyncCard
              key={prof.platform}
              profile={prof}
              onOpenConnectModal={(p) => setConnectModalPlatform(p)}
              onSync={handleSync}
              onDisconnect={handleDisconnect}
            />
          ))}
        </div>
      )}

      <PlatformConnectModal
        isOpen={Boolean(connectModalPlatform)}
        platform={connectModalPlatform}
        onClose={() => setConnectModalPlatform(null)}
        onConnect={handleConnect}
      />
    </div>
  );
};
