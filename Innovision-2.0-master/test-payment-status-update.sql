-- Test payment status update functionality
-- Run this in Supabase SQL Editor to debug the issue

-- 1. Check current payment status values
SELECT id, name, email, payment_status, payment_required, payment_amount 
FROM registrations 
WHERE payment_required = true
ORDER BY created_at DESC;

-- 2. Check if payment_status column has constraints
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'registrations' 
AND column_name = 'payment_status';

-- 3. Check if there are any check constraints on payment_status
SELECT conname, consrc 
FROM pg_constraint 
WHERE conrelid = 'registrations'::regclass 
AND contype = 'c';

-- 4. Test manual update (replace 'YOUR_REGISTRATION_ID' with actual ID)
-- UPDATE registrations 
-- SET payment_status = 'verified' 
-- WHERE id = YOUR_REGISTRATION_ID;

-- 5. Verify the update worked
-- SELECT id, name, payment_status 
-- FROM registrations 
-- WHERE id = YOUR_REGISTRATION_ID;