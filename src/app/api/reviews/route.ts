import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-server";

export type ApiReview = {
  id: string;
  opportunitySlug: string;
  opportunityName: string;
  author: string;
  grade: string | null;
  rating: number;
  text: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

const MAX_SLUG_LEN = 200;
const MAX_NAME_LEN = 200;
const MAX_AUTHOR_LEN = 60;
const MAX_GRADE_LEN = 20;

function readAnonId(request: Request): string | null {
  const id = request.headers.get("x-anon-id")?.trim();
  if (!id || id.length > 128) return null;
  return id;
}

function mapRow(row: Record<string, unknown>): ApiReview {
  return {
    id: String(row.id),
    opportunitySlug: String(row.opportunity_slug),
    opportunityName: String(row.opportunity_name),
    author: String(row.author),
    grade: row.grade ? String(row.grade) : null,
    rating: Number(row.rating),
    text: String(row.text),
    status: row.status as ApiReview["status"],
    createdAt: String(row.created_at),
  };
}

// GET /api/reviews
//  ?program=<slug>           -> approved reviews for one program (+ the caller's own pending)
//  (no query)                -> every approved review site-wide
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const program = url.searchParams.get("program")?.trim() || null;
    const anonId = readAnonId(request);
    const db = getSupabase();

    if (program) {
      const { data, error } = await db
        .from("reviews")
        .select("*")
        .eq("opportunity_slug", program)
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      const rows = (data ?? []) as Record<string, unknown>[];
      // Public: approved only. The author also sees their own rows so they know
      // their review is queued or what happened to it.
      const visible = rows.filter((r) => r.status === "approved" || (anonId && r.anon_id === anonId));
      const approved = visible.filter((r) => r.status === "approved");
      const average = approved.length
        ? approved.reduce((sum, r) => sum + Number(r.rating), 0) / approved.length
        : 0;
      return NextResponse.json({
        reviews: visible.map(mapRow),
        average: Math.round(average * 10) / 10,
        count: approved.length,
      });
    }

    const { data, error } = await db
      .from("reviews")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    return NextResponse.json({ reviews: ((data ?? []) as Record<string, unknown>[]).map(mapRow) });
  } catch (err) {
    console.error("reviews GET failed:", err);
    return NextResponse.json({ error: "Could not load reviews" }, { status: 500 });
  }
}

// POST /api/reviews — submit a review; it starts as "pending" until moderated
export async function POST(request: Request) {
  const anonId = readAnonId(request);
  if (!anonId) return NextResponse.json({ error: "Missing visitor id" }, { status: 400 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const opportunitySlug = typeof body.opportunitySlug === "string" ? body.opportunitySlug.trim() : "";
  const opportunityName = typeof body.opportunityName === "string" ? body.opportunityName.trim() : "";
  const author = typeof body.author === "string" ? body.author.trim() : "";
  const grade = typeof body.grade === "string" ? body.grade.trim() : "";
  const rating = Number(body.rating);
  const text = typeof body.text === "string" ? body.text.trim() : "";

  if (!opportunitySlug || opportunitySlug.length > MAX_SLUG_LEN) {
    return NextResponse.json({ error: "Invalid program" }, { status: 400 });
  }
  if (!opportunityName || opportunityName.length > MAX_NAME_LEN) {
    return NextResponse.json({ error: "Invalid program name" }, { status: 400 });
  }
  if (!author || author.length > MAX_AUTHOR_LEN) {
    return NextResponse.json({ error: "Please add a name or alias" }, { status: 400 });
  }
  if (grade.length > MAX_GRADE_LEN) {
    return NextResponse.json({ error: "Invalid grade" }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });
  }
  if (text.length < 20) {
    return NextResponse.json({ error: "Reviews need at least 20 characters" }, { status: 400 });
  }
  if (text.length > 800) {
    return NextResponse.json({ error: "Reviews are capped at 800 characters" }, { status: 400 });
  }

  try {
    const { data, error } = await getSupabase()
      .from("reviews")
      .insert({
        anon_id: anonId,
        opportunity_slug: opportunitySlug,
        opportunity_name: opportunityName,
        author,
        grade: grade || null,
        rating,
        text,
        status: "pending",
      })
      .select("*")
      .single();
    if (error) throw error;
    return NextResponse.json({ ok: true, review: data ? mapRow(data as Record<string, unknown>) : null });
  } catch (err) {
    console.error("reviews POST failed:", err);
    return NextResponse.json({ error: "Could not submit review" }, { status: 500 });
  }
}
