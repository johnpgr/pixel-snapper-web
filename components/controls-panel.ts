import { BaseElement } from "./base-element.ts";
import { DropZone } from "./drop-zone.ts";
import { PaletteControl } from "./palette-control.ts";
import { PixelOverrideControl } from "./pixel-override-control.ts";
import { StatusBar, type StatusBarState } from "./status-bar.ts";
import { LogsPanel } from "./logs-panel.ts";
import type { SnapperStats } from "../lib/wasm.ts";
import { html, css } from "../lib/utils.ts";
import { t } from "../lib/i18n.ts";

export interface ControlsPanelEventMap extends HTMLElementEventMap {
  fileselect: CustomEvent<{ file: File }>;
  process: CustomEvent<void>;
  download: CustomEvent<void>;
}

export class ControlsPanel extends BaseElement<{}, ControlsPanelEventMap> {
  static styles = css`
    /* ─────────────────────────────────────────────────────────────────────────
       Controls panel
       ───────────────────────────────────────────────────────────────────────── */
    controls-panel {
      display: flex;
      flex-direction: column;
      gap: 0;
      background: var(--surface);
      border-right: 1px solid var(--border);
      overflow-y: auto;
      padding: 20px 16px;

      .control-section {
        padding-bottom: 20px;
        margin-bottom: 20px;
        border-bottom: 1px solid var(--border);

        &:last-of-type {
          border-bottom: none;
          margin-bottom: 0;
        }
      }

      .section-heading {
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--text-muted);
        margin-bottom: 12px;
      }
    }

    /* ─────────────────────────────────────────────────────────────────────────
       Buttons
       ───────────────────────────────────────────────────────────────────────── */
    .actions-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      width: 100%;
      padding: 9px 16px;
      border: none;
      border-radius: var(--radius-md);
      font: inherit;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: background var(--transition), color var(--transition),
                  box-shadow var(--transition), transform var(--transition);
      outline: none;

      .btn-icon {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }

      &:focus-visible {
        box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 35%, transparent);
      }

      &:disabled {
        opacity: 0.42;
        cursor: not-allowed;
        transform: none !important;
      }

      &:not(:disabled):active { transform: scale(0.98); }
    }

    .btn-primary {
      background: var(--accent);
      color: white;

      &:not(:disabled):hover {
        background: var(--accent-hover);
        box-shadow: 0 4px 14px color-mix(in oklch, var(--accent) 40%, transparent);
      }
      &:not(:disabled):active { background: var(--accent-active); }
    }

    .btn-secondary {
      background: var(--surface-subtle);
      color: var(--text);
      border: 1px solid var(--border);

      &:not(:disabled):hover {
        background: var(--border);
      }
    }

    /* Dim controls while processing */
    controls-panel[data-state="processing"] {
      .control-section { opacity: 0.6; pointer-events: none; }
      .actions-section { opacity: 1; pointer-events: auto; }
      #process-btn { cursor: wait; }
    }
  `;

  public dropZone!: DropZone;
  public palette!: PaletteControl;
  public pixelOverride!: PixelOverrideControl;
  public statusBar!: StatusBar;
  public processBtn!: HTMLButtonElement;
  public downloadBtn!: HTMLButtonElement;
  public logsPanel!: LogsPanel;

  constructor() {
    super();
  }

  render(): string {
    return html`
      <section class="control-section" aria-labelledby="upload-heading">
        <h2 id="upload-heading" class="section-heading">${t("sectionHeadingImage")}</h2>
        <drop-zone aria-describedby="drop-hint"></drop-zone>
      </section>

      <section class="control-section" aria-labelledby="params-heading">
        <h2 id="params-heading" class="section-heading">${t("sectionHeadingParams")}</h2>
        <palette-control></palette-control>
        <pixel-override-control></pixel-override-control>
      </section>

      <section class="control-section actions-section">
        <button id="process-btn" class="btn btn-primary" disabled aria-describedby="process-status">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          <span>${t("snapBtn")}</span>
        </button>

        <button id="download-btn" class="btn btn-secondary" disabled aria-label="${t("downloadBtnAriaLabel")}">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span>${t("downloadBtn")}</span>
        </button>
      </section>

      <logs-panel class="control-section logs-section" aria-labelledby="logs-heading"></logs-panel>

      <status-bar id="process-status" role="status" aria-live="polite"></status-bar>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.dropZone = this.queryElement("drop-zone", DropZone);
    this.palette = this.queryElement("palette-control", PaletteControl);
    this.pixelOverride = this.queryElement("pixel-override-control", PixelOverrideControl);
    this.statusBar = this.queryElement("status-bar", StatusBar);
    this.processBtn = this.queryElement("#process-btn", HTMLButtonElement);
    this.downloadBtn = this.queryElement("#download-btn", HTMLButtonElement);
    this.logsPanel = this.queryElement("logs-panel", LogsPanel);

    this.dropZone.addEventListener("fileselect", (ev) => {
      this.emit("fileselect", { file: ev.detail.file });
    });

    this.processBtn.addEventListener("click", this.emit.bind(this, "process"));
    this.downloadBtn.addEventListener("click", this.emit.bind(this, "download"));
  }

  public get kColors(): number {
    return this.palette ? this.palette.value : 16;
  }

  public get pixelSizeOverride(): number | null {
    return this.pixelOverride.value;
  }

  public setStatus(state: StatusBarState, message: string): void {
    const val = state === "Idle" ? "" : state.toLowerCase();
    if (val) {
      this.dataset["state"] = val;
    } else {
      delete this.dataset["state"];
    }
    if (this.statusBar) {
      this.statusBar.setStatus(state, message);
    }
  }

  public setProcessDisabled(disabled: boolean): void {
    if (this.processBtn) {
      this.processBtn.disabled = disabled;
    }
  }

  public setDownloadDisabled(disabled: boolean): void {
    if (this.downloadBtn) {
      this.downloadBtn.disabled = disabled;
    }
  }

  public clearDropZone(): void {
    if (this.dropZone) {
      this.dropZone.clear();
    }
  }

  public setLogs(stats: SnapperStats): void {
    if (this.logsPanel) {
      this.logsPanel.setLogs(stats);
    }
  }

  public clearLogs(): void {
    if (this.logsPanel) {
      this.logsPanel.clear();
    }
  }
}

customElements.define("controls-panel", ControlsPanel);


