import { chunk } from "lodash";

/**
 * Asynchronously maps each item in an array using a provided mapper function with controlled concurrency using lodash chunk.
 *
 * @param {Array<T>} array - The array to map over.
 * @param {Function} mapper - An asynchronous function that takes an item from the array and returns a promise.
 * @param {number} concurrency - The maximum number of promises to process simultaneously.
 * @returns {Promise<Array<U>>} A promise that resolves to a new array with the results of the mapper function.
 */
export async function pMap<T, U>(
  array: T[],
  mapper: (item: T) => Promise<U>,
  { concurrency }: { concurrency: number }
): Promise<U[]> {
  const chunks = chunk(array, concurrency);
  const results: U[][] = [];
  for (const chunk of chunks) {
    results.push(await Promise.all(chunk.map(mapper)));
  }
  return results.flat();
}

export const isStringArray = (array: any[]): array is string[] =>
  array.every((item) => typeof item === "string");
