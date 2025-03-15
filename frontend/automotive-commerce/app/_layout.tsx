import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';

const queryClient = new QueryClient();

const colors = {
  primary: '#373D20',
  secondary: '#717744',
  accent: '#BCBD8B',
  background: '#F5F5F5',
  text: '#766153',
  error: '#FF0000',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.primary,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
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
              headerShown: false, // If you want a custom header
            }}
          />

          <Stack.Screen
            name="checkout"
            options={{
              title: 'Checkout',
              headerShown: false, // If you want a custom header
            }}
          />

          <Stack.Screen
            name="payment"
            options={{
              title: 'Payment',
              headerShown: false, // If you want a custom header
            }}
          />
        </Stack>
      </QueryClientProvider>
    </AuthProvider>
  );
}
