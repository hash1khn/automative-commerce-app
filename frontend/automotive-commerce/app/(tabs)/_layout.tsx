import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs initialRouteName="index">
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}