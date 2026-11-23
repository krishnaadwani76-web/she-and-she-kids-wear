/**
 * SEO, Metadata & Canonical URL Manager for She & She Kids Wear
 * Enforces strict character limits:
 * - Titles: 50–60 characters
 * - Meta Descriptions: 140–160 characters
 * - Clean, non-stuffed keywords
 * Supports live GitHub Pages deployment and custom domains automatically.
 */

export const GITHUB_PAGES_BASE = "https://krishnaadwani76-web.github.io/she-and-she-kids-wear";
export const CUSTOM_DOMAIN_BASE = "https://sheandshekidswear.com";

/**
 * Standard Site-Wide Metadata Dictionary (strictly 50-60 chars title, 140-160 chars desc)
 */
export const SITE_METADATA = {
  home: {
    title: "She & She Kids Wear | Premium Kids Clothing Store Kota",
    description: "Shop premium kids wear in Dadabari, Kota. Explore party frocks, festive kurtas, and organic baby clothes for ages 1-16. Stylish, soft, and affordable fashion.",
    keywords: "kids clothing Kota, She and She Kids Wear, Dadabari Kota, girls party wear, boys ethnic wear, baby clothes",
    canonicalPath: "/"
  },
  "category/girls": {
    title: "Girls Wear Online Kota | Party Frocks & Festive Dresses",
    description: "Shop stylish girls wear at She & She Kids Wear Kota. Discover party frocks, festive lehengas, and dresses with itch-free cotton lining for ages 1 to 16 years.",
    keywords: "girls wear Kota, girls party frocks, girls lehenga choli, kids gowns, party dresses girls",
    canonicalPath: "/category/girls"
  },
  "category/boys": {
    title: "Boys Wear Online Kota | Festive Kurtas, Shirts & Tuxedos",
    description: "Explore handsome boys wear at She & She Kids Wear Dadabari. Find pure cotton kurta pajamas, Nehru jackets, linen shirts, and velvet tuxedos for ages 1-16 years.",
    keywords: "boys wear Kota, boys kurta pajama, boys nehru jacket, kids tuxedos, boys formal wear",
    canonicalPath: "/category/boys"
  },
  "category/baby": {
    title: "Baby Wear Store in Kota | Organic Muslin Rompers & Sets",
    description: "Shop gentle baby wear in Kota. 100% organic muslin rompers, soft sleepsuits, and newborn sets crafted for sensitive skin. Order from She & She Kids Wear online!",
    keywords: "baby wear Kota, organic baby rompers, newborn sleepsuits, muslin baby clothes, infant wear",
    canonicalPath: "/category/baby"
  },
  "category/party": {
    title: "Kids Party Wear in Kota | Festive Gowns, Suits & Frocks",
    description: "Celebrate with kids party wear from She & She Kids Wear Kota. Shop birthday frocks, royal tuxedos, and wedding ethnic outfits for boys and girls aged 1 to 16.",
    keywords: "kids party wear Kota, birthday dress kids, wedding ethnic kidswear, kids tuxedos, party frocks",
    canonicalPath: "/category/party"
  },
  "category/casual": {
    title: "Kids Casual Wear in Kota | Cotton Playwear & Daily Sets",
    description: "Shop kids casual wear at She & She Kids Wear Kota. Soft cotton dungarees, daily tees, tiered dresses, and joggers made for all-day comfort. Buy online today!",
    keywords: "kids casual wear Kota, cotton kids clothes, kids dungarees, daily playwear, comfortable kidswear",
    canonicalPath: "/category/casual"
  },
  "category/new": {
    title: "New Kids Clothing in Kota | Latest Arrivals Collection",
    description: "Discover the newest kidswear collection at She & She Kids Wear Dadabari. Fresh seasonal styles, trendy frocks, and ethnic outfits for girls and boys aged 1-16.",
    keywords: "new kids clothing Kota, latest kidswear collection, fresh arrivals kids fashion, new baby wear",
    canonicalPath: "/category/new"
  },
  "category/bestsellers": {
    title: "Best Selling Kids Clothes in Kota | Top Rated Fashion",
    description: "Browse bestselling kids outfits loved by 5,000+ happy parents in Kota. Top-rated party frocks, festive kurtas, and organic baby sets. Shop top picks today!",
    keywords: "best selling kids clothes Kota, top rated kidswear, popular party frocks, parent favorite clothes",
    canonicalPath: "/category/bestsellers"
  },
  contact: {
    title: "Contact She & She Kids Wear | Dadabari Circle Kota Store",
    description: "Visit She & She Kids Wear at Main Dadabari Circle, Kota or call 8824844263. Connect on WhatsApp for instant sizing assistance, store pickup, and orders.",
    keywords: "She and She Kids Wear contact, Dadabari Kota clothing store, kids wear phone number, store address Kota",
    canonicalPath: "/contact"
  },
  about: {
    title: "About She & She Kids Wear | Top Kidswear Brand in Kota",
    description: "Learn how She & She Kids Wear brings stylish, skin-friendly kids fashion to Kota families. Handcrafted quality, 100% cotton linings, and care for ages 1 to 16.",
    keywords: "about She and She Kids Wear, kids clothing brand Kota, kids wear Dadabari store, hypoallergenic kidswear",
    canonicalPath: "/about"
  },
  "size-guide": {
    title: "Kids Wear Size Guide (1-16 Years) | She & She Kids Wear",
    description: "Find the perfect fit for your child with our Indian standard kids wear size guide. Detailed chest, length, and height charts for girls, boys, and toddlers.",
    keywords: "kids wear size guide, Indian kids size chart, children clothes measurements, kids clothing sizes 1-16",
    canonicalPath: "/size-guide"
  },
  "track-order": {
    title: "Track Your Order Live | She & She Kids Wear Kota Store",
    description: "Track your She & She Kids Wear order status in real time. Enter your Order ID or registered mobile number for instant courier updates and delivery estimates.",
    keywords: "track order kidswear, shipment status, She and She Kids Wear delivery, order tracker Kota",
    canonicalPath: "/track-order"
  }
};

