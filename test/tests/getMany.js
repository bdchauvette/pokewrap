import test from 'tape';
import fetchMock from 'fetch-mock';
import UriTemplate from 'uri-templates';

import Pokewrap from '../../src';
import printFn from '../helpers/print-fn';
import { manyFixtures as fixtures } from '../fixtures';

const baseUrl = 'http://fake.api';
const defaultType = 'pokemon';
const mockTemplate = new UriTemplate('{+baseUrl}{+path}/');
const mockTemplateWithQueryParams = new UriTemplate('{+baseUrl}{+path}');

/**
 * Each fixture is an object with a function name, an array of arguments, and
 * an expected path. This allows us to test whether each function calls to the
 * expected URL when passed the given arguments.
 */
fixtures.forEach((fixture) => {
  const {
    fn,
    paths,
    args,
    hasQueryParams,
    msg = 'Should fetch all requested resources',
  } = fixture;

  test(`${printFn(fn, args)}`, async (t) => {
    t.plan(1);

    const pokewrap = new Pokewrap({ baseUrl, defaultType });

    paths.forEach((path) => {
      const resource = (hasQueryParams)
        ? mockTemplateWithQueryParams.fillFromObject({ baseUrl, path })
        : mockTemplate.fillFromObject({ baseUrl, path });

      fetchMock.mock(resource, { found: true });
    });

    try {
      const res = await pokewrap[fn](...args);
      t.ok(res, msg);
    } catch (err) {
      t.fail(err);
    }
  });
});

/**
 * Try the same tests, only using callbacks instead of promises
 */
fixtures.forEach((fixture) => {
  const {
    fn,
    paths,
    args,
    msg = 'Should fetch all requested resrouces',
  } = fixture;

  test(`${printFn(fn, args, true)}`, (t) => {
    t.plan(1);

    const pokewrap = new Pokewrap({ baseUrl, defaultType });
    const [, params] = args;
    const callback = (err, res) => {
      if (err) {
        t.fail(err);
      }

      t.ok(res, msg);
    };

    paths.forEach((path) => {
      const matcher = mockTemplate.fillFromObject({ baseUrl, path, params });
      const routes = {
        response: { found: true },
        matcher,
      };

      console.log(routes);

      fetchMock.mock({ routes, greed: 'bad' });
    });

    pokewrap[fn](...args, callback);
  });
});

