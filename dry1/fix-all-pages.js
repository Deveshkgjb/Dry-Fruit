#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of all category page files to update
const categoryPages = [
  // Seeds
  'src/Components/Pages/Seeds/FlaxSeeds.jsx',
  'src/Components/Pages/Seeds/PumpkinSeeds.jsx', 
  'src/Components/Pages/Seeds/SunflowerSeeds.jsx',
  
  // Berries
  'src/Components/Pages/Berries/Blueberries.jsx',
  'src/Components/Pages/Berries/Cranberries.jsx',
  'src/Components/Pages/Berries/Strawberries.jsx',
  
  // Dates
  'src/Components/Pages/Dates/Ajwa.jsx',
  'src/Components/Pages/Dates/Arabian.jsx',
  'src/Components/Pages/Dates/Omani.jsx',
  'src/Components/Pages/Dates/QueenKalmi.jsx',
  
  // Nuts
  'src/Components/Pages/Nuts/Almonds.jsx',
  'src/Components/Pages/Nuts/BrazilNuts.jsx',
  'src/Components/Pages/Nuts/Cashews.jsx',
  'src/Components/Pages/Nuts/Peanuts.jsx',
  'src/Components/Pages/Nuts/Pistachios.jsx',
  'src/Components/Pages/Nuts/Walnuts.jsx',
  
  // Dried Fruits
  'src/Components/Pages/DriedFruits/Anjeer.jsx',
  'src/Components/Pages/DriedFruits/Apricots.jsx',
  'src/Components/Pages/DriedFruits/Kiwi.jsx',
  'src/Components/Pages/DriedFruits/Mango.jsx',
  'src/Components/Pages/DriedFruits/Prunes.jsx',
  'src/Components/Pages/DriedFruits/Raisins.jsx'
];

const baseDir = '/Users/deveshfuloria/Dry-fruits/dry1';

// Function to update a single page
function updatePage(filePath) {
  const fullPath = path.join(baseDir, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let updated = false;
  
  // 1. Add utility imports
  if (!content.includes('renderRatingDisplay')) {
    const importMatch = content.match(/import {[^}]+} from '\.\.\/\.\.\/\.\.\/utils\/productUtils\.jsx';/);
    if (importMatch) {
      const newImport = importMatch[0].replace(/renderStars[^}]*/, 'renderStars,\n  renderRatingDisplay');
      content = content.replace(importMatch[0], newImport);
      updated = true;
    }
  }
  
  // 2. Replace rating display
  const ratingPattern = /{\/\* Rating \*\/}[\s\S]*?{renderStars\([^}]+\)}[\s\S]*?<\/div>[\s\S]*?<\/div>/;
  const ratingMatch = content.match(ratingPattern);
  
  if (ratingMatch) {
    const newRating = `{/* Rating */}
                        {renderRatingDisplay(product)}`;
    content = content.replace(ratingMatch[0], newRating);
    updated = true;
  }
  
  // 3. Update product data structure
  content = content.replace(/product\.image/g, 'getProductImageUrl(product)');
  content = content.replace(/product\.id/g, 'product._id');
  
  if (updated) {
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Updated: ${filePath}`);
    return true;
  } else {
    console.log(`⏭️  No changes needed: ${filePath}`);
    return false;
  }
}

// Update all pages
console.log('🚀 Starting to update all category pages...\n');

let updatedCount = 0;
categoryPages.forEach(page => {
  if (updatePage(page)) {
    updatedCount++;
  }
});

console.log(`\n🎉 Updated ${updatedCount} out of ${categoryPages.length} pages!`);
