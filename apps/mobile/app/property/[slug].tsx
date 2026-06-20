import { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { formatMoney, type PropertyListing } from "@realtor/domain";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export default function PropertyScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [listing, setListing] = useState<PropertyListing | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/listings/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setListing(data?.listing ?? null))
      .catch(() => setListing(null))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleSubmit() {
    if (!name.trim() || !email.trim() || message.trim().length < 10) {
      Alert.alert("Campos incompletos", "Completa nombre, email y un mensaje de al menos 10 caracteres.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          intent: "buy",
          listingSlug: slug,
        }),
      });

      if (res.ok) {
        Alert.alert("Enviado", "Tu mensaje llegó al agente. Te contactaremos pronto.");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        Alert.alert("Error", "No se pudo enviar. Intenta de nuevo.");
      }
    } catch {
      Alert.alert("Error", "Sin conexión. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ title: "Propiedad" }} />
        <ActivityIndicator style={styles.loader} color="#8c6a00" />
      </SafeAreaView>
    );
  }

  if (!listing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ title: "Propiedad" }} />
        <Text style={styles.notFound}>Propiedad no encontrada.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: listing.title }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>{listing.propertyType.toUpperCase()}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.price}>
            {formatMoney(listing.price, listing.currency)}
            {listing.listingType === "rent" ? "/mo" : ""}
          </Text>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.muted}>{listing.neighborhood}, {listing.city}</Text>
          <View style={styles.facts}>
            <Text style={styles.fact}>{listing.beds} beds</Text>
            <Text style={styles.fact}>{listing.baths} baths</Text>
            <Text style={styles.fact}>{listing.areaSqft.toLocaleString()} sqft</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.paragraph}>{listing.description}</Text>
          <View style={styles.highlights}>
            {listing.highlights.map((highlight) => (
              <Text style={styles.highlight} key={highlight}>{highlight}</Text>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contact {listing.agentName}</Text>
          <TextInput
            placeholder="Name"
            placeholderTextColor="#777"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#777"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            placeholder="Message"
            placeholderTextColor="#777"
            value={message}
            onChangeText={setMessage}
            multiline
            style={[styles.input, styles.message]}
          />
          <Pressable style={[styles.cta, submitting && styles.ctaDisabled]} onPress={handleSubmit} disabled={submitting}>
            <Text style={styles.ctaText}>{submitting ? "Sending…" : "Request a tour"}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8f5ed" },
  content: { gap: 16, padding: 18 },
  loader: { marginTop: 80 },
  notFound: { color: "#999", textAlign: "center", marginTop: 80 },
  hero: { backgroundColor: "#111111", borderRadius: 8, height: 260, justifyContent: "flex-end", padding: 18 },
  heroLabel: { color: "#f3bd21", fontSize: 12, fontWeight: "800", letterSpacing: 2, textTransform: "uppercase" },
  card: { backgroundColor: "#ffffff", borderRadius: 8, gap: 12, padding: 18 },
  price: { color: "#111111", fontSize: 30, fontWeight: "800" },
  title: { color: "#111111", fontSize: 26, fontWeight: "800", lineHeight: 30 },
  muted: { color: "#666" },
  facts: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  fact: { backgroundColor: "#f5f1e8", borderRadius: 6, color: "#333", fontSize: 12, fontWeight: "700", paddingHorizontal: 10, paddingVertical: 7 },
  sectionTitle: { color: "#111111", fontSize: 20, fontWeight: "800" },
  paragraph: { color: "#555", fontSize: 16, lineHeight: 24 },
  highlights: { gap: 8 },
  highlight: { backgroundColor: "#f5f1e8", borderRadius: 6, color: "#333", overflow: "hidden", padding: 12 },
  input: { borderColor: "rgba(17,17,17,0.12)", borderRadius: 8, borderWidth: 1, padding: 14 },
  message: { minHeight: 96, textAlignVertical: "top" },
  cta: { alignItems: "center", backgroundColor: "#111111", borderRadius: 8, padding: 15 },
  ctaDisabled: { opacity: 0.5 },
  ctaText: { color: "#ffffff", fontWeight: "800" },
});
