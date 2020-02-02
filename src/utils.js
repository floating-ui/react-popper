// @flow

import { type Ref } from "./RefTypes";

/**
 * Takes an argument and if it's an array, returns the first item in the array,
 * otherwise returns the argument. Used for Preact compatibility.
 */
export const unwrapArray = (arg: *): * => (Array.isArray(arg) ? arg[0] : arg);

/**
 * Takes a maybe-undefined function and arbitrary args and invokes the function
 * only if it is defined.
 */
export const safeInvoke = (fn: ?Function, ...args: *) => {
  if (typeof fn === "function") {
    return fn(...args);
  }
}

/**
 * Does a shallow equality check of two objects by comparing the reference
 * equality of each value.
 */
export const shallowEqual = (objA: any[], objB: any[]): boolean => {

  if (objA.length !== objB.length) {
    return false;
  }

  for (var i = 0; i < objB.length; i++) {
    if (objA[i] !== objB[i]) {
      return false;
    }
  }

  return true;
}

/**
 * Sets a ref using either a ref callback or a ref object
 */
export const setRef = (ref: ?Ref, node: ?HTMLElement) => {
  // if its a function call it
  if (typeof ref === "function") {
    return safeInvoke(ref, node);
  }
  // otherwise we should treat it as a ref object
  else if (ref != null) {
    ref.current = node;
  }
}
