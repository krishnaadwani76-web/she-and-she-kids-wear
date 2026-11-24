/**
 * She & She Kids Wear - Cloud Backend Configuration
 * Manages Supabase Project URL, Public Anon Key, and Storage configuration.
 *
 * NOTE: For security, only the public `anon` key is used in frontend code.
 * NEVER enter or expose the `service_role` secret key or database password here.
 */

const STORAGE_KEY_CONFIG = "sskw_supabase_config_v1";

// Default placeholder or environment config
export const DEFAULT_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: "",
  storageBucket: "product-images"
};

/**
 * Get active Supabase configuration (checks localStorage first, then default)
 */
export function getSupabaseConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.supabaseUrl && parsed.supabaseAnonKey) {
        return {
          supabaseUrl: parsed.supabaseUrl.trim(),
          supabaseAnonKey: parsed.supabaseAnonKey.trim(),
          storageBucket: parsed.storageBucket || "product-images"
        };
      }
    }
  } catch (e) {
    console.warn("Could not read Supabase config from storage", e);
  }

  // Check window.__ENV__ if injected by hosting environment
  if (typeof window !== "undefined" && window.__ENV__) {
    if (window.__ENV__.SUPABASE_URL && window.__ENV__.SUPABASE_ANON_KEY) {
      return {
        supabaseUrl: window.__ENV__.SUPABASE_URL.trim(),
        supabaseAnonKey: window.__ENV__.SUPABASE_ANON_KEY.trim(),
        storageBucket: window.__ENV__.STORAGE_BUCKET || "product-images"
      };
    }
  }

  return DEFAULT_CONFIG;
}

/**
 * Save new Supabase credentials from the Admin Dashboard
 */
export function saveSupabaseConfig(url, anonKey, bucket = "product-images") {
  const config = {
    supabaseUrl: (url || "").trim(),
    supabaseAnonKey: (anonKey || "").trim(),
    storageBucket: (bucket || "product-images").trim()
  };
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  window.dispatchEvent(new CustomEvent("sskw:configchange", { detail: config }));
  return config;
}

/**
 * Remove saved credentials
 */
export function clearSupabaseConfig() {
  localStorage.removeItem(STORAGE_KEY_CONFIG);
  window.dispatchEvent(new CustomEvent("sskw:configchange", { detail: DEFAULT_CONFIG }));
}

/**
 * Check if Supabase connection details are present
 */
export function isSupabaseConfigured() {
  const config = getSupabaseConfig();
  return Boolean(
    config.supabaseUrl &&
    config.supabaseAnonKey &&
    config.supabaseUrl.startsWith("https://") &&
    config.supabaseAnonKey.length > 20
  );
}
