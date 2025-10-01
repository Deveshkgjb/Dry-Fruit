# Email Setup for Password Reset OTP

This document explains how to set up email functionality for the password reset OTP feature.

## 📧 Email Configuration

The forgot password feature now sends a 6-digit OTP via email instead of a reset token. Here's how to configure it:

### 1. Add Email Environment Variables

Add these variables to your `.env` file in the backend directory:

```env
# Email Configuration (for password reset OTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
EMAIL_SERVICE=gmail
```

### 2. Gmail Setup (Recommended for Development)

#### Option A: Use Gmail with App Password (Recommended)

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password**:
   - Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Enter "Happilo Admin" as the app name
   - Copy the generated 16-character password
3. **Use the App Password** as `EMAIL_PASS` in your `.env` file

#### Option B: Use Gmail with Regular Password (Less Secure)

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-regular-gmail-password
EMAIL_SERVICE=gmail
```

### 3. Other Email Providers

#### Outlook/Hotmail
```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
EMAIL_SERVICE=hotmail
```

#### Yahoo Mail
```env
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
EMAIL_SERVICE=yahoo
```

#### Custom SMTP
```env
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-password
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

## 🔧 How It Works

### Backend Process:
1. User requests password reset with email
2. System generates 6-digit OTP
3. OTP is saved to database with 10-minute expiry
4. Email is sent with beautiful HTML template
5. User enters OTP + new password
6. System validates OTP and updates password
7. Success email is sent

### Frontend Process:
1. User clicks "Forgot Password?" on login page
2. User enters email address
3. System sends OTP to email
4. User navigates to reset password page
5. User enters OTP and new password
6. Password is updated successfully

## 📱 Email Templates

The system sends two types of emails:

### 1. OTP Email
- Beautiful HTML design with Happilo branding
- 6-digit OTP prominently displayed
- 10-minute expiry notice
- Security warnings

### 2. Success Email
- Confirmation of password reset
- Security recommendations
- Next steps guidance

## 🧪 Testing the Feature

### Step 1: Configure Email
1. Add email credentials to `.env` file
2. Restart the backend server

### Step 2: Test Forgot Password
1. Go to admin login page
2. Click "Forgot your password?"
3. Enter admin email: `admin@happilo.com`
4. Check your email for the OTP

### Step 3: Test Password Reset
1. Go to `/admin/reset-password`
2. Enter email and click "Send OTP"
3. Enter the OTP from your email
4. Set new password
5. Login with new password

## 🔒 Security Features

- **OTP Expiry**: OTPs expire after 10 minutes
- **Admin Only**: Only admin accounts can reset passwords
- **Rate Limiting**: Built-in protection against spam
- **Secure Storage**: OTPs are hashed and stored securely
- **Email Validation**: Proper email format validation
- **No Email Disclosure**: Doesn't reveal if email exists

## 🚨 Troubleshooting

### Email Not Sending
1. Check email credentials in `.env`
2. Verify 2FA is enabled for Gmail
3. Check spam folder
4. Verify app password is correct

### OTP Not Working
1. Ensure OTP is entered within 10 minutes
2. Check OTP is exactly 6 digits
3. Verify email matches the one OTP was sent to

### Backend Errors
1. Check server logs for email errors
2. Verify nodemailer is installed
3. Check internet connection
4. Verify email service configuration

## 📝 Environment Variables Summary

```env
# Required for email functionality
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_SERVICE=gmail

# Optional
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 🎯 Demo Credentials

For testing, use these admin credentials:
- **Email**: `admin@happilo.com`
- **Password**: `admin123`

The system will send OTP emails to the configured `EMAIL_USER` address.
