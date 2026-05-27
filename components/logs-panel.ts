import { BaseElement } from "./base-element.ts";
import { t } from "../lib/i18n.ts";
import type { SnapperStats } from "../lib/wasm.ts";

export class LogsPanel extends BaseElement {
  public placeholder!: HTMLDivElement;
  public grid!: HTMLDivElement;
  public pixelSizeValue!: HTMLSpanElement;
  public pixelSizeBadge!: HTMLSpanElement;
  public outputSizeValue!: HTMLSpanElement;

  constructor() {
    super();
  }

  connectedCallback(): void {
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
