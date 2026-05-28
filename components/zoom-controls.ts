import { BaseElement } from "./base-element.ts";
import * as Zoom from "../lib/zoom.ts";
import { html, css } from "../lib/utils.ts";
import { t } from "../lib/i18n.ts";

export interface ZoomControlsEventMap extends HTMLElementEventMap {
  zoomchange: CustomEvent<{ zoom: number }>;
}

export class ZoomControls extends BaseElement<{}, ZoomControlsEventMap> {
  static styles = css`
    zoom-controls {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .zoom-btn {
      width: 26px;
      height: 26px;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface-raised);
      color: var(--text);
      font-size: 1rem;
      line-height: 1;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background var(--transition), border-color var(--transition);
      outline: none;

      &:hover { background: var(--border); }
      &:focus-visible {
        border-color: var(--border-focus);
        box-shadow: 0 0 0 2px color-mix(in oklch, var(--accent) 25%, transparent);
      }

      &.zoom-reset { font-size: 0.75rem; }
    }

    .zoom-value {
      font-size: 0.75rem;
      font-variant-numeric: tabular-nums;
      color: var(--text-muted);
      min-width: 38px;
      text-align: center;
    }
  `;

  public btnOut!: HTMLButtonElement;
  public btnIn!: HTMLButtonElement;
  public btnReset!: HTMLButtonElement;
  public display!: HTMLSpanElement;
  public currentZoom: number = 1;

  constructor() {
    super();
  }

  render(): string {
    return html`
      <button class="zoom-btn zoom-out-btn" aria-label="${t("zoomOutBtnAriaLabel")}" title="${t("zoomOutBtnTitle")}">&minus;</button>
      <span class="zoom-value">100%</span>
      <button class="zoom-btn zoom-in-btn" aria-label="${t("zoomInBtnAriaLabel")}" title="${t("zoomInBtnTitle")}">+</button>
      <button class="zoom-btn zoom-reset-btn zoom-reset" aria-label="${t("zoomResetBtnAriaLabel")}" title="${t("zoomResetBtnTitle")}">⟳</button>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.btnOut = this.queryElement(".zoom-out-btn", HTMLButtonElement);
    this.btnIn = this.queryElement(".zoom-in-btn", HTMLButtonElement);
    this.btnReset = this.queryElement(".zoom-reset-btn", HTMLButtonElement);
    this.display = this.queryElement(".zoom-value", HTMLSpanElement);

    this.btnOut.addEventListener("click", this.stepOut.bind(this));
    this.btnIn.addEventListener("click", this.stepIn.bind(this));
    this.btnReset.addEventListener("click", this.reset.bind(this));
  }

  public updateDisplay(): void {
    this.display.textContent = `${Math.round(this.currentZoom * 100)}%`;
    this.emit("zoomchange", { zoom: this.currentZoom });
  }

  public stepIn(): void {
    this.currentZoom = Zoom.getNextStep(this.currentZoom);
    this.updateDisplay();
  }

  public stepOut(): void {
    this.currentZoom = Zoom.getPrevStep(this.currentZoom);
    this.updateDisplay();
  }

  public reset(): void {
    this.currentZoom = 1;
    this.updateDisplay();
  }

  public get value(): number {
    return this.currentZoom;
  }
}

customElements.define("zoom-controls", ZoomControls);


