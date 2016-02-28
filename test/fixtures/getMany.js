export default [
  {
    fn: 'getMany',
    args: ['pokemon'],
    paths: ['/pokemon'],
  },
  /*
  {
    fn: 'getMany',
    args: ['pokemon', { limit: 10 }],
    paths: ['/pokemon'],
  },
  {
    fn: 'getMany',
    args: ['pokemon', { offset: 20 }],
    paths: ['/pokemon'],
  },
  {
    fn: 'getMany',
    args: ['pokemon', { limit: 10, offset: 20 }],
    paths: ['/pokemon'],
  },
  */
  {
    fn: 'getMany',
    args: ['item', [1, 2, 3]],
    paths: ['/item/1', '/item/2', '/item/3'],
  },
  {
    fn: 'getMany',
    args: ['item', ['master-ball', 'rare-candy', 'moon-stone']],
    paths: ['/item/master-ball', '/item/rare-candy', '/item/moon-stone'],
  },
  {
    fn: 'getMany',
    args: [[1, 4, 7]],
    paths: ['/pokemon/1', '/pokemon/4', '/pokemon/7'],
  },
  {
    fn: 'getMany',
    args: [['bulbasaur', 'charmander', 'squirtle']],
    paths: ['/pokemon/bulbasaur', '/pokemon/charmander', '/pokemon/squirtle'],
  },
  {
    fn: 'getMany',
    args: [[1, 50, 81], { type: 'item' }],
    paths: ['/item/1', '/item/50', '/item/81'],
  },
  {
    fn: 'getMany',
    args: [['master-ball', 'rare-candy', 'moon-stone'], { type: 'item' }],
    paths: ['/item/master-ball', '/item/rare-candy', '/item/moon-stone'],
  },
  {
    fn: 'getMany',
    args: [[
      1,
      'bulbasaur',
      { id: 4 },
      { name: 'charmander' },
      { type: 'item', id: 50 },
      { type: 'item', name: 'rare-candy' },
    ]],
    paths: [
      '/pokemon/1',
      '/pokemon/bulbasaur',
      '/pokemon/4',
      '/pokemon/charmander',
      '/item/50',
      '/item/rare-candy',
    ],
  },
];
