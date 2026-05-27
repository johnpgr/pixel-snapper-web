declare global {
  interface NumberConstructor {
    isPositiveInteger(value: unknown): value is number;
  }
}

Number.isPositiveInteger = function (
  value: unknown,
): value is number {
  return typeof value === "number"
    && Number.isInteger(value)
    && value > 0;
};

export {};
