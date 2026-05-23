/**
 * @fileoverview Zoom utility calculations for preview viewports.
 */

/** Discrete zoom levels available via the step buttons. */
export const ZOOM_STEPS = [0.25, 0.33, 0.5, 0.67, 0.75, 1, 1.25, 1.5, 2, 3, 4];

/**
 * Returns the next discrete zoom level higher than current, if one exists.
 *
 * @param {number} current
 * @returns {number}
 */
export function getNextStep(current) {
  const nextIdx = ZOOM_STEPS.findIndex((s) => s > current);
  return nextIdx !== -1 ? /** @type {number} */ (ZOOM_STEPS[nextIdx]) : current;
}

/**
 * Returns the next discrete zoom level lower than current, if one exists.
 *
 * @param {number} current
 * @returns {number}
 */
export function getPrevStep(current) {
  const prev = ZOOM_STEPS.filter((s) => s < current);
  return prev.length > 0 ? /** @type {number} */ (prev[prev.length - 1]) : current;
}

