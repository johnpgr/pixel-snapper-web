/**
 * @fileoverview Canvas drawing and clearing utilities.
 */

import { ok, err } from "./result.js";

/**
 * Decodes raw image bytes (PNG or JPEG) via createImageBitmap and draws them
 * onto the provided canvas. Marks the canvas as populated by removing the
 * `data-empty` attribute so CSS :has() rules can reveal it.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {Uint8Array} bytes
 * @returns {Promise<Result<ImageSize>>}
 */
export async function drawBytesToCanvas(canvas, bytes) {
  let bitmap;
  try {
    bitmap = await createImageBitmap(new Blob([/** @type {any} */ (bytes)]));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return err(`Could not decode image: ${msg}`);
  }

  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return err("Could not acquire 2D canvas context.");
  }

  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  // Removing data-empty makes the :has(canvas:not([data-empty])) rule match,
  // which hides the empty-state placeholder and shows the canvas.
  delete canvas.dataset["empty"];

  return ok({ width: canvas.width, height: canvas.height });
}

/**
 * Clears a canvas and marks it as empty, restoring the placeholder state.
 *
 * @param {HTMLCanvasElement} canvas
 */
export function clearCanvas(canvas) {
  canvas.dataset["empty"] = "";
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = 0;
  canvas.height = 0;
}
