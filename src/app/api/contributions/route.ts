import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-server";

const MAX_MESSAGE_LEN = 1500;
const MAX_NAME_LEN = 80;
const MAX_EMAIL_LEN = 160;
const MAX_GRADE_LEN = 40;
const MAX_LINK_LEN = 300;
const HELP_WITH = new Set(["coding", "design", "outreach", "ambassadors", "research", "other"]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// POST /api/contributions — someone wants to help build Blueprint
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const grade = typeof body.grade === "string" ? body.grade.trim() : "";
  const helpWith = typeof body.helpWith === "string" ? body.helpWith.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const link = typeof body.link === "string" ? body.link.trim() : "";

  if (!name || name.length > MAX_NAME_LEN) {
    return NextResponse.json({ error: "Add your name" }, { status: 400 });
  }
  if (!email || email.length > MAX_EMAIL_LEN || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Add an email we can reach you at" }, { status: 400 });
  }
  if (grade.length > MAX_GRADE_LEN) {
    return NextResponse.json({ error: "Keep grade short" }, { status: 400 });
  }
  if (!HELP_WITH.has(helpWith)) {
    return NextResponse.json({ error: "Pick what you'd like to help with" }, { status: 400 });
  }
  if (message.length < 20 || message.length > MAX_MESSAGE_LEN) {
    return NextResponse.json({ error: "Tell us a little more about yourself" }, { status: 400 });
  }
  if (link.length > MAX_LINK_LEN) {
    return NextResponse.json({ error: "That link is too long" }, { status: 400 });
  }

  const anonId = request.headers.get("x-anon-id")?.trim() || null;

  try {
    const { error } = await getSupabase().from("contributions").insert({
      anon_id: anonId && anonId.length <= 128 ? anonId : null,
      name,
      email,
      grade: grade || null,
      help_with: helpWith,
      message,
      link: link || null,
      status: "new",
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contributions POST failed:", err);
    return NextResponse.json({ error: "Could not send your note" }, { status: 500 });
  }
}
