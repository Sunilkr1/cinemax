import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { Download, Globe, Wifi } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface DownloadInfoProps {
  language: string;
  title: string;
}

const QUALITIES = ["4K Ultra HD", "1080p Full HD", "720p HD", "480p SD"];

export const DownloadInfo = ({ language, title }: DownloadInfoProps) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Download size={16} color={COLORS.primary} />
      <Text style={styles.title}>Download Info</Text>
    </View>

    <Text style={styles.subtitle}>Available qualities for "{title}"</Text>

    {QUALITIES.map((q, i) => (
      <View key={i} style={styles.row}>
        <Wifi size={13} color={i < 2 ? COLORS.success : COLORS.textMuted} />
        <Text style={styles.quality}>{q}</Text>
        <Text style={styles.size}>~{[8.5, 4.2, 2.1, 0.9][i]} GB</Text>
      </View>
    ))}

    <View style={styles.langRow}>
      <Globe size={13} color={COLORS.info} />
      <Text style={styles.langText}>
        Original language: {language.toUpperCase()}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  quality: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  size: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  langText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
