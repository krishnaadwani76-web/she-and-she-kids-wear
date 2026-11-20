/**
 * Store Admin Dashboard Component
 * Full store administration: Product CRUD, image management, inventory alerts,
 * live order status updates, customer records, and Razorpay settings.
 */

import { db } from "../db.js";
import { formatCurrency, formatDate } from "../utils/formatters.js";
import { showToast } from "../utils/toast.js";
import { SIZE_LIST } from "../data/seedProducts.js";

export function renderAdminLoginModal() {
  return `
    <div id="admin-login-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-rose-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div class="p-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-center relative">
          <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center text-2xl mb-2">
            🔐
          </div>
          <h3 class="font-serif text-2xl font-bold">Store Admin Login</h3>
          <p class="text-rose-100 text-xs mt-1">She & She Kids Wear • Dadabari, Kota</p>
          <button id="close-admin-login-btn" class="absolute top-4 right-4 text-white/80 hover:text-white text-lg">✕</button>
        </div>

        <form id="admin-login-form" class="p-6 space-y-4">
          <div class="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800">
            <strong>Default Credentials:</strong><br />
            Email: <span class="font-mono font-bold text-amber-900">admin@sheandshe.com</span><br />
            Password: <span class="font-mono font-bold text-amber-900">admin123</span>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Admin Email</label>
            <input
              type="email"
              id="admin-email-input"
              required
              value="admin@sheandshe.com"
              class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              id="admin-password-input"
              required
              value="admin123"
              class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <button
            type="submit"
            class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition"
          >
            Access Store Dashboard →
          </button>
        </form>

      </div>
    </div>
  `;
}

