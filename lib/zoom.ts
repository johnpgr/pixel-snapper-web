export const ZOOM_STEPS: number[] = [0.25, 0.33, 0.5, 0.67, 0.75, 1, 1.25, 1.5, 2, 3, 4];

export function getNextStep(current: number): number {
  const nextIdx = ZOOM_STEPS.findIndex((s) => s > current);
  return nextIdx !== -1 ? ZOOM_STEPS[nextIdx]! : current;
}

export function getPrevStep(current: number): number {
  const prev = ZOOM_STEPS.filter((s) => s < current);
  return prev.length > 0 ? prev[prev.length - 1]! : current;
}
