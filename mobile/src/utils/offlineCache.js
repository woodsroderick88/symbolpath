import AsyncStorage from "@react-native-async-storage/async-storage";

export const CACHE_KEYS = {
  READINGS: "@cache_readings",
  MOON_DATA: "@cache_moon",
  LAST_SYNC: "@cache_last_sync",
  PENDING_READINGS: "@cache_pending_readings",
};

const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export async function cacheData(key, data) {
  try {
    await AsyncStorage.setItem(
      key,
      JSON.stringify({ data, cachedAt: Date.now() }),
    );
  } catch (e) {
    console.error("Cache write error:", e);
  }
}

export async function getCachedData(key, ttl = CACHE_TTL) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const { data, cachedAt } = JSON.parse(raw);
    if (Date.now() - cachedAt > ttl) return null;
    return data;
  } catch (e) {
    return null;
  }
}

export async function fetchWithCache(url, cacheKey) {
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      await cacheData(cacheKey, data);
      return { data, fromCache: false };
    }
  } catch (e) {
    console.warn("Network fetch failed, trying cache:", e?.message);
  }
  const cached = await getCachedData(cacheKey);
  if (cached) return { data: cached, fromCache: true };
  return { data: null, fromCache: false };
}

export async function queueReadingForSync(readingPayload) {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.PENDING_READINGS);
    const pending = raw ? JSON.parse(raw) : [];
    pending.push({ ...readingPayload, queuedAt: Date.now() });
    await AsyncStorage.setItem(
      CACHE_KEYS.PENDING_READINGS,
      JSON.stringify(pending),
    );
    return true;
  } catch (e) {
    return false;
  }
}

export async function syncPendingReadings() {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.PENDING_READINGS);
    if (!raw) return { synced: 0 };
    const pending = JSON.parse(raw);
    if (pending.length === 0) return { synced: 0 };
    let synced = 0;
    const remaining = [];
    for (const reading of pending) {
      try {
        const { queuedAt, ...payload } = reading;
        const res = await fetch("/api/readings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) synced++;
        else remaining.push(reading);
      } catch {
        remaining.push(reading);
      }
    }
    await AsyncStorage.setItem(
      CACHE_KEYS.PENDING_READINGS,
      JSON.stringify(remaining),
    );
    return { synced, pending: remaining.length };
  } catch {
    return { synced: 0 };
  }
}
