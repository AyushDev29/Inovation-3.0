-- ============================================
-- COMPLETE PAYMENT STATUS DEBUG
-- ============================================
-- This will find the EXACT issue with payment status updates

-- Step 1: Find the specific registration that's having issues
-- Look for the registration with ID: cc4b1183-810d-4ae4-a92c-ac29d0c497df
SELECT 
    id,
    name,
    email,
    payment_status,
    payment_required,
    payment_amount,
    created_at,
    updated_at
FROM registrations 
WHERE id = 'cc4b1183-810d-4ae4-a92c-ac29d0c497df';

-- Step 2: Check if this ID exists at all
SELECT COUNT(*) as record_exists 
FROM registrations 
WHERE id = 'cc4b1183-810d-4ae4-a92c-ac29d0c497df';

-- Step 3: Find all BGMI registrations to see the correct IDs
SELECT 
    r.id,
    r.name,
    r.email,
    r.payment_status,
    r.payment_required,
    e.event_name
FROM registrations r
JOIN events e ON r.event_id = e.id
WHERE e.event_name ILIKE '%bgmi%'
ORDER BY r.created_at DESC;

-- Step 4: Test update on the actual registration
-- First, get the correct ID from Step 3 results
-- Then uncomment and run this update:

-- UPDATE registrations 
-- SET payment_status = 'verified' 
-- WHERE name = 'aaaaa' AND payment_required = true;

-- Step 5: Verify the update worked
-- SELECT id, name, payment_status, payment_required
-- FROM registrations 
-- WHERE name = 'aaaaa';

-- Step 6: Check for any triggers or policies that might reset the status
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'registrations';

-- Step 7: Check RLS policies
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'registrations';

-- Step 8: Check if there are multiple records with same name
SELECT 
    id,
    name,
    email,
    payment_status,
    created_at
FROM registrations 
WHERE name = 'aaaaa'
ORDER BY created_at DESC;

SELECT 'DEBUG COMPLETE - Check results above to find the issue' as status;