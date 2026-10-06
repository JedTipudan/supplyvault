export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type SyncStatus = 'synced' | 'offline' | 'syncing' | 'error' | 'pending';
export type UserRole = 'owner' | 'admin' | 'manager' | 'staff' | 'viewer';
export type ItemCondition = 'new' | 'good' | 'fair' | 'damaged' | 'refurbished';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  barcode?: string | null;
  qrCode?: string | null;
  description?: string | null;
  category: string;
  quantity: number;
  minimumStock: number;
  maximumStock?: number | null;
  unit: string;
  location: string;
  condition: ItemCondition;
  supplier?: string | null;
  purchaseDate?: string | null;
  expirationDate?: string | null;
  price?: number | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedAt?: string | null;
}

export interface ItemPhoto {
  id: string;
  itemId: string;
  localUri: string;
  remoteUrl?: string | null;
  uploadState: 'local' | 'uploading' | 'uploaded' | 'failed';
  createdAt: string;
}

export interface Category { id: string; name: string; color?: string | null; createdAt: string; updatedAt: string; }
export interface Location { id: string; name: string; parentId?: string | null; createdAt: string; updatedAt: string; }

export interface ActivityLog {
  id: string; userId?: string | null; userName?: string | null;
  action: string; itemId?: string | null; itemName?: string | null;
  timestamp: string; metadata?: string | null;
}

export interface SyncOperation {
  id: string; type: string; payload: string; createdAt: string;
  state: 'pending' | 'syncing' | 'synced' | 'failed';
  retries: number; lastError?: string | null;
}

export interface ConflictRecord {
  id: string; itemId: string; localQuantity: number; serverQuantity: number;
  localUpdatedAt: string; serverUpdatedAt: string; resolution?: 'keep_local' | 'keep_server' | null;
  createdAt: string;
}

export function calcStockStatus(quantity: number, minimumStock: number): StockStatus {
  if (quantity <= 0) return 'out_of_stock';
  if (quantity <= minimumStock) return 'low_stock';
  return 'in_stock';
}
