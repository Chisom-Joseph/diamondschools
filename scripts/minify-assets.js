/**
 * Asset Minification Script
 * Minifies CSS and JS files for production
 * 
 * Usage: node scripts/minify-assets.js
 */

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const PUBLIC_DIR = path.join(__dirname, '../public/assets');

// Simple CSS minifier
function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/;\s*}/g, '}') // Remove last semicolon in block
    .replace(/{\s+/g, '{') // Remove space after {
    .replace(/;\s+/g, ';') // Remove space after semicolon
    .replace(/,\s+/g, ',') // Remove space after comma
    .replace(/:\s+/g, ':') // Remove space after colon
    .trim();
}

async function minifyJS(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    const result = await minify(code, {
      compress: {
        drop_console: true,
        drop_debugger: true,
        dead_code: true,
      },
      mangle: true,
    });
    return result.code;
  } catch (error) {
    console.error(`Error minifying ${filePath}: ${error.message}`);
    return null;
  }
}

async function processDirectory(dirPath, extension, minifier) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules')) {
      await processDirectory(filePath, extension, minifier);
    } else if (file.endsWith(extension) && !file.endsWith(`.min${extension}`)) {
      const originalSize = fs.statSync(filePath).size;
      
      try {
        let minified;
        if (extension === '.css') {
          const content = fs.readFileSync(filePath, 'utf8');
          minified = minifyCSS(content);
        } else if (extension === '.js') {
          minified = await minifyJS(filePath);
        }
        
        if (minified) {
          const outputPath = filePath.replace(extension, `.min${extension}`);
          fs.writeFileSync(outputPath, minified, 'utf8');
          
          const newSize = fs.statSync(outputPath).size;
          const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
          
          console.log(`✓ ${path.relative(PUBLIC_DIR, filePath)}: ${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB (${savings}% saved)`);
        }
      } catch (error) {
        console.error(`✗ Error processing ${filePath}: ${error.message}`);
      }
    }
  }
}

async function main() {
  console.log('🔧 Asset Minification Script');
  console.log('='.repeat(50));
  
  // Check if terser is installed
  try {
    require.resolve('terser');
  } catch {
    console.log('Installing terser...');
    const { execSync } = require('child_process');
    execSync('npm install terser --save-dev', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
  }
  
  console.log('\n📁 Processing CSS files...');
  console.log('-'.repeat(50));
  await processDirectory(PUBLIC_DIR, '.css', minifyCSS);
  
  console.log('\n📁 Processing JS files...');
  console.log('-'.repeat(50));
  await processDirectory(PUBLIC_DIR, '.js', minifyJS);
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ Minification complete!');
  console.log('\n💡 To use minified files, update your HTML to use:');
  console.log('   - style.min.css instead of style.css');
  console.log('   - main.min.js instead of main.js');
}

main().catch(console.error);
