-- ============================================
-- HACKASTRA DATABASE UPDATE - RUN THIS MANUALLY
-- ============================================
-- This query updates Hackastra to only accept 2-3 members
-- Copy and paste this entire query into your Supabase SQL Editor

-- Step 1: Update Hackastra event team size
UPDATE events 
SET team_size = '2-3 Members'
WHERE event_name = 'Hackastra';

-- Step 2: Add a constraint to ensure Hackastra registrations only have 2-3 members
-- This creates a function to validate Hackastra team size
CREATE OR REPLACE FUNCTION validate_hackastra_team_size()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if this is a Hackastra registration
    IF EXISTS (
        SELECT 1 FROM events 
        WHERE id = NEW.event_id 
        AND event_name = 'Hackastra'
    ) THEN
        -- For Hackastra: player2_name is required (minimum 2 members)
        IF NEW.player2_name IS NULL OR NEW.player2_name = '' THEN
            RAISE EXCEPTION 'Hackastra requires at least 2 members (Leader + Member 2)';
        END IF;
        
        -- For Hackastra: player4_name should be NULL (maximum 3 members)
        IF NEW.player4_name IS NOT NULL AND NEW.player4_name != '' THEN
            RAISE EXCEPTION 'Hackastra allows maximum 3 members only (Leader + Member 2 + Member 3)';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Create trigger to enforce Hackastra team size validation
DROP TRIGGER IF EXISTS hackastra_team_size_trigger ON registrations;
CREATE TRIGGER hackastra_team_size_trigger
    BEFORE INSERT OR UPDATE ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION validate_hackastra_team_size();

-- Step 4: Verify the changes
SELECT 'HACKASTRA EVENT UPDATED:' as info;
SELECT id, event_name, team_size FROM events WHERE event_name = 'Hackastra';

-- Step 5: Test the constraint (this should work - 2 members)
-- Uncomment to test:
-- INSERT INTO registrations (event_id, name, email, phone, class, college, team_name, player2_name) 
-- SELECT id, 'Test Leader', 'test@email.com', '1234567890', 'Test Class', 'Test College', 'Test Team', 'Test Member 2'
-- FROM events WHERE event_name = 'Hackastra';

-- Step 6: Test the constraint (this should work - 3 members)
-- Uncomment to test:
-- INSERT INTO registrations (event_id, name, email, phone, class, college, team_name, player2_name, player3_name) 
-- SELECT id, 'Test Leader 2', 'test2@email.com', '1234567891', 'Test Class', 'Test College', 'Test Team 2', 'Test Member 2', 'Test Member 3'
-- FROM events WHERE event_name = 'Hackastra';

-- Step 7: Test the constraint (this should FAIL - 4 members)
-- Uncomment to test:
-- INSERT INTO registrations (event_id, name, email, phone, class, college, team_name, player2_name, player3_name, player4_name) 
-- SELECT id, 'Test Leader 3', 'test3@email.com', '1234567892', 'Test Class', 'Test College', 'Test Team 3', 'Test Member 2', 'Test Member 3', 'Test Member 4'
-- FROM events WHERE event_name = 'Hackastra';

-- Clean up test data (uncomment if you ran the tests above)
-- DELETE FROM registrations WHERE email LIKE 'test%@email.com';

SELECT 'DATABASE UPDATE COMPLETE!' as status;
SELECT 'Hackastra now enforces 2-3 members only' as message;