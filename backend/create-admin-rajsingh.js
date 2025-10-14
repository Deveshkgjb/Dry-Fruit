require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  try {
    console.log('🔧 Creating Admin User for rajsinghindia2025@gmail.com\n');
    
    // Connect to MongoDB
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const email = 'rajsinghindia2025@gmail.com';
    
    // Check if user already exists
    console.log('🔍 Checking if user already exists...');
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      console.log('✅ User already exists!');
      console.log('📧 Email:', existingUser.email);
      console.log('👤 Name:', existingUser.name);
      console.log('🔑 Role:', existingUser.role);
      
      if (existingUser.role !== 'admin') {
        console.log('\n⚠️  User exists but is NOT an admin!');
        console.log('🔄 Updating user role to admin...');
        
        existingUser.role = 'admin';
        await existingUser.save();
        
        console.log('✅ User role updated to admin successfully!');
      } else {
        console.log('\n✅ User is already an admin!');
      }
      
      console.log('\n🎉 You can now use this email to reset password!');
      console.log('📧 Email: rajsinghindia2025@gmail.com');
      
    } else {
      console.log('❌ User does not exist. Creating new admin user...\n');
      
      // Create new admin user
      const password = 'Admin@123'; // Default password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newAdmin = new User({
        name: 'Raj Singh',
        email: email,
        password: hashedPassword,
        role: 'admin',
        phone: '9876543210' // Optional
      });
      
      await newAdmin.save();
      
      console.log('✅ Admin user created successfully!\n');
      console.log('📧 Email:', email);
      console.log('👤 Name: Raj Singh');
      console.log('🔑 Role: admin');
      console.log('🔒 Password: Admin@123');
      console.log('\n⚠️  IMPORTANT: Please change this password after first login!');
      console.log('\n🎉 You can now use this email to reset password!');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.message.includes('bad auth') || error.message.includes('authentication failed')) {
      console.log('\n🔑 MongoDB Authentication Error!');
      console.log('Please fix your MongoDB credentials first.');
      console.log('See UPDATE_MONGODB.md for instructions.');
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

createAdminUser();
