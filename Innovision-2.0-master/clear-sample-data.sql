-- ============================================
-- CLEAR ALL SAMPLE DATA - USE WITH CAUTION
-- ============================================
-- This script will delete ALL registration data and uploaded files
-- Run this in your Supabase SQL Editor ONLY if you want to start fresh

-- Step 1: Delete all registration records
DELETE FROM registrations;

-- Step 2: Reset the auto-increment ID counter (optional)
-- This makes the next registration start from ID 1 again
ALTER SEQUENCE registrations_id_seq RESTART WITH 1;

-- Step 3: Verify deletion
SELECT 'REGISTRATIONS TABLE CLEARED:' as info;
SELECT COUNT(*) as remaining_records FROM registrations;

-- Step 4: Show table structure is intact
SELECT 'TABLE STRUCTURE PRESERVED:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;

-- ============================================
-- ⚠️  IMPORTANT NOTES:
-- ============================================
-- 1. This will delete ALL registration data permanently
-- 2. This does NOT delete uploaded PDF files from storage
-- 3. Events table and other tables remain untouched
-- 4. Table structure and columns remain intact
-- 5. Only registration records are cleared
-- ============================================

-- ============================================
-- TO ALSO DELETE UPLOADED FILES (OPTIONAL):
-- ============================================
-- If you also want to delete all uploaded PDF files:
-- 1. Go to Supabase Dashboard → Storage
-- 2. Click on "college-ids" bucket
-- 3. Select all files and delete them manually
-- OR run this additional query:

-- DELETE ALL FILES FROM STORAGE (Uncomment if needed):
-- SELECT storage.delete_object('college-ids', name) 
-- FROM storage.objects 
-- WHERE bucket_id = 'college-ids';

-- ============================================
-- VERIFICATION QUERIES:
-- ============================================
-- Run these to verify everything is clean:

SELECT 'FINAL VERIFICATION:' as status;
SELECT 
    'Registrations' as table_name,
    COUNT(*) as record_count 
FROM registrations

UNION ALL

SELECT 
    'Events' as table_name,
    COUNT(*) as record_count 
FROM events;

-- Check if any files remain in storage:
SELECT 
    'Storage Files' as table_name,
    COUNT(*) as file_count 
FROM storage.objects 
WHERE bucket_id = 'college-ids';

-- ============================================
-- ✅ SAFE TO RUN - PRESERVES:
-- ============================================
-- ✅ Events table (all event definitions)
-- ✅ Database structure and columns
-- ✅ Storage bucket and policies
-- ✅ All other tables and configurations
-- 
-- ❌ DELETES:
-- ❌ All registration records
-- ❌ All user submitted data
-- ❌ Optionally: uploaded PDF files
-- ============================================