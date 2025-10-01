const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/User');
const Product = require('../models/Product');
const Review = require('../models/Review');

// Import seeders
const seedAdmin = require('./seedAdmin');
const seedManagers = require('./seedManagers');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('❌ MONGODB_URI environment variable is not set');
      process.exit(1);
    }
    
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB Atlas');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@happilo.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91 9999999999',
    address: {
      street: '123 Admin Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India'
    }
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    password: 'password123',
    role: 'customer',
    phone: '+91 9876543210',
    address: {
      street: '456 Customer Lane',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India'
    }
  },
  {
    name: 'Priya Patel',
    email: 'priya@example.com',
    password: 'password123',
    role: 'customer',
    phone: '+91 9876543211'
  }
];

const sampleProducts = [
  {
    name: 'Happilo Roasted & Lightly Salted Premium California Almonds',
    description: 'Premium California almonds that are lightly roasted and salted to perfection. These almonds are carefully selected for their superior quality and taste.',
    category: 'Nuts',
    subcategory: 'Almonds',
    images: [
      { url: '/uploads/almonds-1.jpg', alt: 'Premium Almonds' },
      { url: '/uploads/almonds-2.jpg', alt: 'Almonds Pack' }
    ],
    sizes: [
      { size: '200g', price: 288, originalPrice: 370, stock: 50 },
      { size: '200g (Pack of 3)', price: 850, originalPrice: 1100, stock: 30 },
      { size: '500g', price: 720, originalPrice: 925, stock: 25 }
    ],
    features: [
      'Premium Quality California Almonds',
      'Lightly Roasted & Salted',
      'Rich in Protein & Healthy Fats',
      'Perfect for Snacking',
      'Resealable Packaging'
    ],
    badges: [
      { text: 'BEST SELLER', color: 'red' }
    ],
    status: 'Active',
    tags: ['almonds', 'nuts', 'healthy', 'protein', 'california'],
    isBestSeller: true,
    isPopular: true,
    salesCount: 450
  },
  {
    name: 'Happilo Premium Whole Cashew Nuts',
    description: 'Whole cashew nuts with rich, creamy texture and natural sweetness. Perfect for snacking or cooking.',
    category: 'Nuts',
    subcategory: 'Cashews',
    images: [
      { url: '/uploads/cashews-1.jpg', alt: 'Premium Cashews' }
    ],
    sizes: [
      { size: '200g', price: 435, originalPrice: 485, stock: 40 },
      { size: '400g', price: 850, originalPrice: 970, stock: 20 }
    ],
    features: [
      'Premium Whole Cashews',
      'Rich & Creamy Texture',
      'Natural Sweetness',
      'High in Minerals',
      'Vacuum Packed for Freshness'
    ],
    badges: [
      { text: 'BEST SELLER', color: 'red' }
    ],
    status: 'Active',
    tags: ['cashews', 'nuts', 'premium', 'whole'],
    isBestSeller: true,
    salesCount: 380
  },
  {
    name: 'Happilo Premium Dried Blueberries',
    description: 'Sweet and tangy dried blueberries packed with antioxidants and natural goodness.',
    category: 'Dried Fruits',
    subcategory: 'Berries',
    images: [
      { url: '/uploads/blueberries-1.jpg', alt: 'Dried Blueberries' }
    ],
    sizes: [
      { size: '200g', price: 309, originalPrice: 350, stock: 0 },
      { size: '400g', price: 600, originalPrice: 700, stock: 15 }
    ],
    features: [
      'Premium Dried Blueberries',
      'Rich in Antioxidants',
      'Natural Sweetness',
      'No Added Sugar',
      'Perfect for Cereals & Snacking'
    ],
    badges: [
      { text: 'MUST TRY', color: 'pink' }
    ],
    status: 'Out of Stock',
    tags: ['blueberries', 'dried fruits', 'antioxidants', 'healthy'],
    salesCount: 220
  },
  {
    name: 'Happilo Premium Pistachios',
    description: 'Premium quality pistachios with rich flavor and crunchy texture. Perfect for healthy snacking.',
    category: 'Nuts',
    subcategory: 'Pistachios',
    images: [
      { url: '/uploads/pistachios-1.jpg', alt: 'Premium Pistachios' }
    ],
    sizes: [
      { size: '200g', price: 450, originalPrice: 500, stock: 35 },
      { size: '400g', price: 875, originalPrice: 1000, stock: 18 }
    ],
    features: [
      'Premium Quality Pistachios',
      'Rich in Protein & Fiber',
      'Natural & Fresh',
      'Perfect for Snacking',
      'Resealable Pack'
    ],
    status: 'Active',
    tags: ['pistachios', 'nuts', 'premium', 'protein'],
    isPopular: true,
    salesCount: 320
  },
  {
    name: 'Happilo Mixed Dry Fruits',
    description: 'A perfect blend of premium almonds, cashews, raisins, and dates for healthy snacking.',
    category: 'Mixes',
    subcategory: 'Nut Mix',
    images: [
      { url: '/uploads/mixed-nuts-1.jpg', alt: 'Mixed Dry Fruits' }
    ],
    sizes: [
      { size: '250g', price: 399, originalPrice: 450, stock: 25 },
      { size: '500g', price: 775, originalPrice: 900, stock: 15 }
    ],
    features: [
      'Premium Mix of Dry Fruits',
      'Almonds, Cashews, Raisins & Dates',
      'Perfect for Gifting',
      'Healthy Snacking Option',
      'Rich in Nutrients'
    ],
    status: 'Active',
    tags: ['mixed', 'dry fruits', 'healthy', 'gift'],
    salesCount: 180
  },
  {
    name: 'Happilo Premium Afghan Raisins',
    description: 'Sweet and juicy Afghan raisins with natural sweetness and rich flavor.',
    category: 'Dried Fruits',
    subcategory: 'Raisins',
    images: [
      { url: '/uploads/raisins-1.jpg', alt: 'Afghan Raisins' }
    ],
    sizes: [
      { size: '250g', price: 283, originalPrice: 315, stock: 40 },
      { size: '500g', price: 550, originalPrice: 630, stock: 22 }
    ],
    features: [
      'Premium Afghan Raisins',
      'Natural Sweetness',
      'Rich in Iron & Potassium',
      'Perfect for Baking',
      'Fresh & Juicy'
    ],
    badges: [
      { text: 'BEST SELLER', color: 'red' }
    ],
    status: 'Active',
    tags: ['raisins', 'afghan', 'sweet', 'dried fruits'],
    isBestSeller: true,
    salesCount: 280
  }
];

