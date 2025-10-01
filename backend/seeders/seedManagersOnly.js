const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');

// Load environment variables
dotenv.config();

const seedManagersOnly = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB Atlas');
    
    // Get some categories to assign to managers
    const categories = await Category.find({ isActive: true }).limit(5);
    
    if (categories.length === 0) {
      console.log('⚠️  No categories found. Please seed categories first.');
      return;
    }
    
    console.log(`📋 Found ${categories.length} categories to assign to managers`);
    
    const managerUsers = [
      {
        name: 'Nuts Manager',
        email: 'nuts.manager@happilo.com',
        password: 'manager123',
        role: 'manager',
        phone: '+91-9876543211',
        managedCategories: [categories[0]._id, categories[1]._id] // Assign first 2 categories
      },
      {
        name: 'Berries Manager',
        email: 'berries.manager@happilo.com',
        password: 'manager123',
        role: 'manager',
        phone: '+91-9876543212',
        managedCategories: [categories[2]._id, categories[3]._id] // Assign next 2 categories
      },
      {
        name: 'Seeds Manager',
        email: 'seeds.manager@happilo.com',
        password: 'manager123',
        role: 'manager',
        phone: '+91-9876543213',
        managedCategories: [categories[4]._id] // Assign last category
      }
    ];
    
    for (const managerData of managerUsers) {
      // Check if manager already exists
      const existingManager = await User.findOne({ email: managerData.email });
      
      if (!existingManager) {
        const manager = new User(managerData);
        await manager.save();
        console.log(`✅ Created manager: ${managerData.name} (${managerData.email})`);
        console.log(`   Managed categories: ${managerData.managedCategories.length}`);
      } else {
        console.log(`⚠️  Manager already exists: ${managerData.name} (${managerData.email})`);
      }
    }
    
    console.log('✅ Manager seeding completed!');
    console.log('\n🔐 Manager Credentials:');
    console.log('   Nuts Manager: nuts.manager@happilo.com / manager123');
    console.log('   Berries Manager: berries.manager@happilo.com / manager123');
    console.log('   Seeds Manager: seeds.manager@happilo.com / manager123');
    
  } catch (error) {
    console.error('❌ Error seeding managers:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📊 Disconnected from MongoDB');
  }
};

// Run the seeder
seedManagersOnly();
