# 🧹 Clear Database for Production - Complete Guide

## ⚠️ **CRITICAL WARNING**
**This guide will DELETE ALL test data and files. Only run this when you're ready to go live with the official event!**

---

## 📋 **Pre-Cleanup Checklist**

Before clearing data, ensure:
- [ ] Payment system is working correctly
- [ ] Admin panel is functioning
- [ ] All registration forms are tested
- [ ] Scanner QR codes are correct
- [ ] Backup any important test data (if needed)

---

## 🗃️ **Step 1: Clear Database Tables**

### **Run in Supabase SQL Editor:**

```sql
-- ============================================
-- CLEAR ALL TEST DATA FOR PRODUCTION
-- ============================================

-- 1. Show current data count (for reference)
SELECT 
    'Before Cleanup' as status,
    (SELECT COUNT(*) FROM registrations) as total_registrations,
    (SELECT COUNT(*) FROM events) as total_events;

-- 2. Delete all test registrations
DELETE FROM registrations;

-- 3. Reset auto-increment sequences (optional)
-- This ensures new registrations start with clean IDs
ALTER SEQUENCE IF EXISTS registrations_id_seq RESTART WITH 1;

-- 4. Keep events but reset to official events only
DELETE FROM events;

-- 5. Insert official events for production
INSERT INTO events (event_name, category, description, date, venue, team_size, prize) VALUES
('BGMI Esports Tournament', 'E-Sports', 'Competitive BGMI battle with ranked matches across multiple rounds', 'Day 1 & Day 2 (5–6 Feb), 9:00 AM – 12:00 PM', 'College Campus', '4 Members', '₹6,000'),
('Free Fire Esports Tournament', 'E-Sports', 'High-intensity Free Fire battle royale tournament with elimination rounds', 'Day 3 (7 Feb), 9:00 AM – 11:00 AM', 'College Campus', '4 Members', '₹5,000'),
('Tech Triathlon', 'Technical', 'Multi-stage technical competition covering coding, debugging, and system design', 'Day 1 (5 Feb), 2:00 PM – 5:00 PM', 'Computer Lab', 'Individual', '₹3,000'),
('Hackastra', 'Technical', '24-hour hackathon to build innovative solutions for real-world problems', 'Day 1-2 (5-6 Feb), 6:00 PM – 6:00 PM', 'Main Hall', '2-4 Members', '₹15,000'),
('Fun Fusion', 'Fun', 'Mixed fun activities including games, quizzes, and creative challenges', 'Day 2 (6 Feb), 10:00 AM – 1:00 PM', 'Open Ground', '2-3 Members', '₹2,000'),
('Fashion Flex', 'Cultural', 'Fashion show and styling competition showcasing creativity and trends', 'Day 3 (7 Feb), 3:00 PM – 6:00 PM', 'Auditorium', 'Individual', '₹4,000');

-- 6. Verify cleanup
SELECT 
    'After Cleanup' as status,
    (SELECT COUNT(*) FROM registrations) as total_registrations,
    (SELECT COUNT(*) FROM events) as total_events;

-- 7. Show official events
SELECT 
    event_name,
    category,
    team_size,
    prize,
    date
FROM events 
ORDER BY 
    CASE category 
        WHEN 'E-Sports' THEN 1 
        WHEN 'Technical' THEN 2 
        WHEN 'Fun' THEN 3 
        WHEN 'Cultural' THEN 4 
        ELSE 5 
    END,
    event_name;

SELECT '✅ DATABASE CLEARED FOR PRODUCTION' as final_status;
```

---

## 🗂️ **Step 2: Clear Storage Buckets**

### **Method A: Using Supabase Dashboard (Recommended)**

1. **Go to Supabase Dashboard** → **Storage**

2. **Clear College IDs Bucket:**
   - Click on `college-ids` bucket
   - Select all files (Ctrl+A or Cmd+A)
   - Click **Delete** button
   - Confirm deletion

3. **Clear Payment Screenshots Bucket:**
   - Click on `payment-screenshots` bucket
   - Select all files in both `bgmi/` and `freefire/` folders
   - Click **Delete** button
   - Confirm deletion

### **Method B: Using SQL Commands (Advanced)**

```sql
-- ============================================
-- CLEAR STORAGE BUCKETS (ADVANCED METHOD)
-- ============================================

-- WARNING: This will delete ALL files in both buckets
-- Only run if you're comfortable with SQL storage operations

-- 1. List current files (for reference)
SELECT 
    bucket_id,
    name,
    created_at
FROM storage.objects 
WHERE bucket_id IN ('college-ids', 'payment-screenshots')
ORDER BY bucket_id, created_at DESC;

-- 2. Delete all files from college-ids bucket
DELETE FROM storage.objects 
WHERE bucket_id = 'college-ids';

-- 3. Delete all files from payment-screenshots bucket
DELETE FROM storage.objects 
WHERE bucket_id = 'payment-screenshots';

-- 4. Verify cleanup
SELECT 
    bucket_id,
    COUNT(*) as remaining_files
FROM storage.objects 
WHERE bucket_id IN ('college-ids', 'payment-screenshots')
GROUP BY bucket_id;

SELECT '🗂️ STORAGE BUCKETS CLEARED' as storage_status;
```

