-- ============================================
-- VERIFY PAYMENT DATABASE SETUP
-- ============================================
-- Run this to ensure your database has all payment columns and constraints

-- Step 1: Check if payment columns exist
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'registrations' 
AND column_name LIKE 'payment_%'
ORDER BY column_name;

-- Step 2: Check payment_status constraint (should allow 'pending', 'verified', 'rejected')
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'registrations'::regclass 
AND contype = 'c'
AND pg_get_constraintdef(oid) ILIKE '%payment_status%';

-- Step 3: If columns don't exist, create them
DO $$ 
BEGIN
    -- Add payment columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'registrations' AND column_name = 'payment_required') THEN
        ALTER TABLE registrations ADD COLUMN payment_required BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added payment_required column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'registrations' AND column_name = 'payment_amount') THEN
        ALTER TABLE registrations ADD COLUMN payment_amount DECIMAL(10,2) DEFAULT NULL;
        RAISE NOTICE 'Added payment_amount column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'registrations' AND column_name = 'payment_screenshot_url') THEN
        ALTER TABLE registrations ADD COLUMN payment_screenshot_url TEXT DEFAULT NULL;
        RAISE NOTICE 'Added payment_screenshot_url column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'registrations' AND column_name = 'payment_transaction_id') THEN
        ALTER TABLE registrations ADD COLUMN payment_transaction_id TEXT DEFAULT NULL;
        RAISE NOTICE 'Added payment_transaction_id column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'registrations' AND column_name = 'payment_status') THEN
        ALTER TABLE registrations ADD COLUMN payment_status TEXT DEFAULT 'pending';
        RAISE NOTICE 'Added payment_status column';
    END IF;
END $$;

-- Step 4: Ensure payment_status constraint allows 'verified'
ALTER TABLE registrations 
DROP CONSTRAINT IF EXISTS registrations_payment_status_check;

ALTER TABLE registrations 
ADD CONSTRAINT registrations_payment_status_check 
CHECK (payment_status IN ('pending', 'verified', 'rejected'));

-- Step 5: Test that 'verified' is allowed
-- Create a test record (will be deleted)
INSERT INTO registrations (name, email, phone, class, college, event_id, payment_status) 
VALUES ('TEST_USER', 'test@test.com', '1234567890', 'Test Class', 'Test College', 1, 'verified');

-- Check if the test record was created
SELECT id, name, payment_status 
FROM registrations 
WHERE name = 'TEST_USER';

-- Delete the test record
DELETE FROM registrations WHERE name = 'TEST_USER';

-- Step 6: Final verification
SELECT 'PAYMENT DATABASE SETUP COMPLETE' as status;

-- Show current payment columns
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'registrations' 
AND column_name LIKE 'payment_%'
ORDER BY column_name;

RAISE NOTICE 'Payment database setup verified. Admin panel should work now.';