import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { formatMoney, type PropertyListing } from "@realtor/domain";
import { AppChrome } from "../components/app-chrome";
import { ProfileLoadingState } from "../components/loading-states";
import { useLocale } from "../contexts/locale-context";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

function imageUri(src: string) {
  return src.startsWith("http") ? src : API_URL + src;
}

export default function SavedScreen() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { messages: m } = useLocale();
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSaved = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    const res = await fetch(API_URL + "/api/saved", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setListings(data.listings ?? []);
    }
  // getToken is stable (Clerk API) — intentionally omitted from deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isSignedIn) return;
    setLoading(true);
    fetchSaved().finally(() => setLoading(false));
  }, [isSignedIn, fetchSaved]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSaved();
    setRefreshing(false);
  }, [fetchSaved]);

  if (!isLoaded || loading) {
    return (
      <AppChrome title={m.mobile.saved} eyebrow={m.mobile.savedEyebrow}>
        <ProfileLoadingState />
      </AppChrome>
    );
  }

  if (!isSignedIn) {
    return (
      <AppChrome title={m.mobile.saved} eyebrow={m.mobile.savedEyebrow}>
        <View style={styles.content}>
          <View style={styles.darkCard}>
            <Text style={styles.kicker}>{m.mobile.savedEyebrow}</Text>
            <Text style={styles.title}>{m.mobile.savedSignedOutTitle}</Text>
            <Text style={styles.copy}>{m.mobile.savedSignedOutCopy}</Text>
            <Pressable accessibilityRole="button" onPress={() => router.push("/sign-in")} style={styles.primaryCta}>
              <Text style={styles.primaryCtaText}>{m.mobile.signIn}</Text>
            </Pressable>
          </View>
        </View>
      </AppChrome>
    );
  }

  return (
    <AppChrome title={m.mobile.saved} eyebrow={m.mobile.savedEyebrow}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <View style={styles.savedMark}>
              <View style={styles.savedShape} />
            </View>
            <Text style={styles.emptyTitle}>{m.mobile.savedEmptyTitle}</Text>
            <Text style={styles.emptyCopy}>{m.mobile.savedEmptyCopy}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/?type=sale")}
              style={styles.secondaryCta}
            >
              <Text style={styles.secondaryCtaText}>{m.mobile.exploreProperties}</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(`/property/${item.slug}`)}
            style={styles.card}
          >
            <Image source={{ uri: imageUri(item.image) }} style={styles.cardImage} resizeMode="cover" />
            <View style={styles.cardBody}>
              <Text style={styles.cardPrice} numberOfLines={1}>
                {formatMoney(item.price, item.currency)}
              </Text>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.cardLocation} numberOfLines={1}>
                {item.neighborhood}, {item.city}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </AppChrome>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16, padding: 18, paddingBottom: 28 },
  darkCard: { backgroundColor: "#111111", borderRadius: 8, gap: 10, padding: 20, shadowColor: "#111111", shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.18, shadowRadius: 26 },
  kicker: { color: "#f3bd21", fontSize: 11, fontWeight: "900", letterSpacing: 1.6, textTransform: "uppercase" },
  title: { color: "#ffffff", fontSize: 30, fontWeight: "900", lineHeight: 34 },
  copy: { color: "rgba(255,255,255,0.68)", fontSize: 15, lineHeight: 22 },
  primaryCta: { alignItems: "center", backgroundColor: "#f3bd21", borderRadius: 8, marginTop: 8, padding: 14 },
  primaryCtaText: { color: "#111111", fontWeight: "900" },
  emptyCard: { alignItems: "center", backgroundColor: "#ffffff", borderRadius: 8, gap: 10, padding: 22, shadowColor: "#111111", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.10, shadowRadius: 24 },
  savedMark: { alignItems: "center", backgroundColor: "#f3bd21", borderRadius: 8, height: 54, justifyContent: "center", width: 54 },
  savedShape: { borderBottomColor: "transparent", borderBottomWidth: 11, borderLeftColor: "#111111", borderLeftWidth: 9, borderRightColor: "#111111", borderRightWidth: 9, borderTopColor: "#111111", borderTopWidth: 25, height: 0, width: 22 },
  emptyTitle: { color: "#111111", fontSize: 24, fontWeight: "900", textAlign: "center" },
  emptyCopy: { color: "#666666", lineHeight: 21, textAlign: "center" },
  secondaryCta: { alignItems: "center", backgroundColor: "#111111", borderRadius: 8, marginTop: 8, padding: 14, width: "100%" },
  secondaryCtaText: { color: "#ffffff", fontWeight: "900" },
  card: { backgroundColor: "#ffffff", borderRadius: 8, flexDirection: "row", gap: 12, overflow: "hidden", shadowColor: "#111111", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 10 },
  cardImage: { borderRadius: 8, height: 90, width: 110 },
  cardBody: { flex: 1, gap: 3, justifyContent: "center", paddingRight: 12, paddingVertical: 10 },
  cardPrice: { color: "#111111", fontSize: 15, fontWeight: "900" },
  cardTitle: { color: "#333333", fontSize: 13, lineHeight: 18 },
  cardLocation: { color: "#888888", fontSize: 12 },
});
