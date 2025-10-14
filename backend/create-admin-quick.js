#!/usr/bin/env node

const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createQuickAdmin = async (adminData = {}) => {
  try {
    console.log('🚀 Quick Admin User Creation Script');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/happilo', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully!\n');

    // Default admin data
    const defaultAdminData = {
      name: 'Happilo Admin',
      email: 'admin@happilo.com',
      password: 'admin123',
      phone: '+91-9876543210',
      role: 'admin',
      isActive: true,
      address: {
        street: 'Admin Office',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India'
      }
    };

    // Merge with provided data
    const finalAdminData = { ...defaultAdminData, ...adminData };

    console.log('🔍 Checking if admin already exists...');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: finalAdminData.email });
    
    if (existingAdmin) {
      console.log(`ℹ️  Admin user with email "${finalAdminData.email}" already exists!`);
      console.log(`👤 Name: ${existingAdmin.name}`);
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👑 Role: ${existingAdmin.role}`);
      console.log(`📅 Created: ${existingAdmin.createdAt}`);
      console.log(`🔄 Status: ${existingAdmin.isActive ? 'Active' : 'Inactive'}`);
      
      // Update password if provided
      if (finalAdminData.password && finalAdminData.password !== 'admin123') {
        existingAdmin.password = finalAdminData.password;
        await existingAdmin.save();
        console.log('✅ Password updated successfully!');
      }
      
      return existingAdmin;
    }

    // Create new admin user
    console.log('👤 Creating new admin user...');
    
    const adminUser = new User(finalAdminData);
    await adminUser.save();

    console.log('\n🎉 Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👤 Name: ${adminUser.name}`);
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`📱 Phone: ${adminUser.phone}`);
    console.log(`👑 Role: ${adminUser.role}`);
    console.log(`🔑 Password: ${finalAdminData.password}`);
    console.log(`📅 Created: ${adminUser.createdAt}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return adminUser;

  } catch (error) {
    console.error('\n❌ Error creating admin user:', error.message);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n📡 Database connection closed.');
  }
};

// Run the script with command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  
  let customAdminData = {};
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];
    
    if (key && value) {
      customAdminData[key] = value;
    }
  }
  
  createQuickAdmin(customAdminData)
    .then(() => {
      console.log('\n✅ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error.message);
      process.exit(1);
    });
}

module.exports = createQuickAdmin;
