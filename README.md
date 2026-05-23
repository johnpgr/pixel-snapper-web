# Pixel Snapper — Web Client

An elegant, lightweight, and zero-dependency web frontend for the **Sprite Fusion Pixel Snapper** tool. This client enables game developers and pixel artists to snap AI-generated pixel art, inconsistent sprite sheets, or procedural 2D assets to a perfect, consistent grid and quantize colors to a clean palette—all running completely client-side in the browser via WebAssembly.

---

## Key Features

* **Instant Web-Assembly Snapping:** Executes the core Rust pixel-snapping pipeline directly in the browser using high-performance WASM, with no server-side processing required.
* **Dual Viewport Comparison:** A high-fidelity, side-by-side viewport displaying the original image and the snapped/quantized result in real-time.
* **Interactive Viewport Controls:** Panning and crisp `image-rendering: pixelated` zooming (zoom in, zoom out, reset zoom, custom mouse/wheel interactions) for pixel-perfect inspection.
* **Flexible Processing Parameters:**
  * Adjust the number of quantized colors in the color palette (1 to 64 colors).
  * Toggle auto-detection of grid cell sizes or override it manually to force a specific pixel grid size.
* **Modern Vanilla Architecture:** Built on lightweight, native **Web Components** (HTML/CSS/JS) without heavy framework runtimes or complex build chains.
* **Lightweight i18n Engine:** Zero-dependency client-side translation module supporting dynamic localizations (including English and Portuguese/`pt_BR`) and accessibility/SEO standards.
* **Drag-and-Drop Uploader:** Streamlined drag-and-drop workspace supporting PNG and JPEG files.
* **Clean Exports:** Download finalized assets instantly as high-quality PNGs.

---

## Architecture & Core Components

The project is structured around self-contained, modular Web Components that communicate via standard DOM events and manage the application state cleanly:

* **`components/` (Web Components):**
  * `<pixel-snapper-app>`: Root component that orchestrates state, coordinates file loading, manages parameters, and executes the WASM pipeline.
  * `<drop-zone>`: Handles drag-and-drop mechanics and local file reading.
  * `<image-viewport>`: Contains side-by-side image previews, toolbars, and scroll/pan container.
  * `<image-preview>`: Dedicated canvas viewer displaying the original or result image with dimensions and metadata.
  * `<zoom-controls>`: Dynamic button interface for controlling canvas zoom scale.
  * `<palette-control>`: Range input for configuring quantized palette color count ($K$).
  * `<pixel-override-control>`: Numeric and checkbox controls for configuring auto-detected or overridden grid cell sizes.
  * `<status-bar>`: Live processing state indicators and screen-reader polite announcements.
* **`lib/` (Helper Modules):**
  * `wasm.js`: WebAssembly module loader and execution wrapper.
  * `i18n.js`: Client-side internationalization manager. Loads JSON locales and translates markup declaratively via `data-i18n` attributes.
  * `canvas.js`: Low-level canvas rendering, aspect-ratio calculators, and pixel-data extraction.
  * `zoom.js`: Viewport scaling math and mouse/scroll interaction logic.
  * `download.js`: Client-side binary export/download exporter.
  * `result.js`: Simple, robust monadic functional error-handling implementation (`ok`/`err`).

---

## Repository Directory Structure

```text
├── components/          # Native Web Component elements
├── lib/                 # Core functional helper scripts (WASM, i18n, Canvas)
├── vendor/              # Compiled Rust WebAssembly package (WASM, JS glue)
├── _locales/            # Internationalization dictionaries (JSON)
│   ├── en/              # English localizations
│   └── pt_BR/           # Portuguese (Brazil) localizations
├── index.html           # Main HTML5 semantic entry point
├── index.css            # Modular custom theme (CSS variables, dark-mode, layout)
├── index.js             # Main application bootstrapping & i18n initializer
├── custom-elements.json # Declarative custom elements manifest descriptor
├── package.json         # NPM manifest with development scripts
└── README.md            # You are here
```

---

## Local Development

### Prerequisites

* [Python 3](https://www.python.org/) (for launching a lightweight HTTP server) or any static file server.
* [Node.js](https://nodejs.org/) (optional, only needed for updating the Custom Elements manifest).

### Running the App

Start a local development server using Python:

```bash
npm run dev
```

Alternatively, run a standard Python HTTP server directly:

```bash
python -m http.server 3000
```

Open your browser and navigate to `http://localhost:3000` to interact with the application.

### Custom Elements Manifest Analysis

If you modify any Web Component definitions or parameters, you can re-generate the custom elements description manifest by running:

```bash
npm run analyze
```

---

## Acknowledgments

**Pixel Snapper** is an open-source project by [Sprite Fusion](https://spritefusion.com)—a free, web-based tilemap editor designed for game developers, supporting platforms like Unity, Godot, Defold, and GB Studio.
