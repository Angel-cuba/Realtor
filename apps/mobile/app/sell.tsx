import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppChrome } from "../components/app-chrome";
import { ProfileLoadingState } from "../components/loading-states";
import { useLocale } from "../contexts/locale-context";

export default function SellScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { messages: m } = useLocale();

  if (!isLoaded) {
    return (
      <AppChrome title={m.mobile.sell} eyebrow={m.mobile.sellEyebrow}>
        <ProfileLoadingState />
      </AppChrome>
    );
  }

  return (
    <AppChrome title={m.mobile.sell} eyebrow={m.mobile.sellEyebrow}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.kicker}>{m.mobile.sellKicker}</Text>
          <Text style={styles.title}>{m.mobile.sellTitle}</Text>
          <Text style={styles.copy}>{m.mobile.sellCopy}</Text>
        </View>

        <View style={styles.stepsCard}>
          <View style={styles.stepRow}>
            <View style={styles.stepMark}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>{m.mobile.sellStep1Title}</Text>
              <Text style={styles.stepCopy}>{m.mobile.sellStep1Copy}</Text>
            </View>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepMark}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>{m.mobile.sellStep2Title}</Text>
              <Text style={styles.stepCopy}>{m.mobile.sellStep2Copy}</Text>
            </View>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepMark}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>{m.mobile.sellStep3Title}</Text>
              <Text style={styles.stepCopy}>{m.mobile.sellStep3Copy}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>{isSignedIn ? m.mobile.accountReady : m.mobile.signInToAdvance}</Text>
          <Text style={styles.actionCopy}>{isSignedIn ? m.mobile.accountReadyCopy : m.mobile.signInToAdvanceCopy}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(isSignedIn ? "/profile" : "/sign-in")}
            style={styles.cta}
          >
            <Text style={styles.ctaText}>{isSignedIn ? m.mobile.viewProfile : m.mobile.signIn}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </AppChrome>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16, padding: 18, paddingBottom: 28 },
  heroCard: { backgroundColor: "#111111", borderRadius: 8, gap: 10, padding: 20, shadowColor: "#111111", shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.18, shadowRadius: 26 },
  kicker: { color: "#f3bd21", fontSize: 11, fontWeight: "900", letterSpacing: 1.6, textTransform: "uppercase" },
  title: { color: "#ffffff", fontSize: 31, fontWeight: "900", lineHeight: 35 },
  copy: { color: "rgba(255,255,255,0.68)", fontSize: 15, lineHeight: 22 },
  stepsCard: { backgroundColor: "#ffffff", borderRadius: 8, gap: 14, padding: 18 },
  stepRow: { alignItems: "center", flexDirection: "row", gap: 14 },
  stepMark: { alignItems: "center", backgroundColor: "#f3bd21", borderRadius: 8, height: 38, justifyContent: "center", width: 38 },
  stepNumber: { color: "#111111", fontWeight: "900" },
  stepText: { flex: 1, gap: 2 },
  stepTitle: { color: "#111111", fontSize: 16, fontWeight: "900" },
  stepCopy: { color: "#666666", lineHeight: 20 },
  actionCard: { backgroundColor: "#ffffff", borderRadius: 8, gap: 8, padding: 18, shadowColor: "#111111", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.10, shadowRadius: 24 },
  actionTitle: { color: "#111111", fontSize: 22, fontWeight: "900" },
  actionCopy: { color: "#666666", lineHeight: 21 },
  cta: { alignItems: "center", backgroundColor: "#111111", borderRadius: 8, marginTop: 8, padding: 14 },
  ctaText: { color: "#ffffff", fontWeight: "900" }
});
