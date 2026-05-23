import { BaseElement } from "./base-element.js";
import * as zoom from "../lib/zoom.js";

/**
 * @typedef {HTMLElementEventMap & {
 *   zoomchange: CustomEvent<{zoom: number}>;
 * }} ZoomControlsEventMap
 */

/**
 * @extends {BaseElement<ZoomControlsEventMap>}
 * @fires {CustomEvent<{zoom: number}>} zoomchange - Dispatched when the zoom level is adjusted.
 */
export class ZoomControls extends BaseElement {
  constructor() {
    super();
    /**
     * Button to step zoom down.
     * @type {HTMLButtonElement | null}
     */
    this.btnOut = null;
    /**
     * Button to step zoom up.
     * @type {HTMLButtonElement | null}
     */
    this.btnIn = null;
    /**
     * Button to reset zoom to 100%.
     * @type {HTMLButtonElement | null}
     */
    this.btnReset = null;
    /**
     * Numeric text label showing current zoom percentage.
     * @type {HTMLSpanElement | null}
     */
    this.display = null;
    /**
     * Current zoom factor (1 = 100%).
     * @type {number}
     */
    this.currentZoom = 1;
  }

  connectedCallback() {
    this.btnOut = this.queryElement(".zoom-out-btn", HTMLButtonElement);
    this.btnIn = this.queryElement(".zoom-in-btn", HTMLButtonElement);
    this.btnReset = this.queryElement(".zoom-reset-btn", HTMLButtonElement);
    this.display = this.queryElement(".zoom-value", HTMLSpanElement);

    if (this.btnOut) {
      this.btnOut.addEventListener("click", () => {
        this.stepOut();
      });
    }

    if (this.btnIn) {
      this.btnIn.addEventListener("click", () => {
        this.stepIn();
      });
    }

    if (this.btnReset) {
      this.btnReset.addEventListener("click", () => {
        this.reset();
      });
    }
  }

  /**
   * Refreshes the percentage status label and dispatches a zoom change event.
   */
  updateDisplay() {
    if (this.display) {
      this.display.textContent = `${Math.round(this.currentZoom * 100)}%`;
    }
    this.emit("zoomchange", { zoom: this.currentZoom });
  }

  /**
   * Steps the zoom level up.
   */
  stepIn() {
    this.currentZoom = zoom.getNextStep(this.currentZoom);
    this.updateDisplay();
  }

  /**
   * Steps the zoom level down.
   */
  stepOut() {
    this.currentZoom = zoom.getPrevStep(this.currentZoom);
    this.updateDisplay();
  }

  /**
   * Resets the zoom level to 100%.
   */
  reset() {
    this.currentZoom = 1;
    this.updateDisplay();
  }

  /**
   * Returns the current zoom level.
   *
   * @type {number}
   */
  get value() {
    return this.currentZoom;
  }
}

customElements.define("zoom-controls", ZoomControls);
