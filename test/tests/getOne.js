import test from 'tape';
import fetchMock from 'fetch-mock';

import Pokewrap from '../../src';
import printFn from '../helpers/print-fn';
import { singleFixtures as fixtures } from '../fixtures';

const baseUrl = 'http://fake.api';
const defaultType = 'pokemon';

/**
 * Each fixture is an object with a function name, an array of arguments, and
 * an expected path. This allows us to test whether each function calls to the
 * expected URL when passed the given arguments.
 */
fixtures.forEach((fixture) => {
  const {
    fn,
    path,
    args,
    msg = `Should fetch resource from ${path}/`,
  } = fixture;

  test(`${printFn(fn, args)}`, async (t) => {
    t.plan(1);

    const pokewrap = new Pokewrap({ baseUrl, defaultType });

    const resource = `${baseUrl}${path}/`;
    fetchMock.mock(resource, { found: true });

    try {
      const res = await pokewrap[fn](...args);
      t.ok(res.found, msg);
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
    path,
    args,
    msg = `Should fetch resource from ${path}/`,
  } = fixture;

  test(`${printFn(fn, args, true)}`, (t) => {
    t.plan(1);

    const pokewrap = new Pokewrap({ baseUrl, defaultType });
    const callback = (err, res) => {
      if (err) {
        t.fail(err);
      }

      t.ok(res.found, msg);
    };

    const resource = `${baseUrl}${path}/`;
    fetchMock.mock(resource, { found: true });
    pokewrap[fn](...args, callback);
  });
});
