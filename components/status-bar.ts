import { BaseElement } from "./base-element.ts";

export type StatusBarState = typeof StatusBarState[keyof typeof StatusBarState];
export const StatusBarState = {
  Idle: "Idle",
  Processing: "Processing",
  Done: "Done",
  Error: "Error",
} as const

export class StatusBar extends BaseElement {
  public textSpan: HTMLSpanElement | null = null;

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.textSpan = this.queryElement(".status-text", HTMLSpanElement);
  }

  public setStatus(state: StatusBarState, message: string): void {
    this.dataset["state"] = state === StatusBarState.Idle ? "" : state;
    if (this.textSpan) {
      this.textSpan.textContent = message;
    }
  }
}

customElements.define("status-bar", StatusBar);
