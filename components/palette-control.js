import { BaseElement } from "./base-element.js";

/**
 * @typedef {HTMLElementEventMap & {
 *   "change": CustomEvent<{value: number}>;
 * }} PaletteControlEventMap
 */

/**
 * @extends {BaseElement<PaletteControlEventMap>}
 * @fires {CustomEvent<{value: number}>} change - Dispatched when the range color slider value updates.
 * 
 * @property {HTMLInputElement | null} input - Color count selection range slider input.
 * @property {HTMLSpanElement | null} display - Numeric color count text label display.
 * @property {number} value - The current color count value of the slider.
 */
export class PaletteControl extends BaseElement {
  constructor() {
    super();
    /**
     * Color count selection range slider input.
     * @type {HTMLInputElement | null}
     */
    this.input = null;
    /**
     * Numeric color count text label display.
     * @type {HTMLSpanElement | null}
     */
    this.display = null;
  }

  connectedCallback() {
    this.input = this.queryElement('input[type="range"]', HTMLInputElement);
    this.display = this.queryElement('.field-value', HTMLSpanElement);

    const input = this.input;

    if (input) {
      input.addEventListener("input", () => {
        if (this.display) {
          this.display.textContent = input.value;
        }
        this.emit("change", { value: this.value });
      });
    }
  }

  /**
   * Retrieves the current color selection from the range slider.
   *
   * @type {number}
   */
  get value() {
    return this.input ? parseInt(this.input.value, 10) : 16;
  }
}

customElements.define("palette-control", PaletteControl);
