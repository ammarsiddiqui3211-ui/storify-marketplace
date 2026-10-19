const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const outputDir = path.join(rootDir, 'www');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Files & Subdirectories to include in www bundle
const filesToCopy = [
  'index.html',
  'seller.html',
  'admin.html',
  'diagnostics.html',
  'manifest.json',
  'sw.js',
  'mobile-app.js',
  'privacy.html',
  'sitemap.xml',
  '.htaccess'
];

const dirsToCopy = [
  'images',
  'supabase'
];

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(source)) return;
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  files.forEach((file) => {
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursiveSync(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  });
}

console.log('[Build] Packaging web assets into www/ ...');

// Copy static files
filesToCopy.forEach((file) => {
  const src = path.join(rootDir, file);
  const dist = path.join(outputDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dist);
    console.log(` -> Copied ${file}`);
  }
});

// Copy directories
dirsToCopy.forEach((dir) => {
  const src = path.join(rootDir, dir);
  const dist = path.join(outputDir, dir);
  if (fs.existsSync(src)) {
    copyFolderRecursiveSync(src, dist);
    console.log(` -> Copied directory ${dir}/`);
  }
});

console.log('[Build] Web bundle complete at www/\n');
