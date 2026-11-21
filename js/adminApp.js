/**
 * She & She Kids Wear - Admin Control Center (Standalone Portal)
 * Complete back-office management for products, categories, orders, website content, and Supabase cloud.
 */

import { db } from "./db.js";
import { formatCurrency, formatDate } from "./utils/formatters.js";
import { showToast } from "./utils/toast.js";
import { SIZE_LIST } from "./data/seedProducts.js";
import { isSupabaseConfigured, getSupabaseConfig, saveSupabaseConfig, clearSupabaseConfig } from "./config.js";
import { optimizeAndUploadImage, testConnection, supabaseSignIn, supabaseSignOut } from "./supabaseClient.js";

// Admin application state
const adminState = {
  activeTab: "dashboard", // dashboard | products | categories | orders | content | database
  productModalOpen: false,
  editingProductId: null,
  productImages: [],
  productColors: [],
  categoryModalOpen: false,
  editingCategoryId: null,
  activeOrderModal: null,
  orderStatusFilter: "all",
  orderSearchQuery: "",
  productSearchQuery: "",
  productCategoryFilter: "all",
  isUploadingImage: false
};

document.addEventListener("DOMContentLoaded", () => {
  initAdmin();
});

function initAdmin() {
  renderAdminShell();

  // Re-render when database changes
  db.subscribe(() => {
    if (db.isAdminAuthenticated()) {
      renderActiveTab();
    }
  });
}

function renderAdminShell() {
  const root = document.getElementById("admin-root");
  if (!root) return;

  if (!db.isAdminAuthenticated()) {
    root.innerHTML = renderLoginScreen();
    setupLoginListeners();
    return;
  }

  root.innerHTML = `
    <div class="flex-1 flex flex-col md:flex-row bg-slate-900 min-h-screen text-slate-100">
      
      <!-- Left Sidebar Navigation -->
      <aside class="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
        <!-- Brand Header -->
        <div class="p-5 border-b border-slate-800 flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white font-serif font-black flex items-center justify-center text-lg shadow-lg shadow-rose-500/20">
            S&S
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <h1 class="font-serif font-bold text-base text-white">She & She Kids</h1>
              <span class="w-2 h-2 rounded-full bg-rose-500"></span>
            </div>
            <p class="text-[11px] text-slate-400">Admin Control Center</p>
          </div>
        </div>

        <!-- Store Location & Cloud Status Pill -->
        <div class="px-5 py-3 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between">
          <div class="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}"></span>
            <span>${isSupabaseConfigured() ? 'Supabase Connected' : 'Local Storage Mode'}</span>
          </div>
          <a href="./index.html" target="_blank" class="text-[11px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1">
            View Store ↗
          </a>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
          <button class="nav-tab-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${adminState.activeTab === 'dashboard' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}" data-tab="dashboard">
            <span class="text-base">📊</span>
            <span>Dashboard Overview</span>
          </button>
          
          <button class="nav-tab-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${adminState.activeTab === 'products' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}" data-tab="products">
            <span class="text-base">👗</span>
            <span>Products & Stock</span>
          </button>

          <button class="nav-tab-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${adminState.activeTab === 'categories' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}" data-tab="categories">
            <span class="text-base">🏷️</span>
            <span>Categories</span>
          </button>

          <button class="nav-tab-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${adminState.activeTab === 'orders' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}" data-tab="orders">
            <span class="text-base">📦</span>
            <span>Customer Orders</span>
          </button>

          <button class="nav-tab-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${adminState.activeTab === 'content' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}" data-tab="content">
            <span class="text-base">🎨</span>
            <span>Website Content</span>
          </button>

          <button class="nav-tab-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${adminState.activeTab === 'database' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}" data-tab="database">
            <span class="text-base">☁️</span>
            <span>Cloud & Supabase Setup</span>
          </button>
        </nav>

        <!-- Admin User Footer -->
        <div class="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-rose-500/20 text-rose-300 font-bold flex items-center justify-center text-xs">
              AD
            </div>
            <div class="overflow-hidden">
              <p class="text-xs font-bold text-white truncate">Administrator</p>
              <p class="text-[10px] text-slate-400 truncate">Dadabari, Kota</p>
            </div>
          </div>
          <button id="admin-logout-action-btn" class="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 text-xs transition" title="Log out">
            🚪 Logout
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <!-- Top App Bar -->
        <header class="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h2 id="page-header-title" class="font-serif text-lg font-bold text-white capitalize">
              ${getHeaderTitle(adminState.activeTab)}
            </h2>
            <p id="page-header-subtitle" class="text-xs text-slate-400">
              She & She Kids Wear • Store Management Dashboard
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button id="quick-add-product-btn" class="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition flex items-center gap-1.5">
              <span>+</span>
              <span>New Product</span>
            </button>
          </div>
        </header>

        <!-- Dynamic Body Container -->
        <div id="admin-main-body" class="p-6 flex-1 bg-slate-900"></div>
      </main>

    </div>

    <!-- Global Modals Mount -->
    <div id="admin-modal-container"></div>
  `;

  setupShellListeners();
  renderActiveTab();
}

function getHeaderTitle(tab) {
  switch (tab) {
    case "dashboard": return "Store Overview & Performance";
    case "products": return "Product Catalog & Inventory";
    case "categories": return "Product Categories Management";
    case "orders": return "Customer Orders & Shipments";
    case "content": return "Website Content & Promotional Banners";
    case "database": return "Cloud Database & Storage Configuration";
    default: return "Admin Portal";
  }
}

function setupShellListeners() {
  document.querySelectorAll(".nav-tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const tab = e.currentTarget.dataset.tab;
      if (tab) {
        adminState.activeTab = tab;
        renderAdminShell();
      }
    });
  });

  const logoutBtn = document.getElementById("admin-logout-action-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      db.adminLogout();
      supabaseSignOut().catch(() => {});
      showToast("Logged out successfully.", "info");
      renderAdminShell();
    });
  }

  const quickAddBtn = document.getElementById("quick-add-product-btn");
  if (quickAddBtn) {
    quickAddBtn.addEventListener("click", () => {
      openProductModal();
    });
  }
}

function renderActiveTab() {
  const container = document.getElementById("admin-main-body");
  if (!container) return;

  switch (adminState.activeTab) {
    case "dashboard":
      renderDashboardTab(container);
      break;
    case "products":
      renderProductsTab(container);
      break;
    case "categories":
      renderCategoriesTab(container);
      break;
    case "orders":
      renderOrdersTab(container);
      break;
    case "content":
      renderContentTab(container);
      break;
    case "database":
      renderDatabaseTab(container);
      break;
  }
}

/* ==========================================================================
   1. LOGIN SCREEN
   ========================================================================== */
function renderLoginScreen() {
  return `
    <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        
        <div class="p-8 bg-gradient-to-tr from-rose-950 via-slate-900 to-slate-950 border-b border-slate-800 text-center">
          <div class="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white font-serif font-black flex items-center justify-center text-3xl mx-auto mb-3 shadow-xl shadow-rose-500/20">
            S&S
          </div>
          <h2 class="font-serif text-2xl font-bold text-white">She & She Kids Wear</h2>
          <p class="text-rose-300 text-xs mt-1">Dadabari, Kota • Admin Control Center</p>
        </div>

        <form id="standalone-login-form" class="p-8 space-y-5">
          <div class="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/80 text-xs text-slate-300">
            <span class="font-bold text-rose-300">Default Store Credentials:</span><br />
            Email: <span class="font-mono text-white">admin@sheandshe.com</span><br />
            Password: <span class="font-mono text-white">admin123</span>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1.5">Administrator Email</label>
            <input
              type="email"
              id="login-email-input"
              required
              value="admin@sheandshe.com"
              class="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              id="login-password-input"
              required
              value="admin123"
              class="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <button
            type="submit"
            class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition transform hover:-translate-y-0.5"
          >
            Sign In to Admin Dashboard →
          </button>

          <div class="text-center pt-2">
            <a href="./index.html" class="text-xs text-slate-400 hover:text-rose-300 transition">
              ← Return to She & She Storefront
            </a>
          </div>
        </form>

      </div>
    </div>
  `;
}

