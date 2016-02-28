export default [
  {
    fn: 'getOne',
    args: ['pokemon', 1],
    path: `/pokemon/1`,
  },
  {
    fn: 'getOne',
    args: ['pokemon', 'bulbasaur'],
    path: `/pokemon/bulbasaur`,
  },
  {
    fn: 'getOne',
    args: ['item', 50, { type: 'pokemon' }],
    path: `/item/50`,
    msg: 'Argument `type` should take precedence over `opts.type`',
  },
  {
    fn: 'getOne',
    args: ['item', 50, { type: 'pokemon', id: 1 }],
    path: `/item/50`,
    msg: 'Argument `type` & `id` should take precedence over values in `opts`',
  },
  {
    fn: 'getOne',
    args: ['item', 50, { type: 'pokemon', id: 1, name: 'bulbasaur' }],
    path: `/item/50`,
    msg: 'Argument `type` & `id` should take precedence over values in `opts`',
  },
  {
    fn: 'getOne',
    args: ['item', 'rare-candy', { type: 'pokemon' }],
    path: `/item/rare-candy`,
    msg: 'Argument `type` should take precedence over `opts.type`',
  },
  {
    fn: 'getOne',
    args: ['item', 'rare-candy', { type: 'pokemon', id: 1 }],
    path: `/item/rare-candy`,
    msg: 'Argument `type` & `id` should take precedence over values in `opts`',
  },
  {
    fn: 'getOne',
    args: ['item', 'rare-candy', { type: 'pokemon', id: 1, name: 'bulbasaur' }],
    path: `/item/rare-candy`,
    msg: 'Argument `type` & `id` should take precedence over values in `opts`',
  },
];
