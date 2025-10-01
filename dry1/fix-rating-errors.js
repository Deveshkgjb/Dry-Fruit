#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files that need fixing (excluding the ones we already fixed)
const filesToFix = [
  'src/Components/Pages/Seeds/SunflowerSeeds.jsx',
  'src/Components/Pages/Seeds/PumpkinSeeds.jsx',
  'src/Components/Pages/Seeds/FlaxSeeds.jsx',
  'src/Components/Pages/Dates/QueenKalmi.jsx',
  'src/Components/Pages/Dates/Arabian.jsx',
  'src/Components/Pages/DriedFruits/Prunes.jsx',
  'src/Components/Pages/DriedFruits/Mango.jsx',
  'src/Components/Pages/DriedFruits/Kiwi.jsx',
  'src/Components/Pages/DriedFruits/Anjeer.jsx',
  'src/Components/Pages/DriedFruits/Apricots.jsx',
  'src/Components/Pages/DriedFruits/Raisins.jsx',
  'src/Components/Pages/Nuts/BrazilNuts.jsx',
  'src/Components/Pages/Nuts/Pistachios.jsx',
  'src/Components/Pages/Nuts/Walnuts.jsx',
  'src/Components/Pages/Nuts/Cashews.jsx',
  'src/Components/Pages/Nuts/Peanuts.jsx'
];

function fixRatingErrors(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ File not found: ${filePath}`);
      return false;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    
    // Fix 1: Replace direct product.rating usage in renderStars call
    const renderStarsRegex = /renderStars\(product\.rating\)/g;
    if (renderStarsRegex.test(content)) {
      content = content.replace(renderStarsRegex, 'renderStars(product.rating.average || product.rating)');
      modified = true;
      console.log(`✅ Fixed renderStars call in ${filePath}`);
    }
    
    // Fix 2: Replace direct product.rating usage in span
    const ratingSpanRegex = /\{product\.rating\} \| \{product\.reviews\} Rating\{product\.reviews !== 1 \? 's' : ''\}/g;
    if (ratingSpanRegex.test(content)) {
      content = content.replace(ratingSpanRegex, 
        '{product.rating.average || product.rating} | {product.rating.count || product.reviews || 0} Rating{(product.rating.count || product.reviews || 0) !== 1 ? \'s\' : \'\'}'
      );
      modified = true;
      console.log(`✅ Fixed rating span in ${filePath}`);
    }
    
    // Fix 3: Update renderStars function to handle objects
    const renderStarsFunctionRegex = /const renderStars = \(rating\) => \{[\s\S]*?\};/g;
    if (renderStarsFunctionRegex.test(content)) {
      content = content.replace(renderStarsFunctionRegex, 
        `const renderStars = (rating) => {
    if (!rating) return null;
    const ratingValue = typeof rating === 'object' ? rating.average : rating;
    if (!ratingValue) return null;
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={\`text-yellow-400 \${index < Math.floor(ratingValue) ? 'text-yellow-400' : 'text-gray-300'}\`}
      >
        ★
      </span>
    ));
  };`
      );
      modified = true;
      console.log(`✅ Fixed renderStars function in ${filePath}`);
    }
    
    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`🎉 Successfully fixed ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️ No changes needed in ${filePath}`);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

console.log('🔧 Starting rating error fixes...\n');

let fixedCount = 0;
filesToFix.forEach(file => {
  if (fixRatingErrors(file)) {
    fixedCount++;
  }
  console.log(''); // Empty line for readability
});

console.log(`\n🎉 Fix complete! Fixed ${fixedCount} out of ${filesToFix.length} files.`);
console.log('\n📝 Summary of fixes:');
console.log('1. ✅ Fixed renderStars() calls to handle object ratings');
console.log('2. ✅ Fixed rating display spans to show average and count');
console.log('3. ✅ Updated renderStars functions to handle both object and number ratings');
console.log('\n🚀 All rating object errors should now be resolved!');
