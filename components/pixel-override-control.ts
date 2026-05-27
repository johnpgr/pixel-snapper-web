import { BaseElement } from "./base-element.ts";

export interface PixelOverrideControlEventMap extends HTMLElementEventMap {
  change: CustomEvent<void>;
}

export class PixelOverrideControl extends BaseElement<PixelOverrideControlEventMap> {
  public autoCheckbox!: HTMLInputElement;
  public sizeInput!: HTMLInputElement;

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.autoCheckbox = this.queryElement('input[type="checkbox"]', HTMLInputElement);
    this.sizeInput = this.queryElement('input[type="number"]', HTMLInputElement);

    this.autoCheckbox.addEventListener("change", () => {
      this.sizeInput.disabled = this.autoCheckbox.checked;
      if (this.autoCheckbox.checked) {
        this.sizeInput.value = "";
      }
      this.emit("change");
    });

    this.sizeInput.addEventListener("input", () => {
      this.emit("change");
    });
  }

  public get value(): number | null {
    const raw = this.sizeInput.value.trim();

    if (raw === "") {
      return null;
    }

    return Number.parseFloat(raw);
  }
}

customElements.define("pixel-override-control", PixelOverrideControl);
