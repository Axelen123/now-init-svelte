import { expect } from 'chai';
import 'mocha';

import { New } from '../utils/testing';
import tmp from 'tmp';
import fs from 'fs-extra';

describe('opts getter', function() {
  it('returns 4 when there is no package.json', function() {
    const root = process.cwd();
    const dir = tmp.dirSync();
    process.chdir(dir.name);
    const obj = New();
    expect(obj.opts.spaces).to.eq(4);
    dir.removeCallback();
    process.chdir(root);
  });

  it('returns space count (1)', function() {
    const root = process.cwd();
    const dir = tmp.dirSync();
    process.chdir(dir.name);
    fs.writeJsonSync('./package.json', { version: '1.0.0', name: 'mock' }, { spaces: 2 });
    const obj = New();
    expect(obj.opts.spaces).to.eq(2);
    dir.removeCallback();
    process.chdir(root);
  });

  it('returns space count (2)', function() {
    const root = process.cwd();
    const dir = tmp.dirSync();
    process.chdir(dir.name);
    fs.writeJsonSync('./package.json', { version: '1.0.0', name: 'mock' }, { spaces: 4 });
    const obj = New();
    expect(obj.opts.spaces).to.eq(4);
    dir.removeCallback();
    process.chdir(root);
  });

  it('returns "\\t"', function() {
    const root = process.cwd();
    const dir = tmp.dirSync();
    process.chdir(dir.name);
    fs.writeJsonSync('./package.json', { version: '1.0.0', name: 'mock' }, { spaces: '\t' });
    const obj = New();
    expect(obj.opts.spaces).to.eq('\t');
    dir.removeCallback();
    process.chdir(root);
  });
});
