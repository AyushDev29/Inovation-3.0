@echo off
echo ========================================
echo INNOVISION 3.0 - DEPLOYMENT SCRIPT
echo ========================================

echo.
echo 1. Adding all changes to git...
git add .

echo.
echo 2. Committing changes...
git commit -m "feat: Add ID card upload functionality for user verification

- Added PDF upload requirement for all registrations
- Users must upload college ID card (max 5MB PDF)
- Added database columns for ID card storage
- Updated admin panel to view/download ID cards
- Added file validation and upload progress
- Updated sponsor logos with actual images
- Fixed contact section with faculty info and Instagram link
- Updated footer to show only Instagram connection

Database changes required:
- Run add-id-card-upload.sql in Supabase
- Create 'id-cards' storage bucket with policies
- See ID_CARD_SETUP_GUIDE.md for complete setup"

echo.
echo 3. Pushing to remote repository...
git push origin master

echo.
echo 4. Building project for deployment...
npm run build

echo.
echo 5. Deploying to Firebase...
firebase deploy

echo.
echo ========================================
echo DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Next steps:
echo 1. Run the SQL script in Supabase (add-id-card-upload.sql)
echo 2. Create 'id-cards' storage bucket in Supabase
echo 3. Test registration with ID card upload
echo 4. Verify admin panel shows ID cards
echo.
echo See ID_CARD_SETUP_GUIDE.md for detailed setup instructions.
echo.
pause