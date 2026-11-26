/**
 * She & She Kids Wear - Main Application Controller
 * Handles SPA routing, catalog filtering, search, modals, cart actions,
 * checkout flow, Razorpay gateway, and admin control.
 */

import { db } from "./db.js?v=2.9";
import { CATEGORIES, SIZE_LIST, STORE_INFO } from "./data/seedProducts.js?v=2.9";
import { formatCurrency, calculateDiscountPercent } from "./utils/formatters.js?v=2.9";
import { showToast } from "./utils/toast.js?v=2.9";
import { initiateRazorpayPayment } from "./utils/razorpay.js?v=2.9";
import { setCanonicalUrl, applyRouteMetadata, applyProductMetadata } from "./utils/seo.js?v=2.9";

// Components
import { renderHeader } from "./components/header.js?v=2.9";
import { renderHero } from "./components/hero.js?v=2.9";
import { renderProductCard } from "./components/productCard.js?v=2.9";
import { renderProductModal } from "./components/productModal.js?v=2.9";
import { renderCartDrawer, setAppliedCoupon, getAppliedCoupon } from "./components/cartDrawer.js?v=2.9";
import { renderCheckoutModal, renderOrderSuccessView } from "./components/checkoutModal.js?v=2.9";
import { renderOrderTrackingModal, buildTrackingTimelineHTML } from "./components/orderTracking.js?v=2.9";
import { renderContactSection, initContactMap } from "./components/contactSection.js?v=2.9";
import { renderAdminLoginModal, renderAdminDashboard } from "./components/adminPanel.js?v=2.9";
import { renderFooter } from "./components/footer.js?v=2.9";

// Application State
const state = {
  currentCategory: "all",
  searchQuery: "",
  selectedSizes: [],
  selectedColors: [],
  maxPrice: 5000,
  sortBy: "featured",
  activeProductModalId: null,
  isCartOpen: false,
  isCheckoutOpen: false,
  isTrackingOpen: false,
  isAdminLoginOpen: false,
  isAdminDashboardOpen: false,
  isWishlistModalOpen: false
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  renderMainShell();
  setupEventListeners();
  initContactMap();
  handleHashChange();
  window.addEventListener("hashchange", handleHashChange);

  // Subscribe to DB changes to re-render badges, totals, or product catalog
  db.subscribe(({ scope }) => {
    updateBadges();
    if (scope === "products" || scope === "all") {
      renderProductGrid();
    }
    if (scope === "categories" || scope === "all") {
      renderCategoryTabsUI();
      renderProductGrid();
    }
    if (scope === "settings" || scope === "all") {
      const headerMount = document.getElementById("header-mount");
      if (headerMount) headerMount.innerHTML = renderHeader();
      const heroMount = document.getElementById("hero-mount");
      if (heroMount) heroMount.innerHTML = renderHero();
      const contactMount = document.getElementById("contact-mount");
      if (contactMount) {
        contactMount.innerHTML = renderContactSection();
        initContactMap();
      }
      const footerMount = document.getElementById("footer-mount");
      if (footerMount) footerMount.innerHTML = renderFooter();
    }
  });
}

function renderMainShell() {
  const appContainer = document.getElementById("app");
  if (!appContainer) return;

  appContainer.innerHTML = `
    <!-- Top Header Navigation -->
    <div id="header-mount">
      ${renderHeader()}
    </div>

    <!-- Main Content Area -->
    <main id="main-content">
      <!-- Hero Section -->
      <div id="hero-mount">
        ${renderHero()}
      </div>

      <!-- Categories Pill Bar -->
      <section class="py-8 bg-white border-b border-rose-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">
                Explore Kidswear Collections
              </h2>
              <p class="text-xs text-slate-500">Filtered for ages 1 to 16 Years</p>
            </div>
            <button id="reset-filters-btn" class="text-xs font-bold text-rose-600 hover:text-rose-800 transition">
              Reset Filters
            </button>
          </div>

          <!-- Category Chips -->
          <div class="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none" id="category-tabs-container">
            ${db.getCategories().filter(c => c.isActive !== false).map(
              (cat) => `
              <button
                type="button"
                class="category-tab px-4 py-2 rounded-full border border-rose-200 text-xs font-bold text-slate-700 bg-white hover:border-rose-400 hover:bg-rose-50 transition shrink-0 flex items-center gap-1.5 ${
                  state.currentCategory === cat.id ? "active" : ""
                }"
                data-category-id="${cat.id}"
              >
                <span>${cat.name}</span>
              </button>
            `
            ).join("")}
          </div>
        </div>
      </section>

      <!-- Main Product Catalog Section with Filters -->
      <section id="catalog-section" class="py-12 bg-pastel-gradient min-h-[600px]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <!-- Filter Sidebar -->
            <aside class="lg:col-span-3 space-y-6">
              <div class="bg-white p-5 rounded-3xl border border-rose-100 shadow-sm space-y-5">
                <div class="flex items-center justify-between pb-3 border-b border-rose-50">
                  <h3 class="font-serif font-bold text-slate-900 text-sm">Filters & Refine</h3>
                  <span id="active-filter-count" class="text-[11px] font-bold text-rose-600">All Items</span>
                </div>

                <!-- Price Filter Slider -->
                <div>
                  <div class="flex justify-between text-xs font-bold text-slate-700 mb-2">
                    <span>Max Price:</span>
                    <span id="price-slider-display" class="text-rose-600 font-extrabold">${formatCurrency(state.maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    id="price-range-slider"
                    min="500"
                    max="5000"
                    step="100"
                    value="${state.maxPrice}"
                    class="w-full accent-rose-600 cursor-pointer"
                  />
                  <div class="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>₹500</span>
                    <span>₹5,000</span>
                  </div>
                </div>

                <!-- Size Filters (1-2Y to 15-16Y) -->
                <div>
                  <h4 class="text-xs font-bold text-slate-800 mb-2.5">Available Age Sizes:</h4>
                  <div class="grid grid-cols-3 gap-1.5" id="sidebar-size-filters">
                    ${SIZE_LIST.map(
                      (size) => `
                      <label class="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-200 hover:border-rose-300 text-[11px] font-semibold text-slate-700 cursor-pointer transition">
                        <input type="checkbox" value="${size}" class="filter-size-check rounded text-rose-600 focus:ring-rose-500" />
                        <span>${size}</span>
                      </label>
                    `
                    ).join("")}
                  </div>
                </div>

                <!-- Sort By Dropdown -->
                <div>
                  <h4 class="text-xs font-bold text-slate-800 mb-2">Sort Outfits:</h4>
                  <select id="catalog-sort-select" class="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs bg-white text-slate-700 font-medium">
                    <option value="featured">Featured & Best Picks</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Parent Rating</option>
                  </select>
                </div>

                <!-- Special Filter Badges -->
                <div class="pt-3 border-t border-rose-50 space-y-2">
                  <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input type="checkbox" id="filter-bestseller-only" class="rounded text-rose-600 focus:ring-rose-500" />
                    <span>⭐ Best Sellers Only</span>
                  </label>
                  <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input type="checkbox" id="filter-new-only" class="rounded text-rose-600 focus:ring-rose-500" />
                    <span>✨ New Arrivals Only</span>
                  </label>
                </div>

              </div>
            </aside>

            <!-- Product Grid -->
            <div class="lg:col-span-9 space-y-6">
              
              <!-- Results Header -->
              <div class="flex items-center justify-between text-xs text-slate-500 bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-rose-100">
                <div>
                  Showing <strong id="product-count-display" class="text-slate-900 font-bold">0</strong> kids outfits in
                  <span id="current-category-label" class="text-rose-600 font-bold capitalize">All Collections</span>
                </div>
                <div id="active-search-indicator" class="hidden font-semibold text-rose-700">
                  Search results for: "<span id="active-search-query"></span>"
                </div>
              </div>

              <!-- Product Cards Grid -->
              <div id="product-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Dynamically populated -->
              </div>

              <!-- Empty State -->
              <div id="product-empty-state" class="hidden p-12 text-center bg-white rounded-3xl border border-rose-100 space-y-3">
                <div class="text-4xl">🔍</div>
                <h4 class="font-serif font-bold text-slate-800 text-lg">No matching outfits found</h4>
                <p class="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your price range, selected age sizes, or category filter to discover more styles.
                </p>
                <button id="empty-reset-filters-btn" class="px-5 py-2 rounded-full bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-200">
                  Reset All Filters
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      <!-- Contact Us & Dadabari Kota Store Section -->
      <div id="contact-mount">
        ${renderContactSection()}
      </div>

      <!-- Reviews, Instagram & Footer -->
      <div id="footer-mount">
        ${renderFooter()}
      </div>
    </main>

    <!-- Modal Containers Mounts -->
    <div id="modal-container"></div>
    <div id="cart-drawer-mount"></div>
    <div id="admin-panel-mount"></div>
    <div id="tracking-modal-mount"></div>
  `;

  renderProductGrid();
}

