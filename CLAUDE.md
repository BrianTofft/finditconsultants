# FindITconsultants — Projektdokumentation til Claude Code

## Hvad er projektet?
FindITconsultants (finditconsultants.com) er en dansk IT-konsulent multi-sourcing platform med tre portaler:
- **Kundeportal** — kunder indsender opgaver og ser konsulenter
- **Leverandørportal** — leverandører ser opgaver og indsender konsulentprofiler
- **Admin panel** — FindITconsultants.com Teamet godkender alt og styrer flowet

---

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL + Auth)
- **Email:** Resend (`noreply@finditconsultants.com`)
- **Styling:** Tailwind CSS
- **Hosting:** Vercel
- **Sprog:** Dansk i UI, TypeScript i kode

---

## Farver / Brand
```
orange:      #e8632a  (primær)
charcoal:    #2d2c2c  (tekst/mørk)
green:       #4a7c59  (accent)
baggrund:    #f8f6f3  (lys)
border:      #ede9e3
```
Tailwind config bruger `orange`, `charcoal`, `green` som custom farver.

---

## Database Schema (Supabase)

### `requests`
| Kolonne | Type | Beskrivelse |
|---|---|---|
| id | uuid PK | |
| created_at | timestamp | |
| email | text | Kundens email |
| description | text | Opgavebeskrivelse |
| competencies | text[] | Valgte kompetencer |
| status | text | 'Ny' / 'I gang' / 'Afsluttet' |
| duration | text | |
| work_mode | text | Remote/On-site/Hybrid |
| start_date | text | |
| admin_note | text | Admins note til leverandører |
| admin_status | text | 'pending' / 'accepted' / 'rejected' |

### `consultant_submissions`
| Kolonne | Type | Beskrivelse |
|---|---|---|
| id | uuid PK | |
| request_id | uuid FK → requests | |
| supplier_id | uuid FK → suppliers | |
| name | text | Konsulentnavn |
| title | text | |
| rate | int | DKK/time |
| skills | text[] | |
| bio | text | |
| availability | text | |
| cv_url | text | Supabase Storage URL |
| status | text | 'Indsendt' / 'Godkendt' / 'Afvist' |
| customer_decision | text | null / 'interview' / 'afvist' |
| interview_datetime | timestamp | |
| interview_confirmed | bool | Leverandør bekræfter |
| ai_rating | int | AI-vurdering 1-10 (nullable) |
| ai_summary | text | AI-begrundelse (nullable) |

### `suppliers`
| Kolonne | Type | |
|---|---|---|
| id | uuid PK (= auth.users id) | |
| email | text | |
| company_name | text | |
| contact_name | text | Sammensat af first_name + last_name |
| phone | text | |
| first_name | text | |
| last_name | text | |
| company_type | text | Konsulenthus / Formidler / Selvstændig |
| competencies | text[] | |
| extra_competencies | text | |
| language | text | |

### `customers`
| Kolonne | Type | |
|---|---|---|
| id | uuid PK (= auth.users id) | |
| email | text | |
| company_name | text | |
| contact_name | text | |
| phone | text | |

### `admins`
| Kolonne | Type | |
|---|---|---|
| id | uuid PK (= auth.users id) | |
| email | text | |
| first_name | text | |
| last_name | text | |
| phone | text | |

### `supplier_applications`
Ansøgninger fra nye leverandører (inden de er godkendt som brugere)
| Kolonne | Type | |
|---|---|---|
| id | uuid PK | |
| company_name, first_name, last_name, email, phone | text | |
| company_type | text | |
| competencies | text[] | |
| extra_competencies | text | |
| language | text | |
| status | text | 'Afventer' / 'Godkendt' / 'Afvist' |

### `contracts`
| Kolonne | Type | |
|---|---|---|
| id | uuid PK | |
| request_id | uuid FK | |
| supplier_id | uuid FK | |
| consultant_name | text | |
| rate | int | |
| duration | text | |
| start_date | date | |
| score | int | 1-5 |
| score_comment | text | |

