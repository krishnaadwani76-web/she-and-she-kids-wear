/**
 * Product Card Component
 * Premium card with interactive color swatch switching, quick size selection,
 * wishlist toggle, discount badges, and direct Add to Cart.
 */

import { db } from "../db.js";
import { formatCurrency, calculateDiscountPercent } from "../utils/formatters.js";

export function renderProductCard(product) {
  const isWishlisted = db.isInWishlist(product.id);
  const discountPercent = calculateDiscountPercent(product.price, product.discountPrice);
  const primaryImage = product.images[0] || "";
  const hoverImage = product.images[1] || primaryImage;

  return `
    <div class="product-card group bg-white rounded-3xl p-3 sm:p-4 border border-rose-100 hover:border-rose-300 shadow-sm hover:shadow-xl hover:shadow-rose-100/60 transition-all duration-300 flex flex-col justify-between relative" data-product-id="${product.id}">
      
      <div>
        <!-- Image Container -->
        <div class="relative aspect-[3/4] rounded-2xl overflow-hidden bg-rose-50/40 mb-3.5">
          
          <!-- Badges -->
          <div class="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
            ${
              product.badge
                ? `<span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-sm">
                    ${product.badge}
                  </span>`
                : ""
            }
            ${
              discountPercent > 0
                ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-900 shadow-sm">
                    ${discountPercent}% OFF
                  </span>`
                : ""
            }
          </div>

          <!-- Wishlist Heart Button -->
          <button
            type="button"
            class="wishlist-toggle-btn absolute top-2.5 right-2.5 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-slate-400 hover:text-rose-600 transition active:scale-90"
            data-product-id="${product.id}"
            aria-label="Save to Wishlist"
          >
            <svg class="w-5 h-5 ${isWishlisted ? 'text-rose-600 fill-rose-600 animate-heart-pop' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </button>

          <!-- Product Photos (Primary + Hover) -->
          <a href="#product/${product.id}" class="block w-full h-full">
            <img
              src="${primaryImage}"
              alt="${product.name}"
              loading="lazy"
              class="product-card-img w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105"
            />
          </a>

          <!-- Quick View Overlay Button -->
          <div class="absolute inset-x-3 bottom-3 hidden sm:flex opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button
              type="button"
              class="quick-view-btn w-full py-2.5 px-3 bg-white/95 backdrop-blur-md hover:bg-white text-slate-800 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-1.5 border border-rose-100 transition hover:text-rose-600"
              data-product-id="${product.id}"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              <span>Quick View & Details</span>
            </button>
          </div>
        </div>

        <!-- Color Swatches -->
        <div class="flex items-center gap-1.5 mb-2 px-1">
          ${(product.colors || [])
            .map(
              (c, idx) => `
              <button
                type="button"
                class="card-color-swatch w-4 h-4 rounded-full border border-slate-300 shadow-2xs transition hover:scale-125 ${idx === 0 ? 'ring-2 ring-rose-500 ring-offset-1' : ''}"
                style="background-color: ${c.hex};"
                data-color-name="${c.name}"
                data-image-index="${c.imageIndex || 0}"
                title="${c.name}"
              ></button>
            `
            )
            .join("")}
          <span class="text-[10px] text-slate-400 font-medium ml-1">
            ${(product.colors || []).length} colors
          </span>
        </div>

        <!-- Product Name & Category -->
        <div class="px-1 space-y-1 mb-2">
          <div class="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            ${product.category === 'girls' ? "Girls Wear" : product.category === 'boys' ? "Boys Wear" : product.category === 'baby' ? "Baby Toddler" : "Kids Fashion"}
          </div>
          <h3 class="font-serif font-bold text-sm sm:text-base text-slate-900 group-hover:text-rose-600 transition line-clamp-1">
            <a href="#product/${product.id}">
              ${product.name}
            </a>
          </h3>
        </div>

        <!-- Ratings & Reviews -->
        <div class="flex items-center gap-1.5 px-1 mb-2.5 text-xs text-slate-500">
          <div class="flex items-center text-amber-400 text-xs">
            ★ ★ ★ ★ ★
          </div>
          <span class="font-bold text-slate-700 text-[11px]">${product.rating || '4.9'}</span>
          <span class="text-[10px] text-slate-400">(${product.reviewCount || 42})</span>
        </div>

        <!-- Selectable Size Buttons (1-2Y to 15-16Y) -->
        <div class="px-1 mb-3">
          <div class="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1.5">
            <span>Select Size:</span>
            <span class="selected-size-label text-rose-600 font-bold">${product.sizes[0]}</span>
          </div>
          <div class="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pr-0.5">
            ${(product.sizes || [])
              .map(
                (size, idx) => `
                <button
                  type="button"
                  class="card-size-btn text-[11px] font-bold px-2 py-1 rounded-lg border border-slate-200 text-slate-700 hover:border-rose-300 hover:bg-rose-50 transition ${idx === 0 ? 'bg-rose-600 text-white border-rose-600 shadow-sm' : 'bg-white'}"
                  data-size="${size}"
                >
                  ${size}
                </button>
              `
              )
              .join("")}
          </div>
        </div>
      </div>

      <!-- Price & Action Button -->
      <div class="px-1 pt-2 border-t border-rose-50 mt-1">
        <div class="flex items-baseline gap-2 mb-2.5">
          <span class="font-serif text-lg font-bold text-rose-600">
            ${formatCurrency(product.discountPrice || product.price)}
          </span>
          ${
            product.discountPrice && product.discountPrice < product.price
              ? `<span class="text-xs text-slate-400 line-through font-normal">
                  ${formatCurrency(product.price)}
                </span>`
              : ""
          }
        </div>

        <button
          type="button"
          class="card-add-to-cart-btn w-full py-2.5 px-3 rounded-2xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-bold text-xs border border-rose-200 hover:border-rose-600 transition-all flex items-center justify-center gap-2 group/btn shadow-xs hover:shadow-md hover:shadow-rose-200"
          data-product-id="${product.id}"
        >
          <svg class="w-4 h-4 text-rose-500 group-hover/btn:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          <span>Add to Bag</span>
        </button>
      </div>

    </div>
  `;
}
