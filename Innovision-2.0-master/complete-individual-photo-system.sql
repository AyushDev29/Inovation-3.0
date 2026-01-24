-- Complete Individual Photo Upload System for All Events
-- This script ensures all team events have individual college ID photo columns
-- Run this in Supabase SQL Editor

-- First, check if the columns exist and add them if they don't
DO $$
BEGIN
    -- Add player1_college_id_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'registrations' AND column_name = 'player1_college_id_url') THEN
        ALTER TABLE registrations ADD COLUMN player1_college_id_url TEXT;
    END IF;
    
    -- Add player2_college_id_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'registrations' AND column_name = 'player2_college_id_url') THEN
        ALTER TABLE registrations ADD COLUMN player2_college_id_url TEXT;
    END IF;
    
    -- Add player3_college_id_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'registrations' AND column_name = 'player3_college_id_url') THEN
        ALTER TABLE registrations ADD COLUMN player3_college_id_url TEXT;
    END IF;
    
    -- Add player4_college_id_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'registrations' AND column_name = 'player4_college_id_url') THEN
        ALTER TABLE registrations ADD COLUMN player4_college_id_url TEXT;
    END IF;
END $$;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'registrations' 
AND column_name IN ('player1_college_id_url', 'player2_college_id_url', 'player3_college_id_url', 'player4_college_id_url')
ORDER BY column_name;

-- Show current registrations count by event
SELECT 
    e.event_name,
    COUNT(r.id) as total_registrations,
    COUNT(r.college_id_url) as old_system_photos,
    COUNT(r.player1_college_id_url) as individual_photo_1,
    COUNT(r.player2_college_id_url) as individual_photo_2,
    COUNT(r.player3_college_id_url) as individual_photo_3,
    COUNT(r.player4_college_id_url) as individual_photo_4
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id
GROUP BY e.id, e.event_name
ORDER BY e.event_name;