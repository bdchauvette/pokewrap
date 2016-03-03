'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = maybeCallback;

require('isomorphic-fetch');

var _tcomb = require('tcomb');

var _uriTemplates = require('uri-templates');

var _uriTemplates2 = _interopRequireDefault(_uriTemplates);

var _nextTick = require('next-tick');

var _nextTick2 = _interopRequireDefault(_nextTick);

var _createDispatcher = require('./lib/create-dispatcher');

var _createDispatcher2 = _interopRequireDefault(_createDispatcher);

var _types = require('./lib/types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Default configurations for each instance
 */
var DEFAULT_CONFIG = {
  /** The base URL to fetch from */
  baseUrl: 'http://pokeapi.co/api/v2',

  /** The default resource type to use with `getOneById` */
  defaultType: 'pokemon',

  /** Options that get passed to the fetch Request object */
  requests: {
    redirect: 'follow'
  }
};

var Pokewrap = function () {
  function Pokewrap() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Pokewrap);

    var requests = _extends({}, DEFAULT_CONFIG.requests, opts.requests);
    var config = _extends({}, DEFAULT_CONFIG, opts, {
      requests: requests
    });

    Object.assign(this, config);
  }

  /**
   * Fetches a single resource based on its resource type and its name or ID
   *
   * @param {ResourceType} type - The resource type
   * @param {NameOrId} id - The name or ID number of the resource
   * @param {OptionsObject} [opts] - Additional options
   * @param {Function} [callback] - A callback for when the object is found
   *
   * @returns {Promise<Object>} The resource object, if found
   */ /**
      * @param {ResourceObject} resource
      * @param {OptionsObject} [options]
      * @param {Function} [callback]
      *
      */


  _createClass(Pokewrap, [{
    key: 'getOne',
    value: function getOne() {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var patterns = [{
        // getOne('pokemon', 1);
        // getOne('pokemon', 'bulbasaur');
        // getOne('pokemon', 'bulbasaur');
        pattern: [_types.ResourceType, _types.NameOrId],
        maybeOpts: true,
        maybeCallback: true,
        onMatch: function onMatch() {
          var type = args[0];
          var id = args[1];
          var opts = args[2];
          var callback = args[3];


          return _types.OptionsObject.is(opts) ? _this.getOne(_extends({}, opts, { type: type, id: id }), callback) : _this.getOne({ type: type, id: id }, opts);
        }
      }, {
        // getOne({ type: 'move', name: 'solar-beam' });
        // getOne({ id: 1 });
        // getOne({ name: 'bulbasaur' });
        pattern: [_types.OptionsObject],
        maybeCallback: true,
        onMatch: function onMatch() {
          var opts = args[0];
          var callback = args[1];

          var url = createUrl(_extends({
            type: _this.defaultType,
            baseUrl: _this.baseUrl
          }, opts));

          return _this.getByUrl(url, opts, callback);
        }
      }];

      var dispatcher = (0, _createDispatcher2.default)(patterns);
      return _tcomb.match.apply(undefined, [args].concat(_toConsumableArray(dispatcher)));
    }

    /**
     * Fetches a single resource based on its name or ID
     *
     * @param {NameOrId} id - The name or ID number of the resource
     * @param {OptionsObject} [opts] - Additional options
     * @param {Function} [callback] - A callback for when the object is found
     *
     * @returns {Promise<Object>} The resource object, if found
     */

  }, {
    key: 'getOneById',
    value: function getOneById(id) {
      var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var callback = arguments[2];

      if (_types.Callback.is(opts)) {
        return this.getOneById(id, undefined, opts);
      }

      var _opts$type = opts.type;
      var type = _opts$type === undefined ? this.defaultType : _opts$type;

      var resource = createUrl({ baseUrl: this.baseUrl, type: type, id: id });

      return this.getByUrl(resource, opts, callback);
    }

    /**
     * Alias for getOneById
     *
     * This is included for people who prefer to write `ID` rather than `Id`
     *
     * @see getOneById
     */

  }, {
    key: 'getOneByID',
    value: function getOneByID() {
      return this.getOneById.apply(this, arguments);
    }

    /**
     * Alias for getOneById
     *
     * This is included because it can be a bit weird to write
     * `getOneById('bulbasaur')`, when a Pokeapi ID usually refers to an integer.
     *
     * @see getOneById
     */

  }, {
    key: 'getOneByName',
    value: function getOneByName() {
      return this.getOneById.apply(this, arguments);
    }

    /**
     * Fetches information about multiple resources, either from a ResourceList
     * endpoint or as a series of get requests.
     *
     * @param {ResourceType} type
     * @param {OptionsObject} [opts] - Additional options
     * @param {Function} [callback] - A callback for when the object is found
     *
     * @returns {Promise<Object>}
     */ /**
        * @param {ResourceType} type
        * @param {NameOrIdList} resources
        * @param {OptionsObject} [opts] - Additional options that will be merged
        *                                 with each item being fetched
        * @param {Function} [callback] - A callback for when the object is found
        *
        * @returns {Promise<Object>}
        */ /**
           * @param {ResourceList} resources
           * @param {OptionsObject} [opts] - Additional options that will be merged
           *                                 with each item being fetched
           * @param {Function} [callback] - A callback for when the object is found
           *
           * @returns {Promise<Object>}
           */

  }, {
    key: 'getMany',
    value: function getMany() {
      var _this2 = this;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var patterns = [{
        // getMany('item');
        pattern: [_types.ResourceType],
        maybeOpts: true,
        maybeCallback: true,
        onMatch: function onMatch() {
          var type = args[0];
          var _args$ = args[1];
          var opts = _args$ === undefined ? {} : _args$;
          var callback = args[2];


          if (_types.Callback.is(opts)) {
            return _this2.getMany(type, undefined, opts);
          }

          var limit = opts.limit;
          var offset = opts.offset;


          var url = createUrl({ baseUrl: _this2.baseUrl, type: type, limit: limit, offset: offset });
          return _this2.getByUrl(url, opts, callback);
        }
      }, {
        // getMany('pokemon', ['bulbasaur', 'charmander', 'squirtle']);
        // getMany('item', [1, 2, 3]);
        pattern: [_types.ResourceType, _types.NameOrIdList],
        maybeOpts: true,
        maybeCallback: true,
        onMatch: function onMatch() {
          var type = args[0];
          var ids = args[1];
          var _args$2 = args[2];
          var opts = _args$2 === undefined ? {} : _args$2;
          var callback = args[3];


          if (_types.Callback.is(opts)) {
            return _this2.getMany(type, ids, undefined, opts);
          }

          var requests = ids.map(function (id) {
            return _this2.getOne(type, id, opts);
          });
          var batchedRequests = Promise.all(requests);
          return maybeCallback(batchedRequests, callback);
        }
      }, {
        // getMany(['bulbasaur', 'charmander', 'squirtle']);
        // getMany([1, 2, 3]);
        pattern: [_types.ResourceList],
        maybeOpts: true,
        maybeCallback: true,
        onMatch: function onMatch() {
          var resources = args[0];
          var _args$3 = args[1];
          var opts = _args$3 === undefined ? {} : _args$3;
          var callback = args[2];


          if (_types.Callback.is(opts)) {
            return _this2.getMany(resources, undefined, opts);
          }

          var requests = resources.map(function (resource) {
            return _types.NameOrId.is(resource) ? _this2.getOneById(resource, opts) : _this2.getOne(_extends({}, opts, resource));
          });

          var batchedRequests = Promise.all(requests);
          return maybeCallback(batchedRequests, callback);
        }
      }];

      var dispatcher = (0, _createDispatcher2.default)(patterns);
      return _tcomb.match.apply(undefined, [args].concat(_toConsumableArray(dispatcher)));
    }

    /**
     * Fetches the resource from the provided URL.
     *
     * @param {String} url - The URL to fetch
     * @param {Object} [opts] - Additional options that will be passed to
     *                                 the request object
     * @param {Function} [callback] - A callback for when the object is found
     */

  }, {
    key: 'getByUrl',
    value: function getByUrl(url) {
      var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var callback = arguments[2];

      if (_types.Callback.is(opts)) {
        return this.getByUrl(url, undefined, opts);
      }

      var requestOpts = _extends({}, this.requests, opts, {

        // the Pokeapi only supports GET requests, which cannot have a body
        method: 'GET',
        body: undefined
      });

      var request = fetch(url, requestOpts).then(getJSON);
      return maybeCallback(request, callback);
    }

    /**
     * Alias for getByURL
     *
     * This is included for people who prefer to write `URL` rather than `Url`
     *
     * @see getByUrl
     */

  }, {
    key: 'getByURL',
    value: function getByURL() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return this.getByUrl(args);
    }

    /** @private */

  }, {
    key: 'getEmAll',
    value: function getEmAll() {
      return this.getMany('pokemon', { limit: Number.MAX_SAFE_INTEGER });
    }
  }]);

  return Pokewrap;
}();

