# College ID Upload - Storage Setup Guide

## Step 1: Run the Database Update

First, run the SQL script in your Supabase SQL Editor:

```sql
-- Add college ID upload fields
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS college_id_url TEXT,
ADD COLUMN IF NOT EXISTS player2_college_id_url TEXT,
ADD COLUMN IF NOT EXISTS player3_college_id_url TEXT,
ADD COLUMN IF NOT EXISTS player4_college_id_url TEXT;
```

## Step 2: Create Storage Bucket (Manual Setup)

1. **Go to Supabase Dashboard**
   - Navigate to your project dashboard
   - Click on **"Storage"** in the left sidebar

2. **Create New Bucket**
   - Click **"New bucket"** button
   - **Bucket name**: `college-ids`
   - **Public bucket**: ❌ **UNCHECK** (keep it private)
   - Click **"Create bucket"**

## Step 3: Set Storage Policies with PDF Restriction

1. **Go to Storage Policies**
   - In Storage section, click on **"Policies"** tab
   - Click **"New policy"** button

2. **Create Upload Policy (PDF Only)**
   - **Policy name**: `Allow authenticated PDF uploads only`
   - **Allowed operation**: `INSERT`
   - **Target roles**: `authenticated`
   - **Policy definition**:
     ```sql
     (auth.role() = 'authenticated') AND 
     (storage.extension(name) = 'pdf')
     ```
   - Click **"Review"** then **"Save policy"**

3. **Create View Policy**
   - Click **"New policy"** button again
   - **Policy name**: `Allow authenticated users to view PDF files`
   - **Allowed operation**: `SELECT`
   - **Target roles**: `authenticated`
   - **Policy definition**:
     ```sql
     (auth.role() = 'authenticated') AND 
     (storage.extension(name) = 'pdf')
     ```
   - Click **"Review"** then **"Save policy"**

4. **Create Update Policy (Optional - for file replacement)**
   - Click **"New policy"** button again
   - **Policy name**: `Allow authenticated PDF updates only`
   - **Allowed operation**: `UPDATE`
   - **Target roles**: `authenticated`
   - **Policy definition**:
     ```sql
     (auth.role() = 'authenticated') AND 
     (storage.extension(name) = 'pdf')
     ```
   - Click **"Review"** then **"Save policy"**

5. **Create Delete Policy (Optional - for admins)**
   - Click **"New policy"** button again
   - **Policy name**: `Allow authenticated users to delete PDF files`
   - **Allowed operation**: `DELETE`
   - **Target roles**: `authenticated`
   - **Policy definition**:
     ```sql
     (auth.role() = 'authenticated') AND 
     (storage.extension(name) = 'pdf')
     ```
   - Click **"Review"** then **"Save policy"**

## Step 4: Verify Setup

1. **Check Bucket**
   - Go back to Storage → Buckets
   - You should see `college-ids` bucket listed
   - It should show as **Private**

2. **Check Policies**
   - Go to Storage → Policies
   - You should see 4 policies for the `college-ids` bucket:
     - Allow authenticated PDF uploads only (INSERT)
     - Allow authenticated users to view PDF files (SELECT)
     - Allow authenticated PDF updates only (UPDATE)
     - Allow authenticated users to delete PDF files (DELETE)

## Step 5: Test Upload (Optional)

You can test the upload functionality by:
1. Going to your registration form
2. Trying to upload a PDF file (should work)
3. Trying to upload a non-PDF file (should be blocked by both frontend and backend)
4. Check if PDF appears in Storage → college-ids bucket

## Policy Explanation

The storage policies now include file type security:

### **File Type Restriction (Server-Side)**
```sql
storage.extension(name) = 'pdf'
```
- Only allows files with `.pdf` extension
- Blocks all other file types at the server level

### **Authentication Requirement**
```sql
auth.role() = 'authenticated'
```
- Only authenticated users can upload/view files
- Prevents anonymous uploads

### **Combined Policy Example**
```sql
(auth.role() = 'authenticated') AND 
(storage.extension(name) = 'pdf')
```
This ensures:
- ✅ User is logged in
- ✅ File is a PDF

### **File Size Restriction (Frontend Only)**
Since Supabase storage policies don't support size validation, file size is enforced in the frontend:
- JavaScript validation: `file.size > 5 * 1024 * 1024`
- This provides immediate user feedback
- 5MB limit is enforced before upload starts

## Step 5: Test Upload (Optional)

You can test the upload functionality by:
1. Going to your registration form
2. Trying to upload a PDF file
3. Check if it appears in Storage → college-ids bucket

## Troubleshooting

### If uploads fail:
1. **Check bucket exists**: Make sure `college-ids` bucket is created
2. **Check policies**: Ensure all 4 policies (INSERT, SELECT, UPDATE, DELETE) are active
3. **Check file type**: Only PDF files are allowed (enforced at server level)
4. **Check file size**: Max 5MB per file (enforced at server level)
5. **Check authentication**: User must be logged in

### If you see "bucket not found" error:
- Double-check the bucket name is exactly `college-ids` (lowercase, with hyphen)
- Make sure the bucket is created in the correct project

### If you see "permission denied" error:
- Check that storage policies are correctly set up with PDF restrictions
- Make sure users are authenticated when uploading
- Verify the file is actually a PDF with correct extension

### If non-PDF files are being uploaded:
- Check that the storage policy includes `storage.extension(name) = 'pdf'`
- Verify the policy is active and applied to the correct bucket

### If large files are being uploaded:
- **Note**: File size validation is handled in the frontend only
- Check that the frontend validation is working: `file.size > 5 * 1024 * 1024`
- Supabase storage policies don't support size restrictions
- Consider implementing server-side size checks in your upload function if needed

## Security Notes

- ✅ Bucket is **private** - files are not publicly accessible
- ✅ Only **authenticated users** can upload files
- ✅ **Server-side PDF validation** - only PDF files accepted at bucket level
- ✅ **Frontend size limit** - 5MB maximum enforced in the UI before upload
- ✅ **Frontend PDF validation** - additional PDF checks in the UI
- ✅ Files are **uniquely named** to prevent conflicts
- ✅ **Layered security** - both frontend validation and backend file type restriction

## Important Notes

- **File Type**: Enforced at both frontend and server level (PDF only)
- **File Size**: Enforced at frontend level only (5MB limit)
- **Authentication**: Required for all operations
- **Privacy**: All files are private and require authentication to access

## File Structure

Uploaded files will be stored as:
```
college-ids/
├── 1642123456789-leader-user@email.com.pdf
├── 1642123456790-member2-user@email.com.pdf
├── 1642123456791-member3-user@email.com.pdf
└── 1642123456792-member4-user@email.com.pdf
```

The naming convention: `{timestamp}-{role}-{email}.pdf`

