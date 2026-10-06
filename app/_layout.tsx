import { useEffect, useMemo, useState } from 'react';
import { Stack, router, useSegments, ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { getDb, seedIfEmpty } from '../src/database/client';
import { loadSession } from '../src/services/auth';
import { useAuthStore, useThemeStore } from '../src/store/useStores';
import { useTheme } from '../src/hooks/useTheme';
import { Splash } from '../src/components/Splash';

const qc = new QueryClient();

function Guard({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const segments = useSegments();
  const [ready, setReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    (async () => {
      try {
        await getDb();
        await seedIfEmpty();
        const s = await loadSession();
        if (s) useAuthStore.getState().hydrate({ token: s.token, userId: s.userId, userName: s.name, role: s.role });
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const loaded = ready && (fontsLoaded || !!fontError);

  useEffect(() => {
    if (!loaded) return;
    const inAuth = segments[0] === '(auth)';
    if (!token && !inAuth) router.replace('/(auth)/login');
    else if (token && inAuth) router.replace('/(tabs)');
  }, [token, segments, loaded]);

  if (!loaded) return <Splash />;
  return <>{children}</>;
}

export default function RootLayout() {
  const mode = useThemeStore((s) => s.mode);
  const system = useColorScheme();
  const dark = mode === 'dark' || (mode === 'system' && system === 'dark');
  const { colors } = useTheme();

  const cardStyle = { backgroundColor: colors.background };

  const baseTheme = dark ? DarkTheme : DefaultTheme;
  const navTheme = useMemo(
    () => ({
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.background,
        text: colors.text,
        border: colors.border,
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dark, colors.background, colors.card, colors.text, colors.border, colors.primary],
  );

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={qc}>
        <Guard>
          <StatusBar style={dark ? 'light' : 'dark'} />
          <ThemeProvider value={navTheme}>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: cardStyle,
              }}
            >
              <Stack.Screen name="(auth)" options={{ contentStyle: cardStyle }} />
              <Stack.Screen name="(tabs)" options={{ contentStyle: cardStyle }} />
              <Stack.Screen name="item/[id]" options={{ contentStyle: cardStyle }} />
              <Stack.Screen name="item/new" options={{ presentation: 'modal', animation: 'slide_from_bottom', contentStyle: cardStyle }} />
              <Stack.Screen name="item/edit" options={{ presentation: 'modal', animation: 'slide_from_bottom', contentStyle: cardStyle }} />
              <Stack.Screen name="scan/result" options={{ presentation: 'modal', animation: 'slide_from_bottom', contentStyle: cardStyle }} />
              <Stack.Screen name="ai/result" options={{ presentation: 'modal', animation: 'slide_from_bottom', contentStyle: cardStyle }} />
              <Stack.Screen name="ai/camera" options={{ contentStyle: cardStyle }} />
              <Stack.Screen name="ai/upload" options={{ contentStyle: cardStyle }} />
              <Stack.Screen name="categories" options={{ contentStyle: cardStyle }} />
              <Stack.Screen name="locations" options={{ contentStyle: cardStyle }} />
              <Stack.Screen name="reports" options={{ contentStyle: cardStyle }} />
              <Stack.Screen name="notifications" options={{ contentStyle: cardStyle }} />
              <Stack.Screen name="team" options={{ contentStyle: cardStyle }} />
              <Stack.Screen name="offline" options={{ contentStyle: cardStyle }} />
              <Stack.Screen name="status" options={{ contentStyle: cardStyle }} />
              <Stack.Screen name="settings/appearance" options={{ contentStyle: cardStyle }} />
              <Stack.Screen name="settings/index" options={{ contentStyle: cardStyle }} />
              <Stack.Screen name="sync/index" options={{ contentStyle: cardStyle }} />
              <Stack.Screen name="sync/conflicts" options={{ contentStyle: cardStyle }} />
            </Stack>
          </ThemeProvider>
        </Guard>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