/**
 * Filters and renders products according to active state
 */
function renderProductGrid() {
  const grid = document.getElementById("product-grid");
  const emptyState = document.getElementById("product-empty-state");
  const countDisplay = document.getElementById("product-count-display");
  const categoryLabel = document.getElementById("current-category-label");
  if (!grid) return;

  const allProducts = db.getProducts();

  let filtered = allProducts.filter((p) => {
    // 0. Active visibility filter (hide disabled/archived products from customers)
    if (p.isActive === false) return false;

    // 1. Dynamic Category Filter
    if (state.currentCategory && state.currentCategory !== "all") {
      if (state.currentCategory === "new") {
        if (!p.isNew) return false;
      } else if (state.currentCategory === "bestsellers") {
        if (!p.isBestSeller) return false;
      } else if (state.currentCategory === "party") {
        if (p.category !== "party" && p.subCategory !== "party") return false;
      } else if (state.currentCategory === "casual") {
        if (p.category !== "casual" && p.subCategory !== "casual") return false;
      } else if (state.currentCategory === "sale") {
        if (!p.discountPrice || p.discountPrice >= p.price) return false;
      } else {
        if (p.category !== state.currentCategory && p.subCategory !== state.currentCategory) return false;
      }
    }

    // 2. Search Query Filter
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = (p.description || "").toLowerCase().includes(q);
      const matchFabric = (p.fabric || "").toLowerCase().includes(q);
      const matchCat = (p.category || "").toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchFabric && !matchCat) return false;
    }

    // 3. Price Filter
    const activePrice = p.discountPrice || p.price;
    if (activePrice > state.maxPrice) return false;

    // 4. Size Filter
    if (state.selectedSizes.length > 0) {
      const hasSize = state.selectedSizes.some((s) => (p.sizes || []).includes(s));
      if (!hasSize) return false;
    }

    // 5. Special Checkboxes
    const bestSellerOnly = document.getElementById("filter-bestseller-only")?.checked;
    if (bestSellerOnly && !p.isBestSeller) return false;

    const newOnly = document.getElementById("filter-new-only")?.checked;
    if (newOnly && !p.isNew) return false;

    return true;
  });

  // Sorting
  if (state.sortBy === "price-asc") {
    filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  } else if (state.sortBy === "price-desc") {
    filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  } else if (state.sortBy === "rating") {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  // Update counter
  if (countDisplay) countDisplay.textContent = filtered.length;
  if (categoryLabel) {
    const matchedCategory = CATEGORIES.find((c) => c.id === state.currentCategory);
    categoryLabel.textContent = matchedCategory ? matchedCategory.name : "Kids Wear";
  }

  if (filtered.length === 0) {
    grid.innerHTML = "";
    if (emptyState) emptyState.classList.remove("hidden");
  } else {
    if (emptyState) emptyState.classList.add("hidden");
    grid.innerHTML = filtered.map((p) => renderProductCard(p)).join("");
  }
}

/**
 * Event delegation and interaction wiring
 */
