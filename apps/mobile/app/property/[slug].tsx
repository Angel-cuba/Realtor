import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@clerk/expo";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { formatMoney, propertyTypeLabel, type PropertyListing } from "@realtor/domain";
import { AppChrome } from "../../components/app-chrome";
import { PropertyLoadingState } from "../../components/loading-states";
import { useLocale } from "../../contexts/locale-context";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

function imageUri(src: string) {
  return src.startsWith("http") ? src : API_URL + src;
}

export default function PropertyScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { isLoaded, isSignedIn } = useAuth();
  const { messages: m } = useLocale();
  const [listing, setListing] = useState<PropertyListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(API_URL + "/api/listings/" + slug)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setListing(data?.listing ?? null))
      .catch(() => setListing(null))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleSubmit() {
    if (!listing) return;
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (!name.trim() || !email.trim() || message.trim().length < 10) {
      Alert.alert(m.mobile.incompleteTitle, m.mobile.incompleteBody);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(API_URL + "/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          intent: listing.listingType === "rent" ? "rent" : "buy",
          listingSlug: slug
        })
      });

      if (res.ok) {
        Alert.alert(m.mobile.sentTitle, m.mobile.sentBody);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        Alert.alert(m.mobile.errorTitle, m.mobile.errorBody);
      }
    } catch {
      Alert.alert(m.mobile.errorTitle, m.mobile.noConnectionBody);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <AppChrome title={m.mobile.propertyTitle} eyebrow={m.mobile.loadingDetail} showBack>
        <PropertyLoadingState />
      </AppChrome>
    );
  }

  if (!listing) {
    return (
      <AppChrome title={m.mobile.propertyTitle} eyebrow={m.mobile.notFoundEyebrow} showBack>
        <Text style={styles.notFound}>{m.mobile.notFound}</Text>
      </AppChrome>
    );
  }

  return (
    <AppChrome title={m.mobile.detailTitle} eyebrow={listing.city} showBack>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          {listing.image ? <Image source={{ uri: imageUri(listing.image) }} style={styles.heroImage} /> : null}
          <View style={styles.heroScrim}>
            <Text style={styles.heroLabel}>{propertyTypeLabel(listing.propertyType)}</Text>
          </View>
        </View>

        <View style={styles.cardFeatured}>
          <Text style={styles.price}>
            {formatMoney(listing.price, listing.currency)}
            {listing.listingType === "rent" ? m.listing.perMonth : ""}
          </Text>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.muted}>{listing.addressSummary}</Text>
          <View style={styles.facts}>
            <Text style={styles.fact}>{listing.beds} {m.listing.beds}</Text>
            <Text style={styles.fact}>{listing.baths} {m.listing.baths}</Text>
            <Text style={styles.fact}>{listing.areaSqft.toLocaleString()} {m.listing.sqft}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{m.listing.overview}</Text>
          <Text style={styles.paragraph}>{listing.description}</Text>
          <View style={styles.highlights}>
            {listing.highlights.map((highlight) => (
              <Text style={styles.highlight} key={highlight}>{highlight}</Text>
            ))}
          </View>
        </View>

        <View style={styles.cardDark}>
          <Text style={styles.agentEyebrow}>{m.listing.assignedAgent}</Text>
          <Text style={styles.agentName}>{listing.agentName}</Text>
          <Text style={styles.agentTitle}>{listing.agentTitle}</Text>
        </View>

        {isLoaded && isSignedIn ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{m.listing.requestVisit}</Text>
            <TextInput placeholder={m.leadForm.name} placeholderTextColor="#777" value={name} onChangeText={setName} style={styles.input} />
            <TextInput placeholder={m.leadForm.email} placeholderTextColor="#777" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input} />
            <TextInput placeholder={m.leadForm.message} placeholderTextColor="#777" value={message} onChangeText={setMessage} multiline style={[styles.input, styles.message]} />
            <Pressable style={[styles.cta, submitting && styles.ctaDisabled]} onPress={handleSubmit} disabled={submitting} accessibilityRole="button">
              <Text style={styles.ctaText}>{submitting ? m.leadForm.submitting : m.leadForm.submit}</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.cardDark}>
            <Text style={styles.agentEyebrow}>{m.mobile.accessRequired}</Text>
            <Text style={styles.agentName}>{m.mobile.accessSignIn}</Text>
            <Text style={styles.agentTitle}>{m.mobile.accessInfo}</Text>
            <Pressable style={styles.authCta} onPress={() => router.push("/sign-in")} accessibilityRole="button">
              <Text style={styles.authCtaText}>{m.mobile.signIn}</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </AppChrome>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16, padding: 18, paddingBottom: 28 },
  notFound: { color: "#777777", marginTop: 80, textAlign: "center" },
  hero: { backgroundColor: "#111111", borderRadius: 8, height: 280, justifyContent: "flex-end", overflow: "hidden", shadowColor: "#111111", shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.16, shadowRadius: 26 },
  heroImage: { ...StyleSheet.absoluteFill },
  heroScrim: { backgroundColor: "rgba(17,17,17,0.48)", padding: 18 },
  heroLabel: { color: "#f3bd21", fontSize: 12, fontWeight: "900", letterSpacing: 1.8, textTransform: "uppercase" },
  card: { backgroundColor: "#ffffff", borderRadius: 8, gap: 12, padding: 18, shadowColor: "#111111", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 20 },
  cardFeatured: { backgroundColor: "#ffffff", borderRadius: 8, gap: 10, padding: 18, shadowColor: "#111111", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.10, shadowRadius: 24 },
  cardDark: { backgroundColor: "#111111", borderRadius: 8, gap: 5, padding: 18, shadowColor: "#111111", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.16, shadowRadius: 24 },
  price: { color: "#111111", fontSize: 30, fontWeight: "900" },
  title: { color: "#111111", fontSize: 25, fontWeight: "900", lineHeight: 30 },
  muted: { color: "#666666" },
  facts: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  fact: { backgroundColor: "#f5f1e8", borderRadius: 6, color: "#333333", fontSize: 12, fontWeight: "800", overflow: "hidden", paddingHorizontal: 10, paddingVertical: 7 },
  sectionTitle: { color: "#111111", fontSize: 20, fontWeight: "900" },
  paragraph: { color: "#555555", fontSize: 16, lineHeight: 24 },
  highlights: { gap: 8 },
  highlight: { backgroundColor: "#f5f1e8", borderRadius: 6, color: "#333333", overflow: "hidden", padding: 12 },
  agentEyebrow: { color: "#f3bd21", fontSize: 11, fontWeight: "900", letterSpacing: 1.6, textTransform: "uppercase" },
  agentName: { color: "#ffffff", fontSize: 24, fontWeight: "900" },
  agentTitle: { color: "rgba(255,255,255,0.62)" },
  input: { borderColor: "rgba(17,17,17,0.12)", borderRadius: 8, borderWidth: 1, color: "#111111", padding: 14 },
  message: { minHeight: 96, textAlignVertical: "top" },
  cta: { alignItems: "center", backgroundColor: "#111111", borderRadius: 8, padding: 15 },
  ctaDisabled: { opacity: 0.5 },
  ctaText: { color: "#ffffff", fontWeight: "900" },
  authCta: { alignItems: "center", backgroundColor: "#f3bd21", borderRadius: 8, marginTop: 10, padding: 15 },
  authCtaText: { color: "#111111", fontWeight: "900" }
});
