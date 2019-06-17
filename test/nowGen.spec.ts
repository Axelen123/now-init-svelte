import { expect } from 'chai';
import 'mocha';

import { New } from '../utils/testing';

describe('nowGen() function', function() {
  it('returns nothing if type is invalid', function() {
    const obj = New();
    expect(obj.nowGen('invalid', 'mock')).to.be.undefined;
  });

  it('returns now.json content for svelte projects', function() {
    const obj = New();
    const result = obj.nowGen('svelte', 'mock');
    expect(result.version).to.eq(2);
    expect(result.name).to.eq('mock');
    expect(result.builds).to.be.an('array');
    expect(result.builds.length).to.eq(1);
    expect(result.builds[0].src).to.eq('package.json');
    expect(result.builds[0].use).to.eq('@now/static-build');
    expect(result.builds[0].config).to.have.property('distDir');
    expect(result.builds[0].config.distDir).to.eq('public');
  });

  it('returns now.json content for sapper projects', function() {
    const obj = New();
    const result = obj.nowGen('sapper', 'mock');
    expect(result.version).to.eq(2);
    expect(result.name).to.eq('mock');
    expect(result.builds).to.be.an('array');
    expect(result.builds.length).to.eq(1);
    expect(result.builds[0].src).to.eq('__sapper__/build/index.js');
    expect(result.builds[0].use).to.eq('now-sapper');
    expect(result.routes).to.be.an('array');
    expect(result.routes.length).to.eq(1);
    expect(result.routes[0].src).to.eq('/(.*)');
    expect(result.routes[0].dest).to.eq('__sapper__/build/index.js');
  });
});
