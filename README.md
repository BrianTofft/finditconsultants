# FindITconsultants.com — Next.js

## Kom i gang

```bash
npm install
npm run dev
```
Åbn http://localhost:3000

## Deploy til Vercel

1. Push til GitHub
2. Gå til vercel.com → "Add New Project"
3. Import dit GitHub repo → Deploy

Vercel detekterer Next.js automatisk. Ingen konfiguration nødvendig.

## Skift DNS fra WordPress

Tilføj domæne i Vercel: Settings → Domains → finditconsultants.com

Opdater DNS hos dit domæneregister:
```
A     @    76.76.21.21
CNAME www  cname.vercel-dns.com
```

## Struktur

- `app/data.ts` — al tekst, statistikker, testimonials (rediger her)
- `components/sections/` — Hero, LeadForm, LogoBar, HowItWorks, WhyUs, Services, Testimonials, Partners, CTA
- `components/layout/` — Nav, Footer
- `components/ui/` — Button, SectionHeader, RevealOnScroll

## Tilpasning

**Tekst og indhold:** Rediger `app/data.ts`

**Farver:** `tailwind.config.ts` → orange: #e28100, charcoal: #2d2c2c, green: #018c00

**Logo API:** Registrer gratis på logo.dev og udskift token i `components/sections/LogoBar.tsx`
