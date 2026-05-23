import { BaseElement } from "./base-element.js";
import * as wasm from "../lib/wasm.js";
import * as download from "../lib/download.js";
import { ControlsPanel } from "./controls-panel.js";
import { ImageViewport } from "./image-viewport.js";

export class PixelSnapperApp extends BaseElement {
  constructor() {
    super();
    /**
     * Sidebar controls panel wrapper.
     * @type {ControlsPanel | null}
     */
    this.controlsPanel = null;
    /**
     * Side-by-side canvas preview viewport panel.
     * @type {ImageViewport | null}
     */
    this.imageViewport = null;
    /**
     * Original uploaded source image raw bytes.
     * @type {Uint8Array | null}
     */
    this.sourceBytes = null;
    /**
     * Snapped result image raw bytes.
     * @type {Uint8Array | null}
     */
    this.resultBytes = null;
  }

  async connectedCallback() {
    this.controlsPanel = this.queryElement("controls-panel", ControlsPanel);
    this.imageViewport = this.queryElement("image-viewport", ImageViewport);

    if (!this.controlsPanel || !this.imageViewport) {
      console.error("[PixelSnapperApp] Required child panels controls-panel or image-viewport are absent.");
      return;
    }

    // WASM initialization
    const initResult = await wasm.initialize();
    if (!initResult.ok) {
      this.controlsPanel.setStatus("error", initResult.error);
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
    this.controlsPanel.addEventListener("process", async () => {
      await this.processImage();
    });

    // Wire download actions
    this.controlsPanel.addEventListener("download", () => {
      this.downloadResult();
    });
  }

  /**
   * Reads the selected file buffer, renders the preview, and updates visual controls.
   *
   * @param {File} file
   * @returns {Promise<void>}
   */
  async loadFile(file) {
    if (!this.controlsPanel || !this.imageViewport) return;

    if (!file.type.startsWith("image/")) {
      this.controlsPanel.setStatus("error", "Unsupported file type. Please use PNG or JPEG.");
      return;
    }

    this.controlsPanel.setStatus("idle", "Loading…");
    this.imageViewport.clear();
    this.resultBytes = null;
    this.controlsPanel.setDownloadDisabled(true);
    this.controlsPanel.setProcessDisabled(true);

    const buffer = await file.arrayBuffer();
    this.sourceBytes = new Uint8Array(buffer);

    const drawResult = await this.imageViewport.drawOriginal(this.sourceBytes);
    if (!drawResult.ok) {
      this.controlsPanel.setStatus("error", drawResult.error);
      this.sourceBytes = null;
      return;
    }

    this.controlsPanel.setProcessDisabled(false);
    this.controlsPanel.setStatus("idle", "Ready");
  }

  /**
   * Executes the WASM pixel snapped quantization algorithm.
   *
   * @returns {Promise<void>}
   */
  async processImage() {
    if (!this.controlsPanel || !this.imageViewport || !this.sourceBytes) return;

    const kColors = this.controlsPanel.kColors;
    const pixelSizeOverride = this.controlsPanel.pixelSizeOverride;

    if (pixelSizeOverride !== undefined && (isNaN(pixelSizeOverride) || pixelSizeOverride < 1)) {
      this.controlsPanel.setStatus("error", "Pixel size override must be a number ≥ 1.");
      return;
    }

    this.controlsPanel.setStatus("processing", "Processing…");
    this.controlsPanel.setProcessDisabled(true);
    this.controlsPanel.setDownloadDisabled(true);

    // Yield to let the browser paint the "processing" feedback indicator
    await new Promise((resolve) => setTimeout(resolve, 16));

    const t0 = performance.now();
    const processResult = wasm.processImage(this.sourceBytes, kColors, pixelSizeOverride);
    const elapsed = (performance.now() - t0).toFixed(0);

    if (!processResult.ok) {
      this.controlsPanel.setStatus("error", processResult.error);
      this.controlsPanel.setProcessDisabled(false);
      return;
    }

    this.resultBytes = processResult.value;

    const drawResult = await this.imageViewport.drawResult(this.resultBytes);
    if (!drawResult.ok) {
      this.controlsPanel.setStatus("error", drawResult.error);
      this.controlsPanel.setProcessDisabled(false);
      return;
    }

    this.controlsPanel.setStatus("done", `Done in ${elapsed} ms`);
    this.controlsPanel.setProcessDisabled(false);
    this.controlsPanel.setDownloadDisabled(false);
  }

  /**
   * Triggers the processed image file download saving step.
   */
  downloadResult() {
    if (this.resultBytes) {
      download.downloadPng(this.resultBytes, "snapped.png");
    }
  }
}

customElements.define("pixel-snapper-app", PixelSnapperApp);
