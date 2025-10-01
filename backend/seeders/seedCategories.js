const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');

const categoriesData = [
  // Nuts
  {
    name: 'Almonds',
    slug: 'almonds',
    description: 'Premium quality almonds, rich in protein and healthy fats.',
    icon: '🥜',
    parentCategory: 'nuts',
    healthBenefits: [
      'Rich in vitamin E and antioxidants',
      'Good source of protein and fiber',
      'Helps maintain healthy cholesterol levels',
      'Supports brain health'
    ],
    usageTips: [
      'Perfect for snacking',
      'Great in baking and cooking',
      'Add to breakfast cereals',
      'Use in smoothies and yogurt'
    ],
    nutritionalInfo: {
      calories: 579,
      protein: 21,
      carbs: 22,
      fat: 50,
      fiber: 12,
      sugar: 4
    }
  },
  {
    name: 'Cashews',
    slug: 'cashews',
    description: 'Creamy and buttery cashew nuts, perfect for snacking.',
    icon: '🥜',
    parentCategory: 'nuts',
    healthBenefits: [
      'Rich in healthy monounsaturated fats',
      'Good source of copper and magnesium',
      'Supports heart health',
      'Helps with bone health'
    ],
    usageTips: [
      'Excellent for snacking',
      'Great in stir-fries',
      'Perfect for making nut butter',
      'Add to desserts and baking'
    ]
  },
  {
    name: 'Pistachios',
    slug: 'pistachios',
    description: 'Premium pistachio nuts with natural green color and rich flavor.',
    icon: '🥜',
    parentCategory: 'nuts',
    healthBenefits: [
      'High in protein and fiber',
      'Rich in antioxidants',
      'Supports eye health',
      'Helps with weight management'
    ],
    usageTips: [
      'Perfect snack on their own',
      'Great in ice cream and desserts',
      'Add to salads',
      'Use in baking'
    ]
  },
  {
    name: 'Walnuts',
    slug: 'walnuts',
    description: 'Brain-shaped walnuts, rich in omega-3 fatty acids.',
    icon: '🥜',
    parentCategory: 'nuts',
    healthBenefits: [
      'High in omega-3 fatty acids',
      'Supports brain health',
      'Rich in antioxidants',
      'Helps reduce inflammation'
    ],
    usageTips: [
      'Great in baking',
      'Perfect for salads',
      'Add to breakfast bowls',
      'Use in pesto and sauces'
    ]
  },
  {
    name: 'Brazil Nuts',
    slug: 'brazil-nuts',
    description: 'Large, creamy Brazil nuts rich in selenium.',
    icon: '🥜',
    parentCategory: 'nuts',
    healthBenefits: [
      'Excellent source of selenium',
      'Supports thyroid function',
      'Rich in healthy fats',
      'Helps boost immunity'
    ],
    usageTips: [
      'Eat in moderation (1-2 per day)',
      'Great for snacking',
      'Add to trail mixes',
      'Use in baking'
    ]
  },
  {
    name: 'Peanuts',
    slug: 'peanuts',
    description: 'Protein-rich peanuts, perfect for snacking and cooking.',
    icon: '🥜',
    parentCategory: 'nuts',
    healthBenefits: [
      'High in protein and fiber',
      'Good source of biotin',
      'Supports heart health',
      'Rich in folate'
    ],
    usageTips: [
      'Perfect for snacking',
      'Great in Asian cuisine',
      'Make peanut butter',
      'Add to stir-fries'
    ]
  },

  // Dried Fruits
  {
    name: 'Raisins',
    slug: 'raisins',
    description: 'Sweet and chewy raisins, perfect natural sweetener.',
    icon: '🍇',
    parentCategory: 'dried-fruits',
    healthBenefits: [
      'Rich in iron and potassium',
      'Natural source of energy',
      'Good for bone health',
      'Helps with digestion'
    ],
    usageTips: [
      'Great in baking',
      'Perfect for oatmeal',
      'Add to salads',
      'Use in trail mixes'
    ]
  },
  {
    name: 'Anjeer (Figs)',
    slug: 'anjeer',
    description: 'Sweet and nutritious dried figs, rich in fiber.',
    icon: '🍇',
    parentCategory: 'dried-fruits',
    healthBenefits: [
      'High in dietary fiber',
      'Rich in calcium and potassium',
      'Natural laxative properties',
      'Good for bone health'
    ],
    usageTips: [
      'Eat as a healthy snack',
      'Great in baking',
      'Add to cheese platters',
      'Use in desserts'
    ]
  },
  {
    name: 'Apricots',
    slug: 'apricots',
    description: 'Sweet and tangy dried apricots, rich in vitamin A.',
    icon: '🍇',
    parentCategory: 'dried-fruits',
    healthBenefits: [
      'Rich in vitamin A and C',
      'Good source of fiber',
      'Supports eye health',
      'Helps with skin health'
    ],
    usageTips: [
      'Perfect for snacking',
      'Great in baking',
      'Add to breakfast cereals',
      'Use in trail mixes'
    ]
  },
  {
    name: 'Prunes',
    slug: 'prunes',
    description: 'Sweet and nutritious prunes, known for digestive benefits.',
    icon: '🍇',
    parentCategory: 'dried-fruits',
    healthBenefits: [
      'Excellent for digestion',
      'Rich in fiber and potassium',
      'Good for bone health',
      'Natural laxative'
    ],
    usageTips: [
      'Eat as a healthy snack',
      'Great in baking',
      'Add to smoothies',
      'Use in desserts'
    ]
  },
  {
    name: 'Kiwi',
    slug: 'kiwi',
    description: 'Tart and sweet dried kiwi, rich in vitamin C.',
    icon: '🍇',
    parentCategory: 'dried-fruits',
    healthBenefits: [
      'Rich in vitamin C',
      'Good source of fiber',
      'Supports immune system',
      'Helps with digestion'
    ],
    usageTips: [
      'Great for snacking',
      'Add to fruit salads',
      'Use in baking',
      'Perfect for trail mixes'
    ]
  },
  {
    name: 'Mango',
    slug: 'mango',
    description: 'Sweet and tropical dried mango, rich in vitamins.',
    icon: '🍇',
    parentCategory: 'dried-fruits',
    healthBenefits: [
      'Rich in vitamin A and C',
      'Good source of fiber',
      'Supports eye health',
      'Boosts immunity'
    ],
    usageTips: [
      'Perfect tropical snack',
      'Great in smoothies',
      'Add to breakfast bowls',
      'Use in desserts'
    ]
  },

  // Berries
  {
    name: 'Blueberries',
    slug: 'blueberries',
    description: 'Antioxidant-rich dried blueberries, perfect for health-conscious consumers.',
    icon: '🍓',
    parentCategory: 'berries',
    healthBenefits: [
      'Rich in antioxidants',
      'Supports brain health',
      'Good for heart health',
      'Helps with memory'
    ],
    usageTips: [
      'Great in breakfast cereals',
      'Perfect for baking',
      'Add to smoothies',
      'Use in desserts'
    ]
  },
  {
    name: 'Cranberries',
    slug: 'cranberries',
    description: 'Tart and tangy dried cranberries, great for urinary health.',
    icon: '🍓',
    parentCategory: 'berries',
    healthBenefits: [
      'Supports urinary tract health',
      'Rich in antioxidants',
      'Good for heart health',
      'Helps with inflammation'
    ],
    usageTips: [
      'Great in salads',
      'Perfect for baking',
      'Add to trail mixes',
      'Use in desserts'
    ]
  },
  {
    name: 'Strawberries',
    slug: 'strawberries',
    description: 'Sweet and aromatic dried strawberries, rich in vitamin C.',
    icon: '🍓',
    parentCategory: 'berries',
    healthBenefits: [
      'Rich in vitamin C',
      'Good source of fiber',
      'Supports immune system',
      'Helps with skin health'
    ],
    usageTips: [
      'Perfect for snacking',
      'Great in baking',
      'Add to breakfast bowls',
      'Use in desserts'
    ]
  },

  // Dates
  {
    name: 'Omani',
    slug: 'omani',
    description: 'Premium Omani dates, known for their rich flavor and texture.',
    icon: '🌴',
    parentCategory: 'dates',
    healthBenefits: [
      'Natural source of energy',
      'Rich in potassium and fiber',
      'Good for bone health',
      'Helps with digestion'
    ],
    usageTips: [
      'Perfect natural sweetener',
      'Great in baking',
      'Add to smoothies',
      'Eat as healthy snack'
    ]
  },
  {
    name: 'Queen Kalmi',
    slug: 'queen-kalmi',
    description: 'Premium Queen Kalmi dates, soft and delicious.',
    icon: '🌴',
    parentCategory: 'dates',
    healthBenefits: [
      'Rich in natural sugars',
      'Good source of fiber',
      'Supports energy levels',
      'Helps with digestion'
    ],
    usageTips: [
      'Excellent for snacking',
      'Great in desserts',
      'Add to breakfast bowls',
      'Use in baking'
    ]
  },
  {
    name: 'Arabian',
    slug: 'arabian',
    description: 'Traditional Arabian dates, sweet and nutritious.',
    icon: '🌴',
    parentCategory: 'dates',
    healthBenefits: [
      'Natural energy booster',
      'Rich in minerals',
      'Good for heart health',
      'Supports muscle function'
    ],
    usageTips: [
      'Perfect natural sweetener',
      'Great in smoothies',
      'Add to trail mixes',
      'Use in desserts'
    ]
  },
  {
    name: 'Ajwa',
    slug: 'ajwa',
    description: 'Premium Ajwa dates, known for their medicinal properties.',
    icon: '🌴',
    parentCategory: 'dates',
    healthBenefits: [
      'Rich in antioxidants',
      'Supports heart health',
      'Good for brain function',
      'Helps with digestion'
    ],
    usageTips: [
      'Eat as healthy snack',
      'Great in desserts',
      'Add to breakfast bowls',
      'Use in baking'
    ]
  },

  // Seeds
  {
    name: 'Chia Seeds',
    slug: 'chia-seeds',
    description: 'Superfood chia seeds, rich in omega-3 and fiber.',
    icon: '🌱',
    parentCategory: 'seeds',
    healthBenefits: [
      'Rich in omega-3 fatty acids',
      'High in fiber and protein',
      'Good for heart health',
      'Helps with weight management'
    ],
    usageTips: [
      'Add to smoothies',
      'Great in puddings',
      'Sprinkle on yogurt',
      'Use in baking'
    ]
  },
  {
    name: 'Flax Seeds',
    slug: 'flax-seeds',
    description: 'Nutty flax seeds, excellent source of omega-3 and lignans.',
    icon: '🌱',
    parentCategory: 'seeds',
    healthBenefits: [
      'Rich in omega-3 fatty acids',
      'High in lignans',
      'Good for heart health',
      'Supports hormone balance'
    ],
    usageTips: [
      'Grind before using',
      'Add to smoothies',
      'Great in baking',
      'Sprinkle on cereals'
    ]
  },
  {
    name: 'Pumpkin Seeds',
    slug: 'pumpkin-seeds',
    description: 'Crunchy pumpkin seeds, rich in magnesium and zinc.',
    icon: '🌱',
    parentCategory: 'seeds',
    healthBenefits: [
      'Rich in magnesium and zinc',
      'Good source of protein',
      'Supports heart health',
      'Helps with sleep'
    ],
    usageTips: [
      'Perfect for snacking',
      'Great in salads',
      'Add to trail mixes',
      'Use in baking'
    ]
  },
  {
    name: 'Sunflower Seeds',
    slug: 'sunflower-seeds',
    description: 'Nutty sunflower seeds, rich in vitamin E and selenium.',
    icon: '🌱',
    parentCategory: 'seeds',
    healthBenefits: [
      'Rich in vitamin E',
      'Good source of selenium',
      'Supports heart health',
      'Helps with inflammation'
    ],
    usageTips: [
      'Great for snacking',
      'Add to salads',
      'Perfect in baking',
      'Use in trail mixes'
    ]
  },

  // Mixes
  {
    name: 'Fitness Mix',
    slug: 'fitness-mix',
    description: 'Protein-rich mix perfect for fitness enthusiasts.',
    icon: '🥗',
    parentCategory: 'mixes',
    healthBenefits: [
      'High in protein',
      'Good source of energy',
      'Supports muscle recovery',
      'Rich in healthy fats'
    ],
    usageTips: [
      'Perfect pre-workout snack',
      'Great post-workout',
      'Add to smoothies',
      'Use in protein bars'
    ]
  },
  {
    name: 'Roasted Party Mix',
    slug: 'roasted-party-mix',
    description: 'Delicious roasted mix perfect for parties and gatherings.',
    icon: '🥗',
    parentCategory: 'mixes',
    healthBenefits: [
      'Mixed nutrients',
      'Good source of energy',
      'Variety of antioxidants',
      'Supports heart health'
    ],
    usageTips: [
      'Perfect for parties',
      'Great for snacking',
      'Add to charcuterie boards',
      'Use in gift baskets'
    ]
  },
  {
    name: 'Nuts & Berries Mix',
    slug: 'nuts-berries-mix',
    description: 'Sweet and crunchy mix of premium nuts and berries.',
    icon: '🥗',
    parentCategory: 'mixes',
    healthBenefits: [
      'Balanced nutrients',
      'Rich in antioxidants',
      'Good for heart health',
      'Supports brain function'
    ],
    usageTips: [
      'Perfect for snacking',
      'Great in breakfast bowls',
      'Add to yogurt',
      'Use in baking'
    ]
  },
  {
    name: 'Berries Mix',
    slug: 'berries-mix',
    description: 'Antioxidant-rich mix of premium dried berries.',
    icon: '🥗',
    parentCategory: 'mixes',
    healthBenefits: [
      'Rich in antioxidants',
      'Supports immune system',
      'Good for heart health',
      'Helps with inflammation'
    ],
    usageTips: [
      'Great in smoothies',
      'Perfect for baking',
      'Add to breakfast cereals',
      'Use in desserts'
    ]
  },
  {
    name: 'Champion Mix',
    slug: 'champion-mix',
    description: 'Premium mix designed for champions and athletes.',
    icon: '🥗',
    parentCategory: 'mixes',
    healthBenefits: [
      'High energy content',
      'Rich in protein',
      'Supports performance',
      'Good for recovery'
    ],
    usageTips: [
      'Perfect for athletes',
      'Great pre-workout',
      'Add to smoothies',
      'Use in energy bars'
    ]
  },
  {
    name: 'Nutty Trail Mix',
    slug: 'nutty-trail-mix',
    description: 'Classic trail mix perfect for hiking and outdoor activities.',
    icon: '🥗',
    parentCategory: 'mixes',
    healthBenefits: [
      'Sustained energy',
      'Good source of healthy fats',
      'Supports endurance',
      'Rich in protein'
    ],
    usageTips: [
      'Perfect for hiking',
      'Great for travel',
      'Add to breakfast bowls',
      'Use in snacks'
    ]
  },
  {
    name: 'Seeds Mix',
    slug: 'seeds-mix',
    description: 'Nutrient-dense mix of premium seeds.',
    icon: '🥗',
    parentCategory: 'mixes',
    healthBenefits: [
      'Rich in omega-3',
      'Good source of minerals',
      'Supports heart health',
      'Helps with inflammation'
    ],
    usageTips: [
      'Great in smoothies',
      'Perfect for baking',
      'Add to salads',
      'Sprinkle on yogurt'
    ]
  },

  // New Launches
  {
    name: 'Peanut Butter',
    slug: 'peanut-butter',
    description: 'Creamy and delicious natural peanut butter.',
    icon: '🆕',
    parentCategory: 'new-launches',
    healthBenefits: [
      'Rich in protein',
      'Good source of healthy fats',
      'Supports heart health',
      'Helps with satiety'
    ],
    usageTips: [
      'Great on toast',
      'Perfect for smoothies',
      'Use in baking',
      'Add to oatmeal'
    ]
  },
  {
    name: 'Party Snacks',
    slug: 'party-snacks',
    description: 'Fun and flavorful party snacks for all occasions.',
    icon: '🆕',
    parentCategory: 'new-launches',
    healthBenefits: [
      'Variety of nutrients',
      'Good source of energy',
      'Supports social bonding',
      'Mood enhancing'
    ],
    usageTips: [
      'Perfect for parties',
      'Great for movie nights',
      'Add to gift baskets',
      'Use in celebrations'
    ]
  },
  {
    name: 'GameFul Corn Nuts',
    slug: 'gameful-corn-nuts',
    description: 'Crunchy and addictive corn nuts perfect for gaming sessions.',
    icon: '🆕',
    parentCategory: 'new-launches',
    healthBenefits: [
      'Good source of fiber',
      'Provides sustained energy',
      'Supports focus',
      'Helps with concentration'
    ],
    usageTips: [
      'Perfect for gaming',
      'Great for studying',
      'Add to movie snacks',
      'Use in parties'
    ]
  }
];