/**
 * 12 Product Specific Metadata (strictly 50-60 chars title, 140-160 chars desc)
 */
export const PRODUCT_METADATA = {
  "rose-blush-princess-tulle-party-frock": {
    title: "Rose Blush Princess Tulle Party Frock | Girls Wear Kota",
    description: "Buy Rose Blush Princess Tulle Party Frock at She & She Kids Wear Kota. Voluminous pastel layers with 100% hypoallergenic cotton lining for birthday twirls.",
    keywords: "princess tulle frock, girls birthday dress, party frock Kota, pink tulle dress kids"
  },
  "pastel-mint-kurta-pajama-floral-nehru-jacket": {
    title: "Pastel Mint Kurta Pajama with Floral Jacket | Boys Wear",
    description: "Shop boys pastel mint kurta pajama set with floral woven Nehru jacket at She & She Kids Wear Kota. Pure Chanderi cotton tailored for festive celebrations.",
    keywords: "boys kurta pajama, floral nehru jacket, festive ethnic wear boys, boys traditional dress"
  },
  "organic-muslin-cloud-baby-romper-bonnet-set": {
    title: "Organic Muslin Baby Romper & Bonnet Set | Kota Baby Wear",
    description: "Order GOTS certified organic muslin baby romper and sun bonnet set at She & She Kids Wear. Ultra-breathable, gentle on sensitive skin, with snap buttons.",
    keywords: "organic muslin romper, baby bonnet set, newborn organic clothes, soft baby wear Kota"
  },
  "sunshine-yellow-floral-anarkali-kurta-dupatta-set": {
    title: "Sunshine Yellow Floral Anarkali Kurta Set | Girls Ethnic",
    description: "Shop sunshine yellow floral anarkali kurta set with dupatta at She & She Kids Wear Kota. Pure mulmul cotton with Gota Patti detailing for festive joy.",
    keywords: "yellow anarkali kids, girls festive kurta set, gota patti dress kids, Indian ethnic wear girls"
  },
  "classic-linen-chambray-shirt-chino-shorts-set": {
    title: "Linen Chambray Shirt & Chino Shorts Set | Boys Casual",
    description: "Buy boys classic linen chambray shirt and chino shorts combo at She & She Kids Wear Dadabari. Breathable European linen blend tailored for summer outings.",
    keywords: "boys linen shirt, chino shorts set, summer boys casual, boys stylish outfits Kota"
  },
  "pastel-lavender-flutter-sleeve-tiered-dress": {
    title: "Lavender Flutter Sleeve Tiered Dress | Girls Cotton Frock",
    description: "Explore pastel lavender flutter sleeve tiered cotton dress for girls at She & She Kids Wear Kota. Airy poplin cotton with dobby texture for all-day comfort.",
    keywords: "girls tiered dress, lavender cotton frock, flutter sleeve dress kids, casual girls wear"
  },
  "royal-navy-bandhgala-velvet-tuxedo-set": {
    title: "Royal Navy Bandhgala Velvet Tuxedo Set | Boys Suits Kota",
    description: "Tailored 3-piece royal navy velvet bandhgala tuxedo for young boys at She & She Kids Wear. Satin lapel blazer, cotton shirt, and trousers for weddings.",
    keywords: "boys velvet tuxedo, bandhgala suit kids, boys wedding suit Kota, royal navy tuxedo boys"
  },
  "peaches-cream-floral-brocade-lehenga-choli-set": {
    title: "Peach Floral Brocade Lehenga Choli Set | Girls Ethnic",
    description: "Buy royal Banarasi silk brocade lehenga choli set with organza dupatta at She & She Kids Wear Kota. Pure cotton can-can lining for twirls without irritation.",
    keywords: "kids lehenga choli, banarasi brocade kids lehenga, girls bridal wear, ethnic gown kids"
  },
  "sweet-dreams-pastel-striped-cotton-sleepsuit-set": {
    title: "Pastel Striped Cotton Baby Sleepsuit Set | She & She",
    description: "Shop 2-pack combed interlock cotton baby sleepsuits at She & She Kids Wear Kota. Features two-way safety zipper, chin guard, and non-slip silicone foot grips.",
    keywords: "baby sleepsuit pack, cotton baby onesie, infant nightwear Kota, newborn zip sleepsuit"
  },
  "safari-explorer-cotton-dungaree-striped-tee-set": {
    title: "Safari Explorer Cotton Dungaree & Tee Set | Boys Casual",
    description: "Order rugged 100% twill cotton dungaree and striped jersey t-shirt set at She & She Kids Wear Kota. Adjustable straps and kangaroo pockets for play days.",
    keywords: "boys cotton dungaree, kids overalls set, boys playwear, toddler dungaree Kota"
  },
  "embroidered-peplum-kurti-dhoti-pant-set": {
    title: "Embroidered Peplum Kurti & Dhoti Pant Set | Girls Wear",
    description: "Shop stylish mirror-work peplum kurti and soft dhoti pant set at She & She Kids Wear Kota. Pure cotton lined festive Indo-Western wear for girls ages 2-14.",
    keywords: "peplum kurti dhoti set, girls indo western, mirror work kidswear, festive ethnic girls"
  },
  "cozy-bear-fleece-hooded-jacket-joggers": {
    title: "Cozy Bear Fleece Hooded Jacket & Joggers | Kids Winter",
    description: "Keep your little ones warm with ultra-soft Sherpa bear fleece hooded jacket and joggers set from She & She Kids Wear Kota. 100% jersey cotton inner lining.",
    keywords: "kids winter fleece set, bear hooded jacket kids, cozy track set kids, winter kidswear Kota"
  }
};

