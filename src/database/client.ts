import * as SQLite from 'expo-sqlite';
import { SCHEMA_SQL } from './schema';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('stockwise.db');
  await db.execAsync(SCHEMA_SQL);
  return db;
}

export async function seedIfEmpty(): Promise<void> {
  const d = await getDb();
  const row = await d.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM items WHERE deleted_at IS NULL');
  if (row && row.c > 0) return;
  const now = new Date().toISOString();
  const demo = [
    { id: 'seed_hdmi', name: 'HDMI Cable 2m', sku: 'CBL-HDMI-2M', barcode: '8901234567890', category: 'Cables', quantity: 12, minimumStock: 5, unit: 'pcs', location: 'IT Room', condition: 'new', price: 9.99 },
    { id: 'seed_usb', name: 'USB-C Hub 7-in-1', sku: 'HUB-USBC-7IN1', barcode: '8901234567891', category: 'Accessories', quantity: 5, minimumStock: 5, unit: 'pcs', location: 'AV Room', condition: 'good', price: 39.5 },
    { id: 'seed_chair', name: 'Office Chair Ergo', sku: 'FUR-CHAIR-ERGO', barcode: null, category: 'Furniture', quantity: 0, minimumStock: 2, unit: 'pcs', location: 'Storage B', condition: 'good', price: 189 },
  ];
  for (const it of demo) {
    await d.runAsync(
      `INSERT OR IGNORE INTO items (id,name,sku,barcode,category,quantity,minimum_stock,unit,location,condition,price,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [it.id, it.name, it.sku, it.barcode, it.category, it.quantity, it.minimumStock, it.unit, it.location, it.condition, it.price, now, now],
    );
  }
  const cats = ['Cables', 'Accessories', 'Furniture', 'Electronics'];
  for (const c of cats) {
    await d.runAsync(`INSERT OR IGNORE INTO categories (id,name,created_at,updated_at) VALUES (?,?,?,?)`, [`cat_${c}`, c, now, now]);
  }
  for (const l of ['IT Room', 'AV Room', 'Storage B']) {
    await d.runAsync(`INSERT OR IGNORE INTO locations (id,name,created_at,updated_at) VALUES (?,?,?,?)`, [`loc_${l}`, l, now, now]);
  }
}
