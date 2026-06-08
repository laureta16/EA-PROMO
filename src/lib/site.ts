export const site = {
  name: "Eapromo",
  tagline: "Promocione, printime dhe dhurata të personalizuara",
  description:
    "EA Promo ofron printime cilësore, materiale promocionale, veshje dhe dhurata të personalizuara për biznesin tuaj në Shqipëri.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/ea_promo/",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  googleReviewUrl: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ?? "#",
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL ?? "info@eapromo.al",
  address: {
    line1: "Rruga Dervish Luzha",
    line2: "5 Maji, Tiranë, Shqipëri 1001",
    plusCode: "8RWF+7G5",
    coords: { lat: 41.345587, lng: 19.823881 },
    mapsLink: "https://maps.app.goo.gl/JwS7Gks3VDaY93Cb6",
    embedUrl:
      "https://www.google.com/maps?q=41.345587,19.823881&z=18&output=embed",
  },
};

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