function setupLoginListeners() {
  const form = document.getElementById("standalone-login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email-input").value;
    const password = document.getElementById("login-password-input").value;

    // Try Supabase auth first if configured
    if (isSupabaseConfigured()) {
      const res = await supabaseSignIn(email, password);
      if (res.success) {
        showToast("Authenticated with Supabase Cloud!", "success");
      }
    }

    // Check store admin credentials
    const result = db.adminLogin(email, password);
    if (result.success) {
      showToast("Welcome to She & She Kids Wear Dashboard!", "success");
      renderAdminShell();
    } else {
      showToast(result.message, "error");
    }
  });
}

/* ==========================================================================
   2. DASHBOARD OVERVIEW TAB
   ========================================================================== */
function renderDashboardTab(container) {
  const products = db.getProducts();
  const orders = db.getOrders();
  const categories = db.getCategories();
  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.orderStatus === "Pending" || o.orderStatus === "Processing");
  const lowStockProducts = products.filter(p => Number(p.stock) < 5);

  container.innerHTML = `
    <div class="space-y-6">
      
      <!-- Metrics Overview Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        
        <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-md">
          <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Sales</div>
          <div class="text-2xl font-black text-rose-400 font-serif mt-1.5">${formatCurrency(totalSales)}</div>
          <div class="text-[11px] text-slate-400 mt-1">${orders.length} orders total</div>
        </div>

        <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-md">
          <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Orders</div>
          <div class="text-2xl font-black text-white font-serif mt-1.5">${orders.length}</div>
          <div class="text-[11px] text-emerald-400 mt-1">Live customer orders</div>
        </div>

        <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-md">
          <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Orders</div>
          <div class="text-2xl font-black ${pendingOrders.length > 0 ? 'text-amber-400' : 'text-white'} font-serif mt-1.5">${pendingOrders.length}</div>
          <div class="text-[11px] text-slate-400 mt-1">Needs packing / dispatch</div>
        </div>

        <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-md">
          <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Products</div>
          <div class="text-2xl font-black text-white font-serif mt-1.5">${products.filter(p => p.isActive !== false).length}</div>
          <div class="text-[11px] text-slate-400 mt-1">in ${categories.length} categories</div>
        </div>

        <div class="p-5 rounded-2xl bg-slate-950 border ${lowStockProducts.length > 0 ? 'border-amber-500/50 bg-amber-950/20' : 'border-slate-800'} shadow-md col-span-2 sm:col-span-1">
          <div class="text-[11px] font-bold uppercase tracking-wider text-amber-400">Low Stock Alert</div>
          <div class="text-2xl font-black text-amber-400 font-serif mt-1.5">${lowStockProducts.length} items</div>
          <div class="text-[11px] text-slate-400 mt-1">Less than 5 in stock</div>
        </div>

      </div>

      <!-- Quick Action Buttons Banner -->
      <div class="p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950 border border-rose-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 class="font-serif font-bold text-white text-base">Store Owner Quick Controls</h3>
          <p class="text-xs text-slate-300 mt-1">Manage everything in real time without touching code.</p>
        </div>
        <div class="flex items-center gap-2.5 flex-wrap">
          <button id="dash-add-product" class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition">
            + Add Product
          </button>
          <button id="dash-view-orders" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition">
            📦 View Orders
          </button>
          <button id="dash-edit-content" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition">
            🎨 Edit Banner & Content
          </button>
        </div>
      </div>

      <!-- Recent Orders Section -->
      <div class="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 class="font-serif font-bold text-white text-sm">Recent Orders</h3>
          <button id="dash-see-all-orders" class="text-xs text-rose-400 hover:text-rose-300 font-semibold">
            View All Orders →
          </button>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th class="px-6 py-3">Order ID</th>
                <th class="px-6 py-3">Customer</th>
                <th class="px-6 py-3">Items</th>
                <th class="px-6 py-3">Total</th>
                <th class="px-6 py-3">Payment</th>
                <th class="px-6 py-3">Status</th>
                <th class="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 text-slate-300">
              ${orders.slice(0, 5).map(o => `
                <tr class="hover:bg-slate-900/60 transition">
                  <td class="px-6 py-3.5 font-mono font-bold text-rose-300">${o.id}</td>
                  <td class="px-6 py-3.5">
                    <div class="font-bold text-white">${o.customer.name}</div>
                    <div class="text-[11px] text-slate-400">${o.customer.city || 'Kota'}, ${o.customer.phone}</div>
                  </td>
                  <td class="px-6 py-3.5">
                    ${o.items.map(i => `${i.name} (${i.size || 'Free'}, ${i.color || 'Standard'}) x${i.quantity}`).join("<br/>")}
                  </td>
                  <td class="px-6 py-3.5 font-bold text-white">${formatCurrency(o.total)}</td>
                  <td class="px-6 py-3.5">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${o.paymentStatus === 'Paid' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}">
                      ${o.paymentStatus}
                    </span>
                  </td>
                  <td class="px-6 py-3.5">
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${getOrderStatusBadgeClass(o.orderStatus)}">
                      ${o.orderStatus}
                    </span>
                  </td>
                  <td class="px-6 py-3.5 text-right">
                    <button class="view-order-btn text-rose-400 hover:text-rose-300 font-bold" data-order-id="${o.id}">
                      Manage →
                    </button>
                  </td>
                </tr>
              `).join("")}
              ${orders.length === 0 ? `
                <tr>
                  <td colspan="7" class="px-6 py-8 text-center text-slate-500">No orders received yet.</td>
                </tr>
              ` : ""}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  // Listeners
  document.getElementById("dash-add-product")?.addEventListener("click", () => openProductModal());
  document.getElementById("dash-view-orders")?.addEventListener("click", () => {
    adminState.activeTab = "orders";
    renderAdminShell();
  });
  document.getElementById("dash-see-all-orders")?.addEventListener("click", () => {
    adminState.activeTab = "orders";
    renderAdminShell();
  });
  document.getElementById("dash-edit-content")?.addEventListener("click", () => {
    adminState.activeTab = "content";
    renderAdminShell();
  });

  container.querySelectorAll(".view-order-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const orderId = e.currentTarget.dataset.orderId;
      openOrderModal(orderId);
    });
  });
}

function getOrderStatusBadgeClass(status) {
  switch (status) {
    case "Pending": return "bg-amber-950/80 text-amber-300 border border-amber-800";
    case "Confirmed": return "bg-blue-950/80 text-blue-300 border border-blue-800";
    case "Processing": return "bg-purple-950/80 text-purple-300 border border-purple-800";
    case "Shipped": return "bg-indigo-950/80 text-indigo-300 border border-indigo-800";
    case "Delivered": return "bg-emerald-950/80 text-emerald-300 border border-emerald-800";
    case "Cancelled": return "bg-rose-950/80 text-rose-300 border border-rose-800";
    default: return "bg-slate-800 text-slate-300";
  }
}

/* ==========================================================================
   3. PRODUCTS TAB
   ========================================================================== */
function renderProductsTab(container) {
  const products = db.getProducts();
  const categories = db.getCategories();

  // Filter products
  const filtered = products.filter(p => {
    const matchesSearch = !adminState.productSearchQuery ||
      p.name.toLowerCase().includes(adminState.productSearchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(adminState.productSearchQuery.toLowerCase());
    const matchesCat = adminState.productCategoryFilter === "all" || p.category === adminState.productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  container.innerHTML = `
    <div class="space-y-6">
      
      <!-- Toolbar -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div class="flex items-center gap-3 w-full sm:w-auto flex-1">
          <input
            type="text"
            id="product-search-input"
            placeholder="Search products by title or tag..."
            value="${adminState.productSearchQuery}"
            class="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <select
            id="product-cat-filter"
            class="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="all">All Categories</option>
            ${categories.filter(c => c.id !== 'all').map(c => `
              <option value="${c.id}" ${adminState.productCategoryFilter === c.id ? 'selected' : ''}>${c.name}</option>
            `).join("")}
          </select>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button id="add-product-btn" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition flex items-center gap-1.5 shrink-0">
            <span>+</span>
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      <!-- Products Table -->
      <div class="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th class="px-4 py-3">Product</th>
                <th class="px-4 py-3">Category</th>
                <th class="px-4 py-3">Price</th>
                <th class="px-4 py-3">Stock</th>
                <th class="px-4 py-3">Badges</th>
                <th class="px-4 py-3">Visibility</th>
                <th class="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 text-slate-300">
              ${filtered.map(p => `
                <tr class="hover:bg-slate-900/60 transition">
                  <td class="px-4 py-3.5">
                    <div class="flex items-center gap-3">
                      <img
                        src="${p.images && p.images[0] ? p.images[0] : 'https://placehold.co/100'}"
                        alt="${p.name}"
                        class="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <div class="font-bold text-white hover:text-rose-400 transition">${p.name}</div>
                        <div class="text-[10px] text-slate-400 font-mono">${p.id} • ${p.sizes ? p.sizes.length : 0} sizes • ${p.colors ? p.colors.length : 0} colours</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3.5 capitalize">
                    <span class="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]">
                      ${p.category || 'General'}
                    </span>
                  </td>
                  <td class="px-4 py-3.5">
                    <div class="font-bold text-white">${formatCurrency(p.discountPrice || p.price)}</div>
                    ${p.discountPrice ? `<div class="text-[10px] text-slate-500 line-through">${formatCurrency(p.price)}</div>` : ''}
                  </td>
                  <td class="px-4 py-3.5">
                    <span class="font-bold ${p.stock < 5 ? 'text-amber-400 font-black' : 'text-slate-300'}">
                      ${p.stock} in stock
                    </span>
                  </td>
                  <td class="px-4 py-3.5">
                    <div class="flex items-center gap-1 flex-wrap">
                      ${p.badge ? `<span class="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 text-[9px] font-bold">${p.badge}</span>` : ''}
                      ${p.isBestSeller ? `<span class="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 text-[9px] font-bold">Best Seller</span>` : ''}
                      ${p.isFeatured ? `<span class="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 text-[9px] font-bold">Featured</span>` : ''}
                    </div>
                  </td>
                  <td class="px-4 py-3.5">
                    <button
                      class="toggle-status-btn px-2.5 py-1 rounded-full text-[10px] font-bold transition ${p.isActive !== false ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400 border border-slate-700'}"
                      data-id="${p.id}"
                      data-active="${p.isActive !== false}"
                    >
                      ${p.isActive !== false ? '● Active' : '○ Disabled'}
                    </button>
                  </td>
                  <td class="px-4 py-3.5 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button class="edit-product-btn p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 text-xs font-bold transition" data-id="${p.id}" title="Edit Product">
                        ✏️ Edit
                      </button>
                      <button class="delete-product-btn p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 text-xs font-bold transition" data-id="${p.id}" title="Delete Product">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              `).join("")}
              ${filtered.length === 0 ? `
                <tr>
                  <td colspan="7" class="px-6 py-12 text-center text-slate-500">
                    No products found matching your filter.
                  </td>
                </tr>
              ` : ""}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  // Handlers
  document.getElementById("add-product-btn")?.addEventListener("click", () => openProductModal());

  const searchInput = document.getElementById("product-search-input");
  searchInput?.addEventListener("input", (e) => {
    adminState.productSearchQuery = e.target.value;
    renderProductsTab(container);
  });

  const catFilter = document.getElementById("product-cat-filter");
  catFilter?.addEventListener("change", (e) => {
    adminState.productCategoryFilter = e.target.value;
    renderProductsTab(container);
  });

  container.querySelectorAll(".toggle-status-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      const currentActive = e.currentTarget.dataset.active === "true";
      await db.toggleProductStatusAsync(id, !currentActive);
      showToast(`Product ${!currentActive ? 'enabled' : 'disabled'} successfully.`, "info");
      renderProductsTab(container);
    });
  });

  container.querySelectorAll(".edit-product-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      openProductModal(id);
    });
  });

  container.querySelectorAll(".delete-product-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      if (confirm(`Are you sure you want to delete product "${id}"? This cannot be undone.`)) {
        await db.deleteProductAsync(id);
        showToast("Product deleted successfully.", "success");
        renderProductsTab(container);
      }
    });
  });
}

