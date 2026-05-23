/**
 * @fileoverview DOM interaction utilities.
 */

import { ok, err } from "./result.js";

/**
 * Safe wrapper to find and cast a DOM element, returning an error result if
 * the element is absent or of the wrong type.
 *
 * @template {HTMLElement} T
 * @param {string} id
 * @param {new () => T} T
 * @returns {Result<T>}
 */
export function getElement(id, T) {
  const el = document.getElementById(id);
  if (!el) {
    return err(`DOM element with id "${id}" was not found.`);
  }
  if (!(el instanceof T)) {
    return err(
      `DOM element with id "${id}" is not an instance of ${T.name}.`,
    );
  }
  return ok(el);
}

/**
 * Gets a DOM element by its ID, throwing an error if it's not found or of the wrong type.
 *
 * @template {HTMLElement} T
 * @param {string} id
 * @param {new () => T} T
 * @returns {T}
 */
export function getElementOrThrow(id, T) {
  const result = getElement(id, T);
  if (!result.ok) {
    throw result.error;
  }
  return result.value;
}
