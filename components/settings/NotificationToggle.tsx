import { Toast } from "@/components/ui/Toast";
import { RADIUS, SPACING } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useTheme";
import { requestNotificationPermission } from "@/lib/notifications";
import { Storage } from "@/lib/storage";
import { Bell } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

const NOTIF_KEY = "notifications_enabled";

export const NotificationToggle = () => {
  const [enabled, setEnabled] = useState(Storage.getBool(NOTIF_KEY) ?? true);
  const colors = useThemeColors();

  const handleToggle = async (val: boolean) => {
    if (val) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Toast.error("Permission Denied", "Enable notifications in Settings");
        return;
      }
      Toast.success(
        "Notifications Enabled",
        "We will alert you before releases",
      );
    } else {
      Toast.info("Notifications Disabled");
    }
    setEnabled(val);
    Storage.setBool(NOTIF_KEY, val);
  };

  return (
    <View style={[styles.row, { backgroundColor: colors.surfaceLight }]}>
      <View
        style={[styles.iconBox, { backgroundColor: colors.primary + "18" }]}
      >
        <Bell size={16} color={colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          Release Notifications
        </Text>
        <Text style={[styles.sub, { color: colors.textMuted }]}>
          Get notified before movies release
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
        ios_backgroundColor={colors.surfaceLight}
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
