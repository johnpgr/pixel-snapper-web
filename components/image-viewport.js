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
     * Viewport preview container displaying the image.
     * @type {ImagePreview | null}
     */
    this.preview = null;
  }

  connectedCallback() {
    this.zoomControls = this.queryElement("zoom-controls", ZoomControls);
    this.preview = this.queryElement("image-preview", ImagePreview);

    // Wire zoom change event to propagate transformation scaling onto the preview
    if (this.zoomControls) {
      this.zoomControls.addEventListener("zoomchange", (ev) => {
        this.applyZoom(ev.detail.zoom);
      });
    }

    // Wire mouse wheel zoom directly on the preview element
    if (this.preview) {
      this.preview.addEventListener("wheel", (/** @type {WheelEvent} */ ev) => {
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
   * Applies CSS transformations to scale the canvas.
   *
   * @param {number} factor
   */
  applyZoom(factor) {
    if (this.preview) {
      this.preview.setZoom(factor);
    }
  }

  /**
   * Clears the image viewport.
   */
  clear() {
    if (this.preview) {
      this.preview.clear();
    }
  }

  /**
   * Renders the image bytes on the preview.
   *
   * @param {Uint8Array} bytes
   * @returns {Promise<Result<ImageSize>>}
   */
  async draw(bytes) {
    if (this.preview) {
      return await this.preview.draw(bytes);
    }
    return { ok: false, error: "Preview viewport is absent." };
  }
}

customElements.define("image-viewport", ImageViewport);
