// Offline-first sync: LOCAL DB -> QUEUE -> SERVER -> RESULT.
// Never delete pending ops before server confirmation. Server adapter is
// injectable; default is a no-op remote that marks ops synced when online.
import NetInfo from '@react-native-community/netinfo';
import { getDb } from '../database/client';
import { uid, nowIso } from '../utils/helpers';

export interface RemoteAdapter {
  push: (type: string, payload: any) => Promise<{ conflict?: { serverQuantity: number; serverUpdatedAt: string } | null }>;
}

export const defaultRemote: RemoteAdapter = {
  async push() { return { conflict: null }; },
};

let adapter: RemoteAdapter = defaultRemote;
export function setRemoteAdapter(a: RemoteAdapter) { adapter = a; }

export async function isOnline(): Promise<boolean> {
  try {
    const s = await NetInfo.fetch();
    return !!s.isConnected && s.isInternetReachable !== false;
  } catch { return true; }
}

export async function pendingCount(): Promise<number> {
  const d = await getDb();
  const r = await d.getFirstAsync<{ c: number }>(`SELECT COUNT(*) as c FROM sync_queue WHERE state IN ('pending','failed')`);
  return r?.c ?? 0;
}

export async function syncNow(onStatus?: (s: string) => void): Promise<{ pushed: number; conflicts: number }> {
  const online = await isOnline();
  if (!online) { onStatus?.('offline'); return { pushed: 0, conflicts: 0 }; }
  const d = await getDb();
  onStatus?.('syncing');
  const ops = await d.getAllAsync<any>(`SELECT * FROM sync_queue WHERE state IN ('pending','failed') ORDER BY created_at ASC LIMIT 100`);
  let pushed = 0; let conflicts = 0;
  for (const op of ops) {
    try {
      await d.runAsync(`UPDATE sync_queue SET state='syncing' WHERE id=?`, [op.id]);
      const res = await adapter.push(op.type, JSON.parse(op.payload));
      if (res?.conflict) {
        conflicts++;
        const p = JSON.parse(op.payload);
        await d.runAsync(
          `INSERT INTO conflicts (id,item_id,local_quantity,server_quantity,local_updated_at,server_updated_at,created_at) VALUES (?,?,?,?,?,?,?)`,
          [uid('cf'), p.id ?? '', p.quantity ?? 0, res.conflict.serverQuantity, nowIso(), res.conflict.serverUpdatedAt, nowIso()],
        );
        await d.runAsync(`UPDATE sync_queue SET state='failed', last_error='conflict', retries=retries+1 WHERE id=?`, [op.id]);
      } else {
        await d.runAsync(`DELETE FROM sync_queue WHERE id=?`, [op.id]);
        pushed++;
      }
    } catch (e: any) {
      await d.runAsync(`UPDATE sync_queue SET state='failed', last_error=?, retries=retries+1 WHERE id=?`, [String(e?.message ?? e), op.id]);
      onStatus?.('error');
      break;
    }
  }
  await d.runAsync(`INSERT INTO activity (id,action,timestamp,metadata) VALUES (?,?,?,?)`, [uid('act'), 'sync_completed', nowIso(), `pushed=${pushed} conflicts=${conflicts}`]);
  onStatus?.(conflicts > 0 ? 'error' : 'synced');
  return { pushed, conflicts };
}

export async function resolveConflict(conflictId: string, strategy: 'keep_local' | 'keep_server'): Promise<void> {
  const d = await getDb();
  const c = await d.getFirstAsync<any>(`SELECT * FROM conflicts WHERE id=?`, [conflictId]);
  if (!c) return;
  if (strategy === 'keep_server') {
    await d.runAsync(`UPDATE items SET quantity=?, updated_at=? WHERE id=?`, [c.server_quantity, nowIso(), c.item_id]);
  }
  await d.runAsync(`UPDATE conflicts SET resolution=? WHERE id=?`, [strategy, conflictId]);
  await d.runAsync(`INSERT INTO activity (id,action,item_id,timestamp,metadata) VALUES (?,?,?,?,?)`, [uid('act'), 'conflict_resolved', c.item_id, nowIso(), strategy]);
}
