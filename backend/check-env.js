require('dotenv').config();

console.log('🔍 Server Environment Check:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'Not set');
console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
console.log('USE_MOCK_EMAIL:', process.env.USE_MOCK_EMAIL);

// Test if the password is what we expect
if (process.env.EMAIL_PASS === 'yufdstjjiapkoqjv') {
  console.log('✅ Password matches expected value');
} else {
  console.log('❌ Password does NOT match expected value');
  console.log('Expected: yufdstjjiapkoqjv');
  console.log('Actual:', process.env.EMAIL_PASS);
}