/**
 * Resolves the active base URL dynamically:
 * - On GitHub Pages: https://krishnaadwani76-web.github.io/she-and-she-kids-wear
 * - On custom domain (e.g. sheandshekidswear.com): uses that custom origin
 */
export function getActiveBaseUrl() {
  if (typeof window !== "undefined" && window.location) {
    const hostname = window.location.hostname;
    const origin = window.location.origin;

    if (hostname.endsWith("github.io")) {
      const parts = window.location.pathname.split("/").filter(Boolean);
      const repo = parts.length > 0 ? parts[0] : "she-and-she-kids-wear";
      return `${origin}/${repo}`;
    }

    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return origin;
    }
  }
  return GITHUB_PAGES_BASE;
}

/**
 * Clean any tracking parameters (UTMs, fbclid, gclid, etc.) and arbitrary queries from a path/hash
 * @param {string} inputPath
 * @returns {string} Clean canonical path
 */
export function sanitizeCanonicalPath(inputPath = "") {
  if (!inputPath || inputPath === "/" || inputPath === "#" || inputPath === "#home") {
    return "";
  }

  let path = inputPath;
  try {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      const parsed = new URL(path);
      path = parsed.pathname + parsed.search + parsed.hash;
    }
  } catch (e) { }

  let [beforeHash, hashPart] = path.includes("#") ? path.split("#") : [path, ""];

  if (beforeHash.includes("?")) beforeHash = beforeHash.split("?")[0];
  if (hashPart && hashPart.includes("?")) hashPart = hashPart.split("?")[0];

  beforeHash = beforeHash.replace(/^\/she-and-she-kids-wear\/?/, "");

  let cleanRoute = hashPart || beforeHash || "";
  cleanRoute = cleanRoute.replace(/^#/, "").trim();

  if (!cleanRoute || cleanRoute === "/" || cleanRoute === "home" || cleanRoute === "index.html") {
    return "";
  }

  if (!cleanRoute.startsWith("/")) {
    cleanRoute = "/" + cleanRoute;
  }

  return cleanRoute;
}

/**
 * Builds an absolute HTTPS canonical URL on the active live domain
 * @param {string} routeOrPath
 * @returns {string} Absolute HTTPS canonical URL
 */
export function buildCanonicalUrl(routeOrPath = "") {
  const base = getActiveBaseUrl();
  const clean = sanitizeCanonicalPath(routeOrPath);
  if (!clean || clean === "/") {
    return `${base}/`;
  }
  return `${base}${clean.startsWith("/") ? clean : "/" + clean}`;
}

