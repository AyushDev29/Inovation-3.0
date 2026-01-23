-- ============================================
-- INNOVISION 3.0 - COMPLETE DATABASE BACKUP
-- Created: January 23, 2026
-- Status: Stable Working Version
-- ============================================

-- This file contains the complete working database schema
-- Use this to restore the database to current working state

-- ============================================
-- EVENTS TABLE (Current Working Configuration)
-- ============================================

-- Clear existing events (if restoring)
DELETE FROM events;

-- Insert all current events with correct configurations
INSERT INTO events (id, event_name, description, rules, team_size, registration_fee, created_at, updated_at) VALUES
(1, 'BGMI Esports Tournament', 'Battle royale gaming tournament with cash prizes', 'Standard BGMI tournament rules apply', '4 players per team', 7000, NOW(), NOW()),
(2, 'Free Fire Esports Tournament', 'Fast-paced battle royale competition', 'Official Free Fire tournament guidelines', '4 players per team', 3000, NOW(), NOW()),
(3, 'Hackastra', 'Competitive programming and hackathon event', 'Team-based coding competition', '3 members per team', 0, NOW(), NOW()),
(4, 'Tech Triathlon', 'Individual technical challenge across multiple domains', 'Solo participation event', '1 participant', 0, NOW(), NOW()),
(5, 'Fun Fusion', 'Creative and entertainment-based team activities', 'Mixed team activities and games', '4 members per team', 0, NOW(), NOW()),
(6, 'Fashion Flex', 'Fashion show and styling competition', 'Team-based fashion event', '5 members per team', 0, NOW(), NOW());

-- ============================================
-- STORAGE BUCKETS (Current Configuration)
-- ============================================

-- College IDs Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('college-ids', 'college-ids', false, 52428800, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']);

-- Payment Screenshots Bucket  
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('payment-screenshots', 'payment-screenshots', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/jpg']);

-- ============================================
-- STORAGE POLICIES (Current Working Policies)
-- ============================================

-- College IDs Policies
CREATE POLICY "Allow authenticated uploads to college-ids" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'college-ids');

CREATE POLICY "Allow authenticated users to view college-ids" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'college-ids');

-- Payment Screenshots Policies
CREATE POLICY "Allow authenticated uploads to payment-screenshots" ON storage.objects
FOR INSERT TO authenticated  
WITH CHECK (bucket_id = 'payment-screenshots');

CREATE POLICY "Allow authenticated users to view payment-screenshots" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'payment-screenshots');

-- ============================================
-- REGISTRATIONS TABLE STRUCTURE
-- ============================================

-- Ensure registrations table has all required columns
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS payment_required BOOLEAN DEFAULT FALSE;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS payment_amount INTEGER DEFAULT 0;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'not_required';
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS payment_transaction_id VARCHAR(255);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS payment_screenshot_url TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS college_id_url TEXT;

-- Add team member columns for team events
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS team_name VARCHAR(255);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS player2_name VARCHAR(255);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS player2_roll_no VARCHAR(50);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS player2_class VARCHAR(100);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS player3_name VARCHAR(255);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS player3_roll_no VARCHAR(50);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS player3_class VARCHAR(100);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS player4_name VARCHAR(255);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS player4_roll_no VARCHAR(50);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS player4_class VARCHAR(100);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS player5_name VARCHAR(255);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS player5_roll_no VARCHAR(50);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS player5_class VARCHAR(100);

-- ============================================
-- CURRENT WORKING CONFIGURATION SUMMARY
-- ============================================

/*
PAID EVENTS:
- BGMI: ₹7,000 entry fee (4 players per team)
- Free Fire: ₹3,000 entry fee (4 players per team)

FREE EVENTS:
- Hackastra: Free (3 members per team)
- Tech Triathlon: Free (Individual)
- Fun Fusion: Free (4 members per team)  
- Fashion Flex: Free (5 members per team)

FEATURES WORKING:
✅ Registration forms for all events
✅ Payment system for BGMI/Free Fire
✅ File uploads (College IDs, Payment Screenshots)
✅ Admin panel with payment verification
✅ WhatsApp group integration
✅ Responsive design
✅ 5 sponsors display

ADMIN PANEL:
✅ Registration dashboard
✅ Payment verification system
✅ Excel export functionality
✅ PDF/Image viewing
✅ Proper payment status tracking
*/

-- ============================================
-- RESTORE VERIFICATION QUERIES
-- ============================================

-- Verify events are loaded correctly
SELECT event_name, team_size, registration_fee FROM events ORDER BY id;

-- Verify storage buckets exist
SELECT name, public, file_size_limit FROM storage.buckets;

-- Check registrations table structure
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'registrations' ORDER BY ordinal_position;