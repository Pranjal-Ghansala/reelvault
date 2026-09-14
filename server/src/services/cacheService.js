const cache = new Map();

function isExpired(entry) {
  return Date.now() >= entry.expiresAt;
}

export function getCached(key) {
  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  if (isExpired(entry)) {
    cache.delete(key);
    return null;
  }

  return entry.value;
}

export function setCached(key, value, ttlMs) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
}

export function deleteCached(key) {
  cache.delete(key);
}

export function clearCache() {
  cache.clear();
}

export function getCacheSize() {
  return cache.size;
}