import { Toast } from "@/components/ui/Toast";
import { RADIUS, SPACING } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useTheme";
import { Storage } from "@/lib/storage";
import { ImageDown } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

const KEY = "data_saver_enabled";

export const DataSaverToggle = () => {
  const [enabled, setEnabled] = useState(Storage.getBool(KEY) || false);
  const colors = useThemeColors();

  const handleToggle = (val: boolean) => {
    setEnabled(val);
    Storage.setBool(KEY, val);
    if (val) {
      Toast.success("Data Saver On", "Low resolution images will be loaded");
    } else {
      Toast.info("Data Saver Off", "High quality images enabled");
    }
  };

  return (
    <View style={[styles.row, { backgroundColor: colors.surfaceLight }]}>
      <View
        style={[styles.iconBox, { backgroundColor: colors.primary + "18" }]}
      >
        <ImageDown size={16} color={colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          Data Saver Mode
        </Text>
        <Text style={[styles.sub, { color: colors.textMuted }]}>
          Use low-res images on cellular
        </Text>
      </View>
      <Switch
        value={enabled}
        onValueChange={handleToggle}
        trackColor={{
          false: colors.surfaceMid,
          true: colors.primary + "60",
        }}
        thumbColor={enabled ? colors.primary : colors.textSecondary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1 },
  label: { fontSize: 14, fontWeight: "700" },
  sub: { fontSize: 11, marginTop: 2 },
});