/**
 * Sets or updates the self-referencing canonical URL in the HTML <head>.
 * Guarantees exactly ONE canonical tag exists in <head>.
 * Also updates Open Graph <meta property="og:url"> for SEO/social consistency.
 *
 * @param {string} routeOrPath
 * @returns {string} The active canonical URL
 */
export function setCanonicalUrl(routeOrPath = "") {
  if (typeof document === "undefined") return buildCanonicalUrl(routeOrPath);

  const canonicalUrl = buildCanonicalUrl(routeOrPath);

  const existingLinks = document.querySelectorAll('link[rel="canonical"]');
  let canonicalEl = null;

  if (existingLinks.length > 0) {
    canonicalEl = existingLinks[0];
    for (let i = 1; i < existingLinks.length; i++) {
      existingLinks[i].parentNode.removeChild(existingLinks[i]);
    }
  } else {
    canonicalEl = document.createElement("link");
    canonicalEl.setAttribute("rel", "canonical");
    canonicalEl.setAttribute("id", "canonical-url");
    document.head.appendChild(canonicalEl);
  }

  canonicalEl.setAttribute("href", canonicalUrl);

  let ogUrlEl = document.querySelector('meta[property="og:url"]');
  if (!ogUrlEl) {
    ogUrlEl = document.createElement("meta");
    ogUrlEl.setAttribute("property", "og:url");
    document.head.appendChild(ogUrlEl);
  }
  ogUrlEl.setAttribute("content", canonicalUrl);

  return canonicalUrl;
}

/**
 * Updates full page SEO metadata (<title>, description, keywords, og:tags, canonical)
 * @param {Object} metadata
 * @param {string} metadata.title
 * @param {string} metadata.description
 * @param {string} metadata.keywords
 * @param {string} metadata.canonicalPath
 */
export function updatePageMetadata({ title, description, keywords, canonicalPath }) {
  if (typeof document === "undefined") return;

  // 1. Update <title> and og:title
  if (title) {
    document.title = title;
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", title);
  }

  // 2. Update <meta name="description"> and og:description
  if (description) {
    let descEl = document.querySelector('meta[name="description"]');
    if (!descEl) {
      descEl = document.createElement("meta");
      descEl.setAttribute("name", "description");
      document.head.appendChild(descEl);
    }
    descEl.setAttribute("content", description);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement("meta");
      ogDesc.setAttribute("property", "og:description");
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute("content", description);
  }

  // 3. Update <meta name="keywords">
  if (keywords) {
    let kwEl = document.querySelector('meta[name="keywords"]');
    if (!kwEl) {
      kwEl = document.createElement("meta");
      kwEl.setAttribute("name", "keywords");
      document.head.appendChild(kwEl);
    }
    kwEl.setAttribute("content", keywords);
  }

  // 4. Update Canonical URL
  if (canonicalPath !== undefined) {
    setCanonicalUrl(canonicalPath);
  }
}

/**
 * Updates metadata for standard named routes (e.g. 'category/girls', 'contact', etc.)
 * @param {string} routeKey
 */
export function applyRouteMetadata(routeKey) {
  const meta = SITE_METADATA[routeKey] || SITE_METADATA.home;
  updatePageMetadata(meta);
}

/**
 * Updates metadata for dynamic product page
 * @param {Object} product
 */
export function applyProductMetadata(product) {
  if (!product) return;
  const slug = product.slug || product.id;

  if (product.seoTitle && product.seoDescription) {
    updatePageMetadata({
      title: product.seoTitle,
      description: product.seoDescription,
      keywords: product.seoKeywords || `${product.name}, kids wear Kota, She & She Kids Wear`,
      canonicalPath: `/product/${slug}`
    });
    return;
  }

  const meta = PRODUCT_METADATA[slug];

  if (meta) {
    updatePageMetadata({
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
      canonicalPath: `/product/${slug}`
    });
  } else {
    // Fallback conforming strictly to 50-60 title and 140-160 desc limits
    let rawTitle = `${product.name} | She & She Kids Wear Kota`;
    if (rawTitle.length > 60) {
      rawTitle = `${product.name.slice(0, 30)}... | She & She Kota`;
    }
    while (rawTitle.length < 50) {
      rawTitle += " Store";
    }

    let rawDesc = `Buy ${product.name} at She & She Kids Wear Dadabari Kota. Premium quality kidswear designed with comfort and stylish finish. Order online today!`;
    if (rawDesc.length > 160) {
      rawDesc = rawDesc.slice(0, 157) + "...";
    }
    while (rawDesc.length < 140) {
      rawDesc += " Quick delivery in Kota.";
    }

    updatePageMetadata({
      title: rawTitle,
      description: rawDesc,
      keywords: `${product.name}, kids clothing Kota, She and She Kids Wear`,
      canonicalPath: `/product/${slug}`
    });
  }
}
