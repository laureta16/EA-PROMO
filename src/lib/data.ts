// Static seed data baked into the bundle.
// No native modules, no filesystem — works on Vercel/Edge/anywhere.

import type { Category, Offer, Product } from "./types";

const now = Math.floor(Date.now() / 1000);

export const CATEGORIES_SEED: Category[] = [
  { id: 1, slug: "stilolapsa", name: "Stilolapsa", description: "Stilolapsa promocional me printim ose gdhendje të logos.", created_at: now },
  { id: 2, slug: "bluza", name: "Bluza & Veshje", description: "T-shirt, polo dhe veshje me printim ose qëndisje.", created_at: now },
  { id: 3, slug: "flamur", name: "Flamur reklamues", description: "Flamur reklamues Beach Flag dhe roll-up me bazament.", created_at: now },
  { id: 4, slug: "kartvizita", name: "Kartëvizita", description: "Kartëvizita të printuara me cilësi premium.", created_at: now },
  { id: 5, slug: "cakmak", name: "Çakmak", description: "Çakmak promocional të personalizuar.", created_at: now },
  { id: 6, slug: "mousepad", name: "Mousepad", description: "Mousepad me printim full color.", created_at: now },
  { id: 7, slug: "bracelet", name: "Bracelet", description: "Bracelet silicon me printim të logos.", created_at: now },
  { id: 8, slug: "trofe", name: "Trofe & Kupa", description: "Trofe dhe kupa rezine për çmime e ngjarje sportive.", created_at: now },
  { id: 9, slug: "tabela", name: "Tabela reklamuese", description: "Tabela A-frame dhe panele reklamuese për ambjente të brendshme dhe të jashtme.", created_at: now },
  { id: 10, slug: "erashka", name: "Erashka", description: "Erashka të personalizuara me logo, ideale për evente verore.", created_at: now },
  { id: 11, slug: "set-biznesi", name: "Set biznesi", description: "Set i plotë promocional për biznesin tuaj.", created_at: now },
];

const CAT_BY_SLUG: Record<string, number> = Object.fromEntries(CATEGORIES_SEED.map((c) => [c.slug, c.id]));

