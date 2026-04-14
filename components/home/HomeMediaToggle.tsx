import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "@/constants/theme";

export type MediaType = "movie" | "tv";

interface MediaToggleProps {
  value: MediaType;
  onValueChange: (value: MediaType) => void;
}

export const HomeMediaToggle = ({ value, onValueChange }: MediaToggleProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btn, value === "movie" && styles.activeBtn]}
        onPress={() => onValueChange("movie")}
        activeOpacity={0.8}
      >
        <Text style={[styles.text, value === "movie" && styles.activeText]}>Movies</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.btn, value === "tv" && styles.activeBtn]}
        onPress={() => onValueChange("tv")}
        activeOpacity={0.8}
      >
        <Text style={[styles.text, value === "tv" && styles.activeText]}>Series</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 4,
    borderRadius: RADIUS.full,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.full,
  },
  activeBtn: {
    backgroundColor: COLORS.primary,
  },
  text: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "700",
  },
  activeText: {
    color: "#fff",
  },
});
