"use client";
import { useState, useRef, useCallback } from "react";

type ImportMode = "kunder" | "leverandører";

interface ParsedRow {
  [key: string]: string;
}

interface MappedUser {
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  phone: string;
  company_type: string;
}

interface ImportResult {
  email: string;
  company_name: string;
  password: string;
  status: "ok" | "fejl";
  error?: string;
}

/* ── Hjælpefunktioner ── */

function generatePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let pwd = "FI-";
  for (let i = 0; i < 8; i++) {
    pwd += chars[Math.floor(Math.random() * chars.length)];
  }
  return pwd;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if ((ch === "," || ch === ";") && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ""));
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim().replace(/^"|"$/g, ""));
  return result;
}

function parseCSV(text: string): { headers: string[]; rows: ParsedRow[] } {
  const lines = text.trim().split(/\r?\n/);
  const headers = parseCSVLine(lines[0]);
  const rows = lines.slice(1).filter(l => l.trim()).map(l => {
    const values = parseCSVLine(l);
    const row: ParsedRow = {};
    headers.forEach((h, i) => { row[h] = values[i] ?? ""; });
    return row;
  });
  return { headers, rows };
}

function autoDetect(headers: string[]): Record<string, string> {
  const find = (...candidates: string[]) =>
    headers.find(h => candidates.some(c => h.toLowerCase().includes(c.toLowerCase()))) ?? "";
  return {
    email:        find("email", "e-mail", "mail"),
    first_name:   find("first name", "firstname", "first_name", "fornavn"),
    last_name:    find("last name", "lastname", "last_name", "efternavn", "surname"),
    company_name: find("company name", "company", "associated company", "virksomhed", "firma"),
    phone:        find("phone", "telefon", "mobil", "mobile", "tlf"),
    company_type: find("company type", "type", "virksomhedstype"),
  };
}

function buildUser(row: ParsedRow, map: Record<string, string>, defaultCompanyType: string): MappedUser {
  const g = (field: string) => (map[field] ? (row[map[field]] ?? "") : "").trim();
  return {
    email:        g("email"),
    first_name:   g("first_name"),
    last_name:    g("last_name"),
    company_name: g("company_name"),
    phone:        g("phone"),
    company_type: g("company_type") || defaultCompanyType,
  };
}

/* ── Komponent ── */

