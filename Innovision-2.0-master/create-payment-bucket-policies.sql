-- Create Payment Screenshots Bucket Policies
-- Run this in Supabase SQL Editor if payment-screenshots bucket exists but uploads fail

-- 1. Allow authenticated users to upload payment screenshots
CREATE POLICY "Allow payment screenshot uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'payment-screenshots' 
    AND auth.role() = 'authenticated'
);

-- 2. Allow users to read payment screenshots (for admin verification)
CREATE POLICY "Allow users to read payment screenshots" ON storage.objects
FOR SELECT TO authenticated
USING (
    bucket_id = 'payment-screenshots'
);

-- 3. Allow admin to manage all payment screenshots
CREATE POLICY "Allow admin to manage payment screenshots" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'payment-screenshots')
WITH CHECK (bucket_id = 'payment-screenshots');

-- 4. Create index for better performance on payment queries
CREATE INDEX IF NOT EXISTS idx_registrations_payment_screenshot 
ON registrations(payment_screenshot_url) 
WHERE payment_screenshot_url IS NOT NULL;

-- 5. Verify the policies were created
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
WHERE tablename = 'objects' 
AND policyname LIKE '%payment%';