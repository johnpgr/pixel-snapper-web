import { BaseElement } from "./base-element.js";
import { t } from "../lib/i18n.js";

/**
 * @extends {BaseElement}
 */
export class LogsPanel extends BaseElement {
  constructor() {
    super();
    /**
     * Placeholder text shown when no execution logs exist.
     * @type {HTMLDivElement | null}
     */
    this.placeholder = null;
    /**
     * Layout grid container holding stats cards.
     * @type {HTMLDivElement | null}
     */
    this.grid = null;
    /**
     * Element displaying pixel size.
     * @type {HTMLSpanElement | null}
     */
    this.pixelSizeValue = null;
    /**
     * Badge displaying pixel size detection mode.
     * @type {HTMLSpanElement | null}
     */
    this.pixelSizeBadge = null;
    /**
     * Element displaying output grid size dimensions.
     * @type {HTMLSpanElement | null}
     */
    this.outputSizeValue = null;
  }

  connectedCallback() {
    this.placeholder = this.queryElement("#logs-placeholder", HTMLDivElement);
    this.grid = this.queryElement("#stats-grid", HTMLDivElement);
    this.pixelSizeValue = this.queryElement("#log-pixel-size-value", HTMLSpanElement);
    this.pixelSizeBadge = this.queryElement("#log-pixel-size-badge", HTMLSpanElement);
    this.outputSizeValue = this.queryElement("#log-output-size-value", HTMLSpanElement);
  }

  /**
   * Updates the execution logs display in the sidebar.
   *
   * @param {SnapperStats} stats
   */
  setLogs(stats) {
    if (this.placeholder) {
      this.placeholder.style.display = "none";
    }
    if (this.grid) {
      this.grid.style.display = "grid";
    }

    if (this.pixelSizeValue) {
      this.pixelSizeValue.textContent = `${stats.pixelSize.toFixed(1)}px`;
    }

    if (this.pixelSizeBadge) {
      const isOverride = stats.pixelSizeMode === "override";
      this.pixelSizeBadge.className = `stat-badge ${isOverride ? "override" : "auto-detected"}`;
      this.pixelSizeBadge.textContent = isOverride ? t("logOverride") : t("logAutoDetected");
    }

    if (this.outputSizeValue) {
      this.outputSizeValue.textContent = `${stats.outputWidth} × ${stats.outputHeight}`;
    }
  }

  /**
   * Resets the execution logs back to empty state.
   */
  clear() {
    if (this.placeholder) {
      this.placeholder.style.display = "block";
    }
    if (this.grid) {
      this.grid.style.display = "none";
    }
  }
}

customElements.define("logs-panel", LogsPanel);
