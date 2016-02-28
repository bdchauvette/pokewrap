import test from 'tape';

import resourceTypes from '../../src/lib/resource-types';
import { Id, NameOrId, ResourceType } from '../../src/lib/types';

const IDS = {
  valid: [1, Number.MAX_SAFE_INTEGER],
  invalid: [0, -1, 1.1, -1.1, Number.MIN_SAFE_INTEGER],
};

const NAMES = {
  valid: ['bulbasaur', 'charmander', 'squirtle'],
  invalid: [/gary/, {}, [], () => false],
};

test('Id', (t) => {
  for (const value of IDS.valid) {
    t.ok(
      Id.is(value),
      `Should accept ${value} as a valid ID`,
    );
  }

  for (const value of IDS.invalid) {
    t.notOk(
      Id.is(value),
      `Should reject ${value} as a valid ID`,
    );
  }

  t.end();
});

test('NameOrId', (t) => {
  const values = {
    valid: [...IDS.valid, ...NAMES.valid],
    invalid: [...IDS.invalid, ...NAMES.invalid],
  };

  for (const value of values.valid) {
    t.ok(
      NameOrId.is(value),
      `Should accept ${value} as a valid NameOrId`,
    );
  }

  for (const value of values.invalid) {
    t.notOk(
      NameOrId.is(value),
      `Should reject ${value.toString()} as a valid NameOrId`,
    );
  }

  t.end();
});

test('ResourceTypes', (t) => {
  const values = {
    valid: resourceTypes,
    invalid: [5, 'Gary Oak', 'team-rocket'],
  };

  for (const value of values.valid) {
    t.ok(
      ResourceType.is(value),
      `Should accept ${value} as a valid ResourceType`,
    );
  }

  for (const value of values.invalid) {
    t.notOk(
      ResourceType.is(value),
      `Should reject ${value.toString()} as a valid ResourceType`,
    );
  }

  t.end();
});
