const axios = require('axios');

async function testResetOTP() {
  try {
    console.log('🧪 Testing Reset Password OTP functionality...\n');
    
    const email = 'admin@happilo.com'; // Change this to your admin email
    
    console.log('📧 Step 1: Sending OTP request for:', email);
    const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
      email: email
    });
    
    console.log('\n✅ Response Status:', response.status);
    console.log('✅ Response Data:', JSON.stringify(response.data, null, 2));
    console.log('\n🎉 SUCCESS! OTP has been sent to your email.');
    console.log('📬 Please check your email inbox for the OTP.');
    
  } catch (error) {
    console.error('\n❌ Error occurred:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received from server');
      console.error('Is the backend server running on http://localhost:5000?');
    } else {
      console.error('Error:', error.message);
    }
  }
}

testResetOTP();
