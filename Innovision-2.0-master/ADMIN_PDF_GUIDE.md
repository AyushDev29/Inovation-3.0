# Admin Panel - PDF Viewing Guide

## 🎯 New PDF Viewing Features

The Admin Panel now includes comprehensive PDF viewing functionality for college ID verification with a **single combined PDF per team**.

## 📊 Dashboard Overview

### **Enhanced Statistics**
- **Total Registrations**: All registered participants
- **PDFs Uploaded**: Count of registrations with PDF uploaded (one per team/individual)
- **Team Events**: BGMI, Free Fire, Hackastra, Fun Fusion, Fashion Flex
- **Individual Events**: Tech Triathlon and other solo events

## 👁️ PDF Viewing Features

### **For Individual Events (Tech Triathlon)**
- **Upload Status**: Shows ✓ (uploaded) or ✗ (not uploaded) next to participant name
- **View Button**: Blue "View" button appears for uploaded PDFs
- **Quick Access**: Click to instantly view the college ID document

### **For Team Events (BGMI, Free Fire, etc.)**
1. **Team Leader uploads ONE PDF** containing all team members' college IDs
2. **Click "Team" button** to expand team details
3. **Single "View Team PDFs" button** at the top shows the combined PDF
4. **All team member information** displayed without individual PDF buttons
5. **One PDF contains**: Leader + Member 2 + Member 3 + Member 4 college IDs

## 🔒 Security Features

### **Private File Access**
- All PDFs are stored in **private storage bucket**
- **Signed URLs** generated for secure access (1-hour expiry)
- **Authentication required** - only logged-in admins can view
- **No direct file access** - files cannot be accessed without proper authentication

### **PDF Viewer Modal**
- **Full-screen viewing** with embedded PDF viewer
- **Easy navigation** with close button (X)
- **Loading indicators** for smooth user experience
- **Responsive design** works on desktop and mobile

## 📋 How to Use

### **Step 1: Login to Admin Panel**
- Use your admin credentials
- Access the registration dashboard

### **Step 2: View Individual Event PDFs**
- Look for participants with ✓ next to their name
- Click the blue "View" button to open PDF

### **Step 3: View Team Event PDFs**
- Click the "Team" button to expand team details
- Look for "Team College IDs: ✓ Uploaded" status at the top
- Click "View Team PDFs" button to open the combined PDF
- Review all team members' college IDs in one document

### **Step 4: PDF Verification**
- PDF opens in full-screen modal
- **For teams**: Combined PDF contains all members' college IDs
- **For individuals**: Single college ID document
- Verify student details match registration
- Close modal when done reviewing

## 📈 Excel Export Enhancement

The Excel export now includes simplified PDF upload status:
- **Individual Events**: "College ID" column shows "Uploaded" or "Not Uploaded"
- **Team Events**: "Team College IDs" column shows upload status for the combined PDF
- **Cleaner format**: No separate columns for each member's PDF status

## 🚨 Troubleshooting

### **If PDF doesn't load:**
1. Check internet connection
2. Ensure file was properly uploaded during registration
3. Try refreshing the page
4. Contact technical support if issue persists

### **If "View Team PDFs" button is missing:**
- This means no combined PDF was uploaded for the team
- Team leader needs to re-register with combined PDF upload
- Check the upload status indicator (✗ Not Uploaded)

### **If signed URL expires:**
- Close and reopen the PDF viewer
- New signed URL will be generated automatically
- Each URL is valid for 1 hour

## 🔧 Technical Details

### **File Storage**
- **Bucket**: `college-ids` (private)
- **File naming**: `{timestamp}-team-{email}.pdf` (for teams) or `{timestamp}-{email}.pdf` (for individuals)
- **Access method**: Signed URLs with 1-hour expiry
- **File types**: PDF only (enforced at server level)
- **Size limit**: 5MB maximum (enforced at frontend)

### **Team PDF Requirements**
- **One PDF per team** containing all members' college IDs
- **Team leader** is responsible for uploading the combined PDF
- **All team members' IDs** should be included in the single document
- **Clear organization** recommended (e.g., one page per member)

### **Security Policies**
- ✅ Authentication required for all operations
- ✅ PDF file type restriction at server level
- ✅ Private bucket - no public access
- ✅ Signed URLs for temporary secure access

## 📞 Support

If you encounter any issues with PDF viewing:
1. Check that the storage bucket `college-ids` exists
2. Verify storage policies are properly configured
3. Ensure admin authentication is working
4. Contact technical support for assistance

---

**Note**: This feature requires proper Supabase storage setup as outlined in `STORAGE_SETUP_GUIDE.md`. The system now uses a simplified approach with one PDF per team containing all members' college IDs.