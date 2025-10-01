require('dotenv').config();

console.log('🔍 Debugging Email Credentials...');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'Not set');
console.log('EMAIL_PASS first 4 chars:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.substring(0, 4) : 'Not set');
console.log('EMAIL_PASS last 4 chars:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.substring(process.env.EMAIL_PASS.length - 4) : 'Not set');
console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
console.log('USE_MOCK_EMAIL:', process.env.USE_MOCK_EMAIL);

// Test with exact same config as emailService
const nodemailer = require('nodemailer');

const emailConfig = {
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};

console.log('\n📧 Testing with exact config:');
console.log('Config:', {
  service: emailConfig.service,
  user: emailConfig.auth.user,
  passLength: emailConfig.auth.pass ? emailConfig.auth.pass.length : 'Not set'
});

const transporter = nodemailer.createTransport(emailConfig);

transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Verification failed:', error.message);
  } else {
    console.log('✅ Server is ready to take our messages');
  }
});