### `request_suppliers`
Mange-til-mange: hvilke leverandører er notificeret om hvilke opgaver
| request_id | uuid FK |
| supplier_id | uuid FK |

### `chat_messages`
| Kolonne | Type | |
|---|---|---|
| id | uuid PK | |
| sender_type | text | 'customer' / 'supplier' / 'admin' |
| sender_id | uuid | Auth user id |
| sender_name | text | |
| content | text | |
| read_by_admin | bool | |
| read_by_user | bool | |
| request_id | uuid | (nullable) |

### `user_roles` (view)
Bruges af admin til at liste alle brugere med rolle, company_name, contact_name, phone, supplier_company.
Kombinerer data fra `customers`, `suppliers` og `admins` via UNION.

---

## Filstruktur (vigtigste filer)

```
app/
  page.tsx                              — Hjemmeside (hero, leadform, leverandør-ansøgning)
  data.ts                               — Kontaktinfo, kompetencer m.v.
  layout.tsx                            — Root layout med Nav + Footer
  sitemap.ts                            — SEO sitemap

  admin/
    layout.tsx                          — Auth-check + sidebar-navigation for alle /admin/* ruter
    page.tsx                            — Dashboard med stats og seneste aktivitet
    login/page.tsx                      — Admin login
    afventer/page.tsx                   — Forespørgsler der afventer godkendelse (admin_status: pending)
    forspørgsler/page.tsx               — Godkendte forespørgsler + leverandør-notifikation
    konsulenter/page.tsx                — Indsendte konsulentprofiler + AI-rating
    kontrakter/page.tsx                 — Kontrakter med score
    ansøgninger/page.tsx                — Leverandør-ansøgninger
    brugere/page.tsx                    — Brugeroversigt med inline profil-redigering
    beskeder/page.tsx                   — Chat med kunder og leverandører
    profil/page.tsx                     — Adminens egen profil + skift password
    types.ts                            — Delte TypeScript-typer til admin-sider

  portal/
    login/page.tsx                      — Kunde login
    page.tsx                            — Kundeportal med sidebar (forespørgsler, beskeder, profil)

  supplier/
    login/page.tsx                      — Leverandør login
    page.tsx                            — Leverandørportal med sidebar (forespørgsler, profiler, beskeder, profil)

  api/
    create-user/route.ts                — Opretter bruger i Supabase Auth + customers/suppliers tabel
    delete-user/route.ts                — Sletter bruger (service role)
    notify-suppliers/route.ts           — Email til leverandører om ny opgave
    notify-customer-approved/route.ts   — Email til ny kunde med midlertidigt password
    notify-supplier-approved/route.ts   — Email til ny leverandør med adgang
    notify-customer-candidate/route.ts  — Email til kunde om ny konsulentprofil klar
    notify-admin/route.ts               — Email til admin om ny forespørgsel/besked
    notify-admin-interview/route.ts     — Email til admin om interviewbekræftelse
    reset-password/route.ts             — Send password reset email
    contact/route.ts                    — Kontaktformular fra hjemmesiden
    supplier-application/route.ts       — Leverandør-ansøgning fra hjemmesiden
    ai-match/route.ts                   — AI-vurdering af konsulentprofil (GPT)

  konsulenter/                          — Statiske SEO-landingssider pr. kompetence
    ai/page.tsx
    azure/page.tsx
    cybersecurity/page.tsx
    ... (flere)

  reset-password/page.tsx               — Password-reset landingsside (fra email-link)

components/
  layout/
    Nav.tsx                             — Navigationsbar
    Footer.tsx                          — Footer med kontakt + links
  sections/
    Hero.tsx                            — Hero med animeret SVG-underline + live-notifikationer
    HowItWorks.tsx                      — Swimlane-diagram (Kunde / FindITconsultants / Leverandør)
    Services.tsx, WhyUs.tsx, FAQ.tsx, CTA.tsx, Partners.tsx, LogoBar.tsx, Testimonials.tsx, StatsCounter.tsx, LeadForm.tsx
  portal/
    PortalLayout.tsx                    — Delt layout-wrapper til kunde- og leverandørportal
    StatusBadge.tsx                     — Statusbadge-komponent til forespørgsler
  ui/
    Button.tsx, RevealOnScroll.tsx, SectionHeader.tsx
  chat/
    ChatWindow.tsx                      — Chat-komponent brugt i alle portaler
  ConsultantPage.tsx                    — Delt skabelon til SEO-konsulentsider
  ConsultantGraphic.tsx                 — Grafik til konsulentsider

lib/
  supabase.ts                           — Supabase client (anon key, browser-side)
  supabase-admin.ts                     — Supabase admin client (service role key, server-side)
```

