import { SectionHeader } from "@/components/ui/SectionHeader";
import { COLLECTIONS } from "@/constants/collections";
import { COLORS, RADIUS, SHADOWS, SPACING } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ChevronRight, Film } from "lucide-react-native";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const CollectionsSection = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <SectionHeader
        title="Popular Collections"
        subtitle="Complete movie series"
        icon="explore"
        seeAllRoute="/(tabs)/explore"
      />
      <FlatList
        horizontal
        data={COLLECTIONS}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/collection/${item.id}`)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[item.color + "CC", item.color + "66", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            />
            {/* Icon area */}
            <View style={styles.iconArea}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: item.color + "30" },
                ]}
              >
                <Film size={22} color={item.color} />
              </View>
            </View>
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.desc} numberOfLines={1}>
                {item.description}
              </Text>
            </View>
            <ChevronRight size={14} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.xl },
  list: { paddingHorizontal: SPACING.base },
  card: {
    width: 200,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
    overflow: "hidden",
    ...SHADOWS.sm,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.08,
  },
  iconArea: {},
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1 },
  name: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  desc: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
});
