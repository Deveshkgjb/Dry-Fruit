# 🚨 Production Email Fix Required

## 🔍 **Issue Identified**

The production website `https://mufindryfruit.com` is getting **500 Internal Server Error** when trying to send OTP emails because the production backend has the same Gmail authentication issue.

**Error from Production:**
```json
{
  "message": "Failed to send OTP email. Please try again later.",
  "error": "Invalid login: 535-5.7.8 Username and Password not accepted"
}
```

## ✅ **Local Development Status**

✅ **Working:** `http://localhost:5001/api` - OTP emails working  
❌ **Broken:** `https://mufindryfruit.com/api` - OTP emails failing

---

## 🔧 **Solution: Update Production Server**

### **Step 1: Access Production Server**

SSH into your production server where `mufindryfruit.com` is hosted:

```bash
ssh your-username@your-server-ip
# or however you access your production server
```

### **Step 2: Update Production .env File**

On the production server, update the `.env` file:

```env
# Email Configuration (Google Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=rajsinghindia2025@gmail.com
EMAIL_FROM_NAME=Happilo Support
EMAIL_FROM_ADDRESS=rajsinghindia2025@gmail.com
EMAIL_PASS=socpftyieiwwaeog
USE_MOCK_EMAIL=false
```

### **Step 3: Restart Production Backend**

Restart your production backend server:

```bash
# Stop the current server
pm2 stop your-app-name
# or
sudo systemctl restart your-service-name
# or
docker-compose restart backend

# Start it again
pm2 start your-app-name
# or
sudo systemctl start your-service-name
# or
docker-compose up -d backend
```

### **Step 4: Test Production**

Test the production OTP sending:

```bash
curl -X POST https://mufindryfruit.com/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"rajsinghindia2025@gmail.com"}'
```

**Expected Response:**
```json
{
  "message": "Password reset OTP has been sent to your email address",
  "expiresIn": "10 minutes"
}
```

---

## 🔍 **Verification**

After updating production, test:

1. **Visit:** `https://mufindryfruit.com/admin-login`
2. **Click:** "Forgot Password"
3. **Enter:** `rajsinghindia2025@gmail.com`
4. **Check:** Email inbox for OTP

---

## 📋 **Current Configuration Summary**

| Environment | Status | API URL | Email Config |
|-------------|--------|---------|--------------|
| **Local Dev** | ✅ Working | `http://localhost:5001/api` | ✅ Correct |
| **Production** | ❌ Broken | `https://mufindryfruit.com/api` | ❌ Needs Update |

---

## 🚨 **Important Notes**

1. **Same Gmail Account:** Both local and production should use `rajsinghindia2025@gmail.com`
2. **Same App Password:** Both should use `socpftyieiwwaeog`
3. **Backup First:** Always backup your production `.env` before making changes
4. **Test After Update:** Always test the OTP functionality after updating production

---

## 🔧 **Alternative: Use Local Development**

If you want to test locally while production is being fixed:

1. **Access:** `http://localhost:5176/admin-login` (instead of mufindryfruit.com)
2. **Use:** Local development server for testing
3. **Deploy:** Fix production when ready

---

## 📞 **Need Help?**

If you need assistance accessing your production server or updating the configuration, please provide:

1. How you deploy your application (PM2, Docker, etc.)
2. Your production server access method (SSH, cPanel, etc.)
3. Current production server logs showing the email error

---

**🎯 Goal:** Get production OTP emails working with the same configuration as local development.






