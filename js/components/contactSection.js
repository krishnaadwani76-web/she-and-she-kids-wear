/**
 * Contact Us & Dadabari Kota Store Location Component
 * Features Google Maps Platform integration, exact shop marker pin,
 * directions link, WhatsApp concierge, operating hours, and active inquiry form.
 */

import { STORE_INFO } from "../data/seedProducts.js";
import { showToast } from "../utils/toast.js";
import { initStoreMap } from "../utils/googleMaps.js";

export function renderContactSection() {
  return `
    <section id="contact" class="py-16 sm:py-24 bg-gradient-to-b from-white via-rose-50/20 to-white relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Section Header -->
        <div class="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider">
            <span>📍 Visit Our Kota Boutique</span>
          </div>
          <h2 class="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            We Would Love to Meet You & Your Little Ones
          </h2>
          <p class="text-sm sm:text-base text-slate-600">
            Have questions about sizes, custom party wear, or your recent order? Get in touch or visit our retail store at Sethiya Complex, Dadabari, Kota.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <!-- Left: Store Information & Working Hours -->
          <div class="lg:col-span-5 space-y-6">
            
            <div class="p-6 rounded-3xl bg-white border border-rose-100 shadow-xl shadow-rose-100/50 space-y-5">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-rose-500 text-white font-serif font-black flex items-center justify-center text-xl shadow-md shadow-rose-200">
                  S&S
                </div>
                <div>
                  <h3 class="font-serif text-xl font-bold text-slate-900">${STORE_INFO.name}</h3>
                  <p class="text-xs text-rose-600 font-semibold">${STORE_INFO.tagline}</p>
                </div>
              </div>

              <!-- Address Block -->
              <div class="flex items-start gap-3.5 text-xs text-slate-600 leading-relaxed pt-2 border-t border-rose-50">
                <div class="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                </div>
                <div>
                  <div class="font-bold text-slate-900 text-xs mb-0.5">Store Address:</div>
                  <div class="font-medium text-slate-800">${STORE_INFO.address}</div>
                  <div class="text-[11px] text-rose-600 mt-1 font-semibold">Landmark: Sethiya Complex • Dadabari Circle (PIN: 324009)</div>
                </div>
              </div>

              <!-- Phone & WhatsApp -->
              <div class="flex items-start gap-3.5 text-xs text-slate-600 pt-2 border-t border-rose-50">
                <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <div class="space-y-1">
                  <div class="font-bold text-slate-900 text-xs">Customer Support & Orders:</div>
                  <div>Phone: <a href="tel:+918824844263" class="font-bold text-slate-800 hover:text-rose-600">${STORE_INFO.phone}</a></div>
                  <div>Email: <a href="mailto:${STORE_INFO.email}" class="font-semibold text-rose-600 hover:underline">${STORE_INFO.email}</a></div>
                </div>
              </div>

              <!-- Timings -->
              <div class="flex items-start gap-3.5 text-xs text-slate-600 pt-2 border-t border-rose-50">
                <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <div class="font-bold text-slate-900 text-xs mb-0.5">Store Opening Hours:</div>
                  <div>${STORE_INFO.timings}</div>
                </div>
              </div>

              <!-- WhatsApp Direct Action Button -->
              <div class="pt-2">
                <a
                  href="${STORE_INFO.whatsappUrl}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-200 transition flex items-center justify-center gap-2 group"
                >
                  <span class="text-base">💬</span>
                  <span>Chat with Store Manager on WhatsApp</span>
                </a>
              </div>
            </div>

            <!-- Get Directions Button -->
            <div class="p-5 rounded-3xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
              <div>
                <div class="font-bold text-xs text-amber-900">Visiting our Kota Boutique?</div>
                <div class="text-[11px] text-amber-700">Located at Sethiya Complex, Dadabari with easy parking.</div>
              </div>
              <a
                href="${STORE_INFO.mapsUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-sm transition shrink-0"
              >
                Get Directions ↗
              </a>
            </div>

          </div>

          <!-- Right: Interactive Google Map & Inquiry Form -->
          <div class="lg:col-span-7 space-y-6">
            
            <!-- Embedded Google Map with Accurate Shop Marker Pin -->
            <div id="store-location" class="rounded-3xl overflow-hidden shadow-xl border border-rose-100 bg-white flex flex-col">
              <div class="px-5 py-3.5 bg-rose-50/70 border-b border-rose-100 flex flex-wrap items-center justify-between gap-2">
                <span class="font-serif font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                  <span class="relative flex h-2.5 w-2.5">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
                  </span>
                  <span>She & She kids wear • Sethiya Complex, Dadabari, Kota</span>
                </span>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">📍 Official Marker Pin</span>
                  <span class="text-[11px] font-bold text-rose-600">PIN: 324009</span>
                </div>
              </div>
              
              <div class="relative w-full h-[380px] sm:h-[440px] bg-slate-100">
                <div id="store-map-canvas" class="w-full h-full">
                  <iframe
                    title="She & She Kids Wear Store Location - Sethiya Complex, Dadabari, Kota"
                    src="https://maps.google.com/maps?cid=3709804868270142138&t=&z=17&ie=UTF8&iwloc=&output=embed"
                    class="w-full h-full border-0"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

                <!-- Floating Interactive Shop Location Pill -->
                <div class="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-rose-100 shadow-xl shadow-rose-950/10 flex flex-col gap-2">
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2">
                      <span class="text-base">📍</span>
                      <div>
                        <div class="font-bold text-xs text-slate-900">Sethiya Complex, Dadabari, Kota</div>
                        <div class="text-[10px] text-slate-500 font-mono">25.1580° N, 75.8273° E</div>
                      </div>
                    </div>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold shrink-0">Open Today</span>
                  </div>
                  <div class="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <a
                      href="${STORE_INFO.mapsUrl}"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex-1 py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] text-center shadow-sm transition"
                    >
                      Get Directions ↗
                    </a>
                    <a
                      href="${STORE_INFO.placeUrl}"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] text-center transition"
                    >
                      Open in Maps ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Inquiry Form -->
            <div class="p-6 sm:p-8 rounded-3xl bg-white border border-rose-100 shadow-xl shadow-rose-100/50 space-y-4">
              <h3 class="font-serif text-xl font-bold text-slate-900">
                Send Us a Message
              </h3>
              <p class="text-xs text-slate-500">
                Looking for bulk school outfits, custom birthday frocks, or size advice? Fill out the form below.
              </p>

              <form id="contact-inquiry-form" class="space-y-3">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      id="contact-name-input"
                      required
                      placeholder="e.g. Renu Meena"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Contact Phone *</label>
                    <input
                      type="tel"
                      id="contact-phone-input"
                      required
                      placeholder="+91 88248XXXXX"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="contact-email-input"
                    placeholder="renu@example.com"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Your Message / Inquiry *</label>
                  <textarea
                    id="contact-message-input"
                    rows="3"
                    required
                    placeholder="Ask us about sizing, availability for 3-4Y frocks, or festive delivery dates..."
                    class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition"
                >
                  Send Inquiry to Store Manager
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </section>
  `;
}

/**
 * Initializes interactive Google Maps features if window.GOOGLE_MAPS_API_KEY is available.
 */
export function initContactMap() {
  if (typeof window !== "undefined" && (window.GOOGLE_MAPS_API_KEY || localStorage.getItem("GOOGLE_MAPS_API_KEY"))) {
    initStoreMap("store-map-canvas").catch(err => {
      console.warn("[Contact Map] Google Maps API load deferred:", err);
    });
  }
}
