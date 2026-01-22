-- ============================================
-- DIAGNOSE REGISTRATION ID ISSUES
-- ============================================
-- Run this in Supabase SQL Editor to check registration data

-- 1. Check all registrations with payment_required = true
SELECT 
    id,
    name,
    email,
    payment_required,
    payment_status,
    payment_amount,
    created_at
FROM registrations 
WHERE payment_required = true
ORDER BY created_at DESC
LIMIT 10;

-- 2. Check data types and constraints
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'registrations' 
AND column_name IN ('id', 'payment_status', 'payment_required')
ORDER BY column_name;

-- 3. Check if there are any registrations at all
SELECT COUNT(*) as total_registrations FROM registrations;

-- 4. Check payment-related registrations specifically
SELECT 
    COUNT(*) as total_with_payment_required,
    COUNT(CASE WHEN payment_status = 'pending' THEN 1 END) as pending_count,
    COUNT(CASE WHEN payment_status = 'verified' THEN 1 END) as verified_count,
    COUNT(CASE WHEN payment_status = 'rejected' THEN 1 END) as rejected_count
FROM registrations 
WHERE payment_required = true;

-- 5. Check events table for BGMI and Free Fire
SELECT id, event_name, category 
FROM events 
WHERE event_name ILIKE '%bgmi%' OR event_name ILIKE '%free fire%'
ORDER BY event_name;

-- 6. Check registrations for BGMI and Free Fire events
SELECT 
    r.id,
    r.name,
    r.email,
    r.payment_status,
    r.payment_required,
    e.event_name
FROM registrations r
JOIN events e ON r.event_id = e.id
WHERE e.event_name ILIKE '%bgmi%' OR e.event_name ILIKE '%free fire%'
ORDER BY r.created_at DESC
LIMIT 5;

-- 7. Test a simple update (replace with actual ID from results above)
-- First, get an ID to test with:
SELECT id, name, payment_status 
FROM registrations 
WHERE payment_required = true 
LIMIT 1;

-- Then test update (UNCOMMENT and replace YOUR_ID_HERE):
-- UPDATE registrations 
-- SET payment_status = 'verified' 
-- WHERE id = 'YOUR_ID_HERE';

-- Verify the update worked:
-- SELECT id, name, payment_status 
-- FROM registrations 
-- WHERE id = 'YOUR_ID_HERE';

SELECT 'DIAGNOSTIC COMPLETE - Check results above' as status;