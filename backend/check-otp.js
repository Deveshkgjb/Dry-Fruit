require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkOTP() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const user = await User.findOne({ email: 'admin@happilo.com' });
    if (user) {
      console.log('👤 User found:', user.email);
      console.log('🔢 Current OTP:', user.resetPasswordOTP);
      console.log('⏰ OTP Expiry:', user.resetPasswordOTPExpiry);
      console.log('🕐 Current Time:', new Date());
      console.log('⏳ OTP Valid:', user.resetPasswordOTPExpiry > new Date());
    } else {
      console.log('❌ User not found');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkOTP();
