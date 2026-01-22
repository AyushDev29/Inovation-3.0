# Payment Upload Troubleshooting Guide

## Issue: "Failed to upload payment screenshot. Please try again."

### Quick Fixes Applied ✅

1. **Enhanced Error Handling**: Added fallback to `college-ids` bucket if `payment-screenshots` bucket doesn't exist
2. **Mobile-Friendly File Input**: Added `capture="environment"` for better mobile camera access
3. **Better File Validation**: More specific image type validation and error messages
4. **Automatic Bucket Creation**: Code now attempts to create the bucket if it doesn't exist

### Root Causes & Solutions

#### 1. Missing Storage Bucket
**Problem**: `payment-screenshots` bucket doesn't exist in Supabase
**Solution**: 
- Code now automatically creates the bucket
- Falls back to `college-ids` bucket with `payments/` prefix if creation fails

#### 2. Missing Storage Policies
**Problem**: Bucket exists but lacks proper access policies
**Solution**: 
- Run `create-payment-bucket-policies.sql` in Supabase SQL Editor
- Or manually create policies in Supabase Dashboard → Storage → Policies

#### 3. Mobile File Handling Issues
**Problem**: Mobile devices have different file handling behavior
**Solution**: 
- Added `capture="environment"` to use rear camera
- Specific MIME type validation: `image/jpeg,image/jpg,image/png`
- Better error messages for mobile users

#### 4. File Size/Type Issues
**Problem**: Invalid files or oversized files
**Solution**: 
- Minimum file size check (1KB) to prevent corrupted files
- Maximum file size limit (5MB)
- Specific image format validation
- File name length validation for mobile compatibility

### Manual Setup (If Automatic Creation Fails)

#### Step 1: Create Bucket in Supabase Dashboard
1. Go to Supabase Dashboard → Storage
2. Click "New bucket"
3. Name: `payment-screenshots`
4. Public: **FALSE** (keep private)
5. Click "Create bucket"

#### Step 2: Set Storage Policies
Run this in Supabase SQL Editor:
```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow payment screenshot uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'payment-screenshots' AND auth.role() = 'authenticated');

-- Allow users to read (for admin verification)
CREATE POLICY "Allow users to read payment screenshots" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'payment-screenshots');
```

### Testing the Fix

#### Test on Mobile Device:
1. Open the registration form on mobile
2. Try to upload a payment screenshot
3. Check browser console for any errors
4. Verify file appears in Supabase Storage

#### Test Different File Types:
- ✅ JPG/JPEG files should work
- ✅ PNG files should work
- ❌ Other formats should show error message

#### Test File Sizes:
- ✅ Files under 5MB should work
- ❌ Files over 5MB should show error message
- ❌ Very small files (under 1KB) should show error message

### Fallback Behavior

If `payment-screenshots` bucket is unavailable, the system will:
1. Attempt to create the bucket automatically
2. If creation fails, upload to `college-ids` bucket with path:
   - BGMI: `payments/bgmi/{timestamp}-{email}.{ext}`
   - Free Fire: `payments/freefire/{timestamp}-{email}.{ext}`

### Monitoring & Debugging

#### Check Browser Console:
- Look for "Payment screenshot selected:" logs
- Check for any storage-related errors
- Verify file properties (name, size, type)

#### Check Supabase Logs:
- Go to Supabase Dashboard → Logs
- Filter by "storage" to see upload attempts
- Look for authentication or permission errors

#### Verify in Database:
```sql
-- Check recent registrations with payment screenshots
SELECT 
    name, 
    email, 
    payment_screenshot_url, 
    payment_status,
    created_at
FROM registrations 
WHERE payment_screenshot_url IS NOT NULL 
ORDER BY created_at DESC 
LIMIT 10;
```

### Common Error Messages & Solutions

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Please upload only JPG, JPEG, or PNG images" | Wrong file type | Use camera or select image file |
| "File size must be less than 5MB" | File too large | Compress image or take new photo |
| "File appears to be corrupted or too small" | Invalid/empty file | Take new screenshot |
| "Storage service unavailable" | Supabase connection issue | Check internet, try again |
| "Failed to upload payment screenshot" | Bucket/policy issue | Check bucket exists and policies are set |

### Prevention Tips for Users

1. **Use Mobile Camera**: Tap the upload button and select "Camera" to take a fresh screenshot
2. **Clear Screenshots**: Ensure payment confirmation is clearly visible
3. **Good Lighting**: Take screenshots in good lighting for better file quality
4. **Stable Connection**: Ensure stable internet connection during upload
5. **File Size**: If screenshot is too large, use phone's built-in image compression

### Admin Verification

Admins can verify payment screenshots in:
1. **Admin Panel**: View uploaded screenshots directly
2. **Supabase Storage**: Browse `payment-screenshots` or `college-ids/payments/` folders
3. **Database**: Check `payment_screenshot_url` field in registrations table

### Support Contact

If users continue to face issues:
1. Ask them to try on different device/browser
2. Check if they can upload other files (college ID)
3. Verify their internet connection
4. Check Supabase service status
5. Review server logs for specific error details

---

**Last Updated**: January 2025
**Status**: ✅ Fixed with fallback mechanisms and enhanced validation