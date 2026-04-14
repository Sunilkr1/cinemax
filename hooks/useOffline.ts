import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export const useOffline = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isInternetReachable, setIsInternetReachable] = useState<
    boolean | null
  >(null);
  const [connectionType, setConnectionType] = useState<string>("unknown");

  useEffect(() => {
    // Get initial state
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected ?? null);
      setIsInternetReachable(state.isInternetReachable ?? null);
      setConnectionType(state.type ?? "unknown");
    });

    // Subscribe to changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? null);
      setIsInternetReachable(state.isInternetReachable ?? null);
      setConnectionType(state.type ?? "unknown");
    });

    return () => unsubscribe();
  }, []);

  const isOffline = isConnected === false || isInternetReachable === false;
  const isOnline = isConnected === true && isInternetReachable !== false;
  const isWifi = connectionType === "wifi";
  const isCellular = connectionType === "cellular";

  return {
    isOffline,
    isOnline,
    isConnected,
    isInternetReachable,
    isWifi,
    isCellular,
    connectionType,
  };
};
