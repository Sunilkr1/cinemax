import { SectionHeader } from "@/components/ui/SectionHeader";
import { COLLECTIONS } from "@/constants/collections";
import { RADIUS, SHADOWS, SPACING } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ChevronRight, Film } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const CollectionsBrowser = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <SectionHeader
        title="Collections"
        subtitle="Complete movie universes"
        icon="explore"
        hideSeeAll
      />
      <View style={styles.grid}>
        {COLLECTIONS.map((collection) => (
          <TouchableOpacity
            key={collection.id}
            style={styles.card}
            onPress={() => router.push(`/collection/${collection.id}`)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[collection.color, collection.color + "88"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.cardContent}>
              <View style={styles.cardIcon}>
                <Film size={20} color="#fff" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName} numberOfLines={1}>
                  {collection.name}
                </Text>
                <Text style={styles.cardDesc} numberOfLines={1}>
                  {collection.description}
                </Text>
              </View>
              <ChevronRight size={16} color="rgba(255,255,255,0.7)" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.xl },
  grid: {
    paddingHorizontal: SPACING.base,
    gap: SPACING.sm,
  },
  card: {
    borderRadius: RADIUS.xl,
    overflow: "hidden",
    ...SHADOWS.md,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.base,
    gap: SPACING.md,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  cardInfo: { flex: 1 },
  cardName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.3,
  },
  cardDesc: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },
});
