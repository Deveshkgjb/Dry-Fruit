const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const sampleProducts = [
  // Best Sellers
  {
    name: "Premium California Almonds",
    description: "Premium quality California almonds, rich in protein and healthy fats. Perfect for snacking or adding to your favorite recipes.",
    category: "Nuts",
    subcategory: "Almonds",
    images: [
      { url: "/src/Components/Homepages/dev1.png", alt: "Premium California Almonds" },
      { url: "/src/Components/Homepages/dev2.png", alt: "Almonds close up" }
    ],
    sizes: [
      { size: "200g", price: 299, originalPrice: 399, stock: 50 },
      { size: "500g", price: 699, originalPrice: 899, stock: 30 },
      { size: "1kg", price: 1299, originalPrice: 1599, stock: 20 }
    ],
    features: [
      "Premium California quality",
      "Rich in protein and healthy fats",
      "Perfect for snacking",
      "No added preservatives"
    ],
    badges: [
      { text: "BEST SELLER", color: "red" },
      { text: "PREMIUM", color: "green" }
    ],
    status: "Active",
    brand: "Happilo",
    countryOfOrigin: "USA",
    shelfLife: "12 months",
    tags: ["almonds", "nuts", "healthy", "premium", "best seller"],
    isBestSeller: true,
    isPopular: true,
    rating: 4.8,
    reviewCount: 156
  },
  {
    name: "Premium Cashew Nuts",
    description: "Whole cashew nuts with a rich, buttery flavor. Great source of healthy fats and minerals.",
    category: "Nuts",
    subcategory: "Cashews",
    images: [
      { url: "/src/Components/Homepages/dev1.png", alt: "Premium Cashew Nuts" }
    ],
    sizes: [
      { size: "200g", price: 349, originalPrice: 449, stock: 40 },
      { size: "500g", price: 799, originalPrice: 999, stock: 25 },
      { size: "1kg", price: 1499, originalPrice: 1799, stock: 15 }
    ],
    features: [
      "Whole cashew nuts",
      "Rich buttery flavor",
      "Source of healthy fats",
      "Premium quality"
    ],
    badges: [
      { text: "BEST SELLER", color: "red" }
    ],
    status: "Active",
    brand: "Happilo",
    countryOfOrigin: "India",
    shelfLife: "12 months",
    tags: ["cashews", "nuts", "healthy", "best seller"],
    isBestSeller: true,
    isPopular: true,
    rating: 4.7,
    reviewCount: 89
  },
  {
    name: "Premium Pistachios",
    description: "Shelled pistachios with a unique flavor and beautiful green color. Perfect for snacking.",
    category: "Nuts",
    subcategory: "Pistachios",
    images: [
      { url: "/src/Components/Homepages/dev1.png", alt: "Premium Pistachios" }
    ],
    sizes: [
      { size: "200g", price: 399, originalPrice: 499, stock: 35 },
      { size: "500g", price: 899, originalPrice: 1099, stock: 20 }
    ],
    features: [
      "Shelled pistachios",
      "Unique flavor",
      "Beautiful green color",
      "Perfect for snacking"
    ],
    badges: [
      { text: "BEST SELLER", color: "red" }
    ],
    status: "Active",
    brand: "Happilo",
    countryOfOrigin: "Iran",
    shelfLife: "12 months",
    tags: ["pistachios", "nuts", "healthy", "best seller"],
    isBestSeller: true,
    isPopular: false,
    rating: 4.6,
    reviewCount: 67
  },

  // Value Combos
  {
    name: "Mixed Nuts Combo",
    description: "A perfect blend of almonds, cashews, walnuts, and pistachios. Great value for money.",
    category: "Mixes",
    categorySlug: "mixes",
    subcategory: "Mixed Nuts",
    slug: "mixed-nuts-combo",
    images: [
      { url: "/src/Components/Homepages/dev1.png", alt: "Mixed Nuts Combo" }
    ],
    sizes: [
      { size: "500g", price: 599, originalPrice: 799, stock: 30 },
      { size: "1kg", price: 1099, originalPrice: 1399, stock: 20 }
    ],
    features: [
      "Perfect blend of 4 nuts",
      "Great value for money",
      "Balanced nutrition",
      "Premium quality"
    ],
    badges: [
      { text: "VALUE COMBO", color: "green" }
    ],
    status: "Active",
    brand: "Happilo",
    countryOfOrigin: "India",
    shelfLife: "12 months",
    tags: ["mixed nuts", "combo", "value combo", "nuts"],
    isBestSeller: false,
    isPopular: true,
    isValueCombo: true,
    displaySections: {
      valueCombos: true
    },
    rating: 4.5,
    reviewCount: 45
  },
  {
    name: "Dried Fruits Mix",
    description: "A delightful mix of raisins, apricots, prunes, and figs. Natural sweetness without added sugar.",
    category: "Dried Fruits",
    categorySlug: "dried-fruits",
    subcategory: "Mixed Dried Fruits",
    slug: "dried-fruits-mix",
    images: [
      { url: "/src/Components/Homepages/dev1.png", alt: "Dried Fruits Mix" }
    ],
    sizes: [
      { size: "300g", price: 399, originalPrice: 499, stock: 25 },
      { size: "600g", price: 699, originalPrice: 899, stock: 15 }
    ],
    features: [
      "Natural sweetness",
      "No added sugar",
      "Rich in fiber",
      "Perfect snack"
    ],
    badges: [
      { text: "VALUE COMBO", color: "green" }
    ],
    status: "Active",
    brand: "Happilo",
    countryOfOrigin: "India",
    shelfLife: "12 months",
    tags: ["dried fruits", "combo", "value combo", "natural"],
    isBestSeller: false,
    isPopular: true,
    isValueCombo: true,
    displaySections: {
      valueCombos: true
    },
    rating: 4.4,
    reviewCount: 38
  },

  // Popular Products
  {
    name: "Premium Walnuts",
    description: "Fresh walnuts with a rich, nutty flavor. Great for baking and snacking.",
    category: "Nuts",
    subcategory: "Walnuts",
    images: [
      { url: "/src/Components/Homepages/dev1.png", alt: "Premium Walnuts" }
    ],
    sizes: [
      { size: "200g", price: 279, originalPrice: 349, stock: 40 },
      { size: "500g", price: 649, originalPrice: 799, stock: 25 }
    ],
    features: [
      "Fresh walnuts",
      "Rich nutty flavor",
      "Great for baking",
      "Premium quality"
    ],
    badges: [
      { text: "POPULAR", color: "blue" }
    ],
    status: "Active",
    brand: "Happilo",
    countryOfOrigin: "India",
    shelfLife: "12 months",
    tags: ["walnuts", "nuts", "healthy", "popular"],
    isBestSeller: false,
    isPopular: true,
    rating: 4.3,
    reviewCount: 52
  },
  {
    name: "Premium Raisins",
    description: "Sweet and juicy raisins, perfect for snacking or adding to your favorite dishes.",
    category: "Dried Fruits",
    subcategory: "Raisins",
    images: [
      { url: "/src/Components/Homepages/dev1.png", alt: "Premium Raisins" }
    ],
    sizes: [
      { size: "250g", price: 199, originalPrice: 249, stock: 60 },
      { size: "500g", price: 379, originalPrice: 449, stock: 35 }
    ],
    features: [
      "Sweet and juicy",
      "Perfect for snacking",
      "Natural sweetness",
      "Premium quality"
    ],
    badges: [
      { text: "POPULAR", color: "blue" }
    ],
    status: "Active",
    brand: "Happilo",
    countryOfOrigin: "India",
    shelfLife: "12 months",
    tags: ["raisins", "dried fruits", "sweet", "popular"],
    isBestSeller: false,
    isPopular: true,
    rating: 4.2,
    reviewCount: 41
  },

  // Regular Products
  {
    name: "Brazil Nuts",
    description: "Rich and creamy Brazil nuts, excellent source of selenium and healthy fats.",
    category: "Nuts",
    subcategory: "Brazil Nuts",
    images: [
      { url: "/src/Components/Homepages/dev1.png", alt: "Brazil Nuts" }
    ],
    sizes: [
      { size: "200g", price: 449, originalPrice: 549, stock: 20 },
      { size: "500g", price: 999, originalPrice: 1199, stock: 15 }
    ],
    features: [
      "Rich and creamy",
      "Source of selenium",
      "Healthy fats",
      "Premium quality"
    ],
    badges: [],
    status: "Active",
    brand: "Happilo",
    countryOfOrigin: "Brazil",
    shelfLife: "12 months",
    tags: ["brazil nuts", "nuts", "healthy", "selenium"],
    isBestSeller: false,
    isPopular: false,
    rating: 4.1,
    reviewCount: 23
  },
  {
    name: "Dried Apricots",
    description: "Sweet and tangy dried apricots, rich in vitamins and fiber.",
    category: "Dried Fruits",
    subcategory: "Apricots",
    images: [
      { url: "/src/Components/Homepages/dev1.png", alt: "Dried Apricots" }
    ],
    sizes: [
      { size: "200g", price: 249, originalPrice: 299, stock: 30 },
      { size: "500g", price: 549, originalPrice: 649, stock: 20 }
    ],
    features: [
      "Sweet and tangy",
      "Rich in vitamins",
      "High fiber content",
      "Natural sweetness"
    ],
    badges: [],
    status: "Active",
    brand: "Happilo",
    countryOfOrigin: "Turkey",
    shelfLife: "12 months",
    tags: ["apricots", "dried fruits", "vitamins", "fiber"],
    isBestSeller: false,
    isPopular: false,
    rating: 4.0,
    reviewCount: 18
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('❌ MONGODB_URI environment variable is not set');
      process.exit(1);
    }
    
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${insertedProducts.length} products`);

    // Display summary
    const bestSellers = insertedProducts.filter(p => p.isBestSeller).length;
    const popular = insertedProducts.filter(p => p.isPopular).length;
    const valueCombos = insertedProducts.filter(p => p.tags?.includes('value combo')).length;
    const regular = insertedProducts.filter(p => !p.isBestSeller && !p.isPopular).length;

    console.log('\n📊 Product Summary:');
    console.log(`   🏆 Best Sellers: ${bestSellers}`);
    console.log(`   ⭐ Popular: ${popular}`);
    console.log(`   💰 Value Combos: ${valueCombos}`);
    console.log(`   📦 Regular: ${regular}`);
    console.log(`   📈 Total: ${insertedProducts.length}`);

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedProducts();
