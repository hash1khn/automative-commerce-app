// app/(app)/_layout.tsx
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AppLayout() {
  const router = useRouter();

  return (
    <Stack>
      {/* Main Tabs Navigator */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false // Hide header for the tabs navigator
        }}
      />

      {/* Product Details Page */}
      <Stack.Screen
        name="product/[id]"
        options={{
          headerTitle: 'Product Details',
          headerLeft: () => (
            <Ionicons
              name="arrow-back"
              size={24}
              color="black"
              onPress={() => router.back()}
            />
          ),
        }}
      />
    </Stack>
  );
}