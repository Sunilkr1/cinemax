import { COLORS } from "@/constants/theme";
import React from "react";
import { Platform, RefreshControl, RefreshControlProps } from "react-native";

interface PullToRefreshProps extends Partial<RefreshControlProps> {
  refreshing: boolean;
  onRefresh: () => void;
  tintColor?: string;
}

export const PullToRefresh = ({
  refreshing,
  onRefresh,
  tintColor = COLORS.primary,
  ...props
}: PullToRefreshProps) => {
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={tintColor}
      colors={[COLORS.primary, COLORS.gold]}
      progressBackgroundColor={COLORS.surface}
      style={
        Platform.OS === "android"
          ? { backgroundColor: COLORS.background }
          : undefined
      }
      {...props}
    />
  );
};
