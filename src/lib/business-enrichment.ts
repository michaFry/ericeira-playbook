/**
 * Curated business facts (phone, hours, Google-style notes).
 * Sourced from public listings (Ericeira Market, restaurant sites, directories).
 * Hours/ratings change — treat as a helpful snapshot, not live Google.
 */
import type Database from "better-sqlite3";

export type BusinessEnrichment = {
  id: string;
  name?: string;
  details?: string;
  phone?: string;
  email?: string;
  address?: string;
  url?: string;
  hours?: string;
  rating?: number;
  reviews_count?: number;
  google_note?: string;
  /** Comma-separated: pt,en,fr,nl,hu,de,es */
  languages?: string;
};

export const BUSINESS_ENRICHMENTS: BusinessEnrichment[] = [
  {
    id: "svc-andre-mudancas",
    name: "André Mudanças",
    details:
      "Local mover / transport for Ericeira & Mafra (Google listing: ASTransportes, Santo Isidoro). Residential moves and light transport. Also sells used furniture via UsadosEmBomEstado.",
    phone: "+351 965 670 870",
    address: "R. Lugar do Canto 4, 2640-064 Santo Isidoro, Portugal",
    url: "http://usadosembomestado.pt/",
    hours: "Often reachable any day — confirm the move date by phone",
    rating: 5,
    reviews_count: 5,
    languages: "pt",
    google_note:
      "Google: ASTransportes · moving company · 5.0★ (5 reviews) · Santo Isidoro (≈5 km from Ericeira).",
  },
  {
    id: "svc-boardriders",
    name: "Boardriders Quiksilver",
    details:
      "Surf shop + café — coffee and a laptop-friendly spot. Next door to 58 Surf.",
    phone: "+351 261 867 046",
    address: "Av. São Sebastião 36A, 2655-319 Ericeira, Portugal",
    hours: "Typically 10:00–20:00 (later in summer) — confirm on site",
    rating: 4.0,
    reviews_count: 7,
    languages: "pt,en",
    google_note:
      "Quiksilver Boardriders flagship — surf retail downstairs, café with plant milks.",
  },
  {
    id: "svc-58-surf",
    name: "58 Surf",
    details:
      "Flagship surf shop (Billabong / 58) — retail store, not a café.",
    phone: "+351 261 860 900",
    email: "info@58surf.com",
    address: "Av. São Sebastião 36B, 2655-483 Ericeira, Portugal",
    url: "https://58surf.com/",
    hours: "Mon–Fri 10:00–18:00 (shop hours — confirm weekends)",
    languages: "pt,en",
    google_note:
      "58 Surf + Billabong flagship on Av. São Sebastião 36B — next to Mean Sardine / Boardriders.",
  },
  {
    id: "svc-alexandre",
    name: "Alexandre Airport Transfer",
    details:
      "Alex — super reliable Tesla airport transfers. Speaks English. ~€40 airport run (Ubers ~€35; the extra €5 is worth it). Meets you inside the terminal; give him your flight number and he tracks delays.",
    phone: "+351 927 390 502",
    languages: "pt,en",
    google_note:
      "Group tip: Tesla, meets inside the airport, monitors delayed flights.",
  },
  {
    id: "svc-talho-central",
    phone: "+351 261 863 382",
    email: "geral@talhocentraldaericeira.pt",
    address: "Largo dos Condes da Ericeira 14A, 2655-272 Ericeira, Portugal",
    hours: "Daily 09:00–20:00 (Sun included)",
    rating: 4.7,
    reviews_count: 20,
    google_note: "Popular local butcher by the municipal market — friendly team, wide meat selection.",
  },
  {
    id: "svc-mean-sardine",
    phone: "+351 911 791 574",
    email: "info@meansardine.pt",
    address: "Av. São Sebastião 36B, 2655-483 Ericeira, Portugal",
    url: "https://meansardine.pt/",
    hours: "Production brewery (no public taproom hours) — beers also at 58 / Maika'i",
    rating: 4.8,
    reviews_count: 24,
    google_note: "Award-winning Ericeira craft brewery (RateBeer Best Brewery in Portugal, multiple years).",
  },
  {
    id: "svc-5emeio",
    address: "Rua do Ericeira 14, 2655-271 Ericeira, Portugal",
    hours: "17:30–01:00 — Jul–Sep daily; Oct–Jun closed Mon–Tue",
    google_note: "Local craft beer & burger taproom in the village centre.",
  },
  {
    id: "svc-golfinho",
    phone: "+351 261 862 945",
    email: "geral@golfinhoazul.pt",
    address: "Rua das Ribas 24, Praia de São Lourenço, 2640-254, Portugal",
    url: "https://golfinhoazul.pt/",
    hours: "Tue–Sun 12:00–22:00 · Closed Monday",
    rating: 4.1,
    reviews_count: 320,
    google_note: "Panoramic seafood spot above São Lourenço beach — strong on sunset views and grilled fish.",
  },
  {
    id: "svc-furnas",
    phone: "+351 261 867 914",
    email: "geral@marisqueirafurnas.com",
    address: "Rua das Furnas 3, 2655-288 Ericeira, Portugal",
    url: "https://marisqueirafurnas.com/",
    hours: "Daily 12:00–22:00",
    google_note: "Large seaside marisqueira by the Furnas rocks — seafood by the kilo and big terrace.",
  },
  {
    id: "svc-ribas",
    phone: "+351 924 025 232",
    email: "geral@ribasmarisqueira.pt",
    address: "Rua Mendes Leal 32, 2655-319 Ericeira, Portugal",
    url: "https://www.ribasmarisqueira.pt",
    hours: "Daily 12:00–23:00",
    rating: 4.3,
    reviews_count: 180,
    google_note: "Refurbished 2019 seafood restaurant with Chef Igor Martinho — modern take on classic marisqueira.",
  },
  {
    id: "svc-costa-fria",
    phone: "+351 926 367 969",
    email: "eat@costafria.com",
    address: "Rua Capitão João Lopes 4, 2655-295 Ericeira, Portugal",
    url: "https://costafria.com/",
    hours: "Daily 12:30–23:00 · Reservations recommended",
    rating: 4.6,
    reviews_count: 131,
    google_note: "Contemporary coastal restaurant with ocean views — sharing plates, seafood, strong sunset terrace vibe.",
  },
  {
    id: "svc-lagoa",
    address: "Lagoa D'Ouro, Ericeira, Portugal",
    hours: "Typical restaurant hours — call ahead",
    rating: 4.4,
    reviews_count: 90,
    google_note: "Long-time Ericeira favourite from the dads list — classic local restaurant.",
  },
  {
    id: "svc-cucina",
    phone: "+351 937 991 673",
    email: "geral@cucina37.pt",
    address: "Rua Prudêncio Franco da Trindade 18, 2655-249 Ericeira, Portugal",
    hours: "Mon–Tue 18:00–22:00 · Thu–Fri 18:00–23:00 · Sat–Sun 12:30–22:00 (break 15:00–19:00) · Closed Wed",
    rating: 4.5,
    reviews_count: 95,
    google_note: "Italian restaurant in town — homemade pasta and rustic atmosphere.",
  },
  {
    id: "svc-estrela",
    phone: "+351 261 864 444",
    address: "Rua São João, Ribamar 2640-036, Portugal",
    hours: "Mon 12:00–22:00 · Thu 12:00–23:00 · Fri–Sun 12:00–23:00 · Closed Tue–Wed",
    rating: 4.2,
    reviews_count: 75,
    google_note: "Long-running marisqueira in Ribamar — also does events and catering.",
  },
  {
    id: "svc-onegai",
    phone: "+351 261 862 239",
    address: "Largo Santa Marta 3A / Tv. do Mercado, 2655-357 Ericeira, Portugal",
    hours: "Tue–Sun 19:00–23:00 · Closed Monday · Book ahead",
    rating: 4.5,
    reviews_count: 73,
    google_note: "Often called the best sushi in Ericeira — fresh fish, intimate room, reservations recommended.",
  },
  {
    id: "svc-balagan",
    phone: "+351 913 362 452",
    email: "ericeira@balaganfood.com",
    address: "Praia do Sul, Ericeira, Portugal",
    url: "https://pt.balaganfood.com/",
    hours: "Mon–Thu & Sun 09:00–18:30 · Fri–Sat 09:00–21:00 (dinner Fri–Sat)",
    rating: 4.4,
    reviews_count: 110,
    google_note: "Beach-house deli café at Praia do Sul — Middle Eastern / Mediterranean plates, often busy.",
  },
  {
    id: "svc-selina",
    phone: "+351 912 124 160",
    email: "reception.ericeira@selina.pt",
    address: "Estrada de Mafra 26, 2655-302 Ericeira, Portugal",
    hours: "Reception / check-in from 16:00 · Check-out 11:00",
    rating: 4.0,
    reviews_count: 222,
    google_note: "Central hostel-hotel with cowork-friendly common areas and terrace — mixed but lively reviews.",
  },
  {
    id: "svc-coastal",
    phone: "+351 935 692 394",
    email: "hello@coastal-collective.cc",
    address: "Rua de São Félix 12e, 2655-362 Ericeira, Portugal",
    url: "https://www.coastal-collective.cc",
    hours: "Office Mon–Fri 08:30–19:00 · Members 24/7",
    rating: 4.5,
    reviews_count: 28,
    google_note: "Open-plan cowork with lounge zones and terrace — members get round-the-clock access.",
  },
  {
    id: "svc-salt",
    address: "Travessa do Jogo da Bola 1, 2655-297 Ericeira, Portugal",
    hours: "Members 24/7",
    rating: 3.7,
    reviews_count: 10,
    google_note: "Independent creative cowork & event space by the sea — surfboard storage, meeting rooms.",
  },
  {
    id: "svc-proclean",
    url: "http://proclean.pt",
    google_note: "Local cleaning company listed in the dads playbook.",
  },
  {
    id: "svc-lencastre",
    address:
      "One World Business Building, Largo dos Pocinhos 2, Gabinete 320, 2655-333 Ericeira, Portugal",
    url: "https://www.carloslencastre.pt/agendamento/",
    google_note: "Integrative oriental chiropractic — book online via the clinic site.",
  },
  {
    id: "svc-prehab",
    phone: "+351 911 888 613",
    email: "prehab.ericeira@gmail.com",
    address: "Sobreiro, 2640-817, Portugal",
    url: "https://www.prehablab.com",
    google_note: "Soft-tissue therapy, mobility and performance training — medically recommended by parents in the group.",
  },
  {
    id: "svc-lourosmad",
    address:
      "Rua Fernando Vicente 12, Zona Industrial de Arenes, 2560-677 Torres Vedras, Portugal",
    url: "https://lourosmad.pt/",
    hours: "Typical timber yard hours — call ahead",
    google_note: "Wood delivery / timber supplier for Torres Vedras area.",
  },
  {
    id: "svc-nuno-nasc",
    phone: "+351 916 400 528",
    email: "geral@nunonascimento.com",
    address: "Rua Doutor Augusto Lamas 2A, 2760-152 Caxias, Portugal",
    url: "https://www.nunonascimento.com/",
    google_note: "Architect studio in Caxias — useful contact when starting renovation projects.",
  },
  {
    id: "svc-tiago-barros",
    phone: "+351 932 412 600",
    email: "info@tiagobarros.pt",
    address: "Tiago Barros Studio, Ericeira / Mafra, Portugal",
    url: "https://www.tiagobarros.pt",
    google_note: "Local architecture studio covering Ericeira–Mafra.",
  },
  {
    id: "svc-windoor",
    url: "https://www.windoorlisboa.pt/",
    google_note: "PVC windows/doors — recommended by a group member after a full replacement job.",
  },
  {
    id: "svc-boulder",
    address: "Ericeira Boulder, Ericeira, Portugal",
    google_note: "Indoor climbing — one of the closest kid-friendly activity options in town.",
  },
  {
    id: "svc-urban-park",
    address: "Urban Park Ericeira, Ericeira, Portugal",
    hours: "Jump park — typically before 17:00 for open sessions (confirm on site)",
    google_note: "Closest trampoline / jump option in Ericeira — go before 5pm when possible.",
  },
  {
    id: "svc-vilagale",
    address: "Hotel Vila Galé Ericeira, Ericeira, Portugal",
    google_note: "Quiet lobby/café spot to work from — not a cowork, just peaceful.",
  },
  {
    id: "svc-organic",
    address: "The Organic Way, Rua do Mercado, Ericeira, Portugal",
    google_note: "Healthy café near the market — good for a laptop session.",
  },
  {
    id: "svc-brunch",
    address: "Brunch Me, Ericeira, Portugal",
    google_note: "Popular brunch café — can get busy at peak hours.",
  },
  {
    id: "svc-barbatana",
    address: "Barbatana, Foz do Lizandro, Ericeira, Portugal",
    google_note: "Beach café at Foz do Lizandro — work-friendly off-peak.",
  },
  {
    id: "svc-intermarche",
    address: "Intermarché Ericeira, Ericeira, Portugal",
    hours: "Opens early — quiet seats on the 1st floor",
    google_note: "Not glamorous, but reliable early Wi-Fi and space upstairs.",
  },
  {
    id: "svc-kau",
    address: "Kau Barbecue, Ericeira, Portugal",
    url: "https://www.instagram.com/kau_barbecue",
    google_note: "Group favourite for ribs and grilled meat — check Instagram for current spot/hours.",
  },
  {
    id: "svc-terco",
    address: "Terço do Meio, Ericeira, Portugal",
    google_note: "Local bakery recommended in the playbook.",
  },
  {
    id: "svc-mario-joao",
    address: "Av. Primeiro de Maio 13, 2640-474 Mafra, Portugal",
    google_note: "Butcher in Mafra — good alternative when shopping outside Ericeira.",
  },
  {
    id: "svc-placido",
    address: "EM550 58, 2655-405 Lisboa, Portugal",
    hours: "Order via WhatsApp",
    google_note: "Quality butcher — WhatsApp orders common among expats.",
  },
  {
    id: "svc-iservices",
    phone: "+351 21 012 5750",
    address: "iServices, Marina de Cascais, Cascais, Portugal",
    google_note: "Device repair at Cascais marina.",
  },
  {
    id: "svc-pobral",
    phone: "+351 21 961 2000",
    address: "Clínica do Pobral, Portugal",
    google_note: "Dental clinic recommended in the playbook.",
  },
  {
    id: "svc-real-clinica",
    phone: "+351 261 786 363",
    address: "Real Clínica, Mafra, Portugal",
    google_note: "Dental clinic in Mafra.",
    languages: "pt",
  },
];

