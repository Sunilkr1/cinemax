import { COLORS } from "@/constants/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import { RotateCcw, ShieldCheck, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

export default function PlayerScreen() {
  const { id, type = "movie" } = useLocalSearchParams<{
    id: string;
    type: string;
  }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Vidsrc URL construction
  const streamUrl =
    type === "movie"
      ? `https://vidsrc.xyz/embed/movie/${id}`
      : `https://vidsrc.xyz/embed/tv/${id}`;

  useEffect(() => {
    // Lock to landscape for better video experience
    async function lockOrientation() {
      if (Platform.OS !== "web") {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE,
        );
      }
    }
    lockOrientation();

    return () => {
      // Return to vertical when leaving
      if (Platform.OS !== "web") {
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP,
        );
      }
    };
  }, []);

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Top Bar for close/actions */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.btn} onPress={handleClose}>
          <X color="#fff" size={24} />
        </TouchableOpacity>
        <View style={styles.badge}>
          <ShieldCheck size={14} color={COLORS.primary} />
          <Text style={styles.badgeText}>Safe Stream Active</Text>
        </View>
        <TouchableOpacity style={styles.btn} onPress={() => setError(false)}>
          <RotateCcw color="#fff" size={20} />
        </TouchableOpacity>
      </View>

      {/* The Player */}
      <WebView
        source={{ uri: streamUrl }}
        style={styles.webview}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => setError(true)}
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        // Injected JS to hide some unwanted elements from the embed site if possible
        injectedJavaScript={`
          (function() {
            var style = document.createElement('style');
            style.innerHTML = '.logo-vidsrc, #loading, .dropdown-content { display: none !important; }';
            document.head.appendChild(style);
          })();
        `}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Initializing Stream...</Text>
        </View>
      )}

      {/* Error State */}
      {error && (
        <View style={styles.overlay}>
          <Text style={styles.errorText}>
            Stream unavailable. Please try again later.
          </Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.retryText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  webview: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  loadingText: {
    color: "#fff",
    marginTop: 15,
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "700",
  },
});
