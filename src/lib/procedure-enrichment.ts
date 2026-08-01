import type Database from "better-sqlite3";
import { serializeSteps } from "./steps";

type ProcedurePatch = {
  id: string;
  kind: "procedure";
  name?: string;
  details?: string;
  steps: string[];
  phone?: string;
  email?: string;
  url?: string;
  category_id?: string;
};

/**
 * Curated how-to entries — readable steps, not contact cards.
 * Applied on every DB open so existing installs get the guides.
 */
const PROCEDURES: ProcedurePatch[] = [
  {
    id: "svc-howto-moving-in",
    category_id: "cat-moving",
    kind: "procedure",
    name: "Moving in — first-week checklist",
    details:
      "What most Ericeira arrivals need in the first days: water/electricity, internet, energy deal, and address paperwork.",
    steps: [
      "Keys + contract: confirm meter readings (water, electricity, gas) on the handover day and keep photos.",
      "Utilities: open or transfer water / electricity / gas under your name — prefer a local accountant or DIY; avoid agents asking hundreds (or thousands) for routine openings.",
      "Internet / fibre: book installation early — waits of 1–3 weeks are common around Ericeira.",
      "Energy: compare tariffs (e.g. Manie.pt) once you have a first invoice.",
      "Car: update the registration address at IRN Mafra if you drive.",
      "Home base: book a cleaner for a deep clean if the place was vacant; check Heating / Trades contacts if something is broken.",
      "Ask the dads WhatsApp group for the current best utility / fibre contacts — recommendations change.",
    ],
  },
  {
    id: "svc-howto-utilities-open",
    category_id: "cat-moving",
    kind: "procedure",
    name: "Open utilities without overpaying",
    details:
      "A friend was quoted €2k by an agent to open utilities. An “Expat group” accountant may ask €400 for work a local does around €50.",
    steps: [
      "List what must be opened or transferred (water, electricity, gas, sometimes telecom).",
      "Ask the WhatsApp group for a recent local contact before hiring an expat agent.",
      "Prefer a local Portuguese accountant / gestor for routine openings.",
      "Get the fee in writing — if it’s hundreds for a simple transfer, walk away.",
      "Keep copies of contracts and the first invoices under your name.",
    ],
  },
  {
    id: "svc-howto-moving-out",
    category_id: "cat-moving",
    kind: "procedure",
    name: "Moving out — leave clean",
    details:
      "Close or transfer contracts, document the exit, and don’t leave meters / deposits to chance.",
    steps: [
      "Photo meter readings on the last day and share them with the landlord / agency.",
      "Schedule cancellation or name transfer for water, electricity, gas, and internet.",
      "Book a final clean (see Cleaning) if the contract expects it.",
      "Forward / update your address (car registration, bank, Finanças) before you leave.",
      "Return keys only after the exit checklist in your contract is done.",
    ],
  },
  {
    id: "svc-howto-admin",
    category_id: "cat-admin",
    kind: "procedure",
    name: "Getting admin help without overpaying",
    details:
      "Car import, bank accounts, utilities… Expats often get steered toward expensive agents. Prefer local Portuguese professionals — and ask the WhatsApp group for the current best option.",
    steps: [
      "Decide what you need (car import, NIF/bank, utilities, etc.).",
      "Ask the dads group for a recent recommendation before hiring an expat agent.",
      "Prefer a local Portuguese professional when the task is routine.",
      "Compare quotes — agent fees are often high for work a local can do cheaper.",
    ],
  },
  {
    id: "svc-irn-mafra",
    kind: "procedure",
    name: "Update your car registration address",
    details:
      "Change the address on your vehicle registration at IRN Mafra. Book ahead — walk-ins are unreliable.",
    steps: [
      "Gather your documents (ID, proof of address, vehicle papers).",
      "Book an appointment at IRN — Registo Predial e Comercial de Mafra.",
      "Attend the appointment and request the address update on the registration.",
      "Keep the updated proof for insurance and roadside checks.",
    ],
    url: "https://irn.justica.gov.pt/Contactos-do-Registo/-Registo-Predial-e-Comercial-de-Mafra",
  },
  {
    id: "svc-manie",
    kind: "procedure",
    name: "Switch to a cheaper energy provider",
    details:
      "Manie.pt makes comparing Portuguese energy tariffs simple — especially if you don’t want to decipher every invoice yourself.",
    steps: [
      "Have your latest electricity/gas invoice ready (PDF or photo).",
      "Go to Manie.pt and import / enter the invoice details.",
      "Compare the ranked cheaper options for your usage.",
      "Switch through the site if you find a better deal.",
    ],
    url: "https://www.manie.pt/",
  },
  {
    id: "svc-howto-construction",
    category_id: "cat-build",
    kind: "procedure",
    name: "Before hiring a contractor",
    details:
      "The playbook’s golden rules before any building or remodel job around Ericeira.",
    steps: [
      "Ask for a detailed quote with quantities and material references — not a vague lump sum.",
      "Check the company on Racius (how long they’ve operated, legitimacy signals).",
      "Use an architect’s trusted network when you can — warm intros beat cold quotes.",
      "Use a solid written contract.",
      "Get 3–4 offers before deciding.",
      "Never pay without a tax invoice (fatura).",
      "Release money per contract only when work actually starts on site.",
    ],
  },
  {
    id: "svc-racius",
    kind: "procedure",
    name: "Check a company on Racius",
    details:
      "Quick legitimacy check before you trust a contractor with a deposit.",
    steps: [
      "Open Racius and search the company name or NIF.",
      "Check how long they’ve been registered and whether filings look normal.",
      "Cross-check the name against the quote you received.",
      "If anything feels off, ask the group before paying.",
    ],
    url: "https://www.racius.com/",
  },
  {
    id: "svc-acp",
    kind: "procedure",
    name: "Import a car via ACP",
    details:
      "Often the cheapest route for car import paperwork — membership helps.",
    steps: [
      "Join ACP (Automóvel Club do Portugal) if you aren’t already a member.",
      "Ask ACP which import / registration path fits your vehicle.",
      "Prepare documents they request (title, invoices, ID).",
      "Follow their process rather than an expensive expat intermediary.",
    ],
  },
  {
    id: "svc-civil-mafra",
    kind: "procedure",
    name: "Register a newborn at IRN Mafra",
    details:
      "Practical tips from parents who’ve done civil registration in Mafra. Bring a Portuguese speaker if you can.",
    steps: [
      "Note: Chave Móvel Digital is only for Portuguese citizens for this process.",
      "At IRN Mafra, pick a priority ticket when available.",
      "Email completed forms to civil.mafra@irn.mj.pt.",
      "Expect ~2 weeks for an appointment after submitting forms.",
      "Choose the birth certificate format you need: Short, Full, or Multilingual.",
    ],
    email: "civil.mafra@irn.mj.pt",
  },
];

