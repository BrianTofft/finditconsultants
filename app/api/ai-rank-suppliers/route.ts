import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

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

  const supplierList = suppliers
    .map(s => `ID: ${s.id}
Firma: ${s.company_name || s.email}
Type: ${s.company_type || "Ikke angivet"}
Kompetencer: ${(s.competencies as string[] | null)?.join(", ") || "Ikke angivet"}
Ekstra kompetencer: ${s.extra_competencies || "Ingen"}
Sprog: ${s.language || "Ikke angivet"}`)
    .join("\n---\n");

  const prompt = `Du er en erfaren IT-rekrutteringsekspert i Danmark. Du skal vurdere og rangere følgende leverandørvirksomheder op mod en given IT-konsulentopgave.

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

Vurder ALLE leverandører og giv hver en stjernebedømmelse fra 1–5 baseret på match med opgaven:
- 5 stjerner: Meget stærkt match, leverandøren dækker de fleste eller alle kompetencer
- 4 stjerner: Godt match, dækker hoveddelen af kompetencerne
- 3 stjerner: Rimeligt match, delvist overlap
- 2 stjerner: Svagt match, begrænset overlap
- 1 stjerne: Dårligt match, meget lidt eller intet overlap

Svar KUN med et JSON-array (ingen tekst udenfor JSON):
[
  { "supplier_id": "<ID>", "stars": <1-5>, "reason": "<kort begrundelse på dansk, max 15 ord>" },
  ...
]

Inkludér ALLE leverandører i svaret, sorteret fra højeste til laveste match.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("Ugyldigt JSON-svar fra AI");

    const rankings = JSON.parse(jsonMatch[0]) as SupplierRanking[];

    // Valider og clamp stjerner
    const validated = rankings
      .filter(r => r.supplier_id && r.stars)
      .map(r => ({ ...r, stars: Math.min(5, Math.max(1, Math.round(r.stars))) }));

    return NextResponse.json({ rankings: validated });
  } catch (err) {
    console.error("AI leverandør-ranking fejl:", err);
    return NextResponse.json({ error: "AI-analyse mislykkedes" }, { status: 500 });
  }
}
