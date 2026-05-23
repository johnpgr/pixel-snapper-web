/**
 * @fileoverview Zoom state management and application to a pair of canvases.
 */

/** Discrete zoom levels available via the step buttons. */
const ZOOM_STEPS = [0.25, 0.33, 0.5, 0.67, 0.75, 1, 1.25, 1.5, 2, 3, 4];

/** @type {number} Current zoom factor (1 = 100%). */
let current = 1;

/**
 * Returns the current zoom factor.
 * @returns {number}
 */
export function get() {
  return current;
}

/**
 * Steps the zoom up to the next discrete level, if one exists.
 * @returns {number} The new zoom factor.
 */
export function stepIn() {
  const nextIdx = ZOOM_STEPS.findIndex((s) => s > current);
  if (nextIdx !== -1) current = /** @type {number} */ (ZOOM_STEPS[nextIdx]);
  return current;
}

/**
 * Steps the zoom down to the previous discrete level, if one exists.
 * @returns {number} The new zoom factor.
 */
export function stepOut() {
  const prev = ZOOM_STEPS.filter((s) => s < current);
  if (prev.length > 0) current = /** @type {number} */ (prev[prev.length - 1]);
  return current;
}

/**
 * Resets zoom to 100%.
 * @returns {number} Always 1.
 */
export function reset() {
  current = 1;
  return current;
}

/**
 * Applies the current zoom transform to a list of canvas elements.
 * @param {HTMLCanvasElement[]} canvases
 */
export function applyTo(canvases) {
  for (const canvas of canvases) {
    canvas.style.transform = `scale(${current})`;
  }
}
