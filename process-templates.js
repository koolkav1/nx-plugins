const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// Mocked data, replace with actual values from the generator's options
const generatorOptions = {
  className: 'ClassName',
  fileName: 'FileName',
  angularService: 'Service', 
  stateProperties: 'count:number',
  angularServiceMethod: 'getService',
  projectName: 'ProjectName',

};

// Convert the stateProperties string to an array of { name, type } objects
const parseStateProperties = (properties) => {
  return properties.split(',').map((prop) => {
    const [name, type] = prop.split(':');
    return { name: name.trim(), type: type.trim() };
  });
};

// Parsed state properties
const statePropertiesParsed = parseStateProperties(generatorOptions.stateProperties);

// Paths
const templatesDir = path.join(__dirname, 'plugins/ngrx-signals-store/files');
const outputDir = path.join(__dirname, 'dist/src/generated');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Process each template file
fs.readdirSync(templatesDir).forEach((file) => {
  const templatePath = path.join(templatesDir, file);
  const outputPath = path.join(outputDir, file.replace('__fileName__', generatorOptions.fileName));

  // Render the template with data
  const data = {
    className: generatorOptions.className,
    fileName: generatorOptions.fileName,
    angularService: generatorOptions.angularService,
    angularServiceMethod: generatorOptions.angularServiceMethod,
    statePropertiesParsed
  };

  // Only process files, not directories
  if (fs.lstatSync(templatePath).isFile()) {
    ejs.renderFile(templatePath, data, (err, result) => {
      if (err) {
        console.error(`Error processing template ${file}:`, err);
        return;
      }
      fs.writeFileSync(outputPath, result);
      console.log(`Processed ${file} -> ${outputPath}`);
    });
  }
});
