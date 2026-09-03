// Shared guard for the private admin routes. The browser sends the passcode in
// the x-admin-key header; the server compares it to MODERATION_PASS (env var).
export function isAdminRequest(request: Request): boolean {
  const expected = process.env.MODERATION_PASS;
  if (!expected) return false;
  const given = request.headers.get("x-admin-key") ?? "";
  // Constant-time-ish compare to avoid leaking timing on a short secret.
  if (given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= given.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}
