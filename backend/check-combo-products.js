const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dryfruits');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Check combo products
const checkComboProducts = async () => {
  try {
    console.log('🔄 Checking combo products...');
    
    // Get all products
    const allProducts = await Product.find({});
    console.log(`📊 Total products: ${allProducts.length}`);
    
    // Check for combo products using different criteria
    const comboProducts = allProducts.filter(product => {
      const isValueCombo = product.isValueCombo === true;
      const hasValueComboSection = product.displaySections?.valueCombos === true;
      const hasValueComboTag = product.tags && product.tags.some(tag => 
        tag.toLowerCase().includes('value') || tag.toLowerCase().includes('combo')
      );
      const isComboCategory = product.categorySlug === 'combos' || 
                            product.category?.name?.toLowerCase().includes('combo');
      
      return isValueCombo || hasValueComboSection || hasValueComboTag || isComboCategory;
    });
    
    console.log(`\n🎯 Combo products found: ${comboProducts.length}`);
    
    if (comboProducts.length > 0) {
      console.log('\n📝 Combo products details:');
      comboProducts.forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.name}`);
        console.log(`   - isValueCombo: ${product.isValueCombo}`);
        console.log(`   - displaySections.valueCombos: ${product.displaySections?.valueCombos}`);
        console.log(`   - category: ${product.category?.name || product.category}`);
        console.log(`   - categorySlug: ${product.categorySlug}`);
        console.log(`   - tags: ${product.tags?.join(', ') || 'None'}`);
        console.log(`   - status: ${product.status}`);
        console.log(`   - isActive: ${product.isActive}`);
      });
    } else {
      console.log('\n❌ No combo products found!');
      console.log('\n🔍 Checking all products for reference:');
      allProducts.slice(0, 5).forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.name}`);
        console.log(`   - isValueCombo: ${product.isValueCombo}`);
        console.log(`   - displaySections: ${JSON.stringify(product.displaySections)}`);
        console.log(`   - category: ${product.category?.name || product.category}`);
        console.log(`   - tags: ${product.tags?.join(', ') || 'None'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking combo products:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
};

// Run the check
connectDB().then(() => {
  checkComboProducts();
});
