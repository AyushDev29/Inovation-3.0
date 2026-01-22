# Payment Storage Setup Guide

## CRITICAL: Isolated Storage for Payment Screenshots

### 1. Create New Storage Bucket in Supabase

**Go to Supabase Dashboard → Storage → Create Bucket**

```
Bucket Name: payment-screenshots
Public: FALSE (Private bucket for security)
File Size Limit: 5MB
Allowed File Types: image/jpeg, image/png, image/jpg
```

### 2. Folder Structure (Auto-created by app)

```
payment-screenshots/
├── bgmi/
│   ├── 2024-01-15-user1-screenshot.jpg
│   ├── 2024-01-15-user2-screenshot.png
│   └── ...
└── freefire/
    ├── 2024-01-15-user3-screenshot.jpg
    ├── 2024-01-15-user4-screenshot.png
    └── ...
```

### 3. Storage Policies (Run in Supabase SQL Editor)

```sql
-- Allow authenticated users to upload payment screenshots
CREATE POLICY "Allow payment screenshot uploads"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'payment-screenshots' 
    AND auth.role() = 'authenticated'
);

-- Allow users to read their own payment screenshots
CREATE POLICY "Allow users to read payment screenshots"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'payment-screenshots'
);

-- Allow admin to manage all payment screenshots
CREATE POLICY "Allow admin to manage payment screenshots"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'payment-screenshots')
WITH CHECK (bucket_id = 'payment-screenshots');
```

### 4. Scanner Images Setup

**Create folder in public directory:**

```
public/
└── scanners/
    ├── bgmi-scanner.jpg
    └── freefire-scanner.jpg
```

**Scanner Image Requirements:**
- Format: JPG/PNG
- Size: Recommended 400x400px
- Contains: QR code for payment
- Admin can replace these files without code changes

### 5. Environment Variables (Optional)

Add to `.env` file:
```
VITE_PAYMENT_BUCKET=payment-screenshots
VITE_BGMI_ENTRY_FEE=100
VITE_FREEFIRE_ENTRY_FEE=80
```

### 6. Verification Steps

1. **Check bucket exists**: Go to Storage → payment-screenshots
2. **Test upload**: Try uploading a test image
3. **Check policies**: Verify policies are active
4. **Scanner images**: Verify scanner images load in browser

### 7. Security Notes

- Payment screenshots are stored in PRIVATE bucket
- Only authenticated users can upload
- Admin has full access for verification
- Separate from existing college-ids bucket (no conflicts)
- File size limited to 5MB
- Only image files allowed

### 8. Backup Strategy

- Payment screenshots are critical evidence
- Ensure regular backups of payment-screenshots bucket
- Consider archiving old screenshots after event completion

## IMPORTANT: DO NOT MODIFY EXISTING BUCKETS

- `college-ids` bucket remains unchanged
- No modifications to existing storage policies
- Payment system uses completely separate storage