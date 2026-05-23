import { BaseElement } from "./base-element.js";
import * as canvas from "../lib/canvas.js";

export class ImagePreview extends BaseElement {
  constructor() {
    super();
    /**
     * Inner HTML canvas element.
     * @type {HTMLCanvasElement | null}
     */
    this.canvas = null;
    /**
     * Viewport empty placeholder element.
     * @type {HTMLElement | null}
     */
    this.emptyState = null;
    /**
     * Target span display for image dimension details.
     * @type {HTMLSpanElement | null}
     */
    this.infoDisplay = null;
  }

  connectedCallback() {
    this.canvas = this.queryElement("canvas", HTMLCanvasElement);
    this.emptyState = this.queryElement(".canvas-empty-state", HTMLElement);

    const targetId = this.getAttribute("info-target");
    if (targetId) {
      this.infoDisplay = this.queryDocumentElement(targetId, HTMLSpanElement);
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
