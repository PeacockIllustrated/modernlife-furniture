/**
 * Store prose and site-wide rows, the static mirror of the modern_settings
 * 'store' object, the site-wide questions and the collector words. Without a
 * database the site reads these; with one, the dashboard's edits win. Every
 * line is placeholder copy awaiting the owner, in the house register.
 */

export interface StoreSettings {
  announcement: string;
  deliveryProse: string;
  returnsProse: string;
  careProse: string;
  viewingProse: string;
  newsletterLead: string;
  // The home page image slots. Empty paths mean no photography yet, and the
  // page falls back to the generative visuals so nothing ever looks missing.
  heroImage: string;
  heroAlt: string;
  heroHeadline: string;
  workshopImage: string;
  workshopAlt: string;
}

export interface StaticFaq {
  question: string;
  answer: string;
}

export interface StaticWord {
  quote: string;
  name: string;
  context: string;
}

export const storeSettings: StoreSettings = {
  announcement:
    "Viewings by appointment in North East England, delivery nationwide",
  deliveryProse:
    "We deliver nationwide with a specialist furniture courier, blanket wrapped and placed in the room you choose. Within North East England we bring pieces ourselves, usually inside the week, and collection from the workshop is always welcome.",
  returnsProse:
    "If a piece arrives and does not sit right in the room, tell us within fourteen days. We will collect it and return what you paid. We would rather have a chair back than a collector unsure.",
  careProse:
    "Old timber likes a steady room. Keep pieces out of direct sun and away from radiators, wipe with a barely damp cloth, and feed the finish once a year with a hard wax. Every piece leaves us with care notes written for its own materials.",
  viewingProse:
    "The collection is kept at our workshop in North East England. Viewings are by appointment, most days including weekends. Bring the room's measurements and we will put the kettle on.",
  newsletterLead:
    "New pieces are offered to the list before they reach the website. One note a month at most, and only when something worth writing about comes off the bench.",
  heroImage: "",
  heroAlt: "",
  heroHeadline: "Live with a piece of *history*",
  workshopImage: "",
  workshopAlt: "",
};

export const globalFaqs: StaticFaq[] = [
  {
    question: "How does buying work",
    answer:
      "Every piece is one of one, so there is no basket. Send an enquiry or register interest and we will reply the same day where we can, usually with more photographs. When you are ready, we take payment by bank transfer and arrange delivery.",
  },
  {
    question: "Can you hold a piece",
    answer:
      "We will hold a piece for forty eight hours while you measure the room. Beyond that we take a small refundable deposit and mark the piece reserved until you decide.",
  },
  {
    question: "How is delivery arranged",
    answer:
      "Nationwide by specialist furniture courier, blanket wrapped and placed in the room you choose. Within North East England we deliver ourselves, usually inside the week.",
  },
  {
    question: "Can we see a piece first",
    answer:
      "Yes, viewings are by appointment at the workshop, most days including weekends. Bring the room's measurements.",
  },
  {
    question: "What does restored mean here",
    answer:
      "Honest and reversible where possible. We keep original surfaces when they can be kept, replace like with like when they cannot, and write down everything we do. The work is listed on each piece's page.",
  },
  {
    question: "Do you buy furniture",
    answer:
      "We do. If you have a piece by the furniture artists of the last century, send photographs through the selling page and we will come back with a view and, if it suits the collection, an offer.",
  },
];

export const globalWords: StaticWord[] = [
  {
    quote:
      "The chair arrived better than the photographs, and the photographs were the reason I rang. The file that came with it reads like a biography.",
    name: "A collector",
    context: "Ball chair, rehomed to Edinburgh",
  },
  {
    quote:
      "They talked me out of the piece I wanted and into the piece the room needed. Right on both counts.",
    name: "A first time buyer",
    context: "Sideboard, County Durham",
  },
  {
    quote:
      "You can feel the bench work in it. Nothing wobbles, nothing shines that should not.",
    name: "A returning collector",
    context: "Nesting tables, York",
  },
];

// What comes with every piece unless a piece lists its own items.
export const defaultIncluded: { label: string; note: string }[] = [
  {
    label: "The provenance file",
    note: "Everything we know about the piece's life so far, written down and passed on with it.",
  },
  {
    label: "A condition report",
    note: "Photographed and noted before and after restoration, so you know exactly what was done.",
  },
  {
    label: "Care notes",
    note: "How to keep the finish well, one page, written for the piece's own materials.",
  },
  {
    label: "Delivery",
    note: "Blanket wrapped, carried in and placed in the room you choose.",
  },
];
