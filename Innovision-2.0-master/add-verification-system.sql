-- Add verification system to registrations table
-- This adds verification status and admin verification functionality

-- Add verification_status column to registrations table
ALTER TABLE registrations 
ADD COLUMN verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected'));

-- Add verification timestamp and admin info
ALTER TABLE registrations 
ADD COLUMN verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN verified_by VARCHAR(255),
ADD COLUMN rejection_reason TEXT;

-- Create index for better performance on verification queries
CREATE INDEX idx_registrations_verification_status ON registrations(verification_status);
CREATE INDEX idx_registrations_verified_at ON registrations(verified_at);

-- Update existing registrations to have 'pending' status
UPDATE registrations 
SET verification_status = 'pending' 
WHERE verification_status IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN registrations.verification_status IS 'Status of admin verification: pending, verified, rejected';
COMMENT ON COLUMN registrations.verified_at IS 'Timestamp when verification was completed';
COMMENT ON COLUMN registrations.verified_by IS 'Admin who performed the verification';
COMMENT ON COLUMN registrations.rejection_reason IS 'Reason for rejection (optional)';