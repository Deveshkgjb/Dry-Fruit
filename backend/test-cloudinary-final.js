// Final Comprehensive Cloudinary Test
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

console.log('🎯 Final Cloudinary Test - Complete Check\n');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('✅ Configuration Loaded');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? `${process.env.CLOUDINARY_API_KEY.substring(0, 5)}...` : 'NOT SET');

// Test 1: Upload to products folder
const uploadsDir = path.join(__dirname, 'uploads');
const files = fs.readdirSync(uploadsDir);
const testImage = files.find(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'));
const testImagePath = path.join(uploadsDir, testImage);

console.log('\n📦 Test 1: Product Image Upload');
console.log('Test Image:', testImage);

cloudinary.uploader.upload(testImagePath, {
  folder: 'mufindryfruit-products',
  resource_type: 'image',
  transformation: [
    { quality: 'auto' },
    { fetch_format: 'auto' }
  ]
})
.then(result1 => {
  console.log('✅ Product Upload Successful!');
  console.log('URL:', result1.secure_url);
  console.log('Public ID:', result1.public_id);
  
  // Test 2: Upload to logo folder
  console.log('\n🎨 Test 2: Logo Image Upload');
  return cloudinary.uploader.upload(testImagePath, {
    folder: 'mufindryfruit-logo',
    resource_type: 'image',
    transformation: [
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  })
  .then(result2 => {
    console.log('✅ Logo Upload Successful!');
    console.log('URL:', result2.secure_url);
    console.log('Public ID:', result2.public_id);
    
    // Clean up both test images
    console.log('\n🧹 Cleaning up test images...');
    return Promise.all([
      cloudinary.uploader.destroy(result1.public_id),
      cloudinary.uploader.destroy(result2.public_id)
    ]);
  });
})
.then(() => {
  console.log('✅ Test images cleaned up');
  
  // Get account usage
  console.log('\n📊 Checking Account Usage...');
  return cloudinary.api.usage();
})
.then(usage => {
  console.log('✅ Account Usage Retrieved');
  console.log('Plan:', usage.plan);
  console.log('Storage Used:', Math.round(usage.storage.usage / 1024 / 1024) + ' MB');
  console.log('Bandwidth Used:', Math.round(usage.bandwidth.usage / 1024 / 1024) + ' MB');
  console.log('Resources:', usage.resources);
  console.log('Transformations:', usage.transformations?.usage || 0);
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 ALL TESTS PASSED! 🎉');
  console.log('='.repeat(60));
  console.log('\n✅ Cloudinary is fully configured and working!');
  console.log('✅ Product images can be uploaded');
  console.log('✅ Logo images can be uploaded');
  console.log('✅ Admin panel image uploads will work');
  console.log('\n🚀 Your e-commerce site is ready for image uploads!');
  
  process.exit(0);
})
.catch(error => {
  console.error('\n❌ Test Failed!');
  console.error('Error:', error.message);
  console.error('Details:', error);
  process.exit(1);
});

