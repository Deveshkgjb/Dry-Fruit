# Cloudinary Setup Guide

## 1. Create Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email address

## 2. Get Your Cloudinary Credentials

1. After logging in, go to your **Dashboard**
2. You'll see your **Cloud Name**, **API Key**, and **API Secret**
3. Copy these values

## 3. Update Backend Environment Variables

Edit `/Users/deveshfuloria/Dry-fruits/backend/.env` and replace the placeholder values:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

## 4. Restart Backend Server

```bash
cd /Users/deveshfuloria/Dry-fruits/backend
npm start
```

## 5. Test Image Upload

1. Go to the admin panel
2. Try uploading an image
3. Check that the image URL is a Cloudinary URL:
   - **Logo images**: `https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/happilo-logo/filename.jpg`
   - **Product images**: `https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/happilo-products/filename.jpg`

## Benefits of Cloudinary

- **CDN Delivery**: Images are served from a global CDN for fast loading
- **Automatic Optimization**: Images are automatically optimized for web
- **Transformations**: Built-in image transformations (resize, crop, quality)
- **Scalability**: No server storage limits
- **Reliability**: 99.9% uptime guarantee

## Image Storage Structure

- **Logo Images**: `happilo-logo/` folder
- **Product Images**: `happilo-products/` folder
- **Transformations**: Auto-quality optimization and format conversion
- **Formats**: JPG, JPEG, PNG, GIF, WebP, AVIF
- **Max Size**: 5MB per image

## Troubleshooting

### Common Issues:

1. **"Invalid credentials" error**
   - Check your Cloudinary credentials in `.env`
   - Make sure there are no extra spaces

2. **"Upload failed" error**
   - Check your internet connection
   - Verify Cloudinary account is active
   - Check file size (max 5MB)

3. **Images not displaying**
   - Cloudinary URLs should start with `https://res.cloudinary.com/`
   - Check browser console for errors

### Support:
- Cloudinary Documentation: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
- Free tier includes 25 GB storage and 25 GB bandwidth per month
