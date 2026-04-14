import Constants from "expo-constants";
import { useEffect } from "react";
import { Alert, Linking } from "react-native";

// In a real app, this should point to your backend API or GitHub JSON file
// that hosts the details of the latest version.
// Example content of your JSON online:
// {
//   "latestVersion": "1.0.1",
//   "downloadUrl": "https://your-drive-link.com/cinemax-v1.0.1.apk",
//   "releaseNotes": "Added new movie notifications!"
// }
const UPDATE_CHECK_URL =
  "https://raw.githubusercontent.com/Sunilkr1/cinemax/main/version.json";

export const checkAppUpdate = async (manualCheck = false) => {
  try {
    const currentVersion = Constants.expoConfig?.version || "1.0.0";

    let data: {
      latestVersion: string;
      downloadUrl: string;
      releaseNotes: string;
    } | null = null;

    try {
      const response = await fetch(UPDATE_CHECK_URL);
      if (response.ok) {
        data = await response.json();
      }
    } catch (e) {
      // Silent catch for network errors during update check
    }

    if (data && data.latestVersion > currentVersion) {
      Alert.alert(
        "New Update Available! 🎉",
        `Version ${data.latestVersion} is out.\n\nWhat's new: ${data.releaseNotes}\n\nDo you want to update now?`,
        [
          { text: "Later", style: "cancel" },
          {
            text: "Download Now",
            onPress: () => {
              const url = data?.downloadUrl || "";
              if (url) {
                Linking.openURL(url);
              }
            },
          },
        ],
      );
      return true;
    } else if (manualCheck) {
      Alert.alert("Up to date", "You are on the latest version of CineMax.");
      return false;
    }
  } catch (e) {
    if (manualCheck)
      Alert.alert("Error", "Could not check for updates right now.");
    console.log("Failed to check app update", e);
    return false;
  }
};

export const useAppUpdate = () => {
  useEffect(() => {
    checkAppUpdate();
  }, []);
};
