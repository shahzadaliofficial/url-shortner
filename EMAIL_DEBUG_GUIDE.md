# Email Debug & Test Guide

## Current Issue
The production deployment is trying to send real emails using Gmail SMTP but experiencing authentication failures.

## Quick Fix Applied
1. **Enhanced Error Handling**: Email service now gracefully handles SMTP failures
2. **Fallback Mode**: If email sending fails, user registration still succeeds
3. **Debug Logging**: Better logging to identify SMTP configuration issues
4. **Console Fallback**: If no SMTP config, verification details are logged to console

## For Production Testing
Since email sending is failing, you can still test the verification flow:

### Option 1: Manual Verification URL
1. Register a new user
2. Check the backend logs (Vercel console) for the verification URL
3. Copy the verification URL and test it manually

### Option 2: Test with Console Logs
The system will log verification details to console when SMTP fails:
```
=== EMAIL FALLBACK DEBUG ===
Email: user@example.com
Name: User Name
Verification Token: abc123...
Verification URL: https://url-shortner-shahzad.vercel.app/verify-email?token=abc123...
============================
```

## SMTP Configuration Check
Current environment variables being checked:
- `SMTP_HOST`: smtp.gmail.com
- `SMTP_USER`: malikbilal20553@gmail.com  
- `SMTP_PASS`: sqgp ugpw qnxu sbwr
- `FROM_EMAIL`: malikbilal20553@gmail.com

## Common Gmail SMTP Issues
1. **App Password**: Make sure you're using an App Password, not the regular Gmail password
2. **2FA Required**: Gmail requires 2-Factor Authentication to generate App Passwords
3. **Less Secure Apps**: Ensure "Less secure app access" is enabled (if using regular password)

## Next Steps
1. **Verify Environment Variables**: Check that all SMTP variables are set correctly in Vercel
2. **Test Locally**: Run the backend locally with the same environment variables
3. **Alternative**: Consider using SendGrid, Mailgun, or other email services for better reliability

## Temporary Workaround
The system now allows users to register and login without email verification in case of SMTP failures. Users can still access the application functionality while email issues are resolved.
