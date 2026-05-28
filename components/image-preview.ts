import { BaseElement } from "./base-element.ts";
import { drawBytesToCanvas, clearCanvas } from "../lib/canvas.ts";
import type { ImageSize } from "../lib/canvas.ts";
import type { Result } from "../lib/result.ts";
import { html, css } from "../lib/utils.ts";
import { t } from "../lib/i18n.ts";
import { ImageViewport } from "./image-viewport.ts";

export interface ImagePreviewAttributes {
  "info-target": string;
  "aria-labelledby"?: string;
}

/**
 * A custom element that previews an image drawn on a canvas and updates a linked info element with its size.
 *
 * @tagName image-preview
 * @attribute {string} info-target - The selector/ID of the target element to display image dimensions.
 */
export class ImagePreview extends BaseElement<ImagePreviewAttributes, HTMLElementEventMap> {
  static styles = css`
    /* Canvas area */
    image-preview {
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      /* Checkerboard for transparent backgrounds */
      background-color: light-dark(#fff, #1a1a1a);
      background-image:
        conic-gradient(
          light-dark(#e8e8e8, #2a2a2a) 90deg,
          transparent 90deg 180deg,
          light-dark(#e8e8e8, #2a2a2a) 180deg 270deg,
          transparent 270deg
        );
      background-size: 16px 16px;
    }

    canvas {
      display: none;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
      max-width: none; /* zoom via transform, not CSS sizing */
      transform-origin: center center;
      transition: transform var(--transition);
    }

    image-preview:has(canvas:not([data-empty])) {
      canvas { display: block; }
      .canvas-empty-state { display: none; }
    }

    /* Empty state placeholder */
    .canvas-empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      color: var(--text-faint);
      text-align: center;
      padding: 32px;

      & svg {
        width: 48px;
        height: 48px;
        opacity: 0.5;
      }

      & p {
        font-size: 0.8125rem;
        color: var(--text-faint);
        max-width: 160px;
        line-height: 1.4;
      }
    }
  `;

  public canvas!: HTMLCanvasElement;
  public emptyState!: HTMLElement;
  public infoDisplay!: HTMLSpanElement;

  constructor() {
    super();
  }

  render(): string {
    const isOriginal = this.queryAttributeOrNull("aria-labelledby")?.includes("original") || 
                       this.queryClosestOrNull("image-viewport", ImageViewport)?.queryAttributeOrNull("type") === "original";

    const emptyText = isOriginal ? t("emptyOriginalText") : t("emptyResultText");
    const canvasAriaLabel = isOriginal ? t("canvasOriginalAriaLabel") : t("canvasResultAriaLabel");

    const svgContent = isOriginal ? html`
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 15l-5-5L5 21"/>
    ` : html`
      <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    `;

    return html`
      <div class="canvas-empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
          ${svgContent}
        </svg>
        <p>${emptyText}</p>
      </div>
      <canvas aria-label="${canvasAriaLabel}" class="${!isOriginal ? "pixelated" : ""}"></canvas>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.canvas = this.queryElement("canvas", HTMLCanvasElement);
    this.emptyState = this.queryElement(".canvas-empty-state", HTMLElement);

    const targetId = this.queryAttribute("info-target");
    this.infoDisplay = this.queryRootElement(targetId, HTMLSpanElement);

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


