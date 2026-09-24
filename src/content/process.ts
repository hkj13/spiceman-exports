import type { StageKind } from "@/components/art/StageArt";

/**
 * The eight stages as they appear on the Process page. Written as what
 * generally happens in the Indian spice and pulse trade and what a buyer can
 * specify at each point; no claims about volumes, certificates or history.
 */
export type ProcessStage = {
  id: string;
  n: string;
  label: string;
  title: string;
  body: string[];
  specify: string[];
  scene: "soil" | "harvest" | "sun" | "sort" | "check" | "pack" | "container" | "port";
  art: StageKind;
};

export const processStages: ProcessStage[] = [
  {
    id: "soil",
    n: "01",
    label: "Soil",
    title: "Where it grows",
    body: [
      "Most spices have a home. Black pepper and cardamom come from the wet hills of the Western Ghats in Kerala, Karnataka and Tamil Nadu. Turmeric is traded out of Erode, Salem, Nizamabad and Sangli. Red chilli centres on Guntur and Byadgi. Cumin, coriander and fenugreek come from the dry fields of Gujarat, Rajasthan and Madhya Pradesh.",
      "Pulses grow across the Deccan and the plains of central India, with Maharashtra, Karnataka and Madhya Pradesh supplying much of the toor and chana.",
      "Each product page lists the regions it is typically sourced from. For a specific lot, ask for its origin when you request a quote.",
    ],
    specify: ["Origin region or district", "Crop year: new crop or old crop"],
    scene: "soil",
    art: "furrows",
  },
  {
    id: "harvest",
    n: "02",
    label: "Harvest",
    title: "When it is picked",
    body: [
      "Harvests follow the season, and so does price. Pepper in Kerala is picked from around December into February. Cardamom is picked in rounds from late monsoon into winter. Turmeric is lifted from January to March, chilli through the winter into spring, and cumin in February and March.",
      "Pulses are largely rabi or kharif crops, so availability and quality shift through the year. If timing matters for your market, say so early.",
    ],
    specify: ["Shipment window", "New crop only, or blends acceptable"],
    scene: "harvest",
    art: "strands",
  },
  {
    id: "sun",
    n: "03",
    label: "Sun",
    title: "How it is dried",
    body: [
      "Pepper is spread on drying yards for several days and turns from green to black as it dries. Turmeric is boiled before drying, which sets its colour. Chillies are dried whole, often on the field. Cardamom is the exception: it is cured in heated drying houses so the pods keep their green.",
      "Drying decides how well a crop survives a sea voyage. Moisture is brought down to the limit the contract sets, commonly around 11 to 12 percent for pepper.",
    ],
    specify: ["Moisture, % max", "Colour expectations (e.g. green cardamom, bright red chilli)"],
    scene: "sun",
    art: "bed",
  },
  {
    id: "sort",
    n: "04",
    label: "Sort",
    title: "Cleaning and grading",
    body: [
      "Cleaning takes out stones, stalks, dust and light or broken grains, by sieving, destoning, gravity separation and, for many seed spices and pulses, a sortex colour sorter.",
      "Grading follows the conventions of each crop: pepper by bulk density in grams per litre, cardamom by pod size in millimetres, chilli by variety and whether the stem is on, pulses by size and polish.",
    ],
    specify: ["Grade", "Extraneous matter, % max", "Machine-cleaned or sortex"],
    scene: "sort",
    art: "sieve",
  },
  {
    id: "check",
    n: "05",
    label: "Check",
    title: "Checking against your spec",
    body: [
      "A quote is only as good as the specification it is made against. Send the one you buy to: moisture, extraneous matter, grade, and any product-specific values such as colour value for chilli, curcumin for turmeric or volatile oil for pepper and cardamom.",
      "If your market needs laboratory reports, for example on pesticide residues, aflatoxin or microbiology, mention it with the inquiry. Testing affects both lead time and price.",
    ],
    specify: ["Full specification sheet", "Laboratory reports your importer requires", "Pre-shipment samples"],
    scene: "check",
    art: "loupe",
  },
  {
    id: "pack",
    n: "06",
    label: "Pack",
    title: "Packing and marking",
    body: [
      "Most spices and pulses travel in PP woven or jute bags of 25 or 50 kg. Cardamom and cinnamon usually go in cartons with poly liners to protect colour and aroma.",
      "Bag marking follows your instructions: product, grade, lot, net and gross weight, origin, and your brand if you are buying under private label.",
    ],
    specify: ["Bag type and weight", "Marking and labels", "Private label artwork"],
    scene: "pack",
    art: "sack",
  },
  {
    id: "container",
    n: "07",
    label: "Container",
    title: "Loading the container",
    body: [
      "Larger orders are quoted by the 20 ft or 40 ft container, smaller ones by the tonne or by the bag. How much fits depends on the product and bag size, so the quote states the loadable quantity.",
      "Some destinations require fumigation or particular treatment before loading. Name your destination early so these are included.",
    ],
    specify: ["Container size or quantity", "Incoterm (for example FOB or CIF)", "Fumigation or treatment requirements"],
    scene: "container",
    art: "container",
  },
  {
    id: "port",
    n: "08",
    label: "Port",
    title: "Documents and shipping",
    body: [
      "An export shipment travels with its paperwork: commercial invoice, packing list, bill of lading, certificate of origin and, for most agricultural goods, a phytosanitary certificate. Your importer may need others.",
      "Tell us the port of destination and which documents your importer needs, and they are prepared alongside the shipment.",
    ],
    specify: ["Port of destination", "Documents required by your importer"],
    scene: "port",
    art: "ship",
  },
];
