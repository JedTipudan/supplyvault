export function uid(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
export function nowIso(): string {
  return new Date().toISOString();
}
export function clampQuantity(q: number): number {
  if (!Number.isFinite(q)) return 0;
  return Math.max(0, Math.floor(q));
}
export function formatDate(iso?: string | null): string {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString(); } catch { return iso; }
}
export function stockStatusLabel(s: string): string {
  if (s === 'in_stock') return '✓ In Stock';
  if (s === 'low_stock') return '! Low Stock';
  return '× Out of Stock';
}
