import { BaseElement } from "./base-element.js";

export class StatusBar extends BaseElement {
  constructor() {
    super();
    /**
     * Dynamic text span reporting status feedback messages.
     * @type {HTMLSpanElement | null}
     */
    this.textSpan = null;
  }

  connectedCallback() {
    this.textSpan = this.queryElement(".status-text", HTMLSpanElement);
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
