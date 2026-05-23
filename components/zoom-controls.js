/**
 * @fileoverview Custom element encapsulating canvas preview zoom interactions.
 */

import * as zoom from "../lib/zoom.js";

export class ZoomControls extends HTMLElement {
  constructor() {
    super();
    /** @type {HTMLButtonElement | null} */
    this.btnOut = null;
    /** @type {HTMLButtonElement | null} */
    this.btnIn = null;
    /** @type {HTMLButtonElement | null} */
    this.btnReset = null;
    /** @type {HTMLSpanElement | null} */
    this.display = null;
  }

  connectedCallback() {
    this.btnOut = /** @type {HTMLButtonElement | null} */ (this.querySelector("#zoom-out-btn"));
    this.btnIn = /** @type {HTMLButtonElement | null} */ (this.querySelector("#zoom-in-btn"));
    this.btnReset = /** @type {HTMLButtonElement | null} */ (this.querySelector("#zoom-reset-btn"));
    this.display = /** @type {HTMLSpanElement | null} */ (this.querySelector(".zoom-value"));

    if (this.btnOut) {
      this.btnOut.addEventListener("click", () => {
        zoom.stepOut();
        this.updateDisplay();
      });
    }

    if (this.btnIn) {
      this.btnIn.addEventListener("click", () => {
        zoom.stepIn();
        this.updateDisplay();
      });
    }

    if (this.btnReset) {
      this.btnReset.addEventListener("click", () => {
        zoom.reset();
        this.updateDisplay();
      });
    }
  }

  /**
   * Refreshes the percentage status label and dispatches a zoom change event.
   */
  updateDisplay() {
    const factor = zoom.get();
    if (this.display) {
      this.display.textContent = `${Math.round(factor * 100)}%`;
    }
    this.dispatchEvent(new CustomEvent("zoom-change", {
      detail: { zoom: factor }
    }));
  }

  /**
   * Steps the zoom level up.
   */
  stepIn() {
    zoom.stepIn();
    this.updateDisplay();
  }

  /**
   * Steps the zoom level down.
   */
  stepOut() {
    zoom.stepOut();
    this.updateDisplay();
  }

  /**
   * Resets the zoom level to 100%.
   */
  reset() {
    zoom.reset();
    this.updateDisplay();
  }

  /**
   * Returns the current zoom level.
   *
   * @returns {number}
   */
  get value() {
    return zoom.get();
  }
}

customElements.define("zoom-controls", ZoomControls);
