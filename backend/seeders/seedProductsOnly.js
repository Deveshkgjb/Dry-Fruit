const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      const mongoURI = process.env.MONGODB_URI;
      await mongoose.connect(mongoURI);
      console.log('✅ Connected to MongoDB Atlas');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      process.exit(1);
    }
  }
};

const seedProductsOnly = async () => {
  await connectDB();

  try {
    console.log('📦 Seeding products...');

    // Find categories first
    const nutsCategory = await Category.findOne({ slug: 'nuts' });
    const berriesCategory = await Category.findOne({ slug: 'berries' });
    const seedsCategory = await Category.findOne({ slug: 'seeds' });
    const datesCategory = await Category.findOne({ slug: 'dates' });
    const driedFruitsCategory = await Category.findOne({ slug: 'dried-fruits' });

    if (!nutsCategory) {
      console.log('❌ Nuts category not found. Please seed categories first.');
      return;
    }

    const sampleProducts = [
      {
        name: 'Premium California Almonds',
        description: 'Premium quality California almonds, rich in protein and healthy fats.',
        category: nutsCategory._id,
        categorySlug: nutsCategory.slug,
        slug: 'premium-california-almonds',
        images: [
          { url: process.env.CLOUDINARY_DEMO_IMAGE }
        ],
        sizes: [
          { size: '250g', price: 299, originalPrice: 399, stock: 50 },
          { size: '500g', price: 549, originalPrice: 699, stock: 30 },
          { size: '1kg', price: 999, originalPrice: 1299, stock: 20 }
        ],
        features: ['Rich in protein', 'High in healthy fats', 'No added preservatives'],
        badges: [{ text: 'BEST SELLER', color: 'red' }],
        status: 'Active',
        brand: 'Happilo',
        countryOfOrigin: 'USA',
        shelfLife: '12 months',
        tags: ['almonds', 'nuts', 'healthy', 'premium', 'best seller'],
        isBestSeller: true,
        isPopular: true,
        rating: { average: 4.8, count: 156 }
      },
      {
        name: 'Premium Cashew Nuts',
        description: 'Premium quality cashew nuts, perfect for snacking and cooking.',
        category: nutsCategory._id,
        categorySlug: nutsCategory.slug,
        slug: 'premium-cashew-nuts',
        images: [
          { url: process.env.CLOUDINARY_DEMO_IMAGE || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', alt: 'Premium Cashew Nuts' }
        ],
        sizes: [
          { size: '250g', price: 349, originalPrice: 449, stock: 40 },
          { size: '500g', price: 649, originalPrice: 799, stock: 25 }
        ],
        features: ['Rich in magnesium', 'Good source of protein', 'Natural taste'],
        badges: [{ text: 'POPULAR', color: 'blue' }],
        status: 'Active',
        brand: 'Happilo',
        countryOfOrigin: 'India',
        shelfLife: '12 months',
        tags: ['cashews', 'nuts', 'healthy', 'premium'],
        isBestSeller: false,
        isPopular: true,
        rating: { average: 4.6, count: 89 }
      },
      {
        name: 'Premium Pistachios',
        description: 'Premium quality pistachios, great for snacking and desserts.',
        category: nutsCategory._id,
        categorySlug: nutsCategory.slug,
        slug: 'premium-pistachios',
        images: [
          { url: process.env.CLOUDINARY_DEMO_IMAGE || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', alt: 'Premium Pistachios' }
        ],
        sizes: [
          { size: '250g', price: 399, originalPrice: 499, stock: 35 },
          { size: '500g', price: 749, originalPrice: 899, stock: 20 }
        ],
        features: ['Rich in antioxidants', 'High in fiber', 'Natural green color'],
        badges: [{ text: 'PREMIUM', color: 'green' }],
        status: 'Active',
        brand: 'Happilo',
        countryOfOrigin: 'Iran',
        shelfLife: '12 months',
        tags: ['pistachios', 'nuts', 'healthy', 'premium'],
        isBestSeller: false,
        isPopular: false,
        rating: { average: 4.7, count: 67 }
      },
      {
        name: 'Premium Walnuts',
        description: 'Premium quality walnuts, excellent for brain health.',
        category: nutsCategory._id,
        categorySlug: nutsCategory.slug,
        slug: 'premium-walnuts',
        images: [
          { url: process.env.CLOUDINARY_DEMO_IMAGE || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', alt: 'Premium Walnuts' }
        ],
        sizes: [
          { size: '250g', price: 279, originalPrice: 349, stock: 45 },
          { size: '500g', price: 519, originalPrice: 649, stock: 30 }
        ],
        features: ['Rich in omega-3', 'Good for brain health', 'Natural taste'],
        badges: [{ text: 'HEALTHY', color: 'green' }],
        status: 'Active',
        brand: 'Happilo',
        countryOfOrigin: 'Chile',
        shelfLife: '12 months',
        tags: ['walnuts', 'nuts', 'healthy', 'omega-3'],
        isBestSeller: false,
        isPopular: true,
        rating: { average: 4.5, count: 43 }
      },
      {
        name: 'Premium Brazil Nuts',
        description: 'Premium quality Brazil nuts, rich in selenium.',
        category: nutsCategory._id,
        categorySlug: nutsCategory.slug,
        slug: 'premium-brazil-nuts',
        images: [
          { url: process.env.CLOUDINARY_DEMO_IMAGE || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', alt: 'Premium Brazil Nuts' }
        ],
        sizes: [
          { size: '250g', price: 449, originalPrice: 549, stock: 25 },
          { size: '500g', price: 849, originalPrice: 999, stock: 15 }
        ],
        features: ['Rich in selenium', 'High in healthy fats', 'Natural taste'],
        badges: [{ text: 'PREMIUM', color: 'purple' }],
        status: 'Active',
        brand: 'Happilo',
        countryOfOrigin: 'Brazil',
        shelfLife: '12 months',
        tags: ['brazil-nuts', 'nuts', 'healthy', 'selenium'],
        isBestSeller: false,
        isPopular: false,
        rating: { average: 4.4, count: 28 }
      }
    ];

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Create products
    for (const productData of sampleProducts) {
      const product = new Product(productData);
      await product.save();
      console.log(`✅ Created product: ${product.name}`);
    }

    console.log(`✅ Successfully created ${sampleProducts.length} products`);
    console.log('🎉 Product seeding completed!');

  } catch (error) {
    console.error('❌ Error seeding products:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('📊 Disconnected from MongoDB');
    }
  }
};

if (require.main === module) {
  seedProductsOnly();
}

module.exports = seedProductsOnly;