export default function ImportPage() {
  const [mode, setMode] = useState<ImportMode>("kunder");
  const [csvText, setCsvText] = useState<string>("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [colMap, setColMap] = useState<Record<string, string>>({});
  const [defaultCompanyType, setDefaultCompanyType] = useState("Konsulenthus");
  const [sendEmail, setSendEmail] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ImportResult[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const FIELDS: { key: string; label: string; required: boolean }[] = [
    { key: "email",        label: "Email",           required: true },
    { key: "first_name",   label: "Fornavn",         required: false },
    { key: "last_name",    label: "Efternavn",       required: false },
    { key: "company_name", label: "Virksomhedsnavn", required: false },
    { key: "phone",        label: "Telefon",         required: false },
    ...(mode === "leverandører" ? [{ key: "company_type", label: "Virksomhedstype", required: false }] : []),
  ];

  const loadCSV = (text: string) => {
    const { headers: h, rows: r } = parseCSV(text);
    setHeaders(h);
    setRows(r);
    setColMap(autoDetect(h));
    setResults([]);
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      setCsvText(text);
      loadCSV(text);
    };
    reader.readAsText(file, "UTF-8");
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith(".csv")) handleFile(file);
  }, []);

  const validRows = rows.filter(r => {
    const u = buildUser(r, colMap, defaultCompanyType);
    return u.email.includes("@");
  });

  const handleImport = async () => {
    setImporting(true);
    setProgress(0);
    const importResults: ImportResult[] = [];

    for (let i = 0; i < validRows.length; i++) {
      const u = buildUser(validRows[i], colMap, defaultCompanyType);
      const password = generatePassword();
      const contact_name = [u.first_name, u.last_name].filter(Boolean).join(" ") || u.company_name;

      try {
        const res = await fetch("/api/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: u.email,
            password,
            role: mode === "kunder" ? "customer" : "supplier",
            company_name: u.company_name,
            contact_name,
            phone: u.phone,
            first_name: u.first_name,
            last_name: u.last_name,
            company_type: mode === "leverandører" ? u.company_type : undefined,
          }),
        });

        const data = await res.json() as { userId?: string; error?: string };

        if (data.error || !res.ok) {
          importResults.push({ email: u.email, company_name: u.company_name, password, status: "fejl", error: data.error ?? "Ukendt fejl" });
        } else {
          // Send velkomstmail hvis toggle er slået til
          if (sendEmail) {
            const notifyRoute = mode === "kunder" ? "/api/notify-customer-approved" : "/api/notify-supplier-approved";
            await fetch(notifyRoute, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: u.email, password }),
            });
          }
          importResults.push({ email: u.email, company_name: u.company_name, password, status: "ok" });
        }
      } catch (err) {
        importResults.push({ email: u.email, company_name: u.company_name, password, status: "fejl", error: String(err) });
      }

      setProgress(i + 1);
    }

    setResults(importResults);
    setImporting(false);
  };

  const copyResults = () => {
    const lines = ["Email\tVirksomhed\tMidlertidigt password\tStatus",
      ...results.map(r => `${r.email}\t${r.company_name}\t${r.password}\t${r.status}`)
    ].join("\n");
    navigator.clipboard.writeText(lines);
  };

  const reset = () => {
    setCsvText(""); setHeaders([]); setRows([]); setColMap({}); setResults([]); setProgress(0);
  };

  const inp = "w-full rounded-xl border border-[#e8e5e0] bg-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-orange transition-all";
  const lbl = "block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5";

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-bold text-2xl text-charcoal mb-1">Import</h1>
        <p className="text-charcoal/45 text-sm">Importér kunder eller leverandører fra HubSpot CSV-eksport. Der sendes ingen velkomstmail medmindre du slår det til.</p>
      </div>

      {/* ── Mode-valg ── */}
      <div className="flex gap-2 mb-6">
        {(["kunder", "leverandører"] as ImportMode[]).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); reset(); }}
            className={`text-sm font-bold px-5 py-2 rounded-full border transition-all ${
              mode === m ? "bg-charcoal text-white border-charcoal" : "bg-white text-charcoal/50 border-[#e8e5e0] hover:border-charcoal/30"
            }`}
          >
            {m === "kunder" ? "👥 Kunder" : "🏢 Leverandører"}
          </button>
        ))}
      </div>

      {/* ── CSV-upload ── */}
      {rows.length === 0 && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all mb-6 ${
            dragging ? "border-orange bg-orange/5" : "border-[#e8e5e0] bg-white hover:border-orange/50 hover:bg-orange/3"
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          <div className="text-4xl mb-3">📂</div>
          <p className="font-bold text-charcoal mb-1">Træk CSV-fil hertil eller klik for at vælge</p>
          <p className="text-charcoal/40 text-sm">Understøtter HubSpot-eksport og generisk CSV · UTF-8 · komma eller semikolon separeret</p>
        </div>
      )}

      {/* ── Kolonne-tilknytning og preview ── */}
      {rows.length > 0 && results.length === 0 && (
        <div className="space-y-6">
          {/* Kolonne-mapping */}
          <div className="bg-white rounded-2xl border border-[#ede9e3] p-5">
            <h2 className="font-bold text-charcoal mb-1">Kolonne-tilknytning</h2>
            <p className="text-charcoal/40 text-xs mb-4">Auto-detekteret fra kolonnenavne. Justér hvis nødvendigt.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {FIELDS.map(f => (
                <div key={f.key}>
                  <label className={lbl}>
                    {f.label}{f.required && <span className="text-orange ml-1">*</span>}
                  </label>
                  <select
                    className={inp}
                    value={colMap[f.key] ?? ""}
                    onChange={e => setColMap(prev => ({ ...prev, [f.key]: e.target.value }))}
                  >
                    <option value="">— Vælg kolonne —</option>
                    {headers.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              ))}
              {mode === "leverandører" && (
                <div>
                  <label className={lbl}>Standard virksomhedstype</label>
                  <select className={inp} value={defaultCompanyType} onChange={e => setDefaultCompanyType(e.target.value)}>
                    <option>Konsulenthus</option>
                    <option>Formidler</option>
                    <option>Selvstændig</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-2xl border border-[#ede9e3] p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-charcoal">
                Preview <span className="text-charcoal/40 font-normal text-sm">— viser op til 5 rækker</span>
              </h2>
              <span className="text-xs font-bold text-charcoal/40 bg-[#f8f6f3] px-3 py-1 rounded-full">
                {validRows.length} gyldige rækker af {rows.length} total
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#ede9e3]">
                    {["Email", "Fornavn", "Efternavn", "Virksomhed", "Telefon"].map(h => (
                      <th key={h} className="text-left text-[10px] font-extrabold tracking-widest uppercase text-charcoal/35 pb-2 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {validRows.slice(0, 5).map((r, i) => {
                    const u = buildUser(r, colMap, defaultCompanyType);
                    return (
                      <tr key={i} className="border-b border-[#ede9e3]/50 last:border-0">
                        <td className="py-2 pr-4 text-orange font-semibold">{u.email || <span className="text-red-400">mangler</span>}</td>
                        <td className="py-2 pr-4 text-charcoal">{u.first_name || "—"}</td>
                        <td className="py-2 pr-4 text-charcoal">{u.last_name || "—"}</td>
                        <td className="py-2 pr-4 text-charcoal">{u.company_name || "—"}</td>
                        <td className="py-2 text-charcoal">{u.phone || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Indstillinger + knap */}
          <div className="bg-white rounded-2xl border border-[#ede9e3] p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setSendEmail(v => !v)}
                  className={`relative w-10 h-6 rounded-full transition-colors ${sendEmail ? "bg-orange" : "bg-charcoal/15"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${sendEmail ? "translate-x-5" : "translate-x-1"}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-charcoal">Send velkomstmail</p>
                  <p className="text-xs text-charcoal/40">{sendEmail ? "Brugerne modtager email med login-info" : "Ingen email sendes — du deler adgangskoder manuelt"}</p>
                </div>
              </label>

              <div className="flex gap-2">
                <button onClick={reset} className="text-sm font-bold text-charcoal/40 hover:text-charcoal px-4 py-2 rounded-full border border-[#e8e5e0] hover:border-charcoal/30 transition-all">
                  Nulstil
                </button>
                <button
                  onClick={handleImport}
                  disabled={importing || validRows.length === 0}
                  className="bg-orange text-white font-bold rounded-full px-6 py-2 text-sm hover:bg-orange/90 transition-all disabled:opacity-40 flex items-center gap-2"
                >
                  {importing
                    ? <><span className="animate-spin inline-block">⟳</span> {progress}/{validRows.length} oprettet…</>
                    : `Importér ${validRows.length} ${mode}`
                  }
                </button>
              </div>
            </div>

            {importing && (
              <div className="w-full bg-[#f8f6f3] rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 bg-orange rounded-full transition-all duration-300"
                  style={{ width: `${validRows.length > 0 ? (progress / validRows.length) * 100 : 0}%` }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Resultater ── */}
      {results.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#ede9e3] p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="font-bold text-charcoal mb-0.5">Import fuldført</h2>
              <p className="text-xs text-charcoal/45">
                <span className="text-green font-bold">{results.filter(r => r.status === "ok").length} oprettet</span>
                {results.filter(r => r.status === "fejl").length > 0 && (
                  <span className="text-red-500 font-bold ml-2">{results.filter(r => r.status === "fejl").length} fejlet</span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={copyResults} className="text-xs font-bold text-charcoal/50 hover:text-charcoal px-3 py-1.5 rounded-full border border-[#e8e5e0] hover:border-charcoal/30 transition-all">
                📋 Kopiér til udklipsholder
              </button>
              <button onClick={reset} className="text-xs font-bold bg-orange text-white px-4 py-1.5 rounded-full hover:bg-orange/90 transition-all">
                Ny import
              </button>
            </div>
          </div>

          {!sendEmail && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
              <p className="text-xs font-semibold text-amber-700">
                ⚠ Velkomstmail er ikke sendt. Nedenfor er de midlertidige adgangskoder — gem dem og del med brugerne manuelt.
              </p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#ede9e3]">
                  {["Status", "Email", "Virksomhed", "Midlertidigt password"].map(h => (
                    <th key={h} className="text-left text-[10px] font-extrabold tracking-widest uppercase text-charcoal/35 pb-2 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="border-b border-[#ede9e3]/50 last:border-0">
                    <td className="py-2 pr-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.status === "ok" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {r.status === "ok" ? "✓ OK" : "✗ Fejl"}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-charcoal font-semibold">{r.email}</td>
                    <td className="py-2 pr-4 text-charcoal/70">{r.company_name || "—"}</td>
                    <td className="py-2">
                      {r.status === "ok"
                        ? <code className="bg-[#f8f6f3] text-charcoal font-mono px-2 py-0.5 rounded text-[11px] select-all">{r.password}</code>
                        : <span className="text-red-500 text-[11px]">{r.error}</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
