import * as WebBrowser from "expo-web-browser";
import {
  ExternalLink,
  Settings,
  Share2,
  Shield,
  Star,
} from "lucide-react-native";
import React, { useContext } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FadeIn } from "@/components/animations/FadeIn";
import { AppVersion } from "@/components/settings/AppVersion";
import { ClearCache } from "@/components/settings/ClearCache";
import { DataSaverToggle } from "@/components/settings/DataSaverToggle";
import { HapticsToggle } from "@/components/settings/HapticsToggle";
import { LanguageToggle } from "@/components/settings/LanguageToggle";
import { NotificationToggle } from "@/components/settings/NotificationToggle";
import { SystemTheme } from "@/components/settings/SystemTheme";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { Share } from "react-native";

import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { LanguageCode } from "@/constants/tmdb";
import { useLanguage } from "@/hooks/useLanguage";
import { ThemeContext, useThemeColors } from "@/hooks/useTheme";
import { ThemeMode } from "@/store/theme.store";

const SectionLabel = ({ label }: { label: string }) => {
  const colors = useThemeColors();
  return (
    <Text style={[sStyles.label, { color: colors.textMuted }]}>{label}</Text>
  );
};

const sStyles = StyleSheet.create({
  label: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
  },
});

const LinkRow = ({
  icon,
  label,
  url,
}: {
  icon: React.ReactNode;
  label: string;
  url: string;
}) => {
  const colors = useThemeColors();
  return (
    <TouchableOpacity
      style={styles.linkRow}
      onPress={async () => {
        if (url.startsWith("share://")) {
          Share.share({
            message:
              "Check out CineMax, the best app for tracking your favorite movies and TV shows! Download now on the Play Store.",
          });
        } else if (url.startsWith("http")) {
          await WebBrowser.openBrowserAsync(url);
        } else {
          Linking.openURL(url);
        }
      }}
      activeOpacity={0.8}
    >
      <View style={[styles.linkIcon, { backgroundColor: colors.surface }]}>
        {icon}
      </View>
      <Text style={[styles.linkLabel, { color: colors.textPrimary }]}>
        {label}
      </Text>
      <ExternalLink size={13} color={colors.textMuted} />
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────
const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  // Theme — read from shared context so changes propagate app-wide
  const { theme, setMode } = useContext(ThemeContext);

  // Language hook
  const { language, setLanguage } = useLanguage();

  // SystemTheme toggle
  const isSystemTheme = theme.mode === "system";
  const handleSystemToggle = (val: boolean) => {
    setMode(val ? "system" : "dark");
  };

  // Theme select
  const handleThemeSelect = (mode: ThemeMode) => {
    setMode(mode);
  };

  // Language select
  const handleLanguageSelect = (code: LanguageCode) => {
    setLanguage(code);
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: colors.background },
      ]}
    >
      {/* Header */}
      <FadeIn>
        <View style={styles.header}>
          <Settings size={22} color={COLORS.primary} />
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Settings
          </Text>
        </View>
      </FadeIn>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Appearance ─────────────────────────────────── */}
        <FadeIn delay={50}>
          <SectionLabel label="Appearance" />

          {/* Theme toggle — Dark / Light / System */}
          <View style={styles.card}>
            <ThemeToggle
              currentMode={theme.mode}
              onSelect={handleThemeSelect}
            />
          </View>

          {/* Follow system theme switch */}
          <View style={[styles.card, { marginTop: SPACING.sm }]}>
            <SystemTheme
              enabled={isSystemTheme}
              onToggle={handleSystemToggle}
            />
          </View>
        </FadeIn>

        {/* ── Content Language ───────────────────────────── */}
        <FadeIn delay={100}>
          <SectionLabel label="Content Language" />
          <View style={styles.card}>
            <LanguageToggle
              currentCode={language.code}
              onSelect={handleLanguageSelect}
            />
          </View>
        </FadeIn>

        {/* ── Experience & Storage ─────────────────────────── */}
        <FadeIn delay={150}>
          <SectionLabel label="Experience & Storage" />
          <View style={styles.card}>
            <NotificationToggle />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <DataSaverToggle />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <HapticsToggle />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <ClearCache />
          </View>
        </FadeIn>

        {/* ── Developer Info ─────────────────────────────── */}
        <FadeIn delay={200}>
          <SectionLabel label="Developer" />
          <View
            style={[
              styles.linksCard,
              {
                backgroundColor: colors.surfaceLight,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.devCardHeader}>
              <View
                style={[
                  styles.devAvatar,
                  { backgroundColor: COLORS.primary + "20" },
                ]}
              >
                <Text style={styles.devAvatarText}>SK</Text>
              </View>
              <View style={styles.devInfo}>
                <Text style={[styles.devName, { color: colors.textPrimary }]}>
                  Sunil Kumar
                </Text>
                <Text style={[styles.devRole, { color: colors.textMuted }]}>
                  Full Stack Developer
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.divider,
                { backgroundColor: colors.border, marginLeft: 0 },
              ]}
            />

            <LinkRow
              icon={<ExternalLink size={15} color={COLORS.primary} />}
              label="Visit Portfolio"
              url="https://portfoliosunilkumar.netlify.app/"
            />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <LinkRow
              icon={<Share2 size={15} color={colors.textPrimary} />}
              label="GitHub Profile"
              url="https://github.com/Sunilkr1"
            />
          </View>
        </FadeIn>

        {/* ── About ──────────────────────────────────────── */}
        <FadeIn delay={250}>
          <SectionLabel label="About" />
          <SectionLabel label="Support & Legal" />
          <View
            style={[
              styles.linksCard,
              {
                backgroundColor: colors.surfaceLight,
                borderColor: colors.border,
              },
            ]}
          >
            <LinkRow
              icon={<Star size={15} color={COLORS.gold} fill={COLORS.gold} />}
              label="Rate CineMax"
              url="market://details?id=com.cinemax.app"
            />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <LinkRow
              icon={<Share2 size={15} color={COLORS.success} />}
              label="Share CineMax"
              url="share://cinemax"
            />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <LinkRow
              icon={<Shield size={15} color={COLORS.info} />}
              label="Privacy Policy"
              url="https://www.themoviedb.org/privacy-policy"
            />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <LinkRow
              icon={<ExternalLink size={15} color={COLORS.purple} />}
              label="Powered by TMDB"
              url="https://www.themoviedb.org"
            />
          </View>
        </FadeIn>
        {/* ── App Info ───────────────────────────────────── */}
        <FadeIn delay={300}>
          <SectionLabel label="App Info" />
          <AppVersion />
        </FadeIn>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  scroll: {
    paddingBottom: 20,
  },
  card: {
    marginHorizontal: SPACING.base,
    borderRadius: RADIUS.xl,
    overflow: "hidden",
  },
  linksCard: {
    marginHorizontal: SPACING.base,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    padding: SPACING.md,
  },
  linkIcon: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  linkLabel: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  linkLabelContainer: {
    flex: 1,
    gap: 2,
  },
  refreshBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
    marginLeft: SPACING.base + 34 + SPACING.md,
  },
  devCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    gap: SPACING.md,
  },
  devAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  devAvatarText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "800",
  },
  devInfo: {
    flex: 1,
    gap: 2,
  },
  devName: {
    fontSize: 16,
    fontWeight: "700",
  },
  devRole: {
    fontSize: 12,
    fontWeight: "500",
  },
});
