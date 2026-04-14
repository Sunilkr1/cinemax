import { COLORS } from "@/constants/theme";
import { ThemeContext } from "@/hooks/useTheme";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Compass, Heart, Home, Search, Settings } from "lucide-react-native";
import { useContext } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

interface TabIconProps {
  icon: React.ReactNode;
  label: string;
  focused: boolean;
}

function TabIcon({ icon, label, focused }: TabIconProps) {
  return (
    <View style={tabStyles.iconWrap}>
      {icon}
      <Text
        style={[
          tabStyles.label,
          { color: focused ? COLORS.primary : COLORS.textMuted },
        ]}
      >
        {label}
      </Text>
      {focused && <View style={tabStyles.dot} />}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 6,
    gap: 3,
    position: "relative",
    minWidth: 60,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  dot: {
    position: "absolute",
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
});

export default function TabLayout() {
  const { isDark } = useContext(ThemeContext);
  const tabBarBg = isDark ? "#141414ee" : "#ffffffee";
  const tabBarBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.OS === "ios" ? "transparent" : tabBarBg,
          borderTopColor: tabBarBorder,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 88 : 68,
          elevation: 0,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={80}
              tint={isDark ? "dark" : "light"}
              style={{ flex: 1 }}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={
                <Home
                  size={22}
                  color={focused ? COLORS.primary : COLORS.textMuted}
                  strokeWidth={focused ? 2.5 : 1.8}
                />
              }
              label="Home"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={
                <Search
                  size={22}
                  color={focused ? COLORS.primary : COLORS.textMuted}
                  strokeWidth={focused ? 2.5 : 1.8}
                />
              }
              label="Search"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={
                <Compass
                  size={22}
                  color={focused ? COLORS.primary : COLORS.textMuted}
                  strokeWidth={focused ? 2.5 : 1.8}
                />
              }
              label="Explore"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={
                <Heart
                  size={22}
                  color={focused ? COLORS.primary : COLORS.textMuted}
                  strokeWidth={focused ? 2.5 : 1.8}
                  fill={focused ? COLORS.primary : "transparent"}
                />
              }
              label="Saved"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={
                <Settings
                  size={22}
                  color={focused ? COLORS.primary : COLORS.textMuted}
                  strokeWidth={focused ? 2.5 : 1.8}
                />
              }
              label="Settings"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