function setupEventListeners() {
  const app = document.getElementById("app");
  if (!app) return;

  // 1. Category Tab clicks
  app.addEventListener("click", (e) => {
    const tabBtn = e.target.closest(".category-tab");
    if (tabBtn) {
      const catId = tabBtn.dataset.categoryId;
      setCategory(catId);
    }
  });

  // 2. Card Size Selection
  app.addEventListener("click", (e) => {
    const sizeBtn = e.target.closest(".card-size-btn");
    if (sizeBtn) {
      const container = sizeBtn.parentElement;
      const card = sizeBtn.closest(".product-card");
      container.querySelectorAll(".card-size-btn").forEach((b) => {
        b.classList.remove("bg-rose-600", "text-white", "border-rose-600", "shadow-sm");
        b.classList.add("bg-white", "text-slate-700");
      });
      sizeBtn.classList.remove("bg-white", "text-slate-700");
      sizeBtn.classList.add("bg-rose-600", "text-white", "border-rose-600", "shadow-sm");

      const label = card.querySelector(".selected-size-label");
      if (label) label.textContent = sizeBtn.dataset.size;
    }
  });

  // 3. Card Color Swatch Click
  app.addEventListener("click", (e) => {
    const swatch = e.target.closest(".card-color-swatch");
    if (swatch) {
      const card = swatch.closest(".product-card");
      const prodId = card.dataset.productId;
      const prod = db.getProductById(prodId);
      if (!prod) return;

      const imgIdx = parseInt(swatch.dataset.imageIndex || "0", 10);
      const imgEl = card.querySelector(".product-card-img");
      if (imgEl && prod.images[imgIdx]) {
        imgEl.src = prod.images[imgIdx];
      }

      card.querySelectorAll(".card-color-swatch").forEach((s) => s.classList.remove("ring-2", "ring-rose-500", "ring-offset-1"));
      swatch.classList.add("ring-2", "ring-rose-500", "ring-offset-1");
    }
  });

  // 4. Card Direct Add to Cart
  app.addEventListener("click", (e) => {
    const addBtn = e.target.closest(".card-add-to-cart-btn");
    if (addBtn) {
      const prodId = addBtn.dataset.productId;
      const card = addBtn.closest(".product-card");
      const prod = db.getProductById(prodId);
      if (!prod) return;

      const activeSizeBtn = card.querySelector(".card-size-btn.bg-rose-600");
      const selectedSize = activeSizeBtn ? activeSizeBtn.dataset.size : prod.sizes[0];
      const selectedColor = prod.colors[0]?.name || "Standard";

      db.addToCart(prod, selectedSize, selectedColor, 1);
      showToast(`Added ${prod.name} (${selectedSize}) to your bag!`, "success");
      openCartDrawer();
    }
  });

  // 5. Wishlist Toggle
  app.addEventListener("click", (e) => {
    const wishBtn = e.target.closest(".wishlist-toggle-btn");
    if (wishBtn) {
      const prodId = wishBtn.dataset.productId;
      const added = db.toggleWishlist(prodId);
      const svg = wishBtn.querySelector("svg");
      if (added) {
        svg.classList.add("text-rose-600", "fill-rose-600", "animate-heart-pop");
        showToast("Added to your Wishlist ♥", "success");
      } else {
        svg.classList.remove("text-rose-600", "fill-rose-600", "animate-heart-pop");
        showToast("Removed from Wishlist", "info");
      }
      updateBadges();
    }
  });

  // 6. Quick View / Product Detail Modal
  app.addEventListener("click", (e) => {
    const qvBtn = e.target.closest(".quick-view-btn") || e.target.closest(".related-product-card");
    if (qvBtn) {
      const prodId = qvBtn.dataset.productId;
      openProductModal(prodId);
    }
  });

  // 7. Global Search Input
  const searchInput = document.getElementById("global-search-input");
  const searchClear = document.getElementById("search-clear-btn");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      state.searchQuery = val;
      if (searchClear) searchClear.classList.toggle("hidden", val.length === 0);
      renderProductGrid();
    });

    if (searchClear) {
      searchClear.addEventListener("click", () => {
        searchInput.value = "";
        state.searchQuery = "";
        searchClear.classList.add("hidden");
        renderProductGrid();
      });
    }
  }

  // Mobile search input
  const mobileSearchInput = document.getElementById("mobile-search-input");
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value.trim();
      renderProductGrid();
    });
  }

  // 8. Price Slider
  const priceSlider = document.getElementById("price-range-slider");
  const priceDisplay = document.getElementById("price-slider-display");
  if (priceSlider) {
    priceSlider.addEventListener("input", (e) => {
      state.maxPrice = parseInt(e.target.value, 10);
      if (priceDisplay) priceDisplay.textContent = formatCurrency(state.maxPrice);
      renderProductGrid();
    });
  }

  // 9. Size Filter Checkboxes
  app.addEventListener("change", (e) => {
    if (e.target.classList.contains("filter-size-check")) {
      const checkedBoxes = Array.from(document.querySelectorAll(".filter-size-check:checked"));
      state.selectedSizes = checkedBoxes.map((cb) => cb.value);
      renderProductGrid();
    }
  });

  // 10. Sort By Change
  const sortSelect = document.getElementById("catalog-sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      state.sortBy = e.target.value;
      renderProductGrid();
    });
  }

  // 11. Reset Filters
  app.addEventListener("click", (e) => {
    if (e.target.id === "reset-filters-btn" || e.target.id === "empty-reset-filters-btn") {
      state.currentCategory = "all";
      state.searchQuery = "";
      state.selectedSizes = [];
      state.maxPrice = 5000;
      state.sortBy = "featured";

      if (searchInput) searchInput.value = "";
      if (priceSlider) priceSlider.value = 5000;
      if (priceDisplay) priceDisplay.textContent = formatCurrency(5000);
      document.querySelectorAll(".filter-size-check").forEach((cb) => (cb.checked = false));

      updateCategoryTabsUI();
      renderProductGrid();
      showToast("Filters reset to default view.", "info");
    }
  });

  // 12. Cart Header Button
  const headerCartBtn = document.getElementById("header-cart-btn");
  if (headerCartBtn) {
    headerCartBtn.addEventListener("click", () => openCartDrawer());
  }

  // 13. Mobile Menu Toggle
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenuClose = document.getElementById("mobile-menu-close");
  const mobileMenuDrawer = document.getElementById("mobile-menu-drawer");
  if (mobileMenuToggle && mobileMenuDrawer) {
    mobileMenuToggle.addEventListener("click", () => mobileMenuDrawer.classList.remove("hidden"));
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener("click", () => mobileMenuDrawer.classList.add("hidden"));
    }
    app.querySelectorAll(".mobile-nav-link").forEach((link) => {
      link.addEventListener("click", () => mobileMenuDrawer.classList.add("hidden"));
    });
  }

  // Mobile Search Bar Toggle
  const mobileSearchToggle = document.getElementById("mobile-search-toggle");
  const mobileSearchBar = document.getElementById("mobile-search-bar");
  if (mobileSearchToggle && mobileSearchBar) {
    mobileSearchToggle.addEventListener("click", () => {
      mobileSearchBar.classList.toggle("hidden");
    });
  }

  // 14. Track Order Navigation
  const trackOrderTopBtn = document.getElementById("nav-track-order-top-btn");
  if (trackOrderTopBtn) {
    trackOrderTopBtn.addEventListener("click", () => openTrackingModal());
  }

  // 15. Admin Navigation Buttons
  const navAdminTopBtn = document.getElementById("nav-admin-top-btn");
  const mobileAdminBtn = document.getElementById("mobile-admin-btn");
  const footerAdminBtn = document.getElementById("footer-admin-btn");
  const handleAdminTrigger = () => {
    if (db.isAdminAuthenticated()) {
      openAdminDashboard();
    } else {
      openAdminLoginModal();
    }
  };
  if (navAdminTopBtn) navAdminTopBtn.addEventListener("click", handleAdminTrigger);
  if (mobileAdminBtn) mobileAdminBtn.addEventListener("click", handleAdminTrigger);
  if (footerAdminBtn) footerAdminBtn.addEventListener("click", handleAdminTrigger);

  // 16. Newsletter Form Submit
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("newsletter-email");
      const email = emailInput?.value?.trim();
      if (!email) {
        showToast("Please enter a valid email address.", "warning");
        return;
      }
      const res = await db.saveNewsletterSubscriber(email);
      showToast(res.message || "Thank you for subscribing to She & She Kids Wear!", "success", 4000);
      newsletterForm.reset();
    });
  }

  // 17. Contact Inquiry Form Submit
  const inquiryForm = document.getElementById("contact-inquiry-form");
  if (inquiryForm) {
    inquiryForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("contact-name-input")?.value?.trim() || "";
      const phone = document.getElementById("contact-phone-input")?.value?.trim() || "";
      const email = document.getElementById("contact-email-input")?.value?.trim() || "";
      const message = document.getElementById("contact-message-input")?.value?.trim() || "";

      if (!name || !phone || !message) {
        showToast("Please fill in your name, contact phone, and message.", "warning");
        return;
      }

      await db.saveInquiry({ name, phone, email, message });
      showToast(`Thank you, ${name}! Store Manager will contact you at ${phone} shortly.`, "success", 5000);
      inquiryForm.reset();
    });
  }

  // 18. Policy Modal Triggers
  app.addEventListener("click", (e) => {
    const policyBtn = e.target.closest(".policy-open-btn");
    if (policyBtn) {
      const policyType = policyBtn.dataset.policy;
      openPolicyModal(policyType);
    }
  });

  // 19. Wishlist Header Button
  const headerWishlistBtn = document.getElementById("header-wishlist-btn");
  if (headerWishlistBtn) {
    headerWishlistBtn.addEventListener("click", () => {
      const wishlist = db.getWishlist();
      if (wishlist.length === 0) {
        showToast("Your Wishlist is empty. Click the heart icon on any product to save it!", "info");
      } else {
        state.currentCategory = "all";
        renderProductGrid();
        window.location.hash = "#catalog-section";
        showToast(`Showing your saved outfits (${wishlist.length})`, "info");
      }
    });
  }
}

