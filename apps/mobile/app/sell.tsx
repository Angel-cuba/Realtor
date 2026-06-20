import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppChrome } from "../components/app-chrome";
import { ProfileLoadingState } from "../components/loading-states";

export default function SellScreen() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <AppChrome title="Vender" eyebrow="Publicar">
        <ProfileLoadingState />
      </AppChrome>
    );
  }

  return (
    <AppChrome title="Vender" eyebrow="Publicar">
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.kicker}>Propietarios</Text>
          <Text style={styles.title}>Prepara tu propiedad para salir al mercado.</Text>
          <Text style={styles.copy}>
            Mobile funciona como viewer. Para coordinar una venta, conecta con tu cuenta y un asesor revisara los datos antes de publicar.
          </Text>
        </View>

        <View style={styles.stepsCard}>
          <View style={styles.stepRow}>
            <View style={styles.stepMark}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>Datos basicos</Text>
              <Text style={styles.stepCopy}>Direccion, tipo de propiedad y rango esperado.</Text>
            </View>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepMark}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>Fotos y revision</Text>
              <Text style={styles.stepCopy}>El equipo confirma calidad, precio y comparables.</Text>
            </View>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepMark}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>Publicacion</Text>
              <Text style={styles.stepCopy}>La ficha queda lista para compradores y renters.</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>{isSignedIn ? "Cuenta lista" : "Inicia sesion para avanzar"}</Text>
          <Text style={styles.actionCopy}>
            {isSignedIn
              ? "Tu asesor puede recibir la solicitud y continuar el alta desde dashboard."
              : "Explorar es libre, pero vender requiere cuenta para proteger tus datos y dar seguimiento."}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(isSignedIn ? "/profile" : "/sign-in")}
            style={styles.cta}
          >
            <Text style={styles.ctaText}>{isSignedIn ? "Ver perfil" : "Iniciar sesion"}</Text>
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
