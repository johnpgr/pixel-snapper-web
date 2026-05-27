import { ok, err } from "./result.ts";
import type { Result } from "./result.ts";

export interface ImageSize {
  width: number;
  height: number;
}

export async function drawBytesToCanvas(canvas: HTMLCanvasElement, bytes: Uint8Array): Promise<Result<ImageSize>> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(new Blob([bytes.buffer as ArrayBuffer]));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return err(`Could not decode image: ${msg}`);
  }

  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return err("Could not acquire 2D canvas context.");
  }

  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  delete canvas.dataset["empty"];

  return ok({ width: canvas.width, height: canvas.height });
}

export function clearCanvas(canvas: HTMLCanvasElement): void {
  canvas.dataset["empty"] = "";
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = 0;
  canvas.height = 0;
}
