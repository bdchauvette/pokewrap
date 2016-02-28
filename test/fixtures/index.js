import getOneFixtures from './getOne';
import getOneByIdFixtures from './getOneById';
import getManyFixtures from './getMany';

const getOneByIDFixtures = getOneByIdFixtures
  .map((fixture) => ({ ...fixture, fn: 'getOneByID' }));

const getOneByNameFixtures = getOneByIdFixtures
  .map((fixture) => ({ ...fixture, fn: 'getOneByName' }));

export const singleFixtures = [
  ...getOneFixtures,
  ...getOneByIdFixtures,
  ...getOneByIDFixtures,
  ...getOneByNameFixtures,
];

export const manyFixtures = [
  ...getManyFixtures,
];
