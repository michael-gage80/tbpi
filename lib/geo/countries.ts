/**
 * Compact country reference for the visitor globe: ISO 3166-1 alpha-2 code →
 * display name + approximate centroid (lat, lng). Vercel Web Analytics reports
 * visitor country as an alpha-2 code, but we also resolve full names/aliases so
 * the globe works whichever form the callable returns.
 */

export interface Country {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  lat: number;
  lng: number;
}

// [code, name, lat, lng] — centroids, ordered roughly by web-traffic likelihood.
const RAW: [string, string, number, number][] = [
  ["US", "United States", 39.8, -98.6],
  ["GB", "United Kingdom", 54.0, -2.4],
  ["CA", "Canada", 56.1, -106.3],
  ["DE", "Germany", 51.2, 10.4],
  ["FR", "France", 46.6, 2.5],
  ["NL", "Netherlands", 52.1, 5.3],
  ["IN", "India", 22.4, 78.7],
  ["AU", "Australia", -25.7, 134.5],
  ["IE", "Ireland", 53.2, -7.7],
  ["ES", "Spain", 40.2, -3.6],
  ["IT", "Italy", 42.8, 12.6],
  ["BR", "Brazil", -10.3, -53.2],
  ["SE", "Sweden", 62.2, 15.3],
  ["CH", "Switzerland", 46.8, 8.2],
  ["BE", "Belgium", 50.6, 4.6],
  ["NG", "Nigeria", 9.6, 8.1],
  ["ZA", "South Africa", -28.5, 24.7],
  ["JP", "Japan", 36.6, 138.3],
  ["PL", "Poland", 52.1, 19.4],
  ["MX", "Mexico", 23.9, -102.5],
  ["NO", "Norway", 64.6, 12.7],
  ["DK", "Denmark", 56.0, 9.5],
  ["FI", "Finland", 64.5, 26.3],
  ["AT", "Austria", 47.6, 14.1],
  ["PT", "Portugal", 39.6, -8.0],
  ["GR", "Greece", 39.1, 22.9],
  ["CZ", "Czechia", 49.7, 15.3],
  ["RO", "Romania", 45.9, 25.0],
  ["HU", "Hungary", 47.2, 19.4],
  ["SG", "Singapore", 1.35, 103.8],
  ["HK", "Hong Kong", 22.35, 114.1],
  ["KR", "South Korea", 36.4, 127.8],
  ["CN", "China", 35.9, 104.2],
  ["TW", "Taiwan", 23.7, 121.0],
  ["ID", "Indonesia", -2.5, 118.0],
  ["MY", "Malaysia", 4.1, 109.5],
  ["PH", "Philippines", 12.8, 122.9],
  ["TH", "Thailand", 15.1, 101.0],
  ["VN", "Vietnam", 16.0, 107.9],
  ["NZ", "New Zealand", -41.8, 172.4],
  ["AE", "United Arab Emirates", 24.0, 54.0],
  ["SA", "Saudi Arabia", 24.1, 45.1],
  ["IL", "Israel", 31.4, 35.0],
  ["TR", "Turkey", 39.1, 35.2],
  ["RU", "Russia", 61.5, 96.7],
  ["UA", "Ukraine", 48.9, 31.4],
  ["AR", "Argentina", -35.4, -65.2],
  ["CL", "Chile", -35.7, -71.4],
  ["CO", "Colombia", 3.9, -73.1],
  ["PE", "Peru", -9.2, -75.0],
  ["KE", "Kenya", 0.5, 37.9],
  ["GH", "Ghana", 7.9, -1.0],
  ["EG", "Egypt", 26.5, 29.9],
  ["MA", "Morocco", 31.9, -6.9],
  ["ET", "Ethiopia", 8.6, 39.6],
  ["TZ", "Tanzania", -6.4, 34.9],
  ["UG", "Uganda", 1.3, 32.4],
  ["PK", "Pakistan", 30.0, 69.3],
  ["BD", "Bangladesh", 23.7, 90.3],
  ["LK", "Sri Lanka", 7.6, 80.7],
  ["NP", "Nepal", 28.3, 83.9],
  ["SK", "Slovakia", 48.7, 19.5],
  ["SI", "Slovenia", 46.1, 14.8],
  ["HR", "Croatia", 45.1, 15.5],
  ["RS", "Serbia", 44.0, 20.9],
  ["BG", "Bulgaria", 42.7, 25.2],
  ["LT", "Lithuania", 55.2, 23.9],
  ["LV", "Latvia", 56.9, 24.9],
  ["EE", "Estonia", 58.6, 25.0],
  ["IS", "Iceland", 64.9, -18.6],
  ["LU", "Luxembourg", 49.8, 6.1],
  ["MT", "Malta", 35.9, 14.4],
  ["CY", "Cyprus", 35.0, 33.2],
  ["JM", "Jamaica", 18.1, -77.3],
  ["TT", "Trinidad & Tobago", 10.5, -61.3],
  ["BB", "Barbados", 13.2, -59.5],
  ["BS", "Bahamas", 25.0, -77.4],
  ["DO", "Dominican Republic", 18.7, -70.2],
  ["HT", "Haiti", 19.1, -72.3],
  ["CU", "Cuba", 21.6, -79.0],
  ["PR", "Puerto Rico", 18.2, -66.5],
  ["CR", "Costa Rica", 9.9, -84.1],
  ["PA", "Panama", 8.5, -80.1],
  ["GT", "Guatemala", 15.7, -90.3],
  ["EC", "Ecuador", -1.4, -78.2],
  ["UY", "Uruguay", -32.8, -55.8],
  ["PY", "Paraguay", -23.4, -58.4],
  ["BO", "Bolivia", -16.7, -64.7],
  ["VE", "Venezuela", 6.4, -66.6],
  ["SN", "Senegal", 14.4, -14.5],
  ["CI", "Côte d'Ivoire", 7.6, -5.5],
  ["CM", "Cameroon", 5.7, 12.7],
  ["ZM", "Zambia", -13.5, 27.8],
  ["ZW", "Zimbabwe", -19.0, 29.9],
  ["BW", "Botswana", -22.2, 23.8],
  ["NA", "Namibia", -22.1, 17.2],
  ["MZ", "Mozambique", -17.3, 35.5],
  ["AO", "Angola", -11.2, 17.9],
  ["RW", "Rwanda", -1.9, 29.9],
  ["DZ", "Algeria", 28.0, 2.6],
  ["TN", "Tunisia", 34.1, 9.6],
  ["LY", "Libya", 27.0, 18.0],
  ["JO", "Jordan", 31.2, 36.8],
  ["LB", "Lebanon", 33.9, 35.9],
  ["QA", "Qatar", 25.3, 51.2],
  ["KW", "Kuwait", 29.3, 47.6],
  ["BH", "Bahrain", 26.0, 50.5],
  ["OM", "Oman", 21.5, 55.9],
  ["IQ", "Iraq", 33.0, 43.7],
  ["IR", "Iran", 32.4, 53.7],
  ["KZ", "Kazakhstan", 48.0, 66.9],
  ["UZ", "Uzbekistan", 41.8, 63.1],
  ["GE", "Georgia", 42.2, 43.5],
  ["AM", "Armenia", 40.3, 45.0],
  ["AZ", "Azerbaijan", 40.3, 47.7],
  ["MD", "Moldova", 47.2, 28.5],
  ["BY", "Belarus", 53.7, 28.0],
  ["AL", "Albania", 41.2, 20.0],
  ["MK", "North Macedonia", 41.6, 21.7],
  ["BA", "Bosnia & Herzegovina", 44.2, 17.8],
  ["ME", "Montenegro", 42.7, 19.4],
  ["MM", "Myanmar", 21.9, 96.0],
  ["KH", "Cambodia", 12.6, 104.9],
  ["LA", "Laos", 18.2, 103.9],
  ["MN", "Mongolia", 46.9, 103.8],
  ["MO", "Macau", 22.2, 113.5],
  ["FJ", "Fiji", -17.7, 178.1],
  ["PG", "Papua New Guinea", -6.5, 145.2],
];

