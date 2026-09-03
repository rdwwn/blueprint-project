import { OPPORTUNITIES } from "@/data/opportunities";

const STATES: { abbr: string; name: string }[] = [
  { abbr: "al", name: "alabama" },
  { abbr: "az", name: "arizona" },
  { abbr: "ar", name: "arkansas" },
  { abbr: "ca", name: "california" },
  { abbr: "co", name: "colorado" },
  { abbr: "ct", name: "connecticut" },
  { abbr: "dc", name: "washington d.c." },
  { abbr: "de", name: "delaware" },
  { abbr: "fl", name: "florida" },
  { abbr: "ga", name: "georgia" },
  { abbr: "hi", name: "hawaii" },
  { abbr: "id", name: "idaho" },
  { abbr: "il", name: "illinois" },
  { abbr: "in", name: "indiana" },
  { abbr: "ia", name: "iowa" },
  { abbr: "ks", name: "kansas" },
  { abbr: "ky", name: "kentucky" },
  { abbr: "la", name: "louisiana" },
  { abbr: "me", name: "maine" },
  { abbr: "md", name: "maryland" },
  { abbr: "ma", name: "massachusetts" },
  { abbr: "mi", name: "michigan" },
  { abbr: "mn", name: "minnesota" },
  { abbr: "ms", name: "mississippi" },
  { abbr: "mo", name: "missouri" },
  { abbr: "mt", name: "montana" },
  { abbr: "ne", name: "nebraska" },
  { abbr: "nv", name: "nevada" },
  { abbr: "nh", name: "new hampshire" },
  { abbr: "nj", name: "new jersey" },
  { abbr: "nm", name: "new mexico" },
  { abbr: "ny", name: "new york" },
  { abbr: "nc", name: "north carolina" },
  { abbr: "nd", name: "north dakota" },
  { abbr: "oh", name: "ohio" },
  { abbr: "ok", name: "oklahoma" },
  { abbr: "or", name: "oregon" },
  { abbr: "pa", name: "pennsylvania" },
  { abbr: "ri", name: "rhode island" },
  { abbr: "sc", name: "south carolina" },
  { abbr: "sd", name: "south dakota" },
  { abbr: "tn", name: "tennessee" },
  { abbr: "tx", name: "texas" },
  { abbr: "ut", name: "utah" },
  { abbr: "vt", name: "vermont" },
  { abbr: "va", name: "virginia" },
  { abbr: "wa", name: "washington" },
  { abbr: "wv", name: "west virginia" },
  { abbr: "wi", name: "wisconsin" },
  { abbr: "wy", name: "wyoming" },
];

// City aliases that don't contain an obvious state code.
const CITY_ALIASES: { abbr: string; keys: string[] }[] = [
  { abbr: "ny", keys: ["new york city", "brooklyn", "manhattan"] },
  { abbr: "dc", keys: ["washington, dc", "washington dc", "washington, d.c."] },
  { abbr: "ma", keys: ["boston", "cambridge", "worcester"] },
  { abbr: "ca", keys: ["stanford", "san francisco", "la jolla", "pasadena"] },
  { abbr: "md", keys: ["bethesda"] },
  { abbr: "pa", keys: ["philadelphia", "pittsburgh"] },
  { abbr: "tn", keys: ["memphis", "nashville"] },
  { abbr: "oh", keys: ["cleveland", "cincinnati", "columbus"] },
  { abbr: "tx", keys: ["houston", "dallas", "austin"] },
  { abbr: "nj", keys: ["princeton"] },
  { abbr: "co", keys: ["boulder", "denver"] },
  { abbr: "nc", keys: ["durham", "raleigh"] },
  { abbr: "mn", keys: ["rochester"] },
  { abbr: "wa", keys: ["seattle"] },
  { abbr: "il", keys: ["chicago", "batavia"] },
  { abbr: "ct", keys: ["new haven"] },
  { abbr: "ga", keys: ["atlanta"] },
  { abbr: "fl", keys: ["miami", "gainesville"] },
  { abbr: "mo", keys: ["st. louis", "kansas city"] },
  { abbr: "mi", keys: ["ann arbor"] },
  { abbr: "va", keys: ["charlottesville", "arlington"] },
];

export function findState(loc: string): string | null {
  const lower = loc.toLowerCase();
  for (const alias of CITY_ALIASES) {
    if (alias.keys.some((k) => lower.includes(k))) return alias.abbr;
  }
  for (const s of STATES) {
    if (lower.includes(s.name)) return s.abbr;
  }
  for (const s of STATES) {
    const re = new RegExp(`\\b${s.abbr.toUpperCase()}\\b`);
    if (re.test(loc)) return s.abbr;
  }
  if (
    lower.includes("online") ||
    lower.includes("virtual") ||
    lower.includes("remote") ||
    lower.includes("national")
  ) {
    return null;
  }
  return null;
}

export const STATE_COUNTS: Record<string, number> = (() => {
  const counts: Record<string, number> = {};
  for (const o of OPPORTUNITIES) {
    if (!o.location) continue;
    const abbr = findState(o.location);
    if (abbr && abbr !== "ak" && abbr !== "hi") {
      counts[abbr] = (counts[abbr] ?? 0) + 1;
    }
  }
  return counts;
})();

export const NATIONWIDE_ONLINE_COUNT = (() => {
  let n = 0;
  for (const o of OPPORTUNITIES) {
    if (!o.location || !findState(o.location)) n++;
  }
  return n;
})();

export const MAX_STATE_COUNT = Math.max(1, ...Object.values(STATE_COUNTS));

export const TOP_HUB_STATES = Object.entries(STATE_COUNTS)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 12)
  .map(([abbr]) => abbr);