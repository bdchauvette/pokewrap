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

## Features

- Clean, flexible interface to the RESTful Pokemon API
- Supports promises and callbacks
- Works in both node and the browser

---

## Installation & Setup

Download the files:

```sh
$ npm install --save pokewrap
```

Then include it in your source:

```js
// ES6+
import Pokewrap from 'pokewrap';
const pokewrap = new Pokewrap();
```
```js
// CommonJS
const Pokewrap = require('pokewrap').default;
const pokewrap = new Pokewrap();
```
```js
// Browser
var pokewrap = new Pokewrap.default();
```

**Notes:**

- If you use the global variable or CommonJS to work with Pokewrap, you need to
  explicitly reference the `Pokewrap.default` object.

- Although Pokewrap supports callbacks, it is built using the
  [`isomorphic-fetch`][],
  which requires you to bring your own `Promise` library if your target
  environment doesn't support them natively. Both [`es6-promise`][]  and
  [`bluebird`][] are great options.

  [`isomorphic-fetch`]: https://github.com/matthew-andrews/isomorphic-fetch
  [`es6-promise`]: https://github.com/stefanpenner/es6-promise
  [`bluebird`]: http://bluebirdjs.com/docs/getting-started.html

---

## Examples

### Basic Usage
```js
// What can Magikarp do, anyway?
pokewrap.getOneByName('magikarp')
  .then((pokemon) => pokemon.moves.map(({ move }) => move.name))
  .then((moves) => console.log(moves));
```

```js
[ 'bounce', 'splash', 'tackle', 'flail' ]
```