const sampleProducts = [
  // Almonds
  {
    name: 'Premium California Almonds',
    slug: 'premium-california-almonds',
    description: 'Premium quality California almonds, rich in protein and healthy fats. Perfect for snacking or cooking.',
    categorySlug: 'almonds',
    images: [
      { url: '/src/Components/Homepages/dry.png', alt: 'Premium California Almonds', isPrimary: true },
      { url: '/src/Components/Homepages/dry.png', alt: 'Premium California Almonds - Side View' },
      { url: '/src/Components/Homepages/dry.png', alt: 'Premium California Almonds - Package View' }
    ],
    sizes: [
      { size: '250g', price: 299, originalPrice: 399, stock: 50 },
      { size: '500g', price: 549, originalPrice: 699, stock: 30 },
      { size: '1kg', price: 999, originalPrice: 1299, stock: 20 }
    ],
    rating: { average: 4.5, count: 128 },
    badges: [{ text: 'Best Seller', color: 'red' }],
    features: [
      'Rich in protein and healthy fats',
      'No artificial preservatives',
      'Premium quality sourcing',
      'Perfect for snacking and cooking'
    ],
    brand: 'Happilo',
    countryOfOrigin: 'USA',
    shelfLife: '12 months',
    isBestSeller: true,
    isFeatured: true,
    tags: ['premium', 'california', 'protein-rich']
  },
  {
    name: 'Organic Raw Almonds',
    slug: 'organic-raw-almonds',
    description: 'Certified organic raw almonds, perfect for health-conscious consumers.',
    categorySlug: 'almonds',
    images: [{ url: '/src/Components/Homepages/dry.png', alt: 'Organic Raw Almonds', isPrimary: true }],
    sizes: [{ size: '250g', price: 399, originalPrice: 499, stock: 25 }],
    rating: { average: 4.7, count: 89 },
    badges: [{ text: 'Organic', color: 'green' }],
    features: ['Certified organic', 'No pesticides', 'Raw and natural', 'Premium quality'],
    brand: 'Happilo',
    countryOfOrigin: 'USA',
    shelfLife: '12 months',
    isFeatured: true,
    tags: ['organic', 'raw', 'natural']
  },

  // Blueberries
  {
    name: 'Premium Dried Blueberries',
    slug: 'premium-dried-blueberries',
    description: 'Antioxidant-rich dried blueberries, perfect for health-conscious consumers.',
    categorySlug: 'blueberries',
    images: [{ url: '/src/Components/Homepages/dry.png', alt: 'Premium Dried Blueberries', isPrimary: true }],
    sizes: [{ size: '200g', price: 399, originalPrice: 499, stock: 45 }],
    rating: { average: 4.6, count: 89 },
    badges: [{ text: 'Antioxidant Rich', color: 'blue' }],
    features: ['Rich in antioxidants', 'Natural sweetness', 'No added sugar', 'Premium quality'],
    brand: 'Happilo',
    countryOfOrigin: 'USA',
    shelfLife: '18 months',
    isBestSeller: true,
    tags: ['antioxidants', 'blueberries', 'healthy']
  },

  // Cashews
  {
    name: 'Organic Cashew Nuts',
    slug: 'organic-cashew-nuts',
    description: 'Creamy and buttery organic cashew nuts, perfect for snacking.',
    categorySlug: 'cashews',
    images: [{ url: '/src/Components/Homepages/dry.png', alt: 'Organic Cashew Nuts', isPrimary: true }],
    sizes: [{ size: '500g', price: 449, originalPrice: 599, stock: 30 }],
    rating: { average: 4.3, count: 95 },
    badges: [{ text: 'Popular', color: 'blue' }],
    features: ['100% organic certified', 'Natural sweetness', 'Creamy texture', 'Rich in healthy fats'],
    brand: 'Happilo',
    countryOfOrigin: 'Vietnam',
    shelfLife: '10 months',
    isBestSeller: true,
    tags: ['organic', 'cashews', 'creamy']
  },

  // Pistachios
  {
    name: 'Premium Pistachio Nuts',
    slug: 'premium-pistachio-nuts',
    description: 'Premium quality pistachio nuts with natural green color and rich flavor.',
    categorySlug: 'pistachios',
    images: [{ url: '/src/Components/Homepages/dry.png', alt: 'Premium Pistachio Nuts', isPrimary: true }],
    sizes: [{ size: '250g', price: 499, originalPrice: 649, stock: 25 }],
    rating: { average: 4.7, count: 156 },
    badges: [{ text: 'Premium', color: 'green' }],
    features: ['Premium quality sourcing', 'Natural green color', 'Rich flavor profile', 'High nutritional value'],
    brand: 'Happilo',
    countryOfOrigin: 'Iran',
    shelfLife: '8 months',
    isBestSeller: true,
    tags: ['premium', 'pistachios', 'green']
  },

  // Mixed Nuts
  {
    name: 'Roasted Mixed Nuts',
    slug: 'roasted-mixed-nuts',
    description: 'Delicious mix of roasted nuts including almonds, cashews, and pistachios. Perfect value pack.',
    categorySlug: 'fitness-mix',
    images: [{ url: '/src/Components/Homepages/dry.png', alt: 'Roasted Mixed Nuts', isPrimary: true }],
    sizes: [{ size: '1kg', price: 799, originalPrice: 999, stock: 20 }],
    rating: { average: 4.4, count: 87 },
    badges: [{ text: 'Value Pack', color: 'purple' }],
    features: ['Mixed variety of premium nuts', 'Perfectly roasted', 'Great value for money', 'Ideal for sharing'],
    brand: 'Happilo',
    countryOfOrigin: 'Mixed',
    shelfLife: '6 months',
    isBestSeller: true,
    tags: ['mixed', 'roasted', 'value-pack']
  }
];

