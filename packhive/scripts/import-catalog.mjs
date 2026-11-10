import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function get(url) {
  return new Promise((res, rej) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (r) => {
        let d = "";
        r.on("data", (c) => (d += c));
        r.on("end", () => res({ status: r.statusCode, body: d, headers: r.headers }));
      })
      .on("error", rej);
  });
}

async function fetchAllProducts() {
  const all = [];
  let page = 1;
  while (true) {
    const url = `https://packagingbox.pk/wp-json/wc/store/v1/products?per_page=100&page=${page}`;
    const r = await get(url);
    if (r.status !== 200) break;
    const items = JSON.parse(r.body);
    if (!items.length) break;
    all.push(...items);
    console.log(`page ${page}: ${items.length} (total ${all.length})`);
    const totalPages = Number(r.headers["x-wp-totalpages"] || 1);
    if (page >= totalPages) break;
    page++;
  }
  return all;
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/&amp;/g, "and")
    .replace(/&#038;/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function decode(s) {
  return String(s || "")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/<[^>]+>/g, "")
    .trim();
}

function mapCategory(cats) {
  const map = {
    "kraft-standup-pouches": "kraft-pouches",
    "zam-zam-packaging": "zamzam",
    "home-shifting-boxes": "shipping",
    "coffee-cup": "cups",
    "coffee-straws": "straws",
    "bakery-packaging": "bakery",
    "cupcake-boxes": "bakery",
    "cake-boxes": "bakery",
    "cavity-box": "bakery",
    "eco-cutlery": "cutlery",
    "kraft-food-packaging": "eco",
    "bagasse-packaging": "eco",
    "food-container-bucket": "containers",
    "ice-cream-cup": "icecream",
    "kraft-paper-bags": "kraft-bags",
    "kraft-bowls": "salad",
    "round-kraft-bowl": "salad",
    "burger-box": "burger",
    "coffee-disposable-glass": "plastic-cup",
    "acrylic-box": "acrylic",
    "heart-shape-chocolate-box": "heart",
    "pizza-box": "pizza",
    "tin-boxes": "tin",
    "cold-drink-cup": "cups",
    "customize-coffee-cup": "cups",
    "retort-pouch": "kraft-pouches",
    "jelly-cup": "icecream",
  };
  for (const c of cats || []) {
    if (map[c.slug]) return map[c.slug];
  }
  const names = (cats || []).map((c) => `${c.slug} ${c.name}`).join(" ").toLowerCase();
  if (names.includes("pouch")) return "kraft-pouches";
  if (names.includes("bakery") || names.includes("cake") || names.includes("cupcake") || names.includes("chocolate"))
    return "bakery";
  if (names.includes("cup") || names.includes("coffee")) return "cups";
  if (names.includes("straw")) return "straws";
  if (names.includes("pizza")) return "pizza";
  if (names.includes("burger")) return "burger";
  if (names.includes("tin")) return "tin";
  if (names.includes("bag")) return "kraft-bags";
  if (names.includes("ice")) return "icecream";
  if (names.includes("cutlery") || names.includes("wooden")) return "cutlery";
  if (names.includes("acrylic")) return "acrylic";
  if (names.includes("heart")) return "heart";
  if (names.includes("shipping") || names.includes("shifting") || names.includes("corrugated")) return "shipping";
  if (names.includes("zam")) return "zamzam";
  if (names.includes("bowl") || names.includes("salad")) return "salad";
  if (names.includes("container") || names.includes("tray") || names.includes("bucket")) return "containers";
  if (names.includes("eco") || names.includes("kraft") || names.includes("bagasse")) return "eco";
  return "eco";
}

function download(url, dest) {
  if (!url) return Promise.resolve(false);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) return Promise.resolve(true);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    const fail = () => {
      try {
        file.close();
        fs.unlinkSync(dest);
      } catch {}
      resolve(false);
    };
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (r) => {
        if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
          file.close();
          https
            .get(r.headers.location, { headers: { "User-Agent": "Mozilla/5.0" } }, (r2) => {
              if (r2.statusCode !== 200) return fail();
              const f2 = fs.createWriteStream(dest);
              r2.pipe(f2);
              f2.on("finish", () => {
                f2.close();
                resolve(true);
              });
            })
            .on("error", fail);
          return;
        }
        if (r.statusCode !== 200) return fail();
        r.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve(true);
        });
      })
      .on("error", fail);
  });
}

