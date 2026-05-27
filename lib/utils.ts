export const html = String.raw;
export const css = String.raw;

export function queryElementOrNull<T extends HTMLElement>(
  selector: string,
  Type: new () => T
): T | null {
  const el = document.querySelector(selector);

  if (!el) return null;
  if (!(el instanceof Type)) {
    console.warn(
      `Element matching "${selector}" is not an instance of ${Type.name} in document.`
    );
    return null;
  }

  return el;
}

export function queryElement<T extends HTMLElement>(
  selector: string,
  Type: new () => T
): T {
  const el = queryElementOrNull(selector, Type);

  if (!el) {
    throw new Error(
      `Required element matching "${selector}" not found or is not an instance of ${Type.name} in document.`
    );
  }

  return el;
}
