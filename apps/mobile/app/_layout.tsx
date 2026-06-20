import { ClerkProvider } from "@clerk/expo";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { tokenCache } from "../lib/token-cache";

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) throw new Error("EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not set");

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="dark" />
    </ClerkProvider>
  );
}
