/**
 * @fileoverview WASM module initialization and image processing wrapper.
 */

import init, { process_image } from "../pkg/spritefusion_pixel_snapper.js";
import { ok, err } from "./result.js";

/** @type {boolean} */
let initialized = false;

/**
 * Initializes the WASM module. Safe to call multiple times; subsequent calls
 * are no-ops.
 *
 * @returns {Promise<Result<void>>}
 */
export async function initialize() {
  if (initialized) return ok(undefined);
  try {
    await init();
    initialized = true;
    return ok(undefined);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return err(`Failed to initialize WASM module: ${msg}`);
  }
}

/**
 * Runs the pixel-snapping pipeline on raw image bytes.
 *
 * @param {Uint8Array} inputBytes  PNG or JPEG bytes.
 * @param {number}     kColors     Number of palette colors (1–64).
 * @param {number | undefined} pixelSizeOverride  Force a grid cell size, or
 *   undefined to auto-detect.
 * @returns {Result<Uint8Array>}
 */
export function processImage(inputBytes, kColors, pixelSizeOverride) {
  try {
    const output = process_image(inputBytes, kColors, pixelSizeOverride);
    return ok(output);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return err(msg);
  }
}
