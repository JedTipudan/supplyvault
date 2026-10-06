import { createItem } from './inventory';

export interface ImportResult { valid: number; invalid: number; duplicates: number; errors: string[]; }

export function validateRecord(r: any): string | null {
  if (!r?.name?.trim()) return 'name required';
  if (!r?.sku?.trim()) return 'sku required';
  if (!r?.category?.trim()) return 'category required';
  if (r.quantity !== undefined && (!Number.isFinite(Number(r.quantity)) || Number(r.quantity) < 0)) return 'invalid quantity';
  if (r.price !== undefined && r.price !== null && (!Number.isFinite(Number(r.price)) || Number(r.price) < 0)) return 'invalid price';
  return null;
}

export async function importJson(records: any[]): Promise<ImportResult> {
  const seen = new Set<string>();
  let valid = 0, invalid = 0, duplicates = 0;
  const errors: string[] = [];
  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    const err = validateRecord(r);
    if (err) { invalid++; errors.push(`row ${i}: ${err}`); continue; }
    if (seen.has(r.sku)) { duplicates++; continue; }
    seen.add(r.sku);
    try {
      await createItem({ name: r.name, sku: r.sku, category: r.category, quantity: Number(r.quantity ?? 0), location: r.location ?? 'Unassigned' });
      valid++;
    } catch (e: any) { invalid++; errors.push(`row ${i}: ${String(e?.message ?? e)}`); }
  }
  return { valid, invalid, duplicates, errors };
}

export function toCsv(items: any[]): string {
  const head = 'id,name,sku,category,quantity,location';
  const lines = items.map((i) => [i.id, `"${String(i.name).replace(/"/g, '""')}"`, i.sku, i.category, i.quantity, i.location].join(','));
  return [head, ...lines].join('\n');
}
