-- ============================================
-- ADD ROLL NUMBER AND COLLEGE FIELDS FOR ALL TEAM MEMBERS
-- ============================================
-- This script adds roll number and college fields for all team members
-- Run this in your Supabase SQL Editor

-- Step 1: Add roll number field for leader
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS roll_no TEXT;

-- Step 2: Add college fields for all team members
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS player2_roll_no TEXT,
ADD COLUMN IF NOT EXISTS player2_college TEXT,
ADD COLUMN IF NOT EXISTS player3_roll_no TEXT,
ADD COLUMN IF NOT EXISTS player3_college TEXT,
ADD COLUMN IF NOT EXISTS player4_roll_no TEXT,
ADD COLUMN IF NOT EXISTS player4_college TEXT;

-- Step 3: Verify the new columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'registrations' 
AND column_name IN (
    'roll_no', 
    'player2_roll_no', 'player2_college',
    'player3_roll_no', 'player3_college', 
    'player4_roll_no', 'player4_college'
)
ORDER BY column_name;

-- Step 4: Check current table structure
SELECT 'UPDATED REGISTRATIONS TABLE STRUCTURE:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;

-- ============================================
-- ✅ DATABASE SCHEMA UPDATED
-- ============================================
-- New fields added:
-- - roll_no (for leader/individual)
-- - player2_roll_no, player2_college
-- - player3_roll_no, player3_college  
-- - player4_roll_no, player4_college
-- ============================================