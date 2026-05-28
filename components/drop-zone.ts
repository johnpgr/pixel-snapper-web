import { BaseElement } from "./base-element.ts";
import { t } from "../lib/i18n.ts";
import { html, css } from "../lib/utils.ts";

export interface DropZoneEventMap extends HTMLElementEventMap {
  fileselect: CustomEvent<{ file: File }>;
}

export class DropZone extends BaseElement<{}, DropZoneEventMap> {
  static styles = css`
    /* ─────────────────────────────────────────────────────────────────────────
       Drop zone
       ───────────────────────────────────────────────────────────────────────── */
    drop-zone {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 24px 16px;
      border: 1.5px dashed var(--border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: background var(--transition), border-color var(--transition);
      text-align: center;

      & input[type="file"] { display: none; }

      .drop-icon {
        width: 28px;
        height: 28px;
        color: var(--text-faint);
        transition: color var(--transition);
      }

      .drop-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-muted);
      }

      .drop-hint {
        font-size: 0.75rem;
        color: var(--text-faint);
      }

      &:hover,
      &:has(input:focus-visible) {
        background: var(--accent-light);
        border-color: var(--accent);

        .drop-icon { color: var(--accent); }
        .drop-label { color: var(--accent); }
      }

      &.drag-over {
        background: var(--accent-light);
        border-color: var(--accent);
        border-style: solid;

        .drop-icon { color: var(--accent); }
        .drop-label { color: var(--accent); }
      }

      &.has-file {
        border-style: solid;
        border-color: var(--accent);
        background: var(--accent-light);

        .drop-label { color: var(--accent); }
        .drop-icon { color: var(--accent); }
      }
    }
  `;

  public input!: HTMLInputElement;
  public label!: HTMLSpanElement;

  constructor() {
    super();
  }

  render(): string {
    return html`
      <svg class="drop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
      <span id="drop-label" class="drop-label">${t("dropLabel")}</span>
      <span id="drop-hint" class="drop-hint">${t("dropHint")}</span>
      <input id="file-input" type="file" accept="image/png,image/jpeg,image/jpg" aria-label="${t("fileInputAriaLabel")}" />
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();

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


