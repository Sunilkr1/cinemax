import { Storage } from "@/lib/storage";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as TaskManager from "expo-task-manager";
import { Linking, Platform } from "react-native";

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

let Notifications: any = null;

try {
  Notifications = require("expo-notifications");

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  // Register background task handler
  TaskManager.defineTask(
    BACKGROUND_NOTIFICATION_TASK,
    async ({ data, error }: any) => {
      if (error) return;
      if (data && data.notification) {
        saveRemoteNotificationToInbox(data.notification);
      }
    },
  );

  Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK).catch(() => {});
} catch {
  console.warn("expo-notifications not available in Expo Go");
}

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!Notifications) return false;

  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "CineMax Alerts",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;

    if (existing !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === "granted";
  } catch {
    return false;
  }
};

export const scheduleMovieReleaseNotification = async (
  movieTitle: string,
  releaseDate: string,
  movieId: number,
): Promise<string | null> => {
  if (!Notifications) return null;

  try {
    const releaseDateObj = new Date(releaseDate);
    const notifyDate = new Date(releaseDateObj);
    notifyDate.setDate(notifyDate.getDate() - 1);

    if (notifyDate <= new Date()) return null;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "🎬 Coming Tomorrow!",
        body: `${movieTitle} releases tomorrow. Don't miss it!`,
        data: { movieId },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: notifyDate,
      },
    });

    return id;
  } catch {
    return null;
  }
};

export const showLocalTestNotification = async (): Promise<void> => {
  if (!Notifications) return;
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.warn("Notification permissions not granted for local test");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification! 🔔",
        body: "If you see this, CineMax notifications are working perfectly on your device!",
        sound: true,
        priority: "max",
      },
      trigger: null,
    });
    console.log("✅ Local test notification triggered");
  } catch (e) {
    console.error("❌ Failed to show local test notification:", e);
  }
};

export const showWatchlistTestNotification = async (
  movieTitle: string,
): Promise<void> => {
  if (!Notifications) return;
  try {
    await requestNotificationPermission();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Added to Watchlist ❤️",
        body: `"${movieTitle}" has been saved. We'll remind you when it releases!`,
        sound: true,
        data: { type: "news" },
      },
      trigger: null, // Send instantly
    });
  } catch {}
};

export const cancelNotification = async (id: string): Promise<void> => {
  if (!Notifications) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {}
};

export const cancelAllNotifications = async (): Promise<void> => {
  if (!Notifications) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {}
};

let lastProcessedColdStartId: string | null = null;

export const setupNotificationListeners = (router: any) => {
  if (!Notifications) return;

  // Listen for background clicks (when app is opened via notification)
  const responseSubscription =
    Notifications.addNotificationResponseReceivedListener((response: any) => {
      const notification = response.notification;
      saveRemoteNotificationToInbox(notification);

      const data = notification.request.content.data;
      if (data?.movieId) {
        router.push(`/movie/${data.movieId}`);
      } else if (data?.url) {
        // Open web links directly (e.g. Google Forms)
        Linking.openURL(data.url).catch((e) =>
          console.warn("Cannot open URL", e),
        );
      }
    });

  // Listen for foreground notifications (when app is open)
  const notificationSubscription =
    Notifications.addNotificationReceivedListener((notification: any) => {
      saveRemoteNotificationToInbox(notification);
    });

  // Handle cold start (when app was closed and opened via notification)
  Notifications.getLastNotificationResponseAsync().then((response: any) => {
    if (response && response.notification) {
      const notifId = response.notification.request.identifier;
      // Prevent zombie re-insertion on Hot Reloads / Remounts
      if (lastProcessedColdStartId === notifId) return;
      lastProcessedColdStartId = notifId;

      saveRemoteNotificationToInbox(response.notification);
      const data = response.notification.request.content.data;
      if (data?.movieId) {
        setTimeout(() => router.push(`/movie/${data.movieId}`), 500);
      } else if (data?.url) {
        setTimeout(() => {
          Linking.openURL(data.url).catch((e) =>
            console.warn("Cannot open URL", e),
          );
        }, 500);
      }
    }
  });

  return () => {
    responseSubscription.remove();
    notificationSubscription.remove();
  };
};

const saveRemoteNotificationToInbox = (notification: any) => {
  try {
    const { title, body, data } = notification.request.content;
    const currentNotifs = Storage.getJSON<any[]>("local_notifications") || [];

    // Prevent duplicates by checking notification ID
    const notifId = notification.request.identifier;
    if (currentNotifs.find((n) => n.id === notifId)) return;

    const now = new Date();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[now.getMonth()];
    const day = now.getDate();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    const newNotif = {
      id: notifId,
      title: title || "New Notification",
      message: body || "",
      type: data?.type || "news",
      url: data?.url || data?.link || null,
      link: data?.link || data?.url || null, // Fallback both ways
      date: `${month} ${day}, ${hours}:${minutes} ${ampm}`,
      read: false,
    };

    Storage.setJSON("local_notifications", [
      newNotif,
      ...currentNotifs.slice(0, 19),
    ]);
    console.log("📥 Remote notification saved to inbox:", title);
  } catch (e) {
    console.error("Failed to save notification to inbox:", e);
  }
};

export const registerForPushNotificationsAsync = async (): Promise<
  string | null
> => {
  if (!Notifications) return null;
  let token = null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#E50914",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Failed to get push token for push notification!");
      return null;
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      if (!projectId) {
        token = (await Notifications.getExpoPushTokenAsync()).data;
      } else {
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      }

      if (token) {
        Storage.setString("push_token", token);
        console.log("✅ Token saved to storage:", token);
      }
    } catch (e) {
      console.log("❌ Failed to get push token:", e);
    }
  } else {
    console.warn("Must use physical device for Push Notifications");
  }

  return token;
};
