/**
 * Product catalogue.
 *
 * Edit freely: names, origins, grades, packaging and MOQ are plain strings.
 * Fields marked `confirm: true` hold typical Indian trade values (common
 * growing regions and standard grade names) that should be checked with the
 * business before launch. MOQ defaults to "On request" everywhere.
 *
 * `accent` is the colour of the spice itself and drives the particles,
 * heaps and detail-page tint. `ink` is a darker version of it that passes
 * AA contrast as text on the cream background.
 */

export type Category = "spice" | "pulse";

/** Silhouette the particle layer forms on the product page. */
export type Silhouette =
  | "peppercorns"
  | "finger"
  | "chilli"
  | "pod"
  | "round-seeds"
  | "long-seeds"
  | "clove"
  | "quill"
  | "lentils";

export type Product = {
  slug: string;
  name: string;
  /** Common names buyers search for */
  alsoKnownAs: string[];
  botanical: string;
  category: Category;
  accent: string;
  ink: string;
  silhouette: Silhouette;
  /** One restrained line for lists and meta descriptions */
  summary: string;
  colour: string;
  aroma: string[];
  origin: string[];
  forms: string[];
  grades: string[];
  packaging: string[];
  moq: string;
  hsCode?: string;
  /** Values that still need the business to confirm */
  confirm: boolean;
};

const SPICE_PACKING = [
  "25 kg PP woven bags",
  "50 kg PP woven bags",
  "25 kg jute bags",
  "Custom or private-label packing on request",
];

const PULSE_PACKING = [
  "25 kg PP bags",
  "50 kg PP bags",
  "Jute bags",
  "Custom or private-label packing on request",
];

const ON_REQUEST = "On request";

