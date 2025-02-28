// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)"/>
      <Stack.Screen name="auth/login" options={{ title: "Login" }}/>
      <Stack.Screen name="auth/register" options={{ title: "Register" }}/>
    </Stack>
  );
}