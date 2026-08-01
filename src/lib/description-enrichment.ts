/**
 * Short public descriptions for every contact card.
 * Applied on DB open — fills empty details, and overwrites curated IDs.
 */
import type Database from "better-sqlite3";

/** Force-set (even if details already exist). */
export const DESCRIPTION_BY_ID: Record<string, string> = {
  // Moving
  "svc-andre-mudancas":
    "Mover / transport — Ericeira & Mafra area (Google: ASTransportes, Santo Isidoro).",

  // Split former “58 / Boardriders”
  "svc-boardriders":
    "Surf shop + café (Quiksilver Boardriders) — coffee, Wi-Fi, plant milks. Av. São Sebastião 36A.",
  "svc-58-surf":
    "Flagship surf shop (58 Surf / Billabong) — retail store, not a café. Av. São Sebastião 36B.",

  // Cowork & cafés
  "svc-selina": "Hostel / hotel with terrace — easy spot to work from in the centre.",
  "svc-brunch": "Brunch café — popular, can get busy.",
  "svc-balagan": "Beach café / deli at Praia do Sul — Middle Eastern plates, often crowded.",
  "svc-barbatana": "Beach café at Foz do Lizandro — work-friendly off-peak.",
  "svc-vilagale": "Hotel lobby / café — quiet place to work (not a cowork).",
  "svc-organic": "Healthy café near the market — good for a laptop session.",
  "svc-intermarche": "Supermarket — quiet seats upstairs on the 1st floor; opens early.",
  "svc-the-base": "Dedicated cowork space in Ericeira.",
  "svc-coastal": "Open-plan cowork with terrace — members 24/7.",
  "svc-salt": "Creative cowork & event space by the sea — boards, meeting rooms.",

  // Food
  "svc-mean-sardine": "Craft brewery (production) — beers also poured at 58 / Maika'i nearby.",
  "svc-5emeio": "Craft beer & burger taproom in the village centre.",
  "svc-lagoa": "Restaurant — playbook favourite.",
  "svc-costa-fria": "Restaurant — coastal dining.",
  "svc-estrela": "Restaurant — seafood / local classic.",
  "svc-furnas": "Seafood restaurant (marisqueira) by the Furnas rocks.",
  "svc-golfinho": "Seafood restaurant above São Lourenço beach.",
  "svc-onegai": "Sushi restaurant — book ahead.",
  "svc-ribas": "Restaurant — seafood / local favourite.",
  "svc-cucina": "Italian restaurant.",
  "svc-kau": "Barbecue / ribs — grilled meat specialist.",
  "svc-telmo-wine": "Wine shop (garrafeira) — natural & low-intervention wines; tastings.",
  "svc-terco": "Bakery / bread.",
  "svc-placido": "Butcher — WhatsApp orders.",
  "svc-mario-joao": "Butcher in Mafra.",
  "svc-worldprime": "Butcher / premium beef.",
  "svc-carnederva": "Butcher.",
  "svc-tomo": "Butcher — Argentine beef specialist.",
  "svc-talho-central": "Butcher by the municipal market.",

  // Cars
  "svc-rui-tyre": "Tyre specialist.",
  "svc-garage-isidoro": "Car garage — Santo Isidoro.",
  "svc-rui-fortunato": "Mechanic — Pinhal dos Frades.",
  "svc-topcar": "Car dealer / workshop — Mafra.",
  "svc-auto-miramar": "Car garage — English spoken.",
  "svc-transfonseca": "Car transport / services — Mafra.",
  "svc-ouriceira": "Car garage — Ericeira.",
  "svc-rpm": "Used-car warranty service.",
  "svc-sell-car": "Sells your car for a fixed fee.",
  "svc-acp": "Car import paperwork via ACP membership.",

  // Build
  "svc-mudelar": "Kitchen & bathroom remodels.",
  "svc-sergio-rodrigues": "Handyman.",
  "svc-victor-tereso": "General contractor.",
  "svc-antoine-begoc": "Handyman — French / English, very professional.",
  "svc-handyman-351": "Handyman.",
  "svc-pedro-struct": "Structural engineer — English spoken.",
  "svc-ricardo-lima": "Builder / building works.",
  "svc-cholo": "Builder.",
  "svc-nilton": "General contractor — Ericeira.",
  "svc-joe-carreira": "Builder — wood framing specialist.",
  "svc-archstudio": "Architecture studio.",
  "svc-nocnoc": "Architecture / design studio.",
  "svc-nuno-nasc": "Architect — Caxias.",
  "svc-tiago-barros": "Architecture studio — Ericeira / Mafra.",
  "svc-luran": "Civil engineering — Malveira.",
  "svc-engi": "Home / property inspection.",
  "svc-tj": "Property inspections — group-tested.",
  "svc-homly": "Home inspection.",
  "svc-miguel-insp": "Home inspector.",

  // Trades
  "svc-bogdan": "Electrician — English spoken, often recommended.",
  "svc-miguel-elec": "Electrician.",
  "svc-laszlo": "Electrician — Hungarian / English.",
  "svc-joao-elec": "Electrician / electronics.",
  "svc-sergio-ricardo": "Electrician.",
  "svc-paulo-lopes": "Painter.",
  "svc-luis-ruca": "Painter — Portuguese only.",
  "svc-sergio-paint": "Painter.",
  "svc-goncalo": "Plumber / heating.",
  "svc-fernando-plumb": "Plumber.",
  "svc-miha": "Plumber — English spoken.",
  "svc-nuno-canal": "Plumber (canalizador).",
  "svc-miguel-plumb": "Plumber.",
  "svc-les-plumb": "Plumber — English speaking.",
  "svc-wilson": "Metalwork / welding.",
  "svc-labart": "Metal / fabrication workshop.",
  "svc-yann-clm": "Metalwork — French speaker.",
  "svc-antonio-domingues": "Appliance repair — dishwashers & washing machines.",

  // Openings
  "svc-sebastec": "Automatic gates & doors.",
  "svc-bernardo-assis": "Metalwork — glass & gates (portões).",
  "svc-wilson-gate": "Gates / automation — Leiria.",
  "svc-aluterm": "Aluminium / frames.",
  "svc-jorge-antunes": "Windows, frames & automation.",
  "svc-silverio": "Garage doors.",
  "svc-julio": "Rolling shutters.",
  "svc-fernando-martins": "Windows & doors store.",
  "svc-carmezim": "Windows & doors.",
  "svc-windoor": "PVC windows & doors.",
  "svc-supercaleiras": "Gutters.",
  "svc-isolaterm": "Insulation / frames.",

  // Wood
  "svc-jonas-bartel": "Deck builder.",
  "svc-woodcraft": "Deck / woodwork — Roberto Palves.",
  "svc-brian": "Deck / woodwork.",
  "svc-brian-carp": "Carpenter — recommended by Hamish.",
  "svc-balbino": "Timber yard.",
  "svc-comapla": "Timber yard.",
  "svc-ido": "Timber yard.",
  "svc-mdo": "Timber yard.",
  "svc-somassul": "Timber yard.",
  "svc-multiplacas": "Timber / panels yard.",
  "svc-ascenso": "Timber yard — Achada.",
  "svc-edson": "Custom furniture / spray artist.",
  "svc-lourosmad": "Wood delivery — Torres Vedras industrial zone.",
  "svc-jotalves": "Carpentry & furniture — Encarnação.",
  "svc-sobreira": "Wood / carpentry supplier — Rio de Mouro.",
  "svc-quirumed": "SPA / wellness furniture.",

  // Garden
  "svc-terrum": "Gardening / landscaping.",
  "svc-joviplant": "Nursery — trees in bulk, often cheaper than Ericeira.",
  "svc-beekeeper": "Beekeeper — pollination & swarm help.",

  // Stones / materials (now under wood & materials)
  "svc-mpsseixo": "Stone supplier — materials for builds & counters.",
  "svc-stone-gzq": "Kitchen countertops / stone.",

  // Cleaning
  "svc-proclean": "Home cleaning company.",
  "svc-chimney": "Chimney cleaning service.",

  // Health
  "svc-pure": "Chiropractic clinic — Mafra.",
  "svc-bargiela": "Chiro / bodywork — Ericeira.",
  "svc-lencastre": "Oriental integrative chiropractic.",
  "svc-prehab": "Soft-tissue therapy / mobility (Prehab Lab).",
  "svc-fisio": "Physiotherapy.",
  "svc-joana": "Physio / bodywork — Mafra.",
  "svc-gabriela": "Osteopathy.",
  "svc-dale": "Personal training.",
  "svc-benedita": "Home nursing.",
  "svc-derm-lisbon": "Dermatologist — Lisbon.",
  "svc-pobral": "Dental clinic.",
  "svc-real-clinica": "Dental clinic — Mafra.",

  // Taxi
  "svc-alexandre": "Airport transfer — Tesla, meets you inside the terminal.",
  "svc-rui-taxi": "Local taxi / transfers.",
  "svc-eduardo": "Local taxi / transfers.",
  "svc-leonardo": "Local taxi / transfers.",
  "svc-lino": "Local taxi / transfers.",
  "svc-easy-transfer": "Airport / area transfers.",

  // Tech
  "svc-poetik": "IT — networks, domotics, servers (local).",
  "svc-iservices": "Phone / device repair — Cascais marina.",
  "svc-ifixit": "Device repair.",
  "svc-pcsintra": "Cheap IT gear / services — Sintra.",

  // Legal
  "svc-taxes-pt": "Tax advice / Portugal tax help.",
  "svc-ferretti": "Corporate lawyer.",
  "svc-carla": "Accountant / tax.",
  "svc-fresh": "Relocation / tax & admin help.",
  "svc-miriam": "Accountant / tax.",
  "svc-lvp": "Law firm (advogados).",

  // Creative
  "svc-johnny": "Photographer.",
  "svc-shirts": "Custom shirt printing.",

  // Kids
  "svc-fejao": "Indoor kids playground — Sintra, all ages.",
  "svc-upup": "Trampoline park — Sintra.",
  "svc-kidzania": "Kids role-play park — UBBO (pricey).",
  "svc-jumpyard": "Trampoline park — Lisboa.",
  "svc-ninja": "Ninja / obstacle course for kids.",
  "svc-quantum-sintra": "Indoor kids activity park — Sintra.",
  "svc-quantum-almada": "Indoor kids activity park — Almada.",
  "svc-parkour": "Parkour gym — Alfragide (10+).",
  "svc-urban-park": "Jump / trampoline park — Ericeira (before 5pm).",
  "svc-boulder": "Climbing gym — Ericeira.",

  // Energy
  "svc-goncalo-heat": "Heating systems.",
  "svc-telmo-lopes": "Solar PV, heat pumps & solar thermal.",
  "svc-les-solar": "Solar / heat pumps — English speaking.",
};

