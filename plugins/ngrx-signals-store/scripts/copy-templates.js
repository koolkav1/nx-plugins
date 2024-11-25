const fs = require('fs');
const path = require('path');

// Adjust paths to your actual project structure
const sourceDir = path.join(__dirname, '../files');
const destDir = path.join(__dirname, '../../../dist/plugins/ngrx-signals-store/files');

// Create the destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

try {
  // Copy all files from source to destination
  const files = fs.readdirSync(sourceDir);
  
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    
    // Log the paths for debugging
    console.log('Copying from:', sourcePath);
    console.log('Copying to:', destPath);
    
    fs.copyFileSync(sourcePath, destPath);
  });

  console.log('Template files copied successfully!');
} catch (error) {
  console.error('Error copying files:', error);
  console.log('Current directory:', __dirname);
  console.log('Source directory:', sourceDir);
  console.log('Destination directory:', destDir);
  process.exit(1);
}