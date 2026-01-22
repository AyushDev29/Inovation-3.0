-- ============================================
-- SIMPLE PAYMENT STATUS UPDATE TEST
-- ============================================
-- This will test if payment status updates work in your database

-- Step 1: Find any registration (doesn't need to be payment-related for testing)
SELECT id, name, email, payment_status, payment_required
FROM registrations 
LIMIT 5;

-- Step 2: Pick one ID from above and test update
-- Replace 'YOUR_ID_HERE' with an actual ID from Step 1
-- UPDATE registrations 
-- SET payment_status = 'verified' 
-- WHERE id = 'YOUR_ID_HERE';

-- Step 3: Check if the update worked
-- SELECT id, name, payment_status 
-- FROM registrations 
-- WHERE id = 'YOUR_ID_HERE';

-- Step 4: If that worked, test with a different status
-- UPDATE registrations 
-- SET payment_status = 'pending' 
-- WHERE id = 'YOUR_ID_HERE';

-- Step 5: Final verification
-- SELECT id, name, payment_status 
-- FROM registrations 
-- WHERE id = 'YOUR_ID_HERE';

SELECT 'TEST READY - Follow steps above with actual IDs' as instruction;