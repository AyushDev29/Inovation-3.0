-- Remove all rejected registrations from the database
-- This query will permanently delete all registrations with verification_status = 'rejected'
-- Run this in Supabase SQL Editor

-- First, let's see how many rejected registrations we have
SELECT 
    event_name,
    COUNT(*) as rejected_count
FROM registrations 
WHERE verification_status = 'rejected'
GROUP BY event_name
ORDER BY event_name;

-- Remove all rejected registrations
DELETE FROM registrations 
WHERE verification_status = 'rejected';

-- Verify the deletion
SELECT 
    event_name,
    verification_status,
    COUNT(*) as count
FROM registrations 
GROUP BY event_name, verification_status
ORDER BY event_name, verification_status;