/**
 * HubSpot CRM integration — FindITconsultants
 *
 * Kræver env-variabel: HUBSPOT_ACCESS_TOKEN (Private App token)
 *
 * Bruges til at synce nye kunder og leverandører som kontakter + virksomheder.
 * Alle funktioner er ikke-blokerende: fejl logges men kaster ikke videre.
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
  company?: string;
  /** "Kunde" | "Leverandør" */
  jobtitle?: string;
  /** HubSpot lifecyclestage: "lead" | "customer" | "other" osv. */
  lifecyclestage?: string;
};

/**
 * Opretter eller opdaterer en kontakt i HubSpot via batch-upsert på email.
 * Returnerer HubSpot contact-ID eller null ved fejl.
 */
export async function upsertHubspotContact(
  contact: HubspotContactInput
): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}/crm/v3/objects/contacts/batch/upsert`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        inputs: [
          {
            idProperty: "email",
            id: contact.email,
            properties: {
              email: contact.email,
              firstname: contact.firstname ?? "",
              lastname: contact.lastname ?? "",
              phone: contact.phone ?? "",
              company: contact.company ?? "",
              jobtitle: contact.jobtitle ?? "",
              lifecyclestage: contact.lifecyclestage ?? "lead",
            },
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error("[HubSpot] upsertContact fejl:", await res.text());
      return null;
    }

    const data = await res.json();
    return data.results?.[0]?.id ?? null;
  } catch (err) {
    console.error("[HubSpot] upsertContact exception:", err);
    return null;
  }
}

/**
 * Finder eksisterende virksomhed på navn eller opretter ny.
 * Returnerer HubSpot company-ID eller null ved fejl.
 */
export async function upsertHubspotCompany(
  companyName: string
): Promise<string | null> {
  if (!companyName?.trim()) return null;

  try {
    // Søg på navn først
    const searchRes = await fetch(`${BASE}/crm/v3/objects/companies/search`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              { propertyName: "name", operator: "EQ", value: companyName },
            ],
          },
        ],
        properties: ["name"],
        limit: 1,
      }),
    });

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.results?.length > 0) {
        return searchData.results[0].id;
      }
    }

    // Ikke fundet — opret ny
    const createRes = await fetch(`${BASE}/crm/v3/objects/companies`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        properties: { name: companyName },
      }),
    });

    if (!createRes.ok) {
      console.error("[HubSpot] upsertCompany fejl:", await createRes.text());
      return null;
    }

    const data = await createRes.json();
    return data.id ?? null;
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
  try {
    const res = await fetch(
      `${BASE}/crm/v4/objects/contacts/${contactId}/associations/default/companies/${companyId}`,
      { method: "PUT", headers: headers() }
    );
    if (!res.ok) {
      console.error(
        "[HubSpot] associateContactToCompany fejl:",
        await res.text()
      );
    }
  } catch (err) {
    console.error("[HubSpot] associateContactToCompany exception:", err);
  }
}

/**
 * Samlet hjælpefunktion: upsert kontakt + virksomhed + tilknyt.
 * Kaldes fra API-routes efter brugeroprettelse.
 * Fejler aldrig (alt fanges internt).
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
  if (!process.env.HUBSPOT_ACCESS_TOKEN) return; // Ikke konfigureret — skip stille

  const jobtitle = role === "customer" ? "Kunde" : "Leverandør";
  const lifecyclestage = role === "customer" ? "customer" : "other";

  const contactId = await upsertHubspotContact({
    email,
    firstname,
    lastname,
    phone,
    company: company_name,
    jobtitle,
    lifecyclestage,
  });

  if (contactId && company_name?.trim()) {
    const companyId = await upsertHubspotCompany(company_name);
    if (companyId) {
      await associateContactToCompany(contactId, companyId);
    }
  }
}
