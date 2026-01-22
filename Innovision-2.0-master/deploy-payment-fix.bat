@echo off
echo ========================================
echo  PAYMENT UPLOAD FIX DEPLOYMENT
echo ========================================
echo.

echo [1/4] Building the project...
npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo [2/4] Checking for payment scanner images...
if not exist "public\scanners\bgmi-scanner.jpeg" (
    echo WARNING: BGMI scanner image missing at public\scanners\bgmi-scanner.jpeg
    echo Please add the QR code image for BGMI payments
)
if not exist "public\scanners\freefire-scanner.jpg" (
    echo WARNING: Free Fire scanner image missing at public\scanners\freefire-scanner.jpg
    echo Please add the QR code image for Free Fire payments
)

echo.
echo [3/4] Deploying to Firebase...
firebase deploy
if %errorlevel% neq 0 (
    echo ERROR: Firebase deployment failed!
    pause
    exit /b 1
)

echo.
echo [4/4] Post-deployment checklist:
echo ✓ Enhanced payment upload with fallback mechanism
echo ✓ Mobile-friendly file input with camera capture
echo ✓ Better error handling and validation
echo ✓ Automatic bucket creation if missing
echo.
echo IMPORTANT: If payment uploads still fail, run this in Supabase SQL Editor:
echo   - create-payment-bucket-policies.sql
echo.
echo Or manually create 'payment-screenshots' bucket in Supabase Dashboard
echo.
echo ========================================
echo  DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Test the payment upload on mobile device:
echo 1. Go to BGMI registration
echo 2. Fill the form and proceed to payment
echo 3. Try uploading a payment screenshot
echo 4. Check browser console for any errors
echo.
pause