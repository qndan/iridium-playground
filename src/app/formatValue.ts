export function formatValue(value: unknown): string {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2) ?? String(value);
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}
