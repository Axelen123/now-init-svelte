import { expect } from 'chai';
import 'mocha';

import { New } from '../utils/testing';

describe('addScript() function', function() {
  it('adds scripts to object', function() {
    const obj = New();
    const pkg = { name: 'mock', version: '1.0.0' };
    expect(obj.addScript(pkg)).to.have.property('scripts');
  });

  it('adds "now-build": "rollup -c" to pkg.scripts', function() {
    const obj = New();
    const pkg = { name: 'mock', version: '1.0.0' };
    const result = obj.addScript(pkg);
    expect(result).to.have.property('scripts');
    expect(result.scripts).to.have.property('now-build');
    expect(result.scripts['now-build']).to.eq('rollup -c');
  });
});
