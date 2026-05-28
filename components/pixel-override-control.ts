import { BaseElement } from "./base-element.ts";
import { html, css } from "../lib/utils.ts";
import { t } from "../lib/i18n.ts";

export interface PixelOverrideControlEventMap extends HTMLElementEventMap {
  change: CustomEvent<void>;
}

export class PixelOverrideControl extends BaseElement<{}, PixelOverrideControlEventMap> {
  static styles = css`
    pixel-override-control {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 16px;

      &:last-child { margin-bottom: 0; }
    }

    .field-label-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
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

    /* Number input */
    input[type="number"] {
      width: 100%;
      padding: 7px 10px;
      background: var(--surface-subtle);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text);
      font: inherit;
      font-size: 0.875rem;
      outline: none;
      transition: border-color var(--transition), box-shadow var(--transition);
      -moz-appearance: textfield;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button { -webkit-appearance: none; }

      &:focus-visible {
        border-color: var(--border-focus);
        box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 20%, transparent);
      }

      &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
    }

    /* ─────────────────────────────────────────────────────────────────────────
       Toggle switch
       ───────────────────────────────────────────────────────────────────────── */
    .toggle-label {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      user-select: none;

      & input[type="checkbox"] { position: absolute; opacity: 0; width: 0; height: 0; }

      .toggle-track {
        position: relative;
        width: 32px;
        height: 18px;
        border-radius: 9px;
        background: var(--border);
        transition: background var(--transition);
        flex-shrink: 0;

        .toggle-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 1px 3px rgba(0,0,0,.3);
          transition: transform var(--transition);
        }
      }

      .toggle-text {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--text-muted);
      }

      &:has(input:checked) {
        .toggle-track { background: var(--accent); }
        .toggle-thumb { transform: translateX(14px); }
        .toggle-text { color: var(--accent); }
      }

      &:has(input:focus-visible) .toggle-track {
        box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 30%, transparent);
      }
    }
  `;

  public autoCheckbox!: HTMLInputElement;
  public sizeInput!: HTMLInputElement;

  constructor() {
    super();
  }

  render(): string {
    return html`
      <div class="field-label-row">
        <label class="field-label" for="pixel-size-input">${t("pixelSizeOverrideLabel")}</label>
        <label class="toggle-label" for="pixel-size-auto">
          <input id="pixel-size-auto" type="checkbox" checked aria-label="${t("pixelSizeAutoAriaLabel")}" />
          <span class="toggle-track"><span class="toggle-thumb"></span></span>
          <span class="toggle-text">${t("pixelSizeAutoLabel")}</span>
        </label>
      </div>
      <input
        id="pixel-size-input"
        type="number"
        min="1"
        max="512"
        step="1"
        placeholder="${t("pixelSizePlaceholder")}"
        disabled
        aria-describedby="pixel-size-hint"
        aria-label="${t("pixelSizeAriaLabel")}"
      />
      <span id="pixel-size-hint" class="field-hint">${t("pixelSizeHint")}</span>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.autoCheckbox = this.queryElement('input[type="checkbox"]', HTMLInputElement);
    this.sizeInput = this.queryElement('input[type="number"]', HTMLInputElement);

    this.autoCheckbox.addEventListener("change", () => {
      this.sizeInput.disabled = this.autoCheckbox.checked;
      if (this.autoCheckbox.checked) {
        this.sizeInput.value = "";
      }
      this.emit("change");
    });

    this.sizeInput.addEventListener("input", this.emit.bind(this, "change"));
  }

  public get value(): number | null {
    const raw = this.sizeInput.value.trim();

    if (raw === "") {
      return null;
    }

    return Number.parseFloat(raw);
  }
}

customElements.define("pixel-override-control", PixelOverrideControl);


