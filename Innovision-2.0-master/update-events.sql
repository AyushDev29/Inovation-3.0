-- ============================================
-- UPDATE INNOVISION 3.0 EVENTS - OFFICIAL EVENTS
-- ============================================

-- Step 1: Delete old events
DELETE FROM events;

-- Step 2: Insert official events
INSERT INTO events (event_name, category, description, date, venue, team_size, prize) VALUES
('BGMI Tournament', 'E-Sports', 'Competitive BGMI battle with ranked matches across two days', 'Day 1 & Day 2 (5–6 Feb), 9:00 AM – 12:00 PM', 'College Campus', '4 Members', 'TBA'),
('Free Fire Tournament', 'E-Sports', 'High-intensity Free Fire battle royale tournament', 'Day 3 (7 Feb), 9:00 AM – 11:00 AM', 'College Campus', '4 Members', 'TBA'),
('Blind Typing', 'Technical / Fun', 'Speed typing challenge without looking at the keyboard', 'Day 2 (6 Feb), 11:00 AM – 12:00 PM', 'Computer Lab', 'Individual', 'TBA'),
('Ramp Walk', 'Fun / Cultural', 'Traditional attire ramp walk competition', 'Day 1 (5 Feb), 11:00 AM – 1:00 PM', 'Auditorium', 'Individual', 'TBA'),
('Hackathon', 'Technical', 'Team-based problem-solving and innovation challenge', 'Day 3 (7 Feb), 11:00 AM – 2:00 PM', 'Seminar Hall', '2–4 Members', 'TBA'),
('Fun Fusion', 'Fun', 'Team-based indoor games and challenges', 'Day 2 (6 Feb), 12:00 PM – 2:00 PM', 'Activity Zone', '4–6 Members', 'TBA');

-- Step 3: Verify the update
SELECT event_name, category, team_size, date FROM events ORDER BY event_name;