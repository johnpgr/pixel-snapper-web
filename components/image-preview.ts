import { BaseElement } from "./base-element.ts";
import { drawBytesToCanvas, clearCanvas } from "../lib/canvas.ts";
import type { ImageSize } from "../lib/canvas.ts";
import type { Result } from "../lib/result.ts";
import { queryElement } from "../lib/utils.ts";

export interface ImagePreviewAttributes {
  "info-target": string;
}

/**
 * A custom element that previews an image drawn on a canvas and updates a linked info element with its size.
 *
 * @tagName image-preview
 * @attribute {string} info-target - The selector/ID of the target element to display image dimensions.
 */
export class ImagePreview extends BaseElement<ImagePreviewAttributes, HTMLElementEventMap> {
  public canvas!: HTMLCanvasElement;
  public emptyState!: HTMLElement;
  public infoDisplay!: HTMLSpanElement;

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.canvas = this.queryElement("canvas", HTMLCanvasElement);
    this.emptyState = this.queryElement(".canvas-empty-state", HTMLElement);

    const targetId = this.queryAttribute("info-target");
    this.infoDisplay = queryElement(targetId, HTMLSpanElement);

    this.canvas.dataset["empty"] = "";
  }

  public clear(): void {
    clearCanvas(this.canvas);
    this.infoDisplay.textContent = "";
  }

  public async draw(bytes: Uint8Array): Promise<Result<ImageSize>> {
    const result = await drawBytesToCanvas(this.canvas, bytes);
    if (result.ok) {
      const { width, height } = result.value;
      this.infoDisplay.textContent = `${width} × ${height} px`;
    }

    return result;
  }

  public setZoom(factor: number): void {
    this.canvas.style.transform = `scale(${factor})`;
  }
}

customElements.define("image-preview", ImagePreview);
