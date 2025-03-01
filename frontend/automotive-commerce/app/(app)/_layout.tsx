// app/(app)/_layout.tsx
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Import useRouter

export default function AppLayout() {
  const router = useRouter(); // Initialize the router

  return (
    <Stack>
      {/* Tabs Navigator (Home and Profile) */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false, // Hide header for the tabs navigator
        }}
      />

      {/* Product Details Page */}
      <Stack.Screen
        name="product/[id]"
        options={{
          headerShown: true, // Show header for the product details page
          headerTitle: 'Product Details', // Optional: Set a title
          headerLeft: () => (
            <Ionicons
              name="arrow-back"
              size={24}
              color="black"
              onPress={() => router.back()} // Custom back button
            />
          ),
        }}
      />
    </Stack>
  );
}