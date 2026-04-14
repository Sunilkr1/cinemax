import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { WatchProvider, WatchProvidersCountry } from "@/types/api.types";
import { getLogoUrl } from "@/utils/getImageUrl";
import { Image } from "expo-image";
import { ExternalLink, Tv } from "lucide-react-native";
import React from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface WatchProvidersProps {
  providers: WatchProvidersCountry | null;
}

const ProviderLogo = ({ provider }: { provider: WatchProvider }) => {
  const logoUrl = getLogoUrl(provider.logo_path, "medium");
  return (
    <View style={styles.providerItem}>
      {logoUrl ? (
        <Image
          source={{ uri: logoUrl }}
          style={styles.logo}
          contentFit="cover"
        />
      ) : (
        <View style={[styles.logo, styles.logoPlaceholder]}>
          <Tv size={16} color={COLORS.textMuted} />
        </View>
      )}
      <Text style={styles.providerName} numberOfLines={1}>
        {provider.provider_name}
      </Text>
    </View>
  );
};

export const WatchProviders = ({ providers }: WatchProvidersProps) => {
  if (!providers) return null;

  const flatrate = providers.flatrate || [];
  const rent = providers.rent || [];
  const buy = providers.buy || [];

  if (!flatrate?.length && !rent?.length && !buy?.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Tv size={16} color={COLORS.primary} />
        <Text style={styles.headerTitle}>Watch On</Text>
        {providers.link && (
          <TouchableOpacity
            style={styles.moreBtn}
            onPress={() => Linking.openURL(providers.link)}
          >
            <ExternalLink size={12} color={COLORS.textMuted} />
            <Text style={styles.moreText}>More options</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Streaming */}
      {(flatrate?.length || 0) > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Stream</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.providerRow}
          >
            {flatrate.map((p) => (
              <ProviderLogo key={p.provider_id} provider={p} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Rent */}
      {(rent?.length || 0) > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Rent</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.providerRow}
          >
            {rent.slice(0, 6).map((p) => (
              <ProviderLogo key={p.provider_id} provider={p} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Buy */}
      {(buy?.length || 0) > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Buy</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.providerRow}
          >
            {buy.slice(0, 6).map((p) => (
              <ProviderLogo key={p.provider_id} provider={p} />
            ))}
          </ScrollView>
        </View>
      )}
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  moreBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  moreText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  section: { marginBottom: SPACING.md },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  providerRow: { gap: SPACING.md },
  providerItem: { alignItems: "center", gap: 5, width: 60 },
  logo: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logoPlaceholder: {
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  providerName: {
    fontSize: 9,
    color: COLORS.textMuted,
    textAlign: "center",
    fontWeight: "500",
  },
});
