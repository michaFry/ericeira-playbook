import type Database from "better-sqlite3";

type SeedCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sort_order: number;
};

type SeedService = {
  id: string;
  category_id: string;
  name: string;
  details?: string;
  phone?: string;
  email?: string;
  url?: string;
};

const categories: SeedCategory[] = [
  {
    id: "cat-admin",
    name: "Getting help with admin",
    slug: "admin-help",
    description:
      "Help with car import, account opening, utilities… Often expensive via expat agents. Prefer local Portuguese professionals — ask the group for the latest best option.",
    icon: "ClipboardList",
    sort_order: 10,
  },
  {
    id: "cat-car",
    name: "Car",
    slug: "car",
    description: "Car import, selling, and related tips around Ericeira.",
    icon: "Car",
    sort_order: 20,
  },
  {
    id: "cat-mechanic",
    name: "Mechanic",
    slug: "mechanic",
    description: "Trusted garages and mechanics recommended by dads.",
    icon: "Wrench",
    sort_order: 30,
  },
  {
    id: "cat-car-reg",
    name: "Updating your car registration address",
    slug: "car-registration",
    description: "Update your vehicle registration address via IRN Mafra.",
    icon: "FileText",
    sort_order: 40,
  },
  {
    id: "cat-energy",
    name: "Energy provider",
    slug: "energy",
    description: "Compare and switch energy providers easily.",
    icon: "Zap",
    sort_order: 50,
  },
  {
    id: "cat-construction",
    name: "Construction advice",
    slug: "construction-advice",
    description:
      "Before any job: ask for a detailed quote with quantity and material references. Check contractors on racius.com. Get an architect's trusted network, use a solid contract, ask 3–4 offers, never pay without taxes, release money per contract only when work starts on site.",
    icon: "HardHat",
    sort_order: 60,
  },
  {
    id: "cat-spa",
    name: "Installing a home SPA",
    slug: "home-spa",
    description: "SPA furniture and equipment.",
    icon: "Bath",
    sort_order: 70,
  },
  {
    id: "cat-appliances",
    name: "Dishwasher / Washing machine repair",
    slug: "appliance-repair",
    description: "Appliance repair in Ericeira.",
    icon: "Refrigerator",
    sort_order: 80,
  },
  {
    id: "cat-structural",
    name: "Structural engineer",
    slug: "structural-engineer",
    description: "Structural engineering (English spoken).",
    icon: "Building2",
    sort_order: 90,
  },
  {
    id: "cat-handyman",
    name: "Handyman",
    slug: "handyman",
    description: "General handymen and remodelações.",
    icon: "Hammer",
    sort_order: 100,
  },
  {
    id: "cat-metal",
    name: "Metal / Welding",
    slug: "metal-welding",
    description: "Metalwork and welding.",
    icon: "Flame",
    sort_order: 110,
  },
  {
    id: "cat-deck",
    name: "Creating a deck",
    slug: "deck",
    description: "Deck builders and woodcraft.",
    icon: "Layers",
    sort_order: 120,
  },
  {
    id: "cat-wood-buy",
    name: "Where to buy wood for construction",
    slug: "buy-wood",
    description: "Timber and wood suppliers.",
    icon: "TreePine",
    sort_order: 130,
  },
  {
    id: "cat-furniture",
    name: "Custom furniture",
    slug: "custom-furniture",
    description: "Custom furniture and spray artists.",
    icon: "Armchair",
    sort_order: 140,
  },
  {
    id: "cat-builders",
    name: "Builders",
    slug: "builders",
    description: "Building contractors around Ericeira.",
    icon: "HardHat",
    sort_order: 150,
  },
  {
    id: "cat-wood-delivery",
    name: "Wood Delivery",
    slug: "wood-delivery",
    description: "Wood delivery and carpentry suppliers.",
    icon: "Truck",
    sort_order: 160,
  },
  {
    id: "cat-gate",
    name: "Gate",
    slug: "gate",
    description: "Automatic gates, serralharia, glass and portões.",
    icon: "DoorOpen",
    sort_order: 170,
  },
  {
    id: "cat-electrician",
    name: "Electrician",
    slug: "electrician",
    description: "Electricians recommended by the group.",
    icon: "Plug",
    sort_order: 180,
  },
  {
    id: "cat-painting",
    name: "Painting",
    slug: "painting",
    description: "Painters.",
    icon: "Paintbrush",
    sort_order: 190,
  },
  {
    id: "cat-plumber",
    name: "Plumber",
    slug: "plumber",
    description: "Plumbers and heating.",
    icon: "Droplets",
    sort_order: 200,
  },
  {
    id: "cat-cleaning",
    name: "Cleaning",
    slug: "cleaning",
    description: "Cleaning services.",
    icon: "Sparkles",
    sort_order: 210,
  },
  {
    id: "cat-garden",
    name: "Terra de Jardim / Garden",
    slug: "garden",
    description: "Jardinagem and garden soil.",
    icon: "Flower2",
    sort_order: 220,
  },
  {
    id: "cat-trees",
    name: "Trees",
    slug: "trees",
    description:
      "Buying lots of trees is much cheaper far from Ericeira — easily half price.",
    icon: "TreeDeciduous",
    sort_order: 230,
  },
  {
    id: "cat-gutter",
    name: "Nice Gutter",
    slug: "gutter",
    description: "Gutter (caleiras) specialists.",
    icon: "Home",
    sort_order: 240,
  },
  {
    id: "cat-insulation",
    name: "Insulation",
    slug: "insulation",
    description: "Insulation and caixilharia.",
    icon: "Shield",
    sort_order: 250,
  },
  {
    id: "cat-architect",
    name: "Architect",
    slug: "architect",
    description: "Architects and project studios.",
    icon: "Ruler",
    sort_order: 260,
  },
  {
    id: "cat-stones",
    name: "Stones (countertop)",
    slug: "stones",
    description: "Stone suppliers and countertops. Also shops in Terrugem.",
    icon: "Gem",
    sort_order: 270,
  },
  {
    id: "cat-carpenter",
    name: "Carpenter",
    slug: "carpenter",
    description: "Carpenters.",
    icon: "Axe",
    sort_order: 280,
  },
  {
    id: "cat-inspection",
    name: "Home Inspection",
    slug: "home-inspection",
    description: "Property inspection services tested by group members.",
    icon: "SearchCheck",
    sort_order: 290,
  },
  {
    id: "cat-chimney",
    name: "Chimney Cleaning",
    slug: "chimney",
    description: "Chimney cleaning service.",
    icon: "Flame",
    sort_order: 300,
  },
  {
    id: "cat-garage",
    name: "Garage Door",
    slug: "garage-door",
    description: "Garage door services.",
    icon: "Warehouse",
    sort_order: 310,
  },
  {
    id: "cat-shutter",
    name: "Rolling Shutter",
    slug: "rolling-shutter",
    description: "Rolling shutters (estoros).",
    icon: "Blinds",
    sort_order: 320,
  },
  {
    id: "cat-windows",
    name: "Windows & Doors",
    slug: "windows-doors",
    description: "Windows, doors and PVC replacements.",
    icon: "AppWindow",
    sort_order: 330,
  },
  {
    id: "cat-heating",
    name: "Heating",
    slug: "heating",
    description: "Heating specialists.",
    icon: "Thermometer",
    sort_order: 340,
  },
  {
    id: "cat-solar",
    name: "Solar / HeatPumps / Solar Thermal",
    slug: "solar",
    description: "Photovoltaic, heat pumps and solar thermal.",
    icon: "Sun",
    sort_order: 350,
  },
  {
    id: "cat-taxi",
    name: "Taxi",
    slug: "taxi",
    description: "Local taxis and transfers.",
    icon: "Taxi",
    sort_order: 360,
  },
  {
    id: "cat-beer",
    name: "Beer",
    slug: "beer",
    description: "Breweries and taprooms.",
    icon: "Beer",
    sort_order: 370,
  },
  {
    id: "cat-restaurant",
    name: "Restaurant (only the best)",
    slug: "restaurants",
    description: "Best restaurants around Ericeira.",
    icon: "UtensilsCrossed",
    sort_order: 380,
  },
  {
    id: "cat-wine",
    name: "Wine",
    slug: "wine",
    description: "Natural, low intervention and organic wines.",
    icon: "Wine",
    sort_order: 390,
  },
  {
    id: "cat-bread",
    name: "Bread",
    slug: "bread",
    description: "Bakeries.",
    icon: "Croissant",
    sort_order: 400,
  },
  {
    id: "cat-butcher",
    name: "Butcher",
    slug: "butcher",
    description: "Butchers and quality meat.",
    icon: "Beef",
    sort_order: 410,
  },
  {
    id: "cat-chiro",
    name: "Chiro / Osteo / Bodywork",
    slug: "chiro-osteo",
    description: "Chiropractic, osteopathy, physio and personal training.",
    icon: "HeartPulse",
    sort_order: 420,
  },
  {
    id: "cat-nurse",
    name: "Nurse",
    slug: "nurse",
    description: "Home nursing services.",
    icon: "Cross",
    sort_order: 430,
  },
  {
    id: "cat-newborn",
    name: "New born registration",
    slug: "newborn-registration",
    description:
      "IRN Mafra newborn registration tips: Chave Móvel only for Portuguese citizens; pick priority ticket; email civil.mafra@irn.mj.pt; birth certs in Short/Full/Multilingual formats; bring a PT speaker if you can.",
    icon: "Baby",
    sort_order: 440,
  },
  {
    id: "cat-beekeeping",
    name: "Beekeeping",
    slug: "beekeeping",
    description: "Pollination services and swarm collection in Ericeira/Mafra.",
    icon: "Bug",
    sort_order: 450,
  },
  {
    id: "cat-derm",
    name: "Dermatologist",
    slug: "dermatologist",
    description: "Dermatologists.",
    icon: "ScanFace",
    sort_order: 460,
  },
  {
    id: "cat-dentist",
    name: "Dentist",
    slug: "dentist",
    description: "Dental clinics.",
    icon: "Smile",
    sort_order: 470,
  },
  {
    id: "cat-it",
    name: "IT",
    slug: "it",
    description: "Networks, domotics, servers, system administration.",
    icon: "Laptop",
    sort_order: 480,
  },
  {
    id: "cat-repair",
    name: "Repair services",
    slug: "repair",
    description: "Device and phone repair.",
    icon: "Smartphone",
    sort_order: 490,
  },
  {
    id: "cat-cheap",
    name: "Selling cheap stuff",
    slug: "cheap-stuff",
    description: "Affordable IT and gear.",
    icon: "Tag",
    sort_order: 500,
  },
  {
    id: "cat-shirts",
    name: "Shirt printing",
    slug: "shirt-printing",
    description: "Custom shirt printing.",
    icon: "Shirt",
    sort_order: 510,
  },
  {
    id: "cat-cowork",
    name: "Cowork / Work from outside home",
    slug: "cowork",
    description:
      "Cafés open early; fancier ones sometimes from 10. Quiet spots and cowork spaces in Ericeira.",
    icon: "Coffee",
    sort_order: 520,
  },
  {
    id: "cat-taxes",
    name: "Taxes, lawyer and accounting",
    slug: "taxes-legal",
    description: "Tax, corporate law and accounting.",
    icon: "Scale",
    sort_order: 530,
  },
  {
    id: "cat-photo",
    name: "Photograph",
    slug: "photograph",
    description: "Photographers.",
    icon: "Camera",
    sort_order: 540,
  },
  {
    id: "cat-kids",
    name: "What to do indoor with kids",
    slug: "kids-indoor",
    description:
      "Indoor activities in Sintra/Lisboa and closest options in Ericeira (Urban Park before 5pm, Ericeira Boulder).",
    icon: "Gamepad2",
    sort_order: 550,
  },
];