/**
 * Resolves active route from hash or pathname for clean SEO URL support
 */
function getActiveRoute() {
  const rawHash = (window.location.hash || "").split("?")[0];
  if (rawHash && rawHash !== "#" && rawHash !== "#home") {
    return rawHash;
  }
  const pathname = window.location.pathname || "";
  if (pathname && pathname !== "/" && pathname !== "/index.html") {
    return "#" + pathname.replace(/^\//, "");
  }
  return rawHash || "#home";
}

/**
 * Handle URL routing (#category/boys, #product/rose-blush-princess-tulle-party-frock, #track-order, etc.)
 */
function handleHashChange() {
  const hash = getActiveRoute();

  if (hash.startsWith("#category/")) {
    const cat = hash.replace("#category/", "");
    setCategory(cat, false);
    applyRouteMetadata(`category/${cat}`);
    scrollToSection("catalog-section");
  } else if (hash === "#new-arrivals") {
    setCategory("new", false);
    applyRouteMetadata("category/new");
    scrollToSection("catalog-section");
  } else if (hash === "#best-sellers") {
    setCategory("bestsellers", false);
    applyRouteMetadata("category/bestsellers");
    scrollToSection("catalog-section");
  } else if (hash.startsWith("#product/")) {
    const prodIdOrSlug = hash.replace("#product/", "");
    openProductModal(prodIdOrSlug);
  } else if (hash === "#track-order") {
    applyRouteMetadata("track-order");
    openTrackingModal();
  } else if (hash === "#size-guide") {
    applyRouteMetadata("size-guide");
    const p = db.getProducts()[0];
    if (p) openProductModal(p.id);
  } else if (hash === "#contact") {
    applyRouteMetadata("contact");
    scrollToSection("contact");
  } else if (hash === "#about") {
    applyRouteMetadata("about");
    scrollToSection("contact");
  } else if (hash === "#admin" || hash === "#admin-login") {
    setCanonicalUrl("admin.html");
    if (db.isAdminAuthenticated()) {
      openAdminDashboard();
    } else {
      openAdminLoginModal();
    }
  } else {
    // Default Home
    applyRouteMetadata("home");
  }
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

function setCategory(catId, updateUrl = true) {
  state.currentCategory = catId;
  updateCategoryTabsUI();
  renderProductGrid();

  if (catId === "all") {
    applyRouteMetadata("home");
    if (updateUrl && window.location.hash.startsWith("#category/")) {
      window.history.replaceState(null, "", "#home");
    }
  } else {
    applyRouteMetadata(`category/${catId}`);
    if (updateUrl) {
      window.history.replaceState(null, "", `#category/${catId}`);
    }
  }
}

function renderCategoryTabsUI() {
  const container = document.getElementById("category-tabs-container");
  if (!container) return;
  const categories = db.getCategories().filter(c => c.isActive !== false);
  container.innerHTML = categories.map((cat) => `
    <button
      type="button"
      class="category-tab px-4 py-2 rounded-full border border-rose-200 text-xs font-bold text-slate-700 bg-white hover:border-rose-400 hover:bg-rose-50 transition shrink-0 flex items-center gap-1.5 ${
        state.currentCategory === cat.id ? "active" : ""
      }"
      data-category-id="${cat.id}"
    >
      <span>${cat.name}</span>
    </button>
  `).join("");
}

function updateCategoryTabsUI() {
  document.querySelectorAll(".category-tab").forEach((tab) => {
    if (tab.dataset.categoryId === state.currentCategory) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });
}

function updateBadges() {
  const cartSummary = db.getCartSummary(getAppliedCoupon());
  const wishlist = db.getWishlist();

  const cartBadge = document.getElementById("cart-badge");
  const cartHeaderTotal = document.getElementById("cart-header-total");
  const wishlistBadge = document.getElementById("wishlist-badge");

  if (cartBadge) {
    cartBadge.textContent = cartSummary.itemsCount;
    cartBadge.classList.toggle("hidden", cartSummary.itemsCount === 0);
  }
  if (cartHeaderTotal) {
    cartHeaderTotal.textContent = formatCurrency(cartSummary.total);
  }
  if (wishlistBadge) {
    wishlistBadge.textContent = wishlist.length;
    wishlistBadge.classList.toggle("hidden", wishlist.length === 0);
  }
}

/* ------------------- MODAL CONTROLLERS ------------------- */

async function openProductModal(productIdOrSlug) {
  let product = db.getProductById(productIdOrSlug) || db.getProductBySlug(productIdOrSlug);
  if (!product) {
    product = await db.getProductBySlugAsync(productIdOrSlug);
  }
  if (!product) return;

  const productSlug = product.slug || product.id;
  applyProductMetadata(product);
  if (window.location.hash !== `#product/${productSlug}`) {
    window.history.replaceState(null, "", `#product/${productSlug}`);
  }

  const mount = document.getElementById("modal-container");
  if (!mount) return;

  mount.innerHTML = renderProductModal(product);

  let selectedSize = product.sizes[0];
  let selectedColor = product.colors[0]?.name || "Standard";
  let quantity = 1;

  // Thumbnail Switcher
  mount.querySelectorAll(".modal-thumb-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      mount.querySelectorAll(".modal-thumb-btn").forEach((b) => b.classList.remove("border-rose-600", "ring-2", "ring-rose-100"));
      btn.classList.add("border-rose-600", "ring-2", "ring-rose-100");
      const mainImg = mount.querySelector("#modal-main-image");
      if (mainImg) mainImg.src = btn.dataset.imageSrc;
    });
  });

  // Color Swatch Switcher
  mount.querySelectorAll(".modal-color-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      mount.querySelectorAll(".modal-color-btn").forEach((b) => b.classList.remove("border-rose-600", "ring-4", "ring-rose-100", "scale-110"));
      btn.classList.add("border-rose-600", "ring-4", "ring-rose-100", "scale-110");

      selectedColor = btn.dataset.colorName;
      const colorLabel = mount.querySelector("#modal-selected-color");
      if (colorLabel) colorLabel.textContent = selectedColor;

      const imgIdx = parseInt(btn.dataset.imageIndex || "0", 10);
      const mainImg = mount.querySelector("#modal-main-image");
      if (mainImg && product.images[imgIdx]) {
        mainImg.src = product.images[imgIdx];
      }
    });
  });

  // Size Selector (1-2Y to 15-16Y)
  mount.querySelectorAll(".modal-size-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      mount.querySelectorAll(".modal-size-btn").forEach((b) => {
        b.classList.remove("bg-rose-600", "text-white", "border-rose-600", "shadow-md", "shadow-rose-200");
        b.classList.add("bg-white", "text-slate-800", "border-slate-200");
      });
      btn.classList.remove("bg-white", "text-slate-800", "border-slate-200");
      btn.classList.add("bg-rose-600", "text-white", "border-rose-600", "shadow-md", "shadow-rose-200");
      selectedSize = btn.dataset.size;
    });
  });

  // Quantity Controls
  const qtyDisplay = mount.querySelector("#modal-qty-display");
  mount.querySelector("#modal-qty-minus")?.addEventListener("click", () => {
    if (quantity > 1) {
      quantity -= 1;
      if (qtyDisplay) qtyDisplay.textContent = quantity;
    }
  });
  mount.querySelector("#modal-qty-plus")?.addEventListener("click", () => {
    quantity += 1;
    if (qtyDisplay) qtyDisplay.textContent = quantity;
  });

  // Add to Bag Button
  mount.querySelector("#modal-add-to-cart-btn")?.addEventListener("click", () => {
    db.addToCart(product, selectedSize, selectedColor, quantity);
    showToast(`Added ${quantity}x ${product.name} (${selectedSize}) to Bag!`, "success");
    closeModal();
    openCartDrawer();
  });

  // Buy Now Button
  mount.querySelector("#modal-buy-now-btn")?.addEventListener("click", () => {
    db.addToCart(product, selectedSize, selectedColor, quantity);
    closeModal();
    openCheckoutModal();
  });

  // Pincode Checker
  mount.querySelector("#pincode-check-btn")?.addEventListener("click", () => {
    const pin = mount.querySelector("#pincode-check-input")?.value.trim();
    const result = mount.querySelector("#pincode-result");
    if (!pin || pin.length !== 6) {
      if (result) {
        result.textContent = "Please enter a valid 6-digit PIN code.";
        result.className = "text-[11px] font-semibold text-rose-600";
      }
      return;
    }
    if (result) {
      if (pin.startsWith("324")) {
        result.textContent = `✓ Kota (${pin}): Express Same-Day Pickup Available at Dadabari Store!`;
        result.className = "text-[11px] font-semibold text-emerald-600";
      } else {
        result.textContent = `✓ Delivery Available to PIN ${pin}: Estimated in 2–4 Business Days via BlueDart.`;
        result.className = "text-[11px] font-semibold text-emerald-600";
      }
    }
  });

  // Size Chart Popup Trigger
  const sizeChartModal = mount.querySelector("#size-chart-modal");
  mount.querySelector("#open-size-chart-btn")?.addEventListener("click", () => {
    if (sizeChartModal) sizeChartModal.classList.remove("hidden");
  });
  mount.querySelector("#close-size-chart-btn")?.addEventListener("click", () => {
    if (sizeChartModal) sizeChartModal.classList.add("hidden");
  });

  // Close Button & Backdrop
  mount.querySelector("#close-product-modal-btn")?.addEventListener("click", closeModal);
  mount.querySelector("#product-detail-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "product-detail-modal") closeModal();
  });

  function closeModal() {
    mount.innerHTML = "";
    if (window.location.hash.startsWith("#product/")) {
      const targetHash = state.currentCategory && state.currentCategory !== "all"
        ? `#category/${state.currentCategory}`
        : "#catalog-section";
      window.history.replaceState(null, "", targetHash);
    }
    if (state.currentCategory && state.currentCategory !== "all") {
      applyRouteMetadata(`category/${state.currentCategory}`);
    } else {
      applyRouteMetadata("home");
    }
  }
}

