'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createDispatcher;

var _tcomb = require('tcomb');

var _types = require('./types');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Creates an object that can be passed to tcomb for use as a pattern matching
 * dispatcher, allowing functions to have 'overloaded' method signatures
 */
function createDispatcher(patterns) {
  var dispatcher = patterns.reduce(function (currDispatcher, _ref) {
    var pattern = _ref.pattern;
    var onMatch = _ref.onMatch;
    var maybeOpts = _ref.maybeOpts;
    var maybeCallback = _ref.maybeCallback;

    var combinedPatterns = [pattern];

    if (maybeOpts) {
      combinedPatterns.push([].concat(_toConsumableArray(pattern), [(0, _tcomb.maybe)(_types.OptionsObject)]));

      if (maybeCallback) {
        combinedPatterns.push([].concat(_toConsumableArray(pattern), [(0, _tcomb.maybe)(_types.OptionsObject), (0, _tcomb.maybe)(_types.Callback)]));
      }
    }

    if (maybeCallback) {
      combinedPatterns.push([].concat(_toConsumableArray(pattern), [(0, _tcomb.maybe)(_types.Callback)]));
    }

    var matcher = combinedPatterns.length > 1 ? (0, _tcomb.union)(combinedPatterns.map(function (p) {
      return (0, _tcomb.tuple)(p);
    })) : (0, _tcomb.tuple)(pattern);

    return [].concat(_toConsumableArray(currDispatcher), [matcher, onMatch]);
  }, []);

  // A fallback for unmatched patterns
  dispatcher.push(_tcomb.Any, function (p) {
    return new Error('Invalid arguments: (' + p + ')');
  });

  return dispatcher;
}