/* ==========================================================================
   4. CATEGORIES TAB
   ========================================================================== */
function renderCategoriesTab(container) {
  const categories = db.getCategories();

  container.innerHTML = `
    <div class="space-y-6">
      
      <div class="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div>
          <h3 class="font-serif font-bold text-white text-base">Store Navigation Categories</h3>
          <p class="text-xs text-slate-400">Categories appear on the homepage and filter the product catalog.</p>
        </div>
        <button id="add-category-btn" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5">
          <span>+</span>
          <span>Add New Category</span>
        </button>
      </div>

      <div class="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th class="px-6 py-3">Category Name</th>
              <th class="px-6 py-3">Slug / ID</th>
              <th class="px-6 py-3">Description</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800 text-slate-300">
            ${categories.map(c => `
              <tr class="hover:bg-slate-900/60 transition">
                <td class="px-6 py-3.5 font-bold text-white flex items-center gap-2">
                  <span>${c.icon === 'crown' ? '👑' : c.icon === 'heart' ? '💖' : c.icon === 'star' ? '⭐' : c.icon === 'smile' ? '🧸' : '✨'}</span>
                  <span>${c.name}</span>
                </td>
                <td class="px-6 py-3.5 font-mono text-slate-400 text-[11px]">${c.id}</td>
                <td class="px-6 py-3.5 text-slate-400">${c.description || '—'}</td>
                <td class="px-6 py-3.5">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${c.isActive !== false ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'}">
                    ${c.isActive !== false ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td class="px-6 py-3.5 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button class="edit-category-btn text-rose-400 hover:text-rose-300 font-bold" data-id="${c.id}">
                      Edit
                    </button>
                    ${c.id !== 'all' ? `
                      <button class="delete-category-btn text-slate-500 hover:text-rose-400 font-bold ml-2" data-id="${c.id}">
                        Delete
                      </button>
                    ` : ''}
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

    </div>
  `;

  document.getElementById("add-category-btn")?.addEventListener("click", () => openCategoryModal());

  container.querySelectorAll(".edit-category-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      openCategoryModal(e.currentTarget.dataset.id);
    });
  });

  container.querySelectorAll(".delete-category-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      if (confirm(`Delete category "${id}"?`)) {
        await db.deleteCategoryAsync(id);
        showToast("Category removed.", "success");
        renderCategoriesTab(container);
      }
    });
  });
}

/* ==========================================================================
   5. ORDERS TAB
   ========================================================================== */
function renderOrdersTab(container) {
  const orders = db.getOrders();

  const filtered = orders.filter(o => {
    const matchesStatus = adminState.orderStatusFilter === "all" || o.orderStatus === adminState.orderStatusFilter;
    const q = adminState.orderSearchQuery.toLowerCase();
    const matchesSearch = !q ||
      o.id.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.phone.includes(q) ||
      (o.customer.city && o.customer.city.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  container.innerHTML = `
    <div class="space-y-6">
      
      <!-- Filter Bar -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          ${["all", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(st => `
            <button
              class="order-filter-pill px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${adminState.orderStatusFilter === st ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}"
              data-status="${st}"
            >
              ${st === 'all' ? 'All Orders' : st}
            </button>
          `).join("")}
        </div>

        <input
          type="text"
          id="order-search-input"
          placeholder="Search by order ID, name, or phone..."
          value="${adminState.orderSearchQuery}"
          class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </div>

      <!-- Orders List -->
      <div class="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th class="px-6 py-3">Order ID & Date</th>
                <th class="px-6 py-3">Customer & Address</th>
                <th class="px-6 py-3">Items Ordered</th>
                <th class="px-6 py-3">Total Amount</th>
                <th class="px-6 py-3">Payment</th>
                <th class="px-6 py-3">Order Status</th>
                <th class="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 text-slate-300">
              ${filtered.map(o => `
                <tr class="hover:bg-slate-900/60 transition">
                  <td class="px-6 py-3.5">
                    <div class="font-mono font-bold text-rose-300">${o.id}</div>
                    <div class="text-[10px] text-slate-500">${formatDate(o.createdAt)}</div>
                  </td>
                  <td class="px-6 py-3.5">
                    <div class="font-bold text-white">${o.customer.name}</div>
                    <div class="text-[11px] text-slate-400">${o.customer.phone}</div>
                    <div class="text-[10px] text-slate-500 truncate max-w-xs">${o.customer.address}, ${o.customer.city}</div>
                  </td>
                  <td class="px-6 py-3.5">
                    <div class="space-y-1">
                      ${o.items.map(item => `
                        <div class="text-[11px] flex items-center gap-1.5">
                          <span class="font-bold text-white">${item.quantity}x</span>
                          <span class="truncate max-w-[160px]">${item.name}</span>
                          <span class="text-[10px] text-rose-300 font-semibold">[${item.size || 'Free'}, ${item.color || 'Standard'}]</span>
                        </div>
                      `).join("")}
                    </div>
                  </td>
                  <td class="px-6 py-3.5">
                    <div class="font-bold text-white text-sm">${formatCurrency(o.total)}</div>
                    <div class="text-[10px] text-slate-500">${o.items.length} items</div>
                  </td>
                  <td class="px-6 py-3.5">
                    <div class="font-semibold text-white">${o.paymentMethod || 'Razorpay'}</div>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${o.paymentStatus === 'Paid' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}">
                      ${o.paymentStatus}
                    </span>
                  </td>
                  <td class="px-6 py-3.5">
                    <select
                      class="order-quick-status-select px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-[11px] font-bold focus:outline-none focus:ring-1 focus:ring-rose-500"
                      data-order-id="${o.id}"
                    >
                      ${["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"].map(st => `
                        <option value="${st}" ${o.orderStatus === st ? 'selected' : ''}>${st}</option>
                      `).join("")}
                    </select>
                    ${o.trackingNumber ? `
                      <div class="text-[10px] text-indigo-300 mt-1 font-mono">
                        ${o.courier || 'Courier'}: ${o.trackingNumber}
                      </div>
                    ` : ''}
                  </td>
                  <td class="px-6 py-3.5 text-right">
                    <button class="open-order-details-btn px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 text-xs font-bold transition" data-order-id="${o.id}">
                      Manage / Dispatch →
                    </button>
                  </td>
                </tr>
              `).join("")}
              ${filtered.length === 0 ? `
                <tr>
                  <td colspan="7" class="px-6 py-12 text-center text-slate-500">
                    No orders found matching the filter.
                  </td>
                </tr>
              ` : ""}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  // Listeners
  container.querySelectorAll(".order-filter-pill").forEach(btn => {
    btn.addEventListener("click", (e) => {
      adminState.orderStatusFilter = e.currentTarget.dataset.status;
      renderOrdersTab(container);
    });
  });

  const orderSearch = document.getElementById("order-search-input");
  orderSearch?.addEventListener("input", (e) => {
    adminState.orderSearchQuery = e.target.value;
    renderOrdersTab(container);
  });

  container.querySelectorAll(".order-quick-status-select").forEach(sel => {
    sel.addEventListener("change", async (e) => {
      const orderId = e.currentTarget.dataset.orderId;
      const newStatus = e.currentTarget.value;
      await db.updateOrderStatusAsync(orderId, newStatus);
      showToast(`Order ${orderId} updated to ${newStatus}.`, "success");
      renderOrdersTab(container);
    });
  });

  container.querySelectorAll(".open-order-details-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      openOrderModal(e.currentTarget.dataset.orderId);
    });
  });
}

