import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { ThemeContext } from "@/hooks/useTheme";
import { Storage } from "@/lib/storage";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Bell, CheckCircle2, Info, Sparkles } from "lucide-react-native";
import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "update" | "news" | "promo";
  url?: string | null;
  link?: string | null;
  date: string;
  read: boolean;
}

// In a real app, this URL would point to your remote API or GitHub Raw JSON
// Removed hardcoded remote URL for production cleanup

export const NotificationDrawer = forwardRef<BottomSheet>((props, ref) => {
  const { colors, isDark } = useContext(ThemeContext);
  const snapPoints = useMemo(() => ["50%", "85%"], []);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const localNotifs =
        Storage.getJSON<NotificationItem[]>("local_notifications") || [];

      // Only keep actual notifications, filter out any broken ones
      const filtered = localNotifs.filter((n) => n.title && n.message);

      setNotifications(filtered.sort((a, b) => b.date.localeCompare(a.date)));
    } catch {
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh every time the drawer opens or state changes
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <Pressable
      style={styles.itemContainer}
      onPress={() => {
        if (item.url) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          Linking.openURL(item.url);
        }
      }}
    >
      <BlurView
        intensity={isDark ? 20 : 50}
        tint={isDark ? "dark" : "light"}
        style={[styles.itemBlur, { borderColor: colors.border }]}
      >
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor:
                item.type === "update"
                  ? COLORS.primary + "20"
                  : item.type === "news"
                    ? COLORS.purple + "20"
                    : COLORS.gold + "20",
            },
          ]}
        >
          {item.type === "update" ? (
            <Sparkles size={18} color={COLORS.primary} />
          ) : item.type === "news" ? (
            <Bell size={18} color={COLORS.purple} />
          ) : (
            <Info size={18} color={COLORS.gold} />
          )}
        </View>
        <View style={styles.content}>
          <View style={styles.itemHeader}>
            <Text
              style={[
                styles.itemTitle,
                {
                  color: colors.textPrimary,
                  fontFamily: "Inter_700Bold",
                  flex: 1,
                },
              ]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            {!item.read && <View style={styles.unreadDot} />}
          </View>
          <Text
            style={[
              styles.itemMessage,
              {
                color: colors.textSecondary,
                fontFamily: "Inter_400Regular",
                flexWrap: "wrap",
              },
            ]}
          >
            {item.message}
          </Text>
          <View style={styles.itemFooter}>
            <Text
              style={[
                styles.itemDate,
                { color: colors.textMuted, fontFamily: "Inter_400Regular" },
              ]}
            >
              {item.date}
            </Text>
            {item.type === "update" && (
              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: COLORS.primary + "30" },
                ]}
              >
                <Text
                  style={[
                    styles.typeBadgeText,
                    { color: COLORS.primary, fontFamily: "Inter_900Black" },
                  ]}
                >
                  Update
                </Text>
              </View>
            )}
          </View>
          {/* Action Button for Links */}
          {(item.url || item.link) && (
            <View
              style={[
                styles.linkBtn,
                {
                  backgroundColor:
                    item.type === "update"
                      ? COLORS.success + "20"
                      : COLORS.primary + "15",
                },
              ]}
            >
              <Text
                style={[
                  styles.linkBtnText,
                  {
                    color:
                      item.type === "update" ? COLORS.success : COLORS.primary,
                  },
                ]}
              >
                {item.type === "update" ? "🚀 Update App Now" : "🌐 Open Link"}
              </Text>
            </View>
          )}
        </View>
      </BlurView>
    </Pressable>
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: colors.background }}
      handleIndicatorStyle={{ backgroundColor: colors.border }}
      onChange={(index) => {
        if (index > -1) {
          fetchNotifications();
        }
      }}
    >
      <BottomSheetFlatList
        data={notifications}
        keyExtractor={(item: NotificationItem) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View>
              <Text
                style={[
                  styles.title,
                  { color: colors.textPrimary, fontFamily: "Inter_900Black" },
                ]}
              >
                Inbox
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  { color: colors.textMuted, fontFamily: "Inter_400Regular" },
                ]}
              >
                Your personalized CineMax updates
              </Text>
            </View>

            <View style={styles.headerActions}>
              <Pressable
                style={styles.markRead}
                onPress={() => {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success,
                  );
                  const updated = notifications.map((n) => ({
                    ...n,
                    read: true,
                  }));
                  setNotifications(updated);
                  Storage.setJSON("local_notifications", updated);
                }}
              >
                <CheckCircle2 size={16} color={COLORS.primary} />
                <Text style={styles.markReadText}>Mark all</Text>
              </Pressable>

              {notifications.length > 0 && (
                <Pressable
                  style={[
                    styles.clearBtn,
                    { backgroundColor: COLORS.error + "15" },
                  ]}
                  onPress={() => {
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Warning,
                    );
                    setNotifications([]);
                    Storage.setJSON("local_notifications", []);
                  }}
                >
                  <Text style={[styles.markReadText, { color: COLORS.error }]}>
                    Clear
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Bell size={48} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              No notifications yet
            </Text>
          </View>
        }
      />
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.base,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: SPACING.md,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: -4,
    marginBottom: SPACING.base,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  markRead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primary + "15",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  markReadText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  list: {
    padding: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: 40,
  },
  itemContainer: {
    marginBottom: SPACING.md,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
  },
  itemBlur: {
    flexDirection: "row",
    gap: SPACING.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderRadius: RADIUS.lg,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  itemMessage: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  itemFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemDate: {
    fontSize: 11,
    fontWeight: "600",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  linkBtn: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  linkBtnText: {
    fontSize: 12,
    fontWeight: "700",
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
