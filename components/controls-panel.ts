import { BaseElement } from "./base-element.ts";
import { DropZone } from "./drop-zone.ts";
import { PaletteControl } from "./palette-control.ts";
import { PixelOverrideControl } from "./pixel-override-control.ts";
import { StatusBar, type StatusBarState } from "./status-bar.ts";
import { LogsPanel } from "./logs-panel.ts";
import type { SnapperStats } from "../lib/wasm.ts";

export interface ControlsPanelEventMap extends HTMLElementEventMap {
  fileselect: CustomEvent<{ file: File }>;
  process: CustomEvent<void>;
  download: CustomEvent<void>;
}

export class ControlsPanel extends BaseElement<ControlsPanelEventMap> {
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

  connectedCallback(): void {
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

    this.processBtn.addEventListener("click", () => {
      this.emit("process");
    });

    this.downloadBtn.addEventListener("click", () => {
      this.emit("download");
    });
  }

  public get kColors(): number {
    return this.palette ? this.palette.value : 16;
  }

  public get pixelSizeOverride(): number | undefined {
    return this.pixelOverride ? this.pixelOverride.value : undefined;
  }

  public setStatus(state: StatusBarState, message: string): void {
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
