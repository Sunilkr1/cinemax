import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Types ────────────────────────────────────────────────────
interface StorageInstance {
  getString(key: string): string | undefined;
  set(key: string, value: string | number | boolean): void;
  getBoolean(key: string): boolean | undefined;
  getNumber(key: string): number | undefined;
  delete(key: string): void;
  clearAll(): void;
  contains(key: string): boolean;
  getAllKeys(): string[];
}

// ─── Persistent JSON Fallback (for persistent offline) ────────
// This class caches data in memory but flushes to AsyncStorage
// so it remains persistent on disk even if MMKV fails.
class PersistentFallback implements StorageInstance {
  private store: Record<string, string> = {};
  private isAvailable = false;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      // Check if AsyncStorage is actually available to avoid "Native module is null" crashes
      const keys = await AsyncStorage.getAllKeys();
      if (keys) {
        this.isAvailable = true;
        const pairs = await AsyncStorage.multiGet(keys);
        pairs.forEach(([key, value]) => {
          if (value !== null) this.store[key] = value;
        });
      }
    } catch (e) {
      console.warn(
        "AsyncStorage not available, falling back to in-memory only storage.",
      );
      this.isAvailable = false;
    }
  }

  getString(key: string): string | undefined {
    return this.store[key];
  }

  set(key: string, value: string | number | boolean): void {
    const sValue = String(value);
    this.store[key] = sValue;
    if (this.isAvailable) {
      AsyncStorage.setItem(key, sValue).catch(() => {});
    }
  }

  getBoolean(key: string): boolean | undefined {
    const val = this.store[key];
    if (val === undefined) return undefined;
    return val === "true";
  }

  getNumber(key: string): number | undefined {
    const val = this.store[key];
    if (val === undefined) return undefined;
    return Number(val);
  }

  delete(key: string): void {
    delete this.store[key];
    if (this.isAvailable) {
      AsyncStorage.removeItem(key).catch(() => {});
    }
  }

  clearAll(): void {
    this.store = {};
    if (this.isAvailable) {
      AsyncStorage.clear().catch(() => {});
    }
  }

  contains(key: string): boolean {
    return key in this.store;
  }

  getAllKeys(): string[] {
    return Object.keys(this.store);
  }
}

// ─── Initialize storage ───────────────────────────────────────
let storageInstance: StorageInstance;

try {
  // MMKV only works in dev builds / bare workflow
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { MMKV } = require("react-native-mmkv");
  storageInstance = new MMKV({
    id: "cinemax-storage",
    encryptionKey: "cinemax-secret-key",
  });
} catch {
  console.warn("MMKV unavailable — using AsyncStorage persistent fallback");
  storageInstance = new PersistentFallback();
}

export const storage = storageInstance;

// ─── Typed helpers ────────────────────────────────────────────
export const Storage = {
  getString: (key: string): string | undefined => {
    try {
      return storage.getString(key);
    } catch {
      return undefined;
    }
  },

  setString: (key: string, value: string): void => {
    try {
      storage.set(key, value);
    } catch {}
  },

  getBool: (key: string): boolean | undefined => {
    try {
      return storage.getBoolean(key);
    } catch {
      return undefined;
    }
  },

  setBool: (key: string, value: boolean): void => {
    try {
      storage.set(key, value);
    } catch {}
  },

  getNumber: (key: string): number | undefined => {
    try {
      return storage.getNumber(key);
    } catch {
      return undefined;
    }
  },

  setNumber: (key: string, value: number): void => {
    try {
      storage.set(key, value);
    } catch {}
  },

  getJSON: <T>(key: string): T | null => {
    try {
      const raw = storage.getString(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  setJSON: <T>(key: string, value: T): void => {
    try {
      storage.set(key, JSON.stringify(value));
    } catch {}
  },

  delete: (key: string): void => {
    try {
      storage.delete(key);
    } catch {}
  },

  clearAll: (): void => {
    try {
      storage.clearAll();
    } catch {}
  },

  has: (key: string): boolean => {
    try {
      return storage.contains(key);
    } catch {
      return false;
    }
  },

  getAllKeys: (): string[] => {
    try {
      return storage.getAllKeys();
    } catch {
      return [];
    }
  },
};

// ─── Storage key constants ────────────────────────────────────
export const STORAGE_KEYS = {
  THEME: "theme",
  LANGUAGE: "language",
  WATCHLIST: "watchlist",
  CUSTOM_LISTS: "custom_lists",
  CONTINUE_WATCHING: "continue_watching",
  SEARCH_HISTORY: "search_history",
  ONBOARDED: "onboarded",
  CACHE_TIMESTAMP: "cache_timestamp",
} as const;
