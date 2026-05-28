import { BaseElement } from "./base-element.ts";
import { t } from "../lib/i18n.ts";
import type { SnapperStats } from "../lib/wasm.ts";
import { html, css } from "../lib/utils.ts";

export class LogsPanel extends BaseElement {
  static styles = css`
    /* ─────────────────────────────────────────────────────────────────────────
       Logs Section & Stats Grid
       ───────────────────────────────────────────────────────────────────────── */
    logs-panel {
      display: flex;
      flex-direction: column;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
      animation: fadeIn var(--transition) ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      background: var(--surface-subtle);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      transition: transform var(--transition), border-color var(--transition), background var(--transition);

      &:hover {
        background: var(--surface-raised);
        border-color: color-mix(in oklch, var(--border) 70%, var(--accent));
        transform: translateY(-1px);
        box-shadow: var(--shadow-sm);
      }
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      background: var(--accent-light);
      color: var(--accent);
      flex-shrink: 0;
      transition: transform var(--transition);

      svg {
        width: 18px;
        height: 18px;
      }
    }

    .stat-card:hover .stat-icon {
      transform: scale(1.05);
    }

    .stat-info {
      display: flex;
      flex-direction: column;
      gap: 1px;
      flex-grow: 1;
    }

    .stat-label {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }

    .stat-value {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .stat-badge {
      font-size: 0.65rem;
      font-weight: 600;
      padding: 1px 6px;
      border-radius: 10px;
      text-transform: uppercase;
      letter-spacing: 0.02em;

      &.auto-detected {
        background: var(--accent-light);
        color: var(--accent);
      }

      &.override {
        background: light-dark(#fef3c7, #3b2305);
        color: light-dark(#d97706, #fbbf24);
        border: 1px solid light-dark(#fcd34d, #78350f);
      }
    }

    .log-placeholder {
      font-size: 0.78rem;
      color: var(--text-faint);
      text-align: center;
      padding: 16px 0;
      font-style: italic;
    }
  `;

  public placeholder!: HTMLDivElement;
  public grid!: HTMLDivElement;
  public pixelSizeValue!: HTMLSpanElement;
  public pixelSizeBadge!: HTMLSpanElement;
  public outputSizeValue!: HTMLSpanElement;

  constructor() {
    super();
  }

  render(): string {
    return html`
      <h2 id="logs-heading" class="section-heading">${t("sectionHeadingLogs")}</h2>
      
      <div class="log-placeholder" id="logs-placeholder">${t("logNoData")}</div>

      <div class="stats-grid" id="stats-grid" style="display: none;">
        <div class="stat-card">
          <span class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
            </svg>
          </span>
          <div class="stat-info">
            <div class="stat-label">${t("logPixelSize")}</div>
            <div class="stat-value">
              <span id="log-pixel-size-value">--</span>
              <span id="log-pixel-size-badge" class="stat-badge">--</span>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-3.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>
            </svg>
          </span>
          <div class="stat-info">
            <div class="stat-label">${t("logOutputSize")}</div>
            <div class="stat-value">
              <span id="log-output-size-value">--</span>
              <span class="stat-badge auto-detected" style="background: var(--surface-raised); color: var(--text-muted); text-transform: lowercase;">${t("logCells")}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.placeholder = this.queryElement("#logs-placeholder", HTMLDivElement);
    this.grid = this.queryElement("#stats-grid", HTMLDivElement);
    this.pixelSizeValue = this.queryElement("#log-pixel-size-value", HTMLSpanElement);
    this.pixelSizeBadge = this.queryElement("#log-pixel-size-badge", HTMLSpanElement);
    this.outputSizeValue = this.queryElement("#log-output-size-value", HTMLSpanElement);
  }

  public setLogs(stats: SnapperStats): void {
    this.placeholder.style.display = "none";
    this.grid.style.display = "grid";
    this.pixelSizeValue.textContent = `${stats.pixelSize.toFixed(1)}px`;

    const isOverride = stats.pixelSizeMode === "override";
    this.pixelSizeBadge.className = `stat-badge ${isOverride ? "override" : "auto-detected"}`;
    this.pixelSizeBadge.textContent = isOverride ? t("logOverride") : t("logAutoDetected");

    this.outputSizeValue.textContent = `${stats.outputWidth} × ${stats.outputHeight}`;
  }

  public clear(): void {
    this.placeholder.style.display = "block";
    this.grid.style.display = "none";
  }
}

customElements.define("logs-panel", LogsPanel);


