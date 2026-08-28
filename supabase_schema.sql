-- ====================================================================
-- CODESNAP COMPLETE SUPABASE DATABASE MIGRATION & SEED SCRIPT
-- Copy and paste this complete SQL script into your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/gzvuvbmhlmpvitffgqlq/sql
-- ====================================================================

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  username TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'USER',
  avatar TEXT,
  points INTEGER DEFAULT 0,
  total_solved INTEGER DEFAULT 0,
  joined_course_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure UNIQUE constraint on email if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_email_unique'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- 2. Create Courses Table & Ensure All Columns Exist
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  thumbnail TEXT,
  category TEXT NOT NULL,
  difficulty TEXT DEFAULT 'Easy',
  question_ids TEXT[] DEFAULT '{}',
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safely add missing columns to courses table if it already existed
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'Easy';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS thumbnail TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS question_ids TEXT[] DEFAULT '{}';

-- 3. Create Questions Table & Ensure All Columns Exist
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  platform TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  topic TEXT NOT NULL,
  external_url TEXT NOT NULL,
  status TEXT DEFAULT 'UNSOLVED',
  course_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS course_id TEXT;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'UNSOLVED';

-- 4. Create User Progress Table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  question_id TEXT NOT NULL,
  verified BOOLEAN DEFAULT TRUE,
  solved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- 5. Create Coding Profiles Table
CREATE TABLE IF NOT EXISTS public.coding_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  platform TEXT NOT NULL,
  handle TEXT NOT NULL,
  connected BOOLEAN DEFAULT TRUE,
  solved_count INTEGER DEFAULT 0,
  rating INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- SEED DATA INTO SUPABASE DATABASE
-- ====================================================================

-- Seed Admin Profile: classroomplus07@gmail.com
INSERT INTO public.profiles (id, email, name, username, role, avatar, points, total_solved)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'classroomplus07@gmail.com',
  'Classroom Plus Admin',
  'classroomplus_admin',
  'ADMIN',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  4500,
  340
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = 'ADMIN',
  name = 'Classroom Plus Admin';

-- Seed Courses into Supabase
INSERT INTO public.courses (id, title, slug, description, category, difficulty, thumbnail, question_ids)
VALUES 
(
  'c1',
  'SQL Mastery',
  'sql-mastery',
  '100 carefully selected SQL problems from LeetCode, HackerRank, and Mode Analytics to master databases.',
  'Databases',
  'Easy',
  'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
  ARRAY['q1', 'q2', 'q3', 'q4', 'q5']
),
(
  'c2',
  'DSA 300 Sheet',
  'dsa-300-sheet',
  'The ultimate 300 Data Structures & Algorithms problem sheet for product-based company interview prep.',
  'Data Structures',
  'Medium',
  'https://images.unsplash.com/photo-1516116211223-4c7141097e88?w=600&auto=format&fit=crop&q=80',
  ARRAY['q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12']
),
(
  'c3',
  'Arrays & Strings Fundamentals',
  'arrays-strings-fundamentals',
  'Master two-pointer, sliding window, and string manipulation techniques.',
  'Algorithms',
  'Easy',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
  ARRAY['q6', 'q7', 'q8']
),
(
  'c4',
  'Dynamic Programming Deep Dive',
  'dynamic-programming-deep-dive',
  'From 1D memoization to advanced 2D grid DP problems.',
  'Advanced Algorithms',
  'Hard',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
  ARRAY['q11', 'q12']
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- Seed Sample Questions into Supabase
INSERT INTO public.questions (id, title, description, platform, difficulty, topic, external_url, course_id)
VALUES
('q1', 'Recyclable and Low Fat Products', 'Find the IDs of products that are both low fat and recyclable.', 'LeetCode', 'Easy', 'SQL', 'https://leetcode.com/problems/recyclable-and-low-fat-products/', 'c1'),
('q2', 'Find Customer Referee', 'Find the names of the customer that are not referred by the customer with id = 2.', 'LeetCode', 'Easy', 'SQL', 'https://leetcode.com/problems/find-customer-referee/', 'c1'),
('q3', 'Big Countries', 'Find the name, population, and area of the big countries.', 'LeetCode', 'Easy', 'SQL', 'https://leetcode.com/problems/big-countries/', 'c1'),
('q4', 'Reformat Department Table', 'Reformat the table such that there is a department id column and a revenue column for each month.', 'LeetCode', 'Medium', 'SQL', 'https://leetcode.com/problems/reformat-department-table/', 'c1'),
('q5', 'Nth Highest Salary', 'Write a solution to find the nth highest salary from the Employee table.', 'LeetCode', 'Medium', 'SQL', 'https://leetcode.com/problems/nth-highest-salary/', 'c1'),
('q6', 'Two Sum', 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', 'LeetCode', 'Easy', 'Arrays', 'https://leetcode.com/problems/two-sum/', 'c2'),
('q7', 'Best Time to Buy and Sell Stock', 'You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.', 'LeetCode', 'Easy', 'Arrays', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', 'c2'),
('q8', 'Contains Duplicate', 'Given an integer array nums, return true if any value appears at least twice in the array.', 'LeetCode', 'Easy', 'Arrays', 'https://leetcode.com/problems/contains-duplicate/', 'c2'),
('q9', 'Product of Array Except Self', 'Return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].', 'LeetCode', 'Medium', 'Arrays', 'https://leetcode.com/problems/product-of-array-except-self/', 'c2'),
('q10', 'Maximum Subarray', 'Find the subarray with the largest sum, and return its sum.', 'LeetCode', 'Medium', 'Arrays', 'https://leetcode.com/problems/maximum-subarray/', 'c2'),
('q11', 'Climbing Stairs', 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps.', 'LeetCode', 'Easy', 'Dynamic Programming', 'https://leetcode.com/problems/climbing-stairs/', 'c4'),
('q12', 'Coin Change', 'Return the fewest number of coins that you need to make up that amount.', 'LeetCode', 'Medium', 'Dynamic Programming', 'https://leetcode.com/problems/coin-change/', 'c4')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  external_url = EXCLUDED.external_url;

-- Trigger Function for New User Registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, username, role, avatar)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    CASE WHEN lower(NEW.email) = 'classroomplus07@gmail.com' THEN 'ADMIN' ELSE 'USER' END,
    COALESCE(NEW.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    username = EXCLUDED.username,
    role = CASE WHEN lower(EXCLUDED.email) = 'classroomplus07@gmail.com' THEN 'ADMIN' ELSE 'USER' END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Disable RLS for unrestricted full-stack database access
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_profiles DISABLE ROW LEVEL SECURITY;
