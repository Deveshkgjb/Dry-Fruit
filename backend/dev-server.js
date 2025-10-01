const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',  // Vite dev server
    'http://localhost:3000',  // React dev server
    'http://localhost:5174',  // Alternative Vite port
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5174'
  ],
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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mock data for development
const mockProducts = [
  {
    _id: '1',
    name: 'Happilo Roasted & Lightly Salted Premium California Almonds',
    description: 'Premium California almonds that are lightly roasted and salted to perfection.',
    category: 'Nuts',
    images: [
      { url: '/src/Components/Homepages/dev1.png', alt: 'Premium Almonds' }
    ],
    sizes: [
      { size: '200g', price: 288, originalPrice: 370, stock: 50 },
      { size: '200g (Pack of 3)', price: 850, originalPrice: 1100, stock: 30 }
    ],
    features: [
      'Premium Quality California Almonds',
      'Lightly Roasted & Salted',
      'Rich in Protein & Healthy Fats'
    ],
    badges: [{ text: 'BEST SELLER', color: 'red' }],
    status: 'Active',
    rating: { average: 4.1, count: 4 },
    isBestSeller: true,
    salesCount: 450
  },
  {
    _id: '2',
    name: 'Happilo Premium Whole Cashew Nuts',
    description: 'Whole cashew nuts with rich, creamy texture and natural sweetness.',
    category: 'Nuts',
    images: [
      { url: '/src/Components/Homepages/dev2.png', alt: 'Premium Cashews' }
    ],
    sizes: [
      { size: '200g', price: 435, originalPrice: 485, stock: 40 }
    ],
    features: [
      'Premium Whole Cashews',
      'Rich & Creamy Texture',
      'Natural Sweetness'
    ],
    badges: [{ text: 'BEST SELLER', color: 'red' }],
    status: 'Active',
    rating: { average: 4.5, count: 395 },
    isBestSeller: true,
    salesCount: 380
  }
];

const mockReviews = [
  {
    _id: '1',
    product: '1',
    user: { name: 'Rahul Sharma' },
    rating: 5,
    comment: 'Excellent quality almonds! Fresh, crunchy, and perfectly salted.',
    createdAt: '2024-01-15',
    status: 'approved'
  },
  {
    _id: '2',
    product: '1',
    user: { name: 'Priya Patel' },
    rating: 4,
    comment: 'Good taste and quality. Packaging is also nice.',
    createdAt: '2024-01-10',
    status: 'approved'
  }
];

const mockOrders = [
  {
    _id: '1',
    orderNumber: 'HP001001',
    user: { name: 'Rahul Sharma', email: 'rahul@example.com' },
    items: [
      {
        product: mockProducts[0],
        name: 'Happilo Premium Almonds',
        quantity: 2,
        price: 288,
        size: '200g'
      }
    ],
    pricing: { total: 576 },
    status: 'processing',
    createdAt: '2024-01-15'
  }
];

// Mock admin user
const mockAdmin = {
  _id: 'admin1',
  name: 'Admin User',
  email: 'admin@happilo.com',
  role: 'admin'
};

// Routes

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Happilo E-commerce API Server is running! (Development Mode)' });
});

// Products routes
app.get('/api/products', (req, res) => {
  res.json({
    products: mockProducts,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalProducts: mockProducts.length,
      limit: 12
    }
  });
});

app.get('/api/products/featured', (req, res) => {
  res.json({
    bestSellers: mockProducts.filter(p => p.isBestSeller),
    popular: mockProducts,
    newest: mockProducts
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = mockProducts.find(p => p._id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const productReviews = mockReviews.filter(r => r.product === req.params.id);
  const relatedProducts = mockProducts.filter(p => p._id !== req.params.id);

  res.json({
    product,
    reviews: productReviews,
    relatedProducts,
    isInWishlist: false
  });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@happilo.com' && password === 'admin123') {
    res.json({
      message: 'Login successful',
      token: 'mock-jwt-token',
      user: mockAdmin
    });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  res.status(201).json({
    message: 'User registered successfully',
    token: 'mock-jwt-token',
    user: {
      _id: 'user' + Date.now(),
      name,
      email,
      role: 'customer'
    }
  });
});

app.get('/api/auth/profile', (req, res) => {
  res.json({ user: mockAdmin });
});

// Reviews routes
app.get('/api/reviews/product/:productId', (req, res) => {
  const productReviews = mockReviews.filter(r => r.product === req.params.productId);
  res.json({
    reviews: productReviews,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalReviews: productReviews.length
    },
    summary: {
      averageRating: 4.5,
      totalReviews: productReviews.length
    }
  });
});

app.post('/api/reviews', (req, res) => {
  const newReview = {
    _id: 'review' + Date.now(),
    ...req.body,
    user: { name: 'Current User' },
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  
  mockReviews.push(newReview);
  res.status(201).json({
    message: 'Review submitted successfully',
    review: newReview
  });
});

// Orders routes
app.get('/api/orders', (req, res) => {
  res.json({
    orders: mockOrders,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalOrders: mockOrders.length
    }
  });
});

app.post('/api/orders', (req, res) => {
  const newOrder = {
    _id: 'order' + Date.now(),
    orderNumber: 'HP' + Date.now(),
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  mockOrders.push(newOrder);
  res.status(201).json({
    message: 'Order created successfully',
    order: newOrder
  });
});

// Admin routes
app.get('/api/admin/dashboard', (req, res) => {
  res.json({
    overview: {
      totalUsers: 150,
      totalProducts: mockProducts.length,
      totalOrders: mockOrders.length,
      totalRevenue: 125000,
      pendingOrders: 5,
      totalReviews: mockReviews.length,
      pendingReviews: 2
    },
    growth: {
      orderGrowth: 15.2,
      revenueGrowth: 23.1
    },
    charts: {
      monthlyOrders: [
        { _id: '2024-01-01', count: 10, revenue: 5000 },
        { _id: '2024-01-02', count: 15, revenue: 7500 }
      ],
      topProducts: mockProducts.slice(0, 5)
    },
    recentActivity: {
      recentOrders: mockOrders
    }
  });
});

app.get('/api/reviews', (req, res) => {
  res.json({
    reviews: mockReviews,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalReviews: mockReviews.length
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(error.status || 500).json({
    message: error.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Development Server is running on port ${PORT}`);
  console.log(`📱 API Base URL: http://localhost:${PORT}`);
  console.log(`⚠️  Note: This is a development server with mock data`);
  console.log(`🔐 Admin Login: admin@happilo.com / admin123`);
});

module.exports = app;
