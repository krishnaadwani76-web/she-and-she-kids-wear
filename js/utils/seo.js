/**
 * SEO & Canonical URL Manager for She & She Kids Wear
 * Supports live GitHub Pages deployment and custom domains automatically.
 * Guarantees a single canonical tag in <head>, dynamic product slugs,
 * and strips tracking parameters (UTM, fbclid, etc.).
 */

export const GITHUB_PAGES_BASE = "https://krishnaadwani76-web.github.io/she-and-she-kids-wear";
export const CUSTOM_DOMAIN_BASE = "https://sheandshekidswear.com";

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

  // Remove full origin if passed inadvertently
  let path = inputPath;
  try {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      const parsed = new URL(path);
      path = parsed.pathname + parsed.search + parsed.hash;
    }
  } catch (e) { }

  // Separate hash and search queries
  let [beforeHash, hashPart] = path.includes("#") ? path.split("#") : [path, ""];

  if (beforeHash.includes("?")) {
    beforeHash = beforeHash.split("?")[0];
  }

  if (hashPart && hashPart.includes("?")) {
    hashPart = hashPart.split("?")[0];
  }

  // Strip repository prefix if present in beforeHash (e.g. /she-and-she-kids-wear/...)
  beforeHash = beforeHash.replace(/^\/she-and-she-kids-wear\/?/, "");

  // Choose the active route part
  let cleanRoute = hashPart || beforeHash || "";
  cleanRoute = cleanRoute.replace(/^#/, "").trim();

  // Root / Home equivalents
  if (!cleanRoute || cleanRoute === "/" || cleanRoute === "home" || cleanRoute === "index.html") {
    return "";
  }

  // Format with leading slash
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
 * @param {string} routeOrPath - e.g. '', '/category/girls', '/product/rose-blush-princess-tulle-party-frock'
 * @returns {string} The active canonical URL
 */
export function setCanonicalUrl(routeOrPath = "") {
  if (typeof document === "undefined") return buildCanonicalUrl(routeOrPath);

  const canonicalUrl = buildCanonicalUrl(routeOrPath);

  // 1. Manage <link rel="canonical"> in <head>
  const existingLinks = document.querySelectorAll('link[rel="canonical"]');
  let canonicalEl = null;

  if (existingLinks.length > 0) {
    canonicalEl = existingLinks[0];
    // Remove any duplicate canonical tags to guarantee exactly one
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

  // 2. Synchronize Open Graph URL <meta property="og:url">
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
 * Returns the current canonical URL from the DOM
 */
export function getCurrentCanonicalUrl() {
  if (typeof document === "undefined") return buildCanonicalUrl();
  const el = document.querySelector('link[rel="canonical"]');
  return el ? el.getAttribute("href") : buildCanonicalUrl();
}
