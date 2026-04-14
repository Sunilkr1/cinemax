import { NetflixSplash } from "@/components/animations/NetflixSplash";
import { ToastProvider } from "@/components/ui/Toast";
import { useAppUpdate } from "@/hooks/useAppUpdate";
import { ThemeContext, useTheme } from "@/hooks/useTheme";
import {
  registerForPushNotificationsAsync,
  setupNotificationListeners,
} from "@/lib/notifications";
import { queryClient } from "@/lib/queryClient";
import { Storage } from "@/lib/storage";
import {
  Inter_400Regular,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// ─── Inner layout — has access to useTheme ────────────────────
function AppLayout() {
  const themeValue = useTheme();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  useAppUpdate(); // Checks for APK Updates on Startup

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    Inter_900Black,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Keep static splash hidden as early as possible
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    // Log existing token to terminal on startup for easy testing
    const existingToken = Storage.getString("push_token");
    if (existingToken) {
      console.log(
        "\n\n📱 [CineMax] Current Push Token:",
        existingToken,
        "\n\n",
      );
    }

    // Automatically register device for remote push notifications
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        console.log("🔥 Expo Push Token:", token);
      }
    });

    // Setup global listeners (Persistence + Navigation)
    const cleanup = setupNotificationListeners(router);
    return () => cleanup?.();
  }, [router]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeContext.Provider value={themeValue}>
      <StatusBar
        style={themeValue.isDark ? "light" : "dark"}
        backgroundColor="transparent"
        translucent={true}
      />
      <ThemeProvider value={themeValue.isDark ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: themeValue.colors.background,
            },
            animation: "fade_from_bottom",
          }}
        >
          <Stack.Screen name="(tabs)" options={{ animation: "none" }} />
          <Stack.Screen
            name="movie/[id]"
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="cast/[id]"
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="collection/[id]"
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="custom-list/[id]"
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="mood/index"
            options={{ animation: "slide_from_bottom" }}
          />
        </Stack>
      </ThemeProvider>
      <ToastProvider />
      {showSplash && <NetflixSplash onFinish={() => setShowSplash(false)} />}
    </ThemeContext.Provider>
  );
}

// ─── Root layout ──────────────────────────────────────────────
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AppLayout />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
