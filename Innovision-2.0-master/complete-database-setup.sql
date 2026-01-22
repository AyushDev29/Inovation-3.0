-- ============================================
-- COMPLETE DATABASE SETUP WITH PAYMENT SYSTEM
-- ============================================
-- Run this ENTIRE script in Supabase SQL Editor to fix all database issues

-- STEP 1: Ensure all payment fields exist in registrations table
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS roll_no TEXT,
ADD COLUMN IF NOT EXISTS player2_roll_no TEXT,
ADD COLUMN IF NOT EXISTS player2_college TEXT,
ADD COLUMN IF NOT EXISTS player3_roll_no TEXT,
ADD COLUMN IF NOT EXISTS player3_college TEXT,
ADD COLUMN IF NOT EXISTS player4_roll_no TEXT,
ADD COLUMN IF NOT EXISTS player4_college TEXT,
ADD COLUMN IF NOT EXISTS college_id_url TEXT,
ADD COLUMN IF NOT EXISTS payment_required BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10,2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS payment_screenshot_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS payment_transaction_id TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'rejected'));

-- STEP 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_payment_status ON registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_registrations_payment_required ON registrations(payment_required);
CREATE INDEX IF NOT EXISTS idx_registrations_payment_screenshot ON registrations(payment_screenshot_url) WHERE payment_screenshot_url IS NOT NULL;

-- STEP 3: Update/Insert BGMI and Free Fire events
INSERT INTO events (event_name, category, description, date, venue, team_size, prize) VALUES
('BGMI Esports Tournament', 'E-Sports', 'Competitive BGMI battle with ranked matches', 'Day 1 & Day 2', 'College Campus', '4 Members', '₹6,000'),
('Free Fire Esports Tournament', 'E-Sports', 'High-intensity Free Fire battle royale tournament', 'Day 3', 'College Campus', '4 Members', '₹5,000')
ON CONFLICT (event_name) DO UPDATE SET
    description = EXCLUDED.description,
    date = EXCLUDED.date,
    venue = EXCLUDED.venue,
    team_size = EXCLUDED.team_size,
    prize = EXCLUDED.prize;

-- STEP 4: Fix storage policies for anonymous uploads
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow payment screenshot uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to read payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin to manage payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated PDF uploads only" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to view PDF files" ON storage.objects;

-- Create new policies that allow anonymous uploads
CREATE POLICY "Allow anonymous payment uploads" ON storage.objects
FOR INSERT TO anon, authenticated
WITH CHECK (
    bucket_id = 'payment-screenshots'
);

CREATE POLICY "Allow anonymous college id uploads" ON storage.objects
FOR INSERT TO anon, authenticated
WITH CHECK (
    bucket_id = 'college-ids'
);

CREATE POLICY "Allow authenticated read payment screenshots" ON storage.objects
FOR SELECT TO authenticated
USING (
    bucket_id = 'payment-screenshots'
);

CREATE POLICY "Allow authenticated read college ids" ON storage.objects
FOR SELECT TO authenticated
USING (
    bucket_id = 'college-ids'
);

CREATE POLICY "Allow authenticated manage all storage" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id IN ('payment-screenshots', 'college-ids'))
WITH CHECK (bucket_id IN ('payment-screenshots', 'college-ids'));

-- STEP 5: Create payment configuration function
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
            WHEN event_name_param = 'BGMI Esports Tournament' THEN 'bgmi-scanner.jpeg'
            WHEN event_name_param = 'Free Fire Esports Tournament' THEN 'freefire-scanner.jpeg'
            ELSE NULL
        END as scanner_image;
END;
$$ LANGUAGE plpgsql;

-- STEP 6: Verification queries
SELECT '✅ DATABASE SETUP COMPLETED' as status;

-- Check all required columns exist
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'registrations' 
AND column_name IN (
    'roll_no', 'player2_roll_no', 'player2_college', 'player3_roll_no', 'player3_college', 
    'player4_roll_no', 'player4_college', 'college_id_url',
    'payment_required', 'payment_amount', 'payment_screenshot_url', 
    'payment_transaction_id', 'payment_status'
)
ORDER BY column_name;

-- Check storage buckets exist
SELECT 
    name as bucket_name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE name IN ('payment-screenshots', 'college-ids')
ORDER BY name;

-- Check storage policies
SELECT 
    policyname,
    cmd,
    roles,
    with_check IS NOT NULL as has_with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND (policyname LIKE '%payment%' OR policyname LIKE '%college%' OR policyname LIKE '%anonymous%')
ORDER BY policyname;

-- Check events
SELECT 
    event_name, 
    category, 
    team_size, 
    prize 
FROM events 
WHERE event_name IN ('BGMI Esports Tournament', 'Free Fire Esports Tournament')
ORDER BY event_name;

-- Test payment configuration
SELECT 
    'BGMI Config' as test,
    * 
FROM get_payment_config('BGMI Esports Tournament')
UNION ALL
SELECT 
    'Free Fire Config' as test,
    * 
FROM get_payment_config('Free Fire Esports Tournament');

SELECT '🎯 All systems ready for payment uploads!' as final_status;