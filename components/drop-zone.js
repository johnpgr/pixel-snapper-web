import { BaseElement } from "./base-element.js";
import { t } from "../lib/i18n.js";

/**
 * @typedef {HTMLElementEventMap & {
 *   fileselect: CustomEvent<{file: File}>;
 * }} DropZoneEventMap
 */

/**
 * @extends {BaseElement<DropZoneEventMap>}
 * @fires {CustomEvent<{file: File}>} fileselect - Dispatched when an image file is dragged-and-dropped or selected.
 */
export class DropZone extends BaseElement {
  constructor() {
    super();
    /**
     * Hidden file picker input element.
     * @type {HTMLInputElement | null}
     */
    this.input = null;
    /**
     * Display label reporting status or filename.
     * @type {HTMLSpanElement | null}
     */
    this.label = null;
  }

  connectedCallback() {
    this.input = this.queryElement('input[type="file"]', HTMLInputElement);
    this.label = this.queryElement('.drop-label', HTMLSpanElement);

    // Delegate click on the drop zone to the hidden file input
    this.addEventListener("click", (e) => {
      if (this.input && e.target !== this.input) {
        this.input.click();
      }
    });

    // Drag-over styling hooks
    this.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.classList.add("drag-over");
    });

    this.addEventListener("dragleave", () => {
      this.classList.remove("drag-over");
    });

    this.addEventListener("drop", (e) => {
      e.preventDefault();
      this.classList.remove("drag-over");

      const file = e.dataTransfer?.files[0];
      if (file) {
        this.emit("fileselect", { file });
      }
    });

    // File picker change event
    if (this.input) {
      this.input.addEventListener("change", () => {
        const file = this.input?.files?.[0];
        if (file) {
          this.emit("fileselect", { file });
        }
      });
    }
  }

  /**
   * Updates the drop zone display text and visual class for a selected file.
   *
   * @param {File} file
   */
  setFile(file) {
    const truncatedName = file.name.length > 28 ? `…${file.name.slice(-26)}` : file.name;
    if (this.label) {
      this.label.textContent = truncatedName;
    }
    this.classList.add("has-file");
  }

  /**
   * Resets the drop zone to its initial empty state.
   */
  clear() {
    if (this.label) {
      this.label.textContent = t("dropLabel");
    }
    this.classList.remove("has-file");
    if (this.input) {
      this.input.value = "";
    }
  }
}

customElements.define("drop-zone", DropZone);
