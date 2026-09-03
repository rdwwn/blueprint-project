import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-server";

const MAX_DETAILS_LEN = 2000;

// POST /api/reports — submit a "flag incorrect info" report into the open queue
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const issueType = typeof body.issueType === "string" ? body.issueType.trim() : "";
  const details = typeof body.details === "string" ? body.details.trim() : "";
  const opportunitySlug = typeof body.opportunitySlug === "string" ? body.opportunitySlug.trim() : "";
  const opportunityName = typeof body.opportunityName === "string" ? body.opportunityName.trim() : "";

  if (!issueType || issueType.length > 80) {
    return NextResponse.json({ error: "Pick an issue type" }, { status: 400 });
  }
  if (!details || details.length < 10) {
    return NextResponse.json({ error: "Add a little more detail so we can fix it" }, { status: 400 });
  }
  if (details.length > MAX_DETAILS_LEN) {
    return NextResponse.json({ error: "Details are capped at 2000 characters" }, { status: 400 });
  }

  const anonId = request.headers.get("x-anon-id")?.trim() || null;

  try {
    const { error } = await getSupabase().from("reports").insert({
      anon_id: anonId && anonId.length <= 128 ? anonId : null,
      opportunity_slug: opportunitySlug.slice(0, 200) || null,
      opportunity_name: opportunityName.slice(0, 200) || null,
      issue_type: issueType,
      details,
      status: "open",
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("reports POST failed:", err);
    return NextResponse.json({ error: "Could not submit report" }, { status: 500 });
  }
}
