/**
 * @fileoverview Custom element encapsulating range slider color selection.
 */

export class PaletteControl extends HTMLElement {
  constructor() {
    super();
    /** @type {HTMLInputElement | null} */
    this.input = null;
    /** @type {HTMLSpanElement | null} */
    this.display = null;
  }

  connectedCallback() {
    const input = /** @type {HTMLInputElement | null} */ (this.querySelector('input[type="range"]'));
    const display = /** @type {HTMLSpanElement | null} */ (this.querySelector('.field-value'));
    this.input = input;
    this.display = display;

    if (input) {
      input.addEventListener("input", () => {
        if (display) {
          display.textContent = input.value;
        }
        this.dispatchEvent(new CustomEvent("change", {
          detail: { value: this.value }
        }));
      });
    }
  }

  /**
   * Retrieves the current color selection from the range slider.
   *
   * @returns {number}
   */
  get value() {
    return this.input ? parseInt(this.input.value, 10) : 16;
  }
}

customElements.define("palette-control", PaletteControl);
