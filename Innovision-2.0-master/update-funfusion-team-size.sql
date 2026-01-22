-- ============================================
-- UPDATE FUN FUSION TEAM SIZE TO 4 MEMBERS
-- ============================================
-- This script updates Fun Fusion team size from "4–6 Members" to "4 Members"
-- Run this in your Supabase SQL Editor

-- Update Fun Fusion team size
UPDATE events 
SET team_size = '4 Members'
WHERE event_name = 'Fun Fusion';

-- Verify the update
SELECT event_name, team_size 
FROM events 
WHERE event_name = 'Fun Fusion';

-- Show all events with their team sizes for verification
SELECT event_name, team_size, category 
FROM events 
ORDER BY id;

-- ============================================
-- ✅ FUN FUSION TEAM SIZE UPDATED
-- ============================================
-- Fun Fusion team size changed from "4–6 Members" to "4 Members"
-- This ensures consistency between frontend and database
-- ============================================