export function applyProcedureEnrichment(db: Database.Database) {
  const existing = db.prepare(`SELECT id FROM services WHERE id = ?`);
  const insert = db.prepare(
    `INSERT INTO services (
      id, category_id, name, details, address, phone, email, url,
      hours, rating, reviews_count, google_note, languages, kind, steps,
      votes, status, created_at, proposed_by
    ) VALUES (?, ?, ?, ?, '', ?, ?, ?, '', NULL, 0, '', '', 'procedure', ?, 0, 'approved', ?, '')`
  );
  const update = db.prepare(
    `UPDATE services
     SET kind = 'procedure',
         category_id = COALESCE(?, category_id),
         name = COALESCE(?, name),
         details = COALESCE(?, details),
         steps = ?,
         phone = CASE WHEN length(?) > 0 THEN ? ELSE phone END,
         email = CASE WHEN length(?) > 0 THEN ? ELSE email END,
         url = CASE WHEN length(?) > 0 THEN ? ELSE url END
     WHERE id = ?`
  );

  const now = new Date().toISOString();
  const tx = db.transaction(() => {
    for (const p of PROCEDURES) {
      const stepsJson = serializeSteps(p.steps);
      const row = existing.get(p.id);
      if (!row) {
        if (!p.category_id) continue;
        insert.run(
          p.id,
          p.category_id,
          p.name || p.id,
          p.details || "",
          p.phone || "",
          p.email || "",
          p.url || "",
          stepsJson,
          now
        );
        continue;
      }
      update.run(
        p.category_id ?? null,
        p.name ?? null,
        p.details ?? null,
        stepsJson,
        p.phone || "",
        p.phone || "",
        p.email || "",
        p.email || "",
        p.url || "",
        p.url || "",
        p.id
      );
    }
  });
  tx();
}
