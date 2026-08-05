import type Database from "better-sqlite3";
import {
  CATEGORY_REMAP,
  OPTIMIZED_CATEGORIES,
} from "./category-restructure";
import { SPECIALTY_BY_SERVICE_ID } from "./specialty-enrichment";

type SeedService = {
  id: string;
  category_id: string;
  name: string;
  details?: string;
  address?: string;
  phone?: string;
  email?: string;
  url?: string;
};

/** Legacy category ids on services are remapped via CATEGORY_REMAP on seed. */
const categories = OPTIMIZED_CATEGORIES;

const services: SeedService[] = [
  // Moving
  {
    id: "svc-andre-mudancas",
    category_id: "cat-moving",
    name: "André Mudanças",
    details:
      "Local mover / transport for Ericeira & Mafra (Google: ASTransportes, Santo Isidoro).",
    address: "R. Lugar do Canto 4, 2640-064 Santo Isidoro, Portugal",
    phone: "+351 965 670 870",
    url: "http://usadosembomestado.pt/",
  },
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
    address: "Estrada da Cabeça Alta 6, Pinhal dos Frades, Portugal",
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
  {
    id: "svc-hf-henrique-ferreira",
    category_id: "cat-mechanic",
    name: "HF Henrique Ferreira — Peças Auto",
    details: "Auto parts & accessories — Ericeira branch (also Malveira).",
    address: "N247 5, 2655-368 Ericeira, Portugal",
    phone: "+351 261 866 039",
    url: "https://maps.app.goo.gl/vx8tMHyrFd8ekiBy8",
  },
  {
    id: "svc-time-for-detail",
    category_id: "cat-mechanic",
    name: "Duarte — Time For Detail",
    details: "Mobile car wash & detailing — comes to your home.",
    phone: "+351 913 708 092",
    email: "info@timefordetail.pt",
    url: "https://www.timefordetail.pt",
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
    address: "Madeiras Ascenso, Achada, Portugal",
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
    address:
      "Rua Fernando Vicente 12, Zona Industrial de Arenes, 2560-677 Torres Vedras, Portugal",
    url: "https://lourosmad.pt/",
  },
  {
    id: "svc-jotalves",
    category_id: "cat-wood-delivery",
    name: "Jotalves, Carpintaria E Móveis, Lda.",
    address: "Jotalves Carpintaria e Móveis, Encarnação, Portugal",
  },
  {
    id: "svc-sobreira",
    category_id: "cat-wood-delivery",
    name: "Sobreira & Serras, S.A.",
    address: "Alto do Ulmeiro, 2635-565 Rio de Mouro, Portugal",
  },
  // Gate
  {
    id: "svc-sebastec",
    category_id: "cat-gate",
    name: "Sebastec — Portas Automáticas, Lda",
    address: "Sebastec Portas Automáticas, Portugal",
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
    address: "Rua Doutor Augusto Lamas 2A, 2760-152 Caxias, Portugal",
    phone: "+351 916 400 528",
    email: "geral@nunonascimento.com",
    url: "https://www.nunonascimento.com/",
  },
  {
    id: "svc-luran",
    category_id: "cat-architect",
    name: "Luran — Soc. Projectos e Const. Lda",
    details: "Engenharia civil em Malveira",
    address:
      "Travessa do Moinho Velho 1-A, r/c esquerdo, 2665-252 Malveira, Portugal",
    phone: "+351 21 986 2925",
  },
  {
    id: "svc-tiago-barros",
    category_id: "cat-architect",
    name: "Tiago Barros Studio",
    details: "Ericeira — Mafra",
    address: "Tiago Barros Studio, Ericeira, Portugal",
    phone: "+351 932 412 600",
    email: "info@tiagobarros.pt",
    url: "https://www.tiagobarros.pt",
  },
  {
    id: "svc-archstudio",
    category_id: "cat-architect",
    name: "Arch Studio Ericeira",
    address: "Arch Studio Ericeira, Ericeira, Portugal",
    url: "https://archstudioericeira.com/en/",
  },
  {
    id: "svc-nocnoc",
    category_id: "cat-architect",
    name: "Noc Noc Studio",
    address: "Noc Noc Studio, Ericeira, Portugal",
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
    name: "Alexandre Airport Transfer",
    details:
      "Alex — super reliable Tesla airport transfers. Speaks English. ~€40 airport run (Ubers ~€35; the extra €5 is worth it). Meets you inside the terminal; give him your flight number and he tracks delays.",
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
    address: "Mean Sardine, Ericeira, Portugal",
  },
  {
    id: "svc-5emeio",
    category_id: "cat-beer",
    name: "5 e meio — TapRoom",
    address: "5 e meio TapRoom, Ericeira, Portugal",
  },
  // Restaurants
  {
    id: "svc-lagoa",
    category_id: "cat-restaurant",
    name: "Lagoa D'Ouro",
    address: "Lagoa D'Ouro, Ericeira, Portugal",
  },
  {
    id: "svc-costa-fria",
    category_id: "cat-restaurant",
    name: "Costa Fria",
    address: "Costa Fria, Ericeira, Portugal",
  },
  {
    id: "svc-estrela",
    category_id: "cat-restaurant",
    name: "Estrela do Mar",
    address: "Estrela do Mar, Ericeira, Portugal",
  },
  {
    id: "svc-furnas",
    category_id: "cat-restaurant",
    name: "Furnas",
    details: "Seafood",
    address: "Furnas, Ericeira, Portugal",
  },
  {
    id: "svc-golfinho",
    category_id: "cat-restaurant",
    name: "Golfinho Azul",
    details: "São Lourenço beach",
    address: "Golfinho Azul, Praia de São Lourenço, Ericeira, Portugal",
  },
  {
    id: "svc-onegai",
    category_id: "cat-restaurant",
    name: "Onegai",
    details: "Sushi",
    address: "Onegai Sushi, Ericeira, Portugal",
  },
  {
    id: "svc-ribas",
    category_id: "cat-restaurant",
    name: "Ribas",
    address: "Ribas, Ericeira, Portugal",
  },
  {
    id: "svc-cucina",
    category_id: "cat-restaurant",
    name: "Cucina 37",
    details: "Italian",
    address: "Cucina 37, Ericeira, Portugal",
  },
  {
    id: "svc-kau",
    category_id: "cat-restaurant",
    name: "Kau Barbecue",
    details: "Best ribs or grilled meat around",
    address: "Kau Barbecue, Ericeira, Portugal",
    url: "https://www.instagram.com/kau_barbecue",
  },
  // Wine
  {
    id: "svc-telmo-wine",
    category_id: "cat-wine",
    name: "Telmo — Garrafeira Terroir",
    details:
      "Natural, Low Intervention and Organic Wines — private wine tastings at your home",
    address: "Garrafeira Terroir, Portugal",
    phone: "+351 916 353 911",
    url: "https://www.garrafeiraterroir.pt/",
  },
  // Bread
  {
    id: "svc-terco",
    category_id: "cat-bread",
    name: "Terço do Meio",
    address: "Terço do Meio, Ericeira, Portugal",
  },
  // Butcher
  {
    id: "svc-placido",
    category_id: "cat-butcher",
    name: "Talho Placido",
    details: "Order via WhatsApp",
    address: "EM550 58, 2655-405 Lisboa, Portugal",
  },
  {
    id: "svc-mario-joao",
    category_id: "cat-butcher",
    name: "Talho do Mário João",
    address: "Av. Primeiro de Maio 13, 2640-474 Mafra, Portugal",
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
    address: "Largo dos Condes da Ericeira 14A, Ericeira, Portugal",
  },
  // Chiro
  {
    id: "svc-pure",
    category_id: "cat-chiro",
    name: "Pure Lifestyle Chiropractic",
    details: "Mafra",
    address: "Pure Lifestyle Chiropractic, Mafra, Portugal",
    phone: "+351 965 458 330",
  },
  {
    id: "svc-bargiela",
    category_id: "cat-chiro",
    name: "Ricardo Bargiela",
    details: "Ericeira",
    address: "Ricardo Bargiela Quiroprática, Ericeira, Portugal",
    phone: "+351 916 476 006",
  },
  {
    id: "svc-lencastre",
    category_id: "cat-chiro",
    name: "Carlos Lencastre — Quiroprática Oriental Integrativa",
    address:
      "One World Business Building, Largo dos Pocinhos 2, Gabinete 320, 2655-333 Ericeira, Portugal",
    url: "https://www.carloslencastre.pt/agendamento/",
  },
  {
    id: "svc-prehab",
    category_id: "cat-chiro",
    name: "Laurie — Prehab Lab",
    details:
      "Medically recommended soft tissue therapy / mobility programming / personal training for performance & injury management.",
    address: "Sobreiro, 2640-817, Portugal",
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
  {
    id: "svc-diogo-apicultor",
    category_id: "cat-beekeeping",
    name: "Diogo Apicultor",
    details:
      "Beekeeper — pollination & swarm help. Also tree cutting / pruning (coupe d'arbres). Comes to you.",
    phone: "+351 967 253 780",
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
    address: "Clínica do Pobral, Portugal",
    phone: "+351 21 961 2000",
  },
  {
    id: "svc-real-clinica",
    category_id: "cat-dentist",
    name: "Real Clínica Mafra",
    address: "Real Clínica, Mafra, Portugal",
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
    address: "iServices, Marina de Cascais, Cascais, Portugal",
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
    address: "Selina Ericeira, Ericeira, Portugal",
  },
  {
    id: "svc-brunch",
    category_id: "cat-cowork",
    name: "Brunch Me",
    details: "Nice café",
    address: "Brunch Me, Ericeira, Portugal",
  },
  {
    id: "svc-balagan",
    category_id: "cat-cowork",
    name: "Balagan",
    details: "Praia do Sul — often crowded",
    address: "Balagan, Praia do Sul, Ericeira, Portugal",
  },
  {
    id: "svc-barbatana",
    category_id: "cat-cowork",
    name: "Barbatana",
    details: "Foz do Lisandro",
    address: "Barbatana, Foz do Lizandro, Ericeira, Portugal",
  },
  {
    id: "svc-vilagale",
    category_id: "cat-cowork",
    name: "Hotel Vila Galé",
    details: "So quiet",
    address: "Hotel Vila Galé Ericeira, Ericeira, Portugal",
  },
  {
    id: "svc-58-surf",
    category_id: "cat-cowork",
    name: "58 Surf",
    details:
      "Flagship surf shop (Billabong / 58) — retail, not a café. Same block as Boardriders.",
    address: "Av. São Sebastião 36B, 2655-483 Ericeira, Portugal",
    phone: "+351 261 860 900",
    url: "https://58surf.com/",
  },
  {
    id: "svc-boardriders",
    category_id: "cat-cowork",
    name: "Boardriders Quiksilver",
    details:
      "Surf shop + café — coffee spot next door to 58 Surf (36A).",
    address: "Av. São Sebastião 36A, 2655-319 Ericeira, Portugal",
    phone: "+351 261 867 046",
  },
  {
    id: "svc-organic",
    category_id: "cat-cowork",
    name: "The Organic Way",
    address: "The Organic Way, Ericeira, Portugal",
  },
  {
    id: "svc-intermarche",
    category_id: "cat-cowork",
    name: "Intermarché (1st floor)",
    details: "Not the sexiest but always has room and quiet. Opens early.",
    address: "Intermarché Ericeira, Ericeira, Portugal",
  },
  {
    id: "svc-the-base",
    category_id: "cat-cowork",
    name: "The Base — Ericeira",
    details: "Cowork",
    address: "The Base Cowork, Ericeira, Portugal",
  },
  {
    id: "svc-coastal",
    category_id: "cat-cowork",
    name: "Coastal Cowork",
    address: "Rua de São Félix 12e, 2655-362 Ericeira, Portugal",
  },
  {
    id: "svc-salt",
    category_id: "cat-cowork",
    name: "The Salt Studio",
    address: "Travessa do Jogo da Bola 1, 2655-297 Ericeira, Portugal",
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
    address: "Av. Dr. Luís Sá 4, 2710-089 Sintra, Portugal",
    url: "https://maps.app.goo.gl/iEVWj8Ph7cEy3TmC9",
  },
  {
    id: "svc-upup",
    category_id: "cat-kids",
    name: "Up Up Trampoline (Sintra)",
    address: "Av. de Santa Isabel 5, EN 249-4, 2635-047 Rio de Mouro, Portugal",
    url: "https://maps.app.goo.gl/FVAsNU2pNyMvT4ZR8",
  },
  {
    id: "svc-kidzania",
    category_id: "cat-kids",
    name: "Kidzania (UBBO)",
    details: "Pricey but nice — all ages",
    address: "UBBO, Amadora, Portugal",
  },
  {
    id: "svc-jumpyard",
    category_id: "cat-kids",
    name: "Jump Yard (Lisboa)",
    address: "Av. dos Cavaleiros 35, 2790-046 Carnaxide, Portugal",
    url: "https://maps.app.goo.gl/u1PE9Hqdn7f911tY7",
  },
  {
    id: "svc-ninja",
    category_id: "cat-kids",
    name: "Ninja Factory",
    address: "R. do Entreposto Industrial 15, 2610-135 Amadora, Portugal",
    url: "https://maps.app.goo.gl/tS7E2FXyMJaDcypQ6",
  },
  {
    id: "svc-quantum-sintra",
    category_id: "cat-kids",
    name: "Quantum Park (Sintra)",
    details: "All ages",
    address: "Quantum Park, Sintra, Portugal",
    url: "https://maps.app.goo.gl/jjXwSww4SWqpeafLA",
  },
  {
    id: "svc-quantum-almada",
    category_id: "cat-kids",
    name: "Quantum Park (Almada)",
    address: "Quantum Park, Almada, Portugal",
    url: "https://maps.app.goo.gl/CvmHHsof8RDYQx57A",
  },
  {
    id: "svc-parkour",
    category_id: "cat-kids",
    name: "Parkour Alfragide",
    details: ">10yrs old",
    address: "R. do Entreposto Industrial 15, 2610-135 Amadora, Portugal",
    url: "https://maps.app.goo.gl/nuJCz2gFw4pGqcfG8",
  },
  {
    id: "svc-urban-park",
    category_id: "cat-kids",
    name: "Urban Park Ericeira",
    details: "Jump before 5pm — closest option",
    address: "Urban Park Ericeira, Ericeira, Portugal",
  },
  {
    id: "svc-boulder",
    category_id: "cat-kids",
    name: "Ericeira Boulder",
    details: "Climbing — closest option in Ericeira",
    address: "Ericeira Boulder, Ericeira, Portugal",
  },
];

export function seedDatabase(db: Database.Database) {
  const insertCat = db.prepare(
    `INSERT INTO categories (id, name, slug, description, icon, sort_order)
     VALUES (@id, @name, @slug, @description, @icon, @sort_order)`
  );
  const insertSvc = db.prepare(
    `INSERT INTO services (id, category_id, name, details, address, phone, email, url, kind, steps, specialty, votes, status, created_at, proposed_by)
     VALUES (@id, @category_id, @name, @details, @address, @phone, @email, @url, 'contact', '', @specialty, 0, 'approved', @created_at, '')`
  );

  const now = new Date().toISOString();
  const tx = db.transaction(() => {
    for (const c of categories) insertCat.run(c);
    for (const s of services) {
      insertSvc.run({
        id: s.id,
        category_id: CATEGORY_REMAP[s.category_id] || s.category_id,
        name: s.name,
        details: s.details || "",
        address: s.address || "",
        phone: s.phone || "",
        email: s.email || "",
        url: s.url || "",
        specialty: SPECIALTY_BY_SERVICE_ID[s.id] || "",
        created_at: now,
      });
    }
  });
  tx();
}

/** Backfill / refresh Maps-ready addresses on existing databases. */
export function enrichServiceAddresses(db: Database.Database) {
  const update = db.prepare(
    `UPDATE services SET address = ? WHERE id = ? AND (address IS NULL OR address = '' OR address != ?)`
  );
  const tx = db.transaction(() => {
    for (const s of services) {
      if (!s.address) continue;
      update.run(s.address, s.id, s.address);
    }
  });
  tx();
}
