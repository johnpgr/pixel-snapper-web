import { BaseElement } from "./base-element.js";

/**
 * @typedef {HTMLElementEventMap & {
 *   "change": CustomEvent<{value: number}>;
 * }} PaletteControlEventMap
 */

/**
 * @extends {BaseElement<PaletteControlEventMap>}
 * @fires {CustomEvent<{value: number}>} change - Dispatched when the range color slider value updates.
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
    const input = this.queryElement('input[type="range"]', HTMLInputElement);
    const display = this.queryElement('.field-value', HTMLSpanElement);
    this.input = input;
    this.display = display;

    if (input) {
      input.addEventListener("input", () => {
        if (display) {
          display.textContent = input.value;
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
