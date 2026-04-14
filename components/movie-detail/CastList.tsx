import { SectionHeader } from "@/components/ui/SectionHeader";
import { CastCardSkeleton } from "@/components/ui/SkeletonLoader";
import { COLORS, RADIUS, SHADOWS, SPACING } from "@/constants/theme";
import { CastMember } from "@/types/cast.types";
import { getProfileUrl } from "@/utils/getImageUrl";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { UserCircle } from "lucide-react-native";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CastListProps {
  cast: CastMember[];
  isLoading?: boolean;
}

const CastCard = React.memo(function CastCard({
  member,
}: {
  member: CastMember;
}) {
  const router = useRouter();
  const profileUrl = getProfileUrl(member.profile_path, "medium");

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/cast/${member.id}`)}
      activeOpacity={0.8}
    >
      {/* Avatar */}
      <View style={styles.avatarWrap}>
        {profileUrl ? (
          <Image
            source={{ uri: profileUrl }}
            style={styles.avatar}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <UserCircle size={32} color={COLORS.textMuted} />
          </View>
        )}
      </View>

      {/* Name + character */}
      <Text style={styles.name} numberOfLines={1}>
        {member.name}
      </Text>
      <Text style={styles.character} numberOfLines={1}>
        {member.character}
      </Text>
    </TouchableOpacity>
  );
});

export const CastList = ({ cast, isLoading }: CastListProps) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <SectionHeader title="Cast & Crew" icon="none" hideSeeAll />
        <View style={styles.skeletonRow}>
          {[1, 2, 3, 4].map((i) => (
            <CastCardSkeleton key={i} />
          ))}
        </View>
      </View>
    );
  }

  if (!cast?.length) return null;

  return (
    <View style={styles.container}>
      <SectionHeader title="Cast & Crew" icon="none" hideSeeAll />
      <FlatList
        horizontal
        data={cast}
        keyExtractor={(item, index) =>
          `${item?.id ?? index}_${item?.credit_id ?? ""}`
        }
        renderItem={({ item }) => <CastCard member={item} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.xl },
  list: { paddingHorizontal: SPACING.base, gap: SPACING.md },
  skeletonRow: {
    flexDirection: "row",
    paddingHorizontal: SPACING.base,
    gap: SPACING.md,
  },
  card: {
    alignItems: "center",
    width: 80,
  },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.full,
    overflow: "hidden",
    marginBottom: 7,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 2,
  },
  character: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: "center",
  },
});
