import { Toast } from "@/components/ui/Toast";
import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useTheme";
import { queryClient } from "@/lib/queryClient";
import { HardDrive, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const ClearCache = () => {
  const colors = useThemeColors();
  const [loading, setLoading] = useState(false);

  const handleClear = () => {
    Alert.alert(
      "Clear Cache",
      "This will clear all cached movie data. The app will re-fetch data on next use.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            await queryClient.clear();
            setTimeout(() => {
              setLoading(false);
              Toast.success("Cache cleared", "All data cleared successfully");
            }, 800);
          },
        },
      ],
    );
  };

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.iconBox}>
        <HardDrive size={18} color={COLORS.warning} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Clear Cache
        </Text>
        <Text style={[styles.desc, { color: colors.textMuted }]}>
          Remove all cached movie data
        </Text>
      </View>
      <TouchableOpacity
        style={styles.btn}
        onPress={handleClear}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.error} />
        ) : (
          <Trash2 size={15} color={COLORS.error} />
        )}
        <Text style={styles.btnText}>Clear</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.warning + "18",
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1 },
  title: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  desc: { fontSize: 12 },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.error + "12",
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.error + "30",
  },
  btnText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.error,
  },
});
