import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = path.join(DATA_DIR, "eapromo.db");

declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined;
}

function columnExists(db: Database.Database, table: string, column: string): boolean {
  const rows = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  return rows.some((r) => r.name === column);
}

function init(db: Database.Database) {
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
    );
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price_cents INTEGER NOT NULL,
      image_url TEXT,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      featured INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
    );
    CREATE TABLE IF NOT EXISTS offers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      discount_percent INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
    );
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      address TEXT,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
    );
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured, active);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status, created_at);
  `);

  if (!columnExists(db, "orders", "items_json")) {
    db.exec(`ALTER TABLE orders ADD COLUMN items_json TEXT`);
  }
  if (!columnExists(db, "orders", "total_cents")) {
    db.exec(`ALTER TABLE orders ADD COLUMN total_cents INTEGER NOT NULL DEFAULT 0`);
  }

  const count = db.prepare("SELECT COUNT(*) AS n FROM products").get() as { n: number };
  if (count.n === 0) seed(db);
}

function seed(db: Database.Database) {
  const insertCategory = db.prepare(
    "INSERT INTO categories (slug, name, description) VALUES (?, ?, ?)"
  );
  const insertProduct = db.prepare(
    `INSERT INTO products (slug, name, description, price_cents, image_url, category_id, featured)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  const insertOffer = db.prepare(
    "INSERT INTO offers (title, description, discount_percent) VALUES (?, ?, ?)"
  );

  const cats = [
    { slug: "stilolapsa", name: "Stilolapsa", desc: "Stilolapsa promocional me printim ose gdhendje të logos." },
    { slug: "bluza", name: "Bluza & Veshje", desc: "T-shirt, polo dhe veshje me printim ose qëndisje." },
    { slug: "flamur", name: "Flamur reklamues", desc: "Flamur reklamues Beach Flag dhe roll-up me bazament." },
    { slug: "kartvizita", name: "Kartëvizita", desc: "Kartëvizita të printuara me cilësi premium." },
    { slug: "cakmak", name: "Çakmak", desc: "Çakmak promocional të personalizuar." },
    { slug: "mousepad", name: "Mousepad", desc: "Mousepad me printim full color." },
    { slug: "bracelet", name: "Bracelet", desc: "Bracelet silicon me printim të logos." },
    { slug: "trofe", name: "Trofe & Kupa", desc: "Trofe dhe kupa rezine për çmime e ngjarje sportive." },
    { slug: "tabela", name: "Tabela reklamuese", desc: "Tabela A-frame dhe panele reklamuese për ambjente të brendshme dhe të jashtme." },
    { slug: "erashka", name: "Erashka", desc: "Erashka të personalizuara me logo, ideale për evente verore." },
    { slug: "set-biznesi", name: "Set biznesi", desc: "Set i plotë promocional për biznesin tuaj." },
  ];
  const catIds: Record<string, number> = {};
  for (const c of cats) {
    const r = insertCategory.run(c.slug, c.name, c.desc);
    catIds[c.slug] = Number(r.lastInsertRowid);
  }

  const products = [
    // Stilolapsa — no curated EA photo yet, fallback shows EA logo + category script
    { slug: "stilolaps-teresa", name: "Stilolaps Teresa", desc: "Stilolaps me material plastikë soft, gjatësi 14.1 cm. I disponueshëm në ngjyrë të bardhë, të kuqe, blu të errët, blu të hapur dhe të zezë. Printim me logo deri në 4 ngjyra.", price: 120, img: null, cat: "stilolapsa", featured: 1 },
    { slug: "stilolaps-schneider", name: "Stilolaps Schneider Origjinal", desc: "Stilolaps Schneider origjinal me printim të personalizuar. Cilësi premium gjermane, ngjyrë blu shkruajtëse.", price: 280, img: null, cat: "stilolapsa", featured: 0 },
    { slug: "set-stilolapsa-50", name: "Set 50 stilolapsa me logo", desc: "Pako prej 50 copë stilolapsa promocional me printimin e logos suaj. Përfshin dizajnin falas.", price: 4500, img: null, cat: "stilolapsa", featured: 0 },

    // Bluza
    { slug: "tshirt-master-men", name: "T-Shirt Master Men", desc: "T-shirt për meshkuj, 100% pambuk, përmasa S, M, L, XL, XXL, 3XL. Printim ose qëndisje në çdo ngjyrë.", price: 1400, img: "/showcase/tshirt-master.png", cat: "bluza", featured: 1 },
    { slug: "bluze-cotton-personalizuar", name: "Bluzë cotton e personalizuar", desc: "Bluzë pambuku 100% me printim DTF ose qëndisje. Material tekstil cilësor, përmasa standarte S–XXL.", price: 1200, img: null, cat: "bluza", featured: 0 },
    { slug: "polo-uniforme", name: "Polo për uniformë", desc: "Polo me jakë, ideale për uniforma pune. Printim ose qëndisje e logos suaj.", price: 1500, img: null, cat: "bluza", featured: 0 },

    // Flamur
    { slug: "flamur-beach-flag", name: "Flamur Beach Flag", desc: "Flamur reklamues tip Beach Flag me bazament dhe shtizë. Ideal për panaire, evente dhe ambjente të jashtme.", price: 6500, img: null, cat: "flamur", featured: 1 },
    { slug: "roll-up-banner", name: "Roll-up banner 85x200", desc: "Banner roll-up me përmasa 85x200cm, me bazament alumini dhe çantë mbartëse.", price: 5500, img: null, cat: "flamur", featured: 0 },

    // Kartëvizita
    { slug: "kartvizita-200", name: "Kartëvizita 200 copë", desc: "200 copë kartëvizita, printim cilësor i të dy anëve, letër 350gr e laminuar mat ose shkëlqyese.", price: 1800, img: null, cat: "kartvizita", featured: 1 },
    { slug: "kartvizita-500", name: "Kartëvizita 500 copë", desc: "500 copë kartëvizita premium me dizajn falas, finitura mat/shkëlqyese.", price: 3200, img: null, cat: "kartvizita", featured: 0 },

    // Çakmak
    { slug: "cakmak-promocional", name: "Çakmak promocional", desc: "Çakmak metalik me printim 1-ngjyrësh të logos suaj.", price: 250, img: null, cat: "cakmak", featured: 0 },

    // Mousepad
    { slug: "mousepad-full-color", name: "Mousepad full color", desc: "Mousepad me printim full color, bazë gome anti-rrëshqitëse, sipërfaqe tekstili.", price: 450, img: null, cat: "mousepad", featured: 0 },

    // Bracelet
    { slug: "bracelet-silicon", name: "Bracelet silicon i personalizuar", desc: "Bracelet silicon i butë me printim ose embossing të logos. Disponohet në çdo ngjyrë: blu, e kuqe, jeshile, e verdhë, rozë, e zezë etj.", price: 150, img: "/showcase/bracelet.png", cat: "bracelet", featured: 1 },

    // Trofe (new)
    { slug: "trofe-resine", name: "Trofe resine 40/46/52 cm", desc: "Trofe e kupë rezine premium me bazament dhe pllakë gdhendëse. Përmasa 40, 46 ose 52 cm. Ideal për çmime sportive, panaire dhe ngjarje korporative.", price: 4500, img: "/showcase/trofe.png", cat: "trofe", featured: 1 },

    // Tabela
    { slug: "tabele-a-frame", name: "Tabelë reklamuese A-frame", desc: "Tabelë reklamuese plastike tip A-frame, përmasa 50x74 cm, lartësia 93 cm. Ideale për restorante, kafene dhe biznese me akses në rrugë.", price: 8500, img: "/showcase/tabele.png", cat: "tabela", featured: 1 },

    // Erashka
    { slug: "erashka-personalizuar", name: "Erashkë e personalizuar", desc: "Erashkë me material dru dhe polyester, përmasa 23x2.7x2 cm. Printim full color me logon ose dizajnin tuaj. Ideale për evente verore dhe panaire.", price: 350, img: "/showcase/erashka.png", cat: "erashka", featured: 1 },

    // Set biznesi
    { slug: "set-biznesi-complete", name: "Set biznesi i plotë", desc: "Set përfshin: stilolaps, notebook, tote bag, termus, USB, varse celsash, filxhan. Dizajn i unifikuar me identitetin e biznesit tuaj.", price: 8500, img: "/showcase/set-biznesi.png", cat: "set-biznesi", featured: 1 },

    // Pako promocionale e plotë
    { slug: "pako-promocionale", name: "Pako produkte promocionale", desc: "Pako e plotë: uniforme, stilolaps, çakmak, USB, notebook, termus, vula, kartvizita. Brandim me logon tuaj.", price: 12000, img: "/showcase/produkte-promocionale.png", cat: "set-biznesi", featured: 1 },

    // Set brandimi profesional (CREADENT style)
    { slug: "set-brandim-profesional", name: "Set brandimi profesional", desc: "Set i plotë brandimi: qese letre, notebook, stilolaps, çakmak, fletë A4 të printuara — të gjitha me identitetin unik të biznesit tuaj.", price: 9500, img: "/showcase/set-creadent.png", cat: "set-biznesi", featured: 1 },
  ];
  for (const p of products) {
    insertProduct.run(p.slug, p.name, p.desc, p.price, p.img, catIds[p.cat] ?? null, p.featured);
  }

  insertOffer.run(
    "Dizajn falas për porositë e para",
    "Klientët e rinj përfitojnë dizajn falas të logos në çdo produkt promocional.",
    0
  );
  insertOffer.run(
    "Ulje 15% për porositë mbi 10,000 Lekë",
    "Përfito ulje 15% në çdo porosi mbi 10,000 Lekë. Vlen edhe për setet e biznesit.",
    15
  );
}

export function getDb(): Database.Database {
  if (!globalThis.__db) {
    const db = new Database(DB_PATH);
    init(db);
    globalThis.__db = db;
  }
  return globalThis.__db;
}
