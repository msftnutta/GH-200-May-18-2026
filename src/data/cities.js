/**
 * Predefined list of cities to display.
 * timezone:  IANA time zone identifier (used by Intl.DateTimeFormat in the browser).
 * flag:      ISO country flag emoji.
 * continent: one of "Asia" | "Europe" | "North America" | "South America" | "ANZ"
 */
module.exports = [
  { id: 'sgp', name: 'Singapore',    country: 'Singapore',      continent: 'Asia',          timezone: 'Asia/Singapore',     lat: 1.3521,  lon: 103.8198, flag: '🇸🇬' },
  { id: 'kul', name: 'Kuala Lumpur', country: 'Malaysia',       continent: 'Asia',          timezone: 'Asia/Kuala_Lumpur',  lat: 3.1390,  lon: 101.6869, flag: '🇲🇾' },
  { id: 'bkk', name: 'Bangkok',      country: 'Thailand',       continent: 'Asia',          timezone: 'Asia/Bangkok',       lat: 13.7563, lon: 100.5018, flag: '🇹🇭' },
  { id: 'tyo', name: 'Tokyo',        country: 'Japan',          continent: 'Asia',          timezone: 'Asia/Tokyo',         lat: 35.6762, lon: 139.6503, flag: '🇯🇵' },
  { id: 'sel', name: 'Seoul',        country: 'South Korea',    continent: 'Asia',          timezone: 'Asia/Seoul',         lat: 37.5665, lon: 126.9780, flag: '🇰🇷' },
  { id: 'hkg', name: 'Hong Kong',    country: 'Hong Kong SAR',  continent: 'Asia',          timezone: 'Asia/Hong_Kong',     lat: 22.3193, lon: 114.1694, flag: '🇭🇰' },
  { id: 'sha', name: 'Shanghai',     country: 'China',          continent: 'Asia',          timezone: 'Asia/Shanghai',      lat: 31.2304, lon: 121.4737, flag: '🇨🇳' },
  { id: 'del', name: 'New Delhi',    country: 'India',          continent: 'Asia',          timezone: 'Asia/Kolkata',       lat: 28.6139, lon: 77.2090,  flag: '🇮🇳' },
  { id: 'dxb', name: 'Dubai',        country: 'UAE',            continent: 'Asia',          timezone: 'Asia/Dubai',         lat: 25.2048, lon: 55.2708,  flag: '🇦🇪' },
  { id: 'ist', name: 'Istanbul',     country: 'Türkiye',        continent: 'Europe',        timezone: 'Europe/Istanbul',    lat: 41.0082, lon: 28.9784,  flag: '🇹🇷' },
  { id: 'lon', name: 'London',       country: 'United Kingdom', continent: 'Europe',        timezone: 'Europe/London',      lat: 51.5074, lon: -0.1278,  flag: '🇬🇧' },
  { id: 'par', name: 'Paris',        country: 'France',         continent: 'Europe',        timezone: 'Europe/Paris',       lat: 48.8566, lon: 2.3522,   flag: '🇫🇷' },
  { id: 'ber', name: 'Berlin',       country: 'Germany',        continent: 'Europe',        timezone: 'Europe/Berlin',      lat: 52.5200, lon: 13.4050,  flag: '🇩🇪' },
  { id: 'mad', name: 'Madrid',       country: 'Spain',          continent: 'Europe',        timezone: 'Europe/Madrid',      lat: 40.4168, lon: -3.7038,  flag: '🇪🇸' },
  { id: 'nyc', name: 'New York',     country: 'United States',  continent: 'North America', timezone: 'America/New_York',   lat: 40.7128, lon: -74.0060, flag: '🇺🇸' },
  { id: 'chi', name: 'Chicago',      country: 'United States',  continent: 'North America', timezone: 'America/Chicago',    lat: 41.8781, lon: -87.6298, flag: '🇺🇸' },
  { id: 'lax', name: 'Los Angeles',  country: 'United States',  continent: 'North America', timezone: 'America/Los_Angeles',lat: 34.0522, lon: -118.2437,flag: '🇺🇸' },
  { id: 'mex', name: 'Mexico City',  country: 'Mexico',         continent: 'North America', timezone: 'America/Mexico_City',lat: 19.4326, lon: -99.1332, flag: '🇲🇽' },
  { id: 'sao', name: 'São Paulo',    country: 'Brazil',         continent: 'South America', timezone: 'America/Sao_Paulo',  lat: -23.5505,lon: -46.6333, flag: '🇧🇷' },
  { id: 'syd', name: 'Sydney',       country: 'Australia',      continent: 'ANZ',           timezone: 'Australia/Sydney',   lat: -33.8688,lon: 151.2093, flag: '🇦🇺' }
];
