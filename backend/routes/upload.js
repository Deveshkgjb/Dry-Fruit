const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');
const { adminAuth } = require('../middleware/auth');

// Ensure dotenv is loaded
require('dotenv').config();

const router = express.Router();

// Configure Cloudinary
console.log('Setting up Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Cloudinary configured successfully');

// Use local storage for now
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate a clean filename without special characters
    const timestamp = Date.now();
    const extension = file.originalname.split('.').pop();
    const cleanFilename = `${timestamp}-image.${extension}`;
    cb(null, cleanFilename);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (increased from 5MB)
    files: 10, // Maximum number of files
    fieldSize: 10 * 1024 * 1024, // 10MB for field values
    fieldNameSize: 100, // Maximum field name size
    fields: 20 // Maximum number of fields
  },
  fileFilter: fileFilter
});

// @route   POST /api/upload/image
// @desc    Upload product image to Cloudinary
// @access  Public (for admin panel)
router.post('/image', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ 
          message: 'File too large. Maximum size allowed is 10MB.',
          error: 'FILE_TOO_LARGE'
        });
      } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ 
          message: 'Unexpected field name. Use "image" as field name.',
          error: 'UNEXPECTED_FIELD'
        });
      } else {
        return res.status(400).json({ 
          message: err.message || 'Upload error',
          error: 'UPLOAD_ERROR'
        });
      }
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log('Upload request received:', {
      hasFile: !!req.file,
      fileInfo: req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        filename: req.file.filename
      } : null
    });

    if (!req.file) {
      console.log('No file provided in request');
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Debug Cloudinary configuration
    console.log('Cloudinary config check:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
    });

    // Reconfigure Cloudinary to ensure credentials are loaded
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    console.log('Cloudinary re-configured for upload');

    // Upload to Cloudinary - determine folder based on request source
    const isLogoUpload = req.headers['x-upload-type'] === 'logo';
    const folder = isLogoUpload ? 'mufindryfruit-logo' : 'mufindryfruit-products';
    
    console.log('📁 Upload folder determined:', {
      isLogoUpload,
      folder,
      uploadType: req.headers['x-upload-type']
    });
    
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    // Clean up local file after Cloudinary upload
    fs.unlinkSync(req.file.path);
    
    console.log('Cloudinary upload successful:', { 
      imageUrl: result.secure_url, 
      publicId: result.public_id 
    });
    
    res.json({
      success: true,
      message: 'Image uploaded successfully to Cloudinary',
      imageUrl: result.secure_url,
      publicId: result.public_id,
      cloudinaryId: result.public_id
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    // Clean up local file if Cloudinary upload failed
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up local file:', cleanupError);
      }
    }
    
    res.status(500).json({ 
      message: 'Server error uploading image to Cloudinary',
      error: error.message 
    });
  }
});

// @route   POST /api/upload/images
// @desc    Upload multiple product images to Cloudinary
// @access  Public (for admin panel)
router.post('/images', (req, res, next) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ 
          message: 'File too large. Maximum size allowed is 10MB per file.',
          error: 'FILE_TOO_LARGE'
        });
      } else if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(413).json({ 
          message: 'Too many files. Maximum 5 files allowed.',
          error: 'TOO_MANY_FILES'
        });
      } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ 
          message: 'Unexpected field name. Use "images" as field name.',
          error: 'UNEXPECTED_FIELD'
        });
      } else {
        return res.status(400).json({ 
          message: err.message || 'Upload error',
          error: 'UPLOAD_ERROR'
        });
      }
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    const uploadPromises = req.files.map(async (file) => {
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'mufindryfruit-products', // Organize product images in a specific folder
          resource_type: 'image',
          transformation: [
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        });

        // Clean up local file after Cloudinary upload
        fs.unlinkSync(file.path);

        return {
          url: result.secure_url,
          alt: file.originalname.split('.')[0],
          publicId: result.public_id
        };
      } catch (uploadError) {
        console.error(`Error uploading ${file.originalname}:`, uploadError);
        // Clean up local file if upload failed
        try {
          fs.unlinkSync(file.path);
        } catch (cleanupError) {
          console.error('Error cleaning up local file:', cleanupError);
        }
        throw uploadError;
      }
    });

    const imageUrls = await Promise.all(uploadPromises);
    
    res.json({
      success: true,
      message: 'Images uploaded successfully to Cloudinary',
      images: imageUrls
    });
  } catch (error) {
    console.error('Cloudinary images upload error:', error);
    res.status(500).json({ message: 'Server error uploading images to Cloudinary' });
  }
});

// @route   DELETE /api/upload/image/:publicId
// @desc    Delete uploaded image from Cloudinary
// @access  Public (for admin panel)
router.delete('/image/:publicId', async (req, res) => {
  try {
    const publicId = req.params.publicId;
    
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'Image deleted successfully from Cloudinary'
      });
    } else {
      res.status(404).json({ message: 'Image not found in Cloudinary' });
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    res.status(500).json({ message: 'Server error deleting image from Cloudinary' });
  }
});

module.exports = router;
