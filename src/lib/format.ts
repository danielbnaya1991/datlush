/**
 * Format a number as NIS currency (no decimals).
 */
export function formatNIS(amount: number): string {
  return `₪${Math.round(amount).toLocaleString('he-IL')}`;
}
