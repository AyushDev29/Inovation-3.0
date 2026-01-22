-- ============================================
-- UPDATE INNOVISION 3.0 EVENTS - CORRECTED NAMES & TEAM SIZES
-- ============================================

-- Step 1: Delete old events
DELETE FROM events;

-- Step 2: Insert corrected official events with updated names and team sizes
INSERT INTO events (event_name, category, description, date, venue, team_size, prize) VALUES
('BGMI Esports Tournament', 'E-Sports', 'Competitive BGMI battle with ranked matches across two days', 'Day 1 & Day 2 (5–6 Feb), 9:00 AM – 12:00 PM', 'College Campus', '4 Members', ''),
('Free Fire Esports Tournament', 'E-Sports', 'High-intensity Free Fire battle royale tournament', 'Day 3 (7 Feb), 9:00 AM – 11:00 AM', 'College Campus', '4 Members', ''),
('Blind Typing Competition', 'Technical / Fun', 'Speed typing challenge without looking at the keyboard', 'Day 2 (6 Feb), 11:00 AM – 12:00 PM', 'Computer Lab', 'Individual', ''),
('Fashion Flex – Style Your Way (Ramp Walk)', 'Fun / Cultural', 'Traditional attire ramp walk competition', 'Day 1 (5 Feb), 11:00 AM – 1:00 PM', 'Auditorium', '4 Members', ''),
('Hackathon', 'Technical', 'Team-based problem-solving and innovation challenge', 'Day 3 (7 Feb), 11:00 AM – 2:00 PM', 'Seminar Hall', '4 Members', ''),
('Fun Fusion (Surprise Games)', 'Fun', 'Team-based indoor games and challenges', 'Day 2 (6 Feb), 12:00 PM – 2:00 PM', 'Activity Zone', '4–6 Members', '');

-- Step 3: Verify the update
SELECT event_name, category, team_size, date FROM events ORDER BY event_name;

-- ============================================
-- CHANGES MADE:
-- ============================================
-- 1. Updated event names to match frontend exactly:
--    - "BGMI Tournament" → "BGMI Esports Tournament"
--    - "Free Fire Tournament" → "Free Fire Esports Tournament"
--    - "Blind Typing" → "Blind Typing Competition"
--    - "Ramp Walk" → "Fashion Flex – Style Your Way (Ramp Walk)"
--    - "Fun Fusion" → "Fun Fusion (Surprise Games)"
--    - "Hackathon" remains same
--
-- 2. Fixed team sizes:
--    - Ramp Walk: "Individual" → "4 Members" (as per rules)
--    - Hackathon: "2–4 Members" → "4 Members" (as per rules)
--
-- 3. Removed "TBA" from prizes (empty string instead)
-- ============================================