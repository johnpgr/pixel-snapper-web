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
  }

  connectedCallback() {
    this.btnOut = this.queryElement("#zoom-out-btn", HTMLButtonElement);
    this.btnIn = this.queryElement("#zoom-in-btn", HTMLButtonElement);
    this.btnReset = this.queryElement("#zoom-reset-btn", HTMLButtonElement);
    this.display = this.queryElement(".zoom-value", HTMLSpanElement);

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
    this.emit("zoomchange", { zoom: factor });
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
   * @type {number}
   */
  get value() {
    return zoom.get();
  }
}

customElements.define("zoom-controls", ZoomControls);
