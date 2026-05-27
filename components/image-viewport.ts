import { BaseElement } from "./base-element.ts";
import { ZoomControls } from "./zoom-controls.ts";
import { ImagePreview } from "./image-preview.ts";
import type { Result } from "../lib/result.ts";
import type { ImageSize } from "../lib/canvas.ts";

export interface ImageViewportAttributeMap {
  type: "original" | "result";
}

/**
 * A viewport component that wraps zoom controls and an image preview.
 *
 * @tagName image-viewport
 * @attribute {"original"|"result"} type - The type of image displayed in the viewport.
 */
export class ImageViewport extends BaseElement<HTMLElementEventMap, ImageViewportAttributeMap> {
  public zoomControls!: ZoomControls;
  public preview!: ImagePreview;

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.zoomControls = this.queryElement("zoom-controls", ZoomControls);
    this.preview = this.queryElement("image-preview", ImagePreview);

    this.zoomControls.addEventListener("zoomchange", (ev) => {
      this.applyZoom(ev.detail.zoom);
    });

    this.preview.addEventListener("wheel", (ev: WheelEvent) => {
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

  public applyZoom(factor: number): void {
    this.preview.setZoom(factor);
  }

  public clear(): void {
    this.preview.clear();
  }

  public async draw(bytes: Uint8Array): Promise<Result<ImageSize>> {
    return await this.preview.draw(bytes);
  }
}

customElements.define("image-viewport", ImageViewport);

declare global {
  interface HTMLElementTagNameMap {
    "image-viewport": ImageViewport;
  }
}
