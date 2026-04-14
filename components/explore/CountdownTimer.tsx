import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { CountdownResult, getCountdown } from "@/utils/countdown";
import { Clock } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface CountdownTimerProps {
  releaseDate: string;
  movieTitle?: string;
}

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <View style={styles.unit}>
    <Text style={styles.unitValue}>{String(value).padStart(2, "0")}</Text>
    <Text style={styles.unitLabel}>{label}</Text>
  </View>
);

export const CountdownTimer = ({
  releaseDate,
  movieTitle,
}: CountdownTimerProps) => {
  const [countdown, setCountdown] = useState<CountdownResult>(
    getCountdown(releaseDate),
  );

  useEffect(() => {
    if (countdown.isExpired) return;
    const interval = setInterval(() => {
      setCountdown(getCountdown(releaseDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [releaseDate]);

  if (countdown.isExpired) {
    return (
      <View style={styles.releasedBadge}>
        <Clock size={13} color={COLORS.success} />
        <Text style={styles.releasedText}>Now Showing</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {movieTitle && (
        <Text style={styles.title} numberOfLines={1}>
          {movieTitle}
        </Text>
      )}
      <View style={styles.timerRow}>
        <Clock size={14} color={COLORS.primary} />
        <Text style={styles.timerLabel}>Releases in</Text>
      </View>
      <View style={styles.units}>
        <TimeUnit value={countdown.days} label="Days" />
        <Text style={styles.colon}>:</Text>
        <TimeUnit value={countdown.hours} label="Hrs" />
        <Text style={styles.colon}>:</Text>
        <TimeUnit value={countdown.minutes} label="Min" />
        <Text style={styles.colon}>:</Text>
        <TimeUnit value={countdown.seconds} label="Sec" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  timerLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  units: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  unit: {
    alignItems: "center",
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  unitValue: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  unitLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  colon: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  releasedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.success + "15",
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: COLORS.success + "40",
  },
  releasedText: {
    fontSize: 13,
    color: COLORS.success,
    fontWeight: "700",
  },
});
