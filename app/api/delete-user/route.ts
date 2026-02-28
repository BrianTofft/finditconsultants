import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Mangler id" }, { status: 400 });

  // Cascade-slet leverandørens relaterede data (FK-rækkefølge)
  await supabase.from("contracts").delete().eq("supplier_id", id);
  await supabase.from("consultant_submissions").delete().eq("supplier_id", id);
  await supabase.from("request_suppliers").delete().eq("supplier_id", id);
  await supabase.from("chat_messages").delete().eq("sender_id", id);

  // Slet fra alle profiltabeller (kun én vil matche — fejles lydløst hvis ikke fundet)
  await supabase.from("customers").delete().eq("id", id);
  await supabase.from("suppliers").delete().eq("id", id);
  await supabase.from("admins").delete().eq("id", id);

  // Slet selve auth-brugeren
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}