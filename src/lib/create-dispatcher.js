import { Any, tuple, union, maybe } from 'tcomb';
import { OptionsObject, Callback } from './types';

/**
 * Creates an object that can be passed to tcomb for use as a pattern matching
 * dispatcher, allowing functions to have 'overloaded' method signatures
 */
export default function createDispatcher(patterns) {
  const dispatcher = patterns.reduce(
    (currDispatcher, { pattern, onMatch, maybeOpts, maybeCallback }) => {
      const combinedPatterns = [pattern];

      if (maybeOpts) {
        combinedPatterns.push([...pattern, maybe(OptionsObject)]);

        if (maybeCallback) {
          combinedPatterns.push([...pattern, maybe(OptionsObject), maybe(Callback)]);
        }
      }

      if (maybeCallback) {
        combinedPatterns.push([...pattern, maybe(Callback)]);
      }

      const matcher = (combinedPatterns.length > 1)
        ? union(combinedPatterns.map((p) => tuple(p)))
        : tuple(pattern);

      return [
        ...currDispatcher,
        matcher,
        onMatch,
      ];
    }, []);

  // A fallback for unmatched patterns
  dispatcher.push(Any, (p) => new Error(`Invalid arguments: (${p})`));

  return dispatcher;
}
