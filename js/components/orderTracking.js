/**
 * Order Tracking Component
 * Allows customers to track their order live using Order ID (e.g., SSKW-10482)
 * or mobile number, with interactive timeline and courier details.
 */

import { db } from "../db.js";
import { formatCurrency, formatDate } from "../utils/formatters.js";

export function renderOrderTrackingModal(initialOrderId = "") {
  return `
    <div id="order-tracking-modal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div class="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-rose-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header -->
        <div class="px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="text-xl">📦</span>
            <div>
              <h3 class="font-serif text-lg font-bold">Track Your Kidswear Order</h3>
              <p class="text-xs text-rose-100">She & She Kids Wear • Dadabari, Kota</p>
            </div>
          </div>
          <button id="close-tracking-modal-btn" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition">
            ✕
          </button>
        </div>

        <div class="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          
          <!-- Search Box -->
          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-700">Enter Order ID or 10-Digit Mobile Number:</label>
            <div class="flex gap-2">
              <input
                id="tracking-search-input"
                type="text"
                placeholder="e.g. SSKW-10482 or 8824844263"
                value="${initialOrderId}"
                class="flex-1 px-4 py-3 rounded-2xl border border-rose-200 text-sm font-semibold uppercase bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              <button
                id="tracking-search-btn"
                class="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition"
              >
                Track Now
              </button>
            </div>
            <p class="text-[11px] text-slate-400">
              Enter your real Order ID from your confirmation receipt or the 10-digit phone number entered during checkout.
            </p>
          </div>

          <!-- Dynamic Result Container -->
          <div id="tracking-result-area">
            <!-- Will be populated by JS or show initial order -->
          </div>

        </div>
      </div>
    </div>
  `;
}

/**
 * Builds the interactive tracking status timeline for a found order
 */
export function buildTrackingTimelineHTML(order) {
  if (!order) {
    return `
      <div class="p-8 text-center bg-rose-50/50 rounded-2xl border border-rose-100 space-y-2">
        <div class="text-3xl">🔍</div>
        <h4 class="font-bold text-slate-800 text-sm">Order Not Found</h4>
        <p class="text-xs text-slate-500 max-w-sm mx-auto">
          Please verify the Order ID or phone number entered. If you placed the order just now, it will appear here instantly.
        </p>
      </div>
    `;
  }

  const steps = [
    { title: "Order Placed", desc: "We received your order", status: "completed" },
    {
      title: "Processing & Quality Check",
      desc: "Carefully checked & ironed at Dadabari store",
      status: ["Processing", "Shipped", "Delivered"].includes(order.orderStatus)
        ? "completed"
        : "pending"
    },
    {
      title: "Dispatched / In Transit",
      desc: `${order.courier || "BlueDart Express"} (Tracking: ${order.trackingNumber || "Assigned"})`,
      status: ["Shipped", "Delivered"].includes(order.orderStatus) ? "completed" : "pending"
    },
    {
      title: "Out for Delivery & Delivered",
      desc: order.orderStatus === "Delivered" ? "Successfully delivered" : "Expected in 2–4 business days",
      status: order.orderStatus === "Delivered" ? "completed" : "pending"
    }
  ];

  return `
    <div class="space-y-6 animate-in fade-in duration-200">
      
      <!-- Order Quick Stats -->
      <div class="p-4 rounded-2xl bg-rose-50/40 border border-rose-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span class="text-slate-400 block">Order ID</span>
          <span class="font-mono font-bold text-rose-700 text-sm">${order.id}</span>
        </div>
        <div>
          <span class="text-slate-400 block">Placed On</span>
          <span class="font-semibold text-slate-800">${formatDate(order.createdAt)}</span>
        </div>
        <div>
          <span class="text-slate-400 block">Current Status</span>
          <span class="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
            order.orderStatus === "Delivered"
              ? "bg-emerald-100 text-emerald-800"
              : order.orderStatus === "Shipped"
              ? "bg-blue-100 text-blue-800"
              : "bg-amber-100 text-amber-800"
          }">
            ${order.orderStatus}
          </span>
        </div>
        <div>
          <span class="text-slate-400 block">Total Amount</span>
          <span class="font-bold text-slate-900">${formatCurrency(order.total)} (${order.paymentMethod})</span>
        </div>
      </div>

      <!-- Step-by-Step Progress Timeline -->
      <div class="p-5 rounded-2xl border border-slate-200 bg-white">
        <h4 class="font-serif font-bold text-sm text-slate-900 mb-5">Live Shipment Journey</h4>
        
        <div class="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-rose-200 before:h-[80%]">
          ${steps
            .map(
              (step, idx) => `
            <div class="relative flex items-start gap-4">
              <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                step.status === "completed"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-200 ring-4 ring-rose-100"
                  : "bg-slate-100 text-slate-400 border border-slate-300"
              }">
                ${step.status === "completed" ? "✓" : idx + 1}
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs sm:text-sm font-bold ${step.status === "completed" ? "text-slate-900" : "text-slate-400"}">
                  ${step.title}
                </div>
                <div class="text-xs text-slate-500 mt-0.5">${step.desc}</div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>

      <!-- Delivery Destination & Items -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <h5 class="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
            <span>📍 Shipping Address</span>
          </h5>
          <div class="text-slate-700 font-semibold">${order.customer.name}</div>
          <div class="text-slate-500">${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}</div>
          <div class="text-slate-500 mt-1">Phone: ${order.customer.phone}</div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <h5 class="font-bold text-slate-900 mb-1.5">👗 Ordered Items (${order.items.length})</h5>
          <div class="space-y-1.5">
            ${order.items
              .map(
                (item) => `
              <div class="flex justify-between text-slate-600">
                <span class="truncate max-w-[160px]">${item.name} (${item.size})</span>
                <span class="font-bold">${formatCurrency(item.price * item.quantity)}</span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>

    </div>
  `;
}
