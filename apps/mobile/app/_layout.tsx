import { ClerkProvider } from "@clerk/expo";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { tokenCache } from "../lib/token-cache";

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#f8f5ed" },
          headerTintColor: "#111111",
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: "#f8f5ed" }
        }}
      />
      <StatusBar style="dark" />
    </ClerkProvider>
  );
}
