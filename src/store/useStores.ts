import { create } from 'zustand';
import type { ThemeMode } from '../constants/theme';

interface ThemeState { mode: ThemeMode; setMode: (m: ThemeMode) => void; }
export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'system',
  setMode: (mode) => set({ mode }),
}));

interface AuthState {
  token: string | null; userId: string | null; userName: string; role: string;
  signIn: (t: string, u: string, n: string, r: string) => void;
  signOut: () => void;
  hydrate: (s: Partial<AuthState>) => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  token: null, userId: null, userName: 'Staff', role: 'staff',
  signIn: (token, userId, userName, role) => set({ token, userId, userName, role }),
  signOut: () => set({ token: null, userId: null }),
  hydrate: (s) => set(s),
}));

interface SyncState {
  status: 'synced' | 'offline' | 'syncing' | 'error' | 'pending';
  pendingCount: number;
  setStatus: (s: SyncState['status']) => void;
  setPendingCount: (n: number) => void;
}
export const useSyncStore = create<SyncState>((set) => ({
  status: 'synced', pendingCount: 0,
  setStatus: (status) => set({ status }),
  setPendingCount: (pendingCount) => set({ pendingCount }),
}));
