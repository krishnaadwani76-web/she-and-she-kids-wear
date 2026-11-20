/**
 * Contact Us & Dadabari Kota Store Location Component
 * Features embedded Google Maps, Get Directions, direct WhatsApp support,
 * operating hours, and active inquiry form.
 */

import { STORE_INFO } from "../data/seedProducts.js";
import { showToast } from "../utils/toast.js";

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
            Have questions about sizes, custom party wear, or your recent order? Get in touch or visit our retail store in Dadabari, Kota.
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
                  <div>${STORE_INFO.address}</div>
                </div>
              </div>

              <!-- Phone & WhatsApp -->
              <div class="flex items-start gap-3.5 text-xs text-slate-600 pt-2 border-t border-rose-50">
                <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <div class="space-y-1">
                  <div class="font-bold text-slate-900 text-xs">Customer Support & Orders:</div>
                  <div>Phone: <a href="tel:${STORE_INFO.phone}" class="font-bold text-slate-800 hover:text-rose-600">${STORE_INFO.phone}</a></div>
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
                  href="https://wa.me/919829012345?text=Hello%20She%20%26%20She%20Kids%20Wear,%20I%20have%20an%20inquiry%20about%20your%20kidswear%20collection."
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
                <div class="font-bold text-xs text-amber-900">Visiting from outside Kota?</div>
                <div class="text-[11px] text-amber-700">Located near Dadabari Circle with convenient parking.</div>
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
            
            <!-- Embedded Google Map -->
            <div id="store-location" class="rounded-3xl overflow-hidden shadow-xl border border-rose-100 bg-white">
              <div class="px-5 py-3.5 bg-rose-50/60 border-b border-rose-100 flex items-center justify-between">
                <span class="font-serif font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
                  She & She Kids Wear • Dadabari, Kota (Rajasthan)
                </span>
                <span class="text-[11px] font-bold text-rose-600">PIN: 324009</span>
              </div>
              
              <div class="aspect-[16/9] w-full bg-slate-100 relative">
                <iframe
                  title="She & She Kids Wear Store Location"
                  src="https://maps.google.com/maps?q=Dadabari,%20Kota,%20Rajasthan&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  class="w-full h-full border-0"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
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
                      required
                      placeholder="e.g. Renu Meena"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98290XXXXX"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="renu@example.com"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Your Message / Inquiry *</label>
                  <textarea
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