const sampleReviews = [
  {
    rating: 5,
    title: 'Excellent Quality!',
    comment: 'These almonds are absolutely amazing! Fresh, crunchy, and perfectly salted. Will definitely order again.',
    status: 'approved',
    isVerifiedPurchase: true
  },
  {
    rating: 4,
    title: 'Good Product',
    comment: 'Good quality cashews with nice packaging. Slightly expensive but worth the quality.',
    status: 'approved',
    isVerifiedPurchase: true
  },
  {
    rating: 5,
    title: 'Love these pistachios!',
    comment: 'Best pistachios I have ever tasted. Fresh and flavorful. Highly recommended!',
    status: 'approved',
    isVerifiedPurchase: true
  },
  {
    rating: 2,
    title: 'Not satisfied',
    comment: 'The product quality was not as expected. Some nuts were stale.',
    status: 'pending',
    isVerifiedPurchase: false
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    const users = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      users.push(user);
    }
    console.log(`✅ Created ${users.length} users`);

    // Create products
    console.log('📦 Creating products...');
    const products = [];
    for (const productData of sampleProducts) {
      const product = new Product(productData);
      await product.save();
      products.push(product);
    }
    console.log(`✅ Created ${products.length} products`);

    // Create reviews
    console.log('⭐ Creating reviews...');
    const customerUsers = users.filter(u => u.role === 'customer');
    const reviews = [];
    
    for (let i = 0; i < sampleReviews.length && i < products.length; i++) {
      const reviewData = {
        ...sampleReviews[i],
        product: products[i]._id,
        user: customerUsers[i % customerUsers.length]._id
      };
      
      const review = new Review(reviewData);
      await review.save();
      reviews.push(review);
    }
    console.log(`✅ Created ${reviews.length} reviews`);

    // Update product ratings
    console.log('🔄 Updating product ratings...');
    for (const product of products) {
      await product.updateRating();
    }

    // Seed admin users
    console.log('👑 Seeding admin users...');
    await seedAdmin();
    
    // Seed manager users
    console.log('👥 Seeding manager users...');
    await seedManagers();

    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Products: ${products.length}`);
    console.log(`   Reviews: ${reviews.length}`);
    
    console.log('\n🔐 Admin Credentials:');
    console.log('   Email: admin@happilo.com');
    console.log('   Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
if (require.main === module) {
  connectDB().then(() => {
    seedDatabase();
  });
}

module.exports = { seedDatabase, connectDB };