export function renderAdminDashboard() {
  const products = db.getProducts();
  const orders = db.getOrders();
  const customers = db.getCustomers();
  const settings = db.getSettings();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const lowStockCount = products.filter((p) => p.stock < 5).length;

  return `
    <div id="admin-dashboard-view" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div class="bg-white rounded-3xl w-full max-w-6xl shadow-2xl border border-rose-100 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        <!-- Dashboard Top Bar -->
        <div class="px-6 py-4 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-rose-600 text-white font-serif font-black flex items-center justify-center text-lg shadow-md shadow-rose-500/30">
              S&S
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-serif text-lg font-bold">She & She Admin Control Center</h3>
                <span class="px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-300 text-[10px] font-bold uppercase tracking-wider">
                  Dadabari Store
                </span>
              </div>
              <p class="text-slate-400 text-xs">Logged in as Administrator (admin@sheandshe.com)</p>
            </div>
          </div>

          <div class="flex items-center gap-2.5">
            <button id="admin-view-store-btn" class="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition">
              Preview Store ↗
            </button>
            <button id="admin-logout-btn" class="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition">
              Logout
            </button>
            <button id="admin-close-modal-btn" class="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center text-sm ml-2">
              ✕
            </button>
          </div>
        </div>

        <!-- Metric KPI Cards -->
        <div class="p-6 bg-rose-50/30 border-b border-rose-100 grid grid-cols-2 sm:grid-cols-5 gap-3 shrink-0">
          <div class="p-4 rounded-2xl bg-white border border-rose-100 shadow-2xs">
            <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Revenue</div>
            <div class="text-xl font-black text-rose-700 font-serif mt-1">${formatCurrency(totalRevenue)}</div>
          </div>
          <div class="p-4 rounded-2xl bg-white border border-rose-100 shadow-2xs">
            <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Orders Placed</div>
            <div class="text-xl font-black text-slate-800 font-serif mt-1">${orders.length}</div>
          </div>
          <div class="p-4 rounded-2xl bg-white border border-rose-100 shadow-2xs">
            <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Products</div>
            <div class="text-xl font-black text-slate-800 font-serif mt-1">${products.length}</div>
          </div>
          <div class="p-4 rounded-2xl bg-white border border-rose-100 shadow-2xs">
            <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Customers</div>
            <div class="text-xl font-black text-slate-800 font-serif mt-1">${customers.length}</div>
          </div>
          <div class="p-4 rounded-2xl bg-white border ${lowStockCount > 0 ? 'border-amber-300 bg-amber-50/40' : 'border-rose-100'} shadow-2xs">
            <div class="text-[11px] font-bold uppercase tracking-wider text-amber-700">Low Stock Alert</div>
            <div class="text-xl font-black ${lowStockCount > 0 ? 'text-amber-700' : 'text-slate-800'} font-serif mt-1">
              ${lowStockCount} items
            </div>
          </div>
        </div>

        <!-- Dashboard Navigation Tabs -->
        <div class="flex border-b border-rose-100 px-6 gap-2 bg-white text-xs font-bold uppercase tracking-wider overflow-x-auto shrink-0">
          <button class="admin-tab-btn py-3.5 px-4 border-b-2 border-rose-600 text-rose-700 active" data-tab="products">
            👗 Products (${products.length})
          </button>
          <button class="admin-tab-btn py-3.5 px-4 border-b-2 border-transparent text-slate-500 hover:text-slate-800" data-tab="orders">
            📦 Customer Orders (${orders.length})
          </button>
          <button class="admin-tab-btn py-3.5 px-4 border-b-2 border-transparent text-slate-500 hover:text-slate-800" data-tab="customers">
            👥 Customers (${customers.length})
          </button>
          <button class="admin-tab-btn py-3.5 px-4 border-b-2 border-transparent text-slate-500 hover:text-slate-800" data-tab="settings">
            ⚙️ Gateway & Settings
          </button>
        </div>

        <!-- Tab Content Area -->
        <div class="flex-1 overflow-y-auto p-6 bg-slate-50/40">
          
          <!-- TAB 1: Products Management -->
          <div id="admin-tab-products" class="admin-tab-pane space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-serif font-bold text-slate-900 text-base">Store Catalog Management</h4>
                <p class="text-xs text-slate-500">Add, edit prices, update inventory, and manage sizes/colours.</p>
              </div>
              <button
                id="admin-add-product-btn"
                class="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition flex items-center gap-1.5"
              >
                <span>+ Add New Product</span>
              </button>
            </div>

            <div class="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                  <thead class="bg-rose-50/60 text-slate-700 font-bold uppercase tracking-wider border-b border-rose-100">
                    <tr>
                      <th class="p-3.5">Product</th>
                      <th class="p-3.5">Category</th>
                      <th class="p-3.5">Price / MRP</th>
                      <th class="p-3.5">Inventory</th>
                      <th class="p-3.5">Sizes</th>
                      <th class="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-rose-50">
                    ${products
                      .map(
                        (p) => `
                      <tr class="hover:bg-rose-50/20">
                        <td class="p-3.5">
                          <div class="flex items-center gap-3">
                            <img src="${p.images[0]}" alt="${p.name}" class="w-10 h-12 object-cover rounded-lg bg-rose-50 shrink-0" />
                            <div>
                              <div class="font-bold text-slate-900">${p.name}</div>
                              <div class="text-[10px] text-slate-400">ID: ${p.id}</div>
                            </div>
                          </div>
                        </td>
                        <td class="p-3.5">
                          <span class="capitalize px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                            ${p.category}
                          </span>
                        </td>
                        <td class="p-3.5">
                          <div class="font-bold text-rose-600">${formatCurrency(p.discountPrice || p.price)}</div>
                          <div class="text-[10px] text-slate-400 line-through">${formatCurrency(p.price)}</div>
                        </td>
                        <td class="p-3.5">
                          <span class="font-bold px-2 py-0.5 rounded-full text-[11px] ${
                            p.stock < 5 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                          }">
                            ${p.stock} in stock
                          </span>
                        </td>
                        <td class="p-3.5 text-[11px] text-slate-600 max-w-[150px] truncate">
                          ${(p.sizes || []).join(", ")}
                        </td>
                        <td class="p-3.5 text-right space-x-1">
                          <button
                            class="admin-edit-product-btn px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px]"
                            data-id="${p.id}"
                          >
                            Edit
                          </button>
                          <button
                            class="admin-delete-product-btn px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px]"
                            data-id="${p.id}"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    `
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- TAB 2: Orders Management -->
          <div id="admin-tab-orders" class="admin-tab-pane hidden space-y-4">
            <div>
              <h4 class="font-serif font-bold text-slate-900 text-base">Customer Orders</h4>
              <p class="text-xs text-slate-500">Live order fulfillment, courier dispatch, and status updates.</p>
            </div>

            <div class="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                  <thead class="bg-rose-50/60 text-slate-700 font-bold uppercase tracking-wider border-b border-rose-100">
                    <tr>
                      <th class="p-3.5">Order ID</th>
                      <th class="p-3.5">Customer</th>
                      <th class="p-3.5">Date</th>
                      <th class="p-3.5">Items</th>
                      <th class="p-3.5">Total & Payment</th>
                      <th class="p-3.5">Status Update</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-rose-50">
                    ${orders
                      .map(
                        (ord) => `
                      <tr class="hover:bg-rose-50/20">
                        <td class="p-3.5 font-mono font-bold text-rose-700">${ord.id}</td>
                        <td class="p-3.5">
                          <div class="font-bold text-slate-900">${ord.customer.name}</div>
                          <div class="text-[11px] text-slate-400">${ord.customer.phone} • ${ord.customer.city}</div>
                        </td>
                        <td class="p-3.5 text-slate-500">${formatDate(ord.createdAt)}</td>
                        <td class="p-3.5 text-slate-700">
                          ${ord.items.length} items (${ord.items.map((i) => i.name).join(", ").slice(0, 30)}...)
                        </td>
                        <td class="p-3.5">
                          <div class="font-bold text-slate-900">${formatCurrency(ord.total)}</div>
                          <div class="text-[10px] text-slate-400">${ord.paymentMethod}</div>
                        </td>
                        <td class="p-3.5">
                          <select
                            class="admin-order-status-select px-2.5 py-1 rounded-xl border border-rose-200 text-xs font-bold bg-white text-slate-800"
                            data-order-id="${ord.id}"
                          >
                            <option value="Pending" ${ord.orderStatus === "Pending" ? "selected" : ""}>Pending</option>
                            <option value="Processing" ${ord.orderStatus === "Processing" ? "selected" : ""}>Processing</option>
                            <option value="Shipped" ${ord.orderStatus === "Shipped" ? "selected" : ""}>Shipped</option>
                            <option value="Delivered" ${ord.orderStatus === "Delivered" ? "selected" : ""}>Delivered</option>
                            <option value="Cancelled" ${ord.orderStatus === "Cancelled" ? "selected" : ""}>Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    `
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- TAB 3: Customers Management -->
          <div id="admin-tab-customers" class="admin-tab-pane hidden space-y-4">
            <div>
              <h4 class="font-serif font-bold text-slate-900 text-base">Registered Shoppers & Parents</h4>
              <p class="text-xs text-slate-500">Customer directory with purchase history and delivery destinations.</p>
            </div>

            <div class="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                  <thead class="bg-rose-50/60 text-slate-700 font-bold uppercase tracking-wider border-b border-rose-100">
                    <tr>
                      <th class="p-3.5">Customer Name</th>
                      <th class="p-3.5">Phone & Email</th>
                      <th class="p-3.5">City / Pincode</th>
                      <th class="p-3.5">Orders Count</th>
                      <th class="p-3.5">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-rose-50">
                    ${customers
                      .map(
                        (c) => `
                      <tr class="hover:bg-rose-50/20">
                        <td class="p-3.5 font-bold text-slate-900">${c.name}</td>
                        <td class="p-3.5 text-slate-600">
                          <div>${c.phone}</div>
                          <div class="text-[10px] text-slate-400">${c.email || "-"}</div>
                        </td>
                        <td class="p-3.5 text-slate-700">${c.city || "Kota"} (${c.pincode || "324009"})</td>
                        <td class="p-3.5 font-bold text-rose-600">${c.ordersCount || 1} orders</td>
                        <td class="p-3.5 font-black text-slate-900">${formatCurrency(c.totalSpent || 0)}</td>
                      </tr>
                    `
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- TAB 4: Settings & Payment Gateway Config -->
          <div id="admin-tab-settings" class="admin-tab-pane hidden space-y-6">
            <div class="max-w-2xl bg-white p-6 rounded-2xl border border-rose-100 shadow-sm space-y-5">
              <h4 class="font-serif font-bold text-slate-900 text-base">Payment Gateway & Store Configuration</h4>
              
              <form id="admin-settings-form" class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Razorpay Key ID (Test or Live)</label>
                  <input
                    type="text"
                    id="settings-razorpay-key"
                    value="${settings.razorpayKeyId || "rzp_test_sheandshe_kids"}"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                  <p class="text-[11px] text-slate-400 mt-1">
                    Set your own <strong class="text-rose-600">rzp_test_...</strong> merchant key from the Razorpay Dashboard to test live checkout popups.
                  </p>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Header Announcement Bar Text</label>
                  <input
                    type="text"
                    id="settings-announcement"
                    value="${settings.announcement || ""}"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Free Shipping Min (₹)</label>
                    <input
                      type="number"
                      id="settings-free-shipping"
                      value="${settings.freeShippingThreshold || 999}"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Standard Delivery Fee (₹)</label>
                    <input
                      type="number"
                      id="settings-shipping-fee"
                      value="${settings.shippingFee || 99}"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  class="py-2.5 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition"
                >
                  Save Store Settings
                </button>
              </form>
            </div>

            <!-- Database Backup & Restore -->
            <div class="max-w-2xl bg-white p-6 rounded-2xl border border-rose-100 shadow-sm space-y-4">
              <h4 class="font-serif font-bold text-slate-900 text-base">Database Backup, Export & Reset</h4>
              <p class="text-xs text-slate-500">Export the entire store database (products, orders, customers) as JSON or reset to default seeds.</p>
              
              <div class="flex flex-wrap gap-3">
                <button id="admin-export-db-btn" class="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition">
                  Export Database (JSON)
                </button>
                <button id="admin-reset-db-btn" class="py-2 px-4 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs transition">
                  Reset to Fresh Seed Data
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>

    <!-- Product Create/Edit Modal -->
    <div id="product-form-modal" class="hidden fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div class="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-rose-100 overflow-hidden my-auto p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-4 border-b border-rose-100 mb-5">
          <h3 id="product-form-title" class="font-serif text-xl font-bold text-slate-900">Add New Kidswear Product</h3>
          <button id="close-product-form-btn" class="text-slate-400 hover:text-slate-700 text-lg">✕</button>
        </div>

        <form id="product-editor-form" class="space-y-4">
          <input type="hidden" id="edit-product-id" value="" />

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Product Title *</label>
            <input
              type="text"
              id="form-product-name"
              required
              placeholder="e.g. Royal Brocade Silk Anarkali Set"
              class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <select id="form-product-category" required class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs">
                <option value="girls">Girls Wear</option>
                <option value="boys">Boys Wear</option>
                <option value="baby">Baby Wear (1-3Y)</option>
                <option value="party">Party Wear</option>
                <option value="casual">Casual Wear</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">MRP Price (₹) *</label>
              <input type="number" id="form-product-price" required placeholder="2499" class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Selling Discount Price (₹) *</label>
              <input type="number" id="form-product-discount-price" required placeholder="1599" class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Inventory Stock Units *</label>
              <input type="number" id="form-product-stock" required value="20" class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Badge / Tag</label>
              <input type="text" id="form-product-badge" placeholder="e.g. Bestseller, New, Festive" class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Primary Product Image URL *</label>
            <input
              type="url"
              id="form-product-image"
              required
              placeholder="https://images.unsplash.com/..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Select Available Sizes *</label>
            <div class="grid grid-cols-5 gap-2 p-3 bg-rose-50/50 rounded-xl border border-rose-100">
              ${SIZE_LIST.map(
                (size) => `
                <label class="flex items-center gap-1.5 text-xs text-slate-700 font-semibold cursor-pointer">
                  <input type="checkbox" name="product-size-check" value="${size}" checked class="rounded text-rose-600 focus:ring-rose-500" />
                  <span>${size}</span>
                </label>
              `
              ).join("")}
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Fabric & Material Details *</label>
            <input
              type="text"
              id="form-product-fabric"
              required
              placeholder="e.g. 100% Breathable Combed Cotton with Muslin Lining"
              class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">SEO Description & Story *</label>
            <textarea
              id="form-product-desc"
              rows="3"
              required
              placeholder="Comfortable festive kidswear crafted for joyful celebrations..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs"
            ></textarea>
          </div>

          <div class="pt-3 flex justify-end gap-2">
            <button type="button" id="cancel-product-form-btn" class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold">
              Cancel
            </button>
            <button type="submit" class="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200">
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
