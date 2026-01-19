-- Update Ramp Walk event to be a team event with 4 members
UPDATE events 
SET team_size = '4 Members'
WHERE event_name = 'Ramp Walk';

-- Verify the update
SELECT * FROM events WHERE event_name = 'Ramp Walk';