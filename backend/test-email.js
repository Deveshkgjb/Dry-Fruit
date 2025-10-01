const nodemailer = require('nodemailer');
require('dotenv').config();

// Test email configuration
const testEmail = async () => {
  console.log('🧪 Testing Email Configuration...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'Not Set');
  console.log('EMAIL_USER:', process.env.EMAIL_USER || 'Not Set');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set (hidden)' : 'Not Set');
  console.log('EMAIL_HOST:', process.env.EMAIL_HOST || 'Not Set');
  console.log('EMAIL_PORT:', process.env.EMAIL_PORT || 'Not Set');
  console.log('EMAIL_FROM_NAME:', process.env.EMAIL_FROM_NAME || 'Not Set');
  console.log('EMAIL_FROM_ADDRESS:', process.env.EMAIL_FROM_ADDRESS || 'Not Set');
  console.log('');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email configuration incomplete!');
    console.log('Please set EMAIL_USER and EMAIL_PASS in your .env file');
    return;
  }

  try {
    // Create transporter
    const emailConfig = {
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    };

    // If custom SMTP settings are provided, use them
    if (process.env.EMAIL_HOST) {
      emailConfig.host = process.env.EMAIL_HOST;
      emailConfig.port = parseInt(process.env.EMAIL_PORT) || 587;
      emailConfig.secure = process.env.EMAIL_SECURE === 'true';
      delete emailConfig.service;
    }

    console.log('📧 Creating email transporter...');
    const transporter = nodemailer.createTransport(emailConfig);

    // Verify connection
    console.log('🔍 Verifying email connection...');
    await transporter.verify();
    console.log('✅ Email connection verified successfully!');

    // Send test email
    const testEmailAddress = process.env.EMAIL_USER; // Send to yourself
    console.log(`📤 Sending test email to: ${testEmailAddress}`);

    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'Happilo Support',
        address: process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER
      },
      to: testEmailAddress,
      subject: '🧪 Happilo Email Test - Configuration Working!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Success!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Happilo Email Configuration</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Email Configuration Test</h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Congratulations! Your email configuration is working correctly.
            </p>
            
            <div style="background: #d1fae5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
              <div style="color: #10b981; font-size: 48px; margin-bottom: 15px;">✅</div>
              <h3 style="color: #065f46; margin: 0; font-size: 20px;">Email Service Active</h3>
            </div>
            
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Configuration Details:</h3>
              <ul style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Service: ${process.env.EMAIL_SERVICE || 'Gmail'}</li>
                <li>Host: ${process.env.EMAIL_HOST || 'Default'}</li>
                <li>Port: ${process.env.EMAIL_PORT || 'Default'}</li>
                <li>From: ${process.env.EMAIL_FROM_NAME || 'Happilo Support'}</li>
              </ul>
            </div>
            
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0;">
              Your Happilo application can now send emails for password resets, notifications, and other features.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            
            <div style="text-align: center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                © 2024 Happilo. All rights reserved.<br>
                This is a test email from your Happilo application.
              </p>
            </div>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('');
    console.log('🎉 Email configuration is working perfectly!');
    console.log('You can now use the forgot password feature and other email functions.');

  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting tips:');
    console.log('1. Make sure 2FA is enabled on your Google account');
    console.log('2. Generate an App Password (not your regular password)');
    console.log('3. Check that EMAIL_USER and EMAIL_PASS are set correctly');
    console.log('4. Verify your internet connection');
    console.log('');
    console.log('📖 See EMAIL_SETUP_GUIDE.md for detailed instructions');
  }
};

// Run the test
testEmail();
