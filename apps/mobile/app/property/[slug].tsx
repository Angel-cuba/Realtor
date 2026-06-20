import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { formatMoney, propertyTypeLabel, type PropertyListing } from "@realtor/domain";
import { AppChrome } from "../../components/app-chrome";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

function imageUri(src: string) {
  return src.startsWith("http") ? src : API_URL + src;
}

export default function PropertyScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
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
    if (!name.trim() || !email.trim() || message.trim().length < 10) {
      Alert.alert("Campos incompletos", "Completa nombre, email y un mensaje de al menos 10 caracteres.");
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
        Alert.alert("Enviado", "Tu mensaje llego al agente. Te contactaremos pronto.");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        Alert.alert("Error", "No se pudo enviar. Intenta de nuevo.");
      }
    } catch {
      Alert.alert("Error", "Sin conexion. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <AppChrome title="Propiedad" eyebrow="Cargando detalle">
        <ActivityIndicator style={styles.loader} color="#8c6a00" />
      </AppChrome>
    );
  }

  if (!listing) {
    return (
      <AppChrome title="Propiedad" eyebrow="No encontrada">
        <Text style={styles.notFound}>Propiedad no encontrada.</Text>
      </AppChrome>
    );
  }

  return (
    <AppChrome title="Detalle" eyebrow={listing.city}>
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
            {listing.listingType === "rent" ? "/mo" : ""}
          </Text>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.muted}>{listing.addressSummary}</Text>
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

        <View style={styles.cardDark}>
          <Text style={styles.agentEyebrow}>Assigned agent</Text>
          <Text style={styles.agentName}>{listing.agentName}</Text>
          <Text style={styles.agentTitle}>{listing.agentTitle}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Solicitar visita</Text>
          <TextInput placeholder="Nombre" placeholderTextColor="#777" value={name} onChangeText={setName} style={styles.input} />
          <TextInput placeholder="Email" placeholderTextColor="#777" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input} />
          <TextInput placeholder="Mensaje" placeholderTextColor="#777" value={message} onChangeText={setMessage} multiline style={[styles.input, styles.message]} />
          <Pressable style={[styles.cta, submitting && styles.ctaDisabled]} onPress={handleSubmit} disabled={submitting}>
            <Text style={styles.ctaText}>{submitting ? "Enviando..." : "Enviar solicitud"}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </AppChrome>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16, padding: 18, paddingBottom: 28 },
  loader: { marginTop: 80 },
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
  ctaText: { color: "#ffffff", fontWeight: "900" }
});
