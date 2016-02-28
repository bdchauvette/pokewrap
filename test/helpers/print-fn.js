import inspect from 'object-inspect';

/**
 * Prints a simulated function call, with prettified args and callback
 */
export default function printFn(name, args, cb) {
  const prettyArgs = args.map((arg) => inspect(arg));

  if (cb) {
    prettyArgs.push('cb');
  }

  return `${name}(${prettyArgs.join(', ')})`;
}
