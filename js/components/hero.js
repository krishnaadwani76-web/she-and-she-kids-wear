/**
 * Hero Banner & Feature Badges Component
 * Luxurious pastel hero with animated elements, high-impact CTA, and value propositions.
 * Automatically synchronizes with Website Content settings from the database.
 */

import { db } from "../db.js";

export function renderHero() {
  const settings = db.getSettings();

  const rawHeading = settings.heroHeading || "Making Every Childhood";
  const displayHeading = rawHeading.replace(/More Stylish\.?/gi, "").trim();
  const heroSubtitle =
    settings.heroSubtitle ||
    "Discover adorable outfits for every little moment. From royal festive frocks and dapper kurta sets to everyday organic playwear — crafted with pure breathable fabrics for happy, active kids.";
  const promoBadge =
    settings.promoBadge ||
    "New Spring / Festive 2026 Collection • Ages 1 to 16 Years";
  const heroBannerImage =
    settings.heroBannerImage ||
    "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1000&q=85";

  return `
    <section class="relative overflow-hidden bg-pastel-gradient pt-8 pb-16 lg:pt-14 lg:pb-24">
      <!-- Background Ambient Blobs -->
      <div class="absolute top-10 right-10 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-5 left-10 w-80 h-80 bg-peach-200/50 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Left Content Column -->
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-rose-100/80 border border-rose-200 text-rose-700 text-xs font-bold tracking-wide shadow-sm animate-soft-float">
              <span class="flex h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>${promoBadge}</span>
            </div>

            <h1 class="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              ${displayHeading || "Making Every Childhood"}
              <span class="block bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent italic">
                More Stylish.
              </span>
            </h1>

            <p class="text-slate-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              ${heroSubtitle}
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#category/all"
                class="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-sm tracking-wide shadow-xl shadow-rose-200 hover:shadow-rose-300 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 group"
              >
                <span>Shop Collection Now</span>
                <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </a>

              <a
                href="#category/party"
                class="w-full sm:w-auto px-7 py-4 rounded-full bg-white/90 hover:bg-white text-slate-800 font-bold text-sm border border-rose-200 hover:border-rose-400 shadow-md shadow-rose-100/50 transition-all flex items-center justify-center gap-2"
              >
                <span>✨ Party & Festive Wear</span>
              </a>
            </div>

            <!-- Trust Stats -->
            <div class="pt-6 border-t border-rose-200/60 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <div class="text-xl sm:text-2xl font-black text-rose-600 font-serif">5,000+</div>
                <div class="text-xs text-slate-500 font-medium">Happy Indian Kids</div>
              </div>
              <div>
                <div class="text-xl sm:text-2xl font-black text-rose-600 font-serif">100%</div>
                <div class="text-xs text-slate-500 font-medium">Gentle Cotton Lining</div>
              </div>
              <div>
                <div class="text-xl sm:text-2xl font-black text-rose-600 font-serif">4.9 ★</div>
                <div class="text-xs text-slate-500 font-medium">Parent Trust Score</div>
              </div>
            </div>
          </div>

          <!-- Right Showcase Gallery Column -->
          <div class="lg:col-span-5 relative">
            <div class="relative mx-auto max-w-md lg:max-w-none">
              
              <!-- Main Feature Card -->
              <div class="relative rounded-3xl overflow-hidden shadow-2xl shadow-rose-200/70 border-4 border-white bg-white group">
                <div class="aspect-[4/5] overflow-hidden">
                  <img
                    src="${heroBannerImage}"
                    alt="She & She Kids Wear Festive Collection"
                    class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-rose-200 w-max mb-2">
                    Dadabari Flagship Store
                  </div>
                  <h3 class="font-serif text-2xl font-bold leading-tight">Princess Tulle Twirl Gown</h3>
                  <p class="text-rose-100 text-xs mt-1">Lightweight, itch-free, handcrafted with love.</p>
                  <div class="mt-3 flex items-center justify-between">
                    <div class="flex items-baseline gap-2">
                      <span class="text-xl font-black text-yellow-300">₹1,599</span>
                      <span class="text-xs text-white/60 line-through">₹2,499</span>
                    </div>
                    <a href="#product/rose-blush-princess-tulle-party-frock" class="px-3.5 py-1.5 rounded-full bg-white text-rose-700 text-xs font-bold hover:bg-rose-50 transition">
                      View Outfit →
                    </a>
                  </div>
                </div>
              </div>

              <!-- Floating Micro-Badge Top Left -->
              <div class="absolute -top-4 -left-4 sm:-left-6 bg-white rounded-2xl p-3 shadow-xl border border-rose-100 flex items-center gap-3 animate-soft-float">
                <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-lg">
                  👑
                </div>
                <div>
                  <div class="text-xs font-bold text-slate-900">Ages 1 to 16Y</div>
                  <div class="text-[10px] text-slate-500">Perfect Fit Guaranteed</div>
                </div>
              </div>

              <!-- Floating Micro-Badge Bottom Right -->
              <div class="absolute -bottom-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-rose-100 flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                  📍
                </div>
                <div>
                  <div class="text-xs font-bold text-slate-900">Kota Store Open</div>
                  <div class="text-[10px] text-emerald-600 font-semibold">Dadabari Circle • Visit Us</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- 4 Key Store Assurances -->
        <div class="mt-14 pt-10 border-t border-rose-200/50 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="flex items-center gap-3.5 p-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-rose-100">
            <div class="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
            </div>
            <div>
              <div class="text-xs font-bold text-slate-900">Free Express Delivery</div>
              <div class="text-[11px] text-slate-500">On all orders above ₹999</div>
            </div>
          </div>

          <div class="flex items-center gap-3.5 p-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-rose-100">
            <div class="w-11 h-11 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <div>
              <div class="text-xs font-bold text-slate-900">100% Cotton Lined</div>
              <div class="text-[11px] text-slate-500">Zero itching, kid-safe dyes</div>
            </div>
          </div>

          <div class="flex items-center gap-3.5 p-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-rose-100">
            <div class="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </div>
            <div>
              <div class="text-xs font-bold text-slate-900">7-Day Easy Exchange</div>
              <div class="text-[11px] text-slate-500">Hassle-free size replacement</div>
            </div>
          </div>

          <div class="flex items-center gap-3.5 p-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-rose-100">
            <div class="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </div>
            <div>
              <div class="text-xs font-bold text-slate-900">COD & Razorpay UPI</div>
              <div class="text-[11px] text-slate-500">Pay on delivery or online</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  `;
}
