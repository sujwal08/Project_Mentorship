const fs = require('fs');
const pkg = require('./package.json');
pkg.scripts = {
    ...pkg.scripts,
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
};
fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
