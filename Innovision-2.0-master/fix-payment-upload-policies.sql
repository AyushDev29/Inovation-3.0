-- Fix Payment Upload Policies for Anonymous Users
-- Run this in Supabase SQL Editor to allow anonymous uploads

-- 1. Check current policies
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

-- 2. Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow payment screenshot uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to read payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin to manage payment screenshots" ON storage.objects;

-- 3. Create new policies that allow anonymous uploads
-- Allow anonymous users to upload payment screenshots
CREATE POLICY "Allow anonymous payment uploads" ON storage.objects
FOR INSERT TO anon, authenticated
WITH CHECK (
    bucket_id = 'payment-screenshots'
);

-- Allow authenticated users to read payment screenshots (for admin)
CREATE POLICY "Allow authenticated read payment screenshots" ON storage.objects
FOR SELECT TO authenticated
USING (
    bucket_id = 'payment-screenshots'
);

-- Allow authenticated users to manage payment screenshots (for admin)
CREATE POLICY "Allow authenticated manage payment screenshots" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'payment-screenshots')
WITH CHECK (bucket_id = 'payment-screenshots');

-- 4. Verify the new policies
SELECT 
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%payment%'
ORDER BY policyname;