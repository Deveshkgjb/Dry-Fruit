require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function testRajSinghOTP() {
  try {
    console.log('🔧 Testing OTP for rajsinghindia2025@gmail.com\n');
    
    // Connect to MongoDB
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const email = 'rajsinghindia2025@gmail.com';
    
    // Check if user exists
    console.log('🔍 Checking if user exists...');
    const user = await User.findOne({ email });
    
    if (user) {
      console.log('✅ User found!\n');
      console.log('📧 Email:', user.email);
      console.log('👤 Name:', user.name);
      console.log('🔑 Role:', user.role);
      console.log('🔓 Active:', user.isActive);
      
      if (user.resetPasswordOTP) {
        console.log('\n📬 OTP Data:');
        console.log('🔢 Current OTP:', user.resetPasswordOTP);
        console.log('⏰ OTP Expiry:', user.resetPasswordOTPExpiry);
        console.log('🕐 Current Time:', new Date());
        console.log('⏳ OTP Valid:', user.resetPasswordOTPExpiry > new Date() ? '✅ Yes' : '❌ No (expired)');
      } else {
        console.log('\n📭 No OTP data found (OTP not requested yet)');
      }
      
      console.log('\n🔧 Email Configuration Check:');
      console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
      console.log('🔒 EMAIL_PASS configured:', process.env.EMAIL_PASS ? '✅ Yes' : '❌ No');
      console.log('🔒 EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'Not set');
      console.log('📧 EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
      
      if (process.env.EMAIL_PASS === 'your-16-character-app-password-here') {
        console.log('\n❌ EMAIL CONFIGURATION ERROR!');
        console.log('❌ EMAIL_PASS is set to placeholder value!');
        console.log('\n🔧 TO FIX THIS:');
        console.log('1. Go to https://myaccount.google.com/apppasswords');
        console.log('2. Sign in with jauraju263@gmail.com');
        console.log('3. Create a new App Password named "Dry Fruits App"');
        console.log('4. Copy the 16-character password (format: xxxx xxxx xxxx xxxx)');
        console.log('5. Update your .env file: EMAIL_PASS=xxxxxxxxxxxx (remove spaces)');
        console.log('6. Restart your backend server');
      } else {
        console.log('\n✅ Email password is configured (not a placeholder)');
      }
      
    } else {
      console.log('❌ User not found!\n');
      console.log('🔧 Run this command to create the admin user:');
      console.log('node create-admin-rajsingh.js');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

testRajSinghOTP();


