const path = require('path');
console.log('Current working directory:', process.cwd());
console.log('Looking for .env files in:', path.resolve('.env'));

// Try to load dotenv manually
const result = require('dotenv').config();
console.log('Dotenv result:', result);

// Check if there are any errors
if (result.error) {
  console.log('Dotenv error:', result.error);
}

// Check the actual environment variables
console.log('EMAIL_PASS from process.env:', process.env.EMAIL_PASS);
