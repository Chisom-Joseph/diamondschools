/**
 * Image Optimization Script
 * Compresses and converts images to WebP format for better performance
 * 
 * Usage: node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../public/assets/img');

// Configuration for different image types
const config = {
  slider: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 80,
    webpQuality: 75
  },
  gallery: {
    maxWidth: 1200,
    maxHeight: 800,
    quality: 80,
    webpQuality: 75
  },
  thumbnail: {
    maxWidth: 400,
    maxHeight: 400,
    quality: 75,
    webpQuality: 70
  },
  general: {
    maxWidth: 1200,
    maxHeight: 900,
    quality: 80,
    webpQuality: 75
  }
};

// Directories to process and their config type
const directories = [
  { path: 'slider', config: 'slider' },
  { path: 'gallery', config: 'gallery' },
  { path: 'course', config: 'gallery' },
  { path: 'event', config: 'gallery' },
  { path: 'testimonial', config: 'thumbnail' },
  { path: 'team', config: 'thumbnail' },
  { path: 'choose', config: 'general' },
  { path: 'about', config: 'general' },
  { path: 'counter', config: 'general' },
  { path: 'cta', config: 'general' },
  { path: 'enroll', config: 'general' }
];

async function optimizeImage(filePath, outputDir, imageConfig) {
  const fileName = path.parse(filePath).name;
  const ext = path.parse(filePath).ext.toLowerCase();
  
  // Create optimized subdirectory for compressed images
  const optimizedDir = path.join(outputDir, 'optimized');
  if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
  }
  
  const outputWebP = path.join(optimizedDir, `${fileName}.webp`);
  const outputJpg = path.join(optimizedDir, `${fileName}.jpg`);
  
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Resize if needed
    let resizeOptions = {};
    if (metadata.width > imageConfig.maxWidth || metadata.height > imageConfig.maxHeight) {
      resizeOptions = {
        width: imageConfig.maxWidth,
        height: imageConfig.maxHeight,
        fit: 'inside',
        withoutEnlargement: true
      };
    }
    
    // Generate WebP version
    await image
      .clone()
      .resize(resizeOptions)
      .webp({ quality: imageConfig.webpQuality, effort: 6 })
      .toFile(outputWebP);
    
    // Generate optimized JPEG version
    await image
      .clone()
      .resize(resizeOptions)
      .jpeg({ quality: imageConfig.quality, mozjpeg: true })
      .toFile(outputJpg);
    
    const originalSize = fs.statSync(filePath).size;
    const webpSize = fs.statSync(outputWebP).size;
    const jpgSize = fs.statSync(outputJpg).size;
    const newSize = Math.min(webpSize, jpgSize);
    
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
    console.log(`✓ ${path.basename(filePath)}: ${(originalSize / 1024).toFixed(1)}KB → WebP:${(webpSize / 1024).toFixed(1)}KB, JPG:${(jpgSize / 1024).toFixed(1)}KB (${savings}% savings)`);
    
    return { originalSize, newSize, savings };
  } catch (error) {
    console.error(`✗ Error processing ${filePath}: ${error.message}`);
    return null;
  }
}

async function processDirectory(dirPath, imageConfig) {
  const fullDirPath = path.join(ASSETS_DIR, dirPath);
  
  if (!fs.existsSync(fullDirPath)) {
    console.log(`Skipping ${dirPath} - directory not found`);
    return;
  }
  
  const files = fs.readdirSync(fullDirPath);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png)$/i.test(file) && !file.includes('.webp')
  );
  
  console.log(`\n📁 Processing ${dirPath} (${imageFiles.length} images)`);
  console.log('-'.repeat(50));
  
  let totalOriginal = 0;
  let totalOptimized = 0;
  
  for (const file of imageFiles) {
    const filePath = path.join(fullDirPath, file);
    const result = await optimizeImage(filePath, fullDirPath, imageConfig);
    
    if (result) {
      totalOriginal += result.originalSize;
      totalOptimized += result.newSize;
    }
  }
  
  if (totalOriginal > 0) {
    const totalSavings = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);
    console.log(`\n📊 ${dirPath} Total: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB → ${(totalOptimized / 1024 / 1024).toFixed(2)}MB (${totalSavings}% saved)`);
  }
}

async function main() {
  console.log('🖼️  Image Optimization Script');
  console.log('='.repeat(50));
  console.log(`Processing images in: ${ASSETS_DIR}`);
  
  let grandTotalOriginal = 0;
  let grandTotalOptimized = 0;
  
  for (const dir of directories) {
    const imageConfig = config[dir.config];
    const fullDirPath = path.join(ASSETS_DIR, dir.path);
    
    if (fs.existsSync(fullDirPath)) {
      const beforeSize = getDirectorySize(fullDirPath);
      grandTotalOriginal += beforeSize;
    }
  }
  
  // Process each directory
  for (const dir of directories) {
    await processDirectory(dir.path, config[dir.config]);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ Image optimization complete!');
  console.log('\n💡 Tips:');
  console.log('   - WebP images are generated alongside original images');
  console.log('   - Update your HTML to use .webp files with <picture> element');
  console.log('   - Consider using <source srcset="image.webp" type="image/webp"> for fallback');
}

function getDirectorySize(dirPath) {
  let size = 0;
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += stats.size;
    }
  }
  
  return size;
}

// Run the script
main().catch(console.error);
