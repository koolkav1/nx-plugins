export interface SignalsStoreGeneratorSchema {
  name: string;
  project: string;
  path: string;
  angularService: string;
  angularServiceMethod: string;
  prefix?: string;
  skipTests?: boolean;
  stateProperties?: string;
}