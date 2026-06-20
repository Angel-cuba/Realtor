import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

function PulseBlock({ style }: { style?: object }) {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { duration: 780, toValue: 1, useNativeDriver: true }),
        Animated.timing(opacity, { duration: 780, toValue: 0.45, useNativeDriver: true })
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return <Animated.View style={[styles.block, style, { opacity }]} />;
}

export function ListingsLoadingState() {
  return (
    <View style={styles.screen}>
      <View style={styles.summaryRow}>
        <PulseBlock style={styles.summaryCard} />
        <PulseBlock style={styles.summaryCardDark} />
      </View>
      <PulseBlock style={styles.heroLine} />
      <PulseBlock style={styles.copyLine} />
      <PulseBlock style={styles.search} />
      {[0, 1, 2].map((item) => (
        <View style={styles.card} key={item}>
          <PulseBlock style={styles.image} />
          <View style={styles.cardBody}>
            <PulseBlock style={styles.price} />
            <PulseBlock style={styles.title} />
            <PulseBlock style={styles.meta} />
          </View>
        </View>
      ))}
    </View>
  );
}

export function PropertyLoadingState() {
  return (
    <View style={styles.screen}>
      <PulseBlock style={styles.detailHero} />
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <PulseBlock style={styles.price} />
          <PulseBlock style={styles.detailTitle} />
          <PulseBlock style={styles.meta} />
          <View style={styles.factRow}>
            <PulseBlock style={styles.fact} />
            <PulseBlock style={styles.fact} />
            <PulseBlock style={styles.factWide} />
          </View>
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <PulseBlock style={styles.title} />
          <PulseBlock style={styles.copyLineFull} />
          <PulseBlock style={styles.copyLineFull} />
          <PulseBlock style={styles.copyLineShort} />
        </View>
      </View>
      <PulseBlock style={styles.darkPanel} />
    </View>
  );
}

export function ProfileLoadingState() {
  return (
    <View style={styles.screen}>
      <PulseBlock style={styles.profileHero} />
      <View style={styles.summaryRow}>
        <PulseBlock style={styles.smallStat} />
        <PulseBlock style={styles.smallStat} />
        <PulseBlock style={styles.smallStat} />
      </View>
      <PulseBlock style={styles.darkPanel} />
    </View>
  );
}

const styles = StyleSheet.create({
  block: { backgroundColor: "rgba(17,17,17,0.08)", borderRadius: 8 },
  screen: { gap: 16, padding: 18, paddingBottom: 28 },
  summaryRow: { flexDirection: "row", gap: 12 },
  summaryCard: { flex: 1, height: 76 },
  summaryCardDark: { backgroundColor: "rgba(17,17,17,0.18)", flex: 1, height: 76 },
  heroLine: { height: 36, width: "86%" },
  copyLine: { height: 18, width: "72%" },
  copyLineFull: { height: 15, width: "100%" },
  copyLineShort: { height: 15, width: "66%" },
  search: { height: 62 },
  card: { backgroundColor: "#ffffff", borderRadius: 8, overflow: "hidden" },
  image: { borderRadius: 0, height: 184 },
  cardBody: { gap: 10, padding: 16 },
  price: { height: 28, width: "48%" },
  title: { height: 20, width: "78%" },
  detailTitle: { height: 30, width: "88%" },
  meta: { height: 16, width: "62%" },
  detailHero: { height: 280 },
  factRow: { flexDirection: "row", gap: 8, paddingTop: 6 },
  fact: { height: 30, width: 66 },
  factWide: { height: 30, width: 88 },
  darkPanel: { backgroundColor: "rgba(17,17,17,0.18)", height: 128 },
  profileHero: { height: 94 },
  smallStat: { flex: 1, height: 72 }
});
