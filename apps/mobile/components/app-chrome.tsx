import { useAuth, useUser } from "@clerk/expo";
import { Link, useLocalSearchParams, usePathname } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const tabs = [
  { href: "/?type=sale", key: "buy", label: "Comprar", icon: "buy" },
  { href: "/sell", key: "sell", label: "Vender", icon: "sell" },
  { href: "/?type=rent", key: "rent", label: "Rentar", icon: "rent", raised: true },
  { href: "/saved", key: "saved", label: "Guardados", icon: "saved" },
  { href: "/profile", key: "profile", label: "Perfil", icon: "profile" }
] as const;

type IconName = (typeof tabs)[number]["icon"] | "user";

type AppChromeProps = {
  title?: string;
  eyebrow?: string;
  children: React.ReactNode;
};

function NavIcon({
  active,
  color: colorOverride,
  name,
  raised = false,
  softColor: softColorOverride
}: {
  active: boolean;
  color?: string;
  name: IconName;
  raised?: boolean;
  softColor?: string;
}) {
  const color = colorOverride ?? (active || raised ? "#111111" : "rgba(255,255,255,0.74)");
  const softColor = softColorOverride ?? (active || raised ? "rgba(17,17,17,0.24)" : "rgba(255,255,255,0.28)");

  if (name === "buy") {
    return (
      <View style={styles.iconCanvas}>
        <View style={[styles.houseRoof, { borderColor: color }]} />
        <View style={[styles.houseBody, { borderColor: color }]}>
          <View style={[styles.houseDoor, { backgroundColor: softColor }]} />
        </View>
      </View>
    );
  }

  if (name === "rent") {
    return (
      <View style={styles.iconCanvas}>
        <View style={[styles.keyHead, { borderColor: color }]} />
        <View style={[styles.keyStem, { backgroundColor: color }]} />
        <View style={[styles.keyTooth, { backgroundColor: color }]} />
        <View style={[styles.keyToothSmall, { backgroundColor: color }]} />
      </View>
    );
  }

  if (name === "sell") {
    return (
      <View style={styles.iconCanvas}>
        <View style={[styles.tagShape, { borderColor: color }]}>
          <View style={[styles.tagDot, { backgroundColor: softColor }]} />
        </View>
      </View>
    );
  }

  if (name === "saved") {
    return (
      <View style={styles.iconCanvas}>
        <View style={[styles.bookmarkShape, { borderColor: color }]}>
          <View style={[styles.bookmarkPoint, { borderTopColor: color }]} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.iconCanvas}>
      <View style={[styles.userHead, { backgroundColor: name === "user" ? color : "transparent", borderColor: color }]} />
      <View style={[styles.userBody, { borderColor: color, backgroundColor: name === "user" ? softColor : "transparent" }]} />
    </View>
  );
}

