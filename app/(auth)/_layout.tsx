import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      {/* The restyled forgot screen renders its own header (spec 02 style). */}
      <Stack.Screen name="forgot" options={{ headerShown: false }} />
    </Stack>
  );
}
