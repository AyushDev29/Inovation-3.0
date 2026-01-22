# Scanner Images

This folder contains QR code scanner images for payment processing.

## Files Required:
- `bgmi-scanner.jpg` - QR code for BGMI tournament payment (₹100)
- `freefire-scanner.jpg` - QR code for Free Fire tournament payment (₹80)

## Image Requirements:
- Format: JPG or PNG
- Size: Recommended 400x400px
- Content: QR code for UPI payment
- Admin can replace these files without code changes

## Usage:
- Images are loaded from `/scanners/` path in the application
- If image fails to load, a placeholder will be shown
- Replace files with same names to update payment QR codes