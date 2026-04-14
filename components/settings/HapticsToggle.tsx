import { Toast } from "@/components/ui/Toast";
import { RADIUS, SPACING } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useTheme";
import { Storage } from "@/lib/storage";
import { Smartphone as VibrateIcon } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Switch, Text, Vibration, View } from "react-native";

const KEY = "haptics_enabled";

export const HapticsToggle = () => {
  const [enabled, setEnabled] = useState(Storage.getBool(KEY) ?? true);
  const colors = useThemeColors();

  const handleToggle = (val: boolean) => {
    setEnabled(val);
    Storage.setBool(KEY, val);
    if (val) {
      Vibration.vibrate(50);
      Toast.success("Haptics Enabled", "App interactions will vibrate");
    } else {
      Toast.info("Haptics Disabled");
    }
  };

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: colors.surfaceLight, borderColor: colors.border },
      ]}
    >
      <View
        style={[styles.iconBox, { backgroundColor: colors.primary + "18" }]}
      >
        <VibrateIcon size={16} color={colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          Haptic Feedback
        </Text>
        <Text style={[styles.sub, { color: colors.textMuted }]}>
          Vibrate on interactions
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
    borderTopWidth: StyleSheet.hairlineWidth,
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
