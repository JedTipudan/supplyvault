import * as SecureStore from 'expo-secure-store';
import { uid } from '../utils/helpers';

const TOKEN_KEY = 'sw_token';
const USER_KEY = 'sw_user';

// Dev auth only — no production credentials hard-coded. Token stored securely.
export async function devSignIn(email: string): Promise<{ token: string; userId: string; name: string; role: string }> {
  const token = `dev_${uid('tok')}`;
  const user = { userId: uid('user'), name: email.split('@')[0] || 'Staff', role: 'staff', email };
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  return { token, ...user };
}
export async function signOut(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}
export async function loadSession(): Promise<{ token: string; userId: string; name: string; role: string } | null> {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const raw = await SecureStore.getItemAsync(USER_KEY);
    if (!token || !raw) return null;
    const u = JSON.parse(raw);
    return { token, userId: u.userId, name: u.name, role: u.role };
  } catch { return null; }
}