function openCartDrawer() {
  const mount = document.getElementById("cart-drawer-mount");
  if (!mount) return;

  mount.innerHTML = renderCartDrawer();

  // Close button & backdrop
  mount.querySelector("#close-cart-drawer-btn")?.addEventListener("click", closeCart);
  mount.querySelector("#cart-drawer-backdrop")?.addEventListener("click", (e) => {
    if (e.target.id === "cart-drawer-backdrop") closeCart();
  });
  mount.querySelector("#continue-shopping-btn")?.addEventListener("click", closeCart);
  mount.querySelector("#cart-empty-shop-now-btn")?.addEventListener("click", closeCart);

  // Quantity Minus/Plus & Remove
  mount.querySelectorAll(".cart-qty-btn-minus, .cart-qty-btn-plus").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const size = btn.dataset.size;
      const color = btn.dataset.color;
      const newQty = parseInt(btn.dataset.qty, 10);
      db.updateCartQuantity(id, size, color, newQty);
      openCartDrawer();
    });
  });

  mount.querySelectorAll(".cart-item-remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const size = btn.dataset.size;
      const color = btn.dataset.color;
      db.removeFromCart(id, size, color);
      showToast("Item removed from your bag.", "info");
      openCartDrawer();
    });
  });

  // Apply Coupon Code
  mount.querySelector("#apply-coupon-btn")?.addEventListener("click", () => {
    const code = mount.querySelector("#cart-coupon-input")?.value.trim().toUpperCase();
    if (!code) return;
    if (code === "FIRSTKID" || code === "KIDSWEAR10" || code === "KOTA500") {
      setAppliedCoupon(code);
      showToast(`Coupon ${code} applied successfully!`, "success");
      openCartDrawer();
    } else {
      showToast("Invalid coupon code. Try 'FIRSTKID' for 15% off!", "error");
    }
  });

  // Proceed to Checkout
  mount.querySelector("#proceed-to-checkout-btn")?.addEventListener("click", () => {
    closeCart();
    openCheckoutModal();
  });

  function closeCart() {
    mount.innerHTML = "";
  }
}

