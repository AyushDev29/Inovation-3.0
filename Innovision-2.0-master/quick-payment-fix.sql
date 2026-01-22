-- ============================================
-- QUICK PAYMENT STATUS FIX - NO UPDATED_AT REQUIRED
-- ============================================
-- Run this in Supabase SQL Editor to ensure payment status updates work

-- 1. Verify payment_status column exists and has correct constraint
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'registrations' 
AND column_name = 'payment_status';

-- 2. Ensure payment_status constraint is correct
ALTER TABLE registrations 
DROP CONSTRAINT IF EXISTS registrations_payment_status_check;

ALTER TABLE registrations 
ADD CONSTRAINT registrations_payment_status_check 
CHECK (payment_status IN ('pending', 'verified', 'rejected'));

-- 3. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_payment_status 
ON registrations(payment_status);

-- 4. Test payment status update (find a test registration first)
SELECT id, name, payment_status, payment_required 
FROM registrations 
WHERE payment_required = true 
LIMIT 3;

-- 5. Create a simple function to safely update payment status
CREATE OR REPLACE FUNCTION update_payment_status_simple(
    registration_id UUID,
    new_status TEXT
) RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    current_status TEXT
) AS $$
DECLARE
    updated_status TEXT;
BEGIN
    -- Validate new status
    IF new_status NOT IN ('pending', 'verified', 'rejected') THEN
        RETURN QUERY SELECT FALSE, 'Invalid status value', NULL::TEXT;
        RETURN;
    END IF;
    
    -- Update the status
    UPDATE registrations 
    SET payment_status = new_status
    WHERE id = registration_id;
    
    -- Check if update was successful
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'Registration not found', NULL::TEXT;
        RETURN;
    END IF;
    
    -- Get the updated status
    SELECT payment_status INTO updated_status
    FROM registrations 
    WHERE id = registration_id;
    
    RETURN QUERY SELECT TRUE, 'Status updated successfully', updated_status;
END;
$$ LANGUAGE plpgsql;

-- 6. Check for any RLS policies that might interfere
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'registrations'
AND (qual ILIKE '%payment_status%' OR with_check ILIKE '%payment_status%');

-- 7. Verification
SELECT 'QUICK PAYMENT FIX COMPLETED' as status;

-- Test the function (uncomment and replace with actual ID to test)
-- SELECT * FROM update_payment_status_simple('YOUR_REGISTRATION_ID_HERE', 'verified');

RAISE NOTICE 'Quick payment status fix completed. Admin panel should work now.';