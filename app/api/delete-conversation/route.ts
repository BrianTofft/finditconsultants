import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "Mangler userId" }, { status: 400 });

  // Slet alle beskeder i samtalen — begge retninger:
  // 1) Brugerens egne beskeder  (sender_id = userId)
  // 2) Admins svar til brugeren (recipient_id = userId)
  const { error } = await supabase
    .from("chat_messages")
    .delete()
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