/** Spoken languages from the playbook (and phone-country hints). */
const LANGUAGE_BY_ID: Record<string, string> = {
  "svc-boardriders": "pt,en",
  "svc-58-surf": "pt,en",
  "svc-andre-mudancas": "pt",
  "svc-auto-miramar": "pt,en",
  "svc-pedro-struct": "pt,en",
  "svc-antoine-begoc": "fr,en,pt",
  "svc-joe-carreira": "pt,en",
  "svc-bogdan": "pt,en",
  "svc-miguel-elec": "pt",
  "svc-laszlo": "hu,en,pt",
  "svc-luis-ruca": "pt",
  "svc-miha": "pt,en",
  "svc-les-plumb": "en,pt",
  "svc-les-solar": "en,pt",
  "svc-alexandre": "pt,en",
  "svc-brian": "nl,en,pt",
  "svc-brian-carp": "nl,en,pt",
  "svc-yann-clm": "fr,pt",
  "svc-sergio-rodrigues": "pt",
  "svc-sergio-paint": "pt",
  "svc-paulo-lopes": "pt",
  "svc-goncalo": "pt",
  "svc-goncalo-heat": "pt",
  "svc-nuno-canal": "pt",
  "svc-fernando-plumb": "pt",
  "svc-miguel-plumb": "pt",
  "svc-rui-tyre": "pt",
  "svc-garage-isidoro": "pt",
  "svc-rui-fortunato": "pt",
  "svc-transfonseca": "pt",
  "svc-antonio-domingues": "pt",
  "svc-victor-tereso": "pt",
  "svc-wilson": "pt",
  "svc-wilson-gate": "pt",
  "svc-jonas-bartel": "pt",
  "svc-ricardo-lima": "pt",
  "svc-cholo": "pt",
  "svc-nilton": "pt",
  "svc-edson": "pt",
  "svc-bernardo-assis": "pt",
  "svc-aluterm": "pt",
  "svc-jorge-antunes": "pt",
  "svc-joao-elec": "pt",
  "svc-sergio-ricardo": "pt",
  "svc-carmezim": "pt",
  "svc-silverio": "pt",
  "svc-julio": "pt",
  "svc-fernando-martins": "pt",
  "svc-telmo-lopes": "pt",
  "svc-telmo-wine": "pt,en",
  "svc-rui-taxi": "pt",
  "svc-eduardo": "pt",
  "svc-leonardo": "pt",
  "svc-lino": "pt",
  "svc-easy-transfer": "pt,en",
  "svc-pure": "pt,en",
  "svc-bargiela": "pt",
  "svc-lencastre": "pt,en",
  "svc-prehab": "en,pt",
  "svc-joana": "pt",
  "svc-gabriela": "pt,en,de",
  "svc-dale": "en,pt",
  "svc-benedita": "pt",
  "svc-beekeeper": "pt",
  "svc-johnny": "pt",
  "svc-ferretti": "pt,en",
  "svc-carla": "pt,en",
  "svc-miriam": "pt,en",
  "svc-nuno-nasc": "pt,en",
  "svc-tiago-barros": "pt,en",
  "svc-archstudio": "pt,en",
  "svc-nocnoc": "pt,en",
  "svc-poetik": "pt,en",
  "svc-mudelar": "pt",
  "svc-handyman-351": "pt",
  "svc-labart": "pt,en",
  "svc-woodcraft": "pt",
  "svc-sebastec": "pt",
  "svc-isolaterm": "pt",
  "svc-terrum": "pt",
  "svc-joviplant": "pt",
  "svc-chimney": "pt",
  "svc-miguel-insp": "pt,en",
  "svc-shirts": "pt",
  "svc-tomo": "pt,es",
  "svc-talho-central": "pt",
  "svc-mario-joao": "pt",
  "svc-placido": "pt",
  "svc-mean-sardine": "pt,en",
  "svc-5emeio": "pt,en",
  "svc-golfinho": "pt,en",
  "svc-furnas": "pt,en",
  "svc-ribas": "pt,en",
  "svc-cucina": "pt,en",
  "svc-estrela": "pt",
  "svc-onegai": "pt,en",
  "svc-lagoa": "pt,en",
  "svc-costa-fria": "pt,en",
  "svc-kau": "pt,en",
  "svc-balagan": "pt,en",
  "svc-selina": "pt,en",
  "svc-coastal": "pt,en",
  "svc-salt": "pt,en",
  "svc-brunch": "pt,en",
  "svc-barbatana": "pt,en",
  "svc-organic": "pt,en",
  "svc-vilagale": "pt,en",
  "svc-the-base": "pt,en",
  "svc-windoor": "pt,en",
  "svc-homly": "pt,en",
  "svc-tj": "pt,en",
  "svc-engi": "pt,en",
  "svc-pobral": "pt",
  "svc-real-clinica": "pt",
  "svc-iservices": "pt,en",
  "svc-fresh": "pt,en",
  "svc-taxes-pt": "pt,en",
  "svc-lvp": "pt,en",
  "svc-manie": "pt,en",
  "svc-sell-car": "en",
};

