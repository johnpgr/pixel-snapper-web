/**
 * @fileoverview Global type definitions for the Pixel Snapper web client.
 * Declares shared structures used across JSDoc annotations in lib modules.
 */

type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

interface ImageSize {
  width: number;
  height: number;
}

interface SnapperStats {
  pixelSize: number;
  pixelSizeMode: string;
  outputWidth: number;
  outputHeight: number;
}

interface SnapperResultData {
  output: Uint8Array;
  pixelSize: number;
  pixelSizeMode: string;
  outputWidth: number;
  outputHeight: number;
}
