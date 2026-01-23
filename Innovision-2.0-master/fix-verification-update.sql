-- Create a database function to handle verification updates reliably
-- Run this in Supabase SQL Editor

CREATE OR REPLACE FUNCTION update_verification_status(
    reg_id UUID,
    new_status VARCHAR(20),
    admin_email VARCHAR(255) DEFAULT NULL,
    reason TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
    updated_record RECORD;
BEGIN
    -- Update the registration with verification status
    UPDATE registrations 
    SET 
        verification_status = new_status,
        verified_at = CASE 
            WHEN new_status != 'pending' THEN NOW() 
            ELSE NULL 
        END,
        verified_by = CASE 
            WHEN new_status != 'pending' THEN COALESCE(admin_email, 'admin') 
            ELSE NULL 
        END,
        rejection_reason = CASE 
            WHEN new_status = 'rejected' THEN reason 
            ELSE NULL 
        END
    WHERE id = reg_id
    RETURNING id, name, verification_status, verified_at, verified_by INTO updated_record;
    
    -- Check if update was successful
    IF updated_record.id IS NULL THEN
        result := json_build_object(
            'success', false,
            'error', 'Registration not found or update failed',
            'registration_id', reg_id
        );
    ELSE
        result := json_build_object(
            'success', true,
            'registration_id', updated_record.id,
            'name', updated_record.name,
            'verification_status', updated_record.verification_status,
            'verified_at', updated_record.verified_at,
            'verified_by', updated_record.verified_by
        );
    END IF;
    
    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_verification_status TO authenticated;

-- Test the function (optional)
-- SELECT update_verification_status('9a3de9ac-7b27-4b8e-a118-09d6f2e695d8', 'verified', 'admin@test.com');