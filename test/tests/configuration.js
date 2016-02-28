import test from 'tape';

import Pokewrap from '../../src';

test('configuration', (t) => {
  t.plan(3);

  const config = {
    baseUrl: 'http://foo.bar',
    defaultType: 'foobar',
    requests: { foo: 'bar' },
  };

  const p = new Pokewrap(config);

  t.equal(
    p.baseUrl,
    config.baseUrl,
    'Should use the supplied baseUrl',
  );

  t.equal(
    p.defaultType,
    config.defaultType,
    'Should use the supplied type',
  );

  t.deepEqual(
    p.requests,
    { redirect: 'follow', ...config.requests },
    'Should merge the supplied request options with the default config',
  );
});
