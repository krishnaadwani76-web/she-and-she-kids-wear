/**
 * Shopping Cart Drawer & Full Cart View Component
 * Supports real-time quantity adjustments, size/color display, coupon discounts,
 * free shipping progress meter, and checkout redirection.
 */

import { db } from "../db.js";
import { formatCurrency } from "../utils/formatters.js";

let currentCoupon = "";

export function setAppliedCoupon(code) {
  currentCoupon = code;
}

export function getAppliedCoupon() {
  return currentCoupon;
}

export function renderCartDrawer() {
  const cart = db.getCart();
  const summary = db.getCartSummary(currentCoupon);
  const percentToFreeShipping = Math.min(
    100,
    Math.round((summary.subtotal / summary.freeShippingThreshold) * 100)
  );

  return `
    <div id="cart-drawer-backdrop" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div id="cart-drawer-panel" class="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div class="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-rose-100 animate-in slide-in-from-right duration-300">
          
          <!-- Cart Header -->
          <div class="p-5 border-b border-rose-100 flex items-center justify-between bg-rose-50/40">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              </div>
              <div>
                <h3 class="font-serif text-lg font-bold text-slate-900">Your Shopping Bag</h3>
                <p class="text-xs text-slate-500">${summary.itemsCount} ${summary.itemsCount === 1 ? 'item' : 'items'} selected</p>
              </div>
            </div>
            <button id="close-cart-drawer-btn" class="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm shadow-xs border border-rose-100" aria-label="Close cart">
              ✕
            </button>
          </div>

          <!-- Free Shipping Progress Meter -->
          <div class="px-5 py-3 bg-amber-50/70 border-b border-amber-100 text-xs text-amber-900">
            ${
              summary.amountNeededForFreeShipping > 0
                ? `<div class="flex items-center justify-between font-semibold mb-1">
                    <span>Add <strong>${formatCurrency(summary.amountNeededForFreeShipping)}</strong> more for <strong>FREE Delivery!</strong></span>
                    <span class="text-rose-600 font-bold">${percentToFreeShipping}%</span>
                  </div>
                  <div class="w-full bg-amber-200/60 h-2 rounded-full overflow-hidden">
                    <div class="bg-gradient-to-r from-amber-400 to-rose-500 h-full transition-all duration-500" style="width: ${percentToFreeShipping}%"></div>
                  </div>`
                : `<div class="flex items-center gap-1.5 font-bold text-emerald-700">
                    <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                    <span>Congratulations! You qualify for FREE Delivery!</span>
                  </div>`
            }
          </div>

          <!-- Cart Item List -->
          <div class="flex-1 overflow-y-auto p-5 space-y-4">
            ${
              cart.length === 0
                ? `
                <div class="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div class="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-300 text-4xl">
                    🛍️
                  </div>
                  <div class="space-y-1">
                    <h4 class="font-serif text-lg font-bold text-slate-800">Your bag is empty!</h4>
                    <p class="text-xs text-slate-500 max-w-xs">
                      Explore our handcrafted festive frocks, kurta sets, and organic baby rompers.
                    </p>
                  </div>
                  <button id="cart-empty-shop-now-btn" class="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200 transition">
                    Explore New Arrivals →
                  </button>
                </div>
              `
                : cart
                    .map(
                      (item) => `
                    <div class="flex gap-3.5 p-3 rounded-2xl border border-rose-100 bg-white shadow-2xs hover:border-rose-200 transition">
                      <div class="w-20 h-24 rounded-xl overflow-hidden bg-rose-50 shrink-0">
                        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />
                      </div>

                      <div class="flex-1 flex flex-col justify-between">
                        <div>
                          <div class="flex items-start justify-between gap-2">
                            <h4 class="font-serif font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                              ${item.name}
                            </h4>
                            <button
                              class="cart-item-remove-btn text-slate-300 hover:text-rose-600 transition p-1 text-xs"
                              data-id="${item.id}"
                              data-size="${item.size}"
                              data-color="${item.color}"
                              title="Remove item"
                            >
                              ✕
                            </button>
                          </div>

                          <div class="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                            <span class="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md font-bold">Size: ${item.size}</span>
                            <span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">${item.color}</span>
                          </div>
                        </div>

                        <div class="flex items-center justify-between pt-2">
                          <div class="font-bold text-sm text-rose-600">
                            ${formatCurrency(item.price * item.quantity)}
                          </div>

                          <!-- Quantity Controls -->
                          <div class="flex items-center border border-slate-200 rounded-xl bg-slate-50/60 p-0.5 text-xs">
                            <button
                              class="cart-qty-btn-minus w-6 h-6 rounded-lg bg-white text-slate-700 hover:bg-rose-100 font-bold transition flex items-center justify-center shadow-2xs"
                              data-id="${item.id}"
                              data-size="${item.size}"
                              data-color="${item.color}"
                              data-qty="${item.quantity - 1}"
                            >
                              -
                            </button>
                            <span class="w-7 text-center font-bold text-slate-800">${item.quantity}</span>
                            <button
                              class="cart-qty-btn-plus w-6 h-6 rounded-lg bg-white text-slate-700 hover:bg-rose-100 font-bold transition flex items-center justify-center shadow-2xs"
                              data-id="${item.id}"
                              data-size="${item.size}"
                              data-color="${item.color}"
                              data-qty="${item.quantity + 1}"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  `
                    )
                    .join("")
            }
          </div>

          <!-- Cart Footer / Summary -->
          ${
            cart.length > 0
              ? `
              <div class="p-5 border-t border-rose-100 bg-rose-50/30 space-y-3">
                
                <!-- Coupon Code Box -->
                <div class="flex gap-2">
                  <input
                    id="cart-coupon-input"
                    type="text"
                    placeholder="Enter Coupon (e.g. FIRSTKID)"
                    value="${currentCoupon}"
                    class="flex-1 px-3 py-2 rounded-xl border border-rose-200 text-xs bg-white uppercase font-bold focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                  <button id="apply-coupon-btn" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition">
                    Apply
                  </button>
                </div>

                ${
                  summary.discount > 0
                    ? `<div class="flex items-center justify-between text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <span>Coupon Savings (${currentCoupon}):</span>
                        <span>-${formatCurrency(summary.discount)}</span>
                      </div>`
                    : ""
                }

                <!-- Price Breakdown -->
                <div class="space-y-1.5 text-xs text-slate-600">
                  <div class="flex justify-between">
                    <span>Bag Subtotal:</span>
                    <span class="font-bold text-slate-900">${formatCurrency(summary.subtotal)}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Estimated Shipping:</span>
                    <span class="font-bold ${summary.shipping === 0 ? 'text-emerald-600' : 'text-slate-900'}">
                      ${summary.shipping === 0 ? 'FREE' : formatCurrency(summary.shipping)}
                    </span>
                  </div>
                  <div class="flex justify-between pt-2 border-t border-rose-100 text-sm font-bold text-slate-900">
                    <span>Grand Total:</span>
                    <span class="font-serif text-lg text-rose-600">${formatCurrency(summary.total)}</span>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-2 pt-2">
                  <button
                    id="proceed-to-checkout-btn"
                    class="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-sm shadow-xl shadow-rose-200 transition transform active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Checkout</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </button>

                  <button
                    id="continue-shopping-btn"
                    class="w-full py-2.5 text-center text-xs font-bold text-slate-500 hover:text-rose-600 transition"
                  >
                    ← Continue Shopping
                  </button>
                </div>
              </div>
            `
              : ""
          }

        </div>
      </div>
    </div>
  `;
}
