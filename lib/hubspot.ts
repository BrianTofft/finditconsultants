/**
 * HubSpot CRM integration — FindITconsultants
 *
 * Kræver env-variabel: HUBSPOT_ACCESS_TOKEN (Private App token)
 */

const BASE = "https://api.hubapi.com";

function headers() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
  };
}

export type HubspotContactInput = {
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  /** Intern HubSpot-værdi: "customer" | "other" */
  lifecyclestage?: string;
};

/**
 * Opretter eller opdaterer en kontakt i HubSpot via batch-upsert på email.
 * Bemærk: company-felt er IKKE sat her — virksomheden associeres separat
 * for at undgå HubSpots automatiske duplikat-oprettelse.
 * Returnerer HubSpot contact-ID eller null ved fejl.
 */
export async function upsertHubspotContact(
  contact: HubspotContactInput
): Promise<string | null> {
  console.log("[HubSpot] upsertContact:", contact.email);
  try {
    const res = await fetch(`${BASE}/crm/v3/objects/contacts/batch/upsert`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        inputs: [{
          idProperty: "email",
          id: contact.email,
          properties: {
            email: contact.email,
            firstname: contact.firstname ?? "",
            lastname: contact.lastname ?? "",
            phone: contact.phone ?? "",
            ...(contact.lifecyclestage ? { lifecyclestage: contact.lifecyclestage } : {}),
          },
        }],
      }),
    });

    const text = await res.text();
    if (!res.ok) {
      console.error("[HubSpot] upsertContact fejl HTTP", res.status, text);
      return null;
    }

    const id = JSON.parse(text).results?.[0]?.id ?? null;
    console.log("[HubSpot] upsertContact OK, id:", id);
    return id;
  } catch (err) {
    console.error("[HubSpot] upsertContact exception:", err);
    return null;
  }
}

/**
 * Finder eksisterende virksomhed på domæne eller navn, opretter ny hvis ikke fundet.
 * Søgerækkefølge: domæne → navn → opret (med domæne sat).
 * Returnerer HubSpot company-ID eller null ved fejl.
 */
export async function upsertHubspotCompany(
  companyName: string,
  domain?: string
): Promise<string | null> {
  if (!companyName?.trim()) return null;
  console.log("[HubSpot] upsertCompany:", companyName, domain ?? "");

  try {
    // 1. Søg på domæne
    if (domain) {
      const res = await fetch(`${BASE}/crm/v3/objects/companies/search`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          filterGroups: [{ filters: [{ propertyName: "domain", operator: "EQ", value: domain }] }],
          properties: ["name", "domain"],
          limit: 1,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.results?.length > 0) {
          console.log("[HubSpot] upsertCompany fundet via domæne:", data.results[0].id);
          return data.results[0].id;
        }
      }
    }

    // 2. Søg på navn
    const res2 = await fetch(`${BASE}/crm/v3/objects/companies/search`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        filterGroups: [{ filters: [{ propertyName: "name", operator: "EQ", value: companyName }] }],
        properties: ["name"],
        limit: 1,
      }),
    });
    if (res2.ok) {
      const data2 = await res2.json();
      if (data2.results?.length > 0) {
        console.log("[HubSpot] upsertCompany fundet via navn:", data2.results[0].id);
        return data2.results[0].id;
      }
    }

    // 3. Opret ny med navn + domæne
    const createRes = await fetch(`${BASE}/crm/v3/objects/companies`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        properties: { name: companyName, ...(domain ? { domain } : {}) },
      }),
    });
    const text = await createRes.text();
    if (!createRes.ok) {
      console.error("[HubSpot] upsertCompany fejl HTTP", createRes.status, text);
      return null;
    }
    const id = JSON.parse(text).id ?? null;
    console.log("[HubSpot] upsertCompany oprettet:", id);
    return id;
  } catch (err) {
    console.error("[HubSpot] upsertCompany exception:", err);
    return null;
  }
}

/**
 * Knytter en kontakt til en virksomhed i HubSpot.
 */
export async function associateContactToCompany(
  contactId: string,
  companyId: string
): Promise<void> {
  console.log("[HubSpot] associateContactToCompany:", contactId, "->", companyId);
  try {
    const res = await fetch(
      `${BASE}/crm/v4/objects/contacts/${contactId}/associations/default/companies/${companyId}`,
      { method: "PUT", headers: headers() }
    );
    if (!res.ok) {
      console.error("[HubSpot] associateContactToCompany fejl HTTP", res.status, await res.text());
    } else {
      console.log("[HubSpot] associateContactToCompany OK");
    }
  } catch (err) {
    console.error("[HubSpot] associateContactToCompany exception:", err);
  }
}

/**
 * Samlet hjælpefunktion: upsert virksomhed → upsert kontakt → tilknyt.
 * Virksomhed oprettes FØR kontakt for at forhindre HubSpots auto-association
 * i at oprette en duplikat-virksomhed fra email-domænet eller company-feltet.
 */
export async function syncUserToHubspot({
  email,
  firstname,
  lastname,
  phone,
  company_name,
  role,
}: {
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  company_name?: string;
  role: "customer" | "supplier";
}): Promise<void> {
  if (!process.env.HUBSPOT_ACCESS_TOKEN) {
    console.warn("[HubSpot] HUBSPOT_ACCESS_TOKEN ikke sat — springer over");
    return;
  }

  console.log("[HubSpot] syncUserToHubspot:", email, role);

  const emailDomain = email.split("@")[1]?.toLowerCase();
  const lifecyclestage = role === "customer" ? "customer" : "other";

  // 1. Opret/find virksomhed først — forhindrer duplikater fra HubSpot auto-association
  let companyId: string | null = null;
  if (company_name?.trim()) {
    companyId = await upsertHubspotCompany(company_name, emailDomain);
  }

  // 2. Opret/opdater kontakt — uden company-felt (styres via eksplicit association)
  const contactId = await upsertHubspotContact({
    email,
    firstname,
    lastname,
    phone,
    lifecyclestage,
  });

  // 3. Tilknyt kontakt til virksomhed
  if (contactId && companyId) {
    await associateContactToCompany(contactId, companyId);
  }
}
