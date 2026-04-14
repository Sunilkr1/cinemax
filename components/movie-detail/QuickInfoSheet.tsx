import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { MovieDetail } from "@/types/movie.types";
import { formatBudget } from "@/utils/formatRuntime";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { DollarSign, Film, Info, TrendingUp, X } from "lucide-react-native";
import React, { useCallback } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height: H } = Dimensions.get("window");

interface QuickInfoSheetProps {
  movie: MovieDetail;
  visible: boolean;
  onClose: () => void;
}

export const QuickInfoSheet = ({
  movie,
  visible,
  onClose,
}: QuickInfoSheetProps) => {
  const sheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = ["55%", "85%"];

  React.useEffect(() => {
    if (visible) {
      sheetRef.current?.expand();
    } else {
      sheetRef.current?.close();
    }
  }, [visible]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.6}
      />
    ),
    [],
  );

  const rows: { icon: React.ReactNode; label: string; value: string }[] = [
    {
      icon: <Film size={15} color={COLORS.primary} />,
      label: "Status",
      value: movie.status,
    },
    {
      icon: <TrendingUp size={15} color={COLORS.success} />,
      label: "Popularity",
      value: movie.popularity.toFixed(0),
    },
    {
      icon: <DollarSign size={15} color={COLORS.gold} />,
      label: "Budget",
      value: formatBudget(movie.budget || 0),
    },
    {
      icon: <DollarSign size={15} color={COLORS.success} />,
      label: "Revenue",
      value: formatBudget(movie.revenue || 0),
    },
  ];

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.handle}
      onChange={(index) => {
        if (index === -1) {
          onClose();
        }
      }}
    >
      <BottomSheetScrollView>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Info size={18} color={COLORS.primary} />
            <Text style={styles.headerTitle}>Movie Info</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Tagline */}
          {movie.tagline ? (
            <View style={styles.taglineBox}>
              <Text style={styles.tagline}>"{movie.tagline}"</Text>
            </View>
          ) : null}

          {/* Info rows */}
          {rows.map((row, i) => (
            <View key={i} style={styles.row}>
              <View style={styles.rowIcon}>{row.icon}</View>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
            </View>
          ))}

          {/* Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>{movie.overview}</Text>
          </View>

          {/* Production Companies */}
          {movie.production_companies.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Production</Text>
              {movie.production_companies.slice(0, 4).map((c) => (
                <Text key={c.id} style={styles.prodCompany}>
                  • {c.name}
                </Text>
              ))}
            </View>
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetBg: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: COLORS.border,
  },
  handle: {
    backgroundColor: COLORS.surfaceLight,
    width: 36,
  },
  content: {
    padding: SPACING.base,
    gap: SPACING.base,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  taglineBox: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  tagline: {
    fontSize: 14,
    fontStyle: "italic",
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
  },
  rowIcon: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  rowValue: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  section: { gap: 8 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  overview: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  prodCompany: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