export const COUNTRIES: Country[] = RAW.map(([code, name, lat, lng]) => ({ code, name, lat, lng }));

const BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]));

// Name / alias → code, for callables that return full country names.
const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");
const BY_NAME = new Map<string, string>();
for (const c of COUNTRIES) BY_NAME.set(norm(c.name), c.code);
const ALIASES: Record<string, string> = {
  usa: "US",
  unitedstatesofamerica: "US",
  america: "US",
  uk: "GB",
  greatbritain: "GB",
  england: "GB",
  scotland: "GB",
  wales: "GB",
  southkorea: "KR",
  korea: "KR",
  republicofkorea: "KR",
  russianfederation: "RU",
  uae: "AE",
  czechrepublic: "CZ",
  ivorycoast: "CI",
  cotedivoire: "CI",
  hongkongsarchina: "HK",
  macaosarchina: "MO",
  vietnamsocialistrepublic: "VN",
  brasil: "BR",
};
for (const [alias, code] of Object.entries(ALIASES)) BY_NAME.set(alias, code);

/** ISO alpha-2 code → 🇺🇸 regional-indicator flag emoji. */
export function codeToFlag(code: string): string {
  if (!/^[A-Za-z]{2}$/.test(code)) return "🏳️";
  return String.fromCodePoint(...[...code.toUpperCase()].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65));
}

/** Resolve a Vercel country label (code or name) to a known Country, or null. */
export function resolveCountry(label: string): Country | null {
  if (!label) return null;
  const trimmed = label.trim();
  if (/^[A-Za-z]{2}$/.test(trimmed)) return BY_CODE.get(trimmed.toUpperCase()) ?? null;
  const code = BY_NAME.get(norm(trimmed));
  return code ? BY_CODE.get(code) ?? null : null;
}
