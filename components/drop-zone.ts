import { BaseElement } from "./base-element.ts";
import { t } from "../lib/i18n.ts";

export interface DropZoneEventMap extends HTMLElementEventMap {
  fileselect: CustomEvent<{ file: File }>;
}

export class DropZone extends BaseElement<{}, DropZoneEventMap> {
  public input!: HTMLInputElement;
  public label!: HTMLSpanElement;

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.input = this.queryElement('input[type="file"]', HTMLInputElement);
    this.label = this.queryElement('.drop-label', HTMLSpanElement);

    // Delegate click on the drop zone to the hidden file input
    this.addEventListener("click", (e: Event) => {
      if (e.target !== this.input) {
        this.input.click();
      }
    });

    // Drag-over styling hooks
    this.addEventListener("dragover", (e: DragEvent) => {
      e.preventDefault();
      this.classList.add("drag-over");
    });

    this.addEventListener("dragleave", () => {
      this.classList.remove("drag-over");
    });

    this.addEventListener("drop", (e: DragEvent) => {
      e.preventDefault();
      this.classList.remove("drag-over");

      const file = e.dataTransfer?.files[0];
      if (file) {
        this.emit("fileselect", { file });
      }
    });

    // File picker change event
    this.input.addEventListener("change", () => {
      const file = this.input.files?.[0];
      if (file) {
        this.emit("fileselect", { file });
      }
    });
  }

  public setFile(file: File): void {
    const truncatedName = file.name.length > 28 ? `…${file.name.slice(-26)}` : file.name;
    this.label.textContent = truncatedName;
    this.classList.add("has-file");
  }

  public clear(): void {
    this.label.textContent = t("dropLabel");
    this.classList.remove("has-file");
    this.input.value = "";
  }
}

customElements.define("drop-zone", DropZone);
