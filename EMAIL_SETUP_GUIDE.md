# 📧 Email Setup Guide - Google Gmail Configuration

This guide will help you set up Google Gmail to send emails from your Happilo application.

## 🔧 Step 1: Enable 2-Factor Authentication

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Sign in with your Google account
3. Under "Signing in to Google", click **2-Step Verification**
4. Follow the setup process to enable 2FA

## 🔑 Step 2: Generate App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click **App passwords**
3. Select **Mail** as the app
4. Select **Other (custom name)** as the device
5. Enter "Happilo App" as the name
6. Click **Generate**
7. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

## ⚙️ Step 3: Update Environment Variables

Open your `.env` file in the backend directory and update these values:

```env
# Email Configuration (Google Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM_NAME=Happilo Support
EMAIL_FROM_ADDRESS=noreply@happilo.com

# Email Settings
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_AUTH=true
```

### Example:
```env
EMAIL_USER=john.doe@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

## 🚀 Step 4: Test Email Configuration

1. Restart your backend server:
   ```bash
   cd backend
   npm start
   ```

2. Test the forgot password flow:
   - Go to admin login page
   - Click "Forgot Password"
   - Enter your email
   - Check if you receive the OTP email

## 🔒 Security Best Practices

1. **Never commit your `.env` file** to version control
2. **Use App Passwords** instead of your main Google password
3. **Keep your App Password secure** and don't share it
4. **Regularly rotate** your App Password for security

## 🐛 Troubleshooting

### Common Issues:

1. **"Invalid login" error:**
   - Make sure 2FA is enabled
   - Verify the App Password is correct (16 characters, no spaces)
   - Check that the email address is correct

2. **"Less secure app access" error:**
   - This shouldn't happen with App Passwords
   - Make sure you're using App Password, not your regular password

3. **"Connection timeout" error:**
   - Check your internet connection
   - Verify firewall settings
   - Try using port 465 with `EMAIL_SECURE=true`

### Alternative Ports:
```env
# For SSL (more secure)
EMAIL_PORT=465
EMAIL_SECURE=true

# For TLS (default)
EMAIL_PORT=587
EMAIL_SECURE=false
```

## 📧 Email Templates

The application includes these email templates:
- **OTP Email**: Sent when user requests password reset
- **Reset Link Email**: Sent after OTP verification
- **Success Email**: Sent after successful password reset

## 🔄 Testing Email Flow

1. **Step 1**: Enter email → Receive OTP
2. **Step 2**: Enter OTP → Receive reset link
3. **Step 3**: Click reset link → Set new password
4. **Step 4**: Password reset → Receive success email

## 📞 Support

If you encounter issues:
1. Check the server logs for error messages
2. Verify all environment variables are set correctly
3. Test with a simple email first
4. Contact support if problems persist

---

**Note**: This setup uses Gmail's SMTP service. For production, consider using dedicated email services like SendGrid, AWS SES, or Mailgun for better deliverability and features.
