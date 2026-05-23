/**
 * @fileoverview Custom element encapsulating processing status bar feedback.
 */

export class StatusBar extends HTMLElement {
  constructor() {
    super();
    /** @type {HTMLSpanElement | null} */
    this.textSpan = null;
  }

  connectedCallback() {
    this.textSpan = /** @type {HTMLSpanElement | null} */ (this.querySelector(".status-text"));
  }

  /**
   * Adjusts the visual status indicator state and updates the feedback label.
   *
   * @param {"idle" | "processing" | "done" | "error"} state
   * @param {string} message
   */
  setStatus(state, message) {
    this.dataset["state"] = state === "idle" ? "" : state;
    if (this.textSpan) {
      this.textSpan.textContent = message;
    }
  }
}

customElements.define("status-bar", StatusBar);