/* ==========================================================================
   6. WEBSITE CONTENT TAB
   ========================================================================== */
function renderContentTab(container) {
  const settings = db.getSettings();

  container.innerHTML = `
    <div class="max-w-4xl space-y-6">
      
      <form id="website-content-form" class="space-y-6">
        
        <!-- Hero Section Management -->
        <div class="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 class="font-serif font-bold text-white text-base">Homepage Hero Banner & Headings</h3>
            <span class="text-xs text-rose-400 font-bold">Front-Page Showcase</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-xs font-bold text-slate-300 mb-1">Hero Main Heading</label>
              <input
                type="text"
                id="content-hero-heading"
                value="${settings.heroHeading || 'Making Every Childhood More Stylish.'}"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-xs font-bold text-slate-300 mb-1">Hero Subtitle & Intro Text</label>
              <textarea
                id="content-hero-sub"
                rows="2"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-rose-500"
              >${settings.heroSubtitle || 'Discover adorable outfits for every little moment. From royal festive frocks and dapper kurta sets to everyday organic playwear.'}</textarea>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Hero Promotional Badge</label>
              <input
                type="text"
                id="content-promo-badge"
                value="${settings.promoBadge || 'New Spring / Festive 2026 Collection • Ages 1 to 16 Years'}"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Hero Banner Image URL</label>
              <input
                type="text"
                id="content-hero-image"
                value="${settings.heroBannerImage || 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1200&q=85'}"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        <!-- Announcement & Promo Bar -->
        <div class="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div class="border-b border-slate-800 pb-3">
            <h3 class="font-serif font-bold text-white text-base">Top Announcement & Shipping Rates</h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="sm:col-span-3">
              <label class="block text-xs font-bold text-slate-300 mb-1">Top Announcement Bar Text</label>
              <input
                type="text"
                id="content-announcement"
                value="${settings.announcement || 'Free Express Shipping on Orders Above ₹999 | Use Code: FIRSTKID for 15% OFF'}"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                id="content-free-ship-threshold"
                value="${settings.freeShippingThreshold || 999}"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                id="content-shipping-fee"
                value="${settings.shippingFee || 99}"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Razorpay Key ID (Test Mode)</label>
              <input
                type="text"
                id="content-razorpay-key"
                value="${settings.razorpayKeyId || 'rzp_test_sheandshe_kids'}"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        <!-- Store Contact & Dadabari Kota Location -->
        <div class="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div class="border-b border-slate-800 pb-3">
            <h3 class="font-serif font-bold text-white text-base">Store Location & Contact Details</h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Store Phone Number</label>
              <input
                type="text"
                id="content-phone"
                value="${settings.storeInfo?.phone || '+91 88248 44263'}"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">WhatsApp Customer Care</label>
              <input
                type="text"
                id="content-whatsapp"
                value="${settings.storeInfo?.whatsapp || '+918824844263'}"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-xs font-bold text-slate-300 mb-1">Physical Store Address</label>
              <input
                type="text"
                id="content-address"
                value="${settings.storeInfo?.address || 'Plot 14, Main Dadabari Circle, Dadabari, Kota, Rajasthan, India - 324009'}"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-xs font-bold text-slate-300 mb-1">Google Maps Direction URL</label>
              <input
                type="text"
                id="content-maps-url"
                value="${settings.storeInfo?.mapsUrl || 'https://www.google.com/maps/search/?api=1&query=Dadabari,+Kota,+Rajasthan,+India'}"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        <!-- Policies -->
        <div class="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div class="border-b border-slate-800 pb-3">
            <h3 class="font-serif font-bold text-white text-base">Store Policies & About Us</h3>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">About Us Statement</label>
              <textarea
                id="content-about"
                rows="3"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-rose-500"
              >${settings.aboutContent || ''}</textarea>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">7-Day Return & Exchange Policy</label>
              <textarea
                id="content-return-policy"
                rows="3"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-rose-500"
              >${settings.returnPolicy || ''}</textarea>
            </div>
          </div>
        </div>

        <button
          type="submit"
          class="px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition"
        >
          Save Website Changes 💾
        </button>

      </form>

    </div>
  `;

  document.getElementById("website-content-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const current = db.getSettings();

    const updated = {
      heroHeading: document.getElementById("content-hero-heading").value,
      heroSubtitle: document.getElementById("content-hero-sub").value,
      promoBadge: document.getElementById("content-promo-badge").value,
      heroBannerImage: document.getElementById("content-hero-image").value,
      announcement: document.getElementById("content-announcement").value,
      freeShippingThreshold: Number(document.getElementById("content-free-ship-threshold").value),
      shippingFee: Number(document.getElementById("content-shipping-fee").value),
      razorpayKeyId: document.getElementById("content-razorpay-key").value,
      aboutContent: document.getElementById("content-about").value,
      returnPolicy: document.getElementById("content-return-policy").value,
      storeInfo: {
        ...current.storeInfo,
        phone: document.getElementById("content-phone").value,
        whatsapp: document.getElementById("content-whatsapp").value,
        address: document.getElementById("content-address").value,
        mapsUrl: document.getElementById("content-maps-url").value
      }
    };

    await db.updateSettingsAsync(updated);
    showToast("Website content updated successfully!", "success");
  });
}

