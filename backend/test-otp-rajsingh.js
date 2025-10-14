// Force clear require cache
delete require.cache[require.resolve('dotenv')];

require('dotenv').config({ path: __dirname + '/.env' });

const mongoose = require('mongoose');
const User = require('./models/User');
const { sendOTPEmail } = require('./utils/emailService');

async function testOTPForRajSingh() {
  try {
    console.log('🧪 Testing OTP Sending for rajsinghindia2025@gmail.com\n');
    
    // Display environment
    console.log('📧 Email Configuration:');
    console.log('   EMAIL_USER:', process.env.EMAIL_USER);
    console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? `${process.env.EMAIL_PASS.substring(0, 4)}...${process.env.EMAIL_PASS.substring(process.env.EMAIL_PASS.length - 4)}` : 'NOT SET');
    console.log('   EMAIL_PASS Length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);
    console.log('   EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
    console.log('   USE_MOCK_EMAIL:', process.env.USE_MOCK_EMAIL);
    console.log('');
    
    // Connect to MongoDB
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const email = 'rajsinghindia2025@gmail.com';
    
    // Find user
    console.log('🔍 Finding user...');
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found! Run: node create-admin-rajsingh.js');
      return;
    }
    
    console.log('✅ User found:', user.name, `(${user.role})\n`);
    
    // Generate test OTP
    const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔢 Generated Test OTP:', testOTP);
    
    // Save OTP to database
    user.resetPasswordOTP = testOTP;
    user.resetPasswordOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    console.log('💾 OTP saved to database\n');
    
    // Try to send email
    console.log('📧 Attempting to send OTP email...\n');
    const result = await sendOTPEmail(email, testOTP, user.name);
    
    console.log('\n📊 Result:', result);
    
    if (result.success) {
      console.log('\n✅ SUCCESS! OTP email sent successfully!');
      console.log('📬 Check inbox: rajsinghindia2025@gmail.com');
      console.log('🔢 OTP:', testOTP);
      console.log('⏱️  Delivery time:', result.deliveryTime, 'ms');
    } else {
      console.log('\n❌ FAILED! Could not send email');
      console.log('Error:', result.error);
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Verify EMAIL_PASS in .env file');
      console.log('2. Check if Gmail App Password is correct');
      console.log('3. Restart backend server to reload environment variables');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

testOTPForRajSingh();


