export default [
  {
    fn: 'getOneById',
    args: [1],
    path: `/pokemon/1`,
  },
  {
    fn: 'getOneById',
    args: ['bulbasaur'],
    path: `/pokemon/bulbasaur`,
  },
  {
    fn: 'getOneById',
    args: [1, { type: 'item' }],
    path: `/item/1`,
  },
  {
    fn: 'getOneById',
    args: [1, { type: 'item', id: 50 }],
    path: `/item/1`,
    msg: 'Argument `id` should take precedence over `opts.id`',
  },
  {
    fn: 'getOneById',
    args: [1, { type: 'item', id: 50, name: 'rare-candy' }],
    path: `/item/1`,
    msg: 'Argument `id` should take precedence over `opts.id` and `opts.name`',
  },
];