export function AppChrome({ title = "Realtor", eyebrow = "Premium homes", children }: AppChromeProps) {
  const pathname = usePathname();
  const params = useLocalSearchParams<{ type?: string }>();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const listingType = params.type === "rent" ? "rent" : "sale";
  const userImage = user?.imageUrl;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Link href="/profile" asChild>
          <Pressable accessibilityRole="button" accessibilityLabel="Abrir perfil" style={styles.avatar}>
            {isSignedIn && userImage ? (
              <Image source={{ uri: userImage }} style={styles.avatarImage} />
            ) : (
              <NavIcon
                active={Boolean(isSignedIn)}
                color="#f3bd21"
                name={isSignedIn ? "user" : "profile"}
                softColor="rgba(243,189,33,0.34)"
              />
            )}
          </Pressable>
        </Link>
      </View>
      <View style={styles.body}>{children}</View>
      <View style={styles.bottomWrap} pointerEvents="box-none">
        <View style={styles.bottomBar}>
        {tabs.map((tab) => {
          const raised = "raised" in tab && tab.raised;
          const active =
            (tab.key === "buy" && pathname === "/" && listingType === "sale") ||
            (tab.key === "rent" && pathname === "/" && listingType === "rent") ||
            (tab.key !== "buy" && tab.key !== "rent" && pathname.startsWith("/" + tab.key));
          const iconName = tab.key === "profile" && isSignedIn ? "user" : tab.icon;
          return (
            <Link href={tab.href} asChild key={tab.key}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={StyleSheet.flatten([styles.tab, active && styles.tabActive, raised && styles.tabRaised])}
              >
                <View style={[styles.tabIcon, active && styles.tabIconActive, raised && styles.tabIconRaised]}>
                  <NavIcon active={active} name={iconName} raised={raised} />
                </View>
                <Text style={[styles.tabLabel, active && styles.tabLabelActive, raised && styles.tabLabelRaised]}>{tab.label}</Text>
              </Pressable>
            </Link>
          );
        })}
        </View>
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
  avatarImage: { borderRadius: 8, height: 42, width: 42 },
  body: { flex: 1, paddingBottom: 126 },
  bottomWrap: {
    bottom: 14,
    left: 16,
    position: "absolute",
    right: 16
  },
  bottomBar: {
    alignItems: "center",
    backgroundColor: "rgba(17,17,17,0.94)",
    borderColor: "rgba(255,255,255,0.10)",
    borderRadius: 26,
    borderWidth: 1,
    flexDirection: "row",
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 7,
    shadowColor: "#111111",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.26,
    shadowRadius: 24
  },
  tab: { alignItems: "center", borderRadius: 18, flex: 1, gap: 3, justifyContent: "center", minHeight: 54, paddingHorizontal: 1, paddingVertical: 5 },
  tabActive: {},
  tabRaised: {
    backgroundColor: "transparent",
    marginTop: -32,
    minHeight: 82,
    shadowColor: "#f3bd21",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.40,
    shadowRadius: 22
  },
  tabIcon: { alignItems: "center", backgroundColor: "transparent", borderRadius: 15, height: 28, justifyContent: "center", width: 28 },
  tabIconActive: { backgroundColor: "rgba(243,189,33,0.14)" },
  tabIconRaised: {
    backgroundColor: "#f3bd21",
    borderColor: "rgba(255,255,255,0.72)",
    borderRadius: 27,
    borderWidth: 2,
    height: 54,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.32,
    shadowRadius: 16,
    width: 54
  },
  tabLabel: { color: "rgba(255,255,255,0.54)", fontSize: 9, fontWeight: "900" },
  tabLabelActive: { color: "#f3bd21" },
  tabLabelRaised: { color: "#ffffff", fontSize: 10, marginTop: 2, textShadowColor: "rgba(0,0,0,0.38)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  iconCanvas: { alignItems: "center", height: 22, justifyContent: "center", position: "relative", width: 22 },
  houseRoof: { borderLeftWidth: 2, borderTopWidth: 2, height: 13, position: "absolute", top: 4, transform: [{ rotate: "45deg" }], width: 13 },
  houseBody: { alignItems: "center", borderBottomWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, bottom: 3, height: 12, justifyContent: "flex-end", position: "absolute", width: 16 },
  houseDoor: { borderTopLeftRadius: 2, borderTopRightRadius: 2, height: 6, width: 5 },
  keyHead: { borderRadius: 7, borderWidth: 2, height: 13, left: 1, position: "absolute", width: 13 },
  keyStem: { height: 2, left: 12, position: "absolute", top: 10, width: 9 },
  keyTooth: { height: 6, position: "absolute", right: 1, top: 10, width: 2 },
  keyToothSmall: { height: 5, position: "absolute", right: 5, top: 10, width: 2 },
  tagShape: { borderRadius: 4, borderWidth: 2, height: 15, justifyContent: "center", transform: [{ rotate: "-18deg" }], width: 17 },
  tagDot: { borderRadius: 2, height: 4, marginLeft: 3, width: 4 },
  bookmarkShape: { borderRadius: 3, borderWidth: 2, height: 18, overflow: "hidden", position: "relative", width: 14 },
  bookmarkPoint: { alignSelf: "center", borderLeftColor: "transparent", borderLeftWidth: 5, borderRightColor: "transparent", borderRightWidth: 5, borderTopWidth: 5, bottom: 0, height: 0, position: "absolute", width: 0 },
  userHead: { borderRadius: 7, borderWidth: 2, height: 12, position: "absolute", top: 2, width: 12 },
  userBody: { borderRadius: 8, borderWidth: 2, bottom: 2, height: 10, position: "absolute", width: 18 }
});
