import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { Maximize2, Play, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: W, height: H } = Dimensions.get("window");

interface TrailerPlayerProps {
  trailerKey: string | null;
  visible: boolean;
  onClose: () => void;
  movieTitle?: string;
}

// ─── Lazy load YoutubePlayer ──────────────────────────────────
let YoutubePlayer: any = null;
try {
  YoutubePlayer = require("react-native-youtube-iframe").default;
} catch {
  console.warn("react-native-youtube-iframe not available");
}

export const TrailerPlayer = ({
  trailerKey,
  visible,
  onClose,
  movieTitle,
}: TrailerPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!trailerKey) return null;

  // ─── Fallback UI if youtube-iframe not available ──────────
  if (!YoutubePlayer) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.fallbackBox}>
            <Play size={40} color={COLORS.primary} />
            <Text style={styles.fallbackTitle}>{movieTitle || "Trailer"}</Text>
            <Text style={styles.fallbackSub}>
              YouTube: youtube.com/watch?v={trailerKey}
            </Text>
            <TouchableOpacity style={styles.closeFullBtn} onPress={onClose}>
              <Text style={styles.closeFullText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar hidden />
      <View style={styles.overlay}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.label}>Official Trailer</Text>
            {movieTitle && (
              <Text style={styles.movieTitle} numberOfLines={1}>
                {movieTitle}
              </Text>
            )}
          </View>
          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setIsFullscreen((f) => !f)}
            >
              <Maximize2 size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={onClose}>
              <X size={18} color="#fff" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Player */}
        <View style={[styles.playerContainer, isFullscreen && { height: H }]}>
          {!isReady && (
            <View style={styles.loadingOverlay}>
              <Play size={36} color={COLORS.primary} />
              <ActivityIndicator
                color={COLORS.primary}
                size="large"
                style={{ marginTop: 12 }}
              />
            </View>
          )}
          <YoutubePlayer
            height={isFullscreen ? H : (W * 9) / 16}
            width={W}
            videoId={trailerKey}
            play={visible}
            onReady={() => setIsReady(true)}
            webViewProps={{
              allowsFullscreenVideo: true,
              mediaPlaybackRequiresUserAction: false,
            }}
          />
        </View>

        {/* Tap to close */}
        {!isFullscreen && (
          <TouchableOpacity
            style={styles.bottomArea}
            onPress={onClose}
            activeOpacity={0.6}
          >
            <View style={styles.closeHint}>
              <X size={14} color={COLORS.textMuted} />
              <Text style={styles.closeHintText}>Tap to close</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.base,
    paddingTop: 50,
    paddingBottom: SPACING.md,
  },
  label: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  movieTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    maxWidth: W * 0.65,
  },
  topActions: { flexDirection: "row", gap: 8 },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  playerContainer: {
    width: W,
    height: (W * 9) / 16,
    backgroundColor: "#000",
    overflow: "hidden",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  bottomArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 40,
  },
  closeHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  closeHintText: { color: COLORS.textMuted, fontSize: 12 },
  // Fallback styles
  fallbackBox: {
    margin: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xxl,
    padding: SPACING.xl,
    alignItems: "center",
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fallbackTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  fallbackSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: "center",
  },
  closeFullBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    marginTop: SPACING.sm,
  },
  closeFullText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
