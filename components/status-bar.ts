import { BaseElement } from "./base-element.ts";
import { html, css } from "../lib/utils.ts";
import { t } from "../lib/i18n.ts";

export type StatusBarState = typeof StatusBarState[keyof typeof StatusBarState];
export const StatusBarState = {
  Idle: "Idle",
  Processing: "Processing",
  Done: "Done",
  Error: "Error",
} as const;

export class StatusBar extends BaseElement {
  static styles = css`
    /* ─────────────────────────────────────────────────────────────────────────
       Status bar
       ───────────────────────────────────────────────────────────────────────── */
    status-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: var(--surface-subtle);
      border-radius: var(--radius-md);
      margin-top: auto;
    }

    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--text-faint);
      flex-shrink: 0;
      transition: background var(--transition);
    }

    .status-text {
      font-size: 0.78rem;
      color: var(--text-muted);
    }

    status-bar[data-state="processing"] {
      .status-dot {
        background: var(--accent);
        animation: pulse-dot 1.2s ease-in-out infinite;
      }
      .status-text { color: var(--accent); }
    }

    status-bar[data-state="done"] {
      .status-dot { background: var(--success); }
      .status-text { color: var(--success); }
    }

    status-bar[data-state="error"] {
      .status-dot { background: var(--error); }
      .status-text { color: var(--error); }
    }

    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.4; transform: scale(0.7); }
    }
  `;

  public textSpan: HTMLSpanElement | null = null;

  constructor() {
    super();
  }

  render(): string {
    return html`
      <span class="status-dot"></span>
      <span id="status-text" class="status-text">${t("statusReady")}</span>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
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


