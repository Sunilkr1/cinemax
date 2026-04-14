import { COLORS, RADIUS, SHADOWS } from "@/constants/theme";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Compass, Heart, Home, Search, Settings } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TAB_ICONS = {
  index: Home,
  search: Search,
  explore: Compass,
  watchlist: Heart,
  settings: Settings,
};

const TAB_LABELS = {
  index: "Home",
  search: "Search",
  explore: "Explore",
  watchlist: "Watchlist",
  settings: "Settings",
};

interface TabItemProps {
  name: string;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  badgeCount?: number;
}

const TabItem = ({
  name,
  focused,
  onPress,
  onLongPress,
  badgeCount,
}: TabItemProps) => {
  const scale = useSharedValue(1);
  const dotScale = useSharedValue(focused ? 1 : 0);

  const IconComponent = TAB_ICONS[name as keyof typeof TAB_ICONS] || Home;
  const label = TAB_LABELS[name as keyof typeof TAB_LABELS] || name;

  React.useEffect(() => {
    dotScale.value = withSpring(focused ? 1 : 0, {
      damping: 15,
      stiffness: 200,
    });
  }, [focused]);

  const handlePressIn = () => {
    scale.value = withSpring(0.85, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
    opacity: dotScale.value,
  }));

  return (
    <TouchableOpacity
      style={styles.tabItem}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View style={[styles.tabInner, animatedStyle]}>
        {/* Active background */}
        {focused && <View style={styles.activeBg} />}

        {/* Icon */}
        <View style={{ position: "relative" }}>
          <IconComponent
            size={22}
            color={focused ? COLORS.primary : COLORS.textMuted}
            strokeWidth={focused ? 2.5 : 1.8}
            fill={
              focused && name === "watchlist" ? COLORS.primary : "transparent"
            }
          />
          {/* Badge */}
          {badgeCount && badgeCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {badgeCount > 9 ? "9+" : badgeCount}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Label */}
        <Text
          style={[
            styles.tabLabel,
            {
              color: focused ? COLORS.primary : COLORS.textMuted,
              fontWeight: focused ? "700" : "400",
            },
          ]}
        >
          {label}
        </Text>

        {/* Active dot */}
        <Animated.View style={[styles.activeDot, dotStyle]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

export const BlurTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const tabBarContent = (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabItem
            key={route.key}
            name={route.name}
            focused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        );
      })}
    </View>
  );

  return (
    <View style={styles.wrapper}>
      {Platform.OS === "ios" ? (
        <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
          <View style={[styles.borderTop, { borderTopColor: COLORS.border }]} />
          {tabBarContent}
        </BlurView>
      ) : (
        <View
          style={[styles.androidContainer, { backgroundColor: COLORS.surface }]}
        >
          <View style={[styles.borderTop, { borderTopColor: COLORS.border }]} />
          {tabBarContent}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...SHADOWS.lg,
  },
  blurContainer: {
    overflow: "hidden",
  },
  androidContainer: {
    overflow: "hidden",
  },
  borderTop: {
    height: 1,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabBar: {
    flexDirection: "row",
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 28 : 10,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
  },
  tabInner: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: RADIUS.xl,
    gap: 3,
    position: "relative",
    minWidth: 60,
  },
  activeBg: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(229,9,20,0.08)",
    borderRadius: RADIUS.xl,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
  activeDot: {
    position: "absolute",
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: COLORS.background,
  },
  badgeText: {
    fontSize: 9,
    color: "#fff",
    fontWeight: "800",
  },
});
