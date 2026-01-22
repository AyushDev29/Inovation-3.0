-- ============================================
-- QUICK CLEAR ALL TEST DATA FOR PRODUCTION
-- ============================================
-- ⚠️ WARNING: This will DELETE ALL test registrations and files
-- Only run when ready to go live with official event data

-- 1. Show current data count
SELECT 
    'BEFORE CLEANUP' as status,
    (SELECT COUNT(*) FROM registrations) as registrations_count,
    (SELECT COUNT(*) FROM events) as events_count,
    (SELECT COUNT(*) FROM storage.objects WHERE bucket_id = 'college-ids') as college_files_count,
    (SELECT COUNT(*) FROM storage.objects WHERE bucket_id = 'payment-screenshots') as payment_files_count;

-- 2. Clear all test registrations
DELETE FROM registrations;

-- 3. Clear all storage files
DELETE FROM storage.objects WHERE bucket_id = 'college-ids';
DELETE FROM storage.objects WHERE bucket_id = 'payment-screenshots';

-- 4. Reset events to official production events
DELETE FROM events;

INSERT INTO events (event_name, category, description, date, venue, team_size, prize) VALUES
('BGMI Esports Tournament', 'E-Sports', 'Competitive BGMI battle with ranked matches across multiple rounds', 'Day 1 & Day 2 (5–6 Feb), 9:00 AM – 12:00 PM', 'College Campus', '4 Members', '₹6,000'),
('Free Fire Esports Tournament', 'E-Sports', 'High-intensity Free Fire battle royale tournament with elimination rounds', 'Day 3 (7 Feb), 9:00 AM – 11:00 AM', 'College Campus', '4 Members', '₹5,000'),
('Tech Triathlon', 'Technical', 'Multi-stage technical competition covering coding, debugging, and system design', 'Day 1 (5 Feb), 2:00 PM – 5:00 PM', 'Computer Lab', 'Individual', '₹3,000'),
('Hackastra', 'Technical', '24-hour hackathon to build innovative solutions for real-world problems', 'Day 1-2 (5-6 Feb), 6:00 PM – 6:00 PM', 'Main Hall', '2-4 Members', '₹15,000'),
('Fun Fusion', 'Fun', 'Mixed fun activities including games, quizzes, and creative challenges', 'Day 2 (6 Feb), 10:00 AM – 1:00 PM', 'Open Ground', '2-3 Members', '₹2,000'),
('Fashion Flex', 'Cultural', 'Fashion show and styling competition showcasing creativity and trends', 'Day 3 (7 Feb), 3:00 PM – 6:00 PM', 'Auditorium', 'Individual', '₹4,000');

-- 5. Show final status
SELECT 
    'AFTER CLEANUP' as status,
    (SELECT COUNT(*) FROM registrations) as registrations_count,
    (SELECT COUNT(*) FROM events) as events_count,
    (SELECT COUNT(*) FROM storage.objects WHERE bucket_id = 'college-ids') as college_files_count,
    (SELECT COUNT(*) FROM storage.objects WHERE bucket_id = 'payment-screenshots') as payment_files_count;

-- 6. Show official events
SELECT 
    '📅 OFFICIAL EVENTS' as section,
    event_name,
    category,
    team_size,
    prize,
    date
FROM events 
ORDER BY 
    CASE category 
        WHEN 'E-Sports' THEN 1 
        WHEN 'Technical' THEN 2 
        WHEN 'Fun' THEN 3 
        WHEN 'Cultural' THEN 4 
        ELSE 5 
    END,
    event_name;

SELECT '🎉 DATABASE CLEARED - READY FOR PRODUCTION!' as final_status;