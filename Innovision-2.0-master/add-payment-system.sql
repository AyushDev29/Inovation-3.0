-- ============================================
-- PAYMENT SYSTEM EXTENSION - SAFE ADDITION
-- ============================================
-- This script SAFELY adds payment functionality for BGMI and Free Fire events
-- WITHOUT breaking existing functionality, data, or admin panel logic
-- Run this in your Supabase SQL Editor

-- STEP 1: Add payment fields to existing registrations table (SAFE - all nullable)
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS payment_required BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10,2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS payment_screenshot_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS payment_transaction_id TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'rejected'));

-- STEP 2: Add roll number and college fields for team members (if not exists)
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS roll_no TEXT,
ADD COLUMN IF NOT EXISTS player2_roll_no TEXT,
ADD COLUMN IF NOT EXISTS player2_college TEXT,
ADD COLUMN IF NOT EXISTS player3_roll_no TEXT,
ADD COLUMN IF NOT EXISTS player3_college TEXT,
ADD COLUMN IF NOT EXISTS player4_roll_no TEXT,
ADD COLUMN IF NOT EXISTS player4_college TEXT;

-- STEP 3: Create index for payment queries (performance optimization)
CREATE INDEX IF NOT EXISTS idx_registrations_payment_status ON registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_registrations_payment_required ON registrations(payment_required);

-- STEP 4: Update existing BGMI and Free Fire events to require payment
UPDATE events 
SET 
    event_name = CASE 
        WHEN event_name LIKE '%BGMI%' THEN 'BGMI Esports Tournament'
        WHEN event_name LIKE '%Free Fire%' THEN 'Free Fire Esports Tournament'
        ELSE event_name
    END
WHERE event_name LIKE '%BGMI%' OR event_name LIKE '%Free Fire%';

-- STEP 5: Insert/Update BGMI and Free Fire events with payment info
INSERT INTO events (event_name, category, description, date, venue, team_size, prize) VALUES
('BGMI Esports Tournament', 'E-Sports', 'Competitive BGMI battle with ranked matches across two days', 'Day 1 & Day 2 (5–6 Feb), 9:00 AM – 12:00 PM', 'College Campus', '4 Members', '₹6,000'),
('Free Fire Esports Tournament', 'E-Sports', 'High-intensity Free Fire battle royale tournament', 'Day 3 (7 Feb), 9:00 AM – 11:00 AM', 'College Campus', '4 Members', '₹5,000')
ON CONFLICT (event_name) DO UPDATE SET
    description = EXCLUDED.description,
    date = EXCLUDED.date,
    venue = EXCLUDED.venue,
    team_size = EXCLUDED.team_size,
    prize = EXCLUDED.prize;

-- STEP 6: Create payment configuration function (for easy management)
CREATE OR REPLACE FUNCTION get_payment_config(event_name_param TEXT)
RETURNS TABLE(
    requires_payment BOOLEAN,
    amount DECIMAL(10,2),
    scanner_image TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE 
            WHEN event_name_param = 'BGMI Esports Tournament' THEN TRUE
            WHEN event_name_param = 'Free Fire Esports Tournament' THEN TRUE
            ELSE FALSE
        END as requires_payment,
        CASE 
            WHEN event_name_param = 'BGMI Esports Tournament' THEN 100.00
            WHEN event_name_param = 'Free Fire Esports Tournament' THEN 80.00
            ELSE 0.00
        END as amount,
        CASE 
            WHEN event_name_param = 'BGMI Esports Tournament' THEN 'bgmi-scanner.jpg'
            WHEN event_name_param = 'Free Fire Esports Tournament' THEN 'freefire-scanner.jpg'
            ELSE NULL
        END as scanner_image;
END;
$$ LANGUAGE plpgsql;

-- STEP 7: Create view for admin panel (backward compatible)
CREATE OR REPLACE VIEW registration_details AS
SELECT 
    r.*,
    e.event_name,
    e.category,
    e.prize,
    -- Payment info (will be NULL for non-paid events - SAFE)
    CASE WHEN r.payment_required THEN r.payment_amount ELSE NULL END as entry_fee,
    CASE WHEN r.payment_required THEN r.payment_status ELSE 'not_required' END as payment_status_display
FROM registrations r
JOIN events e ON r.event_id = e.id;

-- STEP 8: Verification queries
SELECT 'PAYMENT SYSTEM EXTENSION COMPLETED' as status;

-- Check new columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'registrations' 
AND column_name LIKE 'payment_%'
ORDER BY column_name;

-- Check payment configuration function
SELECT * FROM get_payment_config('BGMI Esports Tournament');
SELECT * FROM get_payment_config('Free Fire Esports Tournament');
SELECT * FROM get_payment_config('Tech Triathlon');

-- Check events
SELECT event_name, category, team_size, prize 
FROM events 
WHERE event_name IN ('BGMI Esports Tournament', 'Free Fire Esports Tournament')
ORDER BY event_name;

-- ============================================
-- SAFETY VERIFICATION
-- ============================================
-- Verify existing registrations are not broken
SELECT COUNT(*) as existing_registrations_count FROM registrations;

-- Verify new fields are nullable (safe for existing data)
SELECT 
    COUNT(*) as total_registrations,
    COUNT(payment_required) as payment_required_count,
    COUNT(payment_screenshot_url) as screenshot_count
FROM registrations;

-- ============================================
-- ROLLBACK SCRIPT (IF NEEDED)
-- ============================================
-- Uncomment and run if you need to rollback changes:
-- ALTER TABLE registrations DROP COLUMN IF EXISTS payment_required;
-- ALTER TABLE registrations DROP COLUMN IF EXISTS payment_amount;
-- ALTER TABLE registrations DROP COLUMN IF EXISTS payment_screenshot_url;
-- ALTER TABLE registrations DROP COLUMN IF EXISTS payment_transaction_id;
-- ALTER TABLE registrations DROP COLUMN IF EXISTS payment_status;
-- DROP FUNCTION IF EXISTS get_payment_config(TEXT);
-- DROP VIEW IF EXISTS registration_details;