async function seedCategories() {
  try {
    console.log('🌱 Starting category seeding...');
    
    // Clear existing categories
    await Category.deleteMany({});
    console.log('✅ Cleared existing categories');
    
    // Insert categories
    const categories = await Category.insertMany(categoriesData);
    console.log(`✅ Inserted ${categories.length} categories`);
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('✅ Cleared existing products');
    
    // Get category IDs for products
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });
    
    // Update products with category IDs
    const productsWithCategoryIds = sampleProducts.map(product => ({
      ...product,
      category: categoryMap[product.categorySlug]
    }));
    
    // Insert products
    const products = await Product.insertMany(productsWithCategoryIds);
    console.log(`✅ Inserted ${products.length} sample products`);
    
    console.log('🎉 Category seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Categories: ${categories.length}`);
    console.log(`- Products: ${products.length}`);
    
    // Display categories by parent
    const parentCategories = ['nuts', 'dried-fruits', 'berries', 'dates', 'seeds', 'mixes', 'new-launches'];
    parentCategories.forEach(parent => {
      const count = categories.filter(cat => cat.parentCategory === parent).length;
      console.log(`- ${parent}: ${count} categories`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  require('dotenv').config();
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dryfruits')
    .then(() => {
      console.log('🔌 Connected to MongoDB');
      return seedCategories();
    })
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedCategories, categoriesData, sampleProducts };