const homeCats = [
  { slug: "kraft-pouches", name: "Kraft Standup Pouches" },
  { slug: "zamzam", name: "Zam Zam Packaging" },
  { slug: "shipping", name: "Home Shifting Boxes" },
  { slug: "cups", name: "Coffee Cup" },
  { slug: "straws", name: "Coffee Straws" },
  { slug: "bakery", name: "Bakery Packaging" },
  { slug: "cutlery", name: "Eco Cutlery" },
  { slug: "eco", name: "Eco Food Packaging" },
  { slug: "containers", name: "Food Containers" },
  { slug: "icecream", name: "Ice Cream Cup" },
  { slug: "kraft-bags", name: "Kraft Paper Bags" },
  { slug: "salad", name: "Salad Bowls" },
  { slug: "burger", name: "Burger Box" },
  { slug: "plastic-cup", name: "Coffee Disposable Glass" },
  { slug: "acrylic", name: "Acrylic Box" },
  { slug: "heart", name: "Heart Shape Chocolate Box" },
  { slug: "pizza", name: "Pizza Box" },
  { slug: "tin", name: "Tin Boxes" },
];

const catImageMap = {
  "kraft-pouches":
    "https://packagingbox.pk/wp-content/uploads/2026/05/White-Kraft-Zipper-Pouch-with-Window.webp",
  zamzam: "https://packagingbox.pk/wp-content/uploads/2026/05/Clear-Plastic-Bottle.webp",
  shipping: "https://packagingbox.pk/wp-content/uploads/2026/06/Corrugated-Shipping-Boxes.webp",
  cups: "https://packagingbox.pk/wp-content/uploads/2026/05/Coffee-Cup.webp",
  straws: "https://packagingbox.pk/wp-content/uploads/2026/06/Black-Drinking-Straws.webp",
  bakery: "https://packagingbox.pk/wp-content/uploads/2026/06/Fruit-Gift-Boxes.webp",
  cutlery: "https://packagingbox.pk/wp-content/uploads/2026/06/Wooden-Cutlery-Set.webp",
  eco: "https://packagingbox.pk/wp-content/uploads/2026/06/Eco-Food-Packaging-1.webp",
  containers: "https://packagingbox.pk/wp-content/uploads/2026/06/Eco-Food-Containers.webp",
  icecream: "https://packagingbox.pk/wp-content/uploads/2026/05/Ice-Cream-Paper-Cups.webp",
  "kraft-bags": "https://packagingbox.pk/wp-content/uploads/2026/05/Kraft-Paper-Bag.webp",
  salad: "https://packagingbox.pk/wp-content/uploads/2026/06/Two-Healthy-Salad-Bowls.webp",
  burger: "https://packagingbox.pk/wp-content/uploads/2026/05/White-Burger-Box.webp",
  "plastic-cup": "https://packagingbox.pk/wp-content/uploads/2026/05/Clear-Plastic-Cup.webp",
  acrylic: "https://packagingbox.pk/wp-content/uploads/2026/05/Round-Clear-Chocolate-Containers.webp",
  heart: "https://packagingbox.pk/wp-content/uploads/2026/05/Heart-Shape-Chocolate-Gift-Box.webp",
  pizza: "https://packagingbox.pk/wp-content/uploads/2026/05/Custom-Printed-Pizza-Box.webp",
  tin: "https://packagingbox.pk/wp-content/uploads/2026/05/Gold-Round-Tin-Containers-Set-of-7.webp",
};

const productsRaw = await fetchAllProducts();
fs.writeFileSync(path.join(root, "scraped-raw.json"), JSON.stringify(productsRaw, null, 2));
console.log("raw products", productsRaw.length);

