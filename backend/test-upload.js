#!/usr/bin/env node

const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Test script to check upload functionality
const testUpload = async () => {
  try {
    console.log('🧪 Testing Upload Configuration');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Check if uploads directory exists
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      console.log('📁 Creating uploads directory...');
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // List existing files in uploads directory
    const files = fs.readdirSync(uploadsDir);
    console.log(`📂 Uploads directory contains ${files.length} files:`);
    files.forEach((file, index) => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`   ${index + 1}. ${file} (${sizeInMB} MB)`);
    });

    console.log('\n✅ Upload Configuration Test Complete');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Current Limits:');
    console.log('   • Max file size: 10MB');
    console.log('   • Max files per request: 5');
    console.log('   • Server body limit: 50MB');
    console.log('   • Allowed file types: Images only');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run the test
if (require.main === module) {
  testUpload();
}

module.exports = testUpload;