[Back to Top ↑](#pokewrap)

### Fetch multiple resources in a single call
```js
// Uno, dos, tres!
pokewrap
  .getMany(['articuno', 'zapdos', 'moltres'])
  .then((pokemon) => console.log(getVitals(pokemon)))
  .catch((err) => console.error(err));

function getVitals(pokemon) {
  return pokemon.map(
    ({ name, height, weight }) => ({name, height, weight})
  );
}

```
```js
[ { name: 'articuno', height: 17, weight: 554 },
  { name: 'zapdos', height: 16, weight: 526 },
  { name: 'moltres', height: 20, weight: 600 } ]
```

[Back to Top ↑](#pokewrap)

### Fetch any type of resource from the Pokemon API
```js
// How big is a pinap berry?
pokewrap.getOne('berry', 'pinap')
  .then((berry) => {
    console.log(`A pinap berry is ${berry.size}mm in size.`);
  });
```
```
A pinap berry is 80mm in size.
```

[Back to Top ↑](#pokewrap)

### Support for callbacks
```js
// Which pokemon loves asynchronous programming?
pokewrap.getOneById(483, (pokemon) => console.log(pokemon.name));
);
```
```js
'dialga'
```

[Back to Top ↑](#pokewrap)

---

## API

### Pokewrap()
##### Signature
`new Pokewrap(?config) => Pokewrap`
```js
config: ?Object
```

The configuration options and their default values are as follows:

Option        | Default                      | Comments
--------------|------------------------------|----------
`baseUrl`     | `'http://pokeapi.co/api/v2'` | The base URL to send requests to.  Changing this value can be useful for testing your own local copy of the Pokemon API
`defaultType` | `'pokemon'`                  | The default endpoint to fetch resources from. If no type is provided to a call, then Pokewrap will fallback to using this type.
`requests`    | `{ redirect: 'follow' }`     | Options that are passed to each `Request` object. See the [`Request` documentation at MDN](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request) for the full list of options.

#### getOne()
##### Signature
1. `getOne(type, id, ?opts, ?callback) => Promise<Resource>`
  ```
  type:     ResourceType
  id:       NameOrId
  opts:     ?Object
  callback: ?Function
  ```

2. `getOne(opts, ?callback) => Promise<Resource>`
  ```
  opts:     Object
  callback: ?Function
  ```

##### Examples
```js
// These calls are identical
pokewrap.getOne('berry', 'pinap');
pokewrap.getOne({ type: 'berry', id: 'pinap' });
pokewrap.getOne({ type: 'berry', name: 'pinap' });
```

```js
// Pass options to the Request object
pokewrap.getOne('pokemon', 'magikarp', { cache: 'no-cache' });
```

```js
// With a callback
pokewrap.getOne('pokemon', 'magikarp', (pokemon) => console.log(pokemon));
```

```js
// With callback and options
pokewrap.getOne(
  'pokemon', 'magikarp',
  { cache: 'no-cache' },
  (pokemon) => console.log(pokemon)
);
```

[Back to Top ↑](#pokewrap)

---

#### getOneById()
##### Signature
`getOneById(id, ?opts, ?callback) => Promise<Resource>`
```
id:       NameOrId
opts:     ?Object
callback: ?Function
```
> **Note:** You can also call this method using `getOneByID` or `getOneByName`.

##### Examples
```js
pokewrap.getOneById(1);
pokewrap.getOneById('bulbasaur');
pokewrap.getOneByName('bulbasaur');
```

```js
// Using a different default type
const pokewrap = new Pokewrap({ defaultType: 'berry' });

// Fetches a cheri berry, not bulbasaur
pokewrap.getOneById(1);
```

```js
// Pass options to the Request object
pokewrap.getOneById('pikachu', { cache: 'no-cache' });
```

```js
// With a callback
pokewrap.getOneById(1, (pokemon) => console.log(pokemon));
```

```js
// With callback and options
pokewrap.getOneById(
  'magikarp',
  { cache: 'no-cache' },
  (pokemon) => console.log(pokemon)
);
```


[Back to Top ↑](#pokewrap)

---

#### getOneByName()

This is an alias for [`getOneById()`](), for when it seems strange to fetch a
pokemon by `name` using a method called `getOneById`.

[Back to Top ↑](#pokewrap)

---

#### getMany()

##### Signature
1. `getMany(type, ?opts, ?callback) => Promise<Array<Resource>>`
  ```
  type:     ResourceType
  opts:     ?Object
  callback: ?Function
  ```

2. `getMany(type, ids, ?opts, ?callback) => Promise<Array<Resource>>`
  ```
  type:     ResourceType
  ids:      Array<NameOrId|ResourceObject>
  opts:     ?Object
  callback: ?Function
  ```

2. `getMany(ids, ?opts, ?callback) => Promise<Array<Resource>>`
  ```
  ids:       Array<NameOrId|ResourceObject>
  opts:      ?Object
  callback:  ?Function
  ```

##### Examples
```js
// Fetch a paginated list of resources in the given type
pokewrap.getMany('pokemon');
pokewrap.getMany('berry');
```

```js
// Fetch an array of cherri, sitrus, and pinap berries
pokewrap.getMany('berry', [1, 10, 20]);
```

```js
// Fetch multiple individual resources using the default type
pokewrap.getMany(['bulbasaur', 'ivysaur', 'venusaur']);
```

```js
// Using a different default type
const pokewrap = new Pokewrap({ defaultType: 'berry' });

// Fetches a cheri berry, not bulbasaur
pokewrap.getMany(['bulbasaur', 'charmander', 'squirtle']);
```

```js
// Mix & Match IDs, names, and objects in the request
const bulbasaur  = 1;
const ivysaur   = 'ivysaur'
const venusaur  = { name: 'venusaur' };
const solarBeam  = { type: 'move', name: 'solar-beam' };

pokewrap.getMany([bulbasaur, ivysaur, venusaur, solarBeam]);
```
```js
// Pass options to the Request object
pokewrap.getMany(
  'item',
  [1, 2, 3],
  { cache: 'no-cache' }
);

pokewrap.getMany(
  ['bulbasaur', 'charmander', 'squirtle'],
  { cache: 'no-cache' }
);
```

```js
// With a callback
pokewrap.getMany(
  'item',
  [1, 2, 3],
  (items) => items.forEach((item) => console.log(item));
);

pokewrap.getMany(
  ['bulbasaur', 'charmander', 'squirtle'],
  (pokemonList) => {
    pokemonList.forEach((pokemon) => console.log(pokemon));
  }
);
```

```js
// With callback and options
pokewrap.getMany(
  'berry', ['cherri', 'sitrus', 'pinap'],
  { cache: 'no-cache' },
  (berry) => console.log(berry)
);
```

[Back to Top ↑](#pokewrap)

---

#### getByUrl()
##### Signature
`getByUrl(url, ?opts, ?callback)`
```
url:       String,
?opts:     Object,
?callback: Function
```
> **Note:** You can also call this method using `getByURL`.

##### Examples

[Back to Top ↑](#pokewrap)

---

## Contributing

### Building

The following `npm` scripts are available for use during development:

Command                    | Use to...
---------------------------|-----------
`npm run build`            | Transpile & bundle (no minification)
`npm run build:production` | Transpile & bundle (w/ minification)
`npm run clean`            | Remove the `dist/` files
`npm run compile`          | Transpile `src/` to `dist/`
`npm run lint`             | Lint the files in `src/`


### Testing

For tests with pretty output via [`faucet`](http://github.com/substack/faucet), run:

```sh
$ npm test
```

For raw TAP-formatted output, run:

```sh
$ npm run test:tap
```

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