/* ==========================================================================
   7. CLOUD & SUPABASE SETUP TAB
   ========================================================================== */
function renderDatabaseTab(container) {
  const config = getSupabaseConfig();
  const isConfigured = isSupabaseConfigured();

  container.innerHTML = `
    <div class="max-w-4xl space-y-6">
      
      <!-- Connection Status Banner -->
      <div class="p-6 rounded-2xl ${isConfigured ? 'bg-emerald-950/40 border border-emerald-800' : 'bg-amber-950/30 border border-amber-800'} space-y-2">
        <div class="flex items-center gap-3">
          <span class="w-3 h-3 rounded-full ${isConfigured ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}"></span>
          <h3 class="font-serif font-bold text-white text-base">
            ${isConfigured ? 'Supabase Cloud Backend Active' : 'Operating in Standalone Local Storage Mode'}
          </h3>
        </div>
        <p class="text-xs text-slate-300">
          ${isConfigured
            ? 'Your website is securely connected to Supabase PostgreSQL, Authentication, and Cloud Storage for product photos.'
            : 'You are currently using browser local storage. Connect your free Supabase project below to enable cloud data sync across devices and image hosting.'}
        </p>
      </div>

      <!-- Credentials Form -->
      <div class="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
        <div class="border-b border-slate-800 pb-3">
          <h3 class="font-serif font-bold text-white text-base">Supabase Project API Keys</h3>
          <p class="text-xs text-slate-400 mt-1">Found in your Supabase Dashboard under <b>Project Settings → API</b>.</p>
        </div>

        <form id="supabase-config-form" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Project URL</label>
            <input
              type="url"
              id="supabase-url-input"
              placeholder="https://xyzcompany.supabase.co"
              value="${config.supabaseUrl || ''}"
              required
              class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Project Public Anon Key (anon / public)</label>
            <input
              type="text"
              id="supabase-anon-input"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              value="${config.supabaseAnonKey || ''}"
              required
              class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:ring-2 focus:ring-rose-500"
            />
            <p class="text-[11px] text-slate-400 mt-1">
              🔒 <b>Security Note:</b> Never provide the <code class="text-rose-400">service_role</code> secret key. The public anon key is safe for client applications with Row Level Security.
            </p>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Storage Bucket Name for Product Images</label>
            <input
              type="text"
              id="supabase-bucket-input"
              value="${config.storageBucket || 'product-images'}"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div class="flex items-center gap-3 pt-2 flex-wrap">
            <button
              type="submit"
              class="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition"
            >
              Save Credentials 💾
            </button>
            <button
              type="button"
              id="test-supabase-btn"
              class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
            >
              Test Live Connection 🔌
            </button>
            ${isConfigured ? `
              <button
                type="button"
                id="clear-supabase-btn"
                class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-400 text-xs font-bold transition ml-auto"
              >
                Disconnect
              </button>
            ` : ''}
          </div>
        </form>
      </div>

      <!-- Push Data to Supabase Button -->
      <div class="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <h3 class="font-serif font-bold text-white text-base">1-Click Local Data Migration to Cloud</h3>
        <p class="text-xs text-slate-400">
          Already have products, categories, and settings locally? Click below to push your entire catalog directly into your Supabase database in one step.
        </p>
        <button
          type="button"
          id="push-to-supabase-btn"
          class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-md transition"
        >
          🚀 Sync Local Catalog to Supabase Database
        </button>
      </div>

      <!-- Setup Instructions -->
      <div class="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <h3 class="font-serif font-bold text-white text-base">Quick Supabase Setup Guide</h3>
        <ol class="list-decimal list-inside text-xs text-slate-300 space-y-2 leading-relaxed">
          <li>Create a free account at <a href="https://supabase.com" target="_blank" class="text-rose-400 underline">supabase.com</a> and click <b>New Project</b>.</li>
          <li>In your Supabase project dashboard, open the <b>SQL Editor</b>.</li>
          <li>Copy the contents of <code class="text-amber-300">schema.sql</code> (included in your project folder) and click <b>RUN</b>. This automatically sets up the categories, products, orders, order items, site settings tables, and storage bucket.</li>
          <li>Go to <b>Project Settings → API</b> and copy your <b>Project URL</b> and <b>anon / public API key</b>.</li>
          <li>Paste them above and click <b>Save Credentials</b>!</li>
        </ol>
      </div>

    </div>
  `;

  // Listeners
  document.getElementById("supabase-config-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = document.getElementById("supabase-url-input").value;
    const anon = document.getElementById("supabase-anon-input").value;
    const bucket = document.getElementById("supabase-bucket-input").value;

    saveSupabaseConfig(url, anon, bucket);
    showToast("Supabase credentials saved successfully!", "success");
    renderAdminShell();
  });

  document.getElementById("test-supabase-btn")?.addEventListener("click", async () => {
    const url = document.getElementById("supabase-url-input").value;
    const anon = document.getElementById("supabase-anon-input").value;
    if (!url || !anon) {
      showToast("Please enter both URL and Anon key.", "error");
      return;
    }
    showToast("Testing connection to Supabase...", "info");
    const res = await testConnection(url, anon);
    if (res.success) {
      showToast(res.message, "success");
    } else {
      showToast(res.message, "error");
    }
  });

  document.getElementById("clear-supabase-btn")?.addEventListener("click", () => {
    if (confirm("Disconnect Supabase credentials? Your site will switch to local storage mode.")) {
      clearSupabaseConfig();
      showToast("Disconnected from Supabase.", "info");
      renderAdminShell();
    }
  });

  document.getElementById("push-to-supabase-btn")?.addEventListener("click", async () => {
    showToast("Synchronizing catalog to Supabase...", "info");
    const res = await db.pushLocalDataToSupabase();
    if (res.success) {
      showToast(res.message, "success");
    } else {
      showToast(res.message, "error");
    }
  });
}

/* ==========================================================================
   8. PRODUCT MODAL (ADD / EDIT / MULTI-IMAGE UPLOAD)
   ========================================================================== */
