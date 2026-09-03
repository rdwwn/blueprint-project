import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "..", "..", "opp-research", "merged3.json");
const out = join(root, "src", "data", "opportunities.ts");

const raw = JSON.parse(readFileSync(src, "utf8"));

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---- Derivation helpers (best-effort, audit-friendly keyword scans) ----

// Certificates are a CATEGORY, not a field — null them so they stop
// polluting the Field facet. They stay reachable under Category > Certificate.
const normaliseField = (r) =>
  r.field === "Certificates" ? "" : r.field || "";

// Audience / trait tags derived from the free-text fields. Keyword-based and
// deliberately conservative — counts will be small but honest.
function deriveTags(r) {
  const hay = [
    r.eligibility,
    r.cost,
    r.cost_detail,
    r.description,
    r.location,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const tags = new Set();

  if (/\b(girls|young women|females?|women)\b/.test(hay)) tags.add("Girls");
  if (/\b(boys|young men|males?)\b/.test(hay)) tags.add("Boys");
  if (
    /\b(low[- ]income|financial (need|hardship)|economic(ally)? (disadvantaged|underprivileged)|need[- ]based)\b/.test(
      hay,
    )
  )
    tags.add("Low-Income");
  if (/\bfirst[- ]generation\b|\bfirst[- ]gen\b/.test(hay))
    tags.add("1st-Generation");
  if (
    /\b(underrepresented|under[- ]represented|minorities?|urm|historically (underrepresented|excluded))\b/.test(
      hay,
    )
  )
    tags.add("Under-represented Minorities");
  if (/\bcollege credit\b|\bcredit(s)? (toward|towards) college\b/.test(hay))
    tags.add("College Credit");
  if (/\b1[- ]on[- ]1\b|\bone[- ]on[- ]one\b/.test(hay)) tags.add("1-on-1");

  return [...tags];
}

// Season derived from the category (Summer Program / School Year Program).
function deriveSeason(r) {
  const cat = (r.category || "").toLowerCase();
  if (cat.includes("summer")) return "Summer";
  if (cat.includes("school year")) return "School year";
  return null;
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

const seen = new Map();
for (const r of raw) {
  const slug = slugify(r.name);
  if (seen.has(slug)) console.warn(`DUP SLUG: "${r.name}" <-> "${seen.get(slug)}"`);
  seen.set(slug, r.name);
}

const rows = [...raw].sort((a, b) => a.name.localeCompare(b.name));

const header = `export type Opportunity = {
  name: string;
  org: string | null;
  category: string | null;
  field: string | null;
  eligibility: string | null;
  location: string | null;
  cost: string | null;
  cost_detail: string | null;
  deadline: string | null;
  duration: string | null;
  url: string;
  description: string | null;
  verified: boolean;
  cat_norm: string | null;
  tags: string[];
  season: string | null;
  host: string | null;
};

export const OPPORTUNITIES: Opportunity[] = [
`;

const parts = rows.map((r) => {
  const category = r.category || "";
  const fields = [
    ["name", r.name],
    ["org", r.org || ""],
    ["category", category],
    ["field", normaliseField(r)],
    ["eligibility", r.eligibility || ""],
    ["location", r.location || ""],
    ["cost", r.cost || ""],
    ["cost_detail", r.cost_detail || ""],
    ["deadline", r.deadline || ""],
    ["duration", r.duration || ""],
    ["url", r.url || ""],
    ["description", r.description || ""],
    ["verified", r.verified],
    ["cat_norm", category],
    ["tags", deriveTags(r)],
    ["season", deriveSeason(r)],
    ["host", hostOf(r.url)],
  ];
  const lines = fields.map(([k, v]) => `    ${JSON.stringify(k)}: ${JSON.stringify(v)}`);
  return `  {\n${lines.join(",\n")}\n  }`;
});

writeFileSync(out, header + parts.join(",\n") + "\n];\n", "utf8");

const tagCounts = {};
for (const r of rows) {
  for (const t of deriveTags(r)) tagCounts[t] = (tagCounts[t] ?? 0) + 1;
}
console.log(`Wrote ${rows.length} opportunities -> ${out}`);
console.log(`Distinct fields: ${new Set(rows.map(normaliseField).filter(Boolean)).size}`);
console.log(`Distinct categories: ${new Set(rows.map((r) => r.category)).size}`);
console.log(`Certificate-as-field count: ${rows.filter((r) => r.field === "Certificates").length} -> 0`);
console.log("Tag counts:", tagCounts);
console.log(
  "Season counts:",
  rows.reduce((acc, r) => {
    const s = deriveSeason(r);
    if (s) acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {}),
);