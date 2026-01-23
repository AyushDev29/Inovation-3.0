-- VERIFICATION SYSTEM DATABASE UPDATE
-- Run these queries one by one in Supabase SQL Editor
-- This will NOT delete any existing data, only adds new columns

-- 1. Add verification_status column
ALTER TABLE registrations 
ADD COLUMN verification_status VARCHAR(20) DEFAULT 'pending' 
CHECK (verification_status IN ('pending', 'verified', 'rejected'));

-- 2. Add verification timestamp and admin info columns
ALTER TABLE registrations 
ADD COLUMN verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN verified_by VARCHAR(255),
ADD COLUMN rejection_reason TEXT;

-- 3. Create indexes for better performance
CREATE INDEX idx_registrations_verification_status ON registrations(verification_status);
CREATE INDEX idx_registrations_verified_at ON registrations(verified_at);

-- 4. Update existing registrations to have 'pending' status
UPDATE registrations 
SET verification_status = 'pending' 
WHERE verification_status IS NULL;

-- 5. Add comments for documentation
COMMENT ON COLUMN registrations.verification_status IS 'Status of admin verification: pending, verified, rejected';
COMMENT ON COLUMN registrations.verified_at IS 'Timestamp when verification was completed';
COMMENT ON COLUMN registrations.verified_by IS 'Admin who performed the verification';
COMMENT ON COLUMN registrations.rejection_reason IS 'Reason for rejection (optional)';

-- 6. Verify the changes (optional - to check if everything worked)
SELECT 
    id, 
    name, 
    verification_status, 
    verified_at, 
    verified_by,
    created_at
FROM registrations 
LIMIT 5;