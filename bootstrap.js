const path = require('path');
const fs = require('fs');
const root = __dirname.endsWith(path.sep + 'src') ? path.join(__dirname, '..') : __dirname;
const candidates = [
  path.join(root, 'dist', 'main.js'),
  path.join(root, 'dist', 'src', 'main.js'),
];
const mainPath = candidates.find((p) => fs.existsSync(p));
if (!mainPath) throw new Error('Not found: dist/main.js or dist/src/main.js under ' + root);
require(mainPath);
