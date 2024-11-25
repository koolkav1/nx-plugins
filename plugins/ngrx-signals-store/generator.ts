const {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} = require('@nx/devkit');
const path = require('path');

// Remove the type import and definition since they won't be available at runtime
// The schema types will be handled by TypeScript during development only

function parseStateProperties(stateProperties = '') {
  if (!stateProperties) return [];
  
  return stateProperties.split(',').map(prop => {
    const [name, type] = prop.trim().split(':');
    return { name, type };
  });
}

function normalizeOptions(tree: any, options: { name: any; path: string; angularService: any; angularServiceMethod: any; stateProperties: string | undefined; }) {
  const name = names(options.name).fileName;
  const projectDirectory = options.path ?? '';
  const projectName = name;
  const projectRoot = projectDirectory;
  const angularService = options.angularService;
  const angularServiceMethod = options.angularServiceMethod;
  const parsedPath = {
    name,
    path: projectRoot
  };
  const statePropertiesParsed = parseStateProperties(options.stateProperties);
  const fileName = `${name}.store.ts`;

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedPath,
    statePropertiesParsed,
    fileName,
    angularService,
    angularServiceMethod
  };
}

function addFiles(tree: { exists: (arg0: any) => any; rename: (arg0: any, arg1: any) => void; }, options: { name: any; projectRoot: any; parsedPath: { path: any; }; fileName: any; }) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };

  // Generate the store file with custom name
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.parsedPath.path,
    {
      ...templateOptions,
      tmpl: '', // Add this to support template file naming
    }
  );

  // Rename the generated file to match our desired pattern
  const generatedPath = path.join(options.parsedPath.path, 'index.ts');
  const targetPath = path.join(options.parsedPath.path, options.fileName);
  
  if (tree.exists(generatedPath)) {
    tree.rename(generatedPath, targetPath);
  }
}

async function generator(tree: any, options: any) {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}

// Export the generator as the default export
module.exports = generator;
module.exports.normalizeOptions = normalizeOptions;
module.exports.addFiles = addFiles;