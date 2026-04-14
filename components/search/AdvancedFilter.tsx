import { COLORS, RADIUS, SHADOWS, SPACING } from "@/constants/theme";
import { BlurView } from "expo-blur";
import {
  Calendar,
  Check,
  Globe,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface FilterOptions {
  year?: number;
  language?: string;
  minRating?: number;
  sortBy?: string;
}

interface AdvancedFilterProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

const YEARS = Array.from(
  { length: 30 },
  (_, i) => new Date().getFullYear() - i,
);

const LANGUAGES = [
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ko", label: "Korean", flag: "🇰🇷" },
  { code: "ja", label: "Japanese", flag: "🇯🇵" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
];

const RATINGS = [9, 8, 7, 6, 5];

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "release_date.desc", label: "Newest First" },
  { value: "release_date.asc", label: "Oldest First" },
];

export const AdvancedFilter = ({
  visible,
  onClose,
  onApply,
  initialFilters = {},
}: AdvancedFilterProps) => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  const update = (key: keyof FilterOptions, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? undefined : value,
    }));
  };

  const apply = () => {
    onApply(filters);
    onClose();
  };

  const reset = () => setFilters({});

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.overlay}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.sheetTitleRow}>
              <SlidersHorizontal size={18} color={COLORS.primary} />
              <Text style={styles.sheetTitle}>Advanced Filter</Text>
            </View>
            <View style={styles.sheetActions}>
              <TouchableOpacity onPress={reset}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={16} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Sort By */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              <View style={styles.chipGrid}>
                {SORT_OPTIONS.map((opt) => {
                  const active = filters.sortBy === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      style={[styles.optChip, active && styles.optChipActive]}
                      onPress={() => update("sortBy", opt.value)}
                    >
                      {active && <Check size={11} color="#fff" />}
                      <Text
                        style={[styles.optText, active && { color: "#fff" }]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Min Rating */}
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Star size={14} color={COLORS.gold} />
                <Text style={styles.sectionTitle}>Minimum Rating</Text>
              </View>
              <View style={styles.chipRow}>
                {RATINGS.map((r) => {
                  const active = filters.minRating === r;
                  return (
                    <TouchableOpacity
                      key={r}
                      style={[
                        styles.ratingChip,
                        active && styles.ratingChipActive,
                      ]}
                      onPress={() => update("minRating", r)}
                    >
                      <Star
                        size={11}
                        color={active ? "#fff" : COLORS.gold}
                        fill={active ? "#fff" : COLORS.gold}
                      />
                      <Text
                        style={[styles.ratingText, active && { color: "#fff" }]}
                      >
                        {r}+
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Language */}
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Globe size={14} color={COLORS.blue} />
                <Text style={styles.sectionTitle}>Language</Text>
              </View>
              <View style={styles.chipGrid}>
                {LANGUAGES.map((lang) => {
                  const active = filters.language === lang.code;
                  return (
                    <TouchableOpacity
                      key={lang.code}
                      style={[styles.optChip, active && styles.optChipActive]}
                      onPress={() => update("language", lang.code)}
                    >
                      <Text style={styles.flagText}>{lang.flag}</Text>
                      <Text
                        style={[styles.optText, active && { color: "#fff" }]}
                      >
                        {lang.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Year */}
            <View style={[styles.section, { marginBottom: SPACING.xxl }]}>
              <View style={styles.sectionTitleRow}>
                <Calendar size={14} color={COLORS.info} />
                <Text style={styles.sectionTitle}>Release Year</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {YEARS.map((year) => {
                  const active = filters.year === year;
                  return (
                    <TouchableOpacity
                      key={year}
                      style={[styles.yearChip, active && styles.optChipActive]}
                      onPress={() => update("year", year)}
                    >
                      <Text
                        style={[styles.yearText, active && { color: "#fff" }]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </ScrollView>

          {/* Apply button */}
          <TouchableOpacity style={styles.applyBtn} onPress={apply}>
            <Text style={styles.applyText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    paddingHorizontal: SPACING.base,
    maxHeight: "85%",
    ...SHADOWS.lg,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  sheetTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sheetTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
  },
  sheetActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  resetText: { color: COLORS.primary, fontSize: 13, fontWeight: "600" },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  section: { marginBottom: SPACING.xl },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chipRow: { flexDirection: "row", gap: 8 },
  optChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: "600" },
  flagText: { fontSize: 14 },
  ratingChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ratingChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  ratingText: { color: COLORS.gold, fontSize: 12, fontWeight: "700" },
  yearChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  yearText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: "600" },
  applyBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 15,
    alignItems: "center",
    marginVertical: SPACING.base,
    ...SHADOWS.primary,
  },
  applyText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
