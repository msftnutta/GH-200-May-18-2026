const { iconToEmoji } = require('../utils/iconMap');

const BASE_URL = 'https://atlas.microsoft.com/weather/currentConditions/json';
const API_VERSION = '1.1';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const cache = new Map(); // key: "lat,lon" -> { expiresAt, data }

function cacheKey(lat, lon) {
  return `${lat},${lon}`;
}

function _now() {
  return Date.now();
}

/**
 * Fetch current weather for a coordinate from Azure Maps.
 * Returns an object: { temperatureC, phrase, iconCode, emoji }
 * Throws on network/API error; callers should handle gracefully.
 */
async function getWeather(lat, lon, { fetchImpl = globalThis.fetch, apiKey = process.env.AZURE_MAPS_KEY } = {}) {
  if (!apiKey) {
    throw new Error('AZURE_MAPS_KEY is not configured');
  }
  if (typeof fetchImpl !== 'function') {
    throw new Error('No fetch implementation available (requires Node 18+)');
  }

  const key = cacheKey(lat, lon);
  const cached = cache.get(key);
  if (cached && cached.expiresAt > _now()) {
    return cached.data;
  }

  const url = `${BASE_URL}?api-version=${API_VERSION}&query=${lat},${lon}&unit=metric&subscription-key=${encodeURIComponent(apiKey)}`;
  const res = await fetchImpl(url);
  if (!res.ok) {
    throw new Error(`Azure Maps responded ${res.status}`);
  }
  const body = await res.json();
  const r = (body && body.results && body.results[0]) || {};

  const data = {
    temperatureC: r.temperature && typeof r.temperature.value === 'number' ? r.temperature.value : null,
    phrase: r.phrase || 'Unknown',
    iconCode: r.iconCode || null,
    emoji: iconToEmoji(r.iconCode)
  };

  cache.set(key, { expiresAt: _now() + CACHE_TTL_MS, data });
  return data;
}

function _clearCache() {
  cache.clear();
}

module.exports = { getWeather, _clearCache, CACHE_TTL_MS };
