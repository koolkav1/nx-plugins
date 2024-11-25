// plugins/ngrx-signals-store/scripts/process-templates.js
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// Get the absolute path to the project root
const projectRoot = path.resolve(__dirname, '../../../');

// Paths relative to project root
const templatesDir = path.join(projectRoot, 'plugins/ngrx-signals-store/files');
const outputDir = path.join(projectRoot, 'dist/plugins/ngrx-signals-store/files');

// Sample data for template processing
const data = {
  className: 'Sample',
  fileName: 'sample',
  angularService: 'SampleService',
  angularServiceMethod: 'getSamples',
  statePropertiesParsed: [
    { name: 'id', type: 'string' },
    { name: 'name', type: 'string' }
  ]
};

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Process each template file
fs.readdirSync(templatesDir).forEach((file) => {
  const templatePath = path.join(templatesDir, file);
  const outputFileName = file.replace('__fileName__', data.fileName);
  const outputPath = path.join(outputDir, outputFileName);

  if (fs.lstatSync(templatePath).isFile()) {
    const template = fs.readFileSync(templatePath, 'utf-8');
    try {
      const result = ejs.render(template, data);
      fs.writeFileSync(outputPath, result);
      console.log(`Processed ${file} -> ${outputPath}`);
    } catch (err) {
      console.error(`Error processing template ${file}:`, err);
      process.exit(1);
    }
  }
});

console.log('Template processing complete!');