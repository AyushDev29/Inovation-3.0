-- Remove All Rejected Registrations from Database
-- WARNING: This will permanently delete all rejected registration data
-- Run this in Supabase SQL Editor

-- First, let's see what we're about to delete (optional check)
SELECT 
    r.id,
    r.name,
    r.email,
    e.event_name,
    r.verification_status,
    r.created_at
FROM registrations r
JOIN events e ON r.event_id = e.id
WHERE r.verification_status = 'rejected'
ORDER BY e.event_name, r.created_at;

-- Show count of rejected registrations by event
SELECT 
    e.event_name,
    COUNT(*) as rejected_count
FROM registrations r
JOIN events e ON r.event_id = e.id
WHERE r.verification_status = 'rejected'
GROUP BY e.event_name
ORDER BY rejected_count DESC;

-- DANGER ZONE: Uncomment the line below to actually delete rejected registrations
-- DELETE FROM registrations WHERE verification_status = 'rejected';

-- After deletion, verify the cleanup (uncomment after running delete)
-- SELECT 
--     e.event_name,
--     COUNT(*) as total_registrations,
--     COUNT(CASE WHEN r.verification_status = 'pending' THEN 1 END) as pending_count,
--     COUNT(CASE WHEN r.verification_status = 'verified' THEN 1 END) as verified_count,
--     COUNT(CASE WHEN r.verification_status = 'rejected' THEN 1 END) as rejected_count
-- FROM events e
-- LEFT JOIN registrations r ON e.id = r.event_id
-- GROUP BY e.id, e.event_name
-- ORDER BY e.event_name;

-- INSTRUCTIONS:
-- 1. First run the SELECT queries above to see what will be deleted
-- 2. If you're sure, uncomment the DELETE line and run it
-- 3. Then run the final verification query to confirm cleanup