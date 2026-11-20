/**
 * Product Details Modal Component
 * Implements full product view with multiple image switcher, color swatches,
 * size selector (1-2Y to 15-16Y), quantity selector, Add to Cart, Buy Now,
 * size chart modal, and related products.
 */

import { db } from "../db.js";
import { formatCurrency, calculateDiscountPercent } from "../utils/formatters.js";
import { SIZE_CHART } from "../data/seedProducts.js";

export function renderProductModal(product) {
  if (!product) return "";

  const discountPercent = calculateDiscountPercent(product.price, product.discountPrice);
  const isWishlisted = db.isInWishlist(product.id);
  const allProducts = db.getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return `
    <div id="product-detail-modal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div class="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-rose-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header / Close button -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-rose-100 bg-rose-50/40">
          <div class="flex items-center gap-2 text-xs text-slate-500">
            <a href="#home" class="hover:text-rose-600">Home</a>
            <span>/</span>
            <span class="capitalize text-slate-700 font-semibold">${product.category} Wear</span>
            <span>/</span>
            <span class="text-rose-600 font-bold truncate max-w-[200px] sm:max-w-xs">${product.name}</span>
          </div>
          <button id="close-product-modal-btn" class="w-8 h-8 rounded-full bg-white hover:bg-rose-100 text-slate-500 hover:text-rose-700 flex items-center justify-center transition" aria-label="Close">
            ✕
          </button>
        </div>

        <div class="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            <!-- Left: Image Gallery -->
            <div class="md:col-span-6 space-y-4">
              <div class="relative aspect-[3/4] rounded-3xl overflow-hidden bg-rose-50/50 border border-rose-100 shadow-inner group">
                <img
                  id="modal-main-image"
                  src="${product.images[0]}"
                  alt="${product.name}"
                  class="w-full h-full object-cover object-center transition-all duration-300"
                />

                <div class="absolute top-3 left-3 flex flex-col gap-1.5">
                  ${
                    product.badge
                      ? `<span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-600 text-white shadow-sm">
                          ${product.badge}
                        </span>`
                      : ""
                  }
                  ${
                    discountPercent > 0
                      ? `<span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-400 text-slate-900 shadow-sm">
                          ${discountPercent}% OFF
                        </span>`
                      : ""
                  }
                </div>

                <button
                  id="modal-wishlist-toggle"
                  class="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-slate-400 hover:text-rose-600 transition active:scale-90"
                  data-product-id="${product.id}"
                >
                  <svg class="w-5 h-5 ${isWishlisted ? 'text-rose-600 fill-rose-600' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                </button>
              </div>

              <!-- Thumbnails -->
              <div class="flex items-center gap-3 overflow-x-auto pb-1">
                ${product.images
                  .map(
                    (img, idx) => `
                    <button
                      type="button"
                      class="modal-thumb-btn w-16 h-20 rounded-2xl overflow-hidden border-2 transition shrink-0 ${idx === 0 ? 'border-rose-600 ring-2 ring-rose-100' : 'border-slate-200 hover:border-rose-300'}"
                      data-image-src="${img}"
                    >
                      <img src="${img}" alt="Thumbnail ${idx + 1}" class="w-full h-full object-cover" />
                    </button>
                  `
                  )
                  .join("")}
              </div>
            </div>

            <!-- Right: Product Info & Purchase Controls -->
            <div class="md:col-span-6 space-y-5">
              
              <div>
                <span class="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 mb-2">
                  She & She Premium Kidswear
                </span>
                <h1 class="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  ${product.name}
                </h1>
                
                <div class="flex items-center gap-3 mt-2 text-xs">
                  <div class="flex items-center text-amber-400">
                    ★ ★ ★ ★ ★
                  </div>
                  <span class="font-bold text-slate-800">${product.rating}</span>
                  <span class="text-slate-400">(${product.reviewCount} verified parent reviews)</span>
                  <span class="text-slate-300">•</span>
                  <span class="text-emerald-600 font-bold flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    ${product.stock > 5 ? `In Stock (${product.stock} units)` : `Only ${product.stock} left in stock!`}
                  </span>
                </div>
              </div>

              <!-- Pricing Block -->
              <div class="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-baseline justify-between">
                <div class="flex items-baseline gap-3">
                  <span class="font-serif text-3xl font-black text-rose-600">
                    ${formatCurrency(product.discountPrice || product.price)}
                  </span>
                  ${
                    product.discountPrice && product.discountPrice < product.price
                      ? `<span class="text-sm text-slate-400 line-through">
                          ${formatCurrency(product.price)}
                        </span>`
                      : ""
                  }
                  <span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Inclusive of all taxes
                  </span>
                </div>
              </div>

              <!-- Color Selection -->
              <div>
                <div class="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Available Colours:</span>
                  <span id="modal-selected-color" class="text-rose-600 font-bold">${product.colors[0]?.name}</span>
                </div>
                <div class="flex items-center gap-2.5">
                  ${(product.colors || [])
                    .map(
                      (c, idx) => `
                      <button
                        type="button"
                        class="modal-color-btn relative w-8 h-8 rounded-full border-2 transition transform active:scale-95 ${idx === 0 ? 'border-rose-600 ring-4 ring-rose-100 scale-110' : 'border-slate-300 hover:scale-105'}"
                        style="background-color: ${c.hex};"
                        data-color-name="${c.name}"
                        data-image-index="${c.imageIndex || 0}"
                        title="${c.name}"
                      ></button>
                    `
                    )
                    .join("")}
                </div>
              </div>

              <!-- Size Selection (1-2Y to 15-16Y) -->
              <div>
                <div class="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Available Sizes:</span>
                  <button id="open-size-chart-btn" type="button" class="text-rose-600 hover:text-rose-800 underline text-xs font-bold flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                    <span>View Size Chart (1–16Y)</span>
                  </button>
                </div>
                <div class="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  ${(product.sizes || [])
                    .map(
                      (size, idx) => `
                      <button
                        type="button"
                        class="modal-size-btn py-2 px-1 text-center rounded-xl border text-xs font-extrabold transition ${idx === 0 ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-200' : 'bg-white text-slate-800 border-slate-200 hover:border-rose-300 hover:bg-rose-50'}"
                        data-size="${size}"
                      >
                        ${size}
                      </button>
                    `
                    )
                    .join("")}
                </div>
              </div>

              <!-- Quantity Selector & Action Buttons -->
              <div class="pt-2 space-y-3">
                <div class="flex items-center gap-3">
                  <div class="flex items-center border border-slate-200 rounded-2xl bg-white p-1 shadow-xs">
                    <button id="modal-qty-minus" class="w-8 h-8 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-rose-600 font-bold transition flex items-center justify-center">
                      -
                    </button>
                    <span id="modal-qty-display" class="w-10 text-center font-bold text-sm text-slate-800">1</span>
                    <button id="modal-qty-plus" class="w-8 h-8 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-rose-600 font-bold transition flex items-center justify-center">
                      +
                    </button>
                  </div>

                  <button
                    id="modal-add-to-cart-btn"
                    class="flex-1 py-3.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-sm border-2 border-rose-300 transition flex items-center justify-center gap-2 shadow-xs active:scale-[0.98]"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                    <span>Add to Bag</span>
                  </button>
                </div>

                <button
                  id="modal-buy-now-btn"
                  class="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-sm shadow-xl shadow-rose-200 transition transform active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>⚡ Buy Now (Instant Checkout)</span>
                </button>
              </div>

              <!-- Pincode Delivery Check -->
              <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                <div class="flex items-center justify-between font-bold text-slate-700">
                  <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                    Delivery Pincode Check
                  </span>
                  <span class="text-slate-400 font-normal">Kota & All India</span>
                </div>
                <div class="flex gap-2">
                  <input
                    id="pincode-check-input"
                    type="text"
                    maxlength="6"
                    placeholder="Enter 6-digit PIN (e.g. 324009)"
                    class="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-rose-400"
                  />
                  <button id="pincode-check-btn" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs">
                    Check
                  </button>
                </div>
                <div id="pincode-result" class="text-[11px] font-semibold text-emerald-600">
                  ✓ Same-Day Pickup in Dadabari, Kota | 2-4 Days All India
                </div>
              </div>

              <!-- Product Specifications Accordion / Tabs -->
              <div class="border-t border-rose-100 pt-4 space-y-3 text-xs">
                <div>
                  <h4 class="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                    🌿 Fabric & Material Details
                  </h4>
                  <p class="text-slate-600 leading-relaxed">${product.fabric}</p>
                </div>

                <div>
                  <h4 class="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                    👶 Suitable Age Group & Fit
                  </h4>
                  <p class="text-slate-600 leading-relaxed">${product.ageGroup} — tailored with adjustable inner buttons.</p>
                </div>

                <div>
                  <h4 class="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                    💖 Comfort & Styling Tips
                  </h4>
                  <p class="text-slate-600 leading-relaxed">${product.comfortAndStyling}</p>
                </div>

                <div>
                  <h4 class="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                    🧺 Washing & Garment Care Instructions
                  </h4>
                  <p class="text-slate-600 leading-relaxed">${product.washingInstructions}</p>
                </div>
              </div>

            </div>
          </div>

          <!-- Related Products Carousel -->
          ${
            relatedProducts.length > 0
              ? `
              <div class="mt-12 pt-8 border-t border-rose-100">
                <h3 class="font-serif text-xl font-bold text-slate-900 mb-4">
                  Complete the Look (Pair With These)
                </h3>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  ${relatedProducts
                    .map(
                      (rel) => `
                      <div class="p-2.5 rounded-2xl bg-rose-50/40 border border-rose-100 hover:border-rose-300 transition flex flex-col justify-between cursor-pointer related-product-card" data-product-id="${rel.id}">
                        <div class="aspect-square rounded-xl overflow-hidden mb-2">
                          <img src="${rel.images[0]}" alt="${rel.name}" class="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div class="text-xs font-bold text-slate-900 line-clamp-1">${rel.name}</div>
                          <div class="text-xs font-black text-rose-600 mt-1">${formatCurrency(rel.discountPrice || rel.price)}</div>
                        </div>
                      </div>
                    `
                    )
                    .join("")}
                </div>
              </div>
            `
              : ""
          }

        </div>
      </div>
    </div>

    <!-- Size Guide Chart Modal -->
    <div id="size-chart-modal" class="hidden fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl max-w-xl w-full shadow-2xl p-6 border border-rose-100 animate-in fade-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between pb-4 border-b border-rose-100">
          <div>
            <h3 class="font-serif text-xl font-bold text-slate-900">Kids Wear Size Guide (1 to 16 Years)</h3>
            <p class="text-xs text-slate-500 mt-0.5">Indian standard measurements for girls, boys & toddlers</p>
          </div>
          <button id="close-size-chart-btn" class="text-slate-400 hover:text-slate-700 text-lg">✕</button>
        </div>

        <div class="mt-4 overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-rose-50/70 text-rose-900 font-bold uppercase tracking-wider">
              <tr>
                <th class="p-2.5 rounded-l-xl">Size</th>
                <th class="p-2.5">Chest</th>
                <th class="p-2.5">Dress Length</th>
                <th class="p-2.5">Waist</th>
                <th class="p-2.5 rounded-r-xl">Child Height</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-rose-50 text-slate-700 font-medium">
              ${SIZE_CHART.map(
                (row) => `
                <tr class="hover:bg-rose-50/30">
                  <td class="p-2.5 font-bold text-rose-600">${row.size}</td>
                  <td class="p-2.5">${row.chest}</td>
                  <td class="p-2.5">${row.length}</td>
                  <td class="p-2.5">${row.waist}</td>
                  <td class="p-2.5 text-slate-500">${row.height}</td>
                </tr>
              `
              ).join("")}
            </tbody>
          </table>
        </div>

        <div class="mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 leading-relaxed">
          💡 <strong>Parent Pro-Tip:</strong> If your child is between sizes or tall for their age, we recommend choosing one size up for longer wear and room to grow.
        </div>
      </div>
    </div>
  `;
}
