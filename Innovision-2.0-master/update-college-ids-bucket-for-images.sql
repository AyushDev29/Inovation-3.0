-- ============================================
-- UPDATE COLLEGE-IDS BUCKET FOR IMAGE UPLOADS
-- Change from PDF to Image file support
-- ============================================

-- Update the college-ids bucket to support image files
UPDATE storage.buckets 
SET 
    allowed_mime_types = ARRAY[
        'image/jpeg', 
        'image/jpg', 
        'image/png', 
        'image/webp',
        'image/heic',
        'image/heif'
    ],
    file_size_limit = 10485760  -- 10MB limit for images
WHERE id = 'college-ids';

-- Verify the update
SELECT 
    id, 
    name, 
    public, 
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE id = 'college-ids';

-- Note: This change allows users to upload photos of their college IDs
-- instead of PDF files. The new requirements are:
-- 
-- For Team Events:
-- - All team members' college IDs must be visible in ONE photo
-- - Photo should be clear and readable
-- - Maximum file size: 10MB
-- - Supported formats: JPEG, JPG, PNG, WEBP, HEIC, HEIF
--
-- For Individual Events:
-- - Single college ID photo
-- - Same file size and format requirements