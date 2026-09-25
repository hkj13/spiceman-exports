/**
 * Photographs, all openly licensed for commercial use and credited in
 * CREDITS.md. Product photos are keyed by product slug; journey scenes by
 * `stage-<id>`. To use the client's own photos, replace the files in
 * src/assets/photos (keep the names) and update the credit here.
 */
import type { StaticImageData } from "next/image";
import blackPepper from "@/assets/photos/black-pepper.jpg";
import turmeric from "@/assets/photos/turmeric.jpg";
import redChilli from "@/assets/photos/red-chilli.jpg";
import cardamom from "@/assets/photos/cardamom.jpg";
import corianderSeeds from "@/assets/photos/coriander-seeds.jpg";
import cumin from "@/assets/photos/cumin.jpg";
import fenugreek from "@/assets/photos/fenugreek.jpg";
import mustardSeeds from "@/assets/photos/mustard-seeds.jpg";
import cloves from "@/assets/photos/cloves.jpg";
import cinnamon from "@/assets/photos/cinnamon.jpg";
import toorDal from "@/assets/photos/toor-dal.jpg";
import moong from "@/assets/photos/moong.jpg";
import urad from "@/assets/photos/urad.jpg";
import chana from "@/assets/photos/chana.jpg";
import masoor from "@/assets/photos/masoor.jpg";
import stageSoil from "@/assets/photos/stage-soil.jpg";
import stageHarvest from "@/assets/photos/stage-harvest.jpg";
import stageSun from "@/assets/photos/stage-sun.jpg";
import stageSort from "@/assets/photos/stage-sort.jpg";
import stagePack from "@/assets/photos/stage-pack.jpg";
import stageContainer from "@/assets/photos/stage-container.jpg";
import stagePort from "@/assets/photos/stage-port.jpg";

export type Credit = { title: string; author: string; license: string; license_url: string; source: string };
export type Photo = { src: StaticImageData; alt: string; credit: Credit };

