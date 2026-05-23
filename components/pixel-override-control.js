import { BaseElement } from "./base-element.js";

/**
 * @typedef {HTMLElementEventMap & {
 *   "change": CustomEvent;
 * }} PixelOverrideControlEventMap
 */

/**
 * @extends {BaseElement<PixelOverrideControlEventMap>}
 * @fires {CustomEvent} change - Dispatched when the manual override option triggers or changes.
 */
export class PixelOverrideControl extends BaseElement {
  constructor() {
    super();
    /**
     * Checkbox to toggle auto-detection mode.
     * @type {HTMLInputElement | null}
     */
    this.autoCheckbox = null;
    /**
     * Numerical input to force manual grid size override.
     * @type {HTMLInputElement | null}
     */
    this.sizeInput = null;
  }

  connectedCallback() {
    const autoCheckbox = this.queryElement('input[type="checkbox"]', HTMLInputElement);
    const sizeInput = this.queryElement('input[type="number"]', HTMLInputElement);
    this.autoCheckbox = autoCheckbox;
    this.sizeInput = sizeInput;

    if (autoCheckbox && sizeInput) {
      autoCheckbox.addEventListener("change", () => {
        sizeInput.disabled = autoCheckbox.checked;
        if (autoCheckbox.checked) {
          sizeInput.value = "";
        }
        this.emit("change");
      });

      sizeInput.addEventListener("input", () => {
        this.emit("change");
      });
    }
  }

  /**
   * Returns the grid cell override value, or undefined if auto-detection is active.
   *
   * @type {number | undefined}
   */
  get value() {
    if (!this.autoCheckbox || this.autoCheckbox.checked) {
      return undefined;
    }
    if (!this.sizeInput) {
      return undefined;
    }
    const raw = this.sizeInput.value.trim();
    if (raw === "") {
      return undefined;
    }
    return parseFloat(raw);
  }
}

customElements.define("pixel-override-control", PixelOverrideControl);
