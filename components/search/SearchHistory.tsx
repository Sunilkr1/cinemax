import { COLORS, SPACING } from "@/constants/theme";
import { Clock, Trash2, TrendingUp, X } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SearchHistoryProps {
  history: string[];
  onSelect: (query: string) => void;
  onRemove: (query: string) => void;
  onClear: () => void;
}

export const SearchHistory = ({
  history,
  onSelect,
  onRemove,
  onClear,
}: SearchHistoryProps) => {
  if (!history.length) {
    return (
      <View style={styles.emptyContainer}>
        <TrendingUp size={40} color={COLORS.textMuted} strokeWidth={1.5} />
        <Text style={styles.emptyTitle}>No recent searches</Text>
        <Text style={styles.emptySubtitle}>
          Your search history will appear here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Searches</Text>
        <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
          <Trash2 size={14} color={COLORS.primary} />
          <Text style={styles.clearText}>Clear all</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {history.map((item, index) => (
        <TouchableOpacity
          key={`${item}-${index}`}
          style={styles.item}
          onPress={() => onSelect(item)}
          activeOpacity={0.7}
        >
          <Clock size={15} color={COLORS.textMuted} strokeWidth={1.8} />
          <Text style={styles.itemText} numberOfLines={1}>
            {item}
          </Text>
          <TouchableOpacity
            onPress={() => onRemove(item)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={14} color={COLORS.textMuted} strokeWidth={2} />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: SPACING.base },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  clearText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
  },
});
