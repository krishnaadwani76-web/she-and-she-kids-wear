/**
 * Footer, Reviews, Instagram Gallery, and Policy Modals Component
 * Features customer testimonials, social proof, Instagram gallery,
 * and comprehensive Indian e-commerce legal policies.
 */

import { STORE_INFO } from "../data/seedProducts.js?v=3.1";

export function renderFooter() {
  return `
    <!-- Special Offers & Deal of the Day Banner -->
    <section class="py-12 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div class="space-y-2">
            <span class="inline-block px-3 py-1 rounded-full bg-yellow-400 text-slate-900 font-black text-[11px] uppercase tracking-wider">
              Boutique Collection
            </span>
            <h3 class="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight">
              Premium Handcrafted Kidswear
            </h3>
            <p class="text-rose-100 text-xs sm:text-sm">
              Discover beautiful party frocks, festive kurtas, and organic baby wear crafted with love in Dadabari, Kota.
            </p>
          </div>

          <div class="flex items-center gap-4">
            <a
              href="#category/all"
              class="px-8 py-3.5 rounded-full bg-white text-rose-700 hover:bg-rose-50 font-bold text-xs shadow-xl transition transform hover:scale-105 active:scale-95"
            >
              Shop Collection →
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Parent Reviews & Testimonials Section -->
    <section class="py-16 sm:py-20 bg-rose-50/30 border-b border-rose-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span class="text-xs font-bold text-rose-600 uppercase tracking-wider">Loved by 5,000+ Indian Families</span>
          <h2 class="font-serif text-3xl font-extrabold text-slate-900">What Parents Say About Us</h2>
          <p class="text-xs text-slate-500">Real feedback from mothers and fathers across Kota and India.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div class="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm space-y-4">
            <div class="flex text-amber-400 text-sm">★ ★ ★ ★ ★</div>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
              "Ordered the Rose Blush Frock for my daughter's 4th birthday. The pure cotton inner lining is a lifesaver — she wore it for 6 hours straight without scratching or crying once. Gorgeous twirl!"
            </p>
            <div class="flex items-center gap-3 pt-2 border-t border-rose-50">
              <div class="w-10 h-10 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-sm">
                AK
              </div>
              <div>
                <div class="font-bold text-xs text-slate-900">Ananya Khandelwal</div>
                <div class="text-[10px] text-slate-400">Mother of 4-year-old • Kota</div>
              </div>
            </div>
          </div>

          <div class="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm space-y-4">
            <div class="flex text-amber-400 text-sm">★ ★ ★ ★ ★</div>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
              "The Kurta Pajama with Nehru jacket fit my 7-year-old son like bespoke tailoring. We visited their Dadabari showroom to pick up accessories, and the staff was so courteous!"
            </p>
            <div class="flex items-center gap-3 pt-2 border-t border-rose-50">
              <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                RM
              </div>
              <div>
                <div class="font-bold text-xs text-slate-900">Rajesh Mathur</div>
                <div class="text-[10px] text-slate-400">Father of 7-year-old • Jaipur</div>
              </div>
            </div>
          </div>

          <div class="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm space-y-4">
            <div class="flex text-amber-400 text-sm">★ ★ ★ ★ ★</div>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
              "Softest organic muslin baby rompers! Washed them three times already and they got even softer. Highly recommend She & She for newborns and toddlers."
            </p>
            <div class="flex items-center gap-3 pt-2 border-t border-rose-50">
              <div class="w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-sm">
                PS
              </div>
              <div>
                <div class="font-bold text-xs text-slate-900">Priyanka Sen</div>
                <div class="text-[10px] text-slate-400">Mother of 18-month toddler • Kota</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- Instagram Community Gallery -->
    <section class="py-14 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <span class="text-xs font-bold text-rose-600 uppercase tracking-wider">#SheAndSheKidsMoments</span>
            <h3 class="font-serif text-2xl font-bold text-slate-900">Follow Our Little Trendsetters</h3>
          </div>
          <a
            href="${STORE_INFO.instagram}"
            target="_blank"
            rel="noopener noreferrer"
            class="px-5 py-2 rounded-full border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs transition flex items-center gap-2 shadow-sm"
          >
            <span>Follow @she_n_she_kids_wear</span>
            <span>↗</span>
          </a>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <a href="${STORE_INFO.instagram}" target="_blank" rel="noopener noreferrer" class="aspect-square rounded-2xl overflow-hidden bg-rose-50 group relative block">
            <img src="https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=400&q=80" alt="Insta Kid 1" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            <div class="absolute inset-0 bg-rose-600/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xl">♥</div>
          </a>
          <a href="${STORE_INFO.instagram}" target="_blank" rel="noopener noreferrer" class="aspect-square rounded-2xl overflow-hidden bg-rose-50 group relative block">
            <img src="https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=400&q=80" alt="Insta Kid 2" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            <div class="absolute inset-0 bg-rose-600/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xl">♥</div>
          </a>
          <a href="${STORE_INFO.instagram}" target="_blank" rel="noopener noreferrer" class="aspect-square rounded-2xl overflow-hidden bg-rose-50 group relative block">
            <img src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=400&q=80" alt="Insta Kid 3" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            <div class="absolute inset-0 bg-rose-600/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xl">♥</div>
          </a>
          <a href="${STORE_INFO.instagram}" target="_blank" rel="noopener noreferrer" class="aspect-square rounded-2xl overflow-hidden bg-rose-50 group relative block">
            <img src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=80" alt="Insta Kid 4" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            <div class="absolute inset-0 bg-rose-600/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xl">♥</div>
          </a>
          <a href="${STORE_INFO.instagram}" target="_blank" rel="noopener noreferrer" class="aspect-square rounded-2xl overflow-hidden bg-rose-50 group relative block">
            <img src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=400&q=80" alt="Insta Kid 5" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            <div class="absolute inset-0 bg-rose-600/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xl">♥</div>
          </a>
          <a href="${STORE_INFO.instagram}" target="_blank" rel="noopener noreferrer" class="aspect-square rounded-2xl overflow-hidden bg-rose-50 group relative block">
            <img src="https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=400&q=80" alt="Insta Kid 6" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            <div class="absolute inset-0 bg-rose-600/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xl">♥</div>
          </a>
        </div>

      </div>
    </section>

    <!-- Main Footer -->
    <footer class="bg-slate-900 text-slate-400 pt-16 pb-12 text-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          <!-- Brand Info -->
          <div class="lg:col-span-2 space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-rose-600 text-white font-serif font-black flex items-center justify-center text-lg">
                S&S
              </div>
              <div>
                <span class="font-serif text-xl font-bold text-white tracking-tight">She & She Kids Wear</span>
                <p class="text-[10px] text-rose-400 uppercase tracking-widest font-bold font-sans">Dadabari, Kota, Rajasthan</p>
              </div>
            </div>

            <p class="text-xs text-slate-400 leading-relaxed max-w-sm">
              Making every childhood more stylish. We design comfortable, premium, and affordable clothing for kids aged 1–16 years with 100% skin-safe, breathable fabrics.
            </p>

            <div class="space-y-1.5 text-xs">
              <div class="text-slate-300 font-semibold">Flagship Retail Store:</div>
              <div>${STORE_INFO.address}</div>
              <div>Phone: <a href="tel:+918824844263" class="text-white hover:text-rose-400 font-bold transition">+91 88248 44263</a></div>
              <div>Email: <a href="mailto:${STORE_INFO.email}" class="text-rose-400 font-medium hover:underline">${STORE_INFO.email}</a></div>
              <div>Instagram: <a href="${STORE_INFO.instagram}" target="_blank" rel="noopener noreferrer" class="text-rose-400 font-medium hover:underline flex items-center gap-1 inline-flex"><span>${STORE_INFO.instagramHandle || '@she_n_she_kids_wear'}</span> <span>↗</span></a></div>
            </div>
          </div>

          <!-- Quick Shop Links -->
          <div class="space-y-3">
            <h4 class="font-serif font-bold text-sm text-white uppercase tracking-wider">Shop Categories</h4>
            <ul class="space-y-2">
              <li><a href="#category/girls" class="hover:text-rose-400 transition">Girls Party Frocks & Gowns</a></li>
              <li><a href="#category/boys" class="hover:text-rose-400 transition">Boys Kurtas & Tuxedos</a></li>
              <li><a href="#category/baby" class="hover:text-rose-400 transition">Baby Muslin Rompers (1-3Y)</a></li>
              <li><a href="#category/party" class="hover:text-rose-400 transition">Festive Anarkalis & Sherwanis</a></li>
              <li><a href="#category/casual" class="hover:text-rose-400 transition">Everyday Playwear & Sets</a></li>
              <li><a href="#new-arrivals" class="text-rose-400 hover:text-rose-300 transition font-bold">✨ New Arrivals 2026</a></li>
            </ul>
          </div>

          <!-- Customer Service -->
          <div class="space-y-3">
            <h4 class="font-serif font-bold text-sm text-white uppercase tracking-wider">Parent Assistance</h4>
            <ul class="space-y-2">
              <li><a href="#track-order" class="hover:text-rose-400 transition">Track Your Shipment</a></li>
              <li><a href="#size-guide" class="hover:text-rose-400 transition">Kids Size Chart (1–16Y)</a></li>
              <li><a href="#contact" class="hover:text-rose-400 transition">Contact Dadabari Store</a></li>
              <li><button class="policy-open-btn hover:text-rose-400 transition text-left" data-policy="returns">Shipping & Easy Exchange</button></li>
              <li><a href="https://wa.me/918824844263?text=Hi%2C%20I%20am%20interested%20in%20your%20kids'%20wear%20collection." target="_blank" class="hover:text-emerald-400 transition text-emerald-400 font-semibold">WhatsApp Support (8824844263)</a></li>
            </ul>
          </div>

          <!-- Policies & Legal -->
          <div class="space-y-3">
            <h4 class="font-serif font-bold text-sm text-white uppercase tracking-wider">Policies & Security</h4>
            <ul class="space-y-2">
              <li><button class="policy-open-btn hover:text-rose-400 transition text-left" data-policy="privacy">Privacy Policy</button></li>
              <li><button class="policy-open-btn hover:text-rose-400 transition text-left" data-policy="terms">Terms & Conditions</button></li>
              <li><button class="policy-open-btn hover:text-rose-400 transition text-left" data-policy="returns">Return & Exchange Policy</button></li>
              <li><button class="policy-open-btn hover:text-rose-400 transition text-left" data-policy="about">About She & She Kids</button></li>
              <li><button id="footer-admin-btn" class="text-yellow-400 hover:text-yellow-300 transition font-bold">Store Admin Login ↗</button></li>
            </ul>
          </div>

        </div>

        <!-- Footer Bottom: Payment & Copyright -->
        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 <strong>She & She Kids Wear</strong>. All Rights Reserved. Dadabari, Kota, Rajasthan, India.
          </div>

          <!-- Payment Trust Badges -->
          <div class="flex items-center gap-3">
            <span class="text-slate-400 font-medium">100% Secure Payments:</span>
            <div class="flex items-center gap-2 text-white">
              <span class="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold">Razorpay</span>
              <span class="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold">UPI</span>
              <span class="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold">RuPay</span>
              <span class="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold">COD</span>
            </div>
          </div>
        </div>

      </div>
    </footer>

    <!-- Floating WhatsApp Support Button -->
    <a
      href="https://wa.me/918824844263?text=Hi%2C%20I%20am%20interested%20in%20your%20kids'%20wear%20collection."
      target="_blank"
      rel="noopener noreferrer"
      class="fixed bottom-6 left-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 group shadow-emerald-500/40"
      aria-label="Chat on WhatsApp"
    >
      <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.158.571 4.184 1.571 5.932l-1.571 5.868 6.071-1.593c1.705.93 3.659 1.493 5.929 1.493 6.627 0 12-5.373 12-12s-5.373-12-12-12z"/>
      </svg>
      <span class="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-out font-bold text-xs pl-0 group-hover:pl-2">
        Chat with Us
      </span>
    </a>

    <!-- Universal Policies Modal (Privacy, Terms, Returns, About) -->
    <div id="policy-content-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div class="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-rose-100 overflow-hidden my-auto p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150 max-h-[82vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-4 border-b border-rose-100 mb-4">
          <h3 id="policy-modal-title" class="font-serif text-xl font-bold text-slate-900">Store Policy</h3>
          <button id="close-policy-modal-btn" class="text-slate-400 hover:text-slate-700 text-lg">✕</button>
        </div>
        <div id="policy-modal-body" class="text-xs text-slate-600 space-y-3 leading-relaxed">
          <!-- Populated by JS -->
        </div>
      </div>
    </div>
  `;
}
