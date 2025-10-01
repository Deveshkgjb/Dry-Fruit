const fs = require('fs');
const content = fs.readFileSync('/Users/deveshfuloria/Dry-fruits/dry1/src/Components/Admin/Analytics.jsx', 'utf8');
const lines = content.split('\n');
lines.splice(321, 0, '      </div>');
fs.writeFileSync('/Users/deveshfuloria/Dry-fruits/dry1/src/Components/Admin/Analytics.jsx', lines.join('\n'));
console.log('Fixed Analytics.jsx');
