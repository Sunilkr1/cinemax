import { MovieCard } from "@/components/ui/MovieCard";
import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { useAIRecommendations } from "@/hooks/useRecommendations";
import { AlertCircle, RefreshCw, Sparkles } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const AIRecommendations = () => {
  const { movies, isLoading, error, fetch } = useAIRecommendations();

  useEffect(() => {
    fetch();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.aiIcon}>
            <Sparkles size={16} color={COLORS.primary} fill={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.title}>AI For You</Text>
            <Text style={styles.subtitle}>Picked just for you</Text>
          </View>
        </View>
        <TouchableOpacity onPress={fetch} style={styles.refreshBtn}>
          <RefreshCw size={15} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {isLoading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={COLORS.primary} size="small" />
          <Text style={styles.loadingText}>AI is thinking...</Text>
        </View>
      )}

      {/* Error */}
      {error && !isLoading && (
        <View style={styles.errorBox}>
          <AlertCircle size={16} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetch}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Movies */}
      {!isLoading && !error && (movies?.length || 0) > 0 && (
        <FlatList
          horizontal
          data={movies}
          keyExtractor={(item, index) => String(item?.id ?? index)}
          renderItem={({ item, index }) => (
            <MovieCard movie={item} variant="portrait" index={index} />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.xl },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  aiIcon: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary + "18",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.primary + "30",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  refreshBtn: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: SPACING.base,
  },
  loadingText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontStyle: "italic",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: SPACING.base,
    padding: SPACING.md,
    backgroundColor: COLORS.error + "10",
    marginHorizontal: SPACING.base,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.error + "30",
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.error,
  },
  retryText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
  },
  list: { paddingHorizontal: SPACING.base },
});
