/**
 * @fileoverview PNG download initiation.
 */

/**
 * Triggers a browser download of a PNG byte array as a local file.
 *
 * @param {Uint8Array} bytes     Raw PNG bytes.
 * @param {string}     filename  Suggested save name (including extension).
 * @returns {void}
 */
export function downloadPng(bytes, filename) {
  const blob = new Blob([/** @type {any} */ (bytes)], { type: "image/png" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
}
