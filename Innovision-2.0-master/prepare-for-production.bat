@echo off
echo ========================================
echo  PREPARE FOR PRODUCTION - INNOVISION 3.0
echo ========================================
echo.

echo ⚠️  WARNING: This will prepare the system for production
echo    - All test registrations will be cleared
echo    - All test files will be removed
echo    - Only official events will remain
echo.

set /p confirm="Are you sure you want to continue? (y/N): "
if /i not "%confirm%"=="y" (
    echo Operation cancelled.
    pause
    exit /b 0
)

echo.
echo [1/4] Building latest code...
npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo [2/4] Deploying to Firebase...
firebase deploy
if %errorlevel% neq 0 (
    echo ERROR: Deployment failed!
    pause
    exit /b 1
)

echo.
echo [3/4] MANUAL STEP REQUIRED:
echo ========================================
echo Please complete these steps manually:
echo.
echo 1. Go to Supabase Dashboard → SQL Editor
echo 2. Run the script: clear-all-test-data.sql
echo 3. Verify the cleanup was successful
echo.
echo 4. Go to Supabase Dashboard → Storage
echo 5. Clear college-ids bucket (delete all files)
echo 6. Clear payment-screenshots bucket (delete all files)
echo.
pause

echo.
echo [4/4] Production Readiness Checklist:
echo ========================================
echo Please verify these items:
echo.
echo ✓ Database cleared and contains only official events
echo ✓ Storage buckets are empty
echo ✓ Registration forms work correctly
echo ✓ Payment system works on mobile
echo ✓ Admin panel functions properly
echo ✓ QR codes are correct and scannable
echo.

echo ========================================
echo  PRODUCTION PREPARATION COMPLETE!
echo ========================================
echo.
echo Your system is now ready for the official event.
echo.
echo Next steps:
echo 1. Test one complete registration flow
echo 2. Verify admin panel shows the registration
echo 3. Announce the event to participants
echo.
echo Live Site: https://innovision-3.web.app
echo.
pause