/** Merge curated Google/listing facts onto matching services. */
export function applyBusinessEnrichment(db: Database.Database) {
  const byId = new Map(BUSINESS_ENRICHMENTS.map((e) => [e.id, { ...e }]));
  for (const [id, languages] of Object.entries(LANGUAGE_BY_ID)) {
    const existing = byId.get(id);
    if (existing) existing.languages = existing.languages || languages;
    else byId.set(id, { id, languages });
  }

  const row = db.prepare(`SELECT * FROM services WHERE id = ?`);
  const update = db.prepare(
    `UPDATE services
     SET name = ?, details = ?, phone = ?, email = ?, address = ?, url = ?, hours = ?,
         rating = ?, reviews_count = ?, google_note = ?, languages = ?
     WHERE id = ?`
  );

  const tx = db.transaction(() => {
    for (const e of byId.values()) {
      const current = row.get(e.id) as
        | {
            name: string;
            details: string;
            phone: string;
            email: string;
            address: string;
            url: string;
            hours: string;
            rating: number | null;
            reviews_count: number;
            google_note: string;
            languages: string;
          }
        | undefined;
      if (!current) continue;

      // Prefer existing DB values so admin edits stick; enrichment only fills gaps.
      const pick = (cur: string, next?: string) =>
        (cur || "").trim() ? cur : next || cur || "";

      update.run(
        pick(current.name, e.name),
        e.details !== undefined
          ? pick(current.details, e.details)
          : current.details || "",
        pick(current.phone, e.phone),
        pick(current.email, e.email),
        pick(current.address, e.address),
        pick(current.url, e.url),
        e.hours !== undefined
          ? pick(current.hours, e.hours)
          : current.hours || "",
        current.rating != null
          ? current.rating
          : e.rating !== undefined
            ? e.rating
            : null,
        current.reviews_count > 0
          ? current.reviews_count
          : e.reviews_count !== undefined
            ? e.reviews_count
            : current.reviews_count ?? 0,
        e.google_note !== undefined
          ? pick(current.google_note, e.google_note)
          : current.google_note || "",
        pick(current.languages, e.languages),
        e.id
      );
    }
  });
  tx();
}
