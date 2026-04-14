import { COLORS, RADIUS, SHADOWS } from "@/constants/theme";
import { CastMember } from "@/types/cast.types";
import { getProfileUrl } from "@/utils/getImageUrl";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Star, UserCircle } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ActorCardProps {
  member: CastMember;
  variant?: "small" | "large";
}

export const ActorCard = ({ member, variant = "small" }: ActorCardProps) => {
  const router = useRouter();
  const profileUrl = getProfileUrl(member.profile_path, "medium");
  const isLarge = variant === "large";

  return (
    <TouchableOpacity
      style={[styles.card, isLarge && styles.cardLarge]}
      onPress={() => router.push(`/cast/${member.id}`)}
      activeOpacity={0.8}
    >
      <View style={[styles.avatarWrap, isLarge && styles.avatarLarge]}>
        {profileUrl ? (
          <Image
            source={{ uri: profileUrl }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View style={styles.placeholder}>
            <UserCircle size={isLarge ? 48 : 32} color={COLORS.textMuted} />
          </View>
        )}
        {/* Popularity glow */}
        {member.popularity > 50 && (
          <View style={styles.popularBadge}>
            <Star size={8} color={COLORS.gold} fill={COLORS.gold} />
          </View>
        )}
      </View>

      <Text
        style={[styles.name, isLarge && styles.nameLarge]}
        numberOfLines={2}
      >
        {member.name}
      </Text>
      <Text
        style={[styles.character, isLarge && styles.characterLarge]}
        numberOfLines={1}
      >
        {member.character}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    width: 80,
    gap: 6,
  },
  cardLarge: {
    width: 110,
  },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.full,
    overflow: "hidden",
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  avatarLarge: {
    width: 100,
    height: 100,
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  popularBadge: {
    position: "absolute",
    top: 3,
    right: 3,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.gold + "40",
  },
  name: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  nameLarge: { fontSize: 13 },
  character: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  characterLarge: { fontSize: 12 },
});
