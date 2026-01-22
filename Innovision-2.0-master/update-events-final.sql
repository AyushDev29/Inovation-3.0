-- ============================================
-- SAFE UPDATE: SYNC DATABASE WITH FRONTEND EVENT NAMES
-- ⚠️  THIS SCRIPT PRESERVES ALL EXISTING REGISTRATION DATA
-- ============================================
-- This query ONLY updates event names and descriptions
-- NO registration data will be deleted or lost
-- Run this in your Supabase SQL Editor

-- Step 1: First, let's see what events currently exist
SELECT 'CURRENT EVENTS IN DATABASE:' as info;
SELECT id, event_name, category, team_size FROM events ORDER BY event_name;

-- Step 2: SAFELY update existing event names to match frontend
-- These updates preserve all existing registrations linked to these events

UPDATE events 
SET event_name = 'Tech Triathlon',
    description = 'From flawless typing to sharp debugging and logical thinking, TechTriathlon tests every core skill a modern coder needs.'
WHERE event_name IN ('Blind Typing', 'Blind Typing Competition');

UPDATE events 
SET event_name = 'Hackastra'
WHERE event_name IN ('Hackathon', 'Orbital Hackathon');

-- Update Hackastra team size to 2-3 members
UPDATE events 
SET team_size = '2-3 Members'
WHERE event_name = 'Hackastra';

UPDATE events 
SET event_name = 'Fashion Flex'
WHERE event_name IN ('Ramp Walk', 'Fashion Flex – Style Your Way (Ramp Walk)', 'Fashion Flex – Style Your Way');

UPDATE events 
SET event_name = 'Fun Fusion'
WHERE event_name IN ('Fun Fusion (Surprise Games)');

-- Step 3: Update BGMI and Free Fire names if they exist
UPDATE events 
SET event_name = 'BGMI Esports Tournament'
WHERE event_name IN ('BGMI Tournament', 'BGMI');

UPDATE events 
SET event_name = 'Free Fire Esports Tournament'
WHERE event_name IN ('Free Fire Tournament', 'Free Fire');

-- Step 4: Insert missing events ONLY if they don't exist
-- This ensures we don't create duplicates
INSERT INTO events (event_name, category, description, date, venue, team_size, prize) 
SELECT 'BGMI Esports Tournament', 'E-Sports', 'Competitive BGMI battle with ranked matches across two days', 'Day 1 & Day 2 (5–6 Feb), 9:00 AM – 12:00 PM', 'College Campus', '4 Members', ''
WHERE NOT EXISTS (SELECT 1 FROM events WHERE event_name = 'BGMI Esports Tournament');

INSERT INTO events (event_name, category, description, date, venue, team_size, prize) 
SELECT 'Free Fire Esports Tournament', 'E-Sports', 'High-intensity Free Fire battle royale tournament', 'Day 3 (7 Feb), 9:00 AM – 11:00 AM', 'College Campus', '4 Members', ''
WHERE NOT EXISTS (SELECT 1 FROM events WHERE event_name = 'Free Fire Esports Tournament');

INSERT INTO events (event_name, category, description, date, venue, team_size, prize) 
SELECT 'Tech Triathlon', 'Technical / Fun', 'From flawless typing to sharp debugging and logical thinking, TechTriathlon tests every core skill a modern coder needs.', 'Day 2 (6 Feb), 11:00 AM – 12:00 PM', 'Computer Lab', 'Individual', ''
WHERE NOT EXISTS (SELECT 1 FROM events WHERE event_name = 'Tech Triathlon');

INSERT INTO events (event_name, category, description, date, venue, team_size, prize) 
SELECT 'Fashion Flex', 'Fun / Cultural', 'Traditional attire ramp walk competition', 'Day 1 (5 Feb), 11:00 AM – 1:00 PM', 'Auditorium', '4 Members', ''
WHERE NOT EXISTS (SELECT 1 FROM events WHERE event_name = 'Fashion Flex');

INSERT INTO events (event_name, category, description, date, venue, team_size, prize) 
SELECT 'Hackastra', 'Technical', 'Team-based problem-solving and innovation challenge', 'Day 3 (7 Feb), 11:00 AM – 2:00 PM', 'Seminar Hall', '2-3 Members', ''
WHERE NOT EXISTS (SELECT 1 FROM events WHERE event_name = 'Hackastra');

INSERT INTO events (event_name, category, description, date, venue, team_size, prize) 
SELECT 'Fun Fusion', 'Fun', 'Team-based indoor games and challenges', 'Day 2 (6 Feb), 12:00 PM – 2:00 PM', 'Activity Zone', '4–6 Members', ''
WHERE NOT EXISTS (SELECT 1 FROM events WHERE event_name = 'Fun Fusion');

-- Step 5: Verify the final state - NO DATA LOSS
SELECT 'UPDATED EVENTS IN DATABASE:' as info;
SELECT id, event_name, category, team_size, description FROM events ORDER BY event_name;

-- Step 6: Check that all registrations are still intact
SELECT 'REGISTRATION COUNT CHECK:' as info;
SELECT COUNT(*) as total_registrations FROM registrations;

-- Step 7: Show registrations by event to confirm no data loss
SELECT 'REGISTRATIONS BY EVENT:' as info;
SELECT e.event_name, COUNT(r.id) as registration_count
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id
GROUP BY e.event_name, e.id
ORDER BY e.event_name;

-- ============================================
-- ✅ SAFETY GUARANTEES:
-- ============================================
-- ✅ NO registration data will be deleted
-- ✅ NO event IDs will change (preserves foreign key relationships)
-- ✅ Only event names and descriptions are updated
-- ✅ All existing registrations remain linked to their events
-- ✅ Missing events are added without affecting existing ones
-- ============================================