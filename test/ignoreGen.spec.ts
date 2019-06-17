import { expect } from 'chai';
import 'mocha';

import { New } from '../utils/testing';

describe('ignoreGen() function', function() {
  it("returns '' if type is invalid", function() {
    const obj = New();
    expect(obj.ignoreGen('invalid')).to.eq('');
  });

  it('returns ignore content for svelte projects', function() {
    const obj = New();
    expect(obj.ignoreGen('svelte')).to.eq('node_modules\npublic/bundle.*\n');
  });

  it('returns ignore content for sapper projects', function() {
    const obj = New();
    expect(obj.ignoreGen('sapper')).to.eq('__sapper__/dev\n__sapper__/export\ncypress\nnode_modules\nsrc\n');
  });
});
