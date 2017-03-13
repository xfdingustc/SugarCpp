/// <reference path="types.ts" />
namespace sc {
  export const version = "0.0.1";
}

namespace sc {
  export function forEach<T, U>(array: T[] | undefined, callback: (element: T, index: number) => U | undefined): U | undefined {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        const result = callback(array[i], i);
        if (result) {
          return result;
        }
      }
    }
    return undefined;
  }

  export function append<T>(to: T[] | undefined, value: T | undefined): T[] | undefined {
    if (value === undefined) {
      return to;
    }

    if (to === undefined) {
      return [value];
    }

    to.push(value);
    return to;
  }

  export function addRange<T>(to: T[] | undefined, from: T[] | undefined): T[] | undefined {
    if (from === undefined) {
      return to;
    }
    for (const v of from) {
      to = append(to, v);
    }
    return to;
  }
}