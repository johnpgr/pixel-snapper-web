import { BaseElement } from "./base-element.ts";
import { ZoomControls } from "./zoom-controls.ts";
import { ImagePreview } from "./image-preview.ts";
import type { Result } from "../lib/result.ts";
import type { ImageSize } from "../lib/canvas.ts";
import { html, css } from "../lib/utils.ts";
import { t } from "../lib/i18n.ts";

export interface ImageViewportAttributeMap {
  type: "original" | "result";
}

/**
 * A viewport component that wraps zoom controls and an image preview.
 *
 * @tagName image-viewport
 * @attribute {"original"|"result"} type - The type of image displayed in the viewport.
 */
export class ImageViewport extends BaseElement<ImageViewportAttributeMap, HTMLElementEventMap> {
  static styles = css`
    image-viewport {
      display: grid;
      grid-template-rows: var(--toolbar-h) 1fr var(--footer-h);
      overflow: hidden;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
      transition: border-color var(--transition), box-shadow var(--transition);

      &:hover {
        border-color: color-mix(in oklch, var(--border) 80%, var(--accent));
      }
    }

    /* Toolbar */
    .viewport-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      border-bottom: 1px solid var(--border);
      background: var(--surface-subtle);

      .viewport-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text);
        letter-spacing: 0.01em;
      }
    }

    /* Viewport footer */
    .viewport-footer {
      display: flex;
      align-items: center;
      padding: 0 16px;
      border-top: 1px solid var(--border);
      background: var(--surface-subtle);

      .image-info {
        font-size: 0.72rem;
        font-variant-numeric: tabular-nums;
        color: var(--text-muted);
      }
    }
  `;

  public zoomControls!: ZoomControls;
  public preview!: ImagePreview;

  constructor() {
    super();
  }

  render(): string {
    const type = this.queryAttribute("type");
    const label = type === "original" ? t("labelOriginal") : t("labelResult");

    return html`
      <div class="viewport-toolbar">
        <span class="viewport-label" id="${type}-label">${label}</span>
        <zoom-controls data-i18n-aria-label="zoomControlsAriaLabel" aria-label="${t("zoomControlsAriaLabel")}"></zoom-controls>
      </div>

      <image-preview aria-labelledby="${type}-label" info-target="#${type}-info"></image-preview>

      <div class="viewport-footer">
        <span id="${type}-info" class="image-info"></span>
      </div>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.zoomControls = this.queryElement("zoom-controls", ZoomControls);
    this.preview = this.queryElement("image-preview", ImagePreview);

    this.zoomControls.addEventListener("zoomchange", (ev) => {
      this.applyZoom(ev.detail.zoom);
    });

    this.preview.addEventListener("wheel", (ev) => {
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


