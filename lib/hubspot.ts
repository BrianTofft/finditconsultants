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
  company?: string;
};

/**
 * Opretter eller opdaterer en kontakt i HubSpot via batch-upsert på email.
 * Returnerer HubSpot contact-ID eller null ved fejl.
 */
export async function upsertHubspotContact(
  contact: HubspotContactInput
): Promise<string | null> {
  console.log("[HubSpot] upsertContact start:", contact.email);
  try {
    const body = {
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
          },
        },
      ],
    };

    const res = await fetch(`${BASE}/crm/v3/objects/contacts/batch/upsert`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    });

    const text = await res.text();
    if (!res.ok) {
      console.error("[HubSpot] upsertContact fejl HTTP", res.status, text);
      return null;
    }

    const data = JSON.parse(text);
    const id = data.results?.[0]?.id ?? null;
    console.log("[HubSpot] upsertContact OK, id:", id);
    return id;
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
  console.log("[HubSpot] upsertCompany:", companyName);

  try {
    // Søg på navn først
    const searchRes = await fetch(`${BASE}/crm/v3/objects/companies/search`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        filterGroups: [
          { filters: [{ propertyName: "name", operator: "EQ", value: companyName }] },
        ],
        properties: ["name"],
        limit: 1,
      }),
    });

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.results?.length > 0) {
        console.log("[HubSpot] upsertCompany fundet eksisterende:", searchData.results[0].id);
        return searchData.results[0].id;
      }
    }

    // Ikke fundet — opret ny
    const createRes = await fetch(`${BASE}/crm/v3/objects/companies`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ properties: { name: companyName } }),
    });

    const text = await createRes.text();
    if (!createRes.ok) {
      console.error("[HubSpot] upsertCompany fejl HTTP", createRes.status, text);
      return null;
    }

    const data = JSON.parse(text);
    console.log("[HubSpot] upsertCompany oprettet:", data.id);
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
 * Samlet hjælpefunktion: upsert kontakt + virksomhed + tilknyt.
 * Kaldes fra API-routes efter brugeroprettelse og ved profil-opdatering.
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

  const contactId = await upsertHubspotContact({
    email,
    firstname,
    lastname,
    phone,
    company: company_name,
  });

  if (contactId && company_name?.trim()) {
    const companyId = await upsertHubspotCompany(company_name);
    if (companyId) {
      await associateContactToCompany(contactId, companyId);
    }
  }
}
