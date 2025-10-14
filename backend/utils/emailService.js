const nodemailer = require('nodemailer');

// Create transporter based on environment variables
const createTransport = () => {
  const emailConfig = {
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    // Ultra-fast delivery optimization
    pool: true,
    maxConnections: 15,
    maxMessages: 300,
    rateLimit: 50, // 50 emails per second
    // Ultra-fast connection timeouts
    connectionTimeout: 15000, // 15 seconds
    greetingTimeout: 8000,    // 8 seconds
    socketTimeout: 15000,     // 15 seconds
    // Immediate retry for critical emails
    retry: {
      times: 1,
      interval: 1000 // 1 second retry
    },
    // Enable keep-alive for faster connections
    keepAlive: true,
    keepAliveMsecs: 30000,
    // Gmail-specific optimizations
    tls: {
      rejectUnauthorized: false
    },
    debug: false,
    logger: false
  };

  // If custom SMTP settings are provided, use them instead of service
  if (process.env.EMAIL_HOST) {
    emailConfig.host = process.env.EMAIL_HOST;
    emailConfig.port = parseInt(process.env.EMAIL_PORT) || 587;
    emailConfig.secure = process.env.EMAIL_SECURE === 'true';
    emailConfig.auth = {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    };
    // Remove service property when using custom SMTP
    delete emailConfig.service;
  }

  console.log('📧 Email Configuration:', {
    service: emailConfig.service || 'Custom SMTP',
    host: emailConfig.host || 'Default',
    port: emailConfig.port || 'Default',
    user: emailConfig.auth.user ? 'Set' : 'Not Set',
    pass: emailConfig.auth.pass ? 'Set' : 'Not Set'
  });

  return nodemailer.createTransport(emailConfig);
};

