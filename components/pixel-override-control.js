/**
 * @fileoverview Custom element encapsulating pixel grid size override selection.
 */

export class PixelOverrideControl extends HTMLElement {
  constructor() {
    super();
    /** @type {HTMLInputElement | null} */
    this.autoCheckbox = null;
    /** @type {HTMLInputElement | null} */
    this.sizeInput = null;
  }

  connectedCallback() {
    const autoCheckbox = /** @type {HTMLInputElement | null} */ (this.querySelector('input[type="checkbox"]'));
    const sizeInput = /** @type {HTMLInputElement | null} */ (this.querySelector('input[type="number"]'));
    this.autoCheckbox = autoCheckbox;
    this.sizeInput = sizeInput;

    if (autoCheckbox && sizeInput) {
      autoCheckbox.addEventListener("change", () => {
        sizeInput.disabled = autoCheckbox.checked;
        if (autoCheckbox.checked) {
          sizeInput.value = "";
        }
        this.dispatchEvent(new CustomEvent("change"));
      });

      sizeInput.addEventListener("input", () => {
        this.dispatchEvent(new CustomEvent("change"));
      });
    }
  }

  /**
   * Returns the grid cell override value, or undefined if auto-detection is active.
   *
   * @returns {number | undefined}
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