function openProductModal(productId = null) {
  adminState.editingProductId = productId;
  const product = productId ? db.getProductById(productId) : null;
  const categories = db.getCategories();

  adminState.productImages = product && product.images ? [...product.images] : [];
  adminState.productColors = product && product.colors ? JSON.parse(JSON.stringify(product.colors)) : [
    { name: "Blush Pink", hex: "#FCE7F3", imageIndex: 0 }
  ];

  const modalContainer = document.getElementById("admin-modal-container");
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div id="product-editor-modal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div class="bg-slate-900 rounded-3xl w-full max-w-4xl border border-slate-800 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        <!-- Modal Top Bar -->
        <div class="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2.5">
            <span class="text-xl">👗</span>
            <h3 class="font-serif font-bold text-white text-lg">
              ${productId ? 'Edit Kidswear Product' : 'Add New Kidswear Product'}
            </h3>
          </div>
          <button id="close-product-modal-btn" class="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm transition">
            ✕
          </button>
        </div>

        <!-- Form Body -->
        <form id="product-editor-form" class="flex-1 overflow-y-auto p-6 space-y-6">
          
          <!-- IMAGE MANAGEMENT & DIRECT COMPUTER UPLOADER -->
          <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-serif font-bold text-white text-sm">Product Photography (Cloud Storage)</h4>
                <p class="text-[11px] text-slate-400">Upload images from your computer or add image URLs. The first image is the Primary cover.</p>
              </div>
              <span id="upload-status-indicator" class="text-[11px] text-rose-400 font-bold hidden">Uploading...</span>
            </div>

            <!-- Drag & Drop / File Input Area -->
            <div class="border-2 border-dashed border-slate-700 hover:border-rose-500/80 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-900/50" id="file-drop-zone">
              <input type="file" id="product-file-input" multiple accept="image/*" class="hidden" />
              <div class="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center text-2xl mx-auto mb-2">
                📸
              </div>
              <p class="text-xs font-bold text-white">Click to upload from computer or drag photos here</p>
              <p class="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WebP (Images automatically optimized for mobile web speed)</p>
            </div>

            <!-- Manual URL input -->
            <div class="flex items-center gap-2">
              <input
                type="url"
                id="manual-image-url-input"
                placeholder="Or paste an image web link (Unsplash, CDN)..."
                class="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-rose-500"
              />
              <button
                type="button"
                id="add-image-url-btn"
                class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition shrink-0"
              >
                Add URL
              </button>
            </div>

            <!-- Thumbnails Gallery Preview -->
            <div id="product-thumbnails-preview" class="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-2">
              ${renderThumbnailsHTML()}
            </div>
          </div>

          <!-- BASIC PRODUCT INFO -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-xs font-bold text-slate-300 mb-1">Product Title *</label>
              <input
                type="text"
                id="prod-title"
                required
                placeholder="e.g. Rose Blush Princess Tulle Party Frock"
                value="${product ? product.name : ''}"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Primary Category *</label>
              <select
                id="prod-category"
                required
                class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-rose-500"
              >
                ${categories.filter(c => c.id !== 'all').map(c => `
                  <option value="${c.id}" ${product && product.category === c.id ? 'selected' : ''}>${c.name}</option>
                `).join("")}
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Sub-Category</label>
              <select
                id="prod-sub-category"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-rose-500"
              >
                <option value="party" ${product && product.subCategory === 'party' ? 'selected' : ''}>Party Wear</option>
                <option value="casual" ${product && product.subCategory === 'casual' ? 'selected' : ''}>Casual Wear</option>
                <option value="festive" ${product && product.subCategory === 'festive' ? 'selected' : ''}>Festive / Traditional</option>
                <option value="winter" ${product && product.subCategory === 'winter' ? 'selected' : ''}>Winter Wear</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Regular Price (₹) *</label>
              <input
                type="number"
                id="prod-price"
                required
                placeholder="2499"
                value="${product ? product.price : ''}"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Discounted Selling Price (₹)</label>
              <input
                type="number"
                id="prod-discount-price"
                placeholder="1599"
                value="${product && product.discountPrice ? product.discountPrice : ''}"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Stock Inventory Count *</label>
              <input
                type="number"
                id="prod-stock"
                required
                placeholder="20"
                value="${product ? product.stock : 15}"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Promotional Badge Tag</label>
              <input
                type="text"
                id="prod-badge"
                placeholder="e.g. Bestseller, Pure Organic, Trending"
                value="${product && product.badge ? product.badge : ''}"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <!-- AGE SIZES (1-2Y to 15-16Y) -->
          <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-slate-300">Select Available Kid Sizes (1–16 Years):</label>
              <button type="button" id="select-all-sizes-btn" class="text-[11px] text-rose-400 hover:text-rose-300 font-bold">
                Select All
              </button>
            </div>
            <div class="grid grid-cols-5 sm:grid-cols-10 gap-2" id="prod-sizes-grid">
              ${SIZE_LIST.map(sz => {
                const isChecked = product && product.sizes ? product.sizes.includes(sz) : true;
                return `
                  <label class="flex flex-col items-center p-2 rounded-xl border border-slate-800 hover:border-rose-500/60 cursor-pointer text-center transition bg-slate-900/60">
                    <input type="checkbox" value="${sz}" class="prod-size-check rounded text-rose-600 focus:ring-rose-500 mb-1" ${isChecked ? 'checked' : ''} />
                    <span class="text-[11px] font-bold text-slate-300">${sz}</span>
                  </label>
                `;
              }).join("")}
            </div>
          </div>

          <!-- COLOURS MANAGEMENT -->
          <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-slate-300">Colour Swatches & Options:</label>
              <button type="button" id="add-color-swatch-btn" class="text-[11px] text-rose-400 hover:text-rose-300 font-bold">
                + Add Colour
              </button>
            </div>
            <div id="colors-list-container" class="space-y-2">
              ${renderColorsListHTML()}
            </div>
          </div>

          <!-- FABRIC & SEO DETAILS -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Fabric & Material Composition</label>
              <input
                type="text"
                id="prod-fabric"
                placeholder="e.g. 100% Cotton with Tulle Layering"
                value="${product && product.fabric ? product.fabric : ''}"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Suitable Age Group</label>
              <input
                type="text"
                id="prod-age-group"
                placeholder="e.g. 1 to 12 Years"
                value="${product && product.ageGroup ? product.ageGroup : '1 to 16 Years'}"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-xs font-bold text-slate-300 mb-1">Comfort & Styling Details</label>
              <textarea
                id="prod-comfort"
                rows="2"
                placeholder="e.g. Soft-stitched inner bodice for itchy-free wear..."
                class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-rose-500"
              >${product && product.comfortAndStyling ? product.comfortAndStyling : ''}</textarea>
            </div>

            <div class="sm:col-span-2">
              <label class="block text-xs font-bold text-slate-300 mb-1">Washing & Care Instructions</label>
              <input
                type="text"
                id="prod-washing"
                placeholder="e.g. Gentle hand wash in cold water or dry clean."
                value="${product && product.washingInstructions ? product.washingInstructions : ''}"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-xs font-bold text-slate-300 mb-1">Full Product Description (SEO Friendly)</label>
              <textarea
                id="prod-description"
                rows="3"
                placeholder="Write an attractive description..."
                class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-rose-500"
              >${product && product.description ? product.description : ''}</textarea>
            </div>
          </div>

          <!-- TOGGLES -->
          <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" id="prod-is-active" class="rounded text-rose-600 focus:ring-rose-500" ${product ? (product.isActive !== false ? 'checked' : '') : 'checked'} />
              <span class="text-xs font-bold text-white">Active on Store</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" id="prod-is-featured" class="rounded text-rose-600 focus:ring-rose-500" ${product && product.isFeatured ? 'checked' : ''} />
              <span class="text-xs font-bold text-white">Featured Item</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" id="prod-is-bestseller" class="rounded text-rose-600 focus:ring-rose-500" ${product && product.isBestSeller ? 'checked' : ''} />
              <span class="text-xs font-bold text-white">Best Seller</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" id="prod-is-new" class="rounded text-rose-600 focus:ring-rose-500" ${product && product.isNew ? 'checked' : ''} />
              <span class="text-xs font-bold text-white">New Arrival</span>
            </label>
          </div>

          <!-- SUBMIT BUTTON -->
          <div class="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button type="button" id="cancel-product-btn" class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition">
              Cancel
            </button>
            <button type="submit" id="save-product-submit-btn" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition">
              ${productId ? 'Update Product 💾' : 'Publish Product to Store 🚀'}
            </button>
          </div>

        </form>

      </div>
    </div>
  `;

  setupProductModalListeners(productId, product);
}

function renderThumbnailsHTML() {
  if (adminState.productImages.length === 0) {
    return `<div class="col-span-full text-center text-slate-500 text-xs py-2">No photos added yet.</div>`;
  }

  return adminState.productImages.map((url, idx) => `
    <div class="relative group rounded-xl overflow-hidden border ${idx === 0 ? 'border-rose-500 ring-2 ring-rose-500/50' : 'border-slate-700'} aspect-square bg-slate-950">
      <img src="${url}" class="w-full h-full object-cover" />
      ${idx === 0 ? `
        <span class="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-rose-600 text-white text-[9px] font-bold">
          Primary
        </span>
      ` : `
        <button type="button" class="set-primary-img-btn absolute top-1 left-1 px-1.5 py-0.5 rounded bg-slate-900/80 hover:bg-rose-600 text-white text-[9px] opacity-0 group-hover:opacity-100 transition" data-idx="${idx}">
          Make Primary
        </button>
      `}
      <button type="button" class="remove-img-btn absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition" data-idx="${idx}">
        ✕
      </button>
    </div>
  `).join("");
}

function renderColorsListHTML() {
  return adminState.productColors.map((col, idx) => `
    <div class="flex items-center gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
      <input type="color" value="${col.hex || '#FCE7F3'}" class="color-hex-picker w-8 h-8 rounded-lg bg-transparent cursor-pointer border-0" data-idx="${idx}" />
      <input type="text" value="${col.name || 'Colour'}" placeholder="Color Name (e.g. Blush Pink)" class="color-name-input flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs" data-idx="${idx}" />
      <button type="button" class="remove-color-btn text-slate-500 hover:text-rose-400 text-xs font-bold px-2" data-idx="${idx}">
        ✕
      </button>
    </div>
  `).join("");
}

function setupProductModalListeners(productId, product) {
  const modal = document.getElementById("product-editor-modal");
  const closeBtn = document.getElementById("close-product-modal-btn");
  const cancelBtn = document.getElementById("cancel-product-btn");

  const closeModal = () => {
    const modalContainer = document.getElementById("admin-modal-container");
    if (modalContainer) modalContainer.innerHTML = "";
  };

  closeBtn?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", closeModal);

  // File Upload Handlers (from computer)
  const dropZone = document.getElementById("file-drop-zone");
  const fileInput = document.getElementById("product-file-input");
  const uploadStatus = document.getElementById("upload-status-indicator");

  dropZone?.addEventListener("click", () => fileInput?.click());

  fileInput?.addEventListener("change", async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (uploadStatus) {
      uploadStatus.classList.remove("hidden");
      uploadStatus.textContent = `Optimizing and uploading ${files.length} image(s)...`;
    }

    for (const file of files) {
      try {
        const result = await optimizeAndUploadImage(file, (msg) => {
          if (uploadStatus) uploadStatus.textContent = msg;
        });
        if (result && result.url) {
          adminState.productImages.push(result.url);
        }
      } catch (err) {
        showToast(err.message, "error");
      }
    }

    if (uploadStatus) uploadStatus.classList.add("hidden");
    const previewContainer = document.getElementById("product-thumbnails-preview");
    if (previewContainer) previewContainer.innerHTML = renderThumbnailsHTML();
    bindThumbnailButtons();
  });

  // Manual Image URL handler
  document.getElementById("add-image-url-btn")?.addEventListener("click", () => {
    const input = document.getElementById("manual-image-url-input");
    const val = input.value.trim();
    if (val) {
      adminState.productImages.push(val);
      input.value = "";
      const previewContainer = document.getElementById("product-thumbnails-preview");
      if (previewContainer) previewContainer.innerHTML = renderThumbnailsHTML();
      bindThumbnailButtons();
    }
  });

  bindThumbnailButtons();

  // Select all sizes button
  document.getElementById("select-all-sizes-btn")?.addEventListener("click", () => {
    document.querySelectorAll(".prod-size-check").forEach(cb => cb.checked = true);
  });

  // Color Swatch Handlers
  document.getElementById("add-color-swatch-btn")?.addEventListener("click", () => {
    adminState.productColors.push({ name: "Soft Peach", hex: "#FFE4E6", imageIndex: 0 });
    const colContainer = document.getElementById("colors-list-container");
    if (colContainer) colContainer.innerHTML = renderColorsListHTML();
    bindColorButtons();
  });

  bindColorButtons();

  // Form Submit
  const form = document.getElementById("product-editor-form");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (adminState.productImages.length === 0) {
      showToast("Please add at least one product photo.", "error");
      return;
    }

    const selectedSizes = Array.from(document.querySelectorAll(".prod-size-check:checked")).map(cb => cb.value);
    if (selectedSizes.length === 0) {
      showToast("Please select at least one available size.", "error");
      return;
    }

    const productPayload = {
      id: productId || (product ? product.id : null),
      name: document.getElementById("prod-title").value.trim(),
      category: document.getElementById("prod-category").value,
      subCategory: document.getElementById("prod-sub-category").value,
      price: Number(document.getElementById("prod-price").value),
      discountPrice: document.getElementById("prod-discount-price").value ? Number(document.getElementById("prod-discount-price").value) : null,
      stock: Number(document.getElementById("prod-stock").value),
      badge: document.getElementById("prod-badge").value.trim() || null,
      images: adminState.productImages,
      colors: adminState.productColors,
      sizes: selectedSizes,
      fabric: document.getElementById("prod-fabric").value.trim(),
      ageGroup: document.getElementById("prod-age-group").value.trim() || "1 to 16 Years",
      comfortAndStyling: document.getElementById("prod-comfort").value.trim(),
      washingInstructions: document.getElementById("prod-washing").value.trim(),
      description: document.getElementById("prod-description").value.trim(),
      isActive: document.getElementById("prod-is-active").checked,
      isFeatured: document.getElementById("prod-is-featured").checked,
      isBestSeller: document.getElementById("prod-is-bestseller").checked,
      isNew: document.getElementById("prod-is-new").checked
    };

    const submitBtn = document.getElementById("save-product-submit-btn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Saving product...";
    }

    try {
      await db.saveProductAsync(productPayload);
      showToast(`Product "${productPayload.name}" saved successfully!`, "success");
      closeModal();
      renderActiveTab();
    } catch (err) {
      showToast(err.message || "Failed to save product", "error");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Save Product";
      }
    }
  });
}

function bindThumbnailButtons() {
  document.querySelectorAll(".remove-img-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = Number(e.currentTarget.dataset.idx);
      adminState.productImages.splice(idx, 1);
      const previewContainer = document.getElementById("product-thumbnails-preview");
      if (previewContainer) previewContainer.innerHTML = renderThumbnailsHTML();
      bindThumbnailButtons();
    });
  });

  document.querySelectorAll(".set-primary-img-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = Number(e.currentTarget.dataset.idx);
      const [img] = adminState.productImages.splice(idx, 1);
      adminState.productImages.unshift(img);
      const previewContainer = document.getElementById("product-thumbnails-preview");
      if (previewContainer) previewContainer.innerHTML = renderThumbnailsHTML();
      bindThumbnailButtons();
    });
  });
}

function bindColorButtons() {
  document.querySelectorAll(".color-hex-picker").forEach(picker => {
    picker.addEventListener("input", (e) => {
      const idx = Number(e.target.dataset.idx);
      if (adminState.productColors[idx]) adminState.productColors[idx].hex = e.target.value;
    });
  });

  document.querySelectorAll(".color-name-input").forEach(input => {
    input.addEventListener("input", (e) => {
      const idx = Number(e.target.dataset.idx);
      if (adminState.productColors[idx]) adminState.productColors[idx].name = e.target.value;
    });
  });

  document.querySelectorAll(".remove-color-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = Number(e.currentTarget.dataset.idx);
      adminState.productColors.splice(idx, 1);
      const colContainer = document.getElementById("colors-list-container");
      if (colContainer) colContainer.innerHTML = renderColorsListHTML();
      bindColorButtons();
    });
  });
}

/* ==========================================================================
   9. CATEGORY MODAL
   ========================================================================== */
function openCategoryModal(categoryId = null) {
  const categories = db.getCategories();
  const category = categoryId ? categories.find(c => c.id === categoryId) : null;

  const modalContainer = document.getElementById("admin-modal-container");
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div id="category-editor-modal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-slate-900 rounded-3xl w-full max-w-md border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <div class="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <h3 class="font-serif font-bold text-white text-base">
            ${category ? 'Edit Category' : 'Add New Category'}
          </h3>
          <button id="close-category-modal-btn" class="text-slate-400 hover:text-white text-sm">✕</button>
        </div>

        <form id="category-editor-form" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Category Name *</label>
            <input
              type="text"
              id="cat-name-input"
              required
              placeholder="e.g. Born Baby, Party Wear, Casual Wear"
              value="${category ? category.name : ''}"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Category Identifier / Slug</label>
            <input
              type="text"
              id="cat-slug-input"
              placeholder="e.g. born-baby"
              value="${category ? (category.slug || category.id) : ''}"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Short Description</label>
            <input
              type="text"
              id="cat-desc-input"
              placeholder="e.g. Hypoallergenic Cotton Essentials for 0-12 Months"
              value="${category && category.description ? category.description : ''}"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Display Icon</label>
            <select
              id="cat-icon-select"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-rose-500"
            >
              <option value="heart" ${category && category.icon === 'heart' ? 'selected' : ''}>💖 Heart (Girls)</option>
              <option value="crown" ${category && category.icon === 'crown' ? 'selected' : ''}>👑 Crown (Boys)</option>
              <option value="smile" ${category && category.icon === 'smile' ? 'selected' : ''}>🧸 Baby Smile</option>
              <option value="star" ${category && category.icon === 'star' ? 'selected' : ''}>⭐ Star (Party)</option>
              <option value="sun" ${category && category.icon === 'sun' ? 'selected' : ''}>☀️ Sun (Casual)</option>
              <option value="flame" ${category && category.icon === 'flame' ? 'selected' : ''}>🔥 Flame (New)</option>
              <option value="sparkles" ${category && category.icon === 'sparkles' ? 'selected' : ''}>✨ Sparkles</option>
            </select>
          </div>

          <label class="flex items-center gap-2 cursor-pointer pt-1">
            <input type="checkbox" id="cat-is-active" class="rounded text-rose-600 focus:ring-rose-500" ${category ? (category.isActive !== false ? 'checked' : '') : 'checked'} />
            <span class="text-xs font-bold text-white">Active in Store Navigation</span>
          </label>

          <div class="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button type="button" id="cancel-cat-btn" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition">
              Save Category
            </button>
          </div>
        </form>

      </div>
    </div>
  `;

  const closeModal = () => {
    modalContainer.innerHTML = "";
  };

  document.getElementById("close-category-modal-btn")?.addEventListener("click", closeModal);
  document.getElementById("cancel-cat-btn")?.addEventListener("click", closeModal);

  document.getElementById("category-editor-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("cat-name-input").value.trim();
    const slug = document.getElementById("cat-slug-input").value.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const desc = document.getElementById("cat-desc-input").value.trim();
    const icon = document.getElementById("cat-icon-select").value;
    const isActive = document.getElementById("cat-is-active").checked;

    await db.saveCategoryAsync({
      id: categoryId || slug,
      name,
      slug,
      description: desc,
      icon,
      isActive
    });

    showToast(`Category "${name}" saved successfully!`, "success");
    closeModal();
    renderActiveTab();
  });
}

