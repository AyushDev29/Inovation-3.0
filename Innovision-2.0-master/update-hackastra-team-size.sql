-- ============================================
-- UPDATE HACKASTRA TEAM SIZE: 2-3 MEMBERS
-- ============================================
-- This script updates Hackastra to require 2-3 members (min 2, max 3)
-- Run this in your Supabase SQL Editor

-- Step 1: Check current Hackastra event
SELECT 'CURRENT HACKASTRA EVENT:' as info;
SELECT id, event_name, team_size, description FROM events WHERE event_name = 'Hackastra';

-- Step 2: Update Hackastra team size
UPDATE events 
SET team_size = '2-3 Members'
WHERE event_name = 'Hackastra';

-- Step 3: Verify the update
SELECT 'UPDATED HACKASTRA EVENT:' as info;
SELECT id, event_name, team_size, description FROM events WHERE event_name = 'Hackastra';

-- Step 4: Check existing registrations for Hackastra (if any)
SELECT 'EXISTING HACKASTRA REGISTRATIONS:' as info;
SELECT r.name, r.team_name, r.player2_name, r.player3_name, r.player4_name
FROM registrations r
JOIN events e ON r.event_id = e.id
WHERE e.event_name = 'Hackastra';

-- ============================================
-- ✅ HACKASTRA TEAM SIZE UPDATED
-- ============================================
-- Team size is now: 2-3 Members (minimum 2, maximum 3)
-- Registration form will allow:
-- - Leader + Member 2 (required)
-- - Member 3 (optional)
-- - Member 4 field will not be used for Hackastra
-- ============================================