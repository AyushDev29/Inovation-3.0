-- ============================================
-- UPDATE EVENT NAMES TO MATCH FRONTEND
-- ============================================
-- Run these queries in Supabase SQL Editor

-- Update event names to match the frontend
UPDATE events SET event_name = 'Tech Triathlon' WHERE event_name = 'Blind Typing';
UPDATE events SET event_name = 'Hackastra' WHERE event_name = 'Hackathon';
UPDATE events SET event_name = 'Fashion Flex' WHERE event_name = 'Ramp Walk' OR event_name LIKE '%Ramp Walk%';

-- Update team sizes to match new requirements
UPDATE events SET team_size = '2 Members (Duo)' WHERE event_name = 'Fashion Flex';
UPDATE events SET team_size = '2-3 Members' WHERE event_name = 'Hackastra';

-- Verify the updates
SELECT id, event_name, team_size FROM events ORDER BY id;

-- Success message
SELECT 'Event names and team sizes updated successfully!' as status;