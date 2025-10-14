#!/usr/bin/env node

const mongoose = require('mongoose');
const User = require('./models/User');
const readline = require('readline');
require('dotenv').config();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to ask questions
const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Function to ask for password (hidden input)
const askPassword = (question) => {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    let password = '';
    process.stdin.on('data', function(char) {
      char = char + '';
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdin.removeAllListeners('data');
          console.log(''); // New line
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u007f': // Backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    });
  });
};

const createAdminUser = async () => {
  try {
    console.log('🔧 Admin User Creation Script');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/happilo', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully!\n');

    // Get admin details from user
    console.log('📝 Please provide admin user details:\n');
    
    const name = await askQuestion('👤 Admin Name: ');
    const email = await askQuestion('📧 Email: ');
    const phone = await askQuestion('📱 Phone (optional): ');
    const password = await askPassword('🔑 Password: ');
    const confirmPassword = await askPassword('🔑 Confirm Password: ');

    // Validate inputs
    if (!name.trim()) {
      throw new Error('❌ Name is required');
    }
    
    if (!email.trim()) {
      throw new Error('❌ Email is required');
    }
    
    if (!email.includes('@')) {
      throw new Error('❌ Please enter a valid email address');
    }
    
    if (!password) {
      throw new Error('❌ Password is required');
    }
    
    if (password.length < 6) {
      throw new Error('❌ Password must be at least 6 characters long');
    }
    
    if (password !== confirmPassword) {
      throw new Error('❌ Passwords do not match');
    }

    console.log('\n🔍 Checking if admin already exists...');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (existingAdmin) {
      console.log(`❌ Admin user with email "${email}" already exists!`);
      console.log(`👤 Existing admin: ${existingAdmin.name}`);
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👑 Role: ${existingAdmin.role}`);
      console.log(`📅 Created: ${existingAdmin.createdAt}`);
      
      const updateChoice = await askQuestion('\n🔄 Do you want to update the existing admin? (y/n): ');
      
      if (updateChoice.toLowerCase() === 'y' || updateChoice.toLowerCase() === 'yes') {
        // Update existing admin
        existingAdmin.name = name.trim();
        existingAdmin.password = password; // Will be hashed by pre-save middleware
        existingAdmin.phone = phone.trim() || existingAdmin.phone;
        existingAdmin.role = 'admin';
        existingAdmin.isActive = true;
        
        await existingAdmin.save();
        
        console.log('\n✅ Admin user updated successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`👤 Name: ${existingAdmin.name}`);
        console.log(`📧 Email: ${existingAdmin.email}`);
        console.log(`📱 Phone: ${existingAdmin.phone || 'Not provided'}`);
        console.log(`👑 Role: ${existingAdmin.role}`);
        console.log(`🔑 Password: [Updated]`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      } else {
        console.log('❌ Admin creation cancelled.');
      }
    } else {
      // Create new admin user
      console.log('👤 Creating new admin user...');
      
      const adminUser = new User({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password,
        phone: phone.trim() || undefined,
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

      console.log('\n🎉 Admin user created successfully!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`👤 Name: ${adminUser.name}`);
      console.log(`📧 Email: ${adminUser.email}`);
      console.log(`📱 Phone: ${adminUser.phone || 'Not provided'}`);
      console.log(`👑 Role: ${adminUser.role}`);
      console.log(`🔑 Password: [Hidden for security]`);
      console.log(`📅 Created: ${adminUser.createdAt}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    // Ask if user wants to create another admin
    const anotherChoice = await askQuestion('\n🔄 Do you want to create another admin user? (y/n): ');
    
    if (anotherChoice.toLowerCase() === 'y' || anotherChoice.toLowerCase() === 'yes') {
      console.log('\n' + '='.repeat(60) + '\n');
      await createAdminUser(); // Recursive call
    } else {
      console.log('\n👋 Thank you for using the admin creation script!');
    }

  } catch (error) {
    console.error('\n❌ Error creating admin user:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n📡 Database connection closed.');
    rl.close();
  }
};

// Handle script termination
process.on('SIGINT', async () => {
  console.log('\n\n👋 Script terminated by user.');
  await mongoose.connection.close();
  rl.close();
  process.exit(0);
});

// Run the script
if (require.main === module) {
  createAdminUser();
}

module.exports = createAdminUser;
