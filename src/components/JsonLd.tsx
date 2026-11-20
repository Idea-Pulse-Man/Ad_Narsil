import { SITE } from "@/config/site";
import { appStoreUrl } from "@/lib/store-links";

/**
 * Structured data for the home page (brief §14): the app, and Narsil as an
 * organisation. aggregateRating appears only with a real App Store rating
 * (SITE.rating), and downloadUrl only once the app is on the store.
 */
export function JsonLd() {
  const onStore = SITE.launchState !== "prelaunch" && Boolean(SITE.appStore.id);
  const app = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: "Narsil",
    operatingSystem: "iOS",
    applicationCategory: "EducationalApplication", // match the App Store category the client picks
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: `${SITE.url}/`,
    image: `${SITE.url}/opengraph-image`,
    ...(onStore ? { downloadUrl: appStoreUrl("jsonld") } : {}),
    ...(SITE.rating
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: SITE.rating.value, ratingCount: SITE.rating.count } }
      : {}),
  };
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Narsil",
    url: `${SITE.url}/`,
    logo: `${SITE.url}/branding/crest-336.webp`,
    email: SITE.supportEmail,
    contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: SITE.supportEmail },
  };
  // "<" is escaped so the JSON can never close the script element.
  const json = JSON.stringify([app, org]).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