/**
 * Creates a url based on parameters
 * @private
 */


exports.default = Pokewrap;
function createUrl(_ref) {
  var baseUrl = _ref.baseUrl;
  var type = _ref.type;
  var id = _ref.id;
  var name = _ref.name;
  var limit = _ref.limit;
  var offset = _ref.offset;

  var base = stripTrailingSlash(baseUrl);
  var identifier = id || name;

  var template = new _uriTemplates2.default(base + '{/type}{/identifier}/{?limit,offset}');

  return template.fillFromObject({ type: type, identifier: identifier, limit: limit, offset: offset });
}

/**
 * Removes a trailing slash from a URL
 * @private
 *
 * @param {String} url
 * @returns {String}
 */
function stripTrailingSlash(url) {
  return url.replace(/\/+$/, '');
}

/**
 * Extracts the JSON body from a fetched response object
 * @private
 *
 * @param {Response} response
 * @returns {Object}
 */
function getJSON(response) {
  if (response.status >= 400) {
    var err = new Error(response.statusText);
    return Promise.reject(err);
  }

  return response.json();
}

/**
 * Calls a callback, if one is provided,  after a Promise resolves
 *
 * @param {Promise} promise
 * @param {Function} callback
 *
 * @returns {Promise}
 */
function maybeCallback(promise, callback) {
  if (callback) {
    promise.then(function (data) {
      (0, _nextTick2.default)(function () {
        return callback(null, data);
      });
    }).catch(function (err) {
      (0, _nextTick2.default)(function () {
        return callback(err);
      });
    });
  }

  return promise;
}