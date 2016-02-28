# Pokewrap
**A JavaScript wrapper for the [Pokemon API](http://pokeapi.co/)**
> *Because Snorlax ain't the only RESTful thing in the Pokemon Storage System!*

[![npm version](https://badge.fury.io/js/pokewrap.svg)](https://badge.fury.io/js/pokewrap)

----

## Table of Contents
- [Installation & Setup](#installation--setup)
- [Examples](#examples)
- [API](#api)
  - [Pokewrap()](#pokewrap-1)
    - [getOne()](#getone)
    - [getOneById()](#getonebyid)
    - [getOneByName()](#getonebyname)
    - [getMany()](#getmany)
    - [getByUrl()](#getbyurl)
- [Contributing](#contributing)
  - [Building](#building)
  - [Testing](#testing)
- [Other great wrappers](#other-great-wrappers)
- [License](#license)

---

## Installation & Setup

Download the files:

```sh
$ npm install --save pokewrap
```

Then include it in your source:

```js
import Pokewrap from 'pokewrap';
const pokewrap = new Pokewrap();
```

**Note:** If you're using CommonJS syntax to import Pokewrap, you'll have to
explictly import the `default` object:

```js
const Pokewrap = require('pokewrap').default;
const pokewrap = new Pokewrap();
```

---

## Examples

### Basic Usage
```js
// What does Magikarp do, anyway?
pokewrap.getOneByName('magikarp')
  .then((pokemon) => pokemon.moves.map(({ move }) => move.name))
  .then((moves) => console.log(moves));
```

```js
[ 'bounce', 'splash', 'tackle', 'flail' ]
```

[Back to Top ↑](#pokewrap)

### Masterful Multiple Fetching
```js
function getVitals(pokemon) {
  return pokemon.map(
    ({ name, height, weight }) => ({name, height, weight})
  );
}

pokewrap
  .getMany(['articuno', 'zapdos', 'moltres'])
  .then((pokemon) => console.log(getVitals(pokemon)))
  .catch((err) => console.error(err));
```

```js
[ { name: 'articuno', height: 17, weight: 554 },
  { name: 'zapdos', height: 16, weight: 526 },
  { name: 'moltres', height: 20, weight: 600 } ]
```

[Back to Top ↑](#pokewrap)

### Fetch more than just Pokemon (even using callbacks!)
```js
// How big is a pinap berry?
pokewrap.getOne('berry', 'pinap', (err, berry) => {
  if (err) return err;
  console.log(`A pinap berry is ${berry.size}mm in size.`);
});
```
```
A pinap berry is 80mm in size.
```

[Back to Top ↑](#pokewrap)

### Goes great with async/await
```js
async function getVitals(id) {
  const pokemon = await pokewrap.getOneById(id);
  console.log({
    name: pokemon.name,
    height: pokemon.height,
    weight: pokemon.weight,
  });
}

getVitals(483);
```
```js
{ name: 'dialga', height: 54, weight: 6830 }
```

[Back to Top ↑](#pokewrap)

---

## API

### Pokewrap()

#### getOne()

```haxe
Pokewrap#getOne(
  type:     String,
  id:       String|PositiveInteger,
  opts:     ?OptionsObject,
  callback: ?Function
): Promise<Resource>
```
[Back to Top ↑](#pokewrap)

---

#### getOneById()
```haxe
Pokewrap#getOneById(
  id:       String|PositiveInteger,
  opts:     ?Object,
  callback: ?Function
): Promise<Resource>
```
> **Note:** You may also call this method using `getOneByID` or `getOneByName`.

[Back to Top ↑](#pokewrap)

---

#### getOneByName()

This is an alias for [`getOneById()`](), for when it seems strange to fetch a
pokemon by `name` using a method called `getOneById`.

[Back to Top ↑](#pokewrap)

---

#### getMany()
```haxe
Pokewrap#getMany(
  pokemon:  Array<String|PositiveInteger|Object>,
  opts:     ?Object,
  callback: ?Function
): Promise<Object>
```

[Back to Top ↑](#pokewrap)

---

#### getByUrl()
```haxe
Pokewrap#getByUrl(
  url:       String,
  ?opts:     Object,
  ?callback: Function
): Promise<Object>
```
> **Note:** You may also call this method using `getByURL`.

[Back to Top ↑](#pokewrap)

---

## Contributing

### Building

### Testing

[Back to Top ↑](#pokewrap)

---

## Other Great Wrappers

- [`pokedex-promise`](https://github.com/TheTommyTwitch/pokedex-promise) - A lightweight Pokemon API wrapper for node

[Back to Top ↑](#pokewrap)

---

## License
Pokewrap is licensed under the ISC License.

For details, please see the [`LICENSE`](https://raw.githubusercontent.com/bdchauvette/pokewrap/master/LICENSE) file.

[Back to Top ↑](#pokewrap)

---

![Pokemon and Eevee high fiving each other](http://i.giphy.com/3oEduV4SOS9mmmIOkw.gif)
