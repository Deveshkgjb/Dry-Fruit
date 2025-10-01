require('dotenv').config();

console.log('🔍 Debug Email Configuration:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'Not set');
console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
console.log('USE_MOCK_EMAIL:', process.env.USE_MOCK_EMAIL);

// Check for any hidden characters
if (process.env.EMAIL_PASS) {
  console.log('EMAIL_PASS hex:', Buffer.from(process.env.EMAIL_PASS, 'utf8').toString('hex'));
  console.log('EMAIL_PASS first 10 chars:', process.env.EMAIL_PASS.substring(0, 10));
  console.log('EMAIL_PASS last 10 chars:', process.env.EMAIL_PASS.substring(process.env.EMAIL_PASS.length - 10));
}
