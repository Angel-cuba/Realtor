import { useCallback, useState } from "react";
import { useAuth, useClerk, useUser } from "@clerk/expo";
import { router, useFocusEffect } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { formatMoney, type PropertyListing } from "@realtor/domain";
import { AppChrome } from "../components/app-chrome";
import { ProfileLoadingState } from "../components/loading-states";
import { useLocale } from "../contexts/locale-context";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

function imageUri(src: string) {
  return src.startsWith("http") ? src : API_URL + src;
}

function ProfileGlyph() {
  return (
    <View style={styles.profileIconCanvas}>
      <View style={styles.profileIconHead} />
      <View style={styles.profileIconBody} />
    </View>
  );
}

export default function ProfileScreen() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { user } = useUser();
  const { locale, messages: m, setLocale } = useLocale();
  const [savedListings, setSavedListings] = useState<PropertyListing[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const displayName = user?.fullName ?? user?.emailAddresses?.[0]?.emailAddress ?? "Cuenta Realtor";
  const stats = [
    { label: m.mobile.savedStat, value: savedLoading ? "-" : String(savedListings.length) },
    { label: m.mobile.toursStat, value: "3" },
    { label: m.mobile.alertsStat, value: "5" }
  ];
  const favoritePreview = savedListings.slice(0, 3);

  const fetchSaved = useCallback(async () => {
    const token = await getToken();
    if (!token) {
      return [];
    }

    const res = await fetch(API_URL + "/api/saved", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      return (data.listings ?? []) as PropertyListing[];
    }
    return [];
  }, [getToken]);

  useFocusEffect(useCallback(() => {
    if (!isSignedIn) {
      setSavedListings([]);
      return;
    }

    let active = true;
    setSavedLoading(true);
    fetchSaved()
      .then((listings) => {
        if (active) setSavedListings(listings);
      })
      .finally(() => {
        if (active) setSavedLoading(false);
      });

    return () => {
      active = false;
    };
  }, [fetchSaved, isSignedIn]));

  if (!isLoaded) {
    return (
      <AppChrome title={m.mobile.profile} eyebrow={m.mobile.accountLabel}>
        <ProfileLoadingState />
      </AppChrome>
    );
  }

  if (!isSignedIn) {
    return (
      <AppChrome title={m.mobile.profile} eyebrow={m.mobile.accountLabel}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{m.mobile.language}</Text>
            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>{m.mobile.languageLabel}</Text>
              <Pressable
                onPress={() => setLocale(locale === "es" ? "en" : "es")}
                style={styles.langToggle}
                accessibilityRole="button"
                accessibilityLabel={m.mobile.languageLabel}
              >
                <Text style={styles.langToggleText}>{locale === "es" ? "ES" : "EN"}</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.cardDark}>
            <Text style={styles.agentLabel}>{m.mobile.signInEyebrow}</Text>
            <Text style={styles.agentName}>{m.mobile.signInTitle}</Text>
            <Text style={styles.agentCopy}>{m.mobile.signInCopy}</Text>
            <Pressable style={styles.cta} onPress={() => router.push("/sign-in")} accessibilityRole="button">
              <Text style={styles.ctaText}>{m.mobile.signIn}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </AppChrome>
    );
  }

  return (
    <AppChrome title={m.mobile.profile} eyebrow={m.mobile.accountLabel}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.avatar}>
            {user?.imageUrl ? <Image source={{ uri: user.imageUrl }} style={styles.avatarImage} /> : <ProfileGlyph />}
          </View>
          <View style={styles.profileText}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.role}>{m.mobile.activeAccount}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View style={styles.statCard} key={stat.label}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{m.mobile.preferences}</Text>
          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceLabel}>{m.mobile.cityTarget}</Text>
            <Text style={styles.preferenceValue}>Miami</Text>
          </View>
          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceLabel}>{m.mobile.budgetLabel}</Text>
            <Text style={styles.preferenceValue}>$750k - $1.2M</Text>
          </View>
          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceLabel}>{m.mobile.typeLabel}</Text>
            <Text style={styles.preferenceValue}>House / Villa</Text>
          </View>
          <View style={[styles.preferenceRow, { borderTopColor: "rgba(17,17,17,0.08)", borderTopWidth: 1, paddingTop: 12 }]}>
            <Text style={styles.preferenceLabel}>{m.mobile.languageLabel}</Text>
            <Pressable
              onPress={() => setLocale(locale === "es" ? "en" : "es")}
              style={styles.langToggle}
              accessibilityRole="button"
              accessibilityLabel={m.mobile.languageLabel}
            >
              <Text style={styles.langToggleText}>{locale === "es" ? "ES" : "EN"}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.favoritesSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderText}>
              <Text style={styles.sectionKicker}>{m.mobile.savedEyebrow}</Text>
              <Text style={styles.sectionTitle}>{m.mobile.saved}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/saved")}
              style={styles.textButton}
            >
              <Text style={styles.textButtonText}>{m.mobile.saved}</Text>
            </Pressable>
          </View>

          {favoritePreview.length > 0 ? (
            favoritePreview.map((item) => (
              <Pressable
                accessibilityRole="button"
                key={item.id}
                onPress={() => router.push(`/property/${item.slug}`)}
                style={styles.favoriteRow}
              >
                {item.image ? <Image source={{ uri: imageUri(item.image) }} style={styles.favoriteImage} resizeMode="cover" /> : <View style={styles.favoriteImageFallback} />}
                <View style={styles.favoriteBody}>
                  <Text style={styles.favoritePrice} numberOfLines={1}>
                    {formatMoney(item.price, item.currency)}
                    {item.listingType === "rent" ? m.listing.perMonth : ""}
                  </Text>
                  <Text style={styles.favoriteTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.favoriteLocation} numberOfLines={1}>
                    {item.neighborhood}, {item.city}
                  </Text>
                </View>
              </Pressable>
            ))
          ) : (
            <View style={styles.emptyFavorites}>
              <Text style={styles.emptyFavoritesTitle}>{m.mobile.savedEmptyTitle}</Text>
              <Text style={styles.emptyFavoritesCopy}>{m.mobile.savedEmptyCopy}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push("/?type=sale")}
                style={styles.secondaryInlineCta}
              >
                <Text style={styles.secondaryInlineCtaText}>{m.mobile.exploreProperties}</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.cardDark}>
          <Text style={styles.agentLabel}>{m.mobile.advisorLabel}</Text>
          <Text style={styles.agentName}>{m.mobile.advisorName}</Text>
          <Text style={styles.agentCopy}>{m.mobile.advisorCopy}</Text>
          <Pressable style={styles.cta}>
            <Text style={styles.ctaText}>{m.mobile.contact}</Text>
          </Pressable>
          <Pressable style={styles.secondaryCta} onPress={() => signOut()} accessibilityRole="button">
            <Text style={styles.secondaryCtaText}>{m.mobile.signOut}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </AppChrome>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16, padding: 18, paddingBottom: 28 },
  heroCard: { alignItems: "center", backgroundColor: "#ffffff", borderRadius: 8, flexDirection: "row", gap: 14, padding: 18, shadowColor: "#111111", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.10, shadowRadius: 24 },
  avatar: { alignItems: "center", backgroundColor: "#111111", borderRadius: 8, height: 58, justifyContent: "center", width: 58 },
  avatarImage: { borderRadius: 8, height: 58, width: 58 },
  profileIconCanvas: { alignItems: "center", height: 30, justifyContent: "center", position: "relative", width: 30 },
  profileIconHead: { backgroundColor: "#f3bd21", borderRadius: 8, height: 16, position: "absolute", top: 1, width: 16 },
  profileIconBody: { backgroundColor: "rgba(243,189,33,0.34)", borderColor: "#f3bd21", borderRadius: 11, borderWidth: 2, bottom: 1, height: 15, position: "absolute", width: 26 },
  profileText: { flex: 1 },
  name: { color: "#111111", fontSize: 25, fontWeight: "900" },
  role: { color: "#666666", fontWeight: "700", marginTop: 2 },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: { backgroundColor: "#ffffff", borderRadius: 8, flex: 1, padding: 14 },
  statValue: { color: "#111111", fontSize: 25, fontWeight: "900" },
  statLabel: { color: "#666666", fontSize: 11, fontWeight: "900", marginTop: 2, textTransform: "uppercase" },
  card: { backgroundColor: "#ffffff", borderRadius: 8, gap: 12, padding: 18 },
  sectionTitle: { color: "#111111", fontSize: 20, fontWeight: "900" },
  preferenceRow: { borderTopColor: "rgba(17,17,17,0.08)", borderTopWidth: 1, flexDirection: "row", gap: 12, justifyContent: "space-between", paddingTop: 12 },
  preferenceLabel: { color: "#666666", flex: 1 },
  preferenceValue: { color: "#111111", flex: 1, fontWeight: "900", textAlign: "right" },
  cardDark: { backgroundColor: "#111111", borderRadius: 8, gap: 8, padding: 18, shadowColor: "#111111", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.16, shadowRadius: 24 },
  agentLabel: { color: "#f3bd21", fontSize: 11, fontWeight: "900", letterSpacing: 1.6, textTransform: "uppercase" },
  agentName: { color: "#ffffff", fontSize: 23, fontWeight: "900" },
  agentCopy: { color: "rgba(255,255,255,0.66)", lineHeight: 21 },
  cta: { alignItems: "center", backgroundColor: "#f3bd21", borderRadius: 8, marginTop: 8, padding: 14 },
  ctaText: { color: "#111111", fontWeight: "900" },
  secondaryCta: { alignItems: "center", borderColor: "rgba(255,255,255,0.18)", borderRadius: 8, borderWidth: 1, marginTop: 4, padding: 14 },
  secondaryCtaText: { color: "#ffffff", fontWeight: "900" },
  langToggle: { alignItems: "center", backgroundColor: "#111111", borderRadius: 6, justifyContent: "center", paddingHorizontal: 12, paddingVertical: 5 },
  langToggleText: { color: "#f3bd21", fontSize: 11, fontWeight: "900", letterSpacing: 1.4 },
  favoritesSection: { gap: 12 },
  sectionHeader: { alignItems: "flex-end", flexDirection: "row", gap: 12, justifyContent: "space-between" },
  sectionHeaderText: { flex: 1 },
  sectionKicker: { color: "#f3bd21", fontSize: 11, fontWeight: "900", letterSpacing: 1.6, textTransform: "uppercase" },
  textButton: { borderColor: "rgba(17,17,17,0.12)", borderRadius: 8, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  textButtonText: { color: "#111111", fontSize: 12, fontWeight: "900" },
  favoriteRow: { backgroundColor: "#ffffff", borderRadius: 8, flexDirection: "row", gap: 12, overflow: "hidden", shadowColor: "#111111", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 10 },
  favoriteImage: { borderRadius: 8, height: 88, width: 106 },
  favoriteImageFallback: { backgroundColor: "#111111", borderRadius: 8, height: 88, width: 106 },
  favoriteBody: { flex: 1, gap: 3, justifyContent: "center", paddingRight: 12, paddingVertical: 10 },
  favoritePrice: { color: "#111111", fontSize: 15, fontWeight: "900" },
  favoriteTitle: { color: "#333333", fontSize: 13, lineHeight: 18 },
  favoriteLocation: { color: "#888888", fontSize: 12 },
  emptyFavorites: { alignItems: "center", backgroundColor: "#ffffff", borderRadius: 8, gap: 8, padding: 18 },
  emptyFavoritesTitle: { color: "#111111", fontSize: 19, fontWeight: "900", textAlign: "center" },
  emptyFavoritesCopy: { color: "#666666", lineHeight: 21, textAlign: "center" },
  secondaryInlineCta: { alignItems: "center", backgroundColor: "#111111", borderRadius: 8, marginTop: 4, padding: 12, width: "100%" },
  secondaryInlineCtaText: { color: "#ffffff", fontWeight: "900" }
});
