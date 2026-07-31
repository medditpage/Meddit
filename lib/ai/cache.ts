// lib/ai/cache.ts
// Deterministic response caching layer for AI outputs

const cacheMap = new Map<string, { data: any; expiresAt: number }>();

export function getAICache<T>(key: string): T | null {
  const item = cacheMap.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    cacheMap.delete(key);
    return null;
  }
  return item.data as T;
}

export function setAICache<T>(key: string, data: T, ttlSeconds: number = 3600): void {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  cacheMap.set(key, { data, expiresAt });
}

export function invalidateAICache(keyPrefix: string): void {
  for (const k of cacheMap.keys()) {
    if (k.startsWith(keyPrefix)) {
      cacheMap.delete(k);
    }
  }
}
