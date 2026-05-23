/**
 * @fileoverview Custom element coordinating all processing control inputs and actions.
 */

import { DropZone } from "./drop-zone.js";
import { PaletteControl } from "./palette-control.js";
import { PixelOverrideControl } from "./pixel-override-control.js";
import { StatusBar } from "./status-bar.js";

export class ControlsPanel extends HTMLElement {
  constructor() {
    super();
    /** @type {DropZone | null} */
    this.dropZone = null;
    /** @type {PaletteControl | null} */
    this.palette = null;
    /** @type {PixelOverrideControl | null} */
    this.pixelOverride = null;
    /** @type {StatusBar | null} */
    this.statusBar = null;
    /** @type {HTMLButtonElement | null} */
    this.processBtn = null;
    /** @type {HTMLButtonElement | null} */
    this.downloadBtn = null;
  }

  connectedCallback() {
    this.dropZone = /** @type {DropZone | null} */ (this.querySelector("drop-zone"));
    this.palette = /** @type {PaletteControl | null} */ (this.querySelector("palette-control"));
    this.pixelOverride = /** @type {PixelOverrideControl | null} */ (this.querySelector("pixel-override-control"));
    this.statusBar = /** @type {StatusBar | null} */ (this.querySelector("status-bar"));
    this.processBtn = /** @type {HTMLButtonElement | null} */ (this.querySelector("#process-btn"));
    this.downloadBtn = /** @type {HTMLButtonElement | null} */ (this.querySelector("#download-btn"));

    // Wire file selection
    if (this.dropZone) {
      this.dropZone.addEventListener("file-select", (ev) => {
        const file = /** @type {CustomEvent} */ (ev).detail.file;
        this.dispatchEvent(new CustomEvent("file-select", { detail: { file } }));
      });
    }

    // Wire process button click
    if (this.processBtn) {
      this.processBtn.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("process"));
      });
    }

    // Wire download button click
    if (this.downloadBtn) {
      this.downloadBtn.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("download"));
      });
    }
  }

  /**
   * Retrieves the current palette colors range value.
   *
   * @returns {number}
   */
  get kColors() {
    return this.palette ? this.palette.value : 16;
  }

  /**
   * Retrieves the current pixel size manual override value.
   *
   * @returns {number | undefined}
   */
  get pixelSizeOverride() {
    return this.pixelOverride ? this.pixelOverride.value : undefined;
  }

  /**
   * Adjusts the processing status visual feedback.
   *
   * @param {"idle" | "processing" | "done" | "error"} state
   * @param {string} message
   */
  setStatus(state, message) {
    if (this.statusBar) {
      this.statusBar.setStatus(state, message);
    }
  }

  /**
   * Disables or enables the main "Snap Pixels" execution button.
   *
   * @param {boolean} disabled
   */
  setProcessDisabled(disabled) {
    if (this.processBtn) {
      this.processBtn.disabled = disabled;
    }
  }

  /**
   * Disables or enables the "Download PNG" button.
   *
   * @param {boolean} disabled
   */
  setDownloadDisabled(disabled) {
    if (this.downloadBtn) {
      this.downloadBtn.disabled = disabled;
    }
  }

  /**
   * Resets the file selection back to empty.
   */
  clearDropZone() {
    if (this.dropZone) {
      this.dropZone.clear();
    }
  }
}

customElements.define("controls-panel", ControlsPanel);