---

## 🔧 **Step 3: Reset Admin Panel**

### **Clear Admin Session (Optional):**

1. **Open Admin Panel** in browser
2. **Logout** if logged in
3. **Clear browser cache** for the site:
   - Chrome: Ctrl+Shift+Delete → Clear browsing data
   - Firefox: Ctrl+Shift+Delete → Clear recent history
4. **Test admin login** with fresh session

---

## ✅ **Step 4: Production Verification**

### **Run Final Verification Queries:**

```sql
-- ============================================
-- PRODUCTION READINESS VERIFICATION
-- ============================================

-- 1. Verify database structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('events', 'registrations')
AND column_name IN ('payment_required', 'payment_screenshot_url', 'payment_status')
ORDER BY table_name, column_name;

-- 2. Verify events are properly configured
SELECT 
    event_name,
    category,
    team_size,
    prize,
    CASE 
        WHEN event_name IN ('BGMI Esports Tournament', 'Free Fire Esports Tournament') 
        THEN 'Payment Required' 
        ELSE 'Free Event' 
    END as payment_status
FROM events 
ORDER BY category, event_name;

-- 3. Verify storage policies
SELECT 
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename = 'objects' 
AND (policyname LIKE '%payment%' OR policyname LIKE '%college%' OR policyname LIKE '%anonymous%')
ORDER BY policyname;

-- 4. Verify payment configuration function
SELECT 
    'BGMI' as event,
    * 
FROM get_payment_config('BGMI Esports Tournament')
UNION ALL
SELECT 
    'Free Fire' as event,
    * 
FROM get_payment_config('Free Fire Esports Tournament');

SELECT '🎯 PRODUCTION VERIFICATION COMPLETE' as verification_status;
```

---

## 📱 **Step 5: Test Production System**

### **Complete Testing Checklist:**

1. **Registration Forms:**
   - [ ] BGMI registration with payment
   - [ ] Free Fire registration with payment
   - [ ] Tech Triathlon registration (free)
   - [ ] Other event registrations

2. **Payment System:**
   - [ ] QR code images load correctly
   - [ ] Payment screenshot upload works
   - [ ] Transaction ID validation works
   - [ ] Registration saves with payment data

3. **Admin Panel:**
   - [ ] Login works
   - [ ] View registrations
   - [ ] View payment screenshots
   - [ ] Update payment status
   - [ ] Export functionality

4. **Mobile Testing:**
   - [ ] Forms work on mobile devices
   - [ ] File uploads work on mobile
   - [ ] QR codes are visible and scannable

---

## 🚨 **Emergency Rollback (If Needed)**

If something goes wrong, you can restore test data:

```sql
-- EMERGENCY: Restore basic test data
INSERT INTO registrations (
    name, email, phone, class, college, roll_no, event_id,
    team_name, player2_name, player2_roll_no, player2_college,
    payment_required, payment_amount, payment_status
) VALUES (
    'Test User', 'test@example.com', '9999999999', 'Test Class', 
    'Test College', 'TEST001', 
    (SELECT id FROM events WHERE event_name = 'BGMI Esports Tournament' LIMIT 1),
    'Test Team', 'Test Player 2', 'TEST002', 'Test College',
    true, 100.00, 'pending'
);
```

---

## 📊 **Expected Results After Cleanup**

- **Registrations Table**: 0 records
- **Events Table**: 6 official events
- **College IDs Bucket**: Empty
- **Payment Screenshots Bucket**: Empty
- **Admin Panel**: Clean slate, ready for real registrations
- **Registration Forms**: Working and ready for users

---

## 🎉 **Go Live Checklist**

After cleanup, before announcing the event:

- [ ] Database cleared and verified
- [ ] Storage buckets cleared
- [ ] All registration forms tested
- [ ] Payment system tested on mobile
- [ ] Admin panel tested
- [ ] QR codes updated with correct payment details
- [ ] Event dates and details are accurate
- [ ] Backup of clean database taken

---

## 📞 **Support Information**

If you encounter issues during cleanup:

1. **Check Supabase logs** for any errors
2. **Verify storage policies** are still active
3. **Test one registration** before going live
4. **Contact support** if payment uploads fail

---

**🎯 Your system is now ready for the official Innovision 3.0 event!**

---

*Last Updated: January 2025*  
*Status: Production Ready*