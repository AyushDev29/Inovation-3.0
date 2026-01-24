-- ADD INDIVIDUAL COLLEGE ID UPLOADS FOR TEAM MEMBERS
-- Run this query in Supabase SQL Editor

-- STEP 1: Add individual college ID columns for each team member
DO $$
BEGIN
    -- Add columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'registrations' AND column_name = 'player1_college_id_url') THEN
        ALTER TABLE registrations ADD COLUMN player1_college_id_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'registrations' AND column_name = 'player2_college_id_url') THEN
        ALTER TABLE registrations ADD COLUMN player2_college_id_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'registrations' AND column_name = 'player3_college_id_url') THEN
        ALTER TABLE registrations ADD COLUMN player3_college_id_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'registrations' AND column_name = 'player4_college_id_url') THEN
        ALTER TABLE registrations ADD COLUMN player4_college_id_url TEXT;
    END IF;
END $$;

-- STEP 2: Refresh schema cache (important for Supabase)
NOTIFY pgrst, 'reload schema';

-- STEP 3: Migrate existing college_id_url to player1_college_id_url for team events
UPDATE registrations 
SET player1_college_id_url = college_id_url
WHERE college_id_url IS NOT NULL 
AND event_id IN (
    SELECT id FROM events 
    WHERE event_name IN ('BGMI Esports Tournament', 'Free Fire Esports Tournament', 'Hackastra', 'Fashion Flex')
);

-- STEP 4: Add comments for documentation
COMMENT ON COLUMN registrations.player1_college_id_url IS 'College ID photo for team leader/member 1';
COMMENT ON COLUMN registrations.player2_college_id_url IS 'College ID photo for team member 2';
COMMENT ON COLUMN registrations.player3_college_id_url IS 'College ID photo for team member 3';
COMMENT ON COLUMN registrations.player4_college_id_url IS 'College ID photo for team member 4';

-- STEP 5: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_player1_college_id ON registrations(player1_college_id_url);
CREATE INDEX IF NOT EXISTS idx_registrations_player2_college_id ON registrations(player2_college_id_url);
CREATE INDEX IF NOT EXISTS idx_registrations_player3_college_id ON registrations(player3_college_id_url);
CREATE INDEX IF NOT EXISTS idx_registrations_player4_college_id ON registrations(player4_college_id_url);

-- STEP 6: Verify the changes
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'registrations' 
AND column_name LIKE '%college_id_url%'
ORDER BY column_name;

-- STEP 7: Test query to ensure everything works
SELECT 
    e.event_name,
    COUNT(*) as total_registrations,
    COUNT(r.college_id_url) as individual_ids,
    COUNT(r.player1_college_id_url) as player1_ids,
    COUNT(r.player2_college_id_url) as player2_ids,
    COUNT(r.player3_college_id_url) as player3_ids,
    COUNT(r.player4_college_id_url) as player4_ids
FROM registrations r
JOIN events e ON r.event_id = e.id
GROUP BY e.event_name
ORDER BY e.event_name;