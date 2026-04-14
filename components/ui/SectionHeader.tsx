import { COLORS, FONT_SIZE, SPACING } from "@/constants/theme";
import { useRouter } from "expo-router";
import {
  Award,
  ChevronRight,
  Clock,
  Compass,
  Flame,
  Star,
  TrendingUp,
} from "lucide-react-native";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export type SectionIconType =
  | "trending"
  | "topRated"
  | "upcoming"
  | "nowPlaying"
  | "explore"
  | "star"
  | "none";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onSeeAll?: () => void;
  seeAllRoute?: string;
  icon?: SectionIconType;
  style?: ViewStyle;
  hideSeeAll?: boolean;
}

const ICON_MAP: Record<SectionIconType, React.ReactNode> = {
  trending: <Flame size={16} color={COLORS.primary} />,
  topRated: <Award size={16} color={COLORS.gold} />,
  upcoming: <Clock size={16} color={COLORS.info} />,
  nowPlaying: <TrendingUp size={16} color={COLORS.success} />,
  explore: <Compass size={16} color={COLORS.purple} />,
  star: <Star size={16} color={COLORS.gold} fill={COLORS.gold} />,
  none: null,
};

export const SectionHeader = ({
  title,
  subtitle,
  onSeeAll,
  seeAllRoute,
  icon = "none",
  style,
  hideSeeAll = false,
}: SectionHeaderProps) => {
  const router = useRouter();

  const handleSeeAll = () => {
    if (onSeeAll) {
      onSeeAll();
    } else if (seeAllRoute) {
      router.push(seeAllRoute as any);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Left — icon + title */}
      <View style={styles.left}>
        {icon !== "none" && (
          <View style={styles.iconBox}>{ICON_MAP[icon]}</View>
        )}
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>

      {/* Right — see all */}
      {!hideSeeAll && (onSeeAll || seeAllRoute) && (
        <TouchableOpacity
          onPress={handleSeeAll}
          style={styles.seeAllBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAllText}>See all</Text>
          <ChevronRight size={13} color={COLORS.primary} strokeWidth={2.5} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.md,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    flex: 1,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingLeft: SPACING.sm,
  },
  seeAllText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
