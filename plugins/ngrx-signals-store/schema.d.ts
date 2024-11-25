import { Tree } from '@nx/devkit';

export interface SignalsStoreGeneratorSchema {
  name: string;
  path?: string;
  angularService?: string;
  angularServiceMethod?: string;
  stateProperties?: string;
}

export interface StateProperty {
  name: string;
  type: string;
}

export interface NormalizedSchema extends SignalsStoreGeneratorSchema {
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

export function normalizeOptions(tree: Tree, options: SignalsStoreGeneratorSchema): NormalizedSchema;
export function addFiles(tree: Tree, options: NormalizedSchema): void;
export default function(tree: Tree, options: SignalsStoreGeneratorSchema): Promise<void>;