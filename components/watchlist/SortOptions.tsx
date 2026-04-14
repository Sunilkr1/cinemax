import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { WatchlistSortBy } from "@/store/watchlist.store";
import { AlignLeft, Clock, SortAsc, SortDesc, Star } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SortOptionsProps {
  current: WatchlistSortBy;
  onChange: (sort: WatchlistSortBy) => void;
}

const OPTIONS: {
  value: WatchlistSortBy;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "date_added_desc",
    label: "Newest Added",
    icon: <Clock size={13} color={COLORS.info} />,
  },
  {
    value: "date_added_asc",
    label: "Oldest Added",
    icon: <Clock size={13} color={COLORS.textMuted} />,
  },
  {
    value: "rating_desc",
    label: "Highest Rating",
    icon: <Star size={13} color={COLORS.gold} fill={COLORS.gold} />,
  },
  {
    value: "rating_asc",
    label: "Lowest Rating",
    icon: <Star size={13} color={COLORS.textMuted} />,
  },
  {
    value: "title_asc",
    label: "A → Z",
    icon: <SortAsc size={13} color={COLORS.success} />,
  },
  {
    value: "title_desc",
    label: "Z → A",
    icon: <SortDesc size={13} color={COLORS.textSecondary} />,
  },
];

export const SortOptions = ({ current, onChange }: SortOptionsProps) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <AlignLeft size={14} color={COLORS.textMuted} />
      <Text style={styles.label}>Sort by</Text>
    </View>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
    >
      {OPTIONS.map((opt) => {
        const isActive = current === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.7}
          >
            {opt.icon}
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.base },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  list: { paddingHorizontal: SPACING.base, gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  chipTextActive: { color: "#fff" },
});
