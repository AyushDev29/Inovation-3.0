-- ============================================
-- FINAL SYNC: ENSURE DATABASE MATCHES FRONTEND
-- ============================================
-- This script ensures the database event names exactly match the frontend
-- Run this in your Supabase SQL Editor

-- Step 1: Check current events
SELECT 'CURRENT EVENTS IN DATABASE:' as info;
SELECT id, event_name, category, team_size FROM events ORDER BY event_name;

-- Step 2: Update/Insert events to match frontend exactly
-- These are the exact names used in the frontend Events.jsx

-- BGMI Esports Tournament
INSERT INTO events (event_name, category, description, date, venue, team_size, prize) 
VALUES (
    'BGMI Esports Tournament', 
    'E-Sports', 
    'Competitive BGMI battle with ranked matches across two days', 
    'Day 1 & Day 2 (5–6 Feb), 9:00 AM – 12:00 PM', 
    'College Campus', 
    '4 Members', 
    'TBA'
)
ON CONFLICT (event_name) DO UPDATE SET
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    date = EXCLUDED.date,
    venue = EXCLUDED.venue,
    team_size = EXCLUDED.team_size,
    prize = EXCLUDED.prize;

-- Free Fire Esports Tournament
INSERT INTO events (event_name, category, description, date, venue, team_size, prize) 
VALUES (
    'Free Fire Esports Tournament', 
    'E-Sports', 
    'High-intensity Free Fire battle royale tournament', 
    'Day 3 (7 Feb), 9:00 AM – 11:00 AM', 
    'College Campus', 
    '4 Members', 
    'TBA'
)
ON CONFLICT (event_name) DO UPDATE SET
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    date = EXCLUDED.date,
    venue = EXCLUDED.venue,
    team_size = EXCLUDED.team_size,
    prize = EXCLUDED.prize;

-- Tech Triathlon
INSERT INTO events (event_name, category, description, date, venue, team_size, prize) 
VALUES (
    'Tech Triathlon', 
    'Technical / Fun', 
    'From flawless typing to sharp debugging and logical thinking, Tech Triathlon tests every core skill a modern coder needs.', 
    'Day 2 (6 Feb), 11:00 AM – 12:00 PM', 
    'Computer Lab', 
    'Individual', 
    'TBA'
)
ON CONFLICT (event_name) DO UPDATE SET
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    date = EXCLUDED.date,
    venue = EXCLUDED.venue,
    team_size = EXCLUDED.team_size,
    prize = EXCLUDED.prize;

-- Fashion Flex
INSERT INTO events (event_name, category, description, date, venue, team_size, prize) 
VALUES (
    'Fashion Flex', 
    'Fun / Cultural', 
    'Traditional attire ramp walk competition with Q&A round', 
    'Day 1 (5 Feb), 11:00 AM – 1:00 PM', 
    'Auditorium', 
    '2 Members (Duo)', 
    'TBA'
)
ON CONFLICT (event_name) DO UPDATE SET
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    date = EXCLUDED.date,
    venue = EXCLUDED.venue,
    team_size = EXCLUDED.team_size,
    prize = EXCLUDED.prize;

-- Hackastra
INSERT INTO events (event_name, category, description, date, venue, team_size, prize) 
VALUES (
    'Hackastra', 
    'Technical', 
    'Team-based problem-solving and innovation challenge', 
    'Day 3 (7 Feb), 11:00 AM – 2:00 PM', 
    'Seminar Hall', 
    '2-3 Members', 
    'TBA'
)
ON CONFLICT (event_name) DO UPDATE SET
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    date = EXCLUDED.date,
    venue = EXCLUDED.venue,
    team_size = EXCLUDED.team_size,
    prize = EXCLUDED.prize;

-- Fun Fusion
INSERT INTO events (event_name, category, description, date, venue, team_size, prize) 
VALUES (
    'Fun Fusion', 
    'Fun', 
    'Team-based indoor games and challenges', 
    'Day 2 (6 Feb), 12:00 PM – 2:00 PM', 
    'Activity Zone', 
    '4–6 Members', 
    'TBA'
)
ON CONFLICT (event_name) DO UPDATE SET
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    date = EXCLUDED.date,
    venue = EXCLUDED.venue,
    team_size = EXCLUDED.team_size,
    prize = EXCLUDED.prize;

-- Step 3: Clean up any old event names that might exist
-- Remove old events that don't match frontend (only if they have no registrations)
DELETE FROM events 
WHERE event_name NOT IN (
    'BGMI Esports Tournament',
    'Free Fire Esports Tournament', 
    'Tech Triathlon',
    'Fashion Flex',
    'Hackastra',
    'Fun Fusion'
) 
AND id NOT IN (SELECT DISTINCT event_id FROM registrations WHERE event_id IS NOT NULL);

-- Step 4: Verify final state
SELECT 'FINAL EVENTS IN DATABASE:' as info;
SELECT id, event_name, category, team_size FROM events ORDER BY event_name;

-- Step 5: Check registrations are still intact
SELECT 'REGISTRATION COUNT BY EVENT:' as info;
SELECT e.event_name, COUNT(r.id) as registration_count
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id
GROUP BY e.event_name, e.id
ORDER BY e.event_name;

-- ============================================
-- ✅ VERIFICATION COMPLETE
-- ============================================
-- Frontend event names now exactly match database event names
-- All registrations are preserved and linked correctly
-- ============================================