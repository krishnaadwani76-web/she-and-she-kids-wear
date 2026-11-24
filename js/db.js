/**
 * Database & State Management Layer
 * Provides robust dual-mode persistence:
 * 1. Live Supabase Cloud Database (PostgreSQL + Auth + Storage)
 * 2. Instant Local Storage cache & offline fallback
 *
 * Full CRUD operations for Products, Categories, Orders, Customers, and Website Settings.
 */

import { INITIAL_PRODUCTS, CATEGORIES as DEFAULT_CATEGORIES, STORE_INFO } from "./data/seedProducts.js";
import { isSupabaseConfigured, getSupabaseConfig } from "./config.js";
import { getSupabaseClient, testConnection } from "./supabaseClient.js";

export const DB_KEYS = {
  PRODUCTS: "sskw_products_v1",
  CATEGORIES: "sskw_categories_v1",
  ORDERS: "sskw_orders_v1",
  CUSTOMERS: "sskw_customers_v1",
  CART: "sskw_cart_v1",
  WISHLIST: "sskw_wishlist_v1",
  SETTINGS: "sskw_settings_v1",
  ADMIN_SESSION: "sskw_admin_session_v1",
  ADMIN_CREDS: "sskw_admin_creds_v1",
  INQUIRIES: "sskw_inquiries_v1",
  NEWSLETTER: "sskw_newsletter_v1"
};

class StoreDB {
  constructor() {
    this.initDatabase();
    this.isCloudSyncing = false;
    // Auto-fetch from Supabase if configured on startup
    if (isSupabaseConfigured()) {
      this.syncFromSupabase().catch((err) => console.warn("Supabase initial sync skipped:", err));
    }
  }

  initDatabase() {
    // 1. Initialize Categories
    if (!localStorage.getItem(DB_KEYS.CATEGORIES)) {
      const initialCats = DEFAULT_CATEGORIES.map((c, i) => ({
        id: c.id,
        name: c.name,
        slug: c.id === "all" ? "all-products" : `${c.id}-wear`,
        description: c.description || "",
        icon: c.icon || "sparkles",
        displayOrder: i + 1,
        isActive: true
      }));
      // Add Born Baby if missing
      if (!initialCats.some(c => c.id === "born-baby")) {
        initialCats.push({
          id: "born-baby",
          name: "Born Baby",
          slug: "born-baby",
          description: "Hypoallergenic Organic Essentials for 0-12 Months",
          icon: "sparkles",
          displayOrder: 6,
          isActive: true
        });
      }
      localStorage.setItem(DB_KEYS.CATEGORIES, JSON.stringify(initialCats));
    }

    // 2. Initialize Products
    if (!localStorage.getItem(DB_KEYS.PRODUCTS)) {
      const seeded = INITIAL_PRODUCTS.map(p => ({
        ...p,
        isActive: p.isActive !== undefined ? p.isActive : true
      }));
      localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(seeded));
    }

    // 3. Initialize Orders
    if (!localStorage.getItem(DB_KEYS.ORDERS)) {
      const sampleOrders = [
        {
          id: "SSKW-78219",
          createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
          customer: {
            name: "Pooja Sharma",
            email: "pooja.sharma@example.com",
            phone: "9829154321",
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
          courier: "Delhivery Express Kota",
          trackingNumber: "DL-90823412",
          trackingLink: "https://www.delhivery.com/track/package/DL-90823412"
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
          courier: "BlueDart KidCare Kota",
          trackingNumber: "BD-84920391",
          trackingLink: "https://www.bluedart.com/tracking"
        }
      ];
      localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(sampleOrders));
    }

