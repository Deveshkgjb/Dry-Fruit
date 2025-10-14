#!/usr/bin/env node

const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
require('dotenv').config();

// Sample dry fruit products with realistic data
const dryFruitProducts = [
  {
    name: "Premium California Almonds",
    description: "Handpicked premium California almonds, rich in protein and healthy fats. Perfect for snacking or adding to your favorite recipes.",
    images: [
      { url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop", alt: "Premium California Almonds" },
      { url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop", alt: "Almonds close up" }
    ],
    category: "Almonds",
    sizes: [
      { size: "250g", price: 299, originalPrice: 399, stock: 50 },
      { size: "500g", price: 549, originalPrice: 749, stock: 30 },
      { size: "1kg", price: 999, originalPrice: 1399, stock: 20 }
    ],
    badges: [
      { text: "Premium", color: "green" },
      { text: "25% OFF", color: "red" }
    ],
    rating: { average: 4.7, count: 156 },
    isPopular: true,
    displaySections: {
      popular: true,
      valueCombos: false,
      youMayAlsoLike: true
    }
  },
  {
    name: "Organic Cashew Nuts",
    description: "Premium organic cashew nuts, naturally sweet and creamy. Great source of healthy fats and minerals.",
    images: [
      { url: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500&h=500&fit=crop", alt: "Organic Cashew Nuts" },
      { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop", alt: "Cashew nuts bowl" }
    ],
    category: "Cashews",
    sizes: [
      { size: "200g", price: 399, originalPrice: 499, stock: 40 },
      { size: "500g", price: 899, originalPrice: 1199, stock: 25 },
      { size: "1kg", price: 1699, originalPrice: 2199, stock: 15 }
    ],
    badges: [
      { text: "Organic", color: "green" },
      { text: "20% OFF", color: "red" }
    ],
    rating: { average: 4.5, count: 89 },
    isPopular: true,
    displaySections: {
      popular: true,
      valueCombos: true,
      youMayAlsoLike: true
    }
  },
  {
    name: "Premium Pistachio Nuts",
    description: "Premium quality pistachio nuts, naturally rich in antioxidants and protein. Perfect for healthy snacking.",
    images: [
      { url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop", alt: "Premium Pistachio Nuts" },
      { url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop", alt: "Pistachios in bowl" }
    ],
    category: "Pistachios",
    sizes: [
      { size: "250g", price: 499, originalPrice: 649, stock: 35 },
      { size: "500g", price: 899, originalPrice: 1199, stock: 20 },
      { size: "1kg", price: 1699, originalPrice: 2199, stock: 10 }
    ],
    badges: [
      { text: "Premium", color: "blue" },
      { text: "23% OFF", color: "red" }
    ],
    rating: { average: 4.8, count: 203 },
    isPopular: true,
    displaySections: {
      popular: true,
      valueCombos: false,
      youMayAlsoLike: true
    }
  },
  {
    name: "Dried Blueberries",
    description: "Sweet and tangy dried blueberries, packed with antioxidants and natural sweetness. Great for cereals and baking.",
    images: [
      { url: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=500&h=500&fit=crop", alt: "Dried Blueberries" },
      { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop", alt: "Blueberries close up" }
    ],
    category: "Dried Fruits",
    sizes: [
      { size: "200g", price: 399, originalPrice: 499, stock: 45 },
      { size: "500g", price: 899, originalPrice: 1199, stock: 30 },
      { size: "1kg", price: 1699, originalPrice: 2199, stock: 20 }
    ],
    badges: [
      { text: "Antioxidant Rich", color: "blue" },
      { text: "20% OFF", color: "red" }
    ],
    rating: { average: 4.6, count: 127 },
    isPopular: false,
    displaySections: {
      popular: false,
      valueCombos: true,
      youMayAlsoLike: true
    }
  },
  {
    name: "Roasted Mixed Nuts",
    description: "Premium blend of roasted almonds, cashews, walnuts, and pistachios. Perfect for snacking and gifting.",
    images: [
      { url: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500&h=500&fit=crop", alt: "Roasted Mixed Nuts" },
      { url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop", alt: "Mixed nuts variety" }
    ],
    category: "Mixed Nuts",
    sizes: [
      { size: "500g", price: 799, originalPrice: 999, stock: 40 },
      { size: "1kg", price: 1499, originalPrice: 1899, stock: 25 },
      { size: "2kg", price: 2799, originalPrice: 3499, stock: 15 }
    ],
    badges: [
      { text: "Value Pack", color: "purple" },
      { text: "20% OFF", color: "red" }
    ],
    rating: { average: 4.4, count: 87 },
    isPopular: true,
    displaySections: {
      popular: true,
      valueCombos: true,
      youMayAlsoLike: true
    }
  },
  {
    name: "Premium Walnuts",
    description: "Fresh premium walnuts, rich in omega-3 fatty acids. Perfect for brain health and healthy snacking.",
    images: [
      { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop", alt: "Premium Walnuts" },
      { url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop", alt: "Walnuts in shell" }
    ],
    category: "Walnuts",
    sizes: [
      { size: "250g", price: 349, originalPrice: 449, stock: 30 },
      { size: "500g", price: 649, originalPrice: 849, stock: 20 },
      { size: "1kg", price: 1199, originalPrice: 1599, stock: 15 }
    ],
    badges: [
      { text: "Brain Food", color: "blue" },
      { text: "22% OFF", color: "red" }
    ],
    rating: { average: 4.3, count: 95 },
    isPopular: false,
    displaySections: {
      popular: false,
      valueCombos: false,
      youMayAlsoLike: true
    }
  },
  {
    name: "Dried Cranberries",
    description: "Sweet and tart dried cranberries, perfect for salads, baking, and snacking. Rich in vitamin C.",
    images: [
      { url: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=500&h=500&fit=crop", alt: "Dried Cranberries" },
      { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop", alt: "Cranberries bowl" }
    ],
    category: "Dried Fruits",
    sizes: [
      { size: "200g", price: 299, originalPrice: 399, stock: 50 },
      { size: "500g", price: 649, originalPrice: 849, stock: 35 },
      { size: "1kg", price: 1199, originalPrice: 1599, stock: 25 }
    ],
    badges: [
      { text: "Vitamin C", color: "orange" },
      { text: "25% OFF", color: "red" }
    ],
    rating: { average: 4.2, count: 73 },
    isPopular: false,
    displaySections: {
      popular: false,
      valueCombos: true,
      youMayAlsoLike: true
    }
  },
  {
    name: "Premium Raisins",
    description: "Sweet and juicy premium raisins, naturally dried grapes. Perfect for baking, cooking, and snacking.",
    images: [
      { url: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500&h=500&fit=crop", alt: "Premium Raisins" },
      { url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop", alt: "Raisins close up" }
    ],
    category: "Dried Fruits",
    sizes: [
      { size: "250g", price: 199, originalPrice: 249, stock: 60 },
      { size: "500g", price: 349, originalPrice: 449, stock: 40 },
      { size: "1kg", price: 649, originalPrice: 849, stock: 30 }
    ],
    badges: [
      { text: "Natural Sweet", color: "green" },
      { text: "20% OFF", color: "red" }
    ],
    rating: { average: 4.1, count: 156 },
    isPopular: true,
    displaySections: {
      popular: true,
      valueCombos: false,
      youMayAlsoLike: true
    }
  },
  {
    name: "Premium Hazelnuts",
    description: "Premium quality hazelnuts, rich and buttery flavor. Perfect for desserts, chocolates, and healthy snacking.",
    images: [
      { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop", alt: "Premium Hazelnuts" },
      { url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop", alt: "Hazelnuts variety" }
    ],
    category: "Hazelnuts",
    sizes: [
      { size: "200g", price: 449, originalPrice: 599, stock: 25 },
      { size: "500g", price: 999, originalPrice: 1299, stock: 15 },
      { size: "1kg", price: 1899, originalPrice: 2499, stock: 10 }
    ],
    badges: [
      { text: "Premium", color: "yellow" },
      { text: "25% OFF", color: "red" }
    ],
    rating: { average: 4.9, count: 67 },
    isPopular: false,
    displaySections: {
      popular: false,
      valueCombos: false,
      youMayAlsoLike: true
    }
  },
  {
    name: "Dried Apricots",
    description: "Sweet and chewy dried apricots, rich in fiber and vitamin A. Perfect for healthy snacking and cooking.",
    images: [
      { url: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=500&h=500&fit=crop", alt: "Dried Apricots" },
      { url: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500&h=500&fit=crop", alt: "Apricots close up" }
    ],
    category: "Dried Fruits",
    sizes: [
      { size: "250g", price: 349, originalPrice: 449, stock: 40 },
      { size: "500g", price: 649, originalPrice: 849, stock: 25 },
      { size: "1kg", price: 1199, originalPrice: 1599, stock: 20 }
    ],
    badges: [
      { text: "Vitamin A", color: "orange" },
      { text: "22% OFF", color: "red" }
    ],
    rating: { average: 4.4, count: 89 },
    isPopular: false,
    displaySections: {
      popular: false,
      valueCombos: true,
      youMayAlsoLike: true
    }
  }
];

const seedRandomProducts = async () => {
  try {
    console.log('🌱 Starting Random Dry Fruit Products Seeding...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/happilo', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully!\n');

    // Get or create categories
    console.log('📂 Setting up categories...');
    const categoryData = [
      { name: 'Almonds', parentCategory: 'nuts' },
      { name: 'Cashews', parentCategory: 'nuts' },
      { name: 'Pistachios', parentCategory: 'nuts' },
      { name: 'Dried Fruits', parentCategory: 'dried-fruits' },
      { name: 'Mixed Nuts', parentCategory: 'mixes' },
      { name: 'Walnuts', parentCategory: 'nuts' },
      { name: 'Hazelnuts', parentCategory: 'nuts' }
    ];
    const categoryDocs = [];

    for (const catData of categoryData) {
      let category = await Category.findOne({ name: catData.name });
      if (!category) {
        category = new Category({
          name: catData.name,
          slug: catData.name.toLowerCase().replace(/\s+/g, '-'),
          description: `Premium ${catData.name.toLowerCase()} collection`,
          parentCategory: catData.parentCategory,
          isActive: true
        });
        await category.save();
        console.log(`✅ Created category: ${catData.name} (${catData.parentCategory})`);
      } else {
        console.log(`ℹ️  Category already exists: ${catData.name}`);
      }
      categoryDocs.push(category);
    }

    console.log('\n🛍️  Creating products...');
    let createdCount = 0;
    let skippedCount = 0;

    for (const productData of dryFruitProducts) {
      try {
        // Check if product already exists
        const existingProduct = await Product.findOne({ name: productData.name });
        if (existingProduct) {
          console.log(`⏭️  Skipping existing product: ${productData.name}`);
          skippedCount++;
          continue;
        }

        // Find the category
        const category = categoryDocs.find(cat => cat.name === productData.category);
        if (!category) {
          console.log(`❌ Category not found for product: ${productData.name}`);
          continue;
        }

        // Create the product
        const product = new Product({
          name: productData.name,
          slug: productData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          description: productData.description,
          images: productData.images,
          category: category._id,
          categorySlug: category.slug,
          sizes: productData.sizes,
          badges: productData.badges,
          rating: productData.rating,
          isPopular: productData.isPopular,
          displaySections: productData.displaySections,
          status: 'Active',
          isActive: true,
          stock: productData.sizes.reduce((total, size) => total + size.stock, 0)
        });

        await product.save();
        console.log(`✅ Created product: ${productData.name} (₹${productData.sizes[0].price})`);
        createdCount++;

      } catch (error) {
        console.error(`❌ Error creating product ${productData.name}:`, error.message);
      }
    }

    console.log('\n🎉 Seeding completed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Products created: ${createdCount}`);
    console.log(`⏭️  Products skipped: ${skippedCount}`);
    console.log(`📊 Total products processed: ${dryFruitProducts.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Show summary of created products
    if (createdCount > 0) {
      console.log('\n📋 Created Products Summary:');
      const products = await Product.find({}).populate('category', 'name').sort({ createdAt: -1 }).limit(createdCount);
      products.forEach((product, index) => {
        const mainSize = product.sizes[0];
        console.log(`${index + 1}. ${product.name} - ₹${mainSize.price} (${mainSize.size}) - ${product.category.name}`);
      });
    }

  } catch (error) {
    console.error('\n❌ Error seeding products:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n📡 Database connection closed.');
  }
};

// Run the seeder
if (require.main === module) {
  seedRandomProducts();
}

module.exports = seedRandomProducts;
