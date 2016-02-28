/**
import test from 'tape';
import inspect from 'object-inspect';

import Pokewrap from '../../src';
const createUrl = Pokewrap.__get__('createUrl');

test('createUrl / no trailing slash', (t) => {
  const baseUrl = 'http://foo.bar';

  const testCases = [
    {
      params: { id: 1 },
      expectedUrl: `${baseUrl}/pokemon/1/`,
    },
    {
      params: { name: 'bulbasaur' },
      expectedUrl: `${baseUrl}/pokemon/bulbasaur/`,
    },
    {
      params: { id: 1, name: 'bulbasaur' },
      expectedUrl: `${baseUrl}/pokemon/1/`,
    },
    {
      params: { type: 'foo', name: 'bar' },
      expectedUrl: `${baseUrl}/foo/bar/`,
    },
  ];

  for (const testCase of testCases) {
    const { params, expectedUrl } = testCase;

    t.equal(
      createUrl(params),
      expectedUrl,
      `Should create '${expectedUrl}' from ${inspect(params)}`,
    );
  }

  t.end();
});

test('createUrl / trailing slash', (t) => {
  const baseUrl = 'http://foo.bar/';

  const testCases = [
    {
      params: { id: 1 },
      expectedUrl: `${baseUrl}pokemon/1/`,
    },
    {
      params: { name: 'bulbasaur' },
      expectedUrl: `${baseUrl}pokemon/bulbasaur/`,
    },
    {
      params: { id: 1, name: 'bulbasaur' },
      expectedUrl: `${baseUrl}pokemon/1/`,
    },
    {
      params: { type: 'foo', name: 'bar' },
      expectedUrl: `${baseUrl}foo/bar/`,
    },
  ];

  for (const testCase of testCases) {
    const { params, expectedUrl } = testCase;

    t.equal(
      createUrl(params),
      expectedUrl,
      `Should create '${expectedUrl}' from ${inspect(params)}`,
    );
  }

  t.end();
});
*/
