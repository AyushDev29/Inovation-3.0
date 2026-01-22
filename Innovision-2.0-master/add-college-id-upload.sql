-- ============================================
-- ADD COLLEGE ID UPLOAD FIELDS - SIMPLIFIED
-- ============================================
-- This script adds college ID upload fields for all team members
-- Run this in your Supabase SQL Editor

-- Step 1: Add college ID upload fields
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS college_id_url TEXT,
ADD COLUMN IF NOT EXISTS player2_college_id_url TEXT,
ADD COLUMN IF NOT EXISTS player3_college_id_url TEXT,
ADD COLUMN IF NOT EXISTS player4_college_id_url TEXT;

-- Step 2: Verify the new columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'registrations' 
AND column_name IN (
    'college_id_url', 
    'player2_college_id_url',
    'player3_college_id_url', 
    'player4_college_id_url'
)
ORDER BY column_name;

-- Step 3: Check updated table structure
SELECT 'UPDATED REGISTRATIONS TABLE WITH COLLEGE ID FIELDS:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;

-- ============================================
-- ✅ DATABASE COLUMNS ADDED SUCCESSFULLY
-- ============================================
-- New fields added:
-- - college_id_url (for leader/individual)
-- - player2_college_id_url
-- - player3_college_id_url  
-- - player4_college_id_url
-- 
-- NEXT STEPS (Manual Setup Required):
-- 1. Go to Supabase Dashboard → Storage
-- 2. Create new bucket: 'college-ids'
-- 3. Set bucket as PRIVATE (not public)
-- 4. Add storage policies (see instructions below)
-- ============================================