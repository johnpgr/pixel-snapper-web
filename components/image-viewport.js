import { BaseElement } from "./base-element.js";
import { ZoomControls } from "./zoom-controls.js";
import { ImagePreview } from "./image-preview.js";

export class ImageViewport extends BaseElement {
  constructor() {
    super();
    /**
     * Component managing discrete canvas preview zoom buttons.
     * @type {ZoomControls | null}
     */
    this.zoomControls = null;
    /**
     * Viewport preview container displaying the original source image.
     * @type {ImagePreview | null}
     */
    this.originalPreview = null;
    /**
     * Viewport preview container displaying the processed, quantized image.
     * @type {ImagePreview | null}
     */
    this.resultPreview = null;
    /**
     * Nested canvases wrapper element.
     * @type {HTMLElement | null}
     */
    this.canvasesContainer = null;
  }

  connectedCallback() {
    this.zoomControls = this.queryElement("zoom-controls", ZoomControls);
    this.originalPreview = this.queryElement('image-preview[type="original"]', ImagePreview);
    this.resultPreview = this.queryElement('image-preview[type="result"]', ImagePreview);
    this.canvasesContainer = this.queryElement("#canvases-container", HTMLElement);

    // Wire zoom change event to propagate transformation scaling onto both previews
    if (this.zoomControls) {
      this.zoomControls.addEventListener("zoomchange", (ev) => {
        this.applyZoom(ev.detail.zoom);
      });
    }

    // Wire mouse wheel zoom
    if (this.canvasesContainer) {
      this.canvasesContainer.addEventListener("wheel", (/** @type {WheelEvent} */ ev) => {
        if (!ev.ctrlKey && !ev.metaKey) return;
        ev.preventDefault();

        if (this.zoomControls) {
          if (ev.deltaY < 0) {
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