const CATEGORY_FALLBACK: Record<string, string> = {
  "cat-moving": "Moving / settling contact.",
  "cat-admin": "Admin / paperwork contact.",
  "cat-cars": "Cars & garage contact.",
  "cat-energy": "Energy / climate contact.",
  "cat-build": "Build & renovate contact.",
  "cat-trades": "Trade professional.",
  "cat-openings": "Gates, windows or doors.",
  "cat-wood": "Wood, decks, furniture or materials.",
  "cat-garden": "Garden / outdoors.",
  "cat-cleaning": "Cleaning service.",
  "cat-health": "Health / bodywork.",
  "cat-food": "Food & drink.",
  "cat-taxi": "Taxi / transfer.",
  "cat-cowork": "Café or cowork spot.",
  "cat-tech": "Tech / repairs.",
  "cat-legal": "Taxes / legal.",
  "cat-kids": "Kids activity.",
  "cat-creative": "Creative service.",
};

/** Looks like an address, not a useful description. */
function looksLikeAddressOnly(details: string): boolean {
  const d = details.trim();
  if (!d) return true;
  if (/^\d/.test(d) && d.includes(",")) return true;
  if (/^(Rua|R\.|Av\.|Avenida|Largo|Travessa|Estrada|EM\d)/i.test(d)) return true;
  if (d.length < 12 && !/[.!?]/.test(d) && /,/.test(d) === false && /café|shop|restaurant|plumber|café/i.test(d) === false) {
    // short location tags like "Mafra" or "Encarnação" — keep if useful, else replace if we have curated
    return false;
  }
  return false;
}

export function applyDescriptionEnrichment(db: Database.Database) {
  const rows = db
    .prepare(
      `SELECT id, details, category_id, google_note FROM services
       WHERE status IN ('approved', 'pending', 'hidden')
         AND (kind IS NULL OR kind = '' OR kind = 'contact')`
    )
    .all() as Array<{
    id: string;
    details: string;
    category_id: string;
    google_note: string;
  }>;

  const update = db.prepare(`UPDATE services SET details = ? WHERE id = ?`);

  const tx = db.transaction(() => {
    for (const row of rows) {
      const current = (row.details || "").trim();
      // Keep admin / existing copy — only fill empty or address-only stubs
      if (current && !looksLikeAddressOnly(current)) continue;

      const curated = DESCRIPTION_BY_ID[row.id];
      if (curated) {
        update.run(curated, row.id);
        continue;
      }

      if (row.google_note?.trim()) {
        update.run(row.google_note.trim(), row.id);
        continue;
      }

      const fallback = CATEGORY_FALLBACK[row.category_id];
      if (fallback && !current) update.run(fallback, row.id);
    }
  });
  tx();
}
