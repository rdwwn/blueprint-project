import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-server";

const MAX_SLUG_LEN = 200;

function readAnonId(request: Request): string | null {
  const id = request.headers.get("x-anon-id")?.trim();
  if (!id || id.length > 128) return null;
  return id;
}

async function readSlug(request: Request): Promise<{ slug: string } | null> {
  try {
    const body = (await request.json()) as { slug?: unknown };
    if (typeof body.slug !== "string") return null;
    const slug = body.slug.trim();
    if (!slug || slug.length > MAX_SLUG_LEN) return null;
    return { slug };
  } catch {
    return null;
  }
}

// GET /api/saves — list this visitor's saved slugs
export async function GET(request: Request) {
  const anonId = readAnonId(request);
  if (!anonId) return NextResponse.json({ error: "Missing visitor id" }, { status: 400 });
  try {
    const { data, error } = await getSupabase()
      .from("saves")
      .select("opportunity_slug")
      .eq("anon_id", anonId);
    if (error) throw error;
    const slugs = (data ?? []).map((row: { opportunity_slug: string }) => row.opportunity_slug);
    return NextResponse.json({ slugs });
  } catch (err) {
    console.error("saves GET failed:", err);
    return NextResponse.json({ error: "Could not load saves" }, { status: 500 });
  }
}

// POST /api/saves — save a program (idempotent)
export async function POST(request: Request) {
  const anonId = readAnonId(request);
  const parsed = await readSlug(request);
  if (!anonId || !parsed) return NextResponse.json({ error: "Missing visitor id or slug" }, { status: 400 });
  try {
    const { error } = await getSupabase()
      .from("saves")
      .upsert(
        { anon_id: anonId, opportunity_slug: parsed.slug },
        { onConflict: "anon_id,opportunity_slug", ignoreDuplicates: true },
      );
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("saves POST failed:", err);
    return NextResponse.json({ error: "Could not save program" }, { status: 500 });
  }
}

// DELETE /api/saves — remove a saved program
export async function DELETE(request: Request) {
  const anonId = readAnonId(request);
  const parsed = await readSlug(request);
  if (!anonId || !parsed) return NextResponse.json({ error: "Missing visitor id or slug" }, { status: 400 });
  try {
    const { error } = await getSupabase()
      .from("saves")
      .delete()
      .eq("anon_id", anonId)
      .eq("opportunity_slug", parsed.slug);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("saves DELETE failed:", err);
    return NextResponse.json({ error: "Could not remove program" }, { status: 500 });
  }
}
