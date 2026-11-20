/**
 * Checkout & Payment Modal Component
 * Complete Indian e-commerce checkout with address validation,
 * Razorpay test gateway integration, COD, UPI, and instant order creation.
 */

import { db } from "../db.js";
import { formatCurrency } from "../utils/formatters.js";
import { getAppliedCoupon } from "./cartDrawer.js";
import { initiateRazorpayPayment } from "../utils/razorpay.js";
import { showToast } from "../utils/toast.js";

const INDIAN_STATES = [
  "Rajasthan", "Delhi", "Maharashtra", "Gujarat", "Uttar Pradesh", "Madhya Pradesh",
  "Punjab", "Haryana", "Karnataka", "Tamil Nadu", "West Bengal", "Telangana",
  "Andhra Pradesh", "Bihar", "Odisha", "Kerala", "Assam", "Jharkhand", "Chhattisgarh",
  "Uttarakhand", "Himachal Pradesh", "Goa", "Jammu & Kashmir"
];

export function renderCheckoutModal() {
  const cart = db.getCart();
  const coupon = getAppliedCoupon();
  const summary = db.getCartSummary(coupon);
  const settings = db.getSettings();

  if (cart.length === 0) return "";

  return `
    <div id="checkout-modal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div class="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-rose-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Checkout Header -->
        <div class="px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg font-bold">
              🛍️
            </div>
            <div>
              <h3 class="font-serif text-xl font-bold tracking-tight">Express Secure Checkout</h3>
              <p class="text-rose-100 text-xs">She & She Kids Wear • Dadabari, Kota</p>
            </div>
          </div>
          <button id="close-checkout-btn" class="text-white/80 hover:text-white text-lg w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition">
            ✕
          </button>
        </div>

        <div class="p-6 sm:p-8 max-h-[82vh] overflow-y-auto">
          <div id="checkout-flow-container" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <!-- Left: Checkout Form -->
            <form id="checkout-form" class="lg:col-span-7 space-y-6">
              
              <!-- 1. Customer Contact Details -->
              <div class="p-5 rounded-2xl bg-rose-50/30 border border-rose-100 space-y-4">
                <h4 class="font-serif font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-sans font-bold flex items-center justify-center">1</span>
                  <span>Contact Information</span>
                </h4>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      id="checkout-name"
                      required
                      placeholder="e.g. Suman Sharma"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Mobile Number (for updates) *</label>
                    <div class="flex">
                      <span class="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-rose-200 bg-rose-50 text-xs font-bold text-slate-600">+91</span>
                      <input
                        type="tel"
                        id="checkout-phone"
                        required
                        maxlength="10"
                        pattern="[0-9]{10}"
                        placeholder="9829012345"
                        class="w-full px-3 py-2.5 rounded-r-xl border border-rose-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Email Address (for order invoice) *</label>
                  <input
                    type="email"
                    id="checkout-email"
                    required
                    placeholder="suman.sharma@example.com"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              <!-- 2. Shipping Delivery Address -->
              <div class="p-5 rounded-2xl bg-rose-50/30 border border-rose-100 space-y-4">
                <h4 class="font-serif font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-sans font-bold flex items-center justify-center">2</span>
                  <span>Delivery Address</span>
                </h4>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">House / Flat / Plot No., Building Name *</label>
                  <input
                    type="text"
                    id="checkout-address"
                    required
                    placeholder="e.g. Plot 14, Near Dadabari Circle"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">City *</label>
                    <input
                      type="text"
                      id="checkout-city"
                      required
                      value="Kota"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">State *</label>
                    <select
                      id="checkout-state"
                      required
                      class="w-full px-3 py-2.5 rounded-xl border border-rose-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium"
                    >
                      ${INDIAN_STATES.map(
                        (state) => `<option value="${state}" ${state === 'Rajasthan' ? 'selected' : ''}>${state}</option>`
                      ).join("")}
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">PIN Code *</label>
                    <input
                      type="text"
                      id="checkout-pincode"
                      required
                      maxlength="6"
                      pattern="[0-9]{6}"
                      placeholder="324009"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>
              </div>

              <!-- 3. Payment Method -->
              <div class="p-5 rounded-2xl bg-rose-50/30 border border-rose-100 space-y-4">
                <div class="flex items-center justify-between">
                  <h4 class="font-serif font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-sans font-bold flex items-center justify-center">3</span>
                    <span>Payment Method</span>
                  </h4>
                  <span class="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    🔒 100% Safe & Verified
                  </span>
                </div>

                <div class="space-y-3">
                  
                  <!-- Option A: Razorpay Online (UPI, Cards, Netbanking) -->
                  <label class="flex items-start gap-3 p-3.5 rounded-2xl border-2 border-rose-500 bg-rose-50/50 cursor-pointer transition hover:bg-rose-50 payment-method-card">
                    <input type="radio" name="payment-method" value="razorpay" checked class="mt-1 text-rose-600 focus:ring-rose-500">
                    <div class="flex-1">
                      <div class="flex items-center justify-between">
                        <span class="font-bold text-xs sm:text-sm text-slate-900">Online Payment Gateway (Razorpay)</span>
                        <div class="flex items-center gap-1.5">
                          <span class="text-[10px] bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full font-extrabold">Instant & Fast</span>
                        </div>
                      </div>
                      <p class="text-[11px] text-slate-500 mt-0.5">
                        UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking.
                      </p>
                      <div class="mt-2 text-[10px] text-rose-600 font-semibold flex items-center gap-1">
                        <span>⚡ Razorpay Test Sandbox Enabled</span>
                      </div>
                    </div>
                  </label>

                  <!-- Option B: Cash on Delivery (COD) -->
                  <label class="flex items-start gap-3 p-3.5 rounded-2xl border-2 border-slate-200 cursor-pointer transition hover:border-rose-300 payment-method-card">
                    <input type="radio" name="payment-method" value="cod" class="mt-1 text-rose-600 focus:ring-rose-500">
                    <div class="flex-1">
                      <div class="flex items-center justify-between">
                        <span class="font-bold text-xs sm:text-sm text-slate-900">Cash on Delivery (COD)</span>
                        <span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">No Advance Payment</span>
                      </div>
                      <p class="text-[11px] text-slate-500 mt-0.5">
                        Pay with cash or scan delivery agent's UPI QR code upon doorstep arrival.
                      </p>
                    </div>
                  </label>

                  <!-- Option C: Direct UPI QR -->
                  <label class="flex items-start gap-3 p-3.5 rounded-2xl border-2 border-slate-200 cursor-pointer transition hover:border-rose-300 payment-method-card">
                    <input type="radio" name="payment-method" value="upi_direct" class="mt-1 text-rose-600 focus:ring-rose-500">
                    <div class="flex-1">
                      <div class="flex items-center justify-between">
                        <span class="font-bold text-xs sm:text-sm text-slate-900">Direct Store UPI (Dadabari Kota)</span>
                        <span class="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">0% Fee</span>
                      </div>
                      <p class="text-[11px] text-slate-500 mt-0.5">
                        UPI ID: <strong class="text-slate-800">sheandshe@upi</strong> (Instant SMS Confirmation)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                id="place-order-submit-btn"
                class="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-pink-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-rose-200 transition transform active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Complete Order • ${formatCurrency(summary.total)}</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>

            </form>

            <!-- Right: Order Summary Sidebar -->
            <div class="lg:col-span-5 space-y-4">
              
              <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h4 class="font-serif font-bold text-slate-900 text-sm">Order Summary</h4>
                  <span class="text-xs text-rose-600 font-bold">${summary.itemsCount} items</span>
                </div>

                <!-- Item Thumbnails List -->
                <div class="max-h-56 overflow-y-auto space-y-3 pr-1">
                  ${cart
                    .map(
                      (item) => `
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-14 rounded-xl overflow-hidden bg-rose-50 shrink-0">
                        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="text-xs font-bold text-slate-800 truncate">${item.name}</div>
                        <div class="text-[11px] text-slate-500">
                          Size: <span class="font-semibold text-rose-700">${item.size}</span> • ${item.color} • Qty: ${item.quantity}
                        </div>
                      </div>
                      <div class="text-xs font-bold text-slate-900">
                        ${formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  `
                    )
                    .join("")}
                </div>

                <!-- Price Totals -->
                <div class="pt-3 border-t border-slate-200 space-y-2 text-xs">
                  <div class="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span class="font-semibold text-slate-900">${formatCurrency(summary.subtotal)}</span>
                  </div>

                  ${
                    summary.discount > 0
                      ? `<div class="flex justify-between text-emerald-700 font-bold">
                          <span>Promo Coupon (${coupon}):</span>
                          <span>-${formatCurrency(summary.discount)}</span>
                        </div>`
                      : ""
                  }

                  <div class="flex justify-between text-slate-600">
                    <span>Shipping Charges:</span>
                    <span class="font-semibold ${summary.shipping === 0 ? 'text-emerald-600' : 'text-slate-900'}">
                      ${summary.shipping === 0 ? 'FREE Express Delivery' : formatCurrency(summary.shipping)}
                    </span>
                  </div>

                  <div class="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                    <span>Total Amount Payable:</span>
                    <span class="font-serif text-lg text-rose-600">${formatCurrency(summary.total)}</span>
                  </div>
                </div>
              </div>

              <!-- Store Policy Guarantee Badges -->
              <div class="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 text-xs text-slate-600 space-y-2">
                <div class="flex items-center gap-2 font-bold text-slate-800">
                  <span>🛡️ She & She Parent Guarantee</span>
                </div>
                <ul class="space-y-1 text-[11px] text-slate-500">
                  <li>• 7-day hassle-free size exchange guarantee</li>
                  <li>• Pure breathable cotton lining for all children</li>
                  <li>• Delivered from Dadabari, Kota via trusted couriers</li>
                </ul>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

/**
 * Renders the Order Success confirmation screen after successful payment
 */
export function renderOrderSuccessView(order) {
  return `
    <div id="order-success-screen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div id="order-invoice-area" class="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-rose-100 overflow-hidden my-auto p-6 sm:p-10 animate-in fade-in zoom-in-95 duration-200">
        
        <div class="text-center space-y-3">
          <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-3xl shadow-lg shadow-emerald-100">
            ✓
          </div>
          <div class="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider">
            Order Confirmed!
          </div>
          <h2 class="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">
            Thank You, ${order.customer.name}!
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Your adorable kidswear outfits are being carefully packed at our Dadabari, Kota store.
          </p>
        </div>

        <!-- Order Reference Card -->
        <div class="mt-6 p-4 rounded-2xl bg-rose-50/50 border border-rose-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <div class="text-slate-400 font-medium">Order ID:</div>
            <div class="font-bold text-rose-700 font-mono">${order.id}</div>
          </div>
          <div>
            <div class="text-slate-400 font-medium">Payment Mode:</div>
            <div class="font-bold text-slate-800">${order.paymentMethod}</div>
          </div>
          <div>
            <div class="text-slate-400 font-medium">Payment Status:</div>
            <div class="font-bold text-emerald-600">${order.paymentStatus}</div>
          </div>
          <div>
            <div class="text-slate-400 font-medium">Estimated Delivery:</div>
            <div class="font-bold text-slate-800">2–4 Business Days</div>
          </div>
        </div>

        <!-- Ordered Items Summary -->
        <div class="mt-6 space-y-3">
          <h4 class="font-serif font-bold text-xs uppercase tracking-wider text-slate-500">
            Ordered Items (${order.items.length})
          </h4>
          <div class="divide-y divide-slate-100 max-h-48 overflow-y-auto">
            ${order.items
              .map(
                (item) => `
              <div class="py-2.5 flex items-center justify-between text-xs">
                <div class="flex items-center gap-3">
                  <img src="${item.image}" alt="${item.name}" class="w-10 h-12 object-cover rounded-lg bg-rose-50" />
                  <div>
                    <div class="font-bold text-slate-900">${item.name}</div>
                    <div class="text-[11px] text-slate-400">Size: <strong class="text-rose-600">${item.size}</strong> • Color: ${item.color} • Qty: ${item.quantity}</div>
                  </div>
                </div>
                <div class="font-bold text-slate-900">${formatCurrency(item.price * item.quantity)}</div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- Delivery Address Box -->
        <div class="mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <div class="font-bold text-slate-800 mb-1">📦 Delivery Destination:</div>
          <div>${order.customer.name} (${order.customer.phone})</div>
          <div>${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}</div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            id="success-track-btn"
            class="w-full sm:flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition"
            data-order-id="${order.id}"
          >
            Track Order Live (${order.id})
          </button>
          
          <button
            onclick="window.print()"
            class="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Print Receipt
          </button>

          <button
            id="success-home-btn"
            class="w-full sm:w-auto py-3 px-4 text-xs font-bold text-rose-600 hover:text-rose-800 transition"
          >
            Back to Home
          </button>
        </div>

      </div>
    </div>
  `;
}
