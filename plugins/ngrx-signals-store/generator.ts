import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { SignalsStoreGeneratorSchema } from './schema';

interface StateProperty {
  name: string;
  type: string;
}

interface NormalizedSchema extends SignalsStoreGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedPath: {
    name: string;
    path: string;
  };
  angularService: string;
  angularServiceMethod: string;
  statePropertiesParsed: StateProperty[];
  fileName: string;
}

function parseStateProperties(stateProperties = ''): StateProperty[] {
  if (!stateProperties) return [];
  
  return stateProperties.split(',').map(prop => {
    const [name, type] = prop.trim().split(':');
    return { name, type };
  });
}

function normalizeOptions(tree: Tree, options: SignalsStoreGeneratorSchema): NormalizedSchema {
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

function addFiles(tree: Tree, options: NormalizedSchema) {
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

export default async function (tree: Tree, options: SignalsStoreGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}