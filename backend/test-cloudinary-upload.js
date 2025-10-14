// Test Cloudinary Upload
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Cloudinary Upload...\n');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Configuration:');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? `${process.env.CLOUDINARY_API_KEY.substring(0, 5)}...` : 'NOT SET');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '***hidden***' : 'NOT SET');

// Find a test image in uploads folder
const uploadsDir = path.join(__dirname, 'uploads');
const files = fs.readdirSync(uploadsDir);
const testImage = files.find(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'));

if (!testImage) {
  console.log('\n❌ No test image found in uploads folder');
  process.exit(1);
}

const testImagePath = path.join(uploadsDir, testImage);
console.log('\n📸 Test Image:', testImage);
console.log('Path:', testImagePath);

// Try to upload
console.log('\n🚀 Attempting upload to Cloudinary...');

cloudinary.uploader.upload(testImagePath, {
  folder: 'mufindryfruit-test',
  resource_type: 'image',
  transformation: [
    { quality: 'auto' },
    { fetch_format: 'auto' }
  ]
})
.then(result => {
  console.log('\n✅ Upload Successful!');
  console.log('Image URL:', result.secure_url);
  console.log('Public ID:', result.public_id);
  console.log('Format:', result.format);
  console.log('Width:', result.width);
  console.log('Height:', result.height);
  console.log('Size:', Math.round(result.bytes / 1024) + ' KB');
  
  console.log('\n✅ Cloudinary is working perfectly!');
  console.log('✅ Images can be uploaded successfully!');
  
  // Clean up test image from Cloudinary
  console.log('\n🧹 Cleaning up test image...');
  return cloudinary.uploader.destroy(result.public_id);
})
.then(deleteResult => {
  console.log('✅ Test image cleaned up:', deleteResult.result);
  process.exit(0);
})
.catch(error => {
  console.error('\n❌ Upload Failed!');
  console.error('Error:', error.message);
  console.error('Error Details:', error);
  
  if (error.http_code === 401) {
    console.log('\n⚠️  Authentication Error: Please check your Cloudinary credentials');
  } else if (error.http_code === 400) {
    console.log('\n⚠️  Bad Request: Check your upload parameters');
  }
  
  process.exit(1);
});

