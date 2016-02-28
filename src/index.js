'use strict';

import 'isomorphic-fetch';
import { match } from 'tcomb';
import UriTemplate from 'uri-templates';
import nextTick from 'next-tick';

import createDispatcher from './lib/create-dispatcher';
import {
  ResourceType,
  NameOrId,
  NameOrIdList,
  ResourceList,
  OptionsObject,
  Callback,
} from './lib/types';

/**
 * Default configurations for each instance
 */
const DEFAULT_CONFIG = {
  /** The base URL to fetch from */
  baseUrl: 'http://pokeapi.co/api/v2',

  /** The default resource type to use with `getOneById` */
  defaultType: 'pokemon',

  /** Options that get passed to the fetch Request object */
  requests: {
    redirect: 'follow',
  },
};

export default class Pokewrap {
  constructor(opts = {}) {
    const requests = { ...DEFAULT_CONFIG.requests, ...opts.requests };
    const config = {
      ...DEFAULT_CONFIG,
      ...opts,
      requests,
    };
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
   *//**
   * @param {ResourceObject} resource
   * @param {OptionsObject} [options]
   * @param {Function} [callback]
   *
   */
  getOne(...args) {
    const patterns = [
      {
        // getOne('pokemon', 1);
        // getOne('pokemon', 'bulbasaur');
        // getOne('pokemon', 'bulbasaur');
        pattern: [ResourceType, NameOrId],
        maybeOpts: true,
        maybeCallback: true,
        onMatch: () => {
          const [type, id, opts, callback] = args;

          return (OptionsObject.is(opts))
            ? this.getOne({ ...opts, type, id }, callback)
            : this.getOne({ type, id }, opts);
        },
      },
      {
        // getOne({ type: 'move', name: 'solar-beam' });
        // getOne({ id: 1 });
        // getOne({ name: 'bulbasaur' });
        pattern: [OptionsObject],
        maybeCallback: true,
        onMatch: () => {
          const [opts, callback] = args;
          const url = createUrl({
            type: this.defaultType,
            baseUrl: this.baseUrl,
            ...opts,
          });

          return this.getByUrl(url, opts.request, callback);
        },
      },
    ];

    const dispatcher = createDispatcher(patterns);
    return match(args, ...dispatcher);
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
  getOneById(id, opts = {}, callback) {
    if (Callback.is(opts)) {
      return this.getOneById(id, undefined, opts);
    }

    const { type = this.defaultType } = opts;
    const resource = createUrl({ baseUrl: this.baseUrl, type, id });

    return this.getByUrl(resource, opts.request, callback);
  }

  /**
   * Alias for getOneById
   *
   * This is included for people who prefer to write `ID` rather than `Id`
   *
   * @see getOneById
   */
  getOneByID(...args) {
    return this.getOneById(...args);
  }

  /**
   * Alias for getOneById
   *
   * This is included because it can be a bit weird to write
   * `getOneById('bulbasaur')`, when a Pokeapi ID usually refers to an integer.
   *
   * @see getOneById
   */
  getOneByName(...args) {
    return this.getOneById(...args);
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
   *//**
   * @param {ResourceType} type
   * @param {NameOrIdList} resources
   * @param {OptionsObject} [opts] - Additional options that will be merged
   *                                 with each item being fetched
   * @param {Function} [callback] - A callback for when the object is found
   *
   * @returns {Promise<Object>}
   *//**
   * @param {ResourceList} resources
   * @param {OptionsObject} [opts] - Additional options that will be merged
   *                                 with each item being fetched
   * @param {Function} [callback] - A callback for when the object is found
   *
   * @returns {Promise<Object>}
   */
  getMany(...args) {
    const patterns = [
      {
        // getMany('item');
        pattern: [ResourceType],
        maybeOpts: true,
        maybeCallback: true,
        onMatch: () => {
          const [type, opts = {}, callback] = args;

          if (Callback.is(opts)) {
            return this.getMany(type, undefined, opts);
          }

          const { limit, offset, request } = opts;

          const url = createUrl({ baseUrl: this.baseUrl, type, limit, offset });
          return this.getByUrl(url, request, callback);
        },
      },
      {
        // getMany('pokemon', ['bulbasaur', 'charmander', 'squirtle']);
        // getMany('item', [1, 2, 3]);
        pattern: [ResourceType, NameOrIdList],
        maybeOpts: true,
        maybeCallback: true,
        onMatch: () => {
          const [type, ids, opts = {}, callback] = args;

          if (Callback.is(opts)) {
            return this.getMany(type, ids, undefined, opts);
          }

          const requests = ids.map((id) => this.getOne(type, id, opts));
          const batchedRequests = Promise.all(requests);
          return maybeCallback(batchedRequests, callback);
        },
      },
      {
        // getMany(['bulbasaur', 'charmander', 'squirtle']);
        // getMany([1, 2, 3]);
        pattern: [ResourceList],
        maybeOpts: true,
        maybeCallback: true,
        onMatch: () => {
          const [resources, opts = {}, callback] = args;

          if (Callback.is(opts)) {
            return this.getMany(resources, undefined, opts);
          }

          const requests = resources.map(
            (resource) => (NameOrId.is(resource))
              ? this.getOneById(resource, opts)
              : this.getOne({ ...opts, ...resource })
          );

          const batchedRequests = Promise.all(requests);
          return maybeCallback(batchedRequests, callback);
        },
      },
    ];

    const dispatcher = createDispatcher(patterns);
    return match(args, ...dispatcher);
  }

  /**
   * Fetches the resource from the provided URL.
   *
   * @param {String} url - The URL to fetch
   * @param {Object} [opts] - Additional options that will be passed to
   *                                 the request object
   * @param {Function} [callback] - A callback for when the object is found
   */
  getByUrl(url, opts = {}, callback) {
    if (Callback.is(opts)) {
      return this.getByUrl(url, undefined, opts);
    }

    const requestOpts = {
      ...this.requests,
      ...opts,

      // the Pokeapi only supports GET requests
      method: 'GET',
    };

    const request = fetch(url, requestOpts).then(getJSON);
    return maybeCallback(request, callback);
  }

  /**
   * Alias for getByURL
   *
   * This is included for people who prefer to write `URL` rather than `Url`
   *
   * @see getByUrl
   */
  getByURL(...args) {
    return this.getByUrl(args);
  }

  /** @private */
  getEmAll() {
    return this.getMany('pokemon', { limit: Number.MAX_SAFE_INTEGER });
  }
}

/**
 * Creates a url based on parameters
 * @private
 */
function createUrl({ baseUrl, type, id, name, limit, offset }) {
  const base = stripTrailingSlash(baseUrl);
  const identifier = id || name;

  const template = new UriTemplate(`${base}{/type}{/identifier}/{?limit,offset}`);

  return template.fillFromObject({ type, identifier, limit, offset });
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
    const err = new Error(response.statusText);
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
export default function maybeCallback(promise, callback) {
  if (callback) {
    promise
      .then((data) => { nextTick(() => callback(null, data)); })
      .catch((err) => { nextTick(() => callback(err)); });
  }

  return promise;
}
