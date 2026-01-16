-- ============================================
-- INNOVISION 3.0 - SUPABASE DATABASE SCHEMA
-- ============================================

-- 1. Create Events Table
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_name TEXT NOT NULL UNIQUE,
    category TEXT,
    description TEXT,
    date TEXT,
    venue TEXT,
    team_size TEXT,
    prize TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    
    -- Leader/Individual Info
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    class TEXT NOT NULL,
    college TEXT NOT NULL,
    
    -- Team Info (nullable for individual events)
    team_name TEXT,
    player2_name TEXT,
    player3_name TEXT,
    player4_name TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate registrations (same email for same event)
    UNIQUE(email, event_id)
);

-- 3. Create Indexes for Better Performance
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies for Public Read Access
CREATE POLICY "Allow public read access to events"
    ON events FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert to registrations"
    ON registrations FOR INSERT
    WITH CHECK (true);

-- 6. Create Policies for Authenticated Users (Admin)
CREATE POLICY "Allow authenticated users to read all registrations"
    ON registrations FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to manage events"
    ON events FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================
-- INSERT SAMPLE EVENTS DATA
-- ============================================

INSERT INTO events (event_name, category, description, date, venue, team_size, prize) VALUES
('Free Fire Max: Battle Royale', 'E-Sports', 'Survival of the fittest. Drop into the battleground, loot, and outlast your opponents in this intense Battle Royale.', 'Day 1 - 10:00 AM', 'Gaming Lab A', '4 Members', '₹10,000'),
('Rocket League: Star Drift', 'E-Sports', 'Soccer meets driving in a zero-g arena. Master the aerials and claim victory among the stars.', 'Day 2 - 11:00 AM', 'Gaming Lab B', '3 Members', '₹5,000'),
('Orbital Hackathon', 'Technical', '24-hour coding marathon. Build solutions that solve real-world problems using futuristic tech stacks.', 'Day 1 - 9:00 AM', 'Main Auditorium', '2-4 Members', '₹20,000'),
('Blind Type', 'Technical', 'Test your touch-typing skills. Type accurate code without looking at the screen or seeing what you type.', 'Day 2 - 2:00 PM', 'Lab 3', 'Individual', '₹3,000'),
('Nebula UI/UX', 'Technical', 'Design the interfaces of tomorrow. Create user experiences that are out of this world.', 'Day 1 - 1:00 PM', 'Design Studio', 'Individual', '₹4,000'),
('Cyber-Security CTF', 'Technical', 'Capture The Flag. Hack your way through security layers and find the hidden flags.', 'Day 2 - 10:00 AM', 'Cyber Lab', '2 Members', '₹6,000'),
('Tech-Quiz Event Horizon', 'Fun', 'Test your knowledge of the tech universe. From silicon chips to supernovas.', 'Day 1 - 3:00 PM', 'Seminar Hall', '2 Members', '₹2,000'),
('Robo-Sumo: Anti-G', 'Fun', 'Battle of the bots. Push your opponent out of the ring in this high-torque showdown.', 'Day 2 - 4:00 PM', 'Open Arena', '3-5 Members', '₹8,000')
ON CONFLICT (event_name) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if tables were created successfully
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('events', 'registrations');

-- Check events data
SELECT event_name, category, prize FROM events ORDER BY event_name;

-- Check registrations count
SELECT COUNT(*) as total_registrations FROM registrations;