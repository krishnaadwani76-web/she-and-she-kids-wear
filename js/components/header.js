/**
 * Header & Navigation Component
 * Features top announcement banner, brand identity, live search, cart/wishlist triggers,
 * and responsive mobile navigation.
 */

import { db } from "../db.js";
import { formatCurrency } from "../utils/formatters.js";

export function renderHeader() {
  const settings = db.getSettings();
  const cartSummary = db.getCartSummary();
  const wishlist = db.getWishlist();
  const isAdmin = db.isAdminAuthenticated();

  const rawAnnouncement = (settings.announcement || "").trim();
  const announcementText =
    (rawAnnouncement.includes("FIRSTKID") ||
     rawAnnouncement.includes("Free Express Shipping") ||
     rawAnnouncement.includes("Free Shipping on Orders Above"))
      ? ""
      : rawAnnouncement;

  return `
    <!-- Top Announcement Bar -->
    <div class="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white text-xs font-medium py-2 px-4 shadow-sm">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="hidden md:flex items-center gap-4 text-rose-100">
          <span class="flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
            Dadabari, Kota, Rajasthan
          </span>
          <span class="text-rose-300">|</span>
          <a href="tel:${settings.storeInfo?.phone ? settings.storeInfo.phone.replace(/[^0-9+]/g, '') : '+918824844263'}" class="hover:text-white transition flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 4V3z"/></svg>
            ${settings.storeInfo?.phone || '+91 88248 44263'}
          </a>
        </div>

        <div class="flex-1 text-center font-semibold tracking-wide text-[11px] sm:text-xs">
          ${announcementText ? `<span>✨ ${announcementText} ✨</span>` : ""}
        </div>

        <div class="hidden sm:flex items-center gap-4 text-rose-100 text-[11px]">
          <button id="nav-track-order-top-btn" class="hover:text-white transition flex items-center gap-1 font-medium">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
            Track Order
          </button>
          <span class="text-rose-300">|</span>
          <button id="nav-admin-top-btn" class="hover:text-white transition flex items-center gap-1 font-medium text-yellow-200 hover:text-yellow-100">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            ${isAdmin ? "Admin Dashboard" : "Admin Login"}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20 gap-4">
          
          <!-- Mobile Menu Button -->
          <div class="flex items-center lg:hidden">
            <button id="mobile-menu-toggle" type="button" class="p-2 rounded-xl text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition" aria-label="Open menu">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>

          <!-- Brand Logo -->
          <div class="flex-shrink-0 flex items-center">
            <a href="#home" class="group flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-200 p-0.5 shadow-md shadow-rose-200 group-hover:scale-105 transition transform">
                <div class="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-rose-600">
                  <span class="text-2xl font-serif font-black tracking-tighter">S&S</span>
                </div>
              </div>
              <div class="flex flex-col">
                <div class="flex items-center gap-1.5">
                  <span class="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-rose-600 transition">
                    She & She
                  </span>
                  <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                </div>
                <span class="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-rose-500 font-sans -mt-0.5">
                  Kids Wear • Dadabari, Kota
                </span>
              </div>
            </a>
          </div>

          <!-- Desktop Search Bar -->
          <div class="hidden md:flex flex-1 max-w-md mx-6 relative">
            <div class="relative w-full">
              <input
                id="global-search-input"
                type="text"
                placeholder="Search party frocks, kurtas, baby sets..."
                class="w-full pl-11 pr-10 py-2.5 bg-rose-50/50 hover:bg-rose-50 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-full border border-rose-100 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition"
              />
              <div class="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 pointer-events-none">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <button id="search-clear-btn" class="hidden absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center">
                ✕
              </button>
            </div>
            
            <!-- Live Search Suggestions Dropdown -->
            <div id="search-suggestions-dropdown" class="hidden absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden z-50 max-h-96 overflow-y-auto">
              <!-- Dynamically populated -->
            </div>
          </div>

          <!-- User Action Icons -->
          <div class="flex items-center gap-2 sm:gap-3">
            
            <!-- Mobile Search Icon -->
            <button id="mobile-search-toggle" class="md:hidden p-2.5 rounded-full text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition" aria-label="Search">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>

            <!-- Store Location Quick Pin -->
            <a href="#store-location" class="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-slate-700 bg-amber-50/70 border border-amber-200/60 hover:bg-amber-100/60 transition">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Visit Kota Store</span>
            </a>

            <!-- Wishlist Button -->
            <button id="header-wishlist-btn" class="relative p-2.5 rounded-full text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition" aria-label="Wishlist">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              <span id="wishlist-badge" class="${wishlist.length > 0 ? '' : 'hidden'} absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                ${wishlist.length}
              </span>
            </button>

            <!-- Shopping Cart Button -->
            <button id="header-cart-btn" class="relative flex items-center gap-2 p-2 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 transition shadow-md shadow-rose-200 transform active:scale-95" aria-label="Shopping Cart">
              <div class="relative">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                <span id="cart-badge" class="${cartSummary.itemsCount > 0 ? '' : 'hidden'} absolute -top-2 -right-2 bg-yellow-400 text-slate-900 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  ${cartSummary.itemsCount}
                </span>
              </div>
              <span class="hidden sm:inline font-bold text-xs tracking-wide">
                <span id="cart-header-total">${formatCurrency(cartSummary.total)}</span>
              </span>
            </button>
          </div>
        </div>

        <!-- Mobile Search Dropdown Bar -->
        <div id="mobile-search-bar" class="hidden md:hidden pb-4 pt-1">
          <div class="relative">
            <input
              id="mobile-search-input"
              type="text"
              placeholder="Search kids clothing..."
              class="w-full pl-10 pr-4 py-2.5 bg-rose-50/60 text-sm rounded-full border border-rose-200 outline-none focus:ring-2 focus:ring-rose-400"
            />
            <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
          </div>
        </div>

        <!-- Desktop Navigation Categories Bar -->
        <nav class="hidden lg:flex items-center justify-between border-t border-rose-50 py-3 text-xs font-semibold tracking-wider uppercase text-slate-600">
          <div class="flex items-center space-x-6">
            <a href="#home" class="nav-link hover:text-rose-600 transition flex items-center gap-1.5 py-1">
              <span>Home</span>
            </a>
            <a href="#category/boys" class="nav-link hover:text-rose-600 transition flex items-center gap-1.5 py-1">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>Boys Wear</span>
            </a>
            <a href="#category/girls" class="nav-link hover:text-rose-600 transition flex items-center gap-1.5 py-1">
              <span class="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
              <span>Girls Wear</span>
            </a>
            <a href="#category/baby" class="nav-link hover:text-rose-600 transition flex items-center gap-1.5 py-1">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Baby Wear (1-3Y)</span>
            </a>
            <a href="#category/party" class="nav-link hover:text-rose-600 transition flex items-center gap-1.5 py-1">
              <span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              <span>Party Wear</span>
            </a>
            <a href="#new-arrivals" class="nav-link text-rose-600 hover:text-rose-700 transition flex items-center gap-1.5 py-1 font-bold">
              <span>✨ New Arrivals</span>
            </a>
          </div>

          <div class="flex items-center space-x-6 text-[11px] font-bold">
            <a href="#contact" class="text-rose-600 hover:text-rose-700 transition flex items-center gap-1">
              <span>Contact & Store</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </a>
          </div>
        </nav>
      </div>

      <!-- Mobile Navigation Drawer -->
      <div id="mobile-menu-drawer" class="hidden lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white w-4/5 max-w-sm h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-left duration-300">
          <div class="flex items-center justify-between pb-4 border-b border-rose-100">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-rose-500 text-white font-serif font-black flex items-center justify-center text-sm">
                S&S
              </div>
              <span class="font-serif font-bold text-slate-900 text-lg">She & She</span>
            </div>
            <button id="mobile-menu-close" class="p-2 text-slate-400 hover:text-slate-700 text-xl font-bold">✕</button>
          </div>

          <div class="flex-1 overflow-y-auto py-4 space-y-2">
            <a href="#home" class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-800 font-semibold hover:bg-rose-50 hover:text-rose-600">
              <span>🏠 Home</span>
            </a>
            <a href="#category/girls" class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-800 font-semibold hover:bg-rose-50 hover:text-rose-600">
              <span>👗 Girls Wear</span>
            </a>
            <a href="#category/boys" class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-800 font-semibold hover:bg-rose-50 hover:text-rose-600">
              <span>👦 Boys Wear</span>
            </a>
            <a href="#category/baby" class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-800 font-semibold hover:bg-rose-50 hover:text-rose-600">
              <span>👶 Baby Wear (1–3Y)</span>
            </a>
            <a href="#category/party" class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-800 font-semibold hover:bg-rose-50 hover:text-rose-600">
              <span>✨ Party & Festive Wear</span>
            </a>
            <a href="#new-arrivals" class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-600 font-bold hover:bg-rose-50">
              <span>🔥 New Arrivals</span>
            </a>
            <a href="#contact" class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-800 font-semibold hover:bg-rose-50 hover:text-rose-600">
              <span>📍 Store & Contact Us</span>
            </a>
            <a href="#track-order" class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-800 font-semibold hover:bg-rose-50 hover:text-rose-600">
              <span>📦 Track Your Order</span>
            </a>

            <!-- Mobile Direct Call & WhatsApp Buttons -->
            <div class="pt-2 grid grid-cols-2 gap-2">
              <a href="tel:+918824844263" class="py-2.5 px-3 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm">
                <span>📞 Call</span>
                <span>8824844263</span>
              </a>
              <a href="https://wa.me/918824844263?text=Hi%2C%20I%20am%20interested%20in%20your%20kids'%20wear%20collection." target="_blank" class="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm">
                <span>💬 WhatsApp</span>
              </a>
            </div>
          </div>

          <div class="pt-4 border-t border-rose-100 space-y-3">
            <button id="mobile-admin-btn" class="w-full py-3 px-4 rounded-2xl bg-rose-50 text-rose-700 font-bold text-xs flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              <span>${isAdmin ? "Admin Panel" : "Store Admin Login"}</span>
            </button>
            <div class="text-center text-[11px] text-slate-400">
              She & She Kids Wear • Dadabari, Kota
            </div>
          </div>
        </div>
      </div>
    </header>
  `;
}
