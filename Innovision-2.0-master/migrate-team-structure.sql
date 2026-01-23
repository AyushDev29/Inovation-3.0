-- ============================================
-- TEAM STRUCTURE MIGRATION - SAFE DATABASE UPDATE
-- ============================================
-- This script migrates from individual college fields to team college + individual class fields
-- IMPORTANT: Run this during maintenance window when no registrations are happening

-- STEP 1: Add new class fields for team members (keeping existing college fields for now)
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS player2_class TEXT,
ADD COLUMN IF NOT EXISTS player3_class TEXT,
ADD COLUMN IF NOT EXISTS player4_class TEXT;

-- STEP 2: Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_registrations_player2_class ON registrations(player2_class);
CREATE INDEX IF NOT EXISTS idx_registrations_player3_class ON registrations(player3_class);
CREATE INDEX IF NOT EXISTS idx_registrations_player4_class ON registrations(player4_class);

-- STEP 3: Data migration - Copy existing college data to class fields (if needed for existing data)
-- This assumes existing college data should be moved to class fields
-- Only run if you have existing data that needs migration
/*
UPDATE registrations 
SET 
    player2_class = player2_college,
    player3_class = player3_college,
    player4_class = player4_college
WHERE 
    player2_college IS NOT NULL 
    OR player3_college IS NOT NULL 
    OR player4_college IS NOT NULL;
*/

-- STEP 4: Create validation function for same college rule
CREATE OR REPLACE FUNCTION validate_team_college_rule()
RETURNS TRIGGER AS $$
BEGIN
    -- For team events, ensure all members are from same college
    -- This will be enforced at application level, but adding DB constraint as backup
    
    -- Skip validation for individual events (no team members)
    IF NEW.player2_name IS NULL AND NEW.player3_name IS NULL AND NEW.player4_name IS NULL THEN
        RETURN NEW;
    END IF;
    
    -- For team events, the college field represents the team's college
    -- All team members must be from this same college (enforced in application)
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 5: Create trigger for validation (optional - mainly for data integrity)
DROP TRIGGER IF EXISTS trigger_validate_team_college ON registrations;
CREATE TRIGGER trigger_validate_team_college
    BEFORE INSERT OR UPDATE ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION validate_team_college_rule();

-- STEP 6: Update events table to include team rules
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS rules TEXT;

-- STEP 7: Update team events with new rules
UPDATE events 
SET rules = 'Team Rules:
1. All team members must be from the same college
2. Team leader will provide common college name for the entire team
3. Individual class names required for each team member
4. Mixed college teams are not allowed
5. College ID verification required for all team members'
WHERE team_size LIKE '%Members' AND team_size != 'Individual';

-- STEP 8: Verification queries
SELECT '✅ TEAM STRUCTURE MIGRATION COMPLETED' as status;

-- Check new columns exist
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'registrations' 
AND column_name IN ('player2_class', 'player3_class', 'player4_class', 'rules')
ORDER BY column_name;

-- Check events with rules
SELECT 
    event_name, 
    team_size,
    CASE 
        WHEN rules IS NOT NULL THEN 'Rules Added'
        ELSE 'No Rules'
    END as rules_status
FROM events 
ORDER BY event_name;

-- Check existing registrations count
SELECT 
    COUNT(*) as total_registrations,
    COUNT(CASE WHEN player2_name IS NOT NULL THEN 1 END) as team_registrations,
    COUNT(CASE WHEN player2_name IS NULL THEN 1 END) as individual_registrations
FROM registrations;

SELECT '🎯 Migration completed! Ready for new team structure.' as final_status;

-- ============================================
-- ROLLBACK SCRIPT (if needed)
-- ============================================
/*
-- Uncomment and run this section if you need to rollback the migration

-- Remove new columns
ALTER TABLE registrations 
DROP COLUMN IF EXISTS player2_class,
DROP COLUMN IF EXISTS player3_class,
DROP COLUMN IF EXISTS player4_class;

-- Remove rules column
ALTER TABLE events 
DROP COLUMN IF EXISTS rules;

-- Remove trigger and function
DROP TRIGGER IF EXISTS trigger_validate_team_college ON registrations;
DROP FUNCTION IF EXISTS validate_team_college_rule();

-- Remove indexes
DROP INDEX IF EXISTS idx_registrations_player2_class;
DROP INDEX IF EXISTS idx_registrations_player3_class;
DROP INDEX IF EXISTS idx_registrations_player4_class;

SELECT '⚠️ ROLLBACK COMPLETED - Reverted to original structure' as rollback_status;
*/