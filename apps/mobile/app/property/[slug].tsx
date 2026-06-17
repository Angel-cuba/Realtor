import { Stack, useLocalSearchParams } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { formatMoney } from "@realtor/domain";

const listing = {
  title: "Hillcrest modern villa with private courtyard",
  city: "Austin",
  neighborhood: "Hillcrest",
  price: 1285000,
  currency: "USD" as const,
  beds: 5,
  baths: 4,
  areaSqft: 4210,
  description:
    "A calm modern villa designed for indoor-outdoor living, with bright social spaces, a private courtyard, and a flexible guest suite.",
  highlights: ["Private courtyard", "Chef-ready kitchen", "Two-car garage", "Minutes from dining"],
  agentName: "Maya Collins"
};

export default function PropertyScreen() {
  const params = useLocalSearchParams<{ slug: string }>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: "Property" }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>{params.slug}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.price}>{formatMoney(listing.price, listing.currency)}</Text>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.muted}>
            {listing.neighborhood}, {listing.city}
          </Text>
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
              <Text style={styles.highlight} key={highlight}>
                {highlight}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contact {listing.agentName}</Text>
          <TextInput placeholder="Name" placeholderTextColor="#777" style={styles.input} />
          <TextInput placeholder="Email" placeholderTextColor="#777" style={styles.input} />
          <TextInput placeholder="Message" placeholderTextColor="#777" multiline style={[styles.input, styles.message]} />
          <Pressable style={styles.cta}>
            <Text style={styles.ctaText}>Request a tour</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f5ed"
  },
  content: {
    gap: 16,
    padding: 18
  },
  hero: {
    backgroundColor: "#111111",
    borderRadius: 8,
    height: 260,
    justifyContent: "flex-end",
    padding: 18
  },
  heroLabel: {
    color: "#f3bd21",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase"
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    gap: 12,
    padding: 18
  },
  price: {
    color: "#111111",
    fontSize: 30,
    fontWeight: "800"
  },
  title: {
    color: "#111111",
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 30
  },
  muted: {
    color: "#666"
  },
  facts: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  fact: {
    backgroundColor: "#f5f1e8",
    borderRadius: 6,
    color: "#333",
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  sectionTitle: {
    color: "#111111",
    fontSize: 20,
    fontWeight: "800"
  },
  paragraph: {
    color: "#555",
    fontSize: 16,
    lineHeight: 24
  },
  highlights: {
    gap: 8
  },
  highlight: {
    backgroundColor: "#f5f1e8",
    borderRadius: 6,
    color: "#333",
    overflow: "hidden",
    padding: 12
  },
  input: {
    borderColor: "rgba(17,17,17,0.12)",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14
  },
  message: {
    minHeight: 96,
    textAlignVertical: "top"
  },
  cta: {
    alignItems: "center",
    backgroundColor: "#111111",
    borderRadius: 8,
    padding: 15
  },
  ctaText: {
    color: "#ffffff",
    fontWeight: "800"
  }
});
