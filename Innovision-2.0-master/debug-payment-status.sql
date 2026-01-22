-- DEBUG PAYMENT STATUS UPDATE ISSUES
-- Run this in Supabase SQL Editor to identify the problem

-- 1. Check current payment status values and constraints
SELECT 
    id, 
    name, 
    email, 
    payment_status, 
    payment_required,
    created_at
FROM registrations 
WHERE payment_required = true
ORDER BY created_at DESC
LIMIT 10;

-- 2. Check if there are any triggers on the registrations table
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'registrations';

-- 3. Check payment_status column constraints
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'registrations' 
AND column_name = 'payment_status';

-- 4. Check for check constraints on payment_status
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'registrations'::regclass 
AND contype = 'c'
AND pg_get_constraintdef(oid) LIKE '%payment_status%';

-- 5. Test manual update (replace ID with actual registration ID)
-- First, find a registration ID:
SELECT id, name, payment_status 
FROM registrations 
WHERE payment_required = true 
LIMIT 1;

-- Then test update (UNCOMMENT and replace YOUR_ID):
-- UPDATE registrations 
-- SET payment_status = 'verified' 
-- WHERE id = YOUR_ID;

-- Verify the update:
-- SELECT id, name, payment_status, updated_at
-- FROM registrations 
-- WHERE id = YOUR_ID;

-- 6. Check if RLS (Row Level Security) is enabled
SELECT schemaname, tablename, rowsecurity, forcerowsecurity
FROM pg_tables 
WHERE tablename = 'registrations';

-- 7. Check RLS policies if enabled
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'registrations';

-- 8. Check if there are any functions/triggers that might reset the status
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_definition ILIKE '%payment_status%'
OR routine_definition ILIKE '%registrations%';