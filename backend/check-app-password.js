const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('🔍 App Password Verification Tool\n');

// Check current configuration
console.log('📋 Current Configuration:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? `Set (${process.env.EMAIL_PASS.length} characters)` : 'Not Set');
console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
console.log('');

// Test with different configurations
const testConfigurations = [
  {
    name: 'Current Gmail Configuration',
    config: {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    }
  },
  {
    name: 'Gmail with SMTP Settings',
    config: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    }
  },
  {
    name: 'Gmail with SSL',
    config: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    }
  }
];

async function testConfiguration(name, config) {
  console.log(`🧪 Testing: ${name}`);
  try {
    const transporter = nodemailer.createTransporter(config);
    await transporter.verify();
    console.log(`✅ ${name}: SUCCESS`);
    return true;
  } catch (error) {
    console.log(`❌ ${name}: FAILED - ${error.message}`);
    return false;
  }
}

async function runTests() {
  let success = false;
  
  for (const test of testConfigurations) {
    const result = await testConfiguration(test.name, test.config);
    if (result) {
      success = true;
      break;
    }
    console.log('');
  }
  
  console.log('\n📋 Troubleshooting Guide:');
  if (!success) {
    console.log('❌ All configurations failed. This indicates:');
    console.log('1. 2FA is not enabled on your Google account');
    console.log('2. App Password is incorrect or expired');
    console.log('3. Email address is incorrect');
    console.log('');
    console.log('🔧 Next Steps:');
    console.log('1. Go to https://myaccount.google.com/security');
    console.log('2. Enable 2-Step Verification if not enabled');
    console.log('3. Go to https://myaccount.google.com/apppasswords');
    console.log('4. Generate a new App Password');
    console.log('5. Update EMAIL_PASS in your .env file');
    console.log('');
    console.log('📧 Current App Password: ' + process.env.EMAIL_PASS);
    console.log('📧 Should be exactly 16 characters, no spaces');
  } else {
    console.log('✅ Email configuration is working!');
  }
}

runTests().catch(console.error);
