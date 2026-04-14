import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useTheme";
import { ExternalLink, Film, Info } from "lucide-react-native";
import React from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const APP_VERSION = "1.0.0";
const BUILD_NUMBER = "100";

export const AppVersion = () => {
  const colors = useThemeColors();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {/* App logo row */}
      <View style={[styles.logoRow, { borderBottomColor: colors.border }]}>
        <View style={styles.logoBox}>
          <Film size={22} color={COLORS.primary} />
        </View>
        <View>
          <Text style={styles.appName}>
            CINE<Text style={{ color: colors.textSecondary }}>MAX</Text>
          </Text>
          <Text style={[styles.tagline, { color: colors.textMuted }]}>
            Your personal movie companion
          </Text>
        </View>
      </View>

      {/* Info rows */}
      <View style={styles.infoRow}>
        <Info size={14} color={colors.textMuted} />
        <Text style={[styles.infoLabel, { color: colors.textMuted }]}>
          Version
        </Text>
        <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
          {APP_VERSION} ({BUILD_NUMBER})
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Info size={14} color={colors.textMuted} />
        <Text style={[styles.infoLabel, { color: colors.textMuted }]}>
          Data Source
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://www.themoviedb.org")}
          style={styles.linkRow}
        >
          <Text style={styles.linkText}>TMDB API</Text>
          <ExternalLink size={11} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.footer,
          { color: colors.textMuted, borderTopColor: colors.border },
        ]}
      >
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.base,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    gap: SPACING.md,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primary + "18",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.primary + "30",
  },
  appName: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 12,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoLabel: {
    flex: 1,
    fontSize: 13,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  linkText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary,
  },
  footer: {
    fontSize: 11,
    lineHeight: 16,
    paddingTop: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
