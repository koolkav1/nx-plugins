import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import * as  signalsStoreGenerator from './generator';
import { SignalsStoreGeneratorSchema } from './schema';

describe('signals-store generator', () => {
  let tree: Tree;
  const options: SignalsStoreGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await signalsStoreGenerator.default(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