---

## Portal-layout struktur

Alle tre portaler bruger et **sidebar-layout** med fast venstremenu og scrollbart indholdsområde.

### Fælles mønster
```tsx
<div className="flex h-screen bg-[#f8f6f3] overflow-hidden">
  <PortalSidebar ... />                   // Fast venstre sidebar (w-56, bg-[#2d2c2c])
  <main className="flex-1 ml-56 overflow-y-auto p-8">
    {/* Tab-indhold */}
  </main>
</div>
```

### Admin sidebar (`app/admin/layout.tsx`)
Håndterer auth-check og sidebar for alle `/admin/*` ruter. Sidebar-badges (antal afventende, ansøgninger, ulæste beskeder) opdateres ved hvert page-load.

| Tab | Ikon | Rute |
|---|---|---|
| Dashboard | 📊 | `/admin` |
| Afventer | 📥 | `/admin/afventer` |
| Forespørgsler | 📋 | `/admin/forspørgsler` |
| Konsulenter | 👤 | `/admin/konsulenter` |
| Kontrakter | 📝 | `/admin/kontrakter` |
| Ansøgninger | 🏢 | `/admin/ansøgninger` |
| Brugere | 👥 | `/admin/brugere` |
| Beskeder | 💬 | `/admin/beskeder` |
| Min profil | ⚙️ | `/admin/profil` |

### Kundeportal sidebar (`app/portal/page.tsx`)
Inline `PortalSidebar`-komponent defineret direkte i page.tsx.

| Tab | Ikon |
|---|---|
| Forespørgsler | 📋 |
| Beskeder | 💬 |
| Min profil | ⚙️ |

### Leverandørportal sidebar (`app/supplier/page.tsx`)
Inline `PortalSidebar`-komponent defineret direkte i page.tsx.

| Tab | Ikon |
|---|---|
| Forespørgsler | 📋 |
| Mine profiler | 👤 |
| Beskeder | 💬 |
| Min profil | ⚙️ |

**Logout** i alle portaler bruger `window.location.href = "https://finditconsultants.com"` (ikke `router.push`) for at sikre en ren session-reset.

---

## Godkendelsesflows

### Leverandør signup flow
1. Leverandør udfylder ansøgning på hjemmesiden (partners-sektion)
2. Gemmes i `supplier_applications` med status 'Afventer' via `/api/supplier-application`
3. Admin modtager email-notifikation via `/api/notify-admin`
4. Admin ser det i **"Ansøgninger"** tab → klikker Godkend
5. `handleApplication()` kalder `/api/create-user` → opretter Supabase Auth bruger + suppliers tabel
6. Sender velkomst email via `/api/notify-supplier-approved`

### Kunde forespørgsel flow
1. Kunde udfylder opgaveformular på hjemmesiden
2. Gemmes i `requests` med `admin_status: 'pending'`
3. Admin modtager email-notifikation via `/api/notify-admin`
4. Admin ser det i **"Afventer"** tab → Acceptér eller Afvis
5. `handleRequestDecision()`:
   - **Afvis:** Sætter `admin_status: 'rejected'`
   - **Acceptér ny kunde:** Opretter bruger via `/api/create-user` + sender email med midlertidigt password via `/api/notify-customer-approved`
   - **Acceptér eksisterende kunde:** Springer oprettelse over
   - Sætter `admin_status: 'accepted'` og `status: 'Ny'`
