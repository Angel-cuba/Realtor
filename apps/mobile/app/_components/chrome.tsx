import { Link, usePathname } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

const tabs = [
  { href: "/", label: "Explorar", match: "/" },
  { href: "/profile", label: "Perfil", match: "/profile" }
] as const;

type AppChromeProps = {
  title?: string;
  eyebrow?: string;
  children: React.ReactNode;
};

export function AppChrome({ title = "Realtor", eyebrow = "Premium homes", children }: AppChromeProps) {
  const pathname = usePathname();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Link href="/profile" asChild>
          <Pressable accessibilityRole="button" accessibilityLabel="Abrir perfil" style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </Pressable>
        </Link>
      </View>
      <View style={styles.body}>{children}</View>
      <View style={styles.bottomBar}>
        {tabs.map((tab) => {
          const active = tab.match === "/" ? pathname === "/" : pathname.startsWith(tab.match);
          return (
            <Link href={tab.href} asChild key={tab.href}>
              <Pressable accessibilityRole="button" style={[styles.tab, active && styles.tabActive]}>
                <View style={[styles.tabDot, active && styles.tabDotActive]} />
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8f5ed" },
  topBar: {
    alignItems: "center",
    backgroundColor: "rgba(248,245,237,0.96)",
    borderBottomColor: "rgba(17,17,17,0.08)",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12
  },
  eyebrow: { color: "#8c6a00", fontSize: 10, fontWeight: "800", letterSpacing: 1.6, textTransform: "uppercase" },
  title: { color: "#111111", fontSize: 22, fontWeight: "800", marginTop: 2 },
  avatar: {
    alignItems: "center",
    backgroundColor: "#111111",
    borderRadius: 8,
    height: 42,
    justifyContent: "center",
    shadowColor: "#111111",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    width: 42
  },
  avatarText: { color: "#f3bd21", fontSize: 15, fontWeight: "900" },
  body: { flex: 1 },
  bottomBar: {
    alignItems: "center",
    backgroundColor: "#111111",
    borderTopColor: "rgba(255,255,255,0.08)",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12
  },
  tab: { alignItems: "center", borderRadius: 8, flex: 1, gap: 5, paddingVertical: 8 },
  tabActive: { backgroundColor: "rgba(243,189,33,0.14)" },
  tabDot: { backgroundColor: "rgba(255,255,255,0.24)", borderRadius: 4, height: 5, width: 24 },
  tabDotActive: { backgroundColor: "#f3bd21" },
  tabLabel: { color: "rgba(255,255,255,0.62)", fontSize: 12, fontWeight: "800" },
  tabLabelActive: { color: "#ffffff" }
});