    // 4. Initialize Customers
    if (!localStorage.getItem(DB_KEYS.CUSTOMERS)) {
      const sampleCustomers = [
        {
          id: "cust_1",
          name: "Pooja Sharma",
          email: "pooja.sharma@example.com",
          phone: "9829154321",
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

    // 5. Initialize Cart & Wishlist
    if (!localStorage.getItem(DB_KEYS.CART)) {
      localStorage.setItem(DB_KEYS.CART, JSON.stringify([]));
    }
    if (!localStorage.getItem(DB_KEYS.WISHLIST)) {
      localStorage.setItem(DB_KEYS.WISHLIST, JSON.stringify([]));
    }

    // 6. Initialize Website Settings & Content
    if (!localStorage.getItem(DB_KEYS.SETTINGS)) {
      const settings = {
        storeInfo: STORE_INFO,
        announcement: "Free Express Shipping on Orders Above ₹999 | Use Code: FIRSTKID for 15% OFF",
        freeShippingThreshold: 999,
        shippingFee: 99,
        razorpayKeyId: "rzp_test_sheandshe_kids",
        enableCod: true,
        enableRazorpay: true,
        // Homepage content controls
        heroHeading: "Making Every Childhood More Stylish.",
        heroSubtitle: "Discover adorable outfits for every little moment. From royal festive frocks and dapper kurta sets to everyday organic playwear — crafted with pure breathable fabrics for happy, active kids.",
        heroBannerImage: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1200&q=85",
        promoBadge: "New Spring / Festive 2026 Collection • Ages 1 to 16 Years",
        aboutContent: "Founded in Dadabari, Kota, She & She Kids Wear brings boutique elegance, itch-free natural fabrics, and royal Indian festive craftsmanship to children aged 1 to 16 years.",
        returnPolicy: "We offer a hassle-free 7-day return and exchange policy from delivery date. Items must be unwashed, unworn, and have original tags intact.",
        shippingPolicy: "Orders are dispatched within 24 hours from Dadabari, Kota. Delivery within 2-4 business days across Rajasthan, and 3-6 days across India."
      };
      localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(settings));
    } else {
      // Auto-migrate any cached old phone numbers in existing localStorage
      try {
        const storedSettings = JSON.parse(localStorage.getItem(DB_KEYS.SETTINGS) || "null");
        if (storedSettings && storedSettings.storeInfo) {
          if (
            !storedSettings.storeInfo.phone ||
            storedSettings.storeInfo.phone.includes("98290") ||
            (storedSettings.storeInfo.whatsapp && storedSettings.storeInfo.whatsapp.includes("98290"))
          ) {
            storedSettings.storeInfo.phone = "+91 88248 44263";
            storedSettings.storeInfo.whatsapp = "+918824844263";
            storedSettings.storeInfo.whatsappClean = "918824844263";
            storedSettings.storeInfo.whatsappUrl = "https://wa.me/918824844263?text=Hi%2C%20I%20am%20interested%20in%20your%20kids'%20wear%20collection.";
            localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(storedSettings));
          }
        }
      } catch (e) {
        console.warn("Could not check settings phone migration:", e);
      }
    }

    // 7. Admin Credentials (default)
    if (!localStorage.getItem(DB_KEYS.ADMIN_CREDS)) {
      localStorage.setItem(
        DB_KEYS.ADMIN_CREDS,
        JSON.stringify({
          email: "admin@sheandshe.com",
          password: "admin123"
        })
      );
    }

    // 8. Customer Inquiries & Newsletter Subscribers
    if (!localStorage.getItem(DB_KEYS.INQUIRIES)) {
      localStorage.setItem(DB_KEYS.INQUIRIES, JSON.stringify([]));
    }
    if (!localStorage.getItem(DB_KEYS.NEWSLETTER)) {
      localStorage.setItem(DB_KEYS.NEWSLETTER, JSON.stringify([]));
    }
  }

  /* ------------------- SUPABASE CLOUD SYNC ------------------- */
  async syncFromSupabase() {
    const client = await getSupabaseClient();
    if (!client) return false;

    try {
      this.isCloudSyncing = true;

      // Sync categories
      const { data: catData, error: catError } = await client
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (!catError && catData && catData.length > 0) {
        const formattedCats = catData.map(c => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          icon: c.icon,
          displayOrder: c.display_order,
          isActive: c.is_active
        }));
        localStorage.setItem(DB_KEYS.CATEGORIES, JSON.stringify(formattedCats));
      }

