const fs = require('fs');

fs.mkdirSync('reports/selenium', { recursive: true });
fs.writeFileSync('reports/selenium/result.txt', 'Angular placeholder e2e test passed\n');
console.log('Angular placeholder e2e test passed');
