# 📧 Email Setup Instructions for rajsinghindia2025@gmail.com

## Problem
Password reset OTPs are not being sent because the Gmail App Password is not configured correctly for `rajsinghindia2025@gmail.com`.

## Solution: Generate New App Password

### Step 1: Generate Gmail App Password

1. **Open Gmail App Passwords page:**
   - URL: https://myaccount.google.com/apppasswords
   - Sign in with: `rajsinghindia2025@gmail.com`

2. **If you see "App passwords" option:**
   - Click **"Select app"** → Choose **"Mail"**
   - Click **"Select device"** → Choose **"Other (Custom name)"**
   - Enter name: **"Dry Fruits Password Reset"**
   - Click **"Generate"**

3. **If you don't see "App passwords":**
   - You need to enable **2-Step Verification** first:
     1. Go to: https://myaccount.google.com/security
     2. Enable **2-Step Verification**
     3. Then return to: https://myaccount.google.com/apppasswords

4. **Copy the 16-character password:**
   - It will be shown like: `xxxx xxxx xxxx xxxx`
   - **IMPORTANT:** Remove all spaces
   - Example: `abcd efgh ijkl mnop` becomes `abcdefghijklmnop`

### Step 2: Update Configuration

Run the setup script:
```bash
cd /Users/deveshfuloria/Dry-fruits/backend
node setup-email-rajsingh.js
```

Or manually update `.env` file:
```env
EMAIL_USER=rajsinghindia2025@gmail.com
EMAIL_FROM_ADDRESS=rajsinghindia2025@gmail.com
EMAIL_PASS=your_16_character_app_password_here
EMAIL_SERVICE=gmail
USE_MOCK_EMAIL=false
```

### Step 3: Restart Backend Server

Stop and restart your backend server to load the new environment variables:
```bash
# Stop the server (Ctrl+C in the terminal where it's running)
# Then start it again:
cd /Users/deveshfuloria/Dry-fruits/backend
npm start
```

### Step 4: Test OTP Sending

```bash
cd /Users/deveshfuloria/Dry-fruits/backend
node test-otp-rajsingh.js
```

If successful, you should see:
```
✅ SUCCESS! OTP email sent successfully!
📬 Check inbox: rajsinghindia2025@gmail.com
```

## Troubleshooting

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Causes:**
1. App password is incorrect or has spaces
2. 2-Step Verification not enabled on Gmail account
3. Using wrong Gmail account to generate app password

**Solutions:**
1. Regenerate the app password for `rajsinghindia2025@gmail.com`
2. Make sure to remove ALL spaces from the password
3. Verify 2-Step Verification is enabled

### How to Check Current Configuration

```bash
cd /Users/deveshfuloria/Dry-fruits/backend
node -e "require('dotenv').config(); console.log('USER:', process.env.EMAIL_USER); console.log('PASS length:', process.env.EMAIL_PASS?.length);"
```

Should show:
```
USER: rajsinghindia2025@gmail.com
PASS length: 16
```

## Important Notes

- Each Gmail account needs its own unique App Password
- App Passwords are different from your regular Gmail password
- The app password `yufdstjjiapkoqjv` is for a DIFFERENT account
- You MUST generate a NEW app password for `rajsinghindia2025@gmail.com`
- Never share your app password publicly
- If compromised, revoke it and generate a new one

## Quick Reference

| Setting | Value |
|---------|-------|
| Gmail Account | rajsinghindia2025@gmail.com |
| Admin User Email | rajsinghindia2025@gmail.com |
| App Password Length | 16 characters (no spaces) |
| Generate URL | https://myaccount.google.com/apppasswords |

---

Need help? Check the backend logs when testing OTP sending.


