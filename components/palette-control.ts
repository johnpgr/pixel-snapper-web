import { BaseElement } from "./base-element.ts";

export interface PaletteControlEventMap extends HTMLElementEventMap {
  change: CustomEvent<{ value: number }>;
}

export class PaletteControl extends BaseElement<{}, PaletteControlEventMap> {
  public input!: HTMLInputElement;
  public display!: HTMLSpanElement;

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.input = this.queryElement('input[type="range"]', HTMLInputElement);
    this.display = this.queryElement('.field-value', HTMLSpanElement);

    this.input.addEventListener("input", () => {
      this.display.textContent = this.input.value;
      this.emit("change", { value: this.value });
    });
  }

  public get value(): number {
    return Number.parseInt(this.input.value, 10);
  }
}

customElements.define("palette-control", PaletteControl);
