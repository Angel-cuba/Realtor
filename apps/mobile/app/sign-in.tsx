import { useEffect, useState } from "react";
import { isClerkAPIResponseError, useAuth } from "@clerk/expo";
import { useSignIn, useSignUp } from "@clerk/expo/legacy";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { AppChrome } from "../components/app-chrome";
import { useLocale } from "../contexts/locale-context";

type AuthMode = "signIn" | "signUp";

export default function SignInScreen() {
  const { isSignedIn } = useAuth();
  const signInState = useSignIn();
  const signUpState = useSignUp();
  const { messages: m } = useLocale();
  const [mode, setMode] = useState<AuthMode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isSignedIn) router.replace("/profile");
  }, [isSignedIn]);

  function authErrorMessage(errorValue: unknown) {
    if (isClerkAPIResponseError(errorValue)) {
      return errorValue.errors.map((item) => item.longMessage ?? item.message).filter(Boolean).join("\n");
    }
    return errorValue instanceof Error ? errorValue.message : m.mobile.authGenericError;
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setPendingVerification(false);
    setCode("");
    setError(null);
  }

  async function handleSignIn() {
    if (!signInState.isLoaded || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const result = await signInState.signIn.create({
        identifier: email.trim(),
        password
      });

      if (result.status === "complete" && result.createdSessionId) {
        await signInState.setActive({ session: result.createdSessionId });
        router.replace("/profile");
      } else {
        setError(m.mobile.authIncomplete);
      }
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignUp() {
    if (!signUpState.isLoaded || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      await signUpState.signUp.create({
        emailAddress: email.trim(),
        password
      });
      await signUpState.signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyEmail() {
    if (!signUpState.isLoaded || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const result = await signUpState.signUp.attemptEmailAddressVerification({ code: code.trim() });

      if (result.status === "complete" && result.createdSessionId) {
        await signUpState.setActive({ session: result.createdSessionId });
        router.replace("/profile");
      } else {
        setError(m.mobile.authIncomplete);
      }
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const isLoaded = signInState.isLoaded && signUpState.isLoaded;
  const canSubmit = isLoaded && email.trim().length > 3 && password.length >= 1 && !submitting;
  const primaryLabel =
    mode === "signIn"
      ? m.mobile.signIn
      : pendingVerification
        ? m.mobile.verifyEmail
        : m.mobile.sendVerificationCode;

  return (
    <AppChrome title={m.mobile.signInTitleBar} eyebrow={m.mobile.signInEyebrow}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>{m.mobile.signInTitle}</Text>
          <Text style={styles.copy}>{m.mobile.signInCopy}</Text>
        </View>
        <View style={styles.authCard}>
          <View style={styles.modeSwitch}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: mode === "signIn" }}
              onPress={() => switchMode("signIn")}
              style={[styles.modeButton, mode === "signIn" && styles.modeButtonActive]}
            >
              <Text style={[styles.modeText, mode === "signIn" && styles.modeTextActive]}>{m.mobile.signIn}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: mode === "signUp" }}
              onPress={() => switchMode("signUp")}
              style={[styles.modeButton, mode === "signUp" && styles.modeButtonActive]}
            >
              <Text style={[styles.modeText, mode === "signUp" && styles.modeTextActive]}>{m.mobile.createAccount}</Text>
            </Pressable>
          </View>

          {pendingVerification ? (
            <Text style={styles.helper}>{m.mobile.verificationCopy}</Text>
          ) : null}

          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            editable={!pendingVerification && !submitting}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder={m.mobile.email}
            placeholderTextColor="#777"
            style={styles.input}
            textContentType="emailAddress"
            value={email}
          />
          {!pendingVerification ? (
            <TextInput
              autoCapitalize="none"
              editable={!submitting}
              onChangeText={setPassword}
              placeholder={m.mobile.password}
              placeholderTextColor="#777"
              secureTextEntry
              style={styles.input}
              textContentType={mode === "signIn" ? "password" : "newPassword"}
              value={password}
            />
          ) : (
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="number-pad"
              onChangeText={setCode}
              placeholder={m.mobile.verificationCode}
              placeholderTextColor="#777"
              style={styles.input}
              textContentType="oneTimeCode"
              value={code}
            />
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            accessibilityRole="button"
            disabled={pendingVerification ? code.trim().length < 4 || submitting : !canSubmit}
            onPress={mode === "signIn" ? handleSignIn : pendingVerification ? handleVerifyEmail : handleSignUp}
            style={[styles.cta, ((pendingVerification ? code.trim().length < 4 : !canSubmit) || submitting) && styles.ctaDisabled]}
          >
            <Text style={styles.ctaText}>{submitting ? m.mobile.authSubmitting : primaryLabel}</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => switchMode(mode === "signIn" ? "signUp" : "signIn")}
            style={styles.secondaryCta}
          >
            <Text style={styles.secondaryCtaText}>{mode === "signIn" ? m.mobile.switchToRegister : m.mobile.switchToSignIn}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </AppChrome>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16, padding: 18, paddingBottom: 28 },
  header: { backgroundColor: "#111111", borderRadius: 8, gap: 8, padding: 18 },
  title: { color: "#ffffff", fontSize: 28, fontWeight: "900", lineHeight: 32 },
  copy: { color: "rgba(255,255,255,0.68)", lineHeight: 21 },
  authCard: { backgroundColor: "#ffffff", borderRadius: 8, gap: 12, padding: 18, shadowColor: "#111111", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.10, shadowRadius: 24 },
  modeSwitch: { backgroundColor: "#f5f1e8", borderRadius: 8, flexDirection: "row", gap: 4, padding: 4 },
  modeButton: { alignItems: "center", borderRadius: 6, flex: 1, paddingHorizontal: 8, paddingVertical: 10 },
  modeButtonActive: { backgroundColor: "#111111" },
  modeText: { color: "#666666", fontWeight: "900" },
  modeTextActive: { color: "#ffffff" },
  helper: { color: "#666666", lineHeight: 20 },
  input: { borderColor: "rgba(17,17,17,0.12)", borderRadius: 8, borderWidth: 1, color: "#111111", padding: 14 },
  error: { color: "#b42318", fontSize: 13, fontWeight: "700", lineHeight: 19 },
  cta: { alignItems: "center", backgroundColor: "#111111", borderRadius: 8, padding: 15 },
  ctaDisabled: { opacity: 0.5 },
  ctaText: { color: "#ffffff", fontWeight: "900" },
  secondaryCta: { alignItems: "center", padding: 8 },
  secondaryCtaText: { color: "#8c6a00", fontWeight: "900" }
});
