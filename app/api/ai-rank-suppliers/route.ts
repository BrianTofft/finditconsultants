import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60; // Giver Anthropic API mere tid (kræver Pro-plan på Vercel)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export type SupplierRanking = {
  supplier_id: string;
  stars: number; // 1–5
  reason: string;
};

export async function POST(req: NextRequest) {
  const { request_id } = await req.json();
  if (!request_id) return NextResponse.json({ error: "Mangler request_id" }, { status: 400 });

  // Hent opgaven
  const { data: request } = await supabase
    .from("requests")
    .select("description, competencies, duration, work_mode, start_date, max_rate, admin_note, language, nearshore")
    .eq("id", request_id)
    .single();

  if (!request) return NextResponse.json({ error: "Opgave ikke fundet" }, { status: 404 });

  // Hent alle leverandører med kompetencer
  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("id, company_name, email, competencies, extra_competencies, company_type, language");

  if (!suppliers || suppliers.length === 0) {
    return NextResponse.json({ error: "Ingen leverandører fundet" }, { status: 404 });
  }

  // Brug simple numre i stedet for UUIDs — AI reproducerer ikke UUIDs pålideligt
  const supplierList = suppliers
    .map((s, idx) => `NR: ${idx}
Firma: ${s.company_name || s.email}
Type: ${s.company_type || "Ikke angivet"}
Kompetencer: ${(s.competencies as string[] | null)?.join(", ") || "Ikke angivet"}
Ekstra kompetencer: ${s.extra_competencies || "Ingen"}
Sprog: ${s.language || "Ikke angivet"}`)
    .join("\n---\n");

  const prompt = `Du er en erfaren IT-rekrutteringsekspert i Danmark. Vurder og rangér følgende leverandørvirksomheder op mod en IT-konsulentopgave.

OPGAVE:
Beskrivelse: ${request.description || "Ikke angivet"}
Søgte kompetencer: ${(request.competencies as string[] | null)?.join(", ") || "Ikke angivet"}
Varighed: ${request.duration || "Ikke angivet"}
Arbejdsform: ${request.work_mode || "Ikke angivet"}
Opstart: ${request.start_date || "Ikke angivet"}
Maks. timepris: ${request.max_rate ? `${request.max_rate} DKK/t` : "Ikke angivet"}
Sprog: ${request.language || "Ikke angivet"}
Nearshore/Offshore: ${request.nearshore || "Ikke angivet"}
Note fra admin: ${request.admin_note || "Ingen"}

LEVERANDØRER:
${supplierList}

Giv ALLE leverandører en stjernebedømmelse fra 1–5:
5 = Meget stærkt match | 4 = Godt match | 3 = Rimeligt | 2 = Svagt | 1 = Dårligt

Svar KUN med JSON-array, ingen tekst udenfor:
[{"nr":<NR>,"stars":<1-5>,"reason":"<dansk begrundelse max 12 ord>"},...]

Inkludér ALLE leverandører, sorteret fra højeste til laveste match.`;

  // Tjek at API-nøgle er sat
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY mangler i miljøvariabler");
    return NextResponse.json({ error: "ANTHROPIC_API_KEY er ikke konfigureret i Vercel" }, { status: 500 });
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("Ugyldigt JSON-svar fra AI");

    const raw = JSON.parse(jsonMatch[0]) as Array<{ nr: number; stars: number; reason: string }>;

    // Map nr → rigtig supplier_id
    const rankings: SupplierRanking[] = raw
      .filter(r => typeof r.nr === "number" && suppliers[r.nr])
      .map(r => ({
        supplier_id: suppliers[r.nr].id,
        stars: Math.min(5, Math.max(1, Math.round(r.stars))),
        reason: r.reason,
      }));

    return NextResponse.json({ rankings });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("AI leverandør-ranking fejl:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
