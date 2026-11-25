/**
 * She & She Kids Wear - Runtime Environment Configuration
 *
 * This file is loaded by index.html and admin.html before the main application modules.
 * Set your live Supabase cloud project credentials here to automatically connect
 * all visitors, customers, and devices to your centralized backend database.
 */
window.__ENV__ = window.__ENV__ || {
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: "",
  STORAGE_BUCKET: "product-images"
};
