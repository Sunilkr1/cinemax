import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { BlurView } from "expo-blur";
import { Search, SlidersHorizontal, X } from "lucide-react-native";
import React, { useRef } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  onFilterPress?: () => void;
  placeholder?: string;
  showFilter?: boolean;
  autoFocus?: boolean;
}

export const SearchBar = ({
  value,
  onChangeText,
  onSubmit,
  onClear,
  onFilterPress,
  placeholder = "Search movies, actors...",
  showFilter = true,
  autoFocus = false,
}: SearchBarProps) => {
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      <BlurView intensity={40} tint="dark" style={styles.blur}>
        <View style={styles.inner}>
          {/* Search icon */}
          <Search size={18} color={COLORS.textMuted} strokeWidth={2} />

          {/* Input */}
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmit}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textMuted}
            returnKeyType="search"
            autoFocus={autoFocus}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="never"
          />

          {/* Clear button */}
          {value.length > 0 && (
            <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
              <X size={14} color={COLORS.textMuted} strokeWidth={2.5} />
            </TouchableOpacity>
          )}

          {/* Filter button */}
          {showFilter && (
            <>
              <View style={styles.divider} />
              <TouchableOpacity
                onPress={onFilterPress}
                style={styles.filterBtn}
              >
                <SlidersHorizontal
                  size={16}
                  color={COLORS.primary}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.base,
  },
  blur: {
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === "ios" ? 13 : 10,
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    padding: 0,
  },
  clearBtn: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    width: 1,
    height: 18,
    backgroundColor: COLORS.border,
  },
  filterBtn: {
    padding: 2,
  },
});
