import init, { process_image, SnapperResult } from "../vendor/spritefusion_pixel_snapper.ts";
import { ok, err } from "./result.ts";
import type { Result } from "./result.ts";

export interface SnapperStats {
  pixelSize: number;
  pixelSizeMode: string;
  outputWidth: number;
  outputHeight: number;
}

export interface SnapperResultData extends SnapperStats {
  output: Uint8Array;
}

let initialized = false;

export async function initialize(): Promise<Result<void>> {
  if (initialized) return ok(undefined);
  try {
    await init();
    initialized = true;
    return ok(undefined);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return err(`Failed to initialize WASM module: ${msg}`);
  }
}

export function processImage(
  inputBytes: Uint8Array,
  kColors: number,
  pixelSizeOverride?: number
): Result<SnapperResultData> {
  try {
    const resultObj: SnapperResult = process_image(inputBytes, kColors, pixelSizeOverride ?? null);
    const output = resultObj.output_bytes;
    const pixelSize = resultObj.pixel_size;
    const pixelSizeMode = resultObj.pixel_size_mode;
    const outputWidth = resultObj.output_width;
    const outputHeight = resultObj.output_height;
    
    resultObj.free();

    return ok({
      output,
      pixelSize,
      pixelSizeMode,
      outputWidth,
      outputHeight
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return err(msg);
  }
}
