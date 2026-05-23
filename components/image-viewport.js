/**
 * @fileoverview Custom element coordinating preview canvases and zoom transformations.
 */

import { ZoomControls } from "./zoom-controls.js";
import { ImagePreview } from "./image-preview.js";

export class ImageViewport extends HTMLElement {
  constructor() {
    super();
    /** @type {ZoomControls | null} */
    this.zoomControls = null;
    /** @type {ImagePreview | null} */
    this.originalPreview = null;
    /** @type {ImagePreview | null} */
    this.resultPreview = null;
    /** @type {HTMLElement | null} */
    this.canvasesContainer = null;
  }

  connectedCallback() {
    this.zoomControls = /** @type {ZoomControls | null} */ (this.querySelector("zoom-controls"));
    this.originalPreview = /** @type {ImagePreview | null} */ (this.querySelector('image-preview[type="original"]'));
    this.resultPreview = /** @type {ImagePreview | null} */ (this.querySelector('image-preview[type="result"]'));
    this.canvasesContainer = /** @type {HTMLElement | null} */ (this.querySelector("#canvases-container"));

    // Wire zoom change event to propagate transformation scaling onto both previews
    if (this.zoomControls) {
      this.zoomControls.addEventListener("zoom-change", (ev) => {
        const factor = /** @type {CustomEvent} */ (ev).detail.zoom;
        this.applyZoom(factor);
      });
    }

    // Wire mouse wheel zoom
    if (this.canvasesContainer) {
      this.canvasesContainer.addEventListener("wheel", (ev) => {
        const e = /** @type {WheelEvent} */ (ev);
        if (!e.ctrlKey && !e.metaKey) return;
        e.preventDefault();

        if (this.zoomControls) {
          if (e.deltaY < 0) {
            this.zoomControls.stepIn();
          } else {
            this.zoomControls.stepOut();
          }
        }
      }, { passive: false });
    }
  }

  /**
   * Applies CSS transformations to scale both canvases.
   *
   * @param {number} factor
   */
  applyZoom(factor) {
    if (this.originalPreview) {
      this.originalPreview.setZoom(factor);
    }
    if (this.resultPreview) {
      this.resultPreview.setZoom(factor);
    }
  }

  /**
   * Clears both image viewports.
   */
  clear() {
    if (this.originalPreview) {
      this.originalPreview.clear();
    }
    if (this.resultPreview) {
      this.resultPreview.clear();
    }
  }

  /**
   * Renders the original source image bytes on the first preview.
   *
   * @param {Uint8Array} bytes
   * @returns {Promise<Result<ImageSize>>}
   */
  async drawOriginal(bytes) {
    if (this.originalPreview) {
      return await this.originalPreview.draw(bytes);
    }
    return { ok: false, error: "Original preview viewport is absent." };
  }

  /**
   * Renders the snaps-aligned processed image bytes on the second preview.
   *
   * @param {Uint8Array} bytes
   * @returns {Promise<Result<ImageSize>>}
   */
  async drawResult(bytes) {
    if (this.resultPreview) {
      return await this.resultPreview.draw(bytes);
    }
    return { ok: false, error: "Result preview viewport is absent." };
  }
}

customElements.define("image-viewport", ImageViewport);