const home = await get("https://packagingbox.pk/");
const heroMatches = [
  ...home.body.matchAll(
    /https:\/\/packagingbox\.pk\/wp-content\/uploads\/[^"'\\\s>]+\.(?:webp|jpg|png|jpeg)/gi
  ),
];
const uniqueHero = [...new Set(heroMatches.map((m) => m[0].replace(/-\d+x\d+(?=\.)/, "")))];
console.log("home images", uniqueHero.length);

console.log("Downloading category images...");
for (const [slug, url] of Object.entries(catImageMap)) {
  const ok = await download(url, path.join(root, "public", "categories", `${slug}.webp`));
  console.log(slug, ok ? "ok" : "FAIL");
}

const products = [];
const seen = new Set();
let i = 0;
console.log("Downloading product images...");
for (const p of productsRaw) {
  const slug = p.slug || slugify(decode(p.name));
  if (seen.has(slug)) continue;
  seen.add(slug);
  const name = decode(p.name);
  const category = mapCategory(p.categories || []);
  const prices = p.prices || {};
  const minor = Math.pow(10, Number(prices.currency_minor_unit || 2));
  const min = Number(prices.price_range?.min_amount || prices.price || 0) / minor;
  const max = Number(prices.price_range?.max_amount || prices.price || 0) / minor;
  const priceFrom = Math.round(min) || 0;
  const priceTo = Math.round(max) && Math.round(max) !== priceFrom ? Math.round(max) : undefined;
  const imgUrl = p.images?.[0]?.src || "";
  const cleanUrl = imgUrl.replace(/-\d+x\d+(?=\.(webp|png|jpe?g))/i, "");
  const ext = path.extname(new URL(cleanUrl || "https://x/a.webp").pathname) || ".webp";
  const localName = `${slug}${ext}`;
  const dest = path.join(root, "public", "products", localName);
  if (cleanUrl) {
    const ok = await download(cleanUrl, dest);
    if (!ok && cleanUrl !== imgUrl) await download(imgUrl, dest);
  }
  const description = decode(
    p.short_description ||
      p.description ||
      `${name} available at PackHive with bulk pricing across Pakistan.`
  );
  products.push({
    slug,
    name,
    image: `/products/${localName}`,
    priceFrom: priceFrom || 1000,
    ...(priceTo ? { priceTo } : {}),
    category,
    featured: i < 24,
    description:
      description.slice(0, 280) || `${name} — premium packaging from PackHive Pakistan.`,
  });
  i++;
  if (i % 25 === 0) console.log(`products ${i}/${productsRaw.length}`);
}

const heroMap = [
  {
    file: "standup-pouches.webp",
    prefer:
      uniqueHero.find((u) => /pouch|kraft|standup/i.test(u)) || catImageMap["kraft-pouches"],
  },
  {
    file: "eco-packaging.webp",
    prefer: uniqueHero.find((u) => /eco-food-packaging/i.test(u)) || catImageMap.eco,
  },
  {
    file: "coffee-cups.webp",
    prefer: uniqueHero.find((u) => /coffee-cup/i.test(u)) || catImageMap.cups,
  },
  {
    file: "bakery-boxes.webp",
    prefer: uniqueHero.find((u) => /bakery|fruit-gift|cake/i.test(u)) || catImageMap.bakery,
  },
];
for (const h of heroMap) {
  await download(h.prefer, path.join(root, "public", "hero", h.file));
}

const categoriesOut = homeCats.map((c) => ({
  slug: c.slug,
  name: c.name,
  image: `/categories/${c.slug}.webp`,
}));

const productsTs = products
  .map((p) => {
    const lines = [
      `  {`,
      `    slug: "${p.slug}",`,
      `    name: ${JSON.stringify(p.name)},`,
      `    image: "${p.image}",`,
      `    priceFrom: ${p.priceFrom},`,
    ];
    if (p.priceTo) lines.push(`    priceTo: ${p.priceTo},`);
    lines.push(`    category: "${p.category}",`);
    if (p.featured) lines.push(`    featured: true,`);
    lines.push(`    description: ${JSON.stringify(p.description)},`);
    lines.push(`  },`);
    return lines.join("\n");
  })
  .join("\n");

const dataTs = `export const site = {
  name: "PackHive",
  tagline: "Pakistan's Trusted Food Packaging Partner",
  phone: "+92 327-419-2519",
  phoneHref: "tel:+923274192519",
  phoneAlt: "+92 327-419-2523",
  email: "info@packhive.pk",
  whatsapp: "923274192519",
  whatsappHref: "https://wa.me/923274192519",
  address: "P No 11- Ali Town, R-W- Road Lahore, 54000, Pakistan",
  hours: "Mon – Sat: 9:00 AM – 7:00 PM",
  rating: "4.5",
  customers: "1000+",
};

export type Category = {
  slug: string;
  name: string;
  image: string;
};

export type Product = {
  slug: string;
  name: string;
  image: string;
  priceFrom: number;
  priceTo?: number;
  category: string;
  featured?: boolean;
  description: string;
};

export const heroSlides = [
  {
    eyebrow: "PAKISTAN'S #1 FOOD PACKAGING PARTNER",
    title: "Custom Food Packaging Boxes in Pakistan",
    text: "Premium quality custom printed boxes, pouches & packaging solutions for businesses across Pakistan. Low MOQ, fast turnaround, and 100% brand-matching design.",
    image: "/hero/standup-pouches.webp",
    primary: { label: "Shop Kraft Pouches ›", href: "/shop?cat=kraft-pouches" },
    secondary: { label: "Get Free Quote", href: "/quote" },
  },
  {
    eyebrow: "SUSTAINABLE PACKAGING SOLUTIONS",
    title: "Eco-Friendly Packaging Pakistan",
    text: "Go green without compromising on quality. Our biodegradable & recyclable packaging helps your brand reduce its carbon footprint while looking premium.",
    image: "/hero/eco-packaging.webp",
    primary: { label: "Explore Eco Range ›", href: "/shop?cat=eco" },
    secondary: { label: "Request Sample", href: "/quote" },
  },
  {
    eyebrow: "BRANDED CUP PRINTING",
    title: "Custom Printed Cups & Glasses",
    text: "Make every cup a brand moment. High-quality custom printed paper & plastic cups for cafes, restaurants, events & corporate gifting across Pakistan.",
    image: "/hero/coffee-cups.webp",
    primary: { label: "Order Custom Cups ›", href: "/shop?cat=cups" },
    secondary: { label: "Get a Quote", href: "/quote" },
  },
  {
    eyebrow: "FOOD & BAKERY PACKAGING",
    title: "Custom Bakery Boxes Pakistan",
    text: "From cupcakes to cakes — our custom bakery boxes keep your treats fresh & your brand looking delicious. Food-safe materials, custom sizes & printing.",
    image: "/hero/bakery-boxes.webp",
    primary: { label: "Shop Bakery Boxes ›", href: "/shop?cat=bakery" },
    secondary: { label: "Custom Order", href: "/quote" },
  },
];

export const sideCards = [
  { title: "Eco Packaging", href: "/shop?cat=eco", image: "/hero/eco-packaging.webp" },
  { title: "Custom Cups", href: "/shop?cat=cups", image: "/hero/coffee-cups.webp" },
  { title: "Bakery Boxes", href: "/shop?cat=bakery", image: "/hero/bakery-boxes.webp" },
];

export const categories: Category[] = ${JSON.stringify(categoriesOut, null, 2)};

export const products: Product[] = [
${productsTs}
];

export const productTabs = [
  { id: "all", label: "Food Packaging" },
  { id: "kraft-pouches", label: "Kraft Standup Pouches" },
  { id: "bakery", label: "Bakery Packaging" },
  { id: "cups", label: "Disposable Packaging" },
];

export const reviews = [
  {
    name: "Syed Ahsan Ali",
    text: "Excellent product and got on time.",
  },
  {
    name: "Bilal Tallat",
    text: "I have been purchasing these kraft packaging boxes for a few months now and I am really happy with the quality. They are really sturdy and do not break easily.",
  },
  {
    name: "Afu Tallat",
    text: "I recently bought packaging and was very impressed with the quality. The boxes are sturdy and well-made. The price was also right.",
  },
  {
    name: "Hanan Talat",
    text: "I'm a small business owner and these boxes are perfect for my needs. Easy to use, long-lasting, and great price point.",
  },
  {
    name: "Danial Rafique",
    text: "I've been using Kraft Stand-Up Pouches for over three months. The clear window shows the product while keeping contents safe.",
  },
  {
    name: "Fasiha Ansar",
    text: "I really enjoyed the packaging boxes. Great for any food business — keeps food fresh and protected during delivery.",
  },
];

export function formatPrice(n: number) {
  return \`₨ \${n.toLocaleString("en-PK")}\`;
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(cat?: string | null) {
  if (!cat || cat === "all") return products;
  return products.filter((p) => p.category === cat);
}
`;

fs.writeFileSync(path.join(root, "src", "lib", "data.ts"), dataTs);
fs.writeFileSync(path.join(root, "scraped-products.json"), JSON.stringify(products, null, 2));
console.log("DONE products written:", products.length);
