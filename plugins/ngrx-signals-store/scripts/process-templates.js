import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function processTemplates() {
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
  for (const file of fs.readdirSync(templatesDir)) {
    const templatePath = path.join(templatesDir, file);
    const outputFileName = file.replace('__fileName__', data.fileName);
    const outputPath = path.join(outputDir, outputFileName);

    if (fs.lstatSync(templatePath).isFile()) {
      const template = fs.readFileSync(templatePath, 'utf-8');
      try {
        const result = await ejs.render(template, data, { async: true });
        fs.writeFileSync(outputPath, result);
        console.log(`Processed ${file} -> ${outputPath}`);
      } catch (err) {
        console.error(`Error processing template ${file}:`, err);
        process.exit(1);
      }
    }
  }

  console.log('Template processing complete!');
}

processTemplates().catch(err => {
  console.error('Error processing templates:', err);
  process.exit(1);
});