/* ==========================================================================
   10. ORDER DETAILS & DISPATCH MODAL
   ========================================================================== */
function openOrderModal(orderId) {
  const order = db.getOrderById(orderId);
  if (!order) return;

  const modalContainer = document.getElementById("admin-modal-container");
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div id="order-details-modal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div class="bg-slate-900 rounded-3xl w-full max-w-2xl border border-slate-800 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        <div class="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-serif font-bold text-white text-lg">Order ${order.id}</h3>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getOrderStatusBadgeClass(order.orderStatus)}">
                ${order.orderStatus}
              </span>
            </div>
            <p class="text-[11px] text-slate-400">Placed on ${formatDate(order.createdAt)}</p>
          </div>
          <button id="close-order-modal-btn" class="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm transition">
            ✕
          </button>
        </div>

        <div class="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          
          <!-- Customer & Address Information -->
          <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 class="font-bold text-white text-xs uppercase tracking-wider text-rose-300">Customer & Delivery Address</h4>
            <div class="grid grid-cols-2 gap-2 text-slate-300">
              <div><b>Name:</b> ${order.customer.name}</div>
              <div><b>Phone:</b> <a href="tel:${order.customer.phone}" class="text-rose-400 hover:underline">${order.customer.phone}</a></div>
              <div><b>Email:</b> ${order.customer.email || 'None provided'}</div>
              <div><b>City / PIN:</b> ${order.customer.city || 'Kota'}, ${order.customer.pincode}</div>
              <div class="col-span-2"><b>Complete Address:</b> ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}</div>
            </div>
          </div>

          <!-- Items Ordered -->
          <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 class="font-bold text-white text-xs uppercase tracking-wider text-rose-300">Ordered Items</h4>
            <div class="divide-y divide-slate-800">
              ${order.items.map(item => `
                <div class="py-2.5 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <img src="${item.image || 'https://placehold.co/100'}" class="w-10 h-10 rounded-lg object-cover border border-slate-700" />
                    <div>
                      <div class="font-bold text-white">${item.name}</div>
                      <div class="text-[10px] text-slate-400">Size: <span class="text-rose-300 font-bold">${item.size || 'Free'}</span> • Colour: <span class="text-rose-300 font-bold">${item.color || 'Standard'}</span></div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-bold text-white">${formatCurrency(item.price)} × ${item.quantity}</div>
                    <div class="text-[10px] text-slate-400 font-bold">${formatCurrency(item.price * item.quantity)}</div>
                  </div>
                </div>
              `).join("")}
            </div>

            <div class="pt-3 border-t border-slate-800 flex justify-between font-bold text-white text-sm">
              <span>Order Grand Total:</span>
              <span class="text-rose-400">${formatCurrency(order.total)}</span>
            </div>
          </div>

          <!-- Dispatch & Tracking Controls -->
          <form id="order-dispatch-form" class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 class="font-bold text-white text-xs uppercase tracking-wider text-rose-300">Update Shipment & Status</h4>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-bold text-slate-300 mb-1">Order Status</label>
                <select id="modal-order-status" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs">
                  ${["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"].map(st => `
                    <option value="${st}" ${order.orderStatus === st ? 'selected' : ''}>${st}</option>
                  `).join("")}
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-slate-300 mb-1">Courier Partner</label>
                <input
                  type="text"
                  id="modal-courier-name"
                  placeholder="e.g. Delhivery, BlueDart, DTDC"
                  value="${order.courier || 'Delhivery Express Kota'}"
                  class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label class="block text-[11px] font-bold text-slate-300 mb-1">AWB Tracking Number</label>
                <input
                  type="text"
                  id="modal-tracking-number"
                  placeholder="e.g. DL-90823412"
                  value="${order.trackingNumber || ''}"
                  class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label class="block text-[11px] font-bold text-slate-300 mb-1">Tracking Link</label>
                <input
                  type="url"
                  id="modal-tracking-link"
                  placeholder="https://delhivery.com/track/..."
                  value="${order.trackingLink || ''}"
                  class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>
            </div>

            <div class="pt-3 flex justify-end">
              <button type="submit" class="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition">
                Update Shipment 📦
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  `;

  const closeModal = () => {
    modalContainer.innerHTML = "";
  };

  document.getElementById("close-order-modal-btn")?.addEventListener("click", closeModal);

  document.getElementById("order-dispatch-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newStatus = document.getElementById("modal-order-status").value;
    const courier = document.getElementById("modal-courier-name").value.trim();
    const trackingNumber = document.getElementById("modal-tracking-number").value.trim();
    const trackingLink = document.getElementById("modal-tracking-link").value.trim();

    await db.updateOrderStatusAsync(order.id, newStatus, {
      courier,
      trackingNumber,
      trackingLink
    });

    showToast(`Order ${order.id} updated to ${newStatus}!`, "success");
    closeModal();
    renderActiveTab();
  });
}
