import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, ExternalLink } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Components
import { FadeIn } from "@/components/animations/FadeIn";
import { SlideUp } from "@/components/animations/SlideUp";
import { ActorBio } from "@/components/cast/ActorBio";
import { ActorFilmography } from "@/components/cast/ActorFilmography";
import { Badge } from "@/components/ui/Badge";
import { MovieDetailSkeleton } from "@/components/ui/SkeletonLoader";

// Hooks
import { usePersonDetail } from "@/hooks/useCast";

import { COLORS, RADIUS, SHADOWS, SPACING } from "@/constants/theme";
import { getPersonAge } from "@/services/cast.service";
import { formatDate } from "@/utils/formatDate";
import { getProfileUrl } from "@/utils/getImageUrl";

const { width: W } = Dimensions.get("window");

export default function CastDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const personId = parseInt(id, 10);
  const router = useRouter();

  const { data: person, isLoading } = usePersonDetail(personId);

  if (isLoading) return <MovieDetailSkeleton />;
  if (!person) return null;

  const profileUrl = getProfileUrl(person.profile_path, "large");
  const age = getPersonAge(person);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero section */}
        <FadeIn>
          <View style={styles.hero}>
            {/* Background blur */}
            {profileUrl && (
              <Image
                source={{ uri: profileUrl }}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                blurRadius={25}
              />
            )}
            <LinearGradient
              colors={["rgba(10,10,10,0.3)", COLORS.background]}
              style={StyleSheet.absoluteFill}
            />

            {/* Nav */}
            <View style={styles.nav}>
              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => router.back()}
              >
                <ArrowLeft size={20} color="#fff" strokeWidth={2.5} />
              </TouchableOpacity>
              {person.imdb_id && (
                <TouchableOpacity
                  style={styles.navBtn}
                  onPress={() =>
                    Linking.openURL(
                      `https://www.imdb.com/name/${person.imdb_id}`,
                    )
                  }
                >
                  <ExternalLink size={16} color="#fff" />
                </TouchableOpacity>
              )}
            </View>

            {/* Profile */}
            <View style={styles.profileSection}>
              <View style={styles.avatarShadow}>
                {profileUrl ? (
                  <Image
                    source={{ uri: profileUrl }}
                    style={styles.avatar}
                    contentFit="cover"
                    transition={400}
                  />
                ) : (
                  <View style={styles.avatarFallback} />
                )}
              </View>

              <Text style={styles.name}>{person.name}</Text>

              {person.known_for_department && (
                <View style={styles.deptBadge}>
                  <Text style={styles.deptText}>
                    {person.known_for_department}
                  </Text>
                </View>
              )}

              {/* Quick stats */}
              <View style={styles.quickStats}>
                {person.birthday && (
                  <Badge
                    variant="year"
                    value={
                      age
                        ? `${formatDate(person.birthday)} · ${age} yrs`
                        : formatDate(person.birthday)
                    }
                    size="sm"
                  />
                )}
                {person.place_of_birth && (
                  <Badge
                    variant="custom"
                    value={
                      person.place_of_birth.split(",").slice(-1)[0]?.trim() ||
                      ""
                    }
                    size="sm"
                  />
                )}
              </View>
            </View>
          </View>
        </FadeIn>

        {/* Bio */}
        <SlideUp delay={100}>
          <ActorBio person={person} />
        </SlideUp>

        {/* Also known as */}
        {person.also_known_as?.length > 0 && (
          <SlideUp delay={150}>
            <View style={styles.alsoKnown}>
              <Text style={styles.sectionTitle}>Also Known As</Text>
              <Text style={styles.alsoKnownText}>
                {person.also_known_as.slice(0, 4).join(" · ")}
              </Text>
            </View>
          </SlideUp>
        )}

        {/* Filmography */}
        <SlideUp delay={180}>
          <ActorFilmography personId={personId} />
        </SlideUp>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: { paddingBottom: 40 },
  hero: {
    height: 420,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  nav: {
    position: "absolute",
    top: 56,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.base,
    zIndex: 10,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  profileSection: {
    alignItems: "center",
    paddingBottom: SPACING.xl,
    gap: 10,
  },
  avatarShadow: {
    ...SHADOWS.lg,
    borderRadius: 70,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  avatarFallback: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  deptBadge: {
    backgroundColor: COLORS.primary + "20",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary + "40",
  },
  deptText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  quickStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    paddingHorizontal: SPACING.base,
  },
  alsoKnown: {
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  alsoKnownText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
});
