/**
 * @fileoverview Custom element encapsulating drag-and-drop and file picking behavior.
 */

export class DropZone extends HTMLElement {
  constructor() {
    super();
    /** @type {HTMLInputElement | null} */
    this.input = null;
    /** @type {HTMLSpanElement | null} */
    this.label = null;
  }

  connectedCallback() {
    this.input = /** @type {HTMLInputElement | null} */ (this.querySelector('input[type="file"]'));
    this.label = /** @type {HTMLSpanElement | null} */ (this.querySelector('.drop-label'));

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
        this.dispatchEvent(new CustomEvent("file-select", { detail: { file } }));
      }
    });

    // File picker change event
    if (this.input) {
      this.input.addEventListener("change", () => {
        const file = this.input?.files?.[0];
        if (file) {
          this.dispatchEvent(new CustomEvent("file-select", { detail: { file } }));
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
      this.label.textContent = "Drop image here";
    }
    this.classList.remove("has-file");
    if (this.input) {
      this.input.value = "";
    }
  }
}

customElements.define("drop-zone", DropZone);
