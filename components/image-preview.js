/**
 * @fileoverview Custom element encapsulating canvas preview viewport panels.
 */

import * as canvas from "../lib/canvas.js";

export class ImagePreview extends HTMLElement {
  constructor() {
    super();
    /** @type {HTMLCanvasElement | null} */
    this.canvas = null;
    /** @type {HTMLElement | null} */
    this.emptyState = null;
    /** @type {HTMLSpanElement | null} */
    this.infoDisplay = null;
  }

  connectedCallback() {
    this.canvas = /** @type {HTMLCanvasElement | null} */ (this.querySelector("canvas"));
    this.emptyState = /** @type {HTMLElement | null} */ (this.querySelector(".canvas-empty-state"));

    const targetId = this.getAttribute("info-target");
    if (targetId) {
      this.infoDisplay = /** @type {HTMLSpanElement | null} */ (document.getElementById(targetId));
    }

    // Set dataset empty attribute initially so CSS placeholder rules apply.
    if (this.canvas) {
      this.canvas.dataset["empty"] = "";
    }
  }

  /**
   * Clears the loaded canvas image and resets the label info.
   */
  clear() {
    if (this.canvas) {
      canvas.clearCanvas(this.canvas);
    }
    if (this.infoDisplay) {
      this.infoDisplay.textContent = "";
    }
  }

  /**
   * Decodes image bytes and renders them in the canvas viewport.
   *
   * @param {Uint8Array} bytes
   * @returns {Promise<Result<ImageSize>>}
   */
  async draw(bytes) {
    if (!this.canvas) {
      return { ok: false, error: "Canvas element is absent in ImagePreview" };
    }
    const result = await canvas.drawBytesToCanvas(this.canvas, bytes);
    if (result.ok) {
      const { width, height } = result.value;
      if (this.infoDisplay) {
        this.infoDisplay.textContent = `${width} × ${height} px`;
      }
    }
    return result;
  }

  /**
   * Applies the CSS visual transformation scale to the internal canvas.
   *
   * @param {number} factor
   */
  setZoom(factor) {
    if (this.canvas) {
      this.canvas.style.transform = `scale(${factor})`;
    }
  }
}

customElements.define("image-preview", ImagePreview);
