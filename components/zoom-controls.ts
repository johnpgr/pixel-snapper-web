import { BaseElement } from "./base-element.ts";
import * as Zoom from "../lib/zoom.ts";

export interface ZoomControlsEventMap extends HTMLElementEventMap {
  zoomchange: CustomEvent<{ zoom: number }>;
}

export class ZoomControls extends BaseElement<{}, ZoomControlsEventMap> {
  public btnOut!: HTMLButtonElement;
  public btnIn!: HTMLButtonElement;
  public btnReset!: HTMLButtonElement;
  public display!: HTMLSpanElement;
  public currentZoom: number = 1;

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.btnOut = this.queryElement(".zoom-out-btn", HTMLButtonElement);
    this.btnIn = this.queryElement(".zoom-in-btn", HTMLButtonElement);
    this.btnReset = this.queryElement(".zoom-reset-btn", HTMLButtonElement);
    this.display = this.queryElement(".zoom-value", HTMLSpanElement);

    this.btnOut.addEventListener("click", this.stepOut.bind(this));

    this.btnIn.addEventListener("click", this.stepIn.bind(this));

    this.btnReset.addEventListener("click", this.reset.bind(this));
  }

  public updateDisplay(): void {
    this.display.textContent = `${Math.round(this.currentZoom * 100)}%`;
    this.emit("zoomchange", { zoom: this.currentZoom });
  }

  public stepIn(): void {
    this.currentZoom = Zoom.getNextStep(this.currentZoom);
    this.updateDisplay();
  }

  public stepOut(): void {
    this.currentZoom = Zoom.getPrevStep(this.currentZoom);
    this.updateDisplay();
  }

  public reset(): void {
    this.currentZoom = 1;
    this.updateDisplay();
  }

  public get value(): number {
    return this.currentZoom;
  }
}

customElements.define("zoom-controls", ZoomControls);
