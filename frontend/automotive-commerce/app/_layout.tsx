import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Auth Group (Login, Register, etc.) */}
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false, // Hide header for auth screens
        }}
      />

      {/* App Group (Authenticated Screens) */}
      <Stack.Screen
        name="(app)"
        options={{
          headerShown: false, // Hide header for app screens
        }}
      />

      {/* Optional: Not Found Screen */}
      <Stack.Screen
        name="+not-found"
        options={{
          headerShown: false, // Hide header for not-found screen
        }}
      />
    </Stack>
  );
}