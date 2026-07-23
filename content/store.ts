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
    "We deliver nationwide with a specialist furniture courier, blanket wrapped, carried in and placed in the room you choose. Within North East England we deliver ourselves, usually inside the week, and collection is welcome by arrangement.",
  returnsProse:
    "If a piece arrives and does not suit the room, tell us within fourteen days. We will arrange collection and refund what you paid. All we ask is that the piece comes back in the condition it arrived.",
  careProse:
    "Vintage furniture is straightforward to live with. Keep pieces out of direct sun and away from radiators, wipe with a barely damp cloth, and wax timber once a year. Every piece comes with care notes written for its own materials.",
  viewingProse:
    "The collection is kept in North East England and viewings are by appointment, most days including weekends. Bring the room's measurements and take your time with the piece.",
  newsletterLead:
    "New pieces are offered to the list before they reach the website. One note a month at most, and only when there is something worth showing you.",
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
      "Every piece is one of one, so there is no basket. Send an enquiry and we will reply the same day where we can, usually with more photographs and the condition report. When you are ready, payment is by bank transfer and we arrange delivery.",
  },
  {
    question: "Can you hold a piece",
    answer:
      "Yes, for forty eight hours while you measure the room. Beyond that we take a small refundable deposit and mark the piece reserved until you decide.",
  },
  {
    question: "How is delivery arranged",
    answer:
      "Nationwide by specialist furniture courier, blanket wrapped, carried in and placed in the room you choose. Within North East England we deliver ourselves, usually inside the week.",
  },
  {
    question: "Can we see a piece first",
    answer:
      "Yes. Viewings are by appointment in North East England, most days including weekends. Bring the room's measurements.",
  },
  {
    question: "What condition are the pieces in",
    answer:
      "Ready for daily use unless the listing says otherwise. Every piece is checked before it is listed, photographed honestly with any wear shown, and sold with a written condition report. Anything repaired or replaced is stated plainly on the piece's page.",
  },
  {
    question: "Do you buy furniture",
    answer:
      "We do. If you have a piece by one of the designers of the last century, or think you might, send photographs through the selling page and we will come back with a view and, where it suits the collection, an offer.",
  },
];

export const globalWords: StaticWord[] = [
  {
    quote:
      "The chair arrived exactly as described, and better than the photographs, which were the reason I rang. The paperwork that came with it answered every question I had.",
    name: "A collector",
    context: "Ball chair, delivered to Edinburgh",
  },
  {
    quote:
      "They talked me out of the piece I wanted and into the piece the room needed. Right on both counts.",
    name: "A first time buyer",
    context: "Sideboard, County Durham",
  },
  {
    quote:
      "Solid, clean and honestly described. The condition report matched the piece down to the small marks it listed.",
    name: "A returning collector",
    context: "Nesting tables, York",
  },
];

// What comes with every piece unless a piece lists its own items.
export const defaultIncluded: { label: string; note: string }[] = [
  {
    label: "The provenance file",
    note: "What is known of the piece's history, written down and passed on with it.",
  },
  {
    label: "A condition report",
    note: "The piece photographed and described plainly, including anything repaired or replaced.",
  },
  {
    label: "Care notes",
    note: "One page on keeping the piece well, written for its own materials.",
  },
  {
    label: "Delivery",
    note: "Blanket wrapped, carried in and placed in the room you choose.",
  },
];
