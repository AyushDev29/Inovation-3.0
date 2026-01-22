-- ============================================
-- FIX SPECIFIC REGISTRATION PAYMENT STATUS
-- ============================================
-- This will fix the payment status for the specific registration

-- Step 1: Find the registration by name (since we can see "aaaaa" in the screenshot)
SELECT 
    id,
    name,
    email,
    payment_status,
    payment_required,
    payment_amount
FROM registrations 
WHERE name = 'aaaaa'
ORDER BY created_at DESC;

-- Step 2: Update the payment status directly
UPDATE registrations 
SET payment_status = 'verified'
WHERE name = 'aaaaa' 
AND payment_required = true;

-- Step 3: Verify the update worked
SELECT 
    id,
    name,
    email,
    payment_status,
    payment_required,
    payment_amount
FROM registrations 
WHERE name = 'aaaaa';

-- Step 4: If there are multiple records, update by specific ID
-- (Replace with the actual ID from Step 1)
-- UPDATE registrations 
-- SET payment_status = 'verified'
-- WHERE id = 'ACTUAL_ID_FROM_STEP_1';

-- Step 5: Final verification
SELECT 
    'PAYMENT STATUS FIXED' as result,
    COUNT(*) as verified_count
FROM registrations 
WHERE name = 'aaaaa' AND payment_status = 'verified';

-- Step 6: Check all payment statuses to ensure consistency
SELECT 
    payment_status,
    COUNT(*) as count
FROM registrations 
WHERE payment_required = true
GROUP BY payment_status;

RAISE NOTICE 'Payment status fix completed. Check admin panel now.';