/**
 * @fileoverview WASM module initialization and image processing wrapper.
 */

import init, { process_image } from "../vendor/spritefusion_pixel_snapper.js";
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
 * @returns {Result<SnapperResultData>}
 */
export function processImage(inputBytes, kColors, pixelSizeOverride) {
  try {
    const resultObj = process_image(inputBytes, kColors, pixelSizeOverride);
    const output = resultObj.output_bytes;
    const pixelSize = resultObj.pixel_size;
    const pixelSizeMode = resultObj.pixel_size_mode;
    const outputWidth = resultObj.output_width;
    const outputHeight = resultObj.output_height;
    
    // Crucial: free the WebAssembly object to prevent memory leaks
    resultObj.free();

    return ok({
      output,
      pixelSize,
      pixelSizeMode,
      outputWidth,
      outputHeight
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return err(msg);
  }
}
