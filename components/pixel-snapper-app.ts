import { BaseElement } from "./base-element.ts";
import * as Wasm from "../lib/wasm.ts";
import * as Download from "../lib/download.ts";
import { ControlsPanel } from "./controls-panel.ts";
import { ImageViewport } from "./image-viewport.ts";
import { t } from "../lib/i18n.ts";
import { StatusBarState } from "./status-bar.ts";

export class PixelSnapperApp extends BaseElement {
  public controlsPanel!: ControlsPanel;
  public originalViewport!: ImageViewport;
  public resultViewport!: ImageViewport;
  public sourceBytes: Uint8Array | null = null;
  public resultBytes: Uint8Array | null = null;

  constructor() {
    super();
  }

  async connectedCallback(): Promise<void> {
    this.controlsPanel = this.queryElement("controls-panel", ControlsPanel);
    this.originalViewport = this.queryElement('image-viewport[type="original"]', ImageViewport);
    this.resultViewport = this.queryElement('image-viewport[type="result"]', ImageViewport);

    // WASM initialization
    const initResult = await Wasm.initialize();
    if (!initResult.ok) {
      this.controlsPanel.setStatus(StatusBarState.Error, initResult.error);
      console.error("[PixelSnapperApp] WASM init failed:", initResult.error);
      return;
    }

    // Wire file loading selection
    this.controlsPanel.addEventListener("fileselect", async (ev) => {
      const file = ev.detail.file;
      if (file) {
        await this.loadFile(file);
      }
    });

    // Wire snapping process execution
    this.controlsPanel.addEventListener("process", this.processImage.bind(this));

    // Wire download actions
    this.controlsPanel.addEventListener("download", this.downloadResult.bind(this));
  }

  public async loadFile(file: File): Promise<void> {
    if (!file.type.startsWith("image/")) {
      this.controlsPanel.setStatus(StatusBarState.Error, t("unsupportedFileType"));
      return;
    }

    this.controlsPanel.setStatus(StatusBarState.Idle, t("statusLoading"));
    this.originalViewport.clear();
    this.resultViewport.clear();
    this.controlsPanel.clearLogs();
    this.resultBytes = null;
    this.controlsPanel.setDownloadDisabled(true);
    this.controlsPanel.setProcessDisabled(true);

    const buffer = await file.arrayBuffer();
    this.sourceBytes = new Uint8Array(buffer);

    const drawResult = await this.originalViewport.draw(this.sourceBytes);
    if (!drawResult.ok) {
      this.controlsPanel.setStatus(StatusBarState.Error, drawResult.error);
      this.sourceBytes = null;
      return;
    }

    this.controlsPanel.setProcessDisabled(false);
    this.controlsPanel.setStatus(StatusBarState.Idle, t("statusReady"));
  }

  public async processImage(): Promise<void> {
    if (!this.sourceBytes) return;

    const kColors = this.controlsPanel.kColors;
    const pixelSizeOverride = this.controlsPanel.pixelSizeOverride;
    const isAuto = this.controlsPanel.pixelOverride.autoCheckbox.checked;

    if (!isAuto && !Number.isPositiveInteger(pixelSizeOverride)) {
      this.controlsPanel.setStatus(StatusBarState.Error, t("pixelSizeError"));
      return;
    }

    this.controlsPanel.setStatus(StatusBarState.Processing, t("statusProcessing"));
    this.controlsPanel.setProcessDisabled(true);
    this.controlsPanel.setDownloadDisabled(true);

    // Yield to let the browser paint the "processing" feedback indicator
    await new Promise((resolve) => setTimeout(resolve, 16));

    const t0 = performance.now();
    const processResult = Wasm.processImage(this.sourceBytes, kColors, pixelSizeOverride);
    const elapsed = (performance.now() - t0).toFixed(0);

    if (!processResult.ok) {
      this.controlsPanel.setStatus(StatusBarState.Error, processResult.error);
      this.controlsPanel.setProcessDisabled(false);
      return;
    }

    const { output, pixelSize, pixelSizeMode, outputWidth, outputHeight } = processResult.value;
    this.resultBytes = output;

    this.controlsPanel.setLogs({
      pixelSize,
      pixelSizeMode,
      outputWidth,
      outputHeight
    });

    const drawResult = await this.resultViewport.draw(this.resultBytes);
    if (!drawResult.ok) {
      this.controlsPanel.setStatus(StatusBarState.Error, drawResult.error);
      this.controlsPanel.setProcessDisabled(false);
      return;
    }

    this.controlsPanel.setStatus(StatusBarState.Done, t("statusDone", elapsed));
    this.controlsPanel.setProcessDisabled(false);
    this.controlsPanel.setDownloadDisabled(false);
  }

  public downloadResult(): void {
    if (this.resultBytes) {
      Download.downloadPng(this.resultBytes, "snapped.png");
    }
  }
}

customElements.define("pixel-snapper-app", PixelSnapperApp);
