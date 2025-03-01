import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
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

        <Stack.Screen
          name="cart"
          options={{
            title: 'Shopping Cart',
            headerShown: false // If you want a custom header
          }}
        />
      </Stack>
    </QueryClientProvider >
  );
}