      // Sync products
      const { data: prodData, error: prodError } = await client
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!prodError && prodData && prodData.length > 0) {
        const formattedProds = prodData.map(p => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: p.category,
          subCategory: p.sub_category,
          price: Number(p.price),
          discountPrice: p.discount_price ? Number(p.discount_price) : null,
          stock: p.stock,
          badge: p.badge,
          isNew: p.is_new,
          isBestSeller: p.is_bestseller,
          isFeatured: p.is_featured,
          isActive: p.is_active,
          images: Array.isArray(p.images) ? p.images : [],
          colors: Array.isArray(p.colors) ? p.colors : [],
          sizes: Array.isArray(p.sizes) ? p.sizes : [],
          fabric: p.fabric,
          ageGroup: p.age_group,
          comfortAndStyling: p.comfort_and_styling,
          washingInstructions: p.washing_instructions,
          description: p.description,
          rating: Number(p.rating || 5.0),
          reviewCount: p.review_count || 1,
          createdAt: p.created_at,
          updatedAt: p.updated_at
        }));
        localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(formattedProds));
      }

      // Sync orders
      const { data: orderData, error: orderError } = await client
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

      if (!orderError && orderData && orderData.length > 0) {
        const formattedOrders = orderData.map(o => ({
          id: o.id,
          createdAt: o.created_at,
          customer: {
            name: o.customer_name,
            email: o.customer_email,
            phone: o.customer_phone,
            address: o.customer_address,
            city: o.customer_city,
            state: o.customer_state,
            pincode: o.customer_pincode
          },
          items: (o.order_items || []).map(item => ({
            id: item.product_id,
            name: item.name,
            price: Number(item.price),
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            image: item.image
          })),
          subtotal: Number(o.subtotal),
          discount: Number(o.discount || 0),
          shipping: Number(o.shipping || 0),
          total: Number(o.total),
          paymentMethod: o.payment_method,
          paymentStatus: o.payment_status,
          paymentId: o.payment_id,
          orderStatus: o.order_status,
          courier: o.courier,
          trackingNumber: o.tracking_number,
          trackingLink: o.tracking_link,
          notes: o.notes
        }));
        localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(formattedOrders));
      }

      // Sync site settings
      const { data: settingsData } = await client.from("site_settings").select("*");
      if (settingsData && settingsData.length > 0) {
        const current = this.getSettings();
        settingsData.forEach(row => {
          if (row.key === "general" && row.value) {
            Object.assign(current, row.value);
            if (row.value.storeName) {
              current.storeInfo = {
                ...current.storeInfo,
                name: row.value.storeName,
                tagline: row.value.tagline || current.storeInfo.tagline,
                phone: row.value.phone || current.storeInfo.phone,
                whatsapp: row.value.whatsapp || current.storeInfo.whatsapp,
                email: row.value.email || current.storeInfo.email,
                address: row.value.address || current.storeInfo.address,
                timings: row.value.timings || current.storeInfo.timings,
                mapsUrl: row.value.mapsUrl || current.storeInfo.mapsUrl
              };
            }
          }
          if (row.key === "homepage" && row.value) {
            Object.assign(current, row.value);
          }
          if (row.key === "policies" && row.value) {
            Object.assign(current, row.value);
          }
        });
        localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(current));
      }

      this.notifyChange("all");
      return true;
    } catch (err) {
      console.warn("Error syncing from Supabase:", err);
      return false;
    } finally {
      this.isCloudSyncing = false;
    }
  }

  /* ------------------- CATEGORIES API ------------------- */
  getCategories() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.CATEGORIES) || "[]");
    } catch {
      return DEFAULT_CATEGORIES;
    }
  }

  async getCategoriesAsync() {
    if (isSupabaseConfigured()) {
      const client = await getSupabaseClient();
      if (client) {
        const { data, error } = await client
          .from("categories")
          .select("*")
          .order("display_order", { ascending: true });
        if (!error && data && data.length > 0) {
          const mapped = data.map(c => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
            icon: c.icon,
            displayOrder: c.display_order,
            isActive: c.is_active
          }));
          localStorage.setItem(DB_KEYS.CATEGORIES, JSON.stringify(mapped));
          return mapped;
        }
      }
    }
    return this.getCategories();
  }

  async saveCategoryAsync(categoryData) {
    let categories = this.getCategories();
    let updatedCat = null;

    const catId = categoryData.id || categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newRecord = {
      id: catId,
      name: categoryData.name.trim(),
      slug: categoryData.slug || catId,
      description: categoryData.description || "",
      icon: categoryData.icon || "sparkles",
      displayOrder: categoryData.displayOrder || categories.length + 1,
      isActive: categoryData.isActive !== false
    };

    const index = categories.findIndex(c => c.id === catId);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...newRecord };
      updatedCat = categories[index];
    } else {
      categories.push(newRecord);
      updatedCat = newRecord;
    }

    localStorage.setItem(DB_KEYS.CATEGORIES, JSON.stringify(categories));
    this.notifyChange("categories");

    // Push to Supabase if configured
    if (isSupabaseConfigured()) {
      const client = await getSupabaseClient();
      if (client) {
        await client.from("categories").upsert({
          id: newRecord.id,
          name: newRecord.name,
          slug: newRecord.slug,
          description: newRecord.description,
          icon: newRecord.icon,
          display_order: newRecord.displayOrder,
          is_active: newRecord.isActive
        });
      }
    }

    return updatedCat;
  }

  async deleteCategoryAsync(id) {
    let categories = this.getCategories();
    categories = categories.filter(c => c.id !== id);
    localStorage.setItem(DB_KEYS.CATEGORIES, JSON.stringify(categories));
    this.notifyChange("categories");

    if (isSupabaseConfigured()) {
      const client = await getSupabaseClient();
      if (client) {
        await client.from("categories").delete().eq("id", id);
      }
    }
    return true;
  }

  /* ------------------- PRODUCTS API ------------------- */
  getProducts(onlyActive = false) {
    try {
      const prods = JSON.parse(localStorage.getItem(DB_KEYS.PRODUCTS) || "[]");
      if (onlyActive) {
        return prods.filter(p => p.isActive !== false);
      }
      return prods;
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  async getProductsAsync(onlyActive = false) {
    if (isSupabaseConfigured()) {
      const client = await getSupabaseClient();
      if (client) {
        let query = client.from("products").select("*").order("created_at", { ascending: false });
        if (onlyActive) {
          query = query.eq("is_active", true);
        }
        const { data, error } = await query;
        if (!error && data) {
          const mapped = data.map(p => this.formatSupabaseProduct(p));
          if (!onlyActive) {
            localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(mapped));
          }
          return mapped;
        }
      }
    }
    return this.getProducts(onlyActive);
  }

  formatSupabaseProduct(p) {
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      subCategory: p.sub_category || "casual",
      price: Number(p.price),
      discountPrice: p.discount_price ? Number(p.discount_price) : null,
      stock: Number(p.stock ?? 10),
      badge: p.badge || null,
      isNew: Boolean(p.is_new),
      isBestSeller: Boolean(p.is_bestseller),
      isFeatured: Boolean(p.is_featured),
      isActive: p.is_active !== false,
      images: Array.isArray(p.images) ? p.images : [],
      colors: Array.isArray(p.colors) ? p.colors : [],
      sizes: Array.isArray(p.sizes) ? p.sizes : [],
      fabric: p.fabric || "",
      ageGroup: p.age_group || "1 to 16 Years",
      comfortAndStyling: p.comfort_and_styling || "",
      washingInstructions: p.washing_instructions || "",
      description: p.description || "",
      rating: Number(p.rating || 5.0),
      reviewCount: Number(p.review_count || 1),
      createdAt: p.created_at || new Date().toISOString(),
      updatedAt: p.updated_at || new Date().toISOString()
    };
  }

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id) || null;
  }

  async getProductByIdAsync(id) {
    if (isSupabaseConfigured()) {
      const client = await getSupabaseClient();
      if (client) {
        try {
          const { data, error } = await client.from("products").select("*").eq("id", id).maybeSingle();
          if (!error && data) {
            return this.formatSupabaseProduct(data);
          }
        } catch (e) {
          console.warn("Could not query product by ID from Supabase:", e);
        }
      }
    }
    return this.getProductById(id);
  }

  getProductBySlug(slug) {
    const products = this.getProducts();
    return products.find(p => p.slug === slug) || null;
  }

  async getProductBySlugAsync(slug) {
    if (isSupabaseConfigured()) {
      const client = await getSupabaseClient();
      if (client) {
        try {
          let { data } = await client.from("products").select("*").eq("slug", slug).maybeSingle();
          if (!data) {
            const byId = await client.from("products").select("*").eq("id", slug).maybeSingle();
            data = byId.data;
          }
          if (data) {
            return this.formatSupabaseProduct(data);
          }
        } catch (e) {
          console.warn("Could not query product by slug from Supabase:", e);
        }
      }
    }
    return this.getProductBySlug(slug) || this.getProductById(slug);
  }

  async saveProductAsync(productData) {
    const products = this.getProducts();
    let savedProduct = null;

    const baseSlug = (productData.name || "kidswear-item")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    if (productData.id) {
      const index = products.findIndex(p => p.id === productData.id);
      if (index !== -1) {
        savedProduct = {
          ...products[index],
          ...productData,
          slug: productData.slug || products[index].slug || baseSlug,
          isActive: productData.isActive !== false,
          updatedAt: new Date().toISOString()
        };
        products[index] = savedProduct;
      }
    }

    if (!savedProduct) {
      savedProduct = {
        ...productData,
        id: productData.id || `prod_${Date.now()}`,
        slug: baseSlug,
        rating: productData.rating || 5.0,
        reviewCount: productData.reviewCount || 1,
        isActive: productData.isActive !== false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      products.unshift(savedProduct);
    }

    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
    this.notifyChange("products");

    // Supabase upsert
    if (isSupabaseConfigured()) {
      const client = await getSupabaseClient();
      if (client) {
        const payload = {
          id: savedProduct.id,
          name: savedProduct.name,
          slug: savedProduct.slug,
          category: savedProduct.category,
          sub_category: savedProduct.subCategory || "casual",
          price: Number(savedProduct.price),
          discount_price: savedProduct.discountPrice ? Number(savedProduct.discountPrice) : null,
          stock: Number(savedProduct.stock || 0),
          badge: savedProduct.badge || null,
          is_new: Boolean(savedProduct.isNew),
          is_bestseller: Boolean(savedProduct.isBestSeller),
          is_featured: Boolean(savedProduct.isFeatured),
          is_active: Boolean(savedProduct.isActive),
          images: savedProduct.images || [],
          colors: savedProduct.colors || [],
          sizes: savedProduct.sizes || [],
          fabric: savedProduct.fabric || "",
          age_group: savedProduct.ageGroup || "1 to 16 Years",
          comfort_and_styling: savedProduct.comfortAndStyling || "",
          washing_instructions: savedProduct.washingInstructions || "",
          description: savedProduct.description || "",
          rating: Number(savedProduct.rating || 5.0),
          review_count: Number(savedProduct.reviewCount || 1)
        };
        await client.from("products").upsert(payload);
      }
    }

    return savedProduct;
  }

  async deleteProductAsync(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
    this.notifyChange("products");

    if (isSupabaseConfigured()) {
      const client = await getSupabaseClient();
      if (client) {
        await client.from("products").delete().eq("id", id);
      }
    }
    return true;
  }

  async toggleProductStatusAsync(id, isActive) {
    const products = this.getProducts();
    const prod = products.find(p => p.id === id);
    if (prod) {
      prod.isActive = isActive;
      localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
      this.notifyChange("products");

      if (isSupabaseConfigured()) {
        const client = await getSupabaseClient();
        if (client) {
          await client.from("products").update({ is_active: isActive }).eq("id", id);
        }
      }
      return prod;
    }
    return null;
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
      item => item.id === product.id && item.size === size && item.color === color
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
        image: (product.images && product.images[0]) || "",
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
      cart = cart.filter(item => !(item.id === id && item.size === size && item.color === color));
    } else {
      const item = cart.find(item => item.id === id && item.size === size && item.color === color);
      if (item) item.quantity = newQty;
    }
    localStorage.setItem(DB_KEYS.CART, JSON.stringify(cart));
    this.notifyChange("cart");
    return cart;
  }

  removeFromCart(id, size, color) {
    let cart = this.getCart();
    cart = cart.filter(item => !(item.id === id && item.size === size && item.color === color));
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
      if (code === "FIRSTKID") discount = Math.round(subtotal * 0.15);
      else if (code === "KIDSWEAR10") discount = Math.round(subtotal * 0.10);
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
      wishlist = wishlist.filter(id => id !== productId);
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

  async getOrdersAsync() {
    if (isSupabaseConfigured()) {
      const client = await getSupabaseClient();
      if (client) {
        const { data, error } = await client
          .from("orders")
          .select("*, order_items(*)")
          .order("created_at", { ascending: false });

        if (!error && data) {
          const mapped = data.map(o => ({
            id: o.id,
            createdAt: o.created_at,
            customer: {
              name: o.customer_name,
              email: o.customer_email,
              phone: o.customer_phone,
              address: o.customer_address,
              city: o.customer_city,
              state: o.customer_state,
              pincode: o.customer_pincode
            },
            items: (o.order_items || []).map(item => ({
              id: item.product_id,
              name: item.name,
              price: Number(item.price),
              quantity: item.quantity,
              size: item.size,
              color: item.color,
              image: item.image
            })),
            subtotal: Number(o.subtotal),
            discount: Number(o.discount || 0),
            shipping: Number(o.shipping || 0),
            total: Number(o.total),
            paymentMethod: o.payment_method,
            paymentStatus: o.payment_status,
            paymentId: o.payment_id,
            orderStatus: o.order_status,
            courier: o.courier,
            trackingNumber: o.tracking_number,
            trackingLink: o.tracking_link,
            notes: o.notes
          }));
          localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(mapped));
          return mapped;
        }
      }
    }
    return this.getOrders();
  }

  getOrderById(orderId) {
    if (!orderId) return null;
    const clean = orderId.trim();
    const cleanUpper = clean.toUpperCase();
    const digits = clean.replace(/\D/g, "");
    const orders = this.getOrders();
    return orders.find(o => 
      o.id.toUpperCase() === cleanUpper ||
      (o.trackingNumber && o.trackingNumber.toUpperCase() === cleanUpper) ||
      (digits.length >= 10 && o.customer?.phone && o.customer.phone.replace(/\D/g, "").includes(digits.slice(-10)))
    ) || null;
  }

  formatSupabaseOrder(data) {
    return {
      id: data.id,
      createdAt: data.created_at,
      customer: {
        name: data.customer_name,
        email: data.customer_email || "",
        phone: data.customer_phone,
        address: data.customer_address,
        city: data.customer_city || "Kota",
        state: data.customer_state || "Rajasthan",
        pincode: data.customer_pincode
      },
      items: (data.order_items || []).map(item => ({
        id: item.product_id,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
        size: item.size || "",
        color: item.color || "",
        image: item.image || ""
      })),
      subtotal: Number(data.subtotal),
      discount: Number(data.discount || 0),
      shipping: Number(data.shipping || 0),
      total: Number(data.total),
      paymentMethod: data.payment_method,
      paymentStatus: data.payment_status,
      paymentId: data.payment_id,
      orderStatus: data.order_status,
      courier: data.courier,
      trackingNumber: data.tracking_number,
      trackingLink: data.tracking_link
    };
  }

  async getOrderByIdAsync(query) {
    if (!query) return null;
    const clean = query.trim();
    const cleanUpper = clean.toUpperCase();

    if (isSupabaseConfigured()) {
      const client = await getSupabaseClient();
      if (client) {
        try {
          // 1. Try by Order ID
          let { data } = await client
            .from("orders")
            .select("*, order_items(*)")
            .eq("id", cleanUpper)
            .maybeSingle();

          // 2. Try by Tracking Number if not found
          if (!data) {
            const trackRes = await client
              .from("orders")
              .select("*, order_items(*)")
              .ilike("tracking_number", `%${cleanUpper}%`)
              .limit(1);
            if (trackRes.data && trackRes.data.length > 0) {
              data = trackRes.data[0];
            }
          }

          // 3. Try by Phone Number if at least 10 digits
          if (!data && clean.replace(/\D/g, "").length >= 10) {
            const rawPhone = clean.replace(/\D/g, "").slice(-10);
            const phoneRes = await client
              .from("orders")
              .select("*, order_items(*)")
              .ilike("customer_phone", `%${rawPhone}%`)
              .order("created_at", { ascending: false })
              .limit(1);
            if (phoneRes.data && phoneRes.data.length > 0) {
              data = phoneRes.data[0];
            }
          }

          if (data) {
            return this.formatSupabaseOrder(data);
          }
        } catch (e) {
          console.warn("Could not query order from Supabase:", e);
        }
      }
    }
    return this.getOrderById(clean);
  }

  async pushOrderToSupabase(newOrder) {
    if (!isSupabaseConfigured()) return;
    const client = await getSupabaseClient();
    if (!client) return;

    try {
      await client.from("orders").insert({
        id: newOrder.id,
        customer_name: newOrder.customer.name,
        customer_email: newOrder.customer.email || "",
        customer_phone: newOrder.customer.phone,
        customer_address: newOrder.customer.address,
        customer_city: newOrder.customer.city || "Kota",
        customer_state: newOrder.customer.state || "Rajasthan",
        customer_pincode: newOrder.customer.pincode,
        subtotal: newOrder.subtotal,
        discount: newOrder.discount || 0,
        shipping: newOrder.shipping || 0,
        total: newOrder.total,
        payment_method: newOrder.paymentMethod,
        payment_status: newOrder.paymentStatus,
        payment_id: newOrder.paymentId,
        order_status: newOrder.orderStatus,
        courier: newOrder.courier,
        tracking_number: newOrder.trackingNumber,
        tracking_link: newOrder.trackingLink
      });

      // Insert order items
      if (newOrder.items && newOrder.items.length > 0) {
        const itemsPayload = newOrder.items.map(item => ({
          order_id: newOrder.id,
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size || "",
          color: item.color || "",
          image: item.image || ""
        }));
        await client.from("order_items").insert(itemsPayload);
      }

      // Update stock in Supabase
      const products = this.getProducts();
      for (const item of (newOrder.items || [])) {
        const prod = products.find(p => p.id === item.id);
        if (prod) {
          await client.from("products").update({ stock: prod.stock }).eq("id", item.id);
        }
      }
    } catch (e) {
      console.warn("Could not push order to Supabase:", e);
    }
  }

  async createOrderAsync(orderData) {
    const newOrder = this.createOrder(orderData);
    if (isSupabaseConfigured()) {
      await this.pushOrderToSupabase(newOrder);
    }
    return newOrder;
  }

  async updateOrderStatusAsync(orderId, newStatus, trackingData = {}) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.orderStatus = newStatus;
      if (trackingData.courier) order.courier = trackingData.courier;
      if (trackingData.trackingNumber) order.trackingNumber = trackingData.trackingNumber;
      if (trackingData.trackingLink) order.trackingLink = trackingData.trackingLink;

      if (newStatus === "Delivered") {
        order.deliveredAt = new Date().toISOString();
        if (order.paymentStatus.includes("Pending")) {
          order.paymentStatus = "Paid (Cash Collected)";
        }
      }

      localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
      this.notifyChange("orders");

      if (isSupabaseConfigured()) {
        const client = await getSupabaseClient();
        if (client) {
          const updatePayload = {
            order_status: newStatus,
            courier: order.courier,
            tracking_number: order.trackingNumber,
            tracking_link: order.trackingLink,
            payment_status: order.paymentStatus
          };
          if (newStatus === "Delivered") {
            updatePayload.delivered_at = order.deliveredAt;
          }
          await client.from("orders").update(updatePayload).eq("id", orderId);
        }
      }

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
      c => c.phone === customerData.phone || (c.email && c.email.toLowerCase() === customerData.email.toLowerCase())
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

    if (isSupabaseConfigured()) {
      getSupabaseClient().then(client => {
        if (!client) return;
        const target = existing || customers[0];
        client
          .from("customers")
          .upsert({
            id: target.id,
            name: target.name,
            email: target.email || "",
            phone: target.phone,
            address: target.address || customerData.address || "",
            city: target.city || customerData.city || "Kota",
            state: "Rajasthan",
            pincode: target.pincode || customerData.pincode || "",
            orders_count: target.ordersCount || 1,
            total_spent: target.totalSpent || 0,
            last_order_at: target.lastOrderAt || new Date().toISOString()
          }, { onConflict: "phone" })
          .then(() => {})
          .catch(e => console.warn("Supabase customer sync error:", e));
      });
    }
  }

  /* ------------------- SETTINGS & CONTENT API ------------------- */
  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.SETTINGS) || "{}");
    } catch {
      return { storeInfo: STORE_INFO };
    }
  }

  async getSettingsAsync() {
    if (isSupabaseConfigured()) {
      const client = await getSupabaseClient();
      if (client) {
        const { data, error } = await client.from("site_settings").select("*");
        if (!error && data && data.length > 0) {
          const settings = this.getSettings();
          data.forEach(row => {
            if (row.key === "general" && row.value) Object.assign(settings, row.value);
            if (row.key === "homepage" && row.value) Object.assign(settings, row.value);
            if (row.key === "policies" && row.value) Object.assign(settings, row.value);
          });
          localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(settings));
          return settings;
        }
      }
    }
    return this.getSettings();
  }

  async updateSettingsAsync(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(updated));
    this.notifyChange("settings");

    if (isSupabaseConfigured()) {
      const client = await getSupabaseClient();
      if (client) {
        // Update general
        await client.from("site_settings").upsert({
          key: "general",
          value: {
            storeName: updated.storeInfo?.name || "She & She Kids Wear",
            tagline: updated.storeInfo?.tagline || "",
            subtitle: updated.storeInfo?.subtitle || "",
            phone: updated.storeInfo?.phone || "",
            whatsapp: updated.storeInfo?.whatsapp || "",
            email: updated.storeInfo?.email || "",
            address: updated.storeInfo?.address || "",
            timings: updated.storeInfo?.timings || "",
            mapsUrl: updated.storeInfo?.mapsUrl || "",
            announcement: updated.announcement || "",
            freeShippingThreshold: updated.freeShippingThreshold || 999,
            shippingFee: updated.shippingFee || 99,
            enableCod: updated.enableCod !== false,
            enableRazorpay: updated.enableRazorpay !== false,
            razorpayKeyId: updated.razorpayKeyId || ""
          }
        });

        // Update homepage
        await client.from("site_settings").upsert({
          key: "homepage",
          value: {
            heroHeading: updated.heroHeading || "",
            heroSubtitle: updated.heroSubtitle || "",
            heroBannerImage: updated.heroBannerImage || "",
            promoBadge: updated.promoBadge || "",
            aboutContent: updated.aboutContent || ""
          }
        });

        // Update policies
        await client.from("site_settings").upsert({
          key: "policies",
          value: {
            returnPolicy: updated.returnPolicy || "",
            shippingPolicy: updated.shippingPolicy || ""
          }
        });
      }
    }

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

  saveProduct(productData) {
    this.saveProductAsync(productData).catch((e) => console.warn("Supabase saveProduct error:", e));
    const products = this.getProducts();
    const existing = productData.id ? products.find((p) => p.id === productData.id) : null;
    return existing || productData;
  }

  deleteProduct(id) {
    this.deleteProductAsync(id).catch((e) => console.warn("Supabase deleteProduct error:", e));
    return true;
  }

  saveCategory(categoryData) {
    this.saveCategoryAsync(categoryData).catch((e) => console.warn("Supabase saveCategory error:", e));
    return categoryData;
  }

  deleteCategory(id) {
    this.deleteCategoryAsync(id).catch((e) => console.warn("Supabase deleteCategory error:", e));
    return true;
  }

  updateOrderStatus(orderId, newStatus, trackingData = {}) {
    this.updateOrderStatusAsync(orderId, newStatus, trackingData).catch((e) => console.warn("Supabase updateOrderStatus error:", e));
    const orders = this.getOrders();
    const ord = orders.find((o) => o.id === orderId);
    if (ord) ord.orderStatus = newStatus;
    return ord;
  }

  createOrder(orderData) {
    const orders = this.getOrders();
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const newOrderId = `SSKW-${randomDigits}`;

    const newOrder = {
      id: newOrderId,
      createdAt: new Date().toISOString(),
      customer: orderData.customer,
      items: orderData.items,
      subtotal: orderData.subtotal,
      discount: orderData.discount || 0,
      shipping: orderData.shipping || 0,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod,
      paymentId: orderData.paymentId || `pay_${Date.now()}`,
      paymentStatus: (orderData.paymentMethod || "").includes("COD") ? "Pending on Delivery" : (orderData.paymentStatus || "Paid"),
      orderStatus: "Processing",
      courier: "Delhivery Express Kota",
      trackingNumber: `DL-${Math.floor(10000000 + Math.random() * 90000000)}`,
      trackingLink: `https://www.delhivery.com/track/package/DL-${Math.floor(10000000 + Math.random() * 90000000)}`
    };

    orders.unshift(newOrder);
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));

    // Decrement stock
    const products = this.getProducts();
    orderData.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.id);
      if (prod && typeof prod.stock === "number") {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    });
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));

    this.recordCustomerPurchase(orderData.customer, orderData.total);
    this.clearCart();
    this.notifyChange("orders");
    this.notifyChange("products");

    // Async push to Supabase in background
    if (isSupabaseConfigured()) {
      this.pushOrderToSupabase(newOrder).catch((e) => console.warn("Supabase order push error:", e));
    }

    return newOrder;
  }

  updateSettings(newSettings) {
    this.updateSettingsAsync(newSettings).catch((e) => console.warn("Supabase updateSettings error:", e));
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(updated));
    this.notifyChange("settings");
    return updated;
  }

  async pushLocalDataToSupabase() {
    if (!isSupabaseConfigured()) {
      return { success: false, message: "Please configure your Supabase Project URL and Anon Key first." };
    }

    const client = await getSupabaseClient();
    if (!client) {
      return { success: false, message: "Could not initialize Supabase client." };
    }

    try {
      // 1. Sync categories
      const categories = this.getCategories();
      for (const cat of categories) {
        if (cat.id === "all") continue;
        await client.from("categories").upsert({
          id: cat.id,
          name: cat.name,
          slug: cat.slug || cat.id,
          description: cat.description || "",
          icon: cat.icon || "sparkles",
          display_order: cat.displayOrder || 1,
          is_active: cat.isActive !== false
        });
      }

      // 2. Sync products
      const products = this.getProducts();
      for (const prod of products) {
        await client.from("products").upsert({
          id: prod.id,
          name: prod.name,
          slug: prod.slug,
          category: prod.category,
          sub_category: prod.subCategory || "casual",
          price: Number(prod.price),
          discount_price: prod.discountPrice ? Number(prod.discountPrice) : null,
          stock: Number(prod.stock || 0),
          badge: prod.badge || null,
          is_new: Boolean(prod.isNew),
          is_bestseller: Boolean(prod.isBestSeller),
          is_featured: Boolean(prod.isFeatured),
          is_active: prod.isActive !== false,
          images: prod.images || [],
          colors: prod.colors || [],
          sizes: prod.sizes || [],
          fabric: prod.fabric || "",
          age_group: prod.ageGroup || "1 to 16 Years",
          comfort_and_styling: prod.comfortAndStyling || "",
          washing_instructions: prod.washingInstructions || "",
          description: prod.description || "",
          rating: Number(prod.rating || 5.0),
          review_count: Number(prod.reviewCount || 1)
        });
      }

      // 3. Sync customers
      const customers = this.getCustomers();
      for (const cust of customers) {
        await client.from("customers").upsert({
          id: cust.id,
          name: cust.name,
          email: cust.email || "",
          phone: cust.phone,
          address: cust.address || "",
          city: cust.city || "Kota",
          state: cust.state || "Rajasthan",
          pincode: cust.pincode || "",
          orders_count: cust.ordersCount || 1,
          total_spent: cust.totalSpent || 0,
          last_order_at: cust.lastOrderAt || new Date().toISOString()
        }, { onConflict: "phone" });
      }

      // 4. Sync orders & items
      const orders = this.getOrders();
      for (const ord of orders) {
        await client.from("orders").upsert({
          id: ord.id,
          customer_name: ord.customer?.name || "Customer",
          customer_email: ord.customer?.email || "",
          customer_phone: ord.customer?.phone || "",
          customer_address: ord.customer?.address || "",
          customer_city: ord.customer?.city || "Kota",
          customer_state: ord.customer?.state || "Rajasthan",
          customer_pincode: ord.customer?.pincode || "",
          subtotal: ord.subtotal || ord.total,
          discount: ord.discount || 0,
          shipping: ord.shipping || 0,
          total: ord.total,
          payment_method: ord.paymentMethod || "Cash on Delivery",
          payment_status: ord.paymentStatus || "Paid",
          payment_id: ord.paymentId || "",
          order_status: ord.orderStatus || "Processing",
          courier: ord.courier || "Delhivery Express Kota",
          tracking_number: ord.trackingNumber || "",
          tracking_link: ord.trackingLink || ""
        });

        if (Array.isArray(ord.items)) {
          for (const it of ord.items) {
            await client.from("order_items").upsert({
              order_id: ord.id,
              product_id: it.id,
              name: it.name,
              price: it.price,
              quantity: it.quantity,
              size: it.size || "",
              color: it.color || "",
              image: it.image || ""
            });
          }
        }
      }

      // 5. Sync settings
      const settings = this.getSettings();
      await this.updateSettingsAsync(settings);

      return {
        success: true,
        message: `Successfully synchronized ${products.length} products, ${categories.length} categories, ${orders.length} orders, and ${customers.length} customers to Supabase Cloud!`
      };
    } catch (err) {
      return { success: false, message: err.message || "Failed to push data to Supabase" };
    }
  }

  /* ------------------- INQUIRIES & CONTACT ------------------- */
  getInquiries() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.INQUIRIES) || "[]");
    } catch {
      return [];
    }
  }

  async getInquiriesAsync() {
    if (isSupabaseConfigured()) {
      const client = await getSupabaseClient();
      if (client) {
        try {
          const { data, error } = await client
            .from("inquiries")
            .select("*")
            .order("created_at", { ascending: false });
          if (!error && Array.isArray(data)) {
            const formatted = data.map((d) => ({
              id: d.id,
              name: d.name,
              phone: d.phone,
              email: d.email || "",
              message: d.message,
              status: d.status || "New",
              createdAt: d.created_at
            }));
            localStorage.setItem(DB_KEYS.INQUIRIES, JSON.stringify(formatted));
            return formatted;
          }
        } catch (e) {
          console.warn("Could not fetch inquiries from Supabase:", e);
        }
      }
    }
    return this.getInquiries();
  }

  async saveInquiry({ name, phone, email = "", message }) {
    const inquiries = this.getInquiries();
    const newInquiry = {
      id: `INQ-${Math.floor(10000 + Math.random() * 90000)}`,
      name: (name || "").trim(),
      phone: (phone || "").trim(),
      email: (email || "").trim(),
      message: (message || "").trim(),
      status: "New",
      createdAt: new Date().toISOString()
    };

    inquiries.unshift(newInquiry);
    localStorage.setItem(DB_KEYS.INQUIRIES, JSON.stringify(inquiries));
    this.notifyChange("inquiries");

    if (isSupabaseConfigured()) {
      const client = await getSupabaseClient();
      if (client) {
        try {
          await client.from("inquiries").insert({
            id: newInquiry.id,
            name: newInquiry.name,
            phone: newInquiry.phone,
            email: newInquiry.email,
            message: newInquiry.message,
            status: newInquiry.status,
            created_at: newInquiry.createdAt
          });
        } catch (e) {
          console.warn("Could not push inquiry to Supabase:", e);
        }
      }
    }

    return { success: true, inquiry: newInquiry };
  }

  /* ------------------- NEWSLETTER SUBSCRIBERS ------------------- */
  getNewsletterSubscribers() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.NEWSLETTER) || "[]");
    } catch {
      return [];
    }
  }

  async saveNewsletterSubscriber(email) {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return { success: false, message: "Please enter a valid email address." };
    }

    const subscribers = this.getNewsletterSubscribers();
    const alreadySubscribed = subscribers.some((s) => s.email === cleanEmail);
    if (alreadySubscribed) {
      return { success: true, message: "You are already subscribed to our newsletter!" };
    }

    const newSub = {
      id: `SUB-${Date.now()}`,
      email: cleanEmail,
      subscribedAt: new Date().toISOString()
    };
    subscribers.unshift(newSub);
    localStorage.setItem(DB_KEYS.NEWSLETTER, JSON.stringify(subscribers));
    this.notifyChange("newsletter");

    if (isSupabaseConfigured()) {
      const client = await getSupabaseClient();
      if (client) {
        try {
          await client.from("newsletter_subscribers").insert({
            email: cleanEmail,
            subscribed_at: newSub.subscribedAt
          });
        } catch (e) {
          console.warn("Could not push newsletter subscriber to Supabase:", e);
        }
      }
    }

    return { success: true, message: "Thank you for subscribing to She & She Kids Wear updates!" };
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
