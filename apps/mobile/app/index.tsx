import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { formatMoney, type PropertyListing } from "@realtor/domain";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

type ListingPreview = Pick<
  PropertyListing,
  "slug" | "title" | "city" | "neighborhood" | "price" | "currency" | "beds" | "baths" | "areaSqft" | "listingType" | "propertyType" | "tags"
>;

export default function ExploreScreen() {
  const [listings, setListings] = useState<ListingPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<"sale" | "rent">("sale");

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/listings?type=${type}`)
      .then((r) => r.json())
      .then((data) => setListings(data.listings ?? []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, [type]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.slug}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Buy, sell, rent</Text>
            <Text style={styles.title}>Find homes with market clarity.</Text>
            <View style={styles.searchBox}>
              <TextInput placeholder="City, neighborhood, or ZIP" placeholderTextColor="#777" style={styles.input} />
              <Pressable style={styles.searchButton}>
                <Text style={styles.searchButtonText}>Search</Text>
              </Pressable>
            </View>
            <View style={styles.segment}>
              <Pressable onPress={() => setType("sale")}>
                <Text style={[styles.segmentItem, type === "sale" && styles.segmentActive]}>Buy</Text>
              </Pressable>
              <Pressable onPress={() => setType("rent")}>
                <Text style={[styles.segmentItem, type === "rent" && styles.segmentActive]}>Rent</Text>
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={styles.loader} color="#8c6a00" />
          ) : (
            <Text style={styles.empty}>No listings found.</Text>
          )
        }
        renderItem={({ item }) => (
          <Link href={`/property/${item.slug}`} asChild>
            <Pressable style={styles.card}>
              <View style={styles.imageBlock}>
                <Text style={styles.imageText}>{item.propertyType.toUpperCase()}</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.price}>
                  {formatMoney(item.price, item.currency)}
                  {item.listingType === "rent" ? "/mo" : ""}
                </Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.muted}>
                  {item.neighborhood}, {item.city}
                </Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8f5ed" },
  content: { padding: 18, gap: 16 },
  header: { gap: 16, paddingTop: 18 },
  eyebrow: { color: "#8c6a00", fontSize: 12, fontWeight: "700", letterSpacing: 2, textTransform: "uppercase" },
  title: { color: "#111111", fontSize: 42, fontWeight: "800", lineHeight: 44 },
  searchBox: { backgroundColor: "#ffffff", borderRadius: 8, padding: 10, gap: 10 },
  input: { borderColor: "rgba(17,17,17,0.12)", borderRadius: 8, borderWidth: 1, padding: 14 },
  searchButton: { alignItems: "center", backgroundColor: "#f3bd21", borderRadius: 8, padding: 14 },
  searchButtonText: { color: "#111111", fontWeight: "800" },
  segment: { flexDirection: "row", gap: 8 },
  segmentItem: { borderColor: "rgba(17,17,17,0.12)", borderRadius: 8, borderWidth: 1, color: "#555", overflow: "hidden", paddingHorizontal: 14, paddingVertical: 10 },
  segmentActive: { backgroundColor: "#111111", color: "#ffffff" },
  card: { backgroundColor: "#ffffff", borderRadius: 8, overflow: "hidden" },
  imageBlock: { alignItems: "flex-start", backgroundColor: "#111111", height: 170, justifyContent: "flex-end", padding: 16 },
  imageText: { color: "#f3bd21", fontSize: 12, fontWeight: "800", letterSpacing: 2 },
  cardBody: { gap: 8, padding: 16 },
  price: { color: "#111111", fontSize: 24, fontWeight: "800" },
  cardTitle: { color: "#111111", fontSize: 17, fontWeight: "700", lineHeight: 22 },
  muted: { color: "#666" },
  facts: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingTop: 6 },
  fact: { backgroundColor: "#f5f1e8", borderRadius: 6, color: "#333", fontSize: 12, fontWeight: "700", paddingHorizontal: 10, paddingVertical: 7 },
  loader: { marginTop: 48 },
  empty: { color: "#999", textAlign: "center", marginTop: 48 },
});
