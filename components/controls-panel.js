import { BaseElement } from "./base-element.js";
import { DropZone } from "./drop-zone.js";
import { PaletteControl } from "./palette-control.js";
import { PixelOverrideControl } from "./pixel-override-control.js";
import { StatusBar } from "./status-bar.js";

/**
 * @typedef {HTMLElementEventMap & {
 *   fileselect: CustomEvent<{file: File}>;
 *   process: CustomEvent;
 *   download: CustomEvent;
 * }} ControlsPanelEventMap
 */

/**
 * @extends {BaseElement<ControlsPanelEventMap>}
 * @fires {CustomEvent<{file: File}>} fileselect - Dispatched when a new image file is successfully selected.
 * @fires {CustomEvent} process - Dispatched when the user clicks the "Snap Pixels" action button.
 * @fires {CustomEvent} download - Dispatched when the user clicks the "Download PNG" action button.
 */
export class ControlsPanel extends BaseElement {
  constructor() {
    super();
    /**
     * Component managing image file drag-and-drop or selection inputs.
     * @type {DropZone | null}
     */
    this.dropZone = null;
    /**
     * Component managing palette color count selections.
     * @type {PaletteControl | null}
     */
    this.palette = null;
    /**
     * Component managing manual pixel grid size overrides.
     * @type {PixelOverrideControl | null}
     */
    this.pixelOverride = null;
    /**
     * Status bar sub-component showing processing feedback.
     * @type {StatusBar | null}
     */
    this.statusBar = null;
    /**
     * Action button to execute the grid snapping pipeline.
     * @type {HTMLButtonElement | null}
     */
    this.processBtn = null;
    /**
     * Action button to trigger snapped image PNG download.
     * @type {HTMLButtonElement | null}
     */
    this.downloadBtn = null;
  }

  connectedCallback() {
    this.dropZone = this.queryElement("drop-zone", DropZone);
    this.palette = this.queryElement("palette-control", PaletteControl);
    this.pixelOverride = this.queryElement("pixel-override-control", PixelOverrideControl);
    this.statusBar = this.queryElement("status-bar", StatusBar);
    this.processBtn = this.queryElement("#process-btn", HTMLButtonElement);
    this.downloadBtn = this.queryElement("#download-btn", HTMLButtonElement);

    // Wire file selection
    if (this.dropZone) {
      this.dropZone.addEventListener("fileselect", (ev) => {
        this.emit("fileselect", { file: ev.detail.file });
      });
    }

    // Wire process button click
    if (this.processBtn) {
      this.processBtn.addEventListener("click", () => {
        this.emit("process");
      });
    }

    // Wire download button click
    if (this.downloadBtn) {
      this.downloadBtn.addEventListener("click", () => {
        this.emit("download");
      });
    }
  }

  /**
   * Retrieves the current palette colors range value.
   *
   * @type {number}
   */
  get kColors() {
    return this.palette ? this.palette.value : 16;
  }

  /**
   * Retrieves the current pixel size manual override value.
   *
   * @type {number | undefined}
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
