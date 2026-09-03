// Anonymous visitor identity. No login, no email, no account: the site quietly
// mints one random ID per browser and uses it to key saves, reviews, and
// reports in the database. Deleting browser storage resets the ID (and orphans
// old rows), which is the accepted tradeoff of a no-account product.

const KEY = "blueprint.anon_id";

export function getAnonId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    let id = window.localStorage.getItem(KEY);
    if (!id) {
      id = generateId();
      window.localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers.
  return "anon-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Headers to attach to API calls that identify this anonymous visitor. */
export function anonHeaders(): Record<string, string> {
  const id = getAnonId();
  return id ? { "x-anon-id": id } : {};
}
