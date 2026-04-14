import { COLORS, RADIUS, SHADOWS, SPACING } from "@/constants/theme";
import { CustomList } from "@/types/watchlist.types";
import { useRouter } from "expo-router";
import { ChevronRight, Edit3, Film, Trash2 } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CustomListCardProps {
  list: CustomList;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const CustomListCard = ({
  list,
  onDelete,
  onEdit,
}: CustomListCardProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/custom-list/${list.id}`)}
      activeOpacity={0.85}
    >
      {/* Color accent */}
      <View style={[styles.accent, { backgroundColor: list.color }]} />

      {/* Icon */}
      <View style={[styles.iconBox, { backgroundColor: list.color + "20" }]}>
        <Film size={18} color={list.color} />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{list.name}</Text>
        <Text style={styles.count}>
          {list?.movieIds?.length || 0}{" "}
          {list?.movieIds?.length === 1 ? "movie" : "movies"}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {onEdit && (
          <TouchableOpacity
            onPress={() => onEdit(list.id)}
            style={styles.actionBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Edit3 size={15} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => onDelete(list.id)}
          style={[styles.actionBtn, styles.deleteBtn]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Trash2 size={15} color={COLORS.error} />
        </TouchableOpacity>
        <ChevronRight size={16} color={COLORS.textMuted} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    gap: SPACING.md,
    paddingRight: SPACING.md,
    ...SHADOWS.sm,
  },
  accent: {
    width: 4,
    height: "100%",
    minHeight: 68,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1, gap: 3, paddingVertical: SPACING.md },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  count: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    backgroundColor: COLORS.error + "12",
  },
});
