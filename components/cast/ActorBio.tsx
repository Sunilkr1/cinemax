import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { getPersonAge } from "@/services/cast.service";
import { PersonDetail } from "@/types/cast.types";
import { formatDate } from "@/utils/formatDate";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  MapPin,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ActorBioProps {
  person: PersonDetail;
}

export const ActorBio = ({ person }: ActorBioProps) => {
  const [expanded, setExpanded] = useState(false);
  const age = getPersonAge(person);
  const bio = person.biography;
  const shortBio = bio.substring(0, 250);
  const needsExpand = (bio?.length || 0) > 250;

  const infoRows = [
    person.known_for_department && {
      icon: <User size={14} color={COLORS.primary} />,
      label: "Known For",
      value: person.known_for_department,
    },
    person.birthday && {
      icon: <Calendar size={14} color={COLORS.info} />,
      label: "Born",
      value: `${formatDate(person.birthday)}${age ? ` (Age ${age})` : ""}`,
    },
    person.place_of_birth && {
      icon: <MapPin size={14} color={COLORS.success} />,
      label: "Birthplace",
      value: person.place_of_birth,
    },
  ].filter(Boolean) as {
    icon: React.ReactNode;
    label: string;
    value: string;
  }[];

  return (
    <View style={styles.container}>
      {/* Info rows */}
      {infoRows.map((row, i) => (
        <View key={i} style={styles.row}>
          <View style={styles.rowIcon}>{row.icon}</View>
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Text style={styles.rowValue}>{row.value}</Text>
          </View>
        </View>
      ))}

      {/* Biography */}
      {bio ? (
        <View style={styles.bioSection}>
          <Text style={styles.bioTitle}>Biography</Text>
          <Text style={styles.bioText}>
            {expanded || !needsExpand ? bio : shortBio + "..."}
          </Text>
          {needsExpand && (
            <TouchableOpacity
              onPress={() => setExpanded(!expanded)}
              style={styles.expandBtn}
            >
              <Text style={styles.expandText}>
                {expanded ? "Read less" : "Read more"}
              </Text>
              {expanded ? (
                <ChevronUp size={14} color={COLORS.primary} />
              ) : (
                <ChevronDown size={14} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          )}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.base,
    gap: SPACING.base,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  rowIcon: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  rowContent: { flex: 1 },
  rowLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  rowValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  bioSection: { gap: 10 },
  bioTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  bioText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  expandBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
  },
  expandText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