function openCheckoutModal() {
  const mount = document.getElementById("modal-container");
  if (!mount) return;

  mount.innerHTML = renderCheckoutModal();

  // Close button
  mount.querySelector("#close-checkout-btn")?.addEventListener("click", () => {
    mount.innerHTML = "";
  });

  // Payment Method Selection Visual Switch
  const paymentCards = mount.querySelectorAll(".payment-method-card");
  paymentCards.forEach((card) => {
    card.addEventListener("click", () => {
      paymentCards.forEach((c) => {
        c.classList.remove("border-rose-500", "bg-rose-50/50");
        c.classList.add("border-slate-200");
      });
      card.classList.remove("border-slate-200");
      card.classList.add("border-rose-500", "bg-rose-50/50");
    });
  });

  // Checkout Form Submission
  const checkoutForm = mount.querySelector("#checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const customer = {
        name: mount.querySelector("#checkout-name")?.value.trim(),
        phone: mount.querySelector("#checkout-phone")?.value.trim(),
        email: mount.querySelector("#checkout-email")?.value.trim(),
        address: mount.querySelector("#checkout-address")?.value.trim(),
        city: mount.querySelector("#checkout-city")?.value.trim(),
        state: mount.querySelector("#checkout-state")?.value,
        pincode: mount.querySelector("#checkout-pincode")?.value.trim()
      };

      const selectedPayment = mount.querySelector('input[name="payment-method"]:checked')?.value || "cod";
      const cart = db.getCart();
      const coupon = getAppliedCoupon();
      const summary = db.getCartSummary(coupon);
      const settings = db.getSettings();

      const submitBtn = mount.querySelector("#place-order-submit-btn");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Processing Order...</span>`;
      }

      if (selectedPayment === "razorpay") {
        try {
          const paymentResult = await initiateRazorpayPayment({
            amount: summary.total,
            orderId: `SSKW_${Date.now()}`,
            customerName: customer.name,
            customerEmail: customer.email,
            customerPhone: customer.phone,
            keyId: settings.razorpayKeyId
          });

          // Payment success - save verified order
          const createdOrder = await db.createOrderAsync({
            customer,
            items: cart,
            subtotal: summary.subtotal,
            discount: summary.discount,
            shipping: summary.shipping,
            total: summary.total,
            paymentMethod: "Razorpay Gateway (Online)",
            paymentId: paymentResult.paymentId,
            paymentStatus: "Paid"
          });

          showToast("Payment verified! Order confirmed.", "success", 4000);
          showOrderSuccess(createdOrder);
        } catch (err) {
          showToast(err.message || "Payment cancelled or failed.", "error");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>Complete Order • ${formatCurrency(summary.total)}</span>`;
          }
        }
      } else {
        // Cash on Delivery or Direct Store UPI
        const methodLabel = selectedPayment === "cod" ? "Cash on Delivery (COD)" : "Store UPI (Dadabari)";
        const createdOrder = await db.createOrderAsync({
          customer,
          items: cart,
          subtotal: summary.subtotal,
          discount: summary.discount,
          shipping: summary.shipping,
          total: summary.total,
          paymentMethod: methodLabel,
          paymentId: `cod_${Date.now()}`,
          paymentStatus: selectedPayment === "cod" ? "Pending on Delivery" : "Paid via Store UPI"
        });

        showToast("Order placed successfully!", "success", 4000);
        showOrderSuccess(createdOrder);
      }
    });
  }

  function showOrderSuccess(order) {
    mount.innerHTML = renderOrderSuccessView(order);
    mount.querySelector("#success-track-btn")?.addEventListener("click", () => {
      mount.innerHTML = "";
      openTrackingModal(order.id);
    });
    mount.querySelector("#success-home-btn")?.addEventListener("click", () => {
      mount.innerHTML = "";
      window.location.hash = "#home";
    });
  }
}

