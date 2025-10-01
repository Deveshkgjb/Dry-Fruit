const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/happilo', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB for admin seeding...');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@happilo.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return;
    }

    // Create admin user
    const adminUser = new User({
      name: 'Happilo Admin',
      email: 'admin@happilo.com',
      password: 'admin123', // This will be hashed by the pre-save middleware
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
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@happilo.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    console.log('📱 Phone: +91-9876543210');

    // Create additional admin users for testing
    const additionalAdmins = [
      {
        name: 'Super Admin',
        email: 'superadmin@happilo.com',
        password: 'superadmin123',
        phone: '+91-9876543211',
        role: 'admin',
        isActive: true,
        address: {
          street: 'Super Admin Office',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110001',
          country: 'India'
        }
      },
      {
        name: 'Manager Admin',
        email: 'manager@happilo.com',
        password: 'manager123',
        phone: '+91-9876543212',
        role: 'admin',
        isActive: true,
        address: {
          street: 'Manager Office',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560001',
          country: 'India'
        }
      }
    ];

    for (const adminData of additionalAdmins) {
      const existingAdmin = await User.findOne({ email: adminData.email });
      
      if (!existingAdmin) {
        const admin = new User(adminData);
        await admin.save();
        console.log(`✅ Additional admin created: ${adminData.email}`);
      } else {
        console.log(`ℹ️  Admin already exists: ${adminData.email}`);
      }
    }

    console.log('\n🎉 Admin seeding completed successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Main Admin:');
    console.log('   Email: admin@happilo.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('2. Super Admin:');
    console.log('   Email: superadmin@happilo.com');
    console.log('   Password: superadmin123');
    console.log('');
    console.log('3. Manager Admin:');
    console.log('   Email: manager@happilo.com');
    console.log('   Password: manager123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

// Run the seeder
if (require.main === module) {
  seedAdmin();
}

module.exports = seedAdmin;
