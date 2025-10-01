require('dotenv').config();
const { sendPasswordResetLinkEmail } = require('./utils/emailService');

async function testResetLinkEmail() {
  try {
    console.log('🧪 Testing Reset Link Email...');
    
    const testEmail = 'admin@happilo.com';
    const testResetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/reset-password?token=test-token-123`;
    const testUserName = 'Admin';
    
    console.log('📧 Sending test reset link email...');
    const result = await sendPasswordResetLinkEmail(testEmail, testResetLink, testUserName);
    
    if (result.success) {
      console.log('✅ Reset link email sent successfully!');
      console.log('📧 Message ID:', result.messageId);
    } else {
      console.log('❌ Failed to send reset link email:', result.error);
    }
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testResetLinkEmail();
