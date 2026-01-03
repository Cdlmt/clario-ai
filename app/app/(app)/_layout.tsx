import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="home">
      <Stack.Screen name="home" />
      <Stack.Screen name="practice" />
    </Stack>
  );
}