export const products: Product[] = [
  {
    slug: "black-pepper",
    name: "Black Pepper",
    alsoKnownAs: ["Milagu", "Kali mirch"],
    botanical: "Piper nigrum",
    category: "spice",
    accent: "#2B2420",
    ink: "#2B2420",
    silhouette: "peppercorns",
    summary: "Whole Malabar and Tellicherry-type peppercorns, sun-dried from green to black.",
    colour: "Black to deep brown, wrinkled skin",
    aroma: ["Pungent", "Woody", "Pine resin", "Lingering warmth"],
    origin: ["Kerala (Wayanad, Idukki)", "Karnataka (Kodagu)"],
    forms: ["Whole", "Crushed", "Powder"],
    grades: ["MG1", "TGSEB", "500 g/l", "550 g/l", "570 g/l"],
    packaging: SPICE_PACKING,
    moq: ON_REQUEST,
    confirm: true,
  },
  {
    slug: "turmeric",
    name: "Turmeric",
    alsoKnownAs: ["Manjal", "Haldi"],
    botanical: "Curcuma longa",
    category: "spice",
    accent: "#E3A21A",
    ink: "#8C5A00",
    silhouette: "finger",
    summary: "Boiled, dried and polished fingers and bulbs, or ground to specification.",
    colour: "Deep orange-yellow",
    aroma: ["Earthy", "Warm", "Gingery", "Bitter edge"],
    origin: ["Tamil Nadu (Erode, Salem)", "Telangana (Nizamabad)", "Maharashtra (Sangli)"],
    forms: ["Whole fingers", "Bulbs", "Powder"],
    grades: ["Finger", "Bulb", "Salem type", "Erode type", "Curcumin to buyer spec"],
    packaging: SPICE_PACKING,
    moq: ON_REQUEST,
    confirm: true,
  },
  {
    slug: "red-chilli",
    name: "Red Chilli",
    alsoKnownAs: ["Milagai", "Lal mirch"],
    botanical: "Capsicum annuum",
    category: "spice",
    accent: "#B3201B",
    ink: "#A11C18",
    silhouette: "chilli",
    summary: "Dried whole chillies with or without stem, flakes and powder across heat levels.",
    colour: "Bright to deep red",
    aroma: ["Fruity", "Smoky", "Sharp heat"],
    origin: ["Andhra Pradesh (Guntur)", "Karnataka (Byadgi)", "Tamil Nadu (Ramanathapuram)"],
    forms: ["Whole with stem", "Stemless", "Flakes", "Powder"],
    grades: ["Teja S17", "Sannam S4 (334)", "Byadgi", "Wrinkle 273", "Ramnad Mundu"],
    packaging: SPICE_PACKING,
    moq: ON_REQUEST,
    confirm: true,
  },
  {
    slug: "cardamom",
    name: "Green Cardamom",
    alsoKnownAs: ["Elakkai", "Elaichi"],
    botanical: "Elettaria cardamomum",
    category: "spice",
    accent: "#7C8F48",
    ink: "#4F5E27",
    silhouette: "pod",
    summary: "Whole green pods graded by size, from the cardamom hills of the Western Ghats.",
    colour: "Bright green, ribbed pods",
    aroma: ["Camphor", "Citrus", "Eucalyptus", "Sweet"],
    origin: ["Kerala (Idukki)", "Tamil Nadu (Bodinayakanur)"],
    forms: ["Whole pods", "Seeds"],
    grades: ["8 mm bold", "AGEB (7 mm+)", "AGB (6–7 mm)", "AGS"],
    packaging: ["Cartons with poly liner", "Custom or private-label packing on request"],
    moq: ON_REQUEST,
    confirm: true,
  },
  {
    slug: "coriander-seeds",
    name: "Coriander Seeds",
    alsoKnownAs: ["Kothamalli vidhai", "Dhania"],
    botanical: "Coriandrum sativum",
    category: "spice",
    accent: "#B99459",
    ink: "#7A5A26",
    silhouette: "round-seeds",
    summary: "Whole and split coriander, machine-cleaned or sortexed.",
    colour: "Straw to greenish-tan",
    aroma: ["Citrus peel", "Floral", "Nutty warmth"],
    origin: ["Rajasthan (Kota, Ramganj Mandi)", "Madhya Pradesh", "Gujarat"],
    forms: ["Whole", "Split", "Powder"],
    grades: ["Eagle", "Scooter", "Badami", "Machine-cleaned", "Sortex"],
    packaging: SPICE_PACKING,
    moq: ON_REQUEST,
    confirm: true,
  },
  {
    slug: "cumin",
    name: "Cumin",
    alsoKnownAs: ["Jeeragam", "Jeera"],
    botanical: "Cuminum cyminum",
    category: "spice",
    accent: "#8A6A45",
    ink: "#6B4E2C",
    silhouette: "long-seeds",
    summary: "Whole cumin cleaned to the purity your market expects.",
    colour: "Grey-brown, ridged seeds",
    aroma: ["Earthy", "Nutty", "Warm", "Slightly bitter"],
    origin: ["Gujarat (Unjha)", "Rajasthan"],
    forms: ["Whole", "Powder"],
    grades: ["Singapore quality", "Europe quality", "99% purity", "98% purity"],
    packaging: SPICE_PACKING,
    moq: ON_REQUEST,
    confirm: true,
  },
  {
    slug: "fenugreek",
    name: "Fenugreek",
    alsoKnownAs: ["Vendhayam", "Methi"],
    botanical: "Trigonella foenum-graecum",
    category: "spice",
    accent: "#C9A13B",
    ink: "#7D6012",
    silhouette: "round-seeds",
    summary: "Hard, angular golden seeds, machine-cleaned or sortexed.",
    colour: "Golden-amber",
    aroma: ["Maple-like", "Bitter", "Celery", "Toasted"],
    origin: ["Rajasthan", "Madhya Pradesh", "Gujarat"],
    forms: ["Whole", "Powder"],
    grades: ["Machine-cleaned", "Sortex 99%"],
    packaging: SPICE_PACKING,
    moq: ON_REQUEST,
    confirm: true,
  },
  {
    slug: "mustard-seeds",
    name: "Mustard Seeds",
    alsoKnownAs: ["Kadugu", "Rai"],
    botanical: "Brassica juncea",
    category: "spice",
    accent: "#5E3F26",
    ink: "#5E3F26",
    silhouette: "round-seeds",
    summary: "Small and bold brown-black seeds, plus yellow on request.",
    colour: "Reddish-brown to black",
    aroma: ["Sharp", "Nutty when tempered", "Pungent"],
    origin: ["Rajasthan", "Madhya Pradesh", "Haryana"],
    forms: ["Whole", "Split"],
    grades: ["Small", "Bold", "Yellow (on request)", "Sortex"],
    packaging: SPICE_PACKING,
    moq: ON_REQUEST,
    confirm: true,
  },
  {
    slug: "cloves",
    name: "Cloves",
    alsoKnownAs: ["Kirambu", "Laung"],
    botanical: "Syzygium aromaticum",
    category: "spice",
    accent: "#5B3424",
    ink: "#5B3424",
    silhouette: "clove",
    summary: "Hand-picked dried flower buds with heads intact.",
    colour: "Dark reddish-brown",
    aroma: ["Sweet", "Numbing", "Warm", "Medicinal"],
    origin: ["Tamil Nadu (Kanyakumari, Nilgiris)", "Kerala"],
    forms: ["Whole", "Powder"],
    grades: ["Hand-picked", "Headless (on request)"],
    packaging: SPICE_PACKING,
    moq: ON_REQUEST,
    confirm: true,
  },
  {
    slug: "cinnamon",
    name: "Cinnamon",
    alsoKnownAs: ["Pattai", "Dalchini"],
    botanical: "Cinnamomum verum",
    category: "spice",
    accent: "#9A5A2F",
    ink: "#7E4521",
    silhouette: "quill",
    summary: "Thin-bark quills, quillings and pieces.",
    colour: "Light tan to warm brown",
    aroma: ["Sweet", "Woody", "Delicate", "Citrus hint"],
    origin: ["Kerala", "Other origins on request"],
    forms: ["Quills", "Quillings", "Pieces", "Powder"],
    grades: ["Quills", "Quillings", "Broken pieces"],
    packaging: ["Cartons with poly liner", ...SPICE_PACKING],
    moq: ON_REQUEST,
    confirm: true,
  },
  {
    slug: "toor-dal",
    name: "Toor Dal",
    alsoKnownAs: ["Thuvaram paruppu", "Arhar", "Pigeon pea"],
    botanical: "Cajanus cajan",
    category: "pulse",
    accent: "#DDAE45",
    ink: "#7A5A10",
    silhouette: "lentils",
    summary: "Split pigeon peas, unpolished or polished, and whole on request.",
    colour: "Golden yellow split",
    aroma: ["Nutty", "Mild", "Holds shape in long cooking"],
    origin: ["Maharashtra (Latur, Akola)", "Karnataka (Kalaburagi)", "Madhya Pradesh"],
    forms: ["Split (dal)", "Whole"],
    grades: ["Unpolished", "Polished", "Sortex-cleaned", "FAQ"],
    packaging: PULSE_PACKING,
    moq: ON_REQUEST,
    confirm: true,
  },
  {
    slug: "moong",
    name: "Moong",
    alsoKnownAs: ["Pachai payaru", "Green gram", "Mung bean"],
    botanical: "Vigna radiata",
    category: "pulse",
    accent: "#6E8B3D",
    ink: "#4B6225",
    silhouette: "lentils",
    summary: "Whole green gram, split, and split-washed yellow moong.",
    colour: "Glossy green whole, pale yellow washed",
    aroma: ["Light", "Sweet", "Grassy"],
    origin: ["Rajasthan", "Madhya Pradesh", "Maharashtra"],
    forms: ["Whole", "Split", "Split washed"],
    grades: ["Bold", "Medium", "Sortex-cleaned"],
    packaging: PULSE_PACKING,
    moq: ON_REQUEST,
    confirm: true,
  },
  {
    slug: "urad",
    name: "Urad",
    alsoKnownAs: ["Ulundhu", "Black gram"],
    botanical: "Vigna mungo",
    category: "pulse",
    accent: "#2E2A27",
    ink: "#2E2A27",
    silhouette: "lentils",
    summary: "Whole black gram, split with skin, and white gota for batters.",
    colour: "Matte black whole, ivory when skinned",
    aroma: ["Earthy", "Creamy when cooked"],
    origin: ["Tamil Nadu", "Andhra Pradesh", "Madhya Pradesh"],
    forms: ["Whole black", "Split with skin", "White whole (gota)", "White split"],
    grades: ["Bold", "Medium", "Sortex-cleaned"],
    packaging: PULSE_PACKING,
    moq: ON_REQUEST,
    confirm: true,
  },
  {
    slug: "chana",
    name: "Chana",
    alsoKnownAs: ["Kadalai", "Bengal gram", "Desi chickpea"],
    botanical: "Cicer arietinum",
    category: "pulse",
    accent: "#B98A4B",
    ink: "#7A5520",
    silhouette: "lentils",
    summary: "Whole desi chickpeas and split chana dal.",
    colour: "Tan to brown whole, yellow split",
    aroma: ["Nutty", "Dense", "Sweet when roasted"],
    origin: ["Madhya Pradesh", "Maharashtra", "Rajasthan"],
    forms: ["Whole", "Split (chana dal)"],
    grades: ["Bold", "Medium", "Sortex-cleaned"],
    packaging: PULSE_PACKING,
    moq: ON_REQUEST,
    confirm: true,
  },
  {
    slug: "masoor",
    name: "Masoor",
    alsoKnownAs: ["Mysore paruppu", "Red lentil"],
    botanical: "Lens culinaris",
    category: "pulse",
    accent: "#CF5F39",
    ink: "#A0401D",
    silhouette: "lentils",
    summary: "Whole brown lentils and split red (malka) masoor.",
    colour: "Brown whole, coral-red split",
    aroma: ["Mild", "Earthy", "Cooks soft quickly"],
    origin: ["Madhya Pradesh", "Uttar Pradesh"],
    forms: ["Whole", "Split red (malka)"],
    grades: ["Bold", "Small", "Sortex-cleaned"],
    packaging: PULSE_PACKING,
    moq: ON_REQUEST,
    confirm: true,
  },
];

export const spices = products.filter((p) => p.category === "spice");
export const pulses = products.filter((p) => p.category === "pulse");

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const productUnits = ["kg", "MT", "bags", "20 ft container", "40 ft container"] as const;
