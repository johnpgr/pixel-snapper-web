import { BaseElement } from "./base-element.ts";
import { html, css } from "../lib/utils.ts";
import { t } from "../lib/i18n.ts";

export interface PaletteControlEventMap extends HTMLElementEventMap {
  change: CustomEvent<{ value: number }>;
}

export class PaletteControl extends BaseElement<{}, PaletteControlEventMap> {
  static styles = css`
    palette-control {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 16px;

      &:last-child { margin-bottom: 0; }
    }

    .field-label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;

      .field-value {
        font-variant-numeric: tabular-nums;
        color: var(--accent);
        font-weight: 600;
      }
    }

    .field-hint {
      font-size: 0.7rem;
      color: var(--text-faint);
      line-height: 1.4;
    }

    /* Range slider */
    input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 4px;
      border-radius: 2px;
      background: var(--border);
      outline: none;
      cursor: pointer;

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--accent);
        border: 2px solid var(--surface);
        box-shadow: 0 0 0 1px var(--accent);
        transition: transform var(--transition), box-shadow var(--transition);
        cursor: grab;

        &:active { cursor: grabbing; transform: scale(1.15); }
      }

      &:focus-visible::-webkit-slider-thumb {
        box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 35%, transparent);
      }
    }
  `;

  public input!: HTMLInputElement;
  public display!: HTMLSpanElement;

  constructor() {
    super();
  }

  render(): string {
    return html`
      <label class="field-label" for="k-colors-input">
        <span>${t("paletteColorsLabel")}</span>
        <span class="field-value" id="k-colors-display">16</span>
      </label>
      <input
        id="k-colors-input"
        type="range"
        min="1"
        max="64"
        value="16"
        step="1"
        aria-describedby="k-colors-hint"
      />
      <span id="k-colors-hint" class="field-hint">${t("kColorsHint")}</span>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.input = this.queryElement('input[type="range"]', HTMLInputElement);
    this.display = this.queryElement('.field-value', HTMLSpanElement);

    this.input.addEventListener("input", () => {
      this.display.textContent = this.input.value;
      this.emit("change", { value: this.value });
    });
  }

  public get value(): number {
    return Number.parseInt(this.input.value, 10);
  }
}

customElements.define("palette-control", PaletteControl);


