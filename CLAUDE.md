# FindITconsultants — Projektdokumentation til Claude Code

## Hvad er projektet?
FindITconsultants (finditconsultants.com) er en dansk IT-konsulent multi-sourcing platform med tre portaler:
- **Kundportal** — kunder indsender opgaver og ser konsulenter
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
| **admin_status** | text | **'pending' / 'accepted' / 'rejected'** — NY KOLONNE |

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

### `suppliers`
| Kolonne | Type | |
|---|---|---|
| id | uuid PK (= auth.users id) | |
| email | text | |
| company_name | text | |
| contact_name | text | |
| phone | text | |
| first_name | text | |
| last_name | text | |
| company_type | text | |
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
| request_id | uuid | (nullable, til fremtidig brug) |

### `user_roles` (view eller tabel)
Bruges af admin til at liste alle brugere med rolle, company_name, contact_name, phone.

---

## Filstruktur (vigtigste filer)

```
app/
  page.tsx                          — Hjemmeside med hero, form, leverandør-ansøgning
  admin/
    page.tsx                        — Admin panel (alle tabs)
    login/page.tsx                  — Admin login
  portal/
    login/page.tsx                  — Kunde login
    page.tsx                        — Kunde portal (mine opgaver, konsulenter, chat)
  supplier/
    login/page.tsx                  — Leverandør login
    portal/page.tsx                 — Leverandør portal (opgaver, indsend profil, chat)
  api/
    create-user/route.ts            — Opretter bruger i Supabase Auth + customers/suppliers tabel
    delete-user/route.ts            — Sletter bruger
    notify-suppliers/route.ts       — Email til leverandører om ny opgave
    notify-customer-approved/route.ts — Email til ny kunde med midlertidigt password
    notify-supplier-approved/route.ts — Email til ny leverandør med adgang
    reset-password/route.ts         — Send password reset email
lib/
  supabase.ts                       — Supabase client (anon key)
  supabase-admin.ts                 — Supabase admin client (service role key)
```

---

## Godkendelsesflows

### Leverandør signup flow
1. Leverandør udfylder ansøgning på hjemmesiden (partners-sektion)
2. Gemmes i `supplier_applications` med status 'Afventer'
3. Admin ser det i "Ansøgninger" tab → klikker Godkend
4. `handleApplication()` kalder `/api/create-user` → opretter Supabase Auth bruger + suppliers tabel
5. Sender velkomst email via `/api/notify-supplier-approved`

### Kunde forespørgsel flow (NYT)
1. Kunde udfylder opgaveformular på hjemmesiden
2. Gemmes i `requests` med `admin_status: 'pending'`
3. Admin ser det i **"Afventer"** tab → Acceptér eller Afvis
4. `handleRequestDecision()`:
   - **Afvis:** Sætter `admin_status: 'rejected'`
   - **Acceptér ny kunde:** Opretter bruger + sender email med midlertidigt password
   - **Acceptér eksisterende kunde:** Springer oprettelse over
   - Sætter `admin_status: 'accepted'` og `status: 'Ny'`
5. Opgaven vises nu i "Forespørgsler" tab og i kundens portal

### Konsulent matching flow
1. Admin videresender accepteret opgave til udvalgte leverandører (notify-suppliers)
2. Leverandør ser opgaven i sin portal → indsender konsulentprofil
3. Admin godkender profilen
4. Kunde ser profilen → vælger 'interview' eller 'afvist'
5. Leverandør bekræfter interviewtidspunkt i sin portal
6. Admin opretter kontrakt

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
// Fra: FindIT <noreply@finditconsultants.com>
```

### `/api/notify-suppliers`
```typescript
// Body: { request_id, supplier_ids: string[] }
// Sender email til hver leverandør om ny opgave
// Gemmer i request_suppliers tabel
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

## Admin panel — Sidebar + Dashboard struktur
Layout: `app/admin/layout.tsx` håndterer auth-check og sidebar-navigation for alle `/admin/*` ruter.

| Rute | Fil | Beskrivelse |
|---|---|---|
| `/admin` | `page.tsx` | Dashboard med stats og seneste aktivitet |
| `/admin/afventer` | `afventer/page.tsx` | Forespørgsler der afventer godkendelse |
| `/admin/forspørgsler` | `forspørgsler/page.tsx` | Godkendte forespørgsler + leverandør-notifikation |
| `/admin/konsulenter` | `konsulenter/page.tsx` | Indsendte konsulentprofiler |
| `/admin/kontrakter` | `kontrakter/page.tsx` | Kontrakter med score |
| `/admin/ansøgninger` | `ansøgninger/page.tsx` | Leverandør-ansøgninger |
| `/admin/brugere` | `brugere/page.tsx` | Brugere med opret/slet/reset |
| `/admin/beskeder` | `beskeder/page.tsx` | Chat med kunder og leverandører |

Delte typer: `app/admin/types.ts`
Sidebar-badges (pending, ansøgninger, ulæste) hentes i layout ved page-load.

---

## Kendte begrænsninger / næste skridt
- `customers` tabel tjekkes med `.single()` i `handleRequestDecision` — hvis kunden ikke eksisterer får vi en fejl (forventet adfærd, men bør måske håndteres med try/catch)
- Chat er simpel (ikke real-time subscriptions endnu — kræver reload)
- Ingen notifikationer til kunder/leverandører om nye chatbeskeder
- Konsulentsider (`/konsulenter/[slug]`) er statiske SEO-sider, ikke dynamisk fra DB
- Password-skift første gang er manuelt (ingen forced reset)

---

## Supabase Auth roller
Brugerroller styres IKKE via Supabase Auth roles, men via separate tabeller:
- Findes i `admins`, `customers`, eller `suppliers` tabel
- Login-sider tjekker hvilken tabel brugeren findes i og redirecter

---

## Git / Deployment
- Repo på GitHub, auto-deploy til Vercel på push til main
- Domæne: finditconsultants.com (DNS via Vercel)
