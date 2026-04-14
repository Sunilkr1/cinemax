import { useRouter } from "expo-router";
import { BookMarked, Heart, LayoutGrid, List, Plus } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FadeIn, FadeInList } from "@/components/animations/FadeIn";
import { MovieCard } from "@/components/ui/MovieCard";
import { Toast } from "@/components/ui/Toast";
import { CustomListCard } from "@/components/watchlist/CustomListCard";
import { OfflineBadge } from "@/components/watchlist/OfflineBadge";
import { SortOptions } from "@/components/watchlist/SortOptions";
import { WatchlistCard } from "@/components/watchlist/WatchlistCard";

import { COLORS, RADIUS, SHADOWS, SPACING } from "@/constants/theme";
import { useCustomLists } from "@/hooks/useCustomLists";
import { useOffline } from "@/hooks/useOffline";
import { useThemeColors } from "@/hooks/useTheme";
import { useWatchlist } from "@/hooks/useWatchlist";
import { CustomList } from "@/types/watchlist.types";

type ViewMode = "list" | "grid";
type SectionTab = "watchlist" | "lists";

// ─── Empty Watchlist ──────────────────────────────────────────
const EmptyWatchlist = () => {
  const router = useRouter();
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIconWrap}>
        <Heart size={44} color={COLORS.primary} strokeWidth={1.5} />
      </View>
      <Text style={styles.emptyTitle}>Your Library is Empty</Text>
      <Text style={styles.emptySub}>
        Tap the heart icon on any title to save it here
      </Text>
      <TouchableOpacity
        style={styles.emptyBtn}
        onPress={() => router.push("/(tabs)/explore")}
      >
        <Text style={styles.emptyBtnText}>Discover Content</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Empty Lists ──────────────────────────────────────────────