function openTrackingModal(prefilledOrderId = "") {
  applyRouteMetadata("track-order");
  if (window.location.hash !== "#track-order") {
    window.history.replaceState(null, "", "#track-order");
  }

  const mount = document.getElementById("tracking-modal-mount");
  if (!mount) return;

  mount.innerHTML = renderOrderTrackingModal(prefilledOrderId);

  const searchInput = mount.querySelector("#tracking-search-input");
  const searchBtn = mount.querySelector("#tracking-search-btn");
  const resultArea = mount.querySelector("#tracking-result-area");
  const closeBtn = mount.querySelector("#close-tracking-modal-btn");

  const closeTracking = () => {
    mount.innerHTML = "";
    if (window.location.hash === "#track-order") {
      const targetHash = state.currentCategory && state.currentCategory !== "all"
        ? `#category/${state.currentCategory}`
        : "#home";
      window.history.replaceState(null, "", targetHash);
    }
    if (state.currentCategory && state.currentCategory !== "all") {
      applyRouteMetadata(`category/${state.currentCategory}`);
    } else {
      applyRouteMetadata("home");
    }
  };

  closeBtn?.addEventListener("click", closeTracking);
  mount.querySelector("#order-tracking-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "order-tracking-modal") closeTracking();
  });

  const performTrack = async (query) => {
    const q = (query || searchInput?.value || "").trim();
    if (!q) return;

    if (resultArea) {
      resultArea.innerHTML = `
        <div class="p-8 text-center space-y-3">
          <div class="inline-block animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full"></div>
          <p class="text-sm text-slate-500 font-medium">Fetching live order tracking details...</p>
        </div>
      `;
    }

    // Check local storage or query Supabase Cloud
    let found = db.getOrderById(q);
    if (!found) {
      found = await db.getOrderByIdAsync(q);
    }

    if (resultArea) {
      resultArea.innerHTML = buildTrackingTimelineHTML(found);
    }
  };

  searchBtn?.addEventListener("click", () => performTrack());
  searchInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") performTrack();
  });

  if (prefilledOrderId) {
    performTrack(prefilledOrderId);
  }
}

function openAdminLoginModal() {
  const mount = document.getElementById("admin-panel-mount");
  if (!mount) return;

  mount.innerHTML = renderAdminLoginModal();

  mount.querySelector("#close-admin-login-btn")?.addEventListener("click", () => {
    mount.innerHTML = "";
  });

  mount.querySelector("#admin-login-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = mount.querySelector("#admin-email-input")?.value;
    const pass = mount.querySelector("#admin-password-input")?.value;

    const res = db.adminLogin(email, pass);
    if (res.success) {
      showToast("Welcome back, Administrator!", "success");
      mount.innerHTML = "";
      openAdminDashboard();
    } else {
      showToast(res.message, "error");
    }
  });
}

