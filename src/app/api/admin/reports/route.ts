import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-server";
import { isAdminRequest } from "@/lib/admin-auth";

function serialize(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    anonId: row.anon_id ? String(row.anon_id).slice(0, 8) + "…" : null,
    opportunitySlug: row.opportunity_slug ? String(row.opportunity_slug) : null,
    opportunityName: row.opportunity_name ? String(row.opportunity_name) : null,
    issueType: String(row.issue_type),
    details: String(row.details),
    status: row.status as string,
    createdAt: String(row.created_at),
    resolvedAt: row.resolved_at ? String(row.resolved_at) : null,
    moderatorNote: row.moderator_note ? String(row.moderator_note) : null,
  };
}

// GET /api/admin/reports — open queue + recently resolved
export async function GET(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const db = getSupabase();
    const [{ data: open }, { data: resolved }, { data: all }] = await Promise.all([
      db.from("reports").select("*").eq("status", "open").order("created_at", { ascending: false }).limit(200),
      db.from("reports").select("*").eq("status", "resolved").order("created_at", { ascending: false }).limit(50),
      db.from("reports").select("status"),
    ]);
    const counts = { open: 0, resolved: 0 };
    for (const row of (all ?? []) as { status: string }[]) {
      if (row.status in counts) counts[row.status as keyof typeof counts]++;
    }
    return NextResponse.json({
      open: ((open ?? []) as Record<string, unknown>[]).map(serialize),
      resolved: ((resolved ?? []) as Record<string, unknown>[]).map(serialize),
      counts,
    });
  } catch (err) {
    console.error("admin reports GET failed:", err);
    return NextResponse.json({ error: "Could not load reports" }, { status: 500 });
  }
}

// PATCH /api/admin/reports — { id, action: "resolve" | "reopen", note? }
export async function PATCH(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const id = typeof body.id === "string" ? body.id : "";
  const action = body.action;
  const note = typeof body.note === "string" ? body.note.trim().slice(0, 500) : "";
  if (!id || (action !== "resolve" && action !== "reopen")) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    const patch =
      action === "resolve"
        ? { status: "resolved", resolved_at: new Date().toISOString(), moderator_note: note || null }
        : { status: "open", resolved_at: null, moderator_note: note || null };
    const { error } = await getSupabase().from("reports").update(patch).eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin reports PATCH failed:", err);
    return NextResponse.json({ error: "Could not update report" }, { status: 500 });
  }
}
