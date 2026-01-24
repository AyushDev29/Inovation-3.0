-- FUN FUSION INDIVIDUAL EVENT CONVERSION
-- Run this query in Supabase SQL Editor to complete the conversion

-- 1. Update Fun Fusion event description in events table (if needed)
UPDATE events 
SET description = 'Individual indoor games and challenges'
WHERE event_name = 'Fun Fusion';

-- 2. Clean up any existing Fun Fusion team registrations (set team fields to NULL)
-- This ensures existing registrations are treated as individual entries
UPDATE registrations 
SET 
    team_name = NULL,
    player2_name = NULL,
    player2_roll_no = NULL,
    player2_class = NULL,
    player3_name = NULL,
    player3_roll_no = NULL,
    player3_class = NULL,
    player4_name = NULL,
    player4_roll_no = NULL,
    player4_class = NULL
WHERE event_id = (SELECT id FROM events WHERE event_name = 'Fun Fusion');

-- 3. Add a comment to document the change
COMMENT ON TABLE registrations IS 'Updated: Fun Fusion converted to individual event - team fields set to NULL for Fun Fusion registrations';

-- 4. Verify the changes
SELECT 
    r.id,
    r.name,
    r.email,
    r.team_name,
    e.event_name,
    r.created_at
FROM registrations r
JOIN events e ON r.event_id = e.id
WHERE e.event_name = 'Fun Fusion'
ORDER BY r.created_at DESC
LIMIT 5;

-- Expected result: All Fun Fusion registrations should have team_name = NULL