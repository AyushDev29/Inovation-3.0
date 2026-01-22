-- ============================================
-- FIX PAYMENT STATUS PERSISTENCE ISSUES
-- ============================================
-- Run this in Supabase SQL Editor to fix payment status reversion

-- 1. Check if updated_at column exists and add it if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'registrations' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE registrations ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column to registrations table';
    ELSE
        RAISE NOTICE 'updated_at column already exists';
    END IF;
END $$;

-- 2. Create or replace trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_registrations_updated_at ON registrations;

-- Create new trigger
CREATE TRIGGER update_registrations_updated_at
    BEFORE UPDATE ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 3. Check for any conflicting triggers that might reset payment_status
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'registrations'
AND action_statement ILIKE '%payment_status%';

-- 4. Ensure payment_status constraint is correct
ALTER TABLE registrations 
DROP CONSTRAINT IF EXISTS registrations_payment_status_check;

ALTER TABLE registrations 
ADD CONSTRAINT registrations_payment_status_check 
CHECK (payment_status IN ('pending', 'verified', 'rejected'));

-- 5. Create index for better performance on payment status queries
CREATE INDEX IF NOT EXISTS idx_registrations_payment_status_updated 
ON registrations(payment_status, updated_at);

-- 6. Test payment status update (replace with actual registration ID)
-- First find a test registration:
SELECT id, name, payment_status, payment_required 
FROM registrations 
WHERE payment_required = true 
LIMIT 1;

-- 7. Create a function to safely update payment status
CREATE OR REPLACE FUNCTION update_payment_status_safe(
    registration_id UUID,
    new_status TEXT
) RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    old_status TEXT,
    new_status_result TEXT
) AS $$
DECLARE
    old_payment_status TEXT;
    updated_payment_status TEXT;
BEGIN
    -- Get current status
    SELECT payment_status INTO old_payment_status
    FROM registrations 
    WHERE id = registration_id;
    
    IF old_payment_status IS NULL THEN
        RETURN QUERY SELECT FALSE, 'Registration not found', NULL::TEXT, NULL::TEXT;
        RETURN;
    END IF;
    
    -- Validate new status
    IF new_status NOT IN ('pending', 'verified', 'rejected') THEN
        RETURN QUERY SELECT FALSE, 'Invalid status value', old_payment_status, NULL::TEXT;
        RETURN;
    END IF;
    
    -- Update the status
    UPDATE registrations 
    SET payment_status = new_status,
        updated_at = NOW()
    WHERE id = registration_id;
    
    -- Verify the update
    SELECT payment_status INTO updated_payment_status
    FROM registrations 
    WHERE id = registration_id;
    
    IF updated_payment_status = new_status THEN
        RETURN QUERY SELECT TRUE, 'Status updated successfully', old_payment_status, updated_payment_status;
    ELSE
        RETURN QUERY SELECT FALSE, 'Status update failed - value reverted', old_payment_status, updated_payment_status;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 8. Test the safe update function (uncomment and replace with actual ID)
-- SELECT * FROM update_payment_status_safe('YOUR_REGISTRATION_ID_HERE', 'verified');

-- 9. Check RLS policies that might interfere
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
AND (qual ILIKE '%payment_status%' OR with_check ILIKE '%payment_status%');

-- 10. Verification queries
SELECT 'PAYMENT STATUS FIX COMPLETED' as status;

-- Check the updated_at column
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'registrations' 
AND column_name = 'updated_at';

-- Check triggers
SELECT trigger_name, event_manipulation, action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'registrations';

-- Check constraints
SELECT conname as constraint_name, pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'registrations'::regclass 
AND contype = 'c'
AND pg_get_constraintdef(oid) ILIKE '%payment_status%';

RAISE NOTICE 'Payment status persistence fix completed. Test the admin panel now.';