-- ============================================
-- FIND ROOT CAUSE OF STATUS REVERSION
-- ============================================
-- This will identify what's causing the status to revert

-- Step 1: Check for triggers that might reset payment_status
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement,
    action_condition
FROM information_schema.triggers 
WHERE event_object_table = 'registrations'
ORDER BY trigger_name;

-- Step 2: Check for functions that might be called by triggers
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_definition ILIKE '%payment_status%'
OR routine_definition ILIKE '%registrations%'
ORDER BY routine_name;

-- Step 3: Check for RLS policies that might interfere
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
WHERE tablename = 'registrations'
ORDER BY policyname;

-- Step 4: Check for check constraints on payment_status
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'registrations'::regclass 
AND contype = 'c'
ORDER BY conname;

-- Step 5: Check column defaults and properties
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    is_updatable
FROM information_schema.columns 
WHERE table_name = 'registrations' 
AND column_name = 'payment_status';

-- Step 6: Test direct SQL update to see if it works
-- Find a test record first
SELECT id, name, payment_status 
FROM registrations 
WHERE payment_required = true 
LIMIT 1;

-- Now test update (replace with actual ID from above)
-- UPDATE registrations SET payment_status = 'verified' WHERE id = 'ACTUAL_ID_HERE';
-- SELECT id, name, payment_status FROM registrations WHERE id = 'ACTUAL_ID_HERE';

-- Step 7: Check for any views or materialized views
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name LIKE '%registration%'
ORDER BY table_name;

-- Step 8: Check for foreign key constraints
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'registrations';

SELECT 'ROOT CAUSE ANALYSIS COMPLETE' as status;