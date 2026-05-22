import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

function isValidUserId(id: string): boolean {
  return /^[0-9a-f]{64}$/.test(id);
}

// Standard base64 (with optional padding) — also allow base64url variants
function isValidBase64(str: string): boolean {
  if (!str || str.length === 0) return false;
  return /^[A-Za-z0-9+/\-_]+=*$/.test(str);
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId || !isValidUserId(userId)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("journal_entries")
      .select("id, user_id, iv, salt, ciphertext, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[journal GET]", error.message);
      return NextResponse.json({ error: "Database error: " + error.message }, { status: 500 });
    }

    return NextResponse.json({ entries: data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Internal server error";
    console.error("[journal GET unexpected]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { userId, iv, salt, ciphertext } = body as Record<string, string>;

    if (!userId || !isValidUserId(userId)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }
    if (!iv || !isValidBase64(iv)) {
      return NextResponse.json({ error: "Invalid iv: " + iv?.slice(0, 20) }, { status: 400 });
    }
    if (!salt || !isValidBase64(salt)) {
      return NextResponse.json({ error: "Invalid salt: " + salt?.slice(0, 20) }, { status: 400 });
    }
    if (!ciphertext || !isValidBase64(ciphertext)) {
      return NextResponse.json({ error: "Invalid ciphertext" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("journal_entries")
      .insert({ user_id: userId, iv, salt, ciphertext })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("[journal POST]", error.message);
      return NextResponse.json({ error: "Database error: " + error.message }, { status: 500 });
    }

    return NextResponse.json(
      { id: data.id, created_at: data.created_at },
      { status: 201 }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Internal server error";
    console.error("[journal POST unexpected]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
