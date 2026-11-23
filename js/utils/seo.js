/**
 * SEO & Canonical URL Manager for She & She Kids Wear
 * Enforces production canonical domain (https://sheandshekidswear.com),
 * guarantees a single canonical tag in <head>, generates dynamic slug-based
 * product canonical URLs, and strips tracking parameters (UTM, fbclid, etc.).
 */

export const PRODUCTION_DOMAIN = "https://sheandshekidswear.com";

/**
 * Clean any tracking parameters (UTMs, fbclid, gclid, etc.) and arbitrary queries from a path/hash
 * Normalizes routes into clean canonical paths (e.g., #category/girls -> /category/girls).
 * @param {string} inputPath
 * @returns {string} Clean canonical path
 */
export function sanitizeCanonicalPath(inputPath = "") {
  if (!inputPath || inputPath === "/" || inputPath === "#" || inputPath === "#home") {
    return "";
  }

  // Remove full origin if passed inadvertently (e.g. localhost, github.io, preview URL)
  let path = inputPath;
  try {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      const parsed = new URL(path);
      path = parsed.pathname + parsed.search + parsed.hash;
    }
  } catch (e) {
    // Keep path as is if parse fails
  }

  // Separate hash and search queries
  let [beforeHash, hashPart] = path.includes("#") ? path.split("#") : [path, ""];

  // Clean beforeHash of query strings (e.g. ?utm_source=...)
  if (beforeHash.includes("?")) {
    beforeHash = beforeHash.split("?")[0];
  }

  // Clean hashPart of query strings (e.g. #category/girls?utm_source=fb)
  if (hashPart && hashPart.includes("?")) {
    hashPart = hashPart.split("?")[0];
  }

  // Choose the active route part (hash takes priority for in-page navigation)
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
 * Builds an absolute HTTPS canonical URL on the live production domain
 * @param {string} routeOrPath
 * @returns {string} Absolute HTTPS canonical URL
 */
export function buildCanonicalUrl(routeOrPath = "") {
  const clean = sanitizeCanonicalPath(routeOrPath);
  if (!clean || clean === "/") {
    return `${PRODUCTION_DOMAIN}/`;
  }
  return `${PRODUCTION_DOMAIN}${clean.startsWith("/") ? clean : "/" + clean}`;
}

/**
 * Sets or updates the self-referencing canonical URL in the HTML <head>.
 * Guarantees exactly ONE canonical tag exists in <head>.
 * Also updates Open Graph <meta property="og:url"> for SEO/social consistency.
 *
 * @param {string} routeOrPath - e.g. '', '#category/girls', '/category/girls', '#product/rose-blush-princess-tulle-party-frock'
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
