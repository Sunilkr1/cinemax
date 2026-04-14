import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SectionHeader } from "../ui/SectionHeader";

const REGIONS = [
  { id: "hi", label: "Indian Hub", flag: "🇮🇳", color: "#FF9933" },
  { id: "ko", label: "K-Drama", flag: "🇰🇷", color: "#0047A0" },
  { id: "ja", label: "Anime Zone", flag: "🇯🇵", color: "#BC002D" },
  { id: "en", label: "Western", flag: "🇺🇸", color: "#B22234" },
  { id: "es", label: "Spanish", flag: "🇪🇸", color: "#FFC400" },
];

export const RegionExplorer = () => {
  const router = useRouter();

  const handlePress = (regionId: string) => {
    // Navigate to discover/explore with language pre-filtered
    // For now, we'll navigate to search with the tag (we could also make a dedicated hub page)
    console.log("Exploring region:", regionId);
    // router.push({ pathname: "/(tabs)/explore", params: { lang: regionId } });
  };

  return (
    <View style={styles.container}>
      <SectionHeader
        title="Global Hub"
        subtitle="Explore by region & culture"
        hideSeeAll
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {REGIONS.map((region) => (
          <TouchableOpacity
            key={region.id}
            style={[styles.card, { borderColor: region.color + "40" }]}
            onPress={() => handlePress(region.id)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.flagCircle,
                { backgroundColor: region.color + "15" },
              ]}
            >
              <Text style={styles.flagText}>{region.flag}</Text>
            </View>
            <Text style={styles.label}>{region.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.lg,
  },
  scrollContent: {
    paddingHorizontal: SPACING.base,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: 12,
  },
  flagCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  flagText: {
    fontSize: 20,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
});