export const photos = {
  "black-pepper": {
    src: blackPepper,
    alt: "Close-up of dried black peppercorns",
    credit: {
      title: "Piper nigrum Dried fruits with and without pericarp - Penja Cameroun.jpg",
      author: "Didier Descouens",
      license: "CC BY-SA 4.0",
      license_url: "https://creativecommons.org/licenses/by-sa/4.0",
      source:
        "https://commons.wikimedia.org/wiki/File:Piper_nigrum_Dried_fruits_with_and_without_pericarp_-_Penja_Cameroun.jpg",
    },
  },
  turmeric: {
    src: turmeric,
    alt: "A heap of dried turmeric fingers",
    credit: {
      title:
        "A close-up view of dried turmeric roots fills the frame, showing their natural shapes, rough texture, and bright golden-yellow color. The repeating forms create a simple but striking natural pattern. Captured in Kuttikkattoor, Kozhikode, Kerala.",
      author: "Bigul Malayi",
      license: "CC0 1.0",
      license_url: "https://creativecommons.org/publicdomain/zero/1.0/",
      source: "https://wordpress.org/photos/photo/2706a7b3fe/",
    },
  },
  "red-chilli": {
    src: redChilli,
    alt: "A bunch of dried red chillies on a wooden board",
    credit: {
      title: "Bouquet of Dried Chili Peppers",
      author: "qubodup",
      license: "CC0 1.0",
      license_url: "https://creativecommons.org/publicdomain/zero/1.0/",
      source: "https://www.flickr.com/photos/21051491@N02/7698346604",
    },
  },
  cardamom: {
    src: cardamom,
    alt: "Green cardamom pods in a brass bowl",
    credit: {
      title: "Green Cardamom Pods.jpg",
      author: "Misterneedlemouse",
      license: "CC0",
      license_url: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
      source: "https://commons.wikimedia.org/wiki/File:Green_Cardamom_Pods.jpg",
    },
  },
  "coriander-seeds": {
    src: corianderSeeds,
    alt: "Close-up of coriander seeds",
    credit: {
      title: "Coriander Seeds.jpg",
      author: "Sanjay Acharya",
      license: "CC BY-SA 4.0",
      license_url: "https://creativecommons.org/licenses/by-sa/4.0",
      source: "https://commons.wikimedia.org/wiki/File:Coriander_Seeds.jpg",
    },
  },
  cumin: {
    src: cumin,
    alt: "Close-up of cumin seeds",
    credit: {
      title: "Dried cumin seeds.jpg",
      author: "Fumikas Sagisavas",
      license: "CC0",
      license_url: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
      source: "https://commons.wikimedia.org/wiki/File:Dried_cumin_seeds.jpg",
    },
  },
  fenugreek: {
    src: fenugreek,
    alt: "A pile of golden fenugreek seeds",
    credit: {
      title: "Fenugreek seed.JPG",
      author: "Miansari66",
      license: "Public domain",
      license_url: "",
      source: "https://commons.wikimedia.org/wiki/File:Fenugreek_seed.JPG",
    },
  },
  "mustard-seeds": {
    src: mustardSeeds,
    alt: "Close-up of brown mustard seeds",
    credit: {
      title: "Black mustard seeds.jpg",
      author: "Theredgiant",
      license: "CC BY-SA 4.0",
      license_url: "https://creativecommons.org/licenses/by-sa/4.0",
      source: "https://commons.wikimedia.org/wiki/File:Black_mustard_seeds.jpg",
    },
  },
  cloves: {
    src: cloves,
    alt: "Close-up of dried cloves",
    credit: {
      title: "Dried clove sticks.jpg",
      author: "Fumikas Sagisavas",
      license: "CC0",
      license_url: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
      source: "https://commons.wikimedia.org/wiki/File:Dried_clove_sticks.jpg",
    },
  },
  cinnamon: {
    src: cinnamon,
    alt: "A stack of cinnamon quills",
    credit: {
      title: "Cinnamon sticks (3).jpg",
      author: "Fumikas Sagisavas",
      license: "CC0",
      license_url: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
      source: "https://commons.wikimedia.org/wiki/File:Cinnamon_sticks_(3).jpg",
    },
  },
  "toor-dal": {
    src: toorDal,
    alt: "Close-up of split toor dal",
    credit: {
      title: "Pigeon Pea (Toor Dal) (49683602388).jpg",
      author: "Ajay Suresh from New York, NY, USA",
      license: "CC BY 2.0",
      license_url: "https://creativecommons.org/licenses/by/2.0",
      source: "https://commons.wikimedia.org/wiki/File:Pigeon_Pea_(Toor_Dal)_(49683602388).jpg",
    },
  },
  moong: {
    src: moong,
    alt: "Close-up of whole green moong",
    credit: {
      title: "Green Mung Beans.jpg",
      author: "Sanjay Acharya",
      license: "CC BY-SA 4.0",
      license_url: "https://creativecommons.org/licenses/by-sa/4.0",
      source: "https://commons.wikimedia.org/wiki/File:Green_Mung_Beans.jpg",
    },
  },
  urad: {
    src: urad,
    alt: "Close-up of whole black urad",
    credit: {
      title: "Black gram.jpg",
      author: "Sanjay Acharya",
      license: "CC BY-SA 3.0",
      license_url: "http://creativecommons.org/licenses/by-sa/3.0/",
      source: "https://commons.wikimedia.org/wiki/File:Black_gram.jpg",
    },
  },
  chana: {
    src: chana,
    alt: "A heap of dried chickpeas",
    credit: {
      title: "Cicer arietinum (seeds).jpg",
      author: "Judgefloro",
      license: "CC0",
      license_url: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
      source: "https://commons.wikimedia.org/wiki/File:Cicer_arietinum_(seeds).jpg",
    },
  },
  masoor: {
    src: masoor,
    alt: "Close-up of split red masoor",
    credit: {
      title: "Red lentils (1).jpg",
      author: "Fumikas Sagisavas",
      license: "CC0",
      license_url: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
      source: "https://commons.wikimedia.org/wiki/File:Red_lentils_(1).jpg",
    },
  },
  "stage-soil": {
    src: stageSoil,
    alt: "Rows of pigeon pea plants in red soil",
    credit: {
      title: "Pigeon Pea field in Andhra Pradesh (96030).jpg",
      author: "PJeganathan",
      license: "CC BY-SA 3.0",
      license_url: "https://creativecommons.org/licenses/by-sa/3.0",
      source: "https://commons.wikimedia.org/wiki/File:Pigeon_Pea_field_in_Andhra_Pradesh_(96030).jpg",
    },
  },
  "stage-harvest": {
    src: stageHarvest,
    alt: "Green pepper spikes hanging on the vine",
    credit: {
      title: "Piper nigrum 04236.jpg",
      author: "Vengolis",
      license: "CC BY-SA 4.0",
      license_url: "https://creativecommons.org/licenses/by-sa/4.0",
      source: "https://commons.wikimedia.org/wiki/File:Piper_nigrum_04236.jpg",
    },
  },
  "stage-sun": {
    src: stageSun,
    alt: "Spices spread on round mats to dry in the sun",
    credit: {
      title: "Drying spices.jpg",
      author: "Arie Basuki",
      license: "CC BY-SA 4.0",
      license_url: "https://creativecommons.org/licenses/by-sa/4.0",
      source: "https://commons.wikimedia.org/wiki/File:Drying_spices.jpg",
    },
  },
  "stage-sort": {
    src: stageSort,
    alt: "Hands sorting dried spices over a woven basket",
    credit: {
      title: "Clove sorting.jpg",
      author: "Daniel Msirikale",
      license: "CC BY-SA 4.0",
      license_url: "https://creativecommons.org/licenses/by-sa/4.0",
      source: "https://commons.wikimedia.org/wiki/File:Clove_sorting.jpg",
    },
  },
  "stage-pack": {
    src: stagePack,
    alt: "An open jute sack filled with chickpeas",
    credit: {
      title: "3Cicer arietinum (seeds).jpg",
      author: "Judgefloro",
      license: "CC0",
      license_url: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
      source: "https://commons.wikimedia.org/wiki/File:3Cicer_arietinum_(seeds).jpg",
    },
  },
  "stage-container": {
    src: stageContainer,
    alt: "Stacked shipping containers at a port",
    credit: {
      title: "Containers Rotterdam.JPG",
      author: "Steven Lek",
      license: "CC BY-SA 4.0",
      license_url: "https://creativecommons.org/licenses/by-sa/4.0",
      source: "https://commons.wikimedia.org/wiki/File:Containers_Rotterdam.JPG",
    },
  },
  "stage-port": {
    src: stagePort,
    alt: "A container ship on the open sea",
    credit: {
      title: "Container ship in Koper 2013.jpg",
      author: "Martin Dörsch",
      license: "CC0",
      license_url: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
      source: "https://commons.wikimedia.org/wiki/File:Container_ship_in_Koper_2013.jpg",
    },
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

export const productPhoto = (slug: string): Photo | undefined => (photos as Record<string, Photo>)[slug];
