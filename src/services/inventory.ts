import { getDb } from '../database/client';
import { uid, nowIso, clampQuantity } from '../utils/helpers';
import type { InventoryItem } from '../types/inventory';

function rowToItem(r: any): InventoryItem {
  return {
    id: r.id, name: r.name, sku: r.sku, barcode: r.barcode ?? null, qrCode: r.qr_code ?? null,
    description: r.description ?? null, category: r.category, quantity: r.quantity,
    minimumStock: r.minimum_stock, maximumStock: r.maximum_stock ?? null, unit: r.unit,
    location: r.location, condition: r.condition, supplier: r.supplier ?? null,
    purchaseDate: r.purchase_date ?? null, expirationDate: r.expiration_date ?? null,
    price: r.price ?? null, notes: r.notes ?? null, createdAt: r.created_at, updatedAt: r.updated_at,
    createdBy: r.created_by ?? null, updatedBy: r.updated_by ?? null, deletedAt: r.deleted_at ?? null,
  };
}

export async function listItems(opts: { search?: string; category?: string; location?: string; stock?: string; sort?: string } = {}): Promise<InventoryItem[]> {
  const d = await getDb();
  const where: string[] = ['deleted_at IS NULL'];
  const args: any[] = [];
  if (opts.search) {
    where.push('(name LIKE ? OR sku LIKE ? OR barcode LIKE ? OR category LIKE ? OR location LIKE ? OR description LIKE ?)');
    const q = `%${opts.search}%`;
    args.push(q, q, q, q, q, q);
  }
  if (opts.category) { where.push('category = ?'); args.push(opts.category); }
  if (opts.location) { where.push('location = ?'); args.push(opts.location); }
  let sql = `SELECT * FROM items WHERE ${where.join(' AND ')}`;
  if (opts.stock === 'low') sql += ' AND quantity > 0 AND quantity <= minimum_stock';
  else if (opts.stock === 'out') sql += ' AND quantity <= 0';
  else if (opts.stock === 'in') sql += ' AND quantity > minimum_stock';
  if (opts.sort === 'qty') sql += ' ORDER BY quantity DESC';
  else if (opts.sort === 'updated') sql += ' ORDER BY updated_at DESC';
  else sql += ' ORDER BY name ASC';
  sql += ' LIMIT 1000';
  const rows = await d.getAllAsync(sql, args);
  return (rows as any[]).map(rowToItem);
}

export async function getItem(id: string) {
  const d = await getDb();
  const r = await d.getFirstAsync('SELECT * FROM items WHERE id = ?', [id]);
  return r ? rowToItem(r) : null;
}

export async function findByBarcode(code: string) {
  const d = await getDb();
  const r = await d.getFirstAsync('SELECT * FROM items WHERE (barcode = ? OR sku = ? OR qr_code = ?) AND deleted_at IS NULL', [code, code, code]);
  return r ? rowToItem(r) : null;
}

