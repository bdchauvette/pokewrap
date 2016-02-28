const Pokewrap = require('pokewrap').default;
const pokewrap = new Pokewrap();

pokewrap.getOneById('magikarp')
  .then(printMoves)
  .catch((err) => console.error(err));

function printMoves(pokemon) {
  const moves = pokemon.moves.map(({ move }) => move.name);
  console.log(moves);
}
