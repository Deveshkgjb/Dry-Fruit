const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔧 EMAIL SETUP FOR rajsinghindia2025@gmail.com\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📋 STEP 1: Generate App Password for Gmail\n');
console.log('   1. Open: https://myaccount.google.com/apppasswords');
console.log('   2. Sign in with: rajsinghindia2025@gmail.com');
console.log('   3. Click "Create" or "Generate App Password"');
console.log('   4. Name it: "Dry Fruits App" or "Password Reset"');
console.log('   5. Copy the 16-character password (format: xxxx xxxx xxxx xxxx)');
console.log('   6. REMOVE ALL SPACES from the password\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

rl.question('📧 Enter the 16-character App Password (no spaces): ', (appPassword) => {
  const cleanPassword = appPassword.trim().replace(/\s+/g, '');
  
  if (cleanPassword.length !== 16) {
    console.log('\n❌ ERROR: App Password must be exactly 16 characters!');
    console.log('   You entered:', cleanPassword.length, 'characters');
    console.log('   Please remove all spaces and try again.\n');
    rl.close();
    return;
  }
  
  console.log('\n✅ Password length correct (16 characters)\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📋 STEP 2: Updating .env file...\n');
  
  const envPath = path.join(__dirname, '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update EMAIL_USER
  envContent = envContent.replace(
    /EMAIL_USER=.*/,
    'EMAIL_USER=rajsinghindia2025@gmail.com'
  );
  
  // Update EMAIL_FROM_ADDRESS
  envContent = envContent.replace(
    /EMAIL_FROM_ADDRESS=.*/,
    'EMAIL_FROM_ADDRESS=rajsinghindia2025@gmail.com'
  );
  
  // Update EMAIL_PASS
  envContent = envContent.replace(
    /EMAIL_PASS=.*/,
    `EMAIL_PASS=${cleanPassword}`
  );
  
  // Save backup
  fs.writeFileSync(envPath + '.backup.email', fs.readFileSync(envPath));
  console.log('   ✅ Backup created: .env.backup.email');
  
  // Save new .env
  fs.writeFileSync(envPath, envContent);
  console.log('   ✅ Updated .env file');
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📋 STEP 3: Configuration Summary\n');
  console.log('   EMAIL_USER: rajsinghindia2025@gmail.com');
  console.log('   EMAIL_FROM_ADDRESS: rajsinghindia2025@gmail.com');
  console.log('   EMAIL_PASS: ' + cleanPassword.substring(0, 4) + '...' + cleanPassword.substring(12));
  console.log('   EMAIL_SERVICE: gmail');
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📋 STEP 4: Next Actions\n');
  console.log('   1. Restart your backend server to load new settings');
  console.log('   2. Test OTP sending by running:');
  console.log('      node test-otp-rajsingh.js');
  console.log('\n✅ Setup Complete!\n');
  
  rl.close();
});


