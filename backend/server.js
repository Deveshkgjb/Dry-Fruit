const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const reviewRoutes = require('./routes/reviews');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const categoryRoutes = require('./routes/categories');
const managerRoutes = require('./routes/manager');
const uploadRoutes = require('./routes/upload');
const configRoutes = require('./routes/config');
const contactRoutes = require('./routes/contacts');
const pageContentRoutes = require('./routes/pageContent');
const paymentSettingsRoutes = require('./routes/paymentSettings');

// Load environment variables
dotenv.config();

// Set default environment variables if not provided
process.env.MONGODB_URI = process.env.MONGODB_URI ;
process.env.PORT = process.env.PORT;
process.env.NODE_ENV = process.env.NODE_ENV ;

const app = express();

// CORS Configuration
const getAllowedOrigins = () => {
  const defaultOrigins = [
    'http://localhost:5173',  // Vite dev server
    'http://localhost:5176',  // Vite dev server (current)
    'http://localhost:3000',  // React dev server
    'http://localhost:5174',  // Alternative Vite port
    'http://localhost:5175',  // Alternative Vite port
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5176',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
    'http://192.168.1.8:5173',  // Network access for mobile
    'http://192.168.1.8:5176',  // Network access for mobile
    'http://192.168.1.8:5174',  // Additional mobile ports
    'http://192.168.1.8:5175',  // Additional mobile ports
    'http://0.0.0.0:5173',      // Wildcard access
    'http://0.0.0.0:5176'       // Wildcard access
  ];
  
  // Add environment-specific origins
  const envOrigins = process.env.CORS_ORIGINS ? 
    process.env.CORS_ORIGINS.split(',').map(origin => origin.trim()) : [];
  
  // Add frontend URL from environment
  if (process.env.FRONTEND_URL) {
    envOrigins.push(process.env.FRONTEND_URL);
  }
  
  // Add website URL from environment
  if (process.env.WEBSITE_URL) {
    envOrigins.push(process.env.WEBSITE_URL);
  }
  
  return [...new Set([...defaultOrigins, ...envOrigins])];
};

const corsOptions = {
  origin: getAllowedOrigins(),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // Increased from 10mb to 50mb
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Increased from 10mb to 50mb

// Static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error('❌ MONGODB_URI environment variable is not set');
  process.exit(1);
}

mongoose.connect(mongoURI)
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  console.log(`📊 Database: ${mongoose.connection.name}`);
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/page-content', pageContentRoutes);
app.use('/api/payment-settings', paymentSettingsRoutes);
app.use('/api', configRoutes);

// Handle base API endpoint (for CORS preflight requests)
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Happilo E-commerce API Server is running!',
    version: '1.0.0',
    endpoints: [
      '/api/config',
      '/api/products',
      '/api/categories',
      '/api/orders',
      '/api/auth',
      '/api/page-content'
    ]
  });
});

// Handle OPTIONS requests to base API endpoint (CORS preflight)
app.options('/api', (req, res) => {
  res.status(200).end();
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Happilo E-commerce API Server is running!' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(error.status || 500).json({
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  const backendUrl = process.env.BACKEND_URL || `http://localhost:${PORT}`;
  const apiUrl = process.env.API_BASE_URL || `${backendUrl}/api`;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Backend URL: ${backendUrl}`);
  console.log(`🔗 API Base URL: ${apiUrl}`);
  console.log(`🌐 Frontend URL: ${frontendUrl}`);
  console.log(`🔒 CORS Origins: ${getAllowedOrigins().join(', ')}`);
});

module.exports = app;