export async function createItem(input: Partial<InventoryItem> & { name: string; sku: string; category: string }): Promise<InventoryItem> {
  if (!input.name?.trim()) throw new Error('Item name required');
  if (!input.category?.trim()) throw new Error('Category required');
  const d = await getDb();
  const now = nowIso();
  const item: InventoryItem = {
    id: input.id ?? uid('item'), name: input.name.trim(), sku: input.sku.trim(),
    barcode: input.barcode ?? null, qrCode: input.qrCode ?? `SW-${Date.now().toString(36).toUpperCase()}`,
    description: input.description ?? null, category: input.category,
    quantity: clampQuantity(input.quantity ?? 0), minimumStock: clampQuantity(input.minimumStock ?? 0),
    maximumStock: input.maximumStock ?? null, unit: input.unit ?? 'pcs', location: input.location ?? 'Unassigned',
    condition: input.condition ?? 'good', supplier: input.supplier ?? null,
    purchaseDate: input.purchaseDate ?? null, expirationDate: input.expirationDate ?? null,
    price: input.price ?? null, notes: input.notes ?? null,
    createdAt: now, updatedAt: now, createdBy: input.createdBy ?? null, updatedBy: input.updatedBy ?? null, deletedAt: null,
  };
  await d.runAsync(
    `INSERT INTO items (id,name,sku,barcode,qr_code,description,category,quantity,minimum_stock,maximum_stock,unit,location,condition,supplier,purchase_date,expiration_date,price,notes,created_at,updated_at,created_by,updated_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [item.id, item.name, item.sku, item.barcode ?? null, item.qrCode ?? null, item.description ?? null, item.category, item.quantity, item.minimumStock, item.maximumStock ?? null, item.unit, item.location, item.condition, item.supplier ?? null, item.purchaseDate ?? null, item.expirationDate ?? null, item.price ?? null, item.notes ?? null, item.createdAt, item.updatedAt, item.createdBy ?? null, item.updatedBy ?? null],
  );
  await d.runAsync(`INSERT INTO sync_queue (id,type,payload,created_at,state,retries) VALUES (?,?,?,?,?,?)`, [uid('sync'), 'CREATE_ITEM', JSON.stringify({ id: item.id }), now, 'pending', 0]);
  await d.runAsync(`INSERT INTO activity (id,action,item_id,item_name,timestamp) VALUES (?,?,?,?,?)`, [uid('act'), 'item_created', item.id, item.name, now]);
  return item;
}

export async function updateItem(id: string, patch: Partial<InventoryItem>): Promise<void> {
  const d = await getDb();
  const cur = await getItem(id);
  if (!cur) throw new Error('Item not found');
  const next = { ...cur, ...patch, id, updatedAt: nowIso() };
  if (patch.quantity !== undefined) next.quantity = clampQuantity(patch.quantity);
  await d.runAsync(
    `UPDATE items SET name=?,sku=?,barcode=?,qr_code=?,description=?,category=?,quantity=?,minimum_stock=?,maximum_stock=?,unit=?,location=?,condition=?,supplier=?,purchase_date=?,expiration_date=?,price=?,notes=?,updated_at=?,updated_by=? WHERE id=?`,
    [next.name, next.sku, next.barcode ?? null, next.qrCode ?? null, next.description ?? null, next.category, next.quantity, next.minimumStock, next.maximumStock ?? null, next.unit, next.location, next.condition, next.supplier ?? null, next.purchaseDate ?? null, next.expirationDate ?? null, next.price ?? null, next.notes ?? null, next.updatedAt, next.updatedBy ?? null, id],
  );
  await d.runAsync(`INSERT INTO sync_queue (id,type,payload,created_at,state,retries) VALUES (?,?,?,?,?,?)`, [uid('sync'), 'UPDATE_ITEM', JSON.stringify({ id }), next.updatedAt, 'pending', 0]);
  await d.runAsync(`INSERT INTO activity (id,action,item_id,item_name,timestamp,metadata) VALUES (?,?,?,?,?,?)`, [uid('act'), 'item_edited', id, next.name, next.updatedAt, JSON.stringify({ from_qty: cur.quantity, to_qty: next.quantity })]);
}

export async function adjustQuantity(id: string, delta: number, user = 'Staff'): Promise<InventoryItem> {
  const cur = await getItem(id);
  if (!cur) throw new Error('Item not found');
  const nextQty = clampQuantity(cur.quantity + delta);
  await updateItem(id, { quantity: nextQty });
  const d = await getDb();
  await d.runAsync(`INSERT INTO activity (id,user_name,action,item_id,item_name,timestamp,metadata) VALUES (?,?,?,?,?,?,?)`,
    [uid('act'), user, 'quantity_changed', id, cur.name, nowIso(), `${cur.quantity} → ${nextQty}`]);
  const updated = await getItem(id);
  return updated!;
}

export async function softDeleteItem(id: string): Promise<void> {
  const d = await getDb();
  const now = nowIso();
  await d.runAsync(`UPDATE items SET deleted_at=?, updated_at=? WHERE id=?`, [now, now, id]);
  await d.runAsync(`INSERT INTO sync_queue (id,type,payload,created_at,state,retries) VALUES (?,?,?,?,?,?)`, [uid('sync'), 'DELETE_ITEM', JSON.stringify({ id }), now, 'pending', 0]);
  await d.runAsync(`INSERT INTO activity (id,action,item_id,timestamp) VALUES (?,?,?,?)`, [uid('act'), 'item_deleted', id, now]);
}
