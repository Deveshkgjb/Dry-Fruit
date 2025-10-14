require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkAdminUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Find all admin users
    const admins = await User.find({ role: 'admin' });
    
    if (admins.length === 0) {
      console.log('❌ No admin users found in the database');
    } else {
      console.log(`✅ Found ${admins.length} admin user(s):\n`);
      admins.forEach((admin, index) => {
        console.log(`Admin ${index + 1}:`);
        console.log(`  📧 Email: ${admin.email}`);
        console.log(`  👤 Name: ${admin.name}`);
        console.log(`  🔑 Role: ${admin.role}`);
        console.log(`  🔢 OTP: ${admin.resetPasswordOTP || 'None'}`);
        console.log(`  ⏰ OTP Expiry: ${admin.resetPasswordOTPExpiry || 'None'}`);
        console.log('');
      });
    }
    
    // Also check for the specific email
    const specificUser = await User.findOne({ email: 'admin@happilo.com' });
    if (specificUser) {
      console.log('\n📧 User with email admin@happilo.com:');
      console.log(`  👤 Name: ${specificUser.name}`);
      console.log(`  🔑 Role: ${specificUser.role}`);
      console.log(`  🔢 OTP: ${specificUser.resetPasswordOTP || 'None'}`);
    } else {
      console.log('\n❌ No user found with email: admin@happilo.com');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkAdminUsers();
