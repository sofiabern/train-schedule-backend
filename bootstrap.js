const path = require('path');
const fs = require('fs');
const fromRoot = path.join(__dirname, 'dist', 'main.js');
const fromSrc = path.join(__dirname, 'src', 'dist', 'main.js');
const mainPath = fs.existsSync(fromRoot) ? fromRoot : fromSrc;
require(mainPath);