const EmptyLists = ({ onCreate }: { onCreate: () => void }) => (
  <View style={styles.empty}>
    <View
      style={[styles.emptyIconWrap, { backgroundColor: COLORS.purple + "18" }]}
    >
      <BookMarked size={44} color={COLORS.purple} strokeWidth={1.5} />
    </View>
    <Text style={styles.emptyTitle}>No Lists Yet</Text>
    <Text style={styles.emptySub}>
      Create custom lists like "Watch with Family"
    </Text>
    <TouchableOpacity
      style={[styles.emptyBtn, { backgroundColor: COLORS.purple }]}
      onPress={onCreate}
    >
      <Text style={styles.emptyBtnText}>Create List</Text>
    </TouchableOpacity>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────
export default function WatchlistScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState<SectionTab>("watchlist");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [modalVisible, setModalVisible] = useState(false);
  const [newListName, setNewListName] = useState("");

  const { isOffline } = useOffline();
  const { items, count, sortBy, remove, changeSortBy, isEmpty } =
    useWatchlist();
  const { lists, create, remove: removeList } = useCustomLists();

  // ─── Create List ──────────────────────────────────────────
  const handleCreateList = () => {
    if (Platform.OS === "ios") {
      Alert.prompt(
        "New List",
        "Enter a name",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Create",
            onPress: (name?: string) => {
              const t = name?.trim();
              if (t) {
                create(t);
                Toast.success("List Created", t);
              }
            },
          },
        ],
        "plain-text",
      );
    } else {
      setModalVisible(true);
    }
  };

  const handleAndroidCreate = () => {
    const t = newListName.trim();
    if (t) {
      create(t);
      Toast.success("List Created", t);
      setModalVisible(false);
      setNewListName("");
    }
  };

  // ─── Delete List ──────────────────────────────────────────
  const handleRemoveList = (list: CustomList) => {
    Alert.alert("Delete List", `Delete "${list.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          removeList(list.id);
          Toast.success("Deleted", list.name);
        },
      },
    ]);
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: colors.background },
      ]}
    >
      {/* ── Header ────────────────────────────────────────── */}
      <FadeIn>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Heart size={24} color={COLORS.primary} fill={COLORS.primary} />
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
              My Library
            </Text>
          </View>
          <View style={styles.headerRight}>
            {activeTab === "watchlist" && (
              <TouchableOpacity
                style={[
                  styles.iconBtn,
                  {
                    backgroundColor: COLORS.primary + "18",
                    borderColor: COLORS.primary + "30",
                  },
                ]}
                onPress={() =>
                  setViewMode((v) => (v === "list" ? "grid" : "list"))
                }
              >
                {viewMode === "list" ? (
                  <LayoutGrid size={18} color={COLORS.primary} />
                ) : (
                  <List size={18} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            )}
            {activeTab === "lists" && (
              <TouchableOpacity
                style={styles.createBtn}
                onPress={handleCreateList}
              >
                <Plus size={14} color="#fff" />
                <Text style={styles.createBtnText}>New</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </FadeIn>

      {/* ── Tab Row ───────────────────────────────────────── */}
      <FadeIn delay={50}>
        <View
          style={[
            styles.tabRow,
            {
              backgroundColor: colors.surfaceLight,
              borderColor: colors.border,
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.tab, activeTab === "watchlist" && styles.tabActive]}
            onPress={() => setActiveTab("watchlist")}
          >
            <Heart
              size={14}
              color={activeTab === "watchlist" ? "#fff" : colors.textSecondary}
              fill={activeTab === "watchlist" ? "#fff" : "transparent"}
            />
            <Text
              style={[
                styles.tabText,
                { color: colors.textSecondary },
                activeTab === "watchlist" && styles.tabTextActive,
              ]}
            >
              Watchlist
            </Text>
            {count > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{count}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "lists" && styles.tabActive]}
            onPress={() => setActiveTab("lists")}
          >
            <BookMarked
              size={14}
              color={activeTab === "lists" ? "#fff" : colors.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                { color: colors.textSecondary },
                activeTab === "lists" && styles.tabTextActive,
              ]}
            >
              My Lists
            </Text>
            {(lists?.length || 0) > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{lists?.length || 0}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </FadeIn>

      {/* ── Offline Badge ──────────────────────────────────── */}
      <OfflineBadge isOffline={isOffline} />

      {/* ── Watchlist Tab ─────────────────────────────────── */}
      {activeTab === "watchlist" && (
        <>
          {isEmpty ? (
            <EmptyWatchlist />
          ) : (
            <>
              <SortOptions current={sortBy} onChange={changeSortBy} />
              {viewMode === "list" ? (
                <FlatList
                  key="list"
                  data={items}
                  keyExtractor={(item) =>
                    item?.movie?.id?.toString() ?? Math.random().toString()
                  }
                  renderItem={({ item, index }) => {
                    if (!item?.movie) return null;
                    return (
                      <FadeInList index={index}>
                        <WatchlistCard
                          item={item}
                          onRemove={(id) => {
                            remove(id);
                            Toast.watchlist(
                              false,
                              item.movie.title || item.movie.name || "Content",
                            );
                          }}
                        />
                      </FadeInList>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listContent}
                />
              ) : (
                <FlatList
                  key="grid"
                  data={items}
                  keyExtractor={(item) =>
                    item?.movie?.id?.toString() ?? Math.random().toString()
                  }
                  numColumns={3}
                  renderItem={({ item }) => {
                    if (!item?.movie) return null;
                    return (
                      <View style={styles.gridItem}>
                        <MovieCard movie={item.movie} variant="compact" />
                      </View>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.gridContent}
                />
              )}
            </>
          )}
        </>
      )}

      {/* ── Lists Tab ─────────────────────────────────────── */}
      {activeTab === "lists" && (
        <>
          {!(lists?.length || 0) ? (
            <EmptyLists onCreate={handleCreateList} />
          ) : (
            <FlatList
              data={lists}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <FadeInList index={index}>
                  <CustomListCard
                    list={item}
                    onDelete={(id) => handleRemoveList({ ...item, id })}
                  />
                </FadeInList>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          )}
        </>
      )}

      {/* ── Android Modal ─────────────────────────────────── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={modalStyles.overlay}>
          <View
            style={[
              modalStyles.box,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[modalStyles.title, { color: colors.textPrimary }]}>
              New List
            </Text>
            <TextInput
              style={[
                modalStyles.input,
                {
                  backgroundColor: colors.surfaceLight,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                },
              ]}
              value={newListName}
              onChangeText={setNewListName}
              placeholder="e.g. Watch with Family"
              placeholderTextColor={colors.textMuted}
              autoFocus
              selectionColor={COLORS.primary}
              onSubmitEditing={handleAndroidCreate}
            />
            <View style={modalStyles.btns}>
              <TouchableOpacity
                style={[
                  modalStyles.cancelBtn,
                  {
                    backgroundColor: colors.surfaceLight,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => {
                  setModalVisible(false);
                  setNewListName("");
                }}
              >
                <Text
                  style={[
                    modalStyles.cancelText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  modalStyles.createBtn,
                  !newListName.trim() && { opacity: 0.5 },
                ]}
                onPress={handleAndroidCreate}
                disabled={!newListName.trim()}
              >
                <Text style={modalStyles.createText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    ...SHADOWS.primary,
  },
  createBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  tabRow: {
    flexDirection: "row",
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.xl,
    padding: 3,
    borderWidth: 1,
    gap: 3,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.lg,
  },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
  },
  tabTextActive: { color: "#fff", fontWeight: "700" },
  badge: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: RADIUS.full,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },
  listContent: { paddingBottom: 100 },
  gridContent: {
    paddingHorizontal: SPACING.sm,
    paddingBottom: 100,
  },
  gridItem: {
    flex: 1,
    paddingHorizontal: 4,
    marginBottom: SPACING.sm,
    maxWidth: "33.33%",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.xxl,
    gap: SPACING.md,
  },
  emptyIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.primary + "25",
    marginBottom: 4,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  emptySub: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyBtn: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: RADIUS.full,
    ...SHADOWS.primary,
  },
  emptyBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
  },
  box: {
    width: "100%",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xxl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  input: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: 13,
    color: COLORS.textPrimary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btns: { flexDirection: "row", gap: SPACING.sm },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  createBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  createText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});
