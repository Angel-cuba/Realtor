import { useEffect, useRef, useState, type ReactNode } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import { useLocale } from "../contexts/locale-context";

type AppSplashProps = {
  onDone?: () => void;
};

export function SplashGate({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);

  return (
    <View style={styles.host}>
      {children}
      {visible ? <AppSplash onDone={() => setVisible(false)} /> : null}
    </View>
  );
}

function AppSplash({ onDone }: AppSplashProps) {
  const { messages } = useLocale();
  const entrance = useRef(new Animated.Value(0)).current;
  const scan = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const exit = useRef(new Animated.Value(1)).current;
  const dismissed = useRef(false);

  useEffect(() => {
    const entranceAnimation = Animated.timing(entrance, {
      toValue: 1,
      duration: 720,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    });
    const scanAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scan, {
          toValue: 1,
          duration: 1350,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true
        }),
        Animated.timing(scan, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true
        })
      ])
    );
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true
        })
      ])
    );

    entranceAnimation.start();
    scanAnimation.start();
    pulseAnimation.start();
    const timer = setTimeout(() => dismiss(), 2100);

    return () => {
      clearTimeout(timer);
      entranceAnimation.stop();
      scanAnimation.stop();
      pulseAnimation.stop();
    };
  }, [entrance, pulse, scan]);

  const dismiss = () => {
    if (dismissed.current) return;
    dismissed.current = true;
    Animated.timing(exit, {
      toValue: 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start(() => onDone?.());
  };

  const cardScale = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [0.94, 1]
  });
  const contentY = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 0]
  });
  const scanX = scan.interpolate({
    inputRange: [0, 1],
    outputRange: [-84, 84]
  });
  const beaconScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.18]
  });
  const beaconOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.28, 0.62]
  });

  return (
    <Animated.View style={[styles.overlay, { opacity: exit }]}>
      <Pressable
        accessibilityLabel={messages.mobile.splashAction}
        accessibilityRole="button"
        onPress={dismiss}
        style={styles.pressable}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: entrance,
              transform: [{ translateY: contentY }]
            }
          ]}
        >
          <Text style={styles.kicker}>{messages.mobile.splashKicker}</Text>
          <Animated.View style={[styles.marketCard, { transform: [{ scale: cardScale }] }]}>
            <View style={styles.gridLineVertical} />
            <View style={styles.gridLineHorizontal} />
            <Animated.View
              style={[
                styles.beacon,
                {
                  opacity: beaconOpacity,
                  transform: [{ scale: beaconScale }]
                }
              ]}
            />
            <View style={styles.houseMark}>
              <View style={styles.roof} />
              <View style={styles.houseBody}>
                <View style={styles.door} />
              </View>
            </View>
            <Animated.View style={[styles.scanLine, { transform: [{ translateX: scanX }] }]} />
            <View style={styles.marketDots}>
              <View style={[styles.marketDot, styles.marketDotDark]} />
              <View style={styles.marketDot} />
              <View style={[styles.marketDot, styles.marketDotGold]} />
            </View>
          </Animated.View>
          <Text style={styles.title}>{messages.mobile.splashTitle}</Text>
          <Text style={styles.subtitle}>{messages.mobile.splashSubtitle}</Text>
          <View style={styles.intentRow}>
            <Text style={styles.intentPill}>{messages.mobile.splashBuy}</Text>
            <Text style={[styles.intentPill, styles.intentPillActive]}>{messages.mobile.splashRent}</Text>
            <Text style={styles.intentPill}>{messages.mobile.splashSell}</Text>
          </View>
          <Text style={styles.action}>{messages.mobile.splashAction}</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: {
    flex: 1
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#f8f5ed",
    zIndex: 100
  },
  pressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28
  },
  content: {
    width: "100%",
    alignItems: "center"
  },
  kicker: {
    color: "#947100",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: 18,
    textTransform: "uppercase"
  },
  marketCard: {
    width: 224,
    height: 224,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(17, 17, 17, 0.1)",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    shadowColor: "#111111",
    shadowOpacity: 0.14,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 18 },
    elevation: 12
  },
  gridLineVertical: {
    position: "absolute",
    width: 1,
    height: "100%",
    backgroundColor: "rgba(17, 17, 17, 0.06)"
  },
  gridLineHorizontal: {
    position: "absolute",
    width: "100%",
    height: 1,
    backgroundColor: "rgba(17, 17, 17, 0.06)"
  },
  beacon: {
    position: "absolute",
    width: 142,
    height: 142,
    borderRadius: 71,
    backgroundColor: "#f3bd21"
  },
  houseMark: {
    width: 96,
    height: 92,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  roof: {
    position: "absolute",
    top: 6,
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#111111",
    transform: [{ rotate: "45deg" }]
  },
  houseBody: {
    width: 72,
    height: 58,
    alignItems: "center",
    justifyContent: "flex-end",
    borderRadius: 8,
    backgroundColor: "#111111",
    paddingBottom: 10
  },
  door: {
    width: 18,
    height: 26,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: "#f3bd21"
  },
  scanLine: {
    position: "absolute",
    top: 42,
    width: 74,
    height: 3,
    borderRadius: 3,
    backgroundColor: "#f3bd21"
  },
  marketDots: {
    position: "absolute",
    right: 18,
    bottom: 18,
    flexDirection: "row",
    gap: 6
  },
  marketDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#d8d2c3"
  },
  marketDotDark: {
    backgroundColor: "#111111"
  },
  marketDotGold: {
    backgroundColor: "#f3bd21"
  },
  title: {
    marginTop: 28,
    color: "#101010",
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: 0
  },
  subtitle: {
    maxWidth: 300,
    marginTop: 10,
    color: "#666158",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 23,
    letterSpacing: 0,
    textAlign: "center"
  },
  intentRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 24
  },
  intentPill: {
    minWidth: 74,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(17, 17, 17, 0.1)",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    color: "#111111",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
    paddingHorizontal: 12,
    paddingVertical: 9,
    textAlign: "center"
  },
  intentPillActive: {
    borderColor: "#111111",
    backgroundColor: "#111111",
    color: "#f3bd21"
  },
  action: {
    marginTop: 22,
    color: "#8b8478",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0
  }
});
