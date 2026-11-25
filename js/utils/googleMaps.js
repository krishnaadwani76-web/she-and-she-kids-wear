// Source: Google Maps Platform Code Assist
/**
 * Google Maps Platform Integration Utility
 *
 * Implements Google Maps JavaScript API with modern AdvancedMarkerElement,
 * PinElement, and cloud Map IDs, strictly complying with Google Maps Platform standards.
 * Attribution ID: gmp_git_agentskills_v1
 */

import { STORE_INFO } from "../data/seedProducts.js";

/**
 * Loads the Google Maps JavaScript API dynamically if an API key is supplied.
 * @param {string} apiKey - Google Maps API Key
 * @returns {Promise<typeof google.maps>}
 */
export function loadGoogleMapsScript(apiKey) {
  return new Promise((resolve, reject) => {
    if (typeof window.google !== "undefined" && window.google.maps) {
      resolve(window.google.maps);
      return;
    }

    const existingScript = document.getElementById("google-maps-js-sdk");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.google.maps));
      existingScript.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-js-sdk";
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey
    )}&v=weekly&libraries=maps,marker&loading=async`;

    script.onload = () => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error("Google Maps API failed to load."));
      }
    };
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
}

/**
 * Initializes an interactive Google Map with AdvancedMarkerElement for She & She Kids Wear.
 * Complies with Google Maps Platform modern guidelines (mapId required for AdvancedMarkerElement,
 * explicit height container, internal usage attribution).
 *
 * @param {HTMLElement|string} container - DOM element or ID
 * @param {Object} [customOptions] - Optional configuration overrides
 */
export async function initStoreMap(container, customOptions = {}) {
  const targetEl = typeof container === "string" ? document.getElementById(container) : container;
  if (!targetEl) return null;

  const apiKey =
    window.GOOGLE_MAPS_API_KEY ||
    localStorage.getItem("GOOGLE_MAPS_API_KEY") ||
    customOptions.apiKey;

  if (!apiKey) {
    console.info(
      "[Google Maps] No API key provided; falling back to verified Google Maps Place Embed with shop marker pin."
    );
    return null;
  }

  try {
    await loadGoogleMapsScript(apiKey);

    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    const position = customOptions.coords || STORE_INFO.coords || { lat: 25.1580017, lng: 75.8273144 };

    // Google Maps options with mandatory Map ID for AdvancedMarkerElement
    // and internal usage attribution tag
    const map = new Map(targetEl, {
      center: position,
      zoom: customOptions.zoom || 17,
      mapId: customOptions.mapId || "DEMO_MAP_ID",
      internalUsageAttributionIds: ["gmp_git_agentskills_v1"],
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true
    });

    // Custom branded PinElement (Rose / Pink palette matching boutique)
    const pin = new PinElement({
      background: "#BE185D",
      borderColor: "#831843",
      glyphColor: "#FFFFFF",
      scale: 1.2
    });

    // Create modern AdvancedMarkerElement
    const marker = new AdvancedMarkerElement({
      map,
      position,
      title: `${STORE_INFO.name} - Sethiya Complex, Dadabari, Kota`,
      content: pin.element
    });

    // Info Window with full store details & directions link
    const infoWindowContent = `
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 6px; max-width: 260px; color: #1e293b;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <div style="width: 28px; height: 28px; border-radius: 8px; background: #be185d; color: #fff; font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 11px;">S&S</div>
          <div>
            <div style="font-weight: 800; font-size: 13px; color: #0f172a; line-height: 1.2;">${STORE_INFO.name}</div>
            <div style="font-size: 10px; color: #be185d; font-weight: 600;">Sethiya Complex • Dadabari, Kota</div>
          </div>
        </div>
        <div style="font-size: 11px; color: #475569; margin-bottom: 8px; line-height: 1.35;">
          ${STORE_INFO.address}
        </div>
        <div style="display: flex; gap: 6px; align-items: center; margin-top: 6px;">
          <a
            href="${STORE_INFO.mapsUrl}"
            target="_blank"
            rel="noopener noreferrer"
            style="background: #be185d; color: #ffffff; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; text-decoration: none; display: inline-block;"
          >
            Get Directions ↗
          </a>
          <a
            href="tel:${STORE_INFO.phone.replace(/\\s+/g, '')}"
            style="background: #f1f5f9; color: #0f172a; padding: 6px 10px; border-radius: 8px; font-size: 11px; font-weight: 600; text-decoration: none; display: inline-block;"
          >
            Call Store
          </a>
        </div>
      </div>
    `;

    const infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent,
      ariaLabel: STORE_INFO.name
    });

    marker.addListener("click", () => {
      infoWindow.open({
        anchor: marker,
        map
      });
    });

    // Auto-open on initial load
    infoWindow.open({
      anchor: marker,
      map
    });

    return { map, marker, infoWindow };
  } catch (err) {
    console.error("[Google Maps] Failed to initialize AdvancedMarker map:", err);
    return null;
  }
}
