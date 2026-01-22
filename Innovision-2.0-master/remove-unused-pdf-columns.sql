-- ============================================
-- REMOVE UNUSED PDF COLUMNS - OPTIONAL CLEANUP
-- ============================================
-- This script removes the unused individual member PDF columns
-- since we now use only one combined PDF per team
-- 
-- ⚠️  WARNING: This will permanently delete these columns and any data in them
-- Only run this if you're sure you want to remove individual member PDF uploads

-- Step 1: Remove unused PDF columns
ALTER TABLE registrations 
DROP COLUMN IF EXISTS player2_college_id_url,
DROP COLUMN IF EXISTS player3_college_id_url,
DROP COLUMN IF EXISTS player4_college_id_url;

-- Step 2: Verify the columns were removed
SELECT 'REMOVED UNUSED PDF COLUMNS:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'registrations' 
AND column_name LIKE '%college_id_url%'
ORDER BY column_name;

-- Step 3: Check updated table structure
SELECT 'UPDATED REGISTRATIONS TABLE:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;

-- ============================================
-- ✅ CLEANUP COMPLETE
-- ============================================
-- Removed columns:
-- - player2_college_id_url
-- - player3_college_id_url  
-- - player4_college_id_url
-- 
-- Remaining column:
-- - college_id_url (for team combined PDF or individual PDF)
-- ============================================

-- ============================================
-- ALTERNATIVE: KEEP COLUMNS BUT DON'T USE THEM
-- ============================================
-- If you prefer to keep the columns for future use but not use them now,
-- you can skip running this script. The frontend will simply ignore them.
-- This provides flexibility if you later want to switch back to individual PDFs.
-- ============================================