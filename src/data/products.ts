/**
 * Product catalogue: the client's list (spices, rice, pulses and onions).
 *
 * Edit freely: names, origins, grades, packaging and MOQ are plain strings.
 * Fields marked `confirm: true` hold typical Indian trade values (common
 * growing regions and standard grade names) that should be checked with the
 * business before launch. MOQ defaults to "On request" everywhere.
 *
 * `accent` is the colour of the goods themselves and drives the particles,
 * heaps and detail-page tint. `ink` is a darker version of it that passes
 * AA contrast as text on the cream background.
 */

export type Category = "spice" | "rice" | "pulse" | "onion";

/** Display order and labels for each category. */
export const CATEGORIES: { id: Category; one: string; many: string }[] = [
  { id: "spice", one: "Spice", many: "Spices" },
  { id: "rice", one: "Rice", many: "Rice" },
  { id: "pulse", one: "Pulse", many: "Pulses" },
  { id: "onion", one: "Onion", many: "Onions" },
];

export const categoryLabel = (c: Category) => CATEGORIES.find((x) => x.id === c)!.one;
export const categoryPlural = (c: Category) => CATEGORIES.find((x) => x.id === c)!.many;

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
  | "lentils"
  | "bulb";

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
  /** Aroma for spices; character (texture, cooking) for everything else */
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

const RICE_PACKING = [
  "25 kg PP bags",
  "50 kg PP bags",
  "Jute bags",
  "1, 5 or 10 kg consumer packs on request",
  "Custom or private-label packing on request",
];

const ONION_PACKING = ["Mesh (leno) bags of 5, 10 or 25 kg", "Jute bags", "Ventilated cartons on request"];

const ON_REQUEST = "On request";

export const products: Product[] = [
  /* ---------------- Spices ---------------- */
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
    name: "Guntur Red Chilli",
    alsoKnownAs: ["Guntur chilli", "Milagai", "Lal mirch"],
    botanical: "Capsicum annuum",
    category: "spice",
    accent: "#B3201B",
    ink: "#A11C18",
    silhouette: "chilli",
    summary: "Dried Guntur chillies with or without stem, flakes and powder across heat levels.",
    colour: "Bright to deep red",
    aroma: ["Fruity", "Smoky", "Sharp heat"],
    origin: ["Andhra Pradesh (Guntur)"],
    forms: ["Whole with stem", "Stemless", "Flakes", "Powder"],
    grades: ["Teja S17", "Sannam S4 (334)", "Wrinkle 273", "341"],
    packaging: SPICE_PACKING,
    moq: ON_REQUEST,
    confirm: true,
  },
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

  /* ---------------- Rice ---------------- */
  {
    slug: "basmati-rice",
    name: "Basmati Rice",
    alsoKnownAs: ["Basmati", "Basmati chawal"],
    botanical: "Oryza sativa",
    category: "rice",
    accent: "#C9B27E",
    ink: "#6B5526",
    silhouette: "long-seeds",
    summary: "Long-grain aromatic basmati, raw, steam or sella, graded by grain length.",
    colour: "Creamy white to golden (sella), slender long grains",
    aroma: ["Floral", "Nutty", "Grains lengthen on cooking"],
    origin: ["Punjab", "Haryana", "Western Uttar Pradesh"],
    forms: ["Raw (white)", "Steam", "Sella (parboiled)", "Golden sella"],
    grades: ["1121", "1509", "Pusa basmati", "Traditional basmati", "Grain length to buyer spec"],
    packaging: RICE_PACKING,
    moq: ON_REQUEST,
    confirm: true,
  },
  {
    slug: "ponni-rice",
    name: "Tanjore Ponni Rice",
    alsoKnownAs: ["Ponni", "Ponni arisi"],
    botanical: "Oryza sativa",
    category: "rice",
    accent: "#BFA877",
    ink: "#6B5526",
    silhouette: "long-seeds",
    summary: "Medium-grain ponni from the Kaveri delta around Thanjavur, raw or boiled.",
    colour: "Off-white, medium grain",
    aroma: ["Mild", "Soft", "Light and separate when cooked"],
    origin: ["Tamil Nadu (Thanjavur, Kaveri delta)"],
    forms: ["Raw", "Boiled (parboiled)"],
    grades: ["Raw ponni", "Boiled ponni", "New crop or aged, to buyer spec"],
    packaging: RICE_PACKING,
    moq: ON_REQUEST,
    confirm: true,
  },

  /* ---------------- Pulses ---------------- */
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
    slug: "masoor",
    name: "Masoor Dal",
    alsoKnownAs: ["Mysore paruppu", "Red lentil"],
    botanical: "Lens culinaris",
    category: "pulse",
    accent: "#CF5F39",
    ink: "#A0401D",
    silhouette: "lentils",
    summary: "Split red (malka) masoor, and whole brown lentils on request.",
    colour: "Coral-red split, brown whole",
    aroma: ["Mild", "Earthy", "Cooks soft quickly"],
    origin: ["Madhya Pradesh", "Uttar Pradesh"],
    forms: ["Split red (malka)", "Whole"],
    grades: ["Bold", "Small", "Sortex-cleaned"],
    packaging: PULSE_PACKING,
    moq: ON_REQUEST,
    confirm: true,
  },
  {
    slug: "urad",
    name: "Urad Dal",
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
    slug: "moong",
    name: "Moong Dal",
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

  /* ---------------- Onions ---------------- */
  {
    slug: "small-onion",
    name: "Small Onion",
    alsoKnownAs: ["Sambar onion", "Shallot", "Chinna vengayam"],
    botanical: "Allium cepa var. aggregatum",
    category: "onion",
    accent: "#A8455E",
    ink: "#8A3148",
    silhouette: "bulb",
    summary: "Small red sambar onions, sorted by bulb size, dry-skinned and cleaned.",
    colour: "Pinkish-red to purple skin",
    aroma: ["Pungent", "Sweet when cooked"],
    origin: ["Tamil Nadu (Perambalur, Dindigul)", "Karnataka"],
    forms: ["Whole, dry-skinned"],
    grades: ["Sorted by bulb diameter", "Cleaned and topped"],
    packaging: ONION_PACKING,
    moq: ON_REQUEST,
    confirm: true,
  },
  {
    slug: "big-onion",
    name: "Big Onion",
    alsoKnownAs: ["Bellary onion", "Red onion", "Nashik onion", "Periya vengayam"],
    botanical: "Allium cepa",
    category: "onion",
    accent: "#8E2F4A",
    ink: "#7A2440",
    silhouette: "bulb",
    summary: "Firm red onions graded by size and packed in mesh bags.",
    colour: "Deep red to pink",
    aroma: ["Sharp", "Pungent", "Sweet when cooked"],
    origin: ["Maharashtra (Nashik)", "Karnataka"],
    forms: ["Whole, dry-skinned"],
    grades: ["25–40 mm", "40–55 mm", "55 mm and above"],
    packaging: ONION_PACKING,
    moq: ON_REQUEST,
    confirm: true,
  },
];

export const spices = products.filter((p) => p.category === "spice");
export const pulses = products.filter((p) => p.category === "pulse");
export const rices = products.filter((p) => p.category === "rice");
export const onions = products.filter((p) => p.category === "onion");

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const productUnits = ["kg", "MT", "bags", "20 ft container", "40 ft container"] as const;
