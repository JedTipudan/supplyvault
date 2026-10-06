// Expo Go-safe notifications.
// On Android Expo Go, merely IMPORTING expo-notifications throws
// (warnOfExpoGoPushUsage: remote push removed in SDK 53+). So we check
// isRunningInExpoGo() BEFORE touching the module. Local DB logging + cooldown
// still work everywhere; scheduled push requires a dev build.
import { isRunningInExpoGo } from 'expo';
import { getDb } from '../database/client';
import { uid, nowIso } from '../utils/helpers';

let cached: any | null | undefined;

async function loadNotifications(): Promise<any | null> {
  if (cached !== undefined) return cached;
  try {
    if (isRunningInExpoGo()) {
      cached = null;
      return cached;
    }
    const mod = await import('expo-notifications');
    try {
      mod.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
    } catch {
      /* handler already set */
    }
    cached = mod;
  } catch {
    cached = null;
  }
  return cached;
}

export async function ensureNotificationPermission(): Promise<boolean> {
  try {
    const N = await loadNotifications();
    if (!N) return false;
    const cur = await N.getPermissionsAsync();
    if (cur.granted) return true;
    const req = await N.requestPermissionsAsync();
    return !!req.granted;
  } catch {
    return false;
  }
}

const COOLDOWN_MS = 24 * 60 * 60 * 1000;

export async function checkLowStockAndNotify(): Promise<void> {
  const d = await getDb();
  const lows = await d.getAllAsync<any>(
    `SELECT * FROM items WHERE deleted_at IS NULL AND quantity > 0 AND quantity <= minimum_stock LIMIT 20`,
  );
  const outs = await d.getAllAsync<any>(`SELECT * FROM items WHERE deleted_at IS NULL AND quantity <= 0 LIMIT 20`);
  if (lows.length === 0 && outs.length === 0) return;
  const now = Date.now();
  const canPush = await ensureNotificationPermission();
  const N = canPush ? await loadNotifications() : null;

  const fire = async (kind: string, title: string, body: string, itemId?: string) => {
    const last = await d.getFirstAsync<any>(
      `SELECT last_fired_at FROM notifications WHERE kind=? AND item_id=? ORDER BY created_at DESC LIMIT 1`,
      [kind, itemId ?? null],
    );
    if (last?.last_fired_at && now - new Date(last.last_fired_at).getTime() < COOLDOWN_MS) return;
    const id = uid('notif');
    await d.runAsync(
      `INSERT INTO notifications (id,title,body,kind,item_id,created_at,last_fired_at) VALUES (?,?,?,?,?,?,?)`,
      [id, title, body, kind, itemId ?? null, nowIso(), nowIso()],
    );
    if (!N) return; // Expo Go / permission denied: in-app record only.
    try {
      await N.scheduleNotificationAsync({ content: { title, body }, trigger: null });
    } catch {
      /* ignore — DB record kept */
    }
  };

  for (const it of [...lows, ...outs]) {
    const out = it.quantity <= 0;
    await fire(
      out ? 'out_of_stock' : 'low_stock',
      out ? 'Out of stock' : 'Low stock',
      `${it.name}: ${it.quantity} left`,
      it.id,
    );
  }
}
