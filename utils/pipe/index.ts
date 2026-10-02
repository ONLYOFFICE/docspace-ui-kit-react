/**
 * Composes an async pipeline from a list of step functions.
 * Each step receives the result of the previous one.
 * Equivalent to Compare() from functional composition patterns.
 */
export const pipe =
  <T>(...fns: Array<(v: T) => T | Promise<T>>) =>
  (seed?: T): Promise<T> =>
    fns.reduce(
      (acc: Promise<T>, fn) => acc.then(fn),
      Promise.resolve(seed as T),
    );

/**
 * Returns a step function that waits `ms` milliseconds before passing the value through.
 */
export const delay =
  (ms: number) =>
  <T>(value: T): Promise<T> =>
    new Promise((resolve) => setTimeout(() => resolve(value), ms));

/**
 * Returns a step function that either finishes the pipeline or recurses.
 * Equivalent to ExitCondition() from functional composition patterns.
 *
 * @param predicate - returns true when the pipeline should stop
 * @param onDone    - called with the final value when predicate is true
 * @param recurse   - called to restart the pipeline when predicate is false
 */
export const stopWhen =
  <T>(
    predicate: (v: T) => boolean,
    onDone: (v: T) => T | Promise<T>,
    recurse: () => Promise<T>,
  ) =>
  (value: T): Promise<T> =>
    predicate(value) ? Promise.resolve(value).then(onDone) : recurse();