6. Opgaven vises nu i **"Forespørgsler"** tab og i kundens portal

### Konsulent matching flow
1. Admin videresender accepteret opgave til udvalgte leverandører via `/api/notify-suppliers`
2. Leverandør ser opgaven i sin portal → indsender konsulentprofil (inkl. CV-upload til Supabase Storage)
3. Admin godkender profilen (status: 'Godkendt') — evt. AI-rating køres via `/api/ai-match`
4. Kunde modtager email via `/api/notify-customer-candidate`
5. Kunde ser profilen i sin portal → vælger 'interview' eller 'afvist'
6. Leverandør bekræfter interviewtidspunkt i sin portal
7. Admin modtager email om bekræftelse via `/api/notify-admin-interview`
8. Admin opretter kontrakt

---

## Admin — brugerstyring (`/admin/brugere`)

Admin kan for alle brugere:
- **Se** firmanavn, kontaktperson, email, telefon direkte på brugerkortet
- **Rediger ✎** — udvider brugerkortet med inline redigeringsformular:
  - **Kunde:** Firmanavn, Kontaktperson, Telefon → gemmes i `customers`
  - **Leverandør:** Virksomhed, Fornavn, Efternavn, Telefon, Virksomhedstype → gemmes i `suppliers`
  - **Admin:** Fornavn, Efternavn, Telefon → gemmes i `admins`
  - Email kan aldrig ændres (read-only)
  - `company_name` er redigerbar — kun tilgængeligt i admin-portalen
- **Reset pw** — sender password-reset email via `/api/reset-password`
- **Slet** — sletter bruger via `/api/delete-user` (service role)
- **Opret bruger** — opretter ny bruger med rolle, firma og adgangskode

---

## API Routes — vigtige detaljer

### `/api/create-user`
```typescript
// Body:
{ email, password, role: "customer"|"supplier"|"admin", company_name, contact_name, phone }
// Opretter auth bruger + indsætter i customers eller suppliers tabel
// Returnerer: { userId } eller { error }
```

### `/api/notify-customer-approved`
```typescript
// Body: { email, password }
// Sender velkomst email med login-info til ny kunde
// Fra: FindITconsultants <noreply@finditconsultants.com>
```

### `/api/notify-suppliers`
```typescript
// Body: { request_id, supplier_ids: string[] }
// Sender email til hver leverandør om ny opgave
// Gemmer i request_suppliers tabel
```

### `/api/ai-match`
```typescript
// Body: { submission_id }
// Kører AI-vurdering af konsulentprofil mod opgavebeskrivelse
// Opdaterer ai_rating (1-10) og ai_summary i consultant_submissions
```

---

## Miljøvariabler (skal sættes i Vercel + lokalt .env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      ← bruges i server-side API routes
RESEND_API_KEY=
```

---

## Supabase Auth roller
Brugerroller styres IKKE via Supabase Auth roles, men via separate tabeller:
- Findes i `admins`, `customers`, eller `suppliers` tabel
- Login-sider tjekker hvilken tabel brugeren findes i og redirecter til korrekt portal
- `user_roles` view kombinerer alle tre tabeller og bruges af admin/brugere

---

## Kendte begrænsninger / næste skridt
- Chat er simpel (ikke real-time subscriptions — kræver manuel reload for nye beskeder)
- Ingen push-notifikationer til kunder/leverandører om nye chatbeskeder
- Konsulentsider (`/konsulenter/[slug]`) er statiske SEO-sider, ikke dynamisk fra DB
- Password-skift første gang er manuelt (ingen forced reset ved første login)
- `user_roles` view returnerer ikke `first_name`/`last_name` — disse ses kun i Rediger-panelet

---

## Git / Deployment
- Repo på GitHub, auto-deploy til Vercel på push til main
- Domæne: finditconsultants.com (DNS via Vercel)
