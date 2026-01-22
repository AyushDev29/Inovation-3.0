-- Complete Payment Bucket Setup
-- Run this in Supabase SQL Editor to fix payment upload issues

-- 1. First, let's check if the bucket exists
SELECT name, id, public FROM storage.buckets WHERE name = 'payment-screenshots';

-- 2. If the bucket doesn't exist, we need to create it manually in the Supabase Dashboard
-- Go to Storage > Create Bucket > Name: payment-screenshots, Public: FALSE

-- 3. Create storage policies for payment-screenshots bucket
-- Delete existing policies first (if any)
DROP POLICY IF EXISTS "Allow payment screenshot uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to read payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin to manage payment screenshots" ON storage.objects;

-- 4. Create new policies
CREATE POLICY "Allow payment screenshot uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'payment-screenshots' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow users to read payment screenshots" ON storage.objects
FOR SELECT TO authenticated
USING (
    bucket_id = 'payment-screenshots'
);

CREATE POLICY "Allow admin to manage payment screenshots" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'payment-screenshots')
WITH CHECK (bucket_id = 'payment-screenshots');

-- 5. Also create policies for college-ids bucket (fallback)
CREATE POLICY IF NOT EXISTS "Allow payment uploads to college-ids" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'college-ids' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = 'payments'
);

-- 6. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_payment_screenshot 
ON registrations(payment_screenshot_url) 
WHERE payment_screenshot_url IS NOT NULL;

-- 7. Verify setup
SELECT 
    'Buckets' as type,
    name,
    public::text as details
FROM storage.buckets 
WHERE name IN ('payment-screenshots', 'college-ids')

UNION ALL

SELECT 
    'Policies' as type,
    policyname as name,
    cmd as details
FROM pg_policies 
WHERE tablename = 'objects' 
AND (policyname LIKE '%payment%' OR policyname LIKE '%college%')
ORDER BY type, name;