const services: SeedService[] = [
  // Car
  {
    id: "svc-acp",
    category_id: "cat-car",
    name: "ACP — Automóvel Club do Portugal",
    details: "Cheapest option for car import — be a member of ACP.",
  },
  {
    id: "svc-sell-car",
    category_id: "cat-car",
    name: "Car selling (fixed fee)",
    details: "Sells your car for a fixed fee.",
    phone: "+972 528 350 789",
  },
  // Mechanic
  {
    id: "svc-rui-tyre",
    category_id: "cat-mechanic",
    name: "Rui (tyre specialist)",
    phone: "+351 965 676 223",
  },
  {
    id: "svc-garage-isidoro",
    category_id: "cat-mechanic",
    name: "Garage Ericeira St Isidoro",
    phone: "+351 967 089 796",
  },
  {
    id: "svc-rui-fortunato",
    category_id: "cat-mechanic",
    name: "Rui Fortunato",
    details: "Estrada da Cabeça Alta 6, Pinhal dos Frades",
    phone: "+351 962 706 330",
  },
  {
    id: "svc-topcar",
    category_id: "cat-mechanic",
    name: "TOPCAR — Baiauto — Mafra",
  },
  {
    id: "svc-auto-miramar",
    category_id: "cat-mechanic",
    name: "Auto Miramar",
    details: "English spoken",
  },
  {
    id: "svc-transfonseca",
    category_id: "cat-mechanic",
    name: "Transfonseca (Mafra)",
    phone: "+351 912 361 833",
  },
  {
    id: "svc-ouriceira",
    category_id: "cat-mechanic",
    name: "Ouriceira Auto",
  },
  {
    id: "svc-rpm",
    category_id: "cat-mechanic",
    name: "RPM Garantie",
    details: "Warranty service for used cars",
    url: "https://rpmgarantie.pt/",
  },
  // Car registration
  {
    id: "svc-irn-mafra",
    category_id: "cat-car-reg",
    name: "IRN — Registo Predial e Comercial de Mafra",
    details: "Book an appointment to update your car registration address.",
    url: "https://irn.justica.gov.pt/Contactos-do-Registo/-Registo-Predial-e-Comercial-de-Mafra",
  },
  // Energy
  {
    id: "svc-manie",
    category_id: "cat-energy",
    name: "Manie.pt",
    details: "Import your last invoice and choose the cheapest provider. Super convenient.",
    url: "https://www.manie.pt/",
  },
  // Construction tip link
  {
    id: "svc-racius",
    category_id: "cat-construction",
    name: "Racius company check",
    details: "Check how long a contractor has been in business and if everything seems legit.",
    url: "https://www.racius.com/",
  },
  // SPA
  {
    id: "svc-quirumed",
    category_id: "cat-spa",
    name: "Quirumed — SPA furniture",
    url: "https://www.quirumed.com/pt/spa-e-massagem/mobiliario-spa",
  },
  // Appliances
  {
    id: "svc-antonio-domingues",
    category_id: "cat-appliances",
    name: "Antonio Domingues Máquinas Ericeira",
    details: "Dishwasher and washing machine repair",
    phone: "+351 936 352 361",
  },
  // Structural
  {
    id: "svc-pedro-struct",
    category_id: "cat-structural",
    name: "Pedro (structural engineer)",
    details: "English spoken",
    phone: "+351 916 507 330",
  },
  // Handyman
  {
    id: "svc-mudelar",
    category_id: "cat-handyman",
    name: "Mudelar Remodelações",
    details: "Kitchen / Bathroom",
    url: "https://linktr.ee/mudelar_remodelacoes",
  },
  {
    id: "svc-sergio-rodrigues",
    category_id: "cat-handyman",
    name: "Sergio Rodrigues",
    phone: "+351 960 008 931",
  },
  {
    id: "svc-victor-tereso",
    category_id: "cat-handyman",
    name: "Victor Tereso — General Contractor",
    phone: "+351 912 153 806",
    email: "victor.tereso@outlook.com",
  },
  {
    id: "svc-antoine-begoc",
    category_id: "cat-handyman",
    name: "Antoine Begoc",
    details: "French, speaks English perfectly & is super professional.",
    phone: "+33 6 30 31 87 71",
  },
  {
    id: "svc-handyman-351",
    category_id: "cat-handyman",
    name: "Handyman",
    phone: "+351 932 864 777",
  },
  // Metal
  {
    id: "svc-wilson",
    category_id: "cat-metal",
    name: "Wilson",
    phone: "+351 910 116 988",
  },
  {
    id: "svc-labart",
    category_id: "cat-metal",
    name: "LabArt Place / LabArt Space",
  },
  {
    id: "svc-yann-clm",
    category_id: "cat-metal",
    name: "Yann CLM",
    phone: "+33 6 84 02 99 79",
  },
  // Deck
  {
    id: "svc-jonas-bartel",
    category_id: "cat-deck",
    name: "Jonas Bartel",
    phone: "+351 963 336 939",
  },
  {
    id: "svc-woodcraft",
    category_id: "cat-deck",
    name: "Woodcraft — Roberto Palves",
  },
  {
    id: "svc-brian",
    category_id: "cat-deck",
    name: "Brian",
    phone: "+31 6 13023741",
  },
  // Wood buy
  { id: "svc-balbino", category_id: "cat-wood-buy", name: "Balbino e Faustino" },
  { id: "svc-comapla", category_id: "cat-wood-buy", name: "Comapla" },
  { id: "svc-ido", category_id: "cat-wood-buy", name: "Ido madeira" },
  { id: "svc-mdo", category_id: "cat-wood-buy", name: "Mdo madeiras" },
  { id: "svc-somassul", category_id: "cat-wood-buy", name: "Somassul" },
  { id: "svc-multiplacas", category_id: "cat-wood-buy", name: "Multiplacas" },
  {
    id: "svc-ascenso",
    category_id: "cat-wood-buy",
    name: "Madeiras Ascenso",
    details: "Achada",
  },
  // Furniture
  {
    id: "svc-edson",
    category_id: "cat-furniture",
    name: "Edson — Spray artist / Custom furniture",
    phone: "+351 967 974 872",
  },
  // Builders
  {
    id: "svc-ricardo-lima",
    category_id: "cat-builders",
    name: "Ricardo Lima Building Work",
    phone: "+351 966 915 841",
  },
  {
    id: "svc-cholo",
    category_id: "cat-builders",
    name: "Cholo Pelusa",
    phone: "+351 963 067 541",
  },
  {
    id: "svc-nilton",
    category_id: "cat-builders",
    name: "Nilton Vieira Contractor Ericeira",
    phone: "+351 914 900 475",
  },
  {
    id: "svc-joe-carreira",
    category_id: "cat-builders",
    name: "Joe Carreira",
    details: "Specialize in wood framing. PT/EN",
    phone: "+351 934 950 807",
  },
  // Wood delivery
  {
    id: "svc-lourosmad",
    category_id: "cat-wood-delivery",
    name: "Lourosmad",
    details: "Rua Fernando Vicente, 12 — Zona Industrial de Arenes — 2560-677 Torres Vedras",
    url: "https://lourosmad.pt/",
  },
  {
    id: "svc-jotalves",
    category_id: "cat-wood-delivery",
    name: "Jotalves, Carpintaria E Móveis, Lda.",
    details: "Encarnação",
  },
  {
    id: "svc-sobreira",
    category_id: "cat-wood-delivery",
    name: "Sobreira & Serras, S.A.",
    details: "Alto do Ulmeiro, 2635-565 Rio de Mouro",
  },
  // Gate
  {
    id: "svc-sebastec",
    category_id: "cat-gate",
    name: "Sebastec — Portas Automáticas, Lda",
    phone: "+351 21 975 5783",
    url: "https://g.co/kgs/69Ur8Ym",
  },
  {
    id: "svc-bernardo-assis",
    category_id: "cat-gate",
    name: "Bernardo Assis — Serralharia",
    details: "Glass and Portões",
    phone: "+351 912 715 369",
  },
  {
    id: "svc-wilson-gate",
    category_id: "cat-gate",
    name: "Wilson Master LEIRIA",
    phone: "+351 910 116 988",
  },
  {
    id: "svc-aluterm",
    category_id: "cat-gate",
    name: "Aluterm — Victor Vasques",
    phone: "+351 969 853 335",
  },
  {
    id: "svc-jorge-antunes",
    category_id: "cat-gate",
    name: "Jorge Antunes — Caixilharia e Automatismos",
    phone: "+351 965 841 514",
  },
  // Electrician
  {
    id: "svc-bogdan",
    category_id: "cat-electrician",
    name: "Bogdan",
    details: "Speaks English, recommended by several dads",
    phone: "+351 916 365 608",
  },
  {
    id: "svc-miguel-elec",
    category_id: "cat-electrician",
    name: "Miguel",
    phone: "+351 916 528 897",
  },
  {
    id: "svc-laszlo",
    category_id: "cat-electrician",
    name: "Laszlo",
    phone: "+36 20 969 4744",
  },
  {
    id: "svc-joao-elec",
    category_id: "cat-electrician",
    name: "João Electronic",
    phone: "+351 927 532 530",
  },
  {
    id: "svc-sergio-ricardo",
    category_id: "cat-electrician",
    name: "Sergio Ricardo",
    phone: "+351 965 591 989",
  },
  // Painting
  {
    id: "svc-paulo-lopes",
    category_id: "cat-painting",
    name: "Paulo Lopes",
    phone: "+351 966 382 926",
  },
  {
    id: "svc-luis-ruca",
    category_id: "cat-painting",
    name: "Luís Ruca",
    details: "No English",
    phone: "+351 967 866 201",
  },
  {
    id: "svc-sergio-paint",
    category_id: "cat-painting",
    name: "Sergio Rodrigues",
    phone: "+351 960 008 931",
  },
  // Plumber
  {
    id: "svc-goncalo",
    category_id: "cat-plumber",
    name: "Gonçalo Bronpi Aquecimento",
    phone: "+351 965 298 808",
  },
  {
    id: "svc-fernando-plumb",
    category_id: "cat-plumber",
    name: "Fernando",
    phone: "+351 914 091 725",
  },
  {
    id: "svc-miha",
    category_id: "cat-plumber",
    name: "Miha Lavit",
    details: "English spoken",
    phone: "+351 962 371 768",
  },
  {
    id: "svc-nuno-canal",
    category_id: "cat-plumber",
    name: "Nuno Canalizador",
    phone: "+351 912 934 594",
  },
  {
    id: "svc-miguel-plumb",
    category_id: "cat-plumber",
    name: "Miguel",
    phone: "+351 916 528 897",
  },
  {
    id: "svc-les-plumb",
    category_id: "cat-plumber",
    name: "Les",
    details: "English speaking",
    phone: "+44 7943 501966",
  },
  // Cleaning
  {
    id: "svc-proclean",
    category_id: "cat-cleaning",
    name: "Proclean",
    url: "http://proclean.pt",
  },
  // Garden
  {
    id: "svc-terrum",
    category_id: "cat-garden",
    name: "Terrum Jardinagem — Rui",
    phone: "+351 936 027 031",
  },
  // Trees
  {
    id: "svc-joviplant",
    category_id: "cat-trees",
    name: "Joviplant",
    details: "Good for buying a lot of trees — much cheaper than local Ericeira prices.",
    phone: "+351 966 671 590",
  },
  // Gutter
  {
    id: "svc-supercaleiras",
    category_id: "cat-gutter",
    name: "Supercaleiras",
    url: "https://supercaleiras.com/",
  },
  // Insulation
  {
    id: "svc-isolaterm",
    category_id: "cat-insulation",
    name: "Isolaterm — Luís Matos",
    phone: "+351 926 200 945",
    email: "luis.matos@isolatermcaixilharia.pt",
    url: "https://isolaterm.pt/",
  },
  // Architect
  {
    id: "svc-nuno-nasc",
    category_id: "cat-architect",
    name: "Nuno Nascimento",
    details: "Rua Doutor Augusto Lamas 2A, 2760-152 Caxias",
    phone: "+351 916 400 528",
    email: "geral@nunonascimento.com",
    url: "https://www.nunonascimento.com/",
  },
  {
    id: "svc-luran",
    category_id: "cat-architect",
    name: "Luran — Soc. Projectos e Const. Lda",
    details: "Engenharia civil em Malveira — Travessa do Moinho Velho, n.º 1-A r/ch esq, 2665-252 Malveira",
    phone: "+351 21 986 2925",
  },
  {
    id: "svc-tiago-barros",
    category_id: "cat-architect",
    name: "Tiago Barros Studio",
    details: "Ericeira — Mafra",
    phone: "+351 932 412 600",
    email: "info@tiagobarros.pt",
    url: "https://www.tiagobarros.pt",
  },
  {
    id: "svc-archstudio",
    category_id: "cat-architect",
    name: "Arch Studio Ericeira",
    url: "https://archstudioericeira.com/en/",
  },
  {
    id: "svc-nocnoc",
    category_id: "cat-architect",
    name: "Noc Noc Studio",
    url: "https://www.nocnocstudio.com/index.php/en/contacts",
  },
  // Stones
  {
    id: "svc-mpsseixo",
    category_id: "cat-stones",
    name: "MPS Seixo",
    url: "https://www.mpsseixo.pt/",
  },
  {
    id: "svc-stone-gzq",
    category_id: "cat-stones",
    name: "Stone GZQ (countertop)",
    phone: "+351 219 671 187",
  },
  // Carpenter
  {
    id: "svc-brian-carp",
    category_id: "cat-carpenter",
    name: "Brian",
    details: "Recommended by Hamish",
    phone: "+31 6 13023741",
  },
  // Inspection
  {
    id: "svc-engi",
    category_id: "cat-inspection",
    name: "Engi Estates",
    url: "https://www.engiestates.com/",
  },
  {
    id: "svc-tj",
    category_id: "cat-inspection",
    name: "TJ Property Inspections",
    details: "Pro recommended and tested by group members",
    url: "https://www.tjpropertyinspections.com/",
  },
  {
    id: "svc-homly",
    category_id: "cat-inspection",
    name: "Homly",
    details: "Inspection",
    url: "https://homly.pt/",
  },
  {
    id: "svc-miguel-insp",
    category_id: "cat-inspection",
    name: "Miguel Rodrigues",
    phone: "+351 965 721 005",
  },
  // Chimney
  {
    id: "svc-chimney",
    category_id: "cat-chimney",
    name: "Chimney cleaning",
    phone: "+351 966 855 960",
  },
  // Garage
  {
    id: "svc-silverio",
    category_id: "cat-garage",
    name: "Silverio",
    phone: "+351 917 249 297",
  },
  {
    id: "svc-julio",
    category_id: "cat-garage",
    name: "Julio",
    phone: "+351 914 777 777",
  },
  // Shutter
  {
    id: "svc-fernando-martins",
    category_id: "cat-shutter",
    name: "Fernando Martins (Store)",
    phone: "+351 917 816 311",
  },
  // Windows
  {
    id: "svc-carmezim",
    category_id: "cat-windows",
    name: "Carlos Carmezim",
    details: "Great guy",
    phone: "+351 918 213 255",
  },
  {
    id: "svc-windoor",
    category_id: "cat-windows",
    name: "Windoor Lisboa",
    details: "PVC — recommendation from Corne van Dyk (replacement of existing doors/windows)",
    url: "https://www.windoorlisboa.pt/",
  },
  // Heating
  {
    id: "svc-goncalo-heat",
    category_id: "cat-heating",
    name: "Gonçalo Bronpi Aquecimento",
    phone: "+351 965 298 808",
  },
  // Solar
  {
    id: "svc-telmo-lopes",
    category_id: "cat-solar",
    name: "Telmo Lopes",
    details: "Solar Photovoltaic | HeatPumps | Solar Thermal",
    phone: "+351 919 267 176",
  },
  {
    id: "svc-les-solar",
    category_id: "cat-solar",
    name: "Les",
    details: "English speaking",
    phone: "+44 7943 501966",
  },
  // Taxi
  {
    id: "svc-alexandre",
    category_id: "cat-taxi",
    name: "Alexandre",
    details: "Uber, speaks English",
    phone: "+351 927 390 502",
  },
  {
    id: "svc-rui-taxi",
    category_id: "cat-taxi",
    name: "Rui",
    phone: "+351 912 528 563",
  },
  {
    id: "svc-eduardo",
    category_id: "cat-taxi",
    name: "Eduardo",
    phone: "+351 915 094 010",
  },
  {
    id: "svc-leonardo",
    category_id: "cat-taxi",
    name: "Leonardo",
    phone: "+351 967 328",
  },
  {
    id: "svc-lino",
    category_id: "cat-taxi",
    name: "Lino Transporte",
    phone: "+351 913 468 078",
  },
  {
    id: "svc-easy-transfer",
    category_id: "cat-taxi",
    name: "Easy Transfer Ericeira",
    phone: "+351 963 650 278",
  },
  // Beer
  {
    id: "svc-mean-sardine",
    category_id: "cat-beer",
    name: "Mean Sardine (Brewery)",
  },
  {
    id: "svc-5emeio",
    category_id: "cat-beer",
    name: "5 e meio — TapRoom",
  },
  // Restaurants
  { id: "svc-lagoa", category_id: "cat-restaurant", name: "Lagoa D'Ouro" },
  { id: "svc-costa-fria", category_id: "cat-restaurant", name: "Costa Fria" },
  { id: "svc-estrela", category_id: "cat-restaurant", name: "Estrela do Mar" },
  {
    id: "svc-furnas",
    category_id: "cat-restaurant",
    name: "Furnas",
    details: "Seafood",
  },
  {
    id: "svc-golfinho",
    category_id: "cat-restaurant",
    name: "Golfinho Azul",
    details: "São Lourenço beach",
  },
  {
    id: "svc-onegai",
    category_id: "cat-restaurant",
    name: "Onegai",
    details: "Sushi",
  },
  { id: "svc-ribas", category_id: "cat-restaurant", name: "Ribas" },
  {
    id: "svc-cucina",
    category_id: "cat-restaurant",
    name: "Cucina 37",
    details: "Italian",
  },
  {
    id: "svc-kau",
    category_id: "cat-restaurant",
    name: "Kau Barbecue",
    details: "Best ribs or grilled meat around",
    url: "https://www.instagram.com/kau_barbecue",
  },
  // Wine
  {
    id: "svc-telmo-wine",
    category_id: "cat-wine",
    name: "Telmo — Garrafeira Terroir",
    details: "Natural, Low Intervention and Organic Wines — private wine tastings at your home",
    phone: "+351 916 353 911",
    url: "https://www.garrafeiraterroir.pt/",
  },
  // Bread
  { id: "svc-terco", category_id: "cat-bread", name: "Terço do Meio" },
  // Butcher
  {
    id: "svc-placido",
    category_id: "cat-butcher",
    name: "Talho Placido",
    details: "EM550 58, 2655-405 Lisboa — order via WhatsApp",
  },
  {
    id: "svc-mario-joao",
    category_id: "cat-butcher",
    name: "Talho do Mário João",
    details: "Av. Primeiro de Maio 13, 2640-474 Mafra",
  },
  {
    id: "svc-worldprime",
    category_id: "cat-butcher",
    name: "World Prime Beef",
    url: "https://worldprimebeef.pt",
  },
  {
    id: "svc-carnederva",
    category_id: "cat-butcher",
    name: "Carne de Rva",
    url: "https://carnederva.pt",
  },
  {
    id: "svc-tomo",
    category_id: "cat-butcher",
    name: "Tomo Demaria",
    details: "Best Argentinean beef",
    phone: "+351 938 694 390",
  },
  {
    id: "svc-talho-central",
    category_id: "cat-butcher",
    name: "Talho Central da Ericeira",
    details: "Largo dos Condes da Ericeira nº14 A",
  },
  // Chiro
  {
    id: "svc-pure",
    category_id: "cat-chiro",
    name: "Pure Lifestyle Chiropractic",
    details: "Mafra",
    phone: "+351 965 458 330",
  },
  {
    id: "svc-bargiela",
    category_id: "cat-chiro",
    name: "Ricardo Bargiela",
    details: "Ericeira",
    phone: "+351 916 476 006",
  },
  {
    id: "svc-lencastre",
    category_id: "cat-chiro",
    name: "Carlos Lencastre — Quiroprática Oriental Integrativa",
    details: "One World Business Building, Largo dos Pocinhos 2, Gabinete 320, 2655-333 Ericeira",
    url: "https://www.carloslencastre.pt/agendamento/",
  },
  {
    id: "svc-prehab",
    category_id: "cat-chiro",
    name: "Laurie — Prehab Lab",
    details:
      "Medically recommended soft tissue therapy / mobility programming / personal training for performance & injury management. Sobreiro 2640-817",
    phone: "+351 911 888 613",
    email: "prehab.ericeira@gmail.com",
    url: "https://www.prehablab.com",
  },
  {
    id: "svc-fisio",
    category_id: "cat-chiro",
    name: "Joao @ Fisiocorporation",
    url: "http://fisiocorporation.com.pt/",
  },
  {
    id: "svc-joana",
    category_id: "cat-chiro",
    name: "Joana Miranda",
    details: "Mafra",
    phone: "+351 916 249 549",
  },
  {
    id: "svc-gabriela",
    category_id: "cat-chiro",
    name: "Gabriela Elisabeth Lenerz — Osteopathy",
    phone: "+351 961 285 228",
  },
  {
    id: "svc-dale",
    category_id: "cat-chiro",
    name: "Dale Wallington — Personal Training",
    phone: "+351 920 074 481",
  },
  // Nurse
  {
    id: "svc-benedita",
    category_id: "cat-nurse",
    name: "Enfermeira Benedita",
    details: "Home nursing services / Serviços de Enfermagem ao Domicílio",
    phone: "+351 925 752 994",
  },
  // Newborn
  {
    id: "svc-civil-mafra",
    category_id: "cat-newborn",
    name: "IRN Civil Mafra",
    details:
      "Email completed forms here. Appointment ~2 weeks. Birth certs Short/Full/Multilingual.",
    email: "civil.mafra@irn.mj.pt",
  },
  // Beekeeping
  {
    id: "svc-beekeeper",
    category_id: "cat-beekeeping",
    name: "Local beekeeper",
    details:
      "Pollination services for fruit trees in Ericeira/Mafra area. Also collects swarms from unwanted places.",
    phone: "+351 913 901 318",
  },
  // Derm
  {
    id: "svc-derm-lisbon",
    category_id: "cat-derm",
    name: "Dermatologist — Lisbon",
    phone: "+351 21 163 3439",
  },
  // Dentist
  {
    id: "svc-pobral",
    category_id: "cat-dentist",
    name: "Clínica do Pobral",
    phone: "+351 21 961 2000",
  },
  {
    id: "svc-real-clinica",
    category_id: "cat-dentist",
    name: "Real Clínica Mafra",
    phone: "+351 261 786 363",
  },
  // IT
  {
    id: "svc-poetik",
    category_id: "cat-it",
    name: "Poetik Penguin — Marco Garcês",
    details: "Networks, Domotics, Servers, System Administration — local company",
    url: "https://poetikpenguin.com",
  },
  // Repair
  {
    id: "svc-iservices",
    category_id: "cat-repair",
    name: "iServices Marina de Cascais",
    phone: "+351 21 012 5750",
  },
  {
    id: "svc-ifixit",
    category_id: "cat-repair",
    name: "iFixit",
    url: "https://ifixit.com",
  },
  // Cheap
  {
    id: "svc-pcsintra",
    category_id: "cat-cheap",
    name: "PCSintra Informática e Serviços",
  },
  // Shirts
  {
    id: "svc-shirts",
    category_id: "cat-shirts",
    name: "Shirt printing",
    phone: "+351 965 859 325",
  },
  // Cowork / cafés
  {
    id: "svc-selina",
    category_id: "cat-cowork",
    name: "Selina",
    details: "City center — nice terrace",
  },
  {
    id: "svc-brunch",
    category_id: "cat-cowork",
    name: "Brunch Me",
    details: "Nice café",
  },
  {
    id: "svc-balagan",
    category_id: "cat-cowork",
    name: "Balagan",
    details: "Praia do Sul — often crowded",
  },
  {
    id: "svc-barbatana",
    category_id: "cat-cowork",
    name: "Barbatana",
    details: "Foz do Lisandro",
  },
  {
    id: "svc-vilagale",
    category_id: "cat-cowork",
    name: "Hotel Vila Galé",
    details: "So quiet",
  },
  {
    id: "svc-58",
    category_id: "cat-cowork",
    name: "58 / Boardriders",
  },
  {
    id: "svc-organic",
    category_id: "cat-cowork",
    name: "The Organic Way",
  },
  {
    id: "svc-intermarche",
    category_id: "cat-cowork",
    name: "Intermarché (1st floor)",
    details: "Not the sexiest but always has room and quiet. Opens early.",
  },
  {
    id: "svc-the-base",
    category_id: "cat-cowork",
    name: "The Base — Ericeira",
    details: "Cowork",
  },
  {
    id: "svc-coastal",
    category_id: "cat-cowork",
    name: "Coastal Cowork",
    details: "R. de São Félix 12e, 2655-362 Ericeira",
  },
  {
    id: "svc-salt",
    category_id: "cat-cowork",
    name: "The Salt Studio",
    details: "Tv. do Jogo da Bola 1, 2655-297 Ericeira",
  },
  // Taxes
  {
    id: "svc-taxes-pt",
    category_id: "cat-taxes",
    name: "Taxes in Portugal",
    url: "http://taxesinportugal.com",
  },
  {
    id: "svc-ferretti",
    category_id: "cat-taxes",
    name: "Fernando Ferretti",
    details: "Corporate law — recommended by Samuel",
    phone: "+351 931 130 146",
  },
  {
    id: "svc-carla",
    category_id: "cat-taxes",
    name: "Carla Cardoso",
    details: "Recommended by Corne",
    phone: "+351 914 820 248",
  },
  {
    id: "svc-fresh",
    category_id: "cat-taxes",
    name: "Fresh Portugal",
    details: "Recommended by Brian",
    url: "https://fresh-portugal.com",
  },
  {
    id: "svc-miriam",
    category_id: "cat-taxes",
    name: "Miriam Fridman",
    details: "Recommended by Juda",
    phone: "+351 935 622 806",
  },
  {
    id: "svc-lvp",
    category_id: "cat-taxes",
    name: "LVP Advogados",
    url: "https://www.lvpadvogados.com/",
  },
  // Photo
  {
    id: "svc-johnny",
    category_id: "cat-photo",
    name: "Johnny",
    phone: "+351 912 060 888",
  },
  // Kids
  {
    id: "svc-fejao",
    category_id: "cat-kids",
    name: "Feijão Verde (Sintra)",
    details: "All ages",
    url: "https://maps.app.goo.gl/iEVWj8Ph7cEy3TmC9",
  },
  {
    id: "svc-upup",
    category_id: "cat-kids",
    name: "Up Up Trampoline (Sintra)",
    url: "https://maps.app.goo.gl/FVAsNU2pNyMvT4ZR8",
  },
  {
    id: "svc-kidzania",
    category_id: "cat-kids",
    name: "Kidzania (UBBO)",
    details: "Pricey but nice — all ages",
  },
  {
    id: "svc-jumpyard",
    category_id: "cat-kids",
    name: "Jump Yard (Lisboa)",
    url: "https://maps.app.goo.gl/u1PE9Hqdn7f911tY7",
  },
  {
    id: "svc-ninja",
    category_id: "cat-kids",
    name: "Ninja Factory",
    url: "https://maps.app.goo.gl/tS7E2FXyMJaDcypQ6",
  },
  {
    id: "svc-quantum-sintra",
    category_id: "cat-kids",
    name: "Quantum Park (Sintra)",
    details: "All ages",
    url: "https://maps.app.goo.gl/jjXwSww4SWqpeafLA",
  },
  {
    id: "svc-quantum-almada",
    category_id: "cat-kids",
    name: "Quantum Park (Almada)",
    url: "https://maps.app.goo.gl/CvmHHsof8RDYQx57A",
  },
  {
    id: "svc-parkour",
    category_id: "cat-kids",
    name: "Parkour Alfragide",
    details: ">10yrs old",
    url: "https://maps.app.goo.gl/nuJCz2gFw4pGqcfG8",
  },
  {
    id: "svc-urban-park",
    category_id: "cat-kids",
    name: "Urban Park Ericeira",
    details: "Jump before 5pm — closest option",
  },
  {
    id: "svc-boulder",
    category_id: "cat-kids",
    name: "Ericeira Boulder",
    details: "Climbing — closest option in Ericeira",
  },
];

export function seedDatabase(db: Database.Database) {
  const insertCat = db.prepare(
    `INSERT INTO categories (id, name, slug, description, icon, sort_order)
     VALUES (@id, @name, @slug, @description, @icon, @sort_order)`
  );
  const insertSvc = db.prepare(
    `INSERT INTO services (id, category_id, name, details, phone, email, url, votes, status, created_at, proposed_by)
     VALUES (@id, @category_id, @name, @details, @phone, @email, @url, 0, 'approved', @created_at, '')`
  );

  const now = new Date().toISOString();
  const tx = db.transaction(() => {
    for (const c of categories) insertCat.run(c);
    for (const s of services) {
      insertSvc.run({
        id: s.id,
        category_id: s.category_id,
        name: s.name,
        details: s.details || "",
        phone: s.phone || "",
        email: s.email || "",
        url: s.url || "",
        created_at: now,
      });
    }
  });
  tx();
}
