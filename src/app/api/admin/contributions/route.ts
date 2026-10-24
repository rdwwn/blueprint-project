import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-server";
import { isAdminRequest } from "@/lib/admin-auth";

function serialize(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    anonId: row.anon_id ? String(row.anon_id).slice(0, 8) + "…" : null,
    name: String(row.name),
    email: String(row.email),
    grade: row.grade ? String(row.grade) : null,
    helpWith: String(row.help_with),
    message: String(row.message),
    link: row.link ? String(row.link) : null,
    status: row.status as string,
    createdAt: String(row.created_at),
    handledAt: row.handled_at ? String(row.handled_at) : null,
  };
}

// GET /api/admin/contributions — new queue + recently handled
export async function GET(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const db = getSupabase();
    const [{ data: fresh }, { data: handled }, { data: all }] = await Promise.all([
      db.from("contributions").select("*").eq("status", "new").order("created_at", { ascending: false }).limit(200),
      db.from("contributions").select("*").eq("status", "handled").order("created_at", { ascending: false }).limit(50),
      db.from("contributions").select("status"),
    ]);
    const counts = { new: 0, handled: 0 };
    for (const row of (all ?? []) as { status: string }[]) {
      if (row.status in counts) counts[row.status as keyof typeof counts]++;
    }
    return NextResponse.json({
      fresh: ((fresh ?? []) as Record<string, unknown>[]).map(serialize),
      handled: ((handled ?? []) as Record<string, unknown>[]).map(serialize),
      counts,
    });
  } catch (err) {
    console.error("admin contributions GET failed:", err);
    return NextResponse.json({ error: "Could not load contributions" }, { status: 500 });
  }
}

// PATCH /api/admin/contributions — { id, action: "handle" | "reopen" }
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
  if (!id || (action !== "handle" && action !== "reopen")) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    const patch =
      action === "handle"
        ? { status: "handled", handled_at: new Date().toISOString() }
        : { status: "new", handled_at: null };
    const { error } = await getSupabase().from("contributions").update(patch).eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin contributions PATCH failed:", err);
    return NextResponse.json({ error: "Could not update contribution" }, { status: 500 });
  }
}