// Send OTP email
const sendOTPEmail = async (email, otp, userName = 'Admin') => {
  try {
    console.log('📧 STEP 13: Email Service - Starting OTP email send');
    console.log('📧 STEP 13: Email Service - Target email:', email);
    console.log('📧 STEP 13: Email Service - User name:', userName);
    
    // Temporary mock for testing - remove this when email is working
    if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_EMAIL === 'true') {
      console.log('📧 STEP 13: Email Service - Using MOCK email mode');
      // Mock email - OTP would be sent to user
      // Mock email sent
      return { success: true, messageId: 'mock-otp-email' };
    }

    console.log('📧 STEP 13: Email Service - Using REAL email mode');
    
    const transporter = createTransport();
    
    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'Mufindryfruit Support',
        address: process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER || 'noreply@mufindryfruit.com'
      },
      to: email,
      subject: '🚨 URGENT: Password Reset OTP - Mufindryfruit Admin',
      priority: 'high',
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Mailer': 'Mufindryfruit Admin System'
      },
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Mufindryfruit</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Dry Fruits & Nuts</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Password Reset Request</h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Hello ${userName},
            </p>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
              We received a request to reset your admin password. Use the OTP below to complete the password reset process:
            </p>
            
            <div style="background: #ffffff; border: 2px solid #10b981; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your OTP</p>
              <h1 style="color: #10b981; font-size: 36px; margin: 0; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</h1>
            </div>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 4px;">
              <p style="color: #92400e; margin: 0; font-size: 14px; font-weight: 500;">
                ⏰ <strong>Important:</strong> This OTP will expire in 10 minutes.
              </p>
            </div>
            
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0;">
              If you didn't request this password reset, please ignore this email. Your account remains secure.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            
            <div style="text-align: center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                © 2024 Mufindryfruit. All rights reserved.<br>
                This is an automated message, please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      `
    };

    // Ultra-fast delivery with immediate retry
    console.log('📧 STEP 14: Email Service - Attempting to send email via SMTP');
    let lastError;
    const startTime = Date.now();
    
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`📧 STEP 14: Email Service - Attempt ${attempt} of 2`);
        const result = await transporter.sendMail(mailOptions);
        const deliveryTime = Date.now() - startTime;
        
        console.log('✅ STEP 15: Email Service - Email sent successfully!');
        console.log('📧 STEP 15: Email Service - Message ID:', result.messageId);
        console.log('⏱️ STEP 15: Email Service - Delivery time:', deliveryTime + 'ms');
        console.log('🎉 EMAIL SENT SUCCESSFULLY! OTP delivered to user inbox');
        console.log('📬 User should check their email now');
        
        return { success: true, messageId: result.messageId, deliveryTime };
      } catch (error) {
        lastError = error;
        const attemptTime = Date.now() - startTime;
        
        console.log(`❌ STEP 14 ERROR: Email Service - Attempt ${attempt} failed in ${attemptTime}ms`);
        console.log('❌ STEP 14 ERROR: Email Service - Error:', error.message);
        
        if (attempt < 2) {
          console.log('🔄 STEP 14: Email Service - Retrying in 500ms...');
          // Immediate retry...
          await new Promise(resolve => setTimeout(resolve, 500)); // 500ms retry
        }
      }
    }
    
    console.log('❌ STEP 15 ERROR: Email Service - All attempts failed');
    console.log('❌ STEP 15 ERROR: Email Service - Final error:', lastError.message);
    // All email attempts failed
    return { success: false, error: lastError.message };
    
  } catch (error) {
    console.error('❌ Error in sendOTPEmail:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset success email
const sendPasswordResetSuccessEmail = async (email, userName = 'Admin') => {
  try {
    // Temporary mock for testing - remove this when email is working
    if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_EMAIL === 'true') {
      console.log('📧 MOCK EMAIL - Success Email would be sent to:', email);
      console.log('📧 MOCK EMAIL - User:', userName);
      return { success: true, messageId: 'mock-success-email' };
    }
    
    const transporter = createTransport();
    
    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'Mufindryfruit Support',
        address: process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER || 'noreply@mufindryfruit.com'
      },
      to: email,
      subject: 'Password Reset Successful - Mufindryfruit Admin',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Mufindryfruit</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Dry Fruits & Nuts</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
            <div style="background: #d1fae5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 25px;">
              <div style="color: #10b981; font-size: 48px; margin-bottom: 15px;">✅</div>
              <h2 style="color: #065f46; margin: 0; font-size: 24px;">Password Reset Successful!</h2>
            </div>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Hello ${userName},
            </p>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
              Your admin password has been successfully reset. You can now log in to your admin dashboard using your new password.
            </p>
            
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Next Steps:</h3>
              <ul style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Log in to your admin dashboard using your new password</li>
                <li>Consider changing your password again for additional security</li>
                <li>Enable two-factor authentication if available</li>
              </ul>
            </div>
            
            <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 25px 0; border-radius: 4px;">
              <p style="color: #991b1b; margin: 0; font-size: 14px; font-weight: 500;">
                🔒 <strong>Security Notice:</strong> If you didn't reset your password, please contact support immediately.
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            
            <div style="text-align: center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                © 2024 Mufindryfruit. All rights reserved.<br>
                This is an automated message, please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset success email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error sending password reset success email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset link email
const sendPasswordResetLinkEmail = async (email, resetLink, userName = 'User') => {
  try {
    // Temporary mock for testing - remove this when email is working
    if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_EMAIL === 'true') {
      console.log('📧 MOCK EMAIL - Reset Link Email would be sent to:', email);
      console.log('📧 MOCK EMAIL - Reset Link:', resetLink);
      console.log('📧 MOCK EMAIL - User:', userName);
      return { success: true, messageId: 'mock-reset-link-email' };
    }
    
    const transporter = createTransport();
    
    const mailOptions = {
      from: {
        name: 'Mufindryfruit Support',
        address: process.env.EMAIL_USER || 'noreply@mufindryfruit.com'
      },
      to: email,
      subject: 'Password Reset Link - Mufindryfruit',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Mufindryfruit</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Dry Fruits & Nuts</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Password Reset Link</h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Hello ${userName},
            </p>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
              Your OTP has been verified successfully. Click the button below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                Reset My Password
              </a>
            </div>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 4px;">
              <p style="color: #92400e; margin: 0; font-size: 14px; font-weight: 500;">
                ⏰ <strong>Important:</strong> This link will expire in 15 minutes.
              </p>
            </div>
            
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetLink}" style="color: #10b981; word-break: break-all;">${resetLink}</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            
            <div style="text-align: center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                © 2024 Mufindryfruit. All rights reserved.<br>
                This is an automated message, please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Reset link email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error sending reset link email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetSuccessEmail,
  sendPasswordResetLinkEmail
};
