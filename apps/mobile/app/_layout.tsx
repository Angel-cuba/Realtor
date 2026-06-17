import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#f8f5ed" },
          headerTintColor: "#111111",
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: "#f8f5ed" }
        }}
      />
      <StatusBar style="dark" />
    </>
  );
}
