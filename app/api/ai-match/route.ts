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

export async function POST(req: NextRequest) {
  const { submission_id } = await req.json();
  if (!submission_id) return NextResponse.json({ error: "Mangler submission_id" }, { status: 400 });

  // Hent konsulentprofil + tilknyttet opgave
  const { data: sub, error: subError } = await supabase
    .from("consultant_submissions")
    .select("*, requests(description, competencies, duration, work_mode, start_date)")
    .eq("id", submission_id)
    .single();

  if (subError || !sub) {
    return NextResponse.json({ error: "Konsulentprofil ikke fundet" }, { status: 404 });
  }

  const req_data = sub.requests as {
    description: string;
    competencies: string[];
    duration: string;
    work_mode: string;
    start_date: string;
  } | null;

  const prompt = `Du er en erfaren IT-rekrutteringsekspert i Danmark. Analyser nedenstående konsulentprofil op mod opgavebeskrivelsen og giv en objektiv vurdering.

OPGAVE:
Beskrivelse: ${req_data?.description ?? "Ikke angivet"}
Søgte kompetencer: ${req_data?.competencies?.join(", ") ?? "Ikke angivet"}
Varighed: ${req_data?.duration ?? "Ikke angivet"}
Arbejdsform: ${req_data?.work_mode ?? "Ikke angivet"}
Opstart: ${req_data?.start_date ?? "Ikke angivet"}

KONSULENTPROFIL:
Navn: ${sub.name}
Titel: ${sub.title ?? "Ikke angivet"}
Kompetencer: ${sub.skills?.join(", ") ?? "Ikke angivet"}
Timepris: ${sub.rate ? `${sub.rate} DKK/t` : "Ikke angivet"}
Tilgængelighed: ${sub.availability ?? "Ikke angivet"}
Beskrivelse: ${sub.bio ?? "Ikke angivet"}

Svar KUN med et JSON-objekt i følgende format (ingen forklaring udenfor JSON):
{
  "rating": <heltal 1-10 hvor 1 = meget svagt match, 10 = perfekt match>,
  "summary": "<præcis og konkret vurdering på dansk, max 10 linjer, der forklarer styrker, svagheder og det samlede match>"
}`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    // Parse JSON fra svaret
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Ugyldigt JSON-svar fra AI");

    const result = JSON.parse(jsonMatch[0]) as { rating: number; summary: string };
    const rating = Math.min(10, Math.max(1, Math.round(result.rating)));
    const summary = result.summary;

    // Gem i DB
    await supabase
      .from("consultant_submissions")
      .update({ ai_rating: rating, ai_summary: summary })
      .eq("id", submission_id);

    return NextResponse.json({ rating, summary });
  } catch (err) {
    console.error("AI match fejl:", err);
    return NextResponse.json({ error: "AI-analyse mislykkedes" }, { status: 500 });
  }
}
