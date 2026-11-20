/**
 * Database & State Management Layer
 * Provides robust LocalStorage persistence with multi-tab synchronization,
 * complete CRUD operations, inventory management, and admin security.
 */

import { INITIAL_PRODUCTS, STORE_INFO } from "./data/seedProducts.js";

const DB_KEYS = {
  PRODUCTS: "sskw_products_v1",
  ORDERS: "sskw_orders_v1",
  CUSTOMERS: "sskw_customers_v1",
  CART: "sskw_cart_v1",
  WISHLIST: "sskw_wishlist_v1",
  SETTINGS: "sskw_settings_v1",
  ADMIN_SESSION: "sskw_admin_session_v1",
  ADMIN_CREDS: "sskw_admin_creds_v1"
};

class StoreDB {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    // 1. Initialize Products if empty
    if (!localStorage.getItem(DB_KEYS.PRODUCTS)) {
      localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }

    // 2. Initialize Orders if empty
    if (!localStorage.getItem(DB_KEYS.ORDERS)) {
      const sampleOrders = [
        {
          id: "SSKW-78219",
          createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
          customer: {
            name: "Pooja Sharma",
            email: "pooja.sharma@example.com",
            phone: "9829054321",
            address: "House 12, Talwandi",
            city: "Kota",
            state: "Rajasthan",
            pincode: "324005"
          },
          items: [
            {
              id: "prod_001",
              name: "Rose Blush Princess Tulle Party Frock",
              price: 1599,
              originalPrice: 2499,
              size: "4-5Y",
              color: "Blush Pink",
              quantity: 1,
              image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=400&q=80"
            }
          ],
          subtotal: 1599,
          discount: 0,
          shipping: 0,
          total: 1599,
          paymentMethod: "Razorpay (UPI)",
          paymentStatus: "Paid",
          paymentId: "pay_test_sample_01",
          orderStatus: "Delivered",
          courier: "Delhivery Express",
          trackingNumber: "DL-90823412"
        },
        {
          id: "SSKW-84920",
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          customer: {
            name: "Amitabh Verma",
            email: "amitabh.v@example.com",
            phone: "9414012345",
            address: "Flat 402, Royal Residency, Dadabari",
            city: "Kota",
            state: "Rajasthan",
            pincode: "324009"
          },
          items: [
            {
              id: "prod_002",
              name: "Pastel Mint Kurta Pajama with Floral Nehru Jacket",
              price: 1899,
              originalPrice: 2999,
              size: "5-6Y",
              color: "Mint Green",
              quantity: 1,
              image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=400&q=80"
            }
          ],
          subtotal: 1899,
          discount: 0,
          shipping: 0,
          total: 1899,
          paymentMethod: "Cash on Delivery (COD)",
          paymentStatus: "Pending on Delivery",
          orderStatus: "Processing",
          courier: "BlueDart KidCare",
          trackingNumber: "BD-84920391"
        }
      ];
      localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(sampleOrders));
    }

    // 3. Initialize Customers
    if (!localStorage.getItem(DB_KEYS.CUSTOMERS)) {
      const sampleCustomers = [
        {
          id: "cust_1",
          name: "Pooja Sharma",
          email: "pooja.sharma@example.com",
          phone: "9829054321",
          city: "Kota",
          ordersCount: 1,
          totalSpent: 1599,
          joinedAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString()
        },
        {
          id: "cust_2",
          name: "Amitabh Verma",
          email: "amitabh.v@example.com",
          phone: "9414012345",
          city: "Kota",
          ordersCount: 1,
          totalSpent: 1899,
          joinedAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
        }
      ];
      localStorage.setItem(DB_KEYS.CUSTOMERS, JSON.stringify(sampleCustomers));
    }

    // 4. Initialize Cart & Wishlist
    if (!localStorage.getItem(DB_KEYS.CART)) {
      localStorage.setItem(DB_KEYS.CART, JSON.stringify([]));
    }
    if (!localStorage.getItem(DB_KEYS.WISHLIST)) {
      localStorage.setItem(DB_KEYS.WISHLIST, JSON.stringify([]));
    }

    // 5. Initialize Store Settings
    if (!localStorage.getItem(DB_KEYS.SETTINGS)) {
      const settings = {
        storeInfo: STORE_INFO,
        announcement: "Free Express Shipping on Orders Above ₹999 | Use Code: FIRSTKID for 15% OFF",
        freeShippingThreshold: 999,
        shippingFee: 99,
        razorpayKeyId: "rzp_test_sheandshe_kids",
        enableCod: true,
        enableRazorpay: true
      };
      localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(settings));
    }

    // 6. Admin Credentials (default: admin@sheandshe.com / admin123)
    if (!localStorage.getItem(DB_KEYS.ADMIN_CREDS)) {
      localStorage.setItem(
        DB_KEYS.ADMIN_CREDS,
        JSON.stringify({
          email: "admin@sheandshe.com",
          password: "admin123"
        })
      );
    }
  }

  /* ------------------- PRODUCTS API ------------------- */
  getProducts() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.PRODUCTS) || "[]");
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  getProductById(id) {
    const products = this.getProducts();
    return products.find((p) => p.id === id) || null;
  }

  getProductBySlug(slug) {
    const products = this.getProducts();
    return products.find((p) => p.slug === slug) || null;
  }

  saveProduct(productData) {
    const products = this.getProducts();
    if (productData.id) {
      // Edit existing product
      const index = products.findIndex((p) => p.id === productData.id);
      if (index !== -1) {
        products[index] = { ...products[index], ...productData, updatedAt: new Date().toISOString() };
        localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
        this.notifyChange("products");
        return products[index];
      }
    }

    // Create new product
    const newProduct = {
      ...productData,
      id: `prod_${Date.now()}`,
      slug: (productData.name || "kidswear-item")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      rating: productData.rating || 5.0,
      reviewCount: productData.reviewCount || 1,
      createdAt: new Date().toISOString()
    };
    products.unshift(newProduct);
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
    this.notifyChange("products");
    return newProduct;
  }

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter((p) => p.id !== id);
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
    this.notifyChange("products");
    return true;
  }

  /* ------------------- CART API ------------------- */
  getCart() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.CART) || "[]");
    } catch {
      return [];
    }
  }

  addToCart(product, size, color, quantity = 1) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(
      (item) => item.id === product.id && item.size === size && item.color === color
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.discountPrice || product.price,
        originalPrice: product.price,
        image: product.images[0] || "",
        size,
        color,
        quantity,
        addedAt: new Date().toISOString()
      });
    }

    localStorage.setItem(DB_KEYS.CART, JSON.stringify(cart));
    this.notifyChange("cart");
    return cart;
  }

  updateCartQuantity(id, size, color, newQty) {
    let cart = this.getCart();
    if (newQty <= 0) {
      cart = cart.filter((item) => !(item.id === id && item.size === size && item.color === color));
    } else {
      const item = cart.find((item) => item.id === id && item.size === size && item.color === color);
      if (item) item.quantity = newQty;
    }
    localStorage.setItem(DB_KEYS.CART, JSON.stringify(cart));
    this.notifyChange("cart");
    return cart;
  }

  removeFromCart(id, size, color) {
    let cart = this.getCart();
    cart = cart.filter((item) => !(item.id === id && item.size === size && item.color === color));
    localStorage.setItem(DB_KEYS.CART, JSON.stringify(cart));
    this.notifyChange("cart");
    return cart;
  }

  clearCart() {
    localStorage.setItem(DB_KEYS.CART, JSON.stringify([]));
    this.notifyChange("cart");
  }

  getCartSummary(appliedCoupon = null) {
    const cart = this.getCart();
    const settings = this.getSettings();
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let discount = 0;
    if (appliedCoupon) {
      const code = appliedCoupon.toUpperCase().trim();
      if (code === "FIRSTKID") discount = Math.round(subtotal * 0.15); // 15% off
      else if (code === "KIDSWEAR10") discount = Math.round(subtotal * 0.10); // 10% off
      else if (code === "KOTA500" && subtotal >= 2500) discount = 500;
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);
    const shipping =
      cart.length === 0
        ? 0
        : discountedSubtotal >= settings.freeShippingThreshold
        ? 0
        : settings.shippingFee;

    const total = discountedSubtotal + shipping;

    return {
      itemsCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      discount,
      shipping,
      freeShippingThreshold: settings.freeShippingThreshold,
      amountNeededForFreeShipping: Math.max(0, settings.freeShippingThreshold - discountedSubtotal),
      total
    };
  }

  /* ------------------- WISHLIST API ------------------- */
  getWishlist() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.WISHLIST) || "[]");
    } catch {
      return [];
    }
  }

  toggleWishlist(productId) {
    let wishlist = this.getWishlist();
    const exists = wishlist.includes(productId);
    if (exists) {
      wishlist = wishlist.filter((id) => id !== productId);
    } else {
      wishlist.push(productId);
    }
    localStorage.setItem(DB_KEYS.WISHLIST, JSON.stringify(wishlist));
    this.notifyChange("wishlist");
    return !exists;
  }

  isInWishlist(productId) {
    const wishlist = this.getWishlist();
    return wishlist.includes(productId);
  }

  /* ------------------- ORDERS API ------------------- */
  getOrders() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.ORDERS) || "[]");
    } catch {
      return [];
    }
  }

  getOrderById(orderId) {
    const orders = this.getOrders();
    return orders.find((o) => o.id.toUpperCase() === orderId.toUpperCase().trim()) || null;
  }

  createOrder({ customer, items, subtotal, discount, shipping, total, paymentMethod, paymentId, paymentStatus = "Paid" }) {
    const orders = this.getOrders();
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const newOrderId = `SSKW-${randomDigits}`;

    const newOrder = {
      id: newOrderId,
      createdAt: new Date().toISOString(),
      customer,
      items,
      subtotal,
      discount,
      shipping,
      total,
      paymentMethod,
      paymentId: paymentId || `pay_${Date.now()}`,
      paymentStatus: paymentMethod.includes("COD") ? "Pending on Delivery" : paymentStatus,
      orderStatus: "Processing",
      courier: "BlueDart Express Kota",
      trackingNumber: `BD-${Math.floor(10000000 + Math.random() * 90000000)}`
    };

    orders.unshift(newOrder);
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));

    // Decrement stock for ordered items
    const products = this.getProducts();
    items.forEach((item) => {
      const prod = products.find((p) => p.id === item.id);
      if (prod && typeof prod.stock === "number") {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    });
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));

    // Register or update customer
    this.recordCustomerPurchase(customer, total);

    // Clear user cart
    this.clearCart();

    this.notifyChange("orders");
    this.notifyChange("products");
    return newOrder;
  }

  updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.orderStatus = newStatus;
      if (newStatus === "Delivered") {
        order.deliveredAt = new Date().toISOString();
        if (order.paymentStatus.includes("Pending")) {
          order.paymentStatus = "Paid (Cash Collected)";
        }
      }
      localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
      this.notifyChange("orders");
      return order;
    }
    return null;
  }

  /* ------------------- CUSTOMERS API ------------------- */
  getCustomers() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.CUSTOMERS) || "[]");
    } catch {
      return [];
    }
  }

  recordCustomerPurchase(customerData, purchaseAmount) {
    const customers = this.getCustomers();
    const existing = customers.find(
      (c) => c.phone === customerData.phone || (c.email && c.email.toLowerCase() === customerData.email.toLowerCase())
    );

    if (existing) {
      existing.ordersCount = (existing.ordersCount || 1) + 1;
      existing.totalSpent = (existing.totalSpent || 0) + purchaseAmount;
      existing.lastOrderAt = new Date().toISOString();
      existing.address = customerData.address;
      existing.city = customerData.city;
      existing.pincode = customerData.pincode;
    } else {
      customers.unshift({
        id: `cust_${Date.now()}`,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        city: customerData.city || "Kota",
        pincode: customerData.pincode,
        ordersCount: 1,
        totalSpent: purchaseAmount,
        joinedAt: new Date().toISOString()
      });
    }

    localStorage.setItem(DB_KEYS.CUSTOMERS, JSON.stringify(customers));
    this.notifyChange("customers");
  }

  /* ------------------- SETTINGS API ------------------- */
  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.SETTINGS) || "{}");
    } catch {
      return { storeInfo: STORE_INFO };
    }
  }

  updateSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(updated));
    this.notifyChange("settings");
    return updated;
  }

  /* ------------------- ADMIN AUTH API ------------------- */
  isAdminAuthenticated() {
    const session = localStorage.getItem(DB_KEYS.ADMIN_SESSION);
    if (!session) return false;
    try {
      const data = JSON.parse(session);
      return data.expiresAt > Date.now();
    } catch {
      return false;
    }
  }

  adminLogin(email, password) {
    let creds = { email: "admin@sheandshe.com", password: "admin123" };
    try {
      creds = JSON.parse(localStorage.getItem(DB_KEYS.ADMIN_CREDS)) || creds;
    } catch {}

    if (
      email.trim().toLowerCase() === creds.email.toLowerCase() &&
      password === creds.password
    ) {
      const session = {
        email: creds.email,
        role: "Store Administrator",
        token: `adm_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        expiresAt: Date.now() + 3600000 * 24 // 24 hours
      };
      localStorage.setItem(DB_KEYS.ADMIN_SESSION, JSON.stringify(session));
      this.notifyChange("adminSession");
      return { success: true, session };
    }
    return { success: false, message: "Invalid email or password. Default is admin@sheandshe.com / admin123" };
  }

  adminLogout() {
    localStorage.removeItem(DB_KEYS.ADMIN_SESSION);
    this.notifyChange("adminSession");
  }

  updateAdminPassword(currentPassword, newPassword) {
    let creds = { email: "admin@sheandshe.com", password: "admin123" };
    try {
      creds = JSON.parse(localStorage.getItem(DB_KEYS.ADMIN_CREDS)) || creds;
    } catch {}

    if (currentPassword !== creds.password) {
      return { success: false, message: "Current password does not match." };
    }

    creds.password = newPassword;
    localStorage.setItem(DB_KEYS.ADMIN_CREDS, JSON.stringify(creds));
    return { success: true, message: "Password updated successfully." };
  }

  /* ------------------- BACKUP & RESET ------------------- */
  resetDatabase() {
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.removeItem(DB_KEYS.CART);
    localStorage.removeItem(DB_KEYS.WISHLIST);
    this.initDatabase();
    this.notifyChange("all");
    return true;
  }

  exportDatabase() {
    const exportData = {
      exportedAt: new Date().toISOString(),
      products: this.getProducts(),
      orders: this.getOrders(),
      customers: this.getCustomers(),
      settings: this.getSettings()
    };
    return JSON.stringify(exportData, null, 2);
  }

  importDatabase(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.products) localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(data.products));
      if (data.orders) localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(data.orders));
      if (data.customers) localStorage.setItem(DB_KEYS.CUSTOMERS, JSON.stringify(data.customers));
      if (data.settings) localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(data.settings));
      this.notifyChange("all");
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  /* ------------------- REACTIVE LISTENERS ------------------- */
  notifyChange(scope) {
    window.dispatchEvent(new CustomEvent("sskw:dbchange", { detail: { scope } }));
  }

  subscribe(callback) {
    const handler = (e) => callback(e.detail);
    window.addEventListener("sskw:dbchange", handler);
    return () => window.removeEventListener("sskw:dbchange", handler);
  }
}

export const db = new StoreDB();
