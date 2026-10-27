/**
 * Every string on the site (brief §6), so copy can be edited in one place.
 * *Asterisks* mark the one italic word a headline may have (see <Rich>).
 * Eyebrows are sentence case; CSS uppercases them.
 */
import { SITE } from "@/config/site";

const prelaunch = SITE.launchState === "prelaunch";

const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
const numberWord = (n: number) => NUMBER_WORDS[n] ?? String(n);

export type RoomId =
  | "entrance"
  | "gallery"
  | "placard"
  | "ages"
  | "assessment"
  | "ladder"
  | "acquisitions"
  | "guild"
  | "doors";

/** Room names for the rail, the story bar and eyebrows. Numerals come from the slide order. */
export const ROOM_NAMES: Record<RoomId, string> = {
  entrance: "The Entrance",
  gallery: "The Endless Gallery",
  placard: "The Placard",
  ages: "The Ages",
  assessment: "The Royal Assessment",
  ladder: "The Ladder",
  acquisitions: "Acquisitions",
  guild: "The Explorer's Guild",
  doors: "The Doors",
};

export const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

export const roomEyebrow = (index: number, id: RoomId) => `Room ${ROMAN[index]} · ${ROOM_NAMES[id]}`;

export const COPY = {
  meta: {
    title: "Narsil — The museum that never closes · Art app for iPhone",
    description:
      "Swipe through nearly 20,000 public-domain artworks, read the story behind each one, take a daily art quiz and order canvas prints. Free on iPhone.",
  },

  skip: { content: "Skip to content", download: "Skip to download" },

  header: {
    home: "Narsil, back to the entrance",
    cta: prelaunch ? "Join the waitlist" : "Get the app",
  },

  storyBar: { label: "Rooms" },
  rail: { label: "Rooms" },

  sticky: {
    label: prelaunch ? "Narsil — coming soon" : "Narsil — free on iPhone",
    cta: prelaunch ? "Join the waitlist" : "Get the app",
  },

  cta: {
    /** Under the hero CTA. */
    note: prelaunch ? "Coming soon to the App Store · Free to download" : "Free · No account needed to start",
    appStore: "Download on the App Store",
    preorder: "Pre-order on the App Store",
    play: "Get it on Google Play",
    qr: "Scan with your iPhone camera",
    iphoneFirst: "Narsil is on iPhone first.",
    webApp: "Open the web app",
  },

  waitlist: {
    heading: "Be first through the doors",
    label: "Email address",
    placeholder: "Your email",
    submit: "Join the waitlist",
    sending: "Joining…",
    consent: "We'll email you when Narsil launches. No spam.",
    privacy: "Privacy Policy",
    success: "You're on the list.",
    successDetail: "We'll email you when Narsil launches.",
    invalid: "That email doesn't look right. Check it and try again.",
    failed: "Something went wrong on our side. Please try again in a moment.",
  },

  entrance: {
    eyebrow: "Free art app for iPhone",
    title: "The museum *never* closes.",
    sub: `Swipe through ${SITE.catalogLabel} public-domain artworks from the Met, the Rijksmuseum and more. Tap any piece for its story. Prove your eye in a daily quiz.`,
    scrollCue: "Scroll to enter",
    pause: "Pause the paintings",
    play: "Play the paintings",
  },

  gallery: {
    title: "Swipe through five thousand years.",
    sub: "A full-screen feed that learns what you love.",
    kicker: "No ads. No noise. Just art.",
    gestures: [
      { action: "Swipe up", result: "the next artwork" },
      { action: "Tap the title", result: "open its placard" },
      { action: "Swipe left", result: "meet the artist" },
      { action: "Swipe right", result: "fill the frame" },
      { action: "Press and hold", result: "hide everything but the art" },
    ],
    small: "Like, save to your Vault, comment or download from the side rail.",
  },

  placard: {
    title: "Every work has a *story*.",
    sub: "Tap a title and the placard rises: who made it, when and where, and why it still matters.",
    source:
      "Images and records from the open-access collections of the Met, the Rijksmuseum, the Cleveland Museum of Art and Wellcome Collection.",
  },

  ages: {
    title: "From pharaohs to Van Gogh.",
    sub: "Discover walks you through art history, age by age and empire by empire, with the artists and works that defined each one.",
    small:
      "Discover is free with an account. Ancient Egypt's trials are free for everyone; every other age and empire comes with The Explorer's Guild.",
  },

  assessment: {
    title: "The court will now judge your *taste*.",
    sub: `Every day the app serves ${numberWord(SITE.dailyQuestions)} new questions. Score well and you're knighted. Score badly and… well.`,
    /** Appended to sub once the on-page quiz ships (step 2). */
    tryNow: "Try five now.",
    small: "Sample questions. The app's Assessment is new every day.",
  },

  ladder: {
    title: "Rise from Peasant to Royal Archivist.",
    sub: "Daily points lift you through seven ranks, each with its own heraldic frame. Perfect trials earn Seals. The Halls rank you against members at your level.",
    small: "Want a nudge? Turn on the daily reminder and keep your streak alive.",
  },

  acquisitions: {
    title: "Take a masterpiece *home*.",
    sub: `Canvas from $${SITE.prices.canvasFrom}. Posters from $${SITE.prices.posterFrom}. The price you see includes shipping and tax, to any US address.`,
    cta: "Choose yours in the app",
    small:
      "Ordered in the app with Apple Pay or card. Some works cost a few dollars more; the app shows the exact price before you pay.",
  },

  guild: {
    title: "Free to enter. The Guild goes *deeper*.",
    sub: "The feed, the placards, Discover, the daily Assessment, levels and Halls are free. The Explorer's Guild is an optional subscription for the endlessly curious.",
    small:
      "The Explorer's Guild is an auto-renewing subscription billed to your Apple Account. The app shows the price before you subscribe. Cancel anytime in Settings.",
    cta: "Download free, join the Guild anytime",
  },

  doors: {
    title: "The doors are *open*.",
    sub: prelaunch
      ? "Narsil is coming to iPhone, free. Your first masterpiece is one swipe away."
      : "Narsil is free on iPhone. Your first masterpiece is one swipe away.",
    note: prelaunch ? "Coming soon to the App Store · Free to download" : "No account needed to start.",
  },

  faq: {
    title: "Questions at the door",
    items: [
      {
        q: "Is Narsil free?",
        a: "Yes. The app is free, and so are the feed, the placards, Discover, the daily Assessment, levels and Halls. The Explorer's Guild is an optional subscription; prints are paid for one by one.",
      },
      {
        q: "What does The Explorer's Guild add?",
        a: "Endless practice, every age and empire trial, and Master File downloads.",
      },
      {
        q: "Where does the art come from?",
        a: "From the open-access collections of the Metropolitan Museum of Art, the Rijksmuseum, the Cleveland Museum of Art and Wellcome Collection: works in the public domain or released as CC0. Narsil is independent and isn't affiliated with these museums.",
      },
      {
        q: "Do I need an account?",
        a: "No. Start as a guest. A free account (Sign in with Apple or Google) opens Discover and keeps your Vault, levels and streak in sync.",
      },
      {
        q: "Is Narsil on Android?",
        a: SITE.googlePlayUrl ? "Yes, get it on Google Play." : "Narsil is on iPhone first.",
      },
      {
        q: "Where do prints ship?",
        a: "To US addresses only. Shipping and tax are included in the price you see.",
      },
      {
        q: "How do I cancel the Guild?",
        a: "iPhone Settings → your name → Subscriptions, at least 24 hours before it renews.",
      },
      { q: "How do I delete my account?", a: "In the app: Profile → Delete account." },
      { q: "How do I contact you?", a: SITE.supportEmail },
    ],
  },

  footer: {
    links: { support: "Support", privacy: "Privacy", terms: "Terms", credits: "Credits", contact: "Contact" },
    copyright: "© 2026 Narsil.",
    museums:
      "Artworks shown are in the public domain or CC0, from the open-access collections of the Metropolitan Museum of Art, the Rijksmuseum, the Cleveland Museum of Art and Wellcome Collection. Narsil is independent and is not affiliated with, sponsored or endorsed by these institutions.",
    apple:
      "Apple, the Apple logo and iPhone are trademarks of Apple Inc., registered in the U.S. and other countries and regions. App Store is a service mark of Apple Inc.",
    google: "Google Play and the Google Play logo are trademarks of Google LLC.",
  },

  get: {
    title: "The museum never closes.",
    sub: "Narsil puts nearly 20,000 public-domain masterpieces in a full-screen feed, with the story of every work and a daily art quiz.",
    desktop: "Get Narsil on your iPhone",
    noscript: "Store links",
  },

  joined: {
    title: "You're on the list.",
    sub: "We'll email you when Narsil launches.",
    errorTitle: "That email doesn't look right.",
    errorSub: "Go back and check it, then try again.",
    back: "Back to the entrance",
  },

  notFound: {
    title: "This room is closed.",
    back: "Back to the entrance",
  },

  support: {
    title: "Support",
    sub: "Help with the Narsil app.",
  },

  credits: {
    title: "Credits",
    sub: "Every artwork on this site, where it hangs, and the license that lets us show it.",
  },
} as const;
