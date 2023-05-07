const fs = require('fs');
const path = require('path');

const fullPath = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(fullPath, 'utf8');

stream.on('data', (chunk) => {
  console.log(chunk);
});
