import { useAuth, useUser } from "@clerk/expo";
import { Link, router, useLocalSearchParams, usePathname } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocale } from "../contexts/locale-context";

const tabKeys = [
  { href: "/?type=sale", key: "buy", icon: "buy" },
  { href: "/sell", key: "sell", icon: "sell" },
  { href: "/?type=rent", key: "rent", icon: "rent", raised: true },
  { href: "/saved", key: "saved", icon: "saved" },
  { href: "/profile", key: "profile", icon: "profile" }
] as const;

type IconName = (typeof tabKeys)[number]["icon"] | "user";

type AppChromeProps = {
  title?: string;
  eyebrow?: string;
  showBack?: boolean;
  children: React.ReactNode;
};

function BackIcon() {
  return (
    <View style={styles.backIconCanvas}>
      <View style={styles.backIconHead} />
      <View style={styles.backIconStem} />
    </View>
  );
}

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

export function AppChrome({ title = "Realtor", eyebrow = "Premium homes", showBack = false, children }: AppChromeProps) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const params = useLocalSearchParams<{ type?: string }>();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { messages } = useLocale();
  const listingType = params.type === "rent" ? "rent" : "sale";
  const tabs = tabKeys.map((tab) => ({ ...tab, label: messages.mobile[tab.key] }));
  const userImage = user?.imageUrl;
  const bottomOffset = Math.max(insets.bottom + 4, 12);
  const bodyBottomSpace = Math.max(insets.bottom + 92, 108);

  return (
    <View style={styles.safeArea}>
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top + 8, 18) }]}>
        <View style={styles.titleRow}>
          {showBack ? (
            <Pressable accessibilityLabel={messages.mobile.back} accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
              <BackIcon />
            </Pressable>
          ) : null}
          <View style={styles.titleBlock}>
            <Text style={styles.eyebrow}>{eyebrow}</Text>
            <Text style={styles.title}>{title}</Text>
          </View>
        </View>
        <Link href="/profile" asChild>
          <Pressable accessibilityRole="button" accessibilityLabel={messages.mobile.openProfile} style={styles.avatar}>
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
      <View style={[styles.body, { paddingBottom: bodyBottomSpace }]}>{children}</View>
      <View style={[styles.bottomWrap, { bottom: bottomOffset }]} pointerEvents="box-none">
        <View style={styles.bottomBar}>
          <View style={styles.bottomGlassHighlight} pointerEvents="none" />
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
    </View>
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
    paddingBottom: 10
  },
  titleRow: { alignItems: "center", flex: 1, flexDirection: "row", gap: 10, paddingRight: 12 },
  titleBlock: { flex: 1 },
  backButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "rgba(17,17,17,0.10)",
    borderRadius: 8,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    shadowColor: "#111111",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    width: 42
  },
  backIconCanvas: { alignItems: "center", height: 22, justifyContent: "center", position: "relative", width: 22 },
  backIconHead: { borderBottomColor: "#111111", borderBottomWidth: 2, borderLeftColor: "#111111", borderLeftWidth: 2, height: 10, left: 4, position: "absolute", transform: [{ rotate: "45deg" }], width: 10 },
  backIconStem: { backgroundColor: "#111111", borderRadius: 1, height: 2, left: 6, position: "absolute", width: 14 },
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
  body: { flex: 1 },
  bottomWrap: {
    left: 24,
    position: "absolute",
    right: 24
  },
  bottomBar: {
    alignItems: "center",
    backgroundColor: "rgba(18,18,17,0.82)",
    borderColor: "rgba(255,255,255,0.20)",
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    gap: 2,
    overflow: "visible",
    paddingHorizontal: 7,
    paddingVertical: 6,
    shadowColor: "#111111",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 22
  },
  bottomGlassHighlight: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 12,
    height: 1,
    left: 18,
    position: "absolute",
    right: 18,
    top: 7
  },
  tab: { alignItems: "center", borderRadius: 16, flex: 1, gap: 2, justifyContent: "center", minHeight: 48, paddingHorizontal: 1, paddingVertical: 4 },
  tabActive: {},
  tabRaised: {
    backgroundColor: "transparent",
    marginTop: -22,
    minHeight: 70,
    shadowColor: "#f3bd21",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.34,
    shadowRadius: 18
  },
  tabIcon: { alignItems: "center", backgroundColor: "transparent", borderRadius: 14, height: 26, justifyContent: "center", width: 26 },
  tabIconActive: { backgroundColor: "rgba(243,189,33,0.16)" },
  tabIconRaised: {
    backgroundColor: "#f3bd21",
    borderColor: "rgba(255,255,255,0.72)",
    borderRadius: 24,
    borderWidth: 2,
    height: 48,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.30,
    shadowRadius: 14,
    width: 48
  },
  tabLabel: { color: "rgba(255,255,255,0.58)", fontSize: 8.5, fontWeight: "900" },
  tabLabelActive: { color: "#f3bd21" },
  tabLabelRaised: { color: "#ffffff", fontSize: 9.5, marginTop: 1, textShadowColor: "rgba(0,0,0,0.38)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
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
