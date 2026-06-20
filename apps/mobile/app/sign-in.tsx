import { useEffect } from "react";
import { useAuth } from "@clerk/expo";
import { AuthView } from "@clerk/expo/native";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AppChrome } from "../components/app-chrome";

export default function SignInScreen() {
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) router.replace("/profile");
  }, [isSignedIn]);

  return (
    <AppChrome title="Sesion" eyebrow="Acceso">
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Entra para solicitar visitas.</Text>
          <Text style={styles.copy}>Puedes explorar propiedades sin cuenta. Para comprar, rentar o contactar un asesor, inicia sesion.</Text>
        </View>
        <View style={styles.authCard}>
          <AuthView mode="signInOrUp" />
        </View>
      </View>
    </AppChrome>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16, padding: 18, paddingBottom: 28 },
  header: { backgroundColor: "#111111", borderRadius: 8, gap: 8, padding: 18 },
  title: { color: "#ffffff", fontSize: 28, fontWeight: "900", lineHeight: 32 },
  copy: { color: "rgba(255,255,255,0.68)", lineHeight: 21 },
  authCard: { backgroundColor: "#ffffff", borderRadius: 8, minHeight: 420, overflow: "hidden" }
});
