import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-server";
import { isAdminRequest } from "@/lib/admin-auth";

function serialize(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    anonId: String(row.anon_id).slice(0, 8) + "…", // never show the full anon id
    opportunitySlug: String(row.opportunity_slug),
    opportunityName: String(row.opportunity_name),
    author: String(row.author),
    grade: row.grade ? String(row.grade) : null,
    rating: Number(row.rating),
    text: String(row.text),
    status: row.status as string,
    createdAt: String(row.created_at),
    moderatedAt: row.moderated_at ? String(row.moderated_at) : null,
  };
}

// GET /api/admin/reviews — pending queue + recent activity + counts
export async function GET(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const db = getSupabase();
    const [{ data: pending }, { data: recent }, { data: all }] = await Promise.all([
      db.from("reviews").select("*").eq("status", "pending").order("created_at", { ascending: true }).limit(200),
      db.from("reviews").select("*").neq("status", "pending").order("created_at", { ascending: false }).limit(50),
      db.from("reviews").select("status"),
    ]);
    const counts = { pending: 0, approved: 0, rejected: 0 };
    for (const row of (all ?? []) as { status: string }[]) {
      if (row.status in counts) counts[row.status as keyof typeof counts]++;
    }
    return NextResponse.json({
      pending: ((pending ?? []) as Record<string, unknown>[]).map(serialize),
      recent: ((recent ?? []) as Record<string, unknown>[]).map(serialize),
      counts,
    });
  } catch (err) {
    console.error("admin reviews GET failed:", err);
    return NextResponse.json({ error: "Could not load reviews" }, { status: 500 });
  }
}

// PATCH /api/admin/reviews — { id, action: "approve" | "reject" }
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
  if (!id || (action !== "approve" && action !== "reject")) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const status = action === "approve" ? "approved" : "rejected";
  try {
    const { error } = await getSupabase()
      .from("reviews")
      .update({ status, moderated_at: new Date().toISOString() })
      .eq("id", id)
      .in("status", ["pending"]);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin reviews PATCH failed:", err);
    return NextResponse.json({ error: "Could not update review" }, { status: 500 });
  }
}
