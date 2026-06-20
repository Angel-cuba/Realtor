import { useEffect, useMemo, useState } from "react";
import { Link } from "expo-router";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { formatMoney, propertyTypeLabel, type PropertyListing } from "@realtor/domain";
import { AppChrome } from "../components/app-chrome";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

function imageUri(src: string) {
  return src.startsWith("http") ? src : API_URL + src;
}

type ListingPreview = Pick<
  PropertyListing,
  | "slug"
  | "title"
  | "city"
  | "neighborhood"
  | "price"
  | "currency"
  | "beds"
  | "baths"
  | "areaSqft"
  | "listingType"
  | "propertyType"
  | "image"
  | "tags"
>;

export default function ExploreScreen() {
  const [listings, setListings] = useState<ListingPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<"sale" | "rent">("sale");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(API_URL + "/api/listings?type=" + type)
      .then((r) => r.json())
      .then((data) => setListings(data.listings ?? []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, [type]);

  const visibleListings = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return listings;
    return listings.filter((item) => (item.title + " " + item.city + " " + item.neighborhood).toLowerCase().includes(q));
  }, [listings, query]);

  return (
    <AppChrome title="Explorar" eyebrow="Mercado activo">
      <FlatList
        data={visibleListings}
        keyExtractor={(item) => item.slug}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{listings.length}</Text>
                <Text style={styles.summaryLabel}>{type === "sale" ? "en venta" : "en renta"}</Text>
              </View>
              <View style={styles.summaryCardDark}>
                <Text style={styles.summaryValueDark}>13</Text>
                <Text style={styles.summaryLabelDark}>ciudades demo</Text>
              </View>
            </View>

            <Text style={styles.heroTitle}>Propiedades claras, listas para comparar.</Text>
            <Text style={styles.heroCopy}>Busca por ciudad o barrio y revisa los datos clave sin ruido.</Text>

            <View style={styles.searchBox}>
              <TextInput
                placeholder="Ciudad o barrio"
                placeholderTextColor="#777"
                style={styles.input}
                value={query}
                onChangeText={setQuery}
              />
            </View>

            <View style={styles.segment}>
              <Pressable onPress={() => setType("sale")} style={[styles.segmentButton, type === "sale" && styles.segmentActive]}>
                <Text style={[styles.segmentText, type === "sale" && styles.segmentTextActive]}>Comprar</Text>
              </Pressable>
              <Pressable onPress={() => setType("rent")} style={[styles.segmentButton, type === "rent" && styles.segmentActive]}>
                <Text style={[styles.segmentText, type === "rent" && styles.segmentTextActive]}>Rentar</Text>
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? <ActivityIndicator style={styles.loader} color="#8c6a00" /> : <Text style={styles.empty}>No hay resultados para esta busqueda.</Text>
        }
        renderItem={({ item }) => (
          <Link href={("/property/" + item.slug) as never} asChild>
            <Pressable style={styles.card}>
              <View style={styles.imageBlock}>
                {item.image ? <Image source={{ uri: imageUri(item.image) }} style={styles.image} /> : null}
                <View style={styles.imageOverlay}>
                  <Text style={styles.imageText}>{propertyTypeLabel(item.propertyType)}</Text>
                </View>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>
                    {formatMoney(item.price, item.currency)}
                    {item.listingType === "rent" ? "/mo" : ""}
                  </Text>
                  <Text style={styles.typeBadge}>{item.listingType === "rent" ? "Renta" : "Venta"}</Text>
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.muted}>{item.neighborhood}, {item.city}</Text>
                <View style={styles.facts}>
                  <Text style={styles.fact}>{item.beds || "-"} beds</Text>
                  <Text style={styles.fact}>{item.baths || "-"} baths</Text>
                  <Text style={styles.fact}>{item.areaSqft.toLocaleString()} sqft</Text>
                </View>
              </View>
            </Pressable>
          </Link>
        )}
      />
    </AppChrome>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16, padding: 18, paddingBottom: 28 },
  header: { gap: 16, paddingTop: 6 },
  summaryRow: { flexDirection: "row", gap: 12 },
  summaryCard: { backgroundColor: "#ffffff", borderRadius: 8, flex: 1, padding: 14, shadowColor: "#111111", shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 10 } },
  summaryCardDark: { backgroundColor: "#111111", borderRadius: 8, flex: 1, padding: 14, shadowColor: "#111111", shadowOpacity: 0.16, shadowRadius: 22, shadowOffset: { width: 0, height: 12 } },
  summaryValue: { color: "#111111", fontSize: 28, fontWeight: "900" },
  summaryLabel: { color: "#666666", fontSize: 12, fontWeight: "800", marginTop: 2, textTransform: "uppercase" },
  summaryValueDark: { color: "#f3bd21", fontSize: 28, fontWeight: "900" },
  summaryLabelDark: { color: "rgba(255,255,255,0.68)", fontSize: 12, fontWeight: "800", marginTop: 2, textTransform: "uppercase" },
  heroTitle: { color: "#111111", fontSize: 34, fontWeight: "900", lineHeight: 37 },
  heroCopy: { color: "#5f5b52", fontSize: 15, lineHeight: 22 },
  searchBox: { backgroundColor: "#ffffff", borderRadius: 8, padding: 10, shadowColor: "#111111", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 18 },
  input: { borderColor: "rgba(17,17,17,0.12)", borderRadius: 8, borderWidth: 1, color: "#111111", padding: 14 },
  segment: { backgroundColor: "rgba(17,17,17,0.06)", borderRadius: 8, flexDirection: "row", gap: 6, padding: 5 },
  segmentButton: { alignItems: "center", borderRadius: 7, flex: 1, paddingVertical: 11 },
  segmentActive: { backgroundColor: "#111111" },
  segmentText: { color: "#555555", fontWeight: "900" },
  segmentTextActive: { color: "#ffffff" },
  card: { backgroundColor: "#ffffff", borderRadius: 8, overflow: "hidden", shadowColor: "#111111", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.10, shadowRadius: 24 },
  imageBlock: { backgroundColor: "#111111", height: 184, justifyContent: "flex-end" },
  image: { ...StyleSheet.absoluteFill },
  imageOverlay: { backgroundColor: "rgba(17,17,17,0.42)", padding: 14 },
  imageText: { color: "#f3bd21", fontSize: 12, fontWeight: "900", letterSpacing: 1.8, textTransform: "uppercase" },
  cardBody: { gap: 8, padding: 16 },
  priceRow: { alignItems: "center", flexDirection: "row", gap: 10, justifyContent: "space-between" },
  price: { color: "#111111", flex: 1, fontSize: 23, fontWeight: "900" },
  typeBadge: { backgroundColor: "#f5f1e8", borderRadius: 6, color: "#111111", fontSize: 11, fontWeight: "900", overflow: "hidden", paddingHorizontal: 9, paddingVertical: 6 },
  cardTitle: { color: "#111111", fontSize: 17, fontWeight: "800", lineHeight: 22 },
  muted: { color: "#666666" },
  facts: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingTop: 6 },
  fact: { backgroundColor: "#f5f1e8", borderRadius: 6, color: "#333333", fontSize: 12, fontWeight: "800", overflow: "hidden", paddingHorizontal: 10, paddingVertical: 7 },
  loader: { marginTop: 48 },
  empty: { color: "#777777", marginTop: 48, textAlign: "center" }
});