function openAdminDashboard() {
  const mount = document.getElementById("admin-panel-mount");
  if (!mount) return;

  db.getOrdersAsync().catch(() => {});
  mount.innerHTML = renderAdminDashboard();

  // Close & Logout buttons
  mount.querySelector("#admin-close-modal-btn")?.addEventListener("click", () => {
    mount.innerHTML = "";
  });
  mount.querySelector("#admin-view-store-btn")?.addEventListener("click", () => {
    mount.innerHTML = "";
  });
  mount.querySelector("#admin-logout-btn")?.addEventListener("click", () => {
    db.adminLogout();
    showToast("Logged out from admin panel.", "info");
    mount.innerHTML = "";
  });

  // Tab Switching
  mount.querySelectorAll(".admin-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      mount.querySelectorAll(".admin-tab-btn").forEach((b) => {
        b.classList.remove("border-rose-600", "text-rose-700", "active");
        b.classList.add("border-transparent", "text-slate-500");
      });
      btn.classList.remove("border-transparent", "text-slate-500");
      btn.classList.add("border-rose-600", "text-rose-700", "active");

      const tabId = btn.dataset.tab;
      mount.querySelectorAll(".admin-tab-pane").forEach((p) => p.classList.add("hidden"));
      mount.querySelector(`#admin-tab-${tabId}`)?.classList.remove("hidden");
    });
  });

  // Order Status Change Selector
  mount.querySelectorAll(".admin-order-status-select").forEach((select) => {
    select.addEventListener("change", async (e) => {
      const orderId = e.target.dataset.orderId;
      const newStatus = e.target.value;
      await db.updateOrderStatusAsync(orderId, newStatus);
      showToast(`Order ${orderId} updated to ${newStatus}.`, "success");
    });
  });

  // Delete Product
  mount.querySelectorAll(".admin-delete-product-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const prodId = btn.dataset.id;
      if (confirm("Are you sure you want to delete this product from store?")) {
        await db.deleteProductAsync(prodId);
        showToast("Product deleted.", "info");
        openAdminDashboard();
      }
    });
  });

  // Product Add Modal Trigger
  const productFormModal = mount.querySelector("#product-form-modal");
  mount.querySelector("#admin-add-product-btn")?.addEventListener("click", () => {
    if (productFormModal) {
      mount.querySelector("#product-editor-form")?.reset();
      mount.querySelector("#edit-product-id").value = "";
      mount.querySelector("#product-form-title").textContent = "Add New Kidswear Product";
      productFormModal.classList.remove("hidden");
    }
  });

  // Product Edit Trigger
  mount.querySelectorAll(".admin-edit-product-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const prodId = btn.dataset.id;
      const prod = db.getProductById(prodId);
      if (!prod || !productFormModal) return;

      mount.querySelector("#edit-product-id").value = prod.id;
      mount.querySelector("#product-form-title").textContent = `Edit Product: ${prod.name}`;
      mount.querySelector("#form-product-name").value = prod.name;
      mount.querySelector("#form-product-category").value = prod.category;
      mount.querySelector("#form-product-price").value = prod.price;
      mount.querySelector("#form-product-discount-price").value = prod.discountPrice || prod.price;
      mount.querySelector("#form-product-stock").value = prod.stock;
      mount.querySelector("#form-product-badge").value = prod.badge || "";
      mount.querySelector("#form-product-image").value = prod.images[0] || "";
      mount.querySelector("#form-product-fabric").value = prod.fabric || "";
      mount.querySelector("#form-product-desc").value = prod.description || "";

      productFormModal.classList.remove("hidden");
    });
  });

  mount.querySelector("#close-product-form-btn")?.addEventListener("click", () => {
    if (productFormModal) productFormModal.classList.add("hidden");
  });
  mount.querySelector("#cancel-product-form-btn")?.addEventListener("click", () => {
    if (productFormModal) productFormModal.classList.add("hidden");
  });

  // Direct Image Upload from Computer in Modal
  const fileInput = mount.querySelector("#form-product-file");
  fileInput?.addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const indicator = mount.querySelector("#form-upload-indicator");
      if (indicator) indicator.classList.remove("hidden");
      try {
        const { optimizeAndUploadImage } = await import("./supabaseClient.js");
        const res = await optimizeAndUploadImage(file);
        if (res && res.url) {
          const imgInput = mount.querySelector("#form-product-image");
          if (imgInput) imgInput.value = res.url;
          showToast("Product photo optimized and uploaded!", "success");
        }
      } catch (err) {
        showToast(err.message, "error");
      } finally {
        if (indicator) indicator.classList.add("hidden");
      }
    }
  });

  // Save Product Form
  mount.querySelector("#product-editor-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const editId = mount.querySelector("#edit-product-id")?.value;
    const checkedSizes = Array.from(mount.querySelectorAll('input[name="product-size-check"]:checked')).map(
      (cb) => cb.value
    );

    const productData = {
      id: editId || undefined,
      name: mount.querySelector("#form-product-name")?.value.trim(),
      category: mount.querySelector("#form-product-category")?.value,
      subCategory: "casual",
      price: parseFloat(mount.querySelector("#form-product-price")?.value),
      discountPrice: parseFloat(mount.querySelector("#form-product-discount-price")?.value),
      stock: parseInt(mount.querySelector("#form-product-stock")?.value, 10),
      badge: mount.querySelector("#form-product-badge")?.value.trim(),
      images: [
        mount.querySelector("#form-product-image")?.value.trim(),
        "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80"
      ],
      colors: [
        { name: "Blush Pink", hex: "#FCE7F3", imageIndex: 0 },
        { name: "Cream White", hex: "#FFFDF7", imageIndex: 0 }
      ],
      sizes: checkedSizes.length > 0 ? checkedSizes : SIZE_LIST,
      fabric: mount.querySelector("#form-product-fabric")?.value.trim(),
      ageGroup: "1 to 16 Years",
      comfortAndStyling: "Crafted with soft cotton lining for joyful celebrations.",
      washingInstructions: "Gentle machine wash cold with like colors.",
      description: mount.querySelector("#form-product-desc")?.value.trim()
    };

    await db.saveProductAsync(productData);
    showToast(editId ? "Product updated successfully!" : "New product published!", "success");
    if (productFormModal) productFormModal.classList.add("hidden");
    openAdminDashboard();
  });

  // Settings Form Save
  mount.querySelector("#admin-settings-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const rzpKey = mount.querySelector("#settings-razorpay-key")?.value.trim();
    const announcement = mount.querySelector("#settings-announcement")?.value.trim();
    const freeShip = parseFloat(mount.querySelector("#settings-free-shipping")?.value);
    const shipFee = parseFloat(mount.querySelector("#settings-shipping-fee")?.value);

    await db.updateSettingsAsync({
      razorpayKeyId: rzpKey,
      announcement,
      freeShippingThreshold: freeShip,
      shippingFee: shipFee
    });

    showToast("Store settings saved successfully!", "success");
  });

  // Export DB
  mount.querySelector("#admin-export-db-btn")?.addEventListener("click", () => {
    const json = db.exportDatabase();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `she_and_she_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast("Database JSON exported.", "success");
  });

  // Reset DB
  mount.querySelector("#admin-reset-db-btn")?.addEventListener("click", () => {
    if (confirm("Reset store data to fresh initial seed products?")) {
      db.resetDatabase();
      showToast("Store reset to initial catalog.", "info");
      openAdminDashboard();
    }
  });
}

function openPolicyModal(policyType) {
  const modal = document.getElementById("policy-content-modal");
  const title = document.getElementById("policy-modal-title");
  const body = document.getElementById("policy-modal-body");
  const closeBtn = document.getElementById("close-policy-modal-btn");
  if (!modal || !title || !body) return;

  const policies = {
    privacy: {
      title: "Privacy Policy",
      content: `
        <p><strong>Effective Date:</strong> 1 January 2026</p>
        <p>At <strong>She & She Kids Wear</strong> (Dadabari, Kota, Rajasthan), we respect the privacy of parents and their children. We collect customer names, phone numbers, delivery addresses, and emails solely for order fulfillment, dispatch updates via SMS/WhatsApp, and invoice generation.</p>
        <p><strong>Payment Security:</strong> We do NOT store or process credit/debit card numbers or UPI PINs on our servers. All online transactions are processed through Razorpay's PCI-DSS compliant secure payment gateway.</p>
        <p>We never sell or rent parent or child personal data to third-party marketing brokers.</p>
      `
    },
    terms: {
      title: "Terms & Conditions",
      content: `
        <p>Welcome to <strong>She & She Kids Wear</strong>. By using our website or ordering from our boutique, you agree to these terms:</p>
        <p>1. <strong>Product Sizing:</strong> Kidswear sizing is based on standard Indian measurements (1 to 16 Years). Please consult our Size Guide before placing orders.</p>
        <p>2. <strong>Pricing:</strong> All prices are in Indian Rupees (INR) and inclusive of applicable GST.</p>
        <p>3. <strong>Cash on Delivery (COD):</strong> COD is available for most pin codes across India. In case of repeated failed deliveries, store management reserves the right to restrict COD.</p>
      `
    },
    returns: {
      title: "7-Day Easy Return & Exchange Policy",
      content: `
        <p><strong>Because kids grow fast!</strong> We offer a hassle-free 7-day exchange policy for size replacements.</p>
        <p>• <strong>Eligibility:</strong> Items must be unused, unwashed, and in their original packaging with tags intact.</p>
        <p>• <strong>Exchange Process:</strong> Simply WhatsApp us at <a href="https://wa.me/918824844263?text=Hi%2C%20I%20am%20interested%20in%20your%20kids'%20wear%20collection." target="_blank" class="text-rose-600 font-bold hover:underline">+91 88248 44263</a> or call <a href="tel:+918824844263" class="text-rose-600 font-bold hover:underline">8824844263</a>, or visit our Dadabari Kota store. We will arrange a reverse pickup or direct store swap.</p>
        <p>• <strong>Damaged on Arrival:</strong> In the rare event of receiving a transit-damaged item, notify us within 48 hours for immediate replacement.</p>
      `
    },
    about: {
      title: "About She & She Kids Wear",
      content: `
        <p>Founded with a mother's love in Dadabari, Kota, <strong>She & She Kids Wear</strong> is Rajasthan's premier boutique destination for children's festive, party, and casual fashion.</p>
        <p>We noticed that most kids' party dresses looked dazzling on hangers but caused itching and tears within 15 minutes because of harsh synthetic underskirts. We changed that: <strong>Every She & She garment is tailored with 100% hypoallergenic, breathable cotton lining</strong>.</p>
        <p>Visit our flagship showroom at Sethiya Complex, Dadabari, Kota or enjoy express door-step delivery anywhere in India.</p>
      `
    }
  };

  const selected = policies[policyType] || policies.privacy;
  title.textContent = selected.title;
  body.innerHTML = selected.content;
  modal.classList.remove("hidden");

  closeBtn?.addEventListener("click", () => modal.classList.add("hidden"));
}
