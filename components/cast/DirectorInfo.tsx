import { COLORS, RADIUS, SHADOWS, SPACING } from "@/constants/theme";
import { KeyCrew } from "@/services/cast.service";
import { getProfileUrl } from "@/utils/getImageUrl";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ChevronRight, UserCircle, Video } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DirectorInfoProps {
  crew: KeyCrew;
}

const CrewMemberRow = ({
  id,
  name,
  job,
  profilePath,
}: {
  id: number;
  name: string;
  job: string;
  profilePath: string | null;
}) => {
  const router = useRouter();
  const profileUrl = getProfileUrl(profilePath, "medium");

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => router.push(`/cast/${id}`)}
      activeOpacity={0.8}
    >
      {/* Avatar */}
      <View style={styles.avatarWrap}>
        {profileUrl ? (
          <Image
            source={{ uri: profileUrl }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <UserCircle size={22} color={COLORS.textMuted} />
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.job}>{job}</Text>
      </View>

      <ChevronRight size={16} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
};

export const DirectorInfo = ({ crew }: DirectorInfoProps) => {
  const members = [
    crew.director && { ...crew.director, displayJob: "Director" },
    crew.writer && { ...crew.writer, displayJob: "Writer" },
    crew.producer && { ...crew.producer, displayJob: "Producer" },
    crew.cinematographer && {
      ...crew.cinematographer,
      displayJob: "Cinematographer",
    },
    crew.composer && { ...crew.composer, displayJob: "Composer" },
  ].filter(Boolean) as (NonNullable<typeof crew.director> & {
    displayJob: string;
  })[];

  if (!members?.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Video size={16} color={COLORS.primary} />
        <Text style={styles.headerTitle}>Key Crew</Text>
      </View>

      {members.map((m) => (
        <CrewMemberRow
          key={`${m.id}-${m.displayJob}`}
          id={m.id}
          name={m.name}
          job={m.displayJob}
          profilePath={m.profile_path}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    overflow: "hidden",
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  avatarPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1 },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  job: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
