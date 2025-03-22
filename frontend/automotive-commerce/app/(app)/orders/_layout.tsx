import { Stack } from 'expo-router';

export default function OrdersLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="processing" />
      <Stack.Screen name="shipped" />
      <Stack.Screen name="delivered" />
      <Stack.Screen name="cancelled" />
    </Stack>
  );
}