export const PRODUCTS_SEED: Product[] = [
  { id: 1, slug: "stilolaps-teresa", name: "Stilolaps Teresa", description: "Stilolaps me material plastikë soft, gjatësi 14.1 cm. I disponueshëm në ngjyrë të bardhë, të kuqe, blu të errët, blu të hapur dhe të zezë. Printim me logo deri në 4 ngjyra.", price_cents: 120, image_url: null, category_id: CAT_BY_SLUG["stilolapsa"], featured: 1, active: 1, created_at: now },
  { id: 2, slug: "stilolaps-schneider", name: "Stilolaps Schneider Origjinal", description: "Stilolaps Schneider origjinal me printim të personalizuar. Cilësi premium gjermane, ngjyrë blu shkruajtëse.", price_cents: 280, image_url: null, category_id: CAT_BY_SLUG["stilolapsa"], featured: 0, active: 1, created_at: now },
  { id: 3, slug: "set-stilolapsa-50", name: "Set 50 stilolapsa me logo", description: "Pako prej 50 copë stilolapsa promocional me printimin e logos suaj. Përfshin dizajnin falas.", price_cents: 4500, image_url: null, category_id: CAT_BY_SLUG["stilolapsa"], featured: 0, active: 1, created_at: now },
  { id: 4, slug: "tshirt-master-men", name: "T-Shirt Master Men", description: "T-shirt për meshkuj, 100% pambuk, përmasa S, M, L, XL, XXL, 3XL. Printim ose qëndisje në çdo ngjyrë.", price_cents: 1400, image_url: "/showcase/tshirt-master.png", category_id: CAT_BY_SLUG["bluza"], featured: 1, active: 1, created_at: now },
  { id: 5, slug: "bluze-cotton-personalizuar", name: "Bluzë cotton e personalizuar", description: "Bluzë pambuku 100% me printim DTF ose qëndisje. Material tekstil cilësor, përmasa standarte S–XXL.", price_cents: 1200, image_url: null, category_id: CAT_BY_SLUG["bluza"], featured: 0, active: 1, created_at: now },
  { id: 6, slug: "polo-uniforme", name: "Polo për uniformë", description: "Polo me jakë, ideale për uniforma pune. Printim ose qëndisje e logos suaj.", price_cents: 1500, image_url: null, category_id: CAT_BY_SLUG["bluza"], featured: 0, active: 1, created_at: now },
  { id: 7, slug: "flamur-beach-flag", name: "Flamur Beach Flag", description: "Flamur reklamues tip Beach Flag me bazament dhe shtizë. Ideal për panaire, evente dhe ambjente të jashtme.", price_cents: 6500, image_url: null, category_id: CAT_BY_SLUG["flamur"], featured: 1, active: 1, created_at: now },
  { id: 8, slug: "roll-up-banner", name: "Roll-up banner 85x200", description: "Banner roll-up me përmasa 85x200cm, me bazament alumini dhe çantë mbartëse.", price_cents: 5500, image_url: null, category_id: CAT_BY_SLUG["flamur"], featured: 0, active: 1, created_at: now },
  { id: 9, slug: "kartvizita-200", name: "Kartëvizita 200 copë", description: "200 copë kartëvizita, printim cilësor i të dy anëve, letër 350gr e laminuar mat ose shkëlqyese.", price_cents: 1800, image_url: null, category_id: CAT_BY_SLUG["kartvizita"], featured: 1, active: 1, created_at: now },
  { id: 10, slug: "kartvizita-500", name: "Kartëvizita 500 copë", description: "500 copë kartëvizita premium me dizajn falas, finitura mat/shkëlqyese.", price_cents: 3200, image_url: null, category_id: CAT_BY_SLUG["kartvizita"], featured: 0, active: 1, created_at: now },
  { id: 11, slug: "cakmak-promocional", name: "Çakmak promocional", description: "Çakmak metalik me printim 1-ngjyrësh të logos suaj.", price_cents: 250, image_url: null, category_id: CAT_BY_SLUG["cakmak"], featured: 0, active: 1, created_at: now },
  { id: 12, slug: "mousepad-full-color", name: "Mousepad full color", description: "Mousepad me printim full color, bazë gome anti-rrëshqitëse, sipërfaqe tekstili.", price_cents: 450, image_url: null, category_id: CAT_BY_SLUG["mousepad"], featured: 0, active: 1, created_at: now },
  { id: 13, slug: "bracelet-silicon", name: "Bracelet silicon i personalizuar", description: "Bracelet silicon i butë me printim ose embossing të logos. Disponohet në çdo ngjyrë: blu, e kuqe, jeshile, e verdhë, rozë, e zezë etj.", price_cents: 150, image_url: "/showcase/bracelet.png", category_id: CAT_BY_SLUG["bracelet"], featured: 1, active: 1, created_at: now },
  { id: 14, slug: "trofe-resine", name: "Trofe resine 40/46/52 cm", description: "Trofe e kupë rezine premium me bazament dhe pllakë gdhendëse. Përmasa 40, 46 ose 52 cm. Ideal për çmime sportive, panaire dhe ngjarje korporative.", price_cents: 4500, image_url: "/showcase/trofe.png", category_id: CAT_BY_SLUG["trofe"], featured: 1, active: 1, created_at: now },
  { id: 15, slug: "tabele-a-frame", name: "Tabelë reklamuese A-frame", description: "Tabelë reklamuese plastike tip A-frame, përmasa 50x74 cm, lartësia 93 cm. Ideale për restorante, kafene dhe biznese me akses në rrugë.", price_cents: 8500, image_url: "/showcase/tabele.png", category_id: CAT_BY_SLUG["tabela"], featured: 1, active: 1, created_at: now },
  { id: 16, slug: "erashka-personalizuar", name: "Erashkë e personalizuar", description: "Erashkë me material dru dhe polyester, përmasa 23x2.7x2 cm. Printim full color me logon ose dizajnin tuaj. Ideale për evente verore dhe panaire.", price_cents: 350, image_url: "/showcase/erashka.png", category_id: CAT_BY_SLUG["erashka"], featured: 1, active: 1, created_at: now },
  { id: 17, slug: "set-biznesi-complete", name: "Set biznesi i plotë", description: "Set përfshin: stilolaps, notebook, tote bag, termus, USB, varse celsash, filxhan. Dizajn i unifikuar me identitetin e biznesit tuaj.", price_cents: 8500, image_url: "/showcase/set-biznesi.png", category_id: CAT_BY_SLUG["set-biznesi"], featured: 1, active: 1, created_at: now },
  { id: 18, slug: "pako-promocionale", name: "Pako produkte promocionale", description: "Pako e plotë: uniforme, stilolaps, çakmak, USB, notebook, termus, vula, kartvizita. Brandim me logon tuaj.", price_cents: 12000, image_url: "/showcase/produkte-promocionale.png", category_id: CAT_BY_SLUG["set-biznesi"], featured: 1, active: 1, created_at: now },
  { id: 19, slug: "set-brandim-profesional", name: "Set brandimi profesional", description: "Set i plotë brandimi: qese letre, notebook, stilolaps, çakmak, fletë A4 të printuara — të gjitha me identitetin unik të biznesit tuaj.", price_cents: 9500, image_url: "/showcase/set-creadent.png", category_id: CAT_BY_SLUG["set-biznesi"], featured: 1, active: 1, created_at: now },
];

export const OFFERS_SEED: Offer[] = [
  { id: 1, title: "Dizajn falas për porositë e para", description: "Klientët e rinj përfitojnë dizajn falas të logos në çdo produkt promocional.", discount_percent: 0, active: 1, created_at: now },
  { id: 2, title: "Ulje 15% për porositë mbi 10,000 Lekë", description: "Përfito ulje 15% në çdo porosi mbi 10,000 Lekë. Vlen edhe për setet e biznesit.", discount_percent: 15, active: 1, created_at: now },
];
