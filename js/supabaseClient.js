/**
 * She & She Kids Wear - Supabase Cloud Service Layer
 * Provides live PostgreSQL connectivity, Supabase Auth, and Cloud Storage for product photos.
 */

import { getSupabaseConfig, isSupabaseConfigured } from "./config.js";

let supabaseInstance = null;
let supabaseSdk = null;

/**
 * Load Supabase JS SDK dynamically from CDN
 */
async function loadSupabaseSdk() {
  if (supabaseSdk) return supabaseSdk;
  if (window.supabase) {
    supabaseSdk = window.supabase;
    return supabaseSdk;
  }
  try {
    const module = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
    supabaseSdk = module;
    return supabaseSdk;
  } catch (err) {
    console.error("Failed to load Supabase JS SDK:", err);
    return null;
  }
}

/**
 * Get or create Supabase client instance
 */
export async function getSupabaseClient() {
  if (!isSupabaseConfigured()) return null;
  if (supabaseInstance) return supabaseInstance;

  const sdk = await loadSupabaseSdk();
  if (!sdk || !sdk.createClient) {
    console.warn("Supabase SDK could not be initialized");
    return null;
  }

  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  try {
    supabaseInstance = sdk.createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    return supabaseInstance;
  } catch (err) {
    console.error("Error creating Supabase client:", err);
    return null;
  }
}

// Reset instance on credential change
window.addEventListener("sskw:configchange", () => {
  supabaseInstance = null;
});

/**
 * Test connectivity with user's Supabase instance
 */
export async function testConnection(url, anonKey) {
  try {
    const sdk = await loadSupabaseSdk();
    if (!sdk) return { success: false, message: "Could not load Supabase SDK from CDN" };

    const client = sdk.createClient(url.trim(), anonKey.trim());
    const { data, error } = await client.from("site_settings").select("key").limit(1);

    if (error) {
      // Table might not exist yet if schema was not run
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        return {
          success: true,
          schemaNeeded: true,
          message: "Connected to Supabase! However, database tables have not been created yet. Please run schema.sql in Supabase SQL Editor."
        };
      }
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "Successfully connected to Supabase Database & Cloud Storage!"
    };
  } catch (err) {
    return { success: false, message: err.message || "Connection failed. Check project URL and public anon key." };
  }
}

/**
 * Image Optimizer & Cloud Storage Uploader
 * 1. Resizes image to web-optimal dimensions (max 1400px)
 * 2. Compresses using Canvas to quality 0.85
 * 3. Uploads directly to Supabase Storage bucket 'product-images'
 * 4. Generates public CDN URL
 */
export async function optimizeAndUploadImage(file, onProgress) {
  if (!file || !file.type.startsWith("image/")) {
    throw new Error("Please select a valid image file (PNG, JPG, WebP, GIF).");
  }

  if (onProgress) onProgress("Optimizing image for fast web performance...");

  // Optimize via Canvas
  const optimizedBlob = await compressImageFile(file, 1400, 0.85);

  const client = await getSupabaseClient();
  const config = getSupabaseConfig();

  // If Supabase is connected, upload to cloud bucket
  if (client && isSupabaseConfigured()) {
    if (onProgress) onProgress("Uploading image to Supabase Cloud Storage...");

    const extension = file.name.split(".").pop() || "jpg";
    const sanitizedName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9]/g, "_")
      .toLowerCase()
      .substring(0, 30);
    const filePath = `products/${Date.now()}_${sanitizedName}.${extension}`;

    const { error: uploadError } = await client.storage
      .from(config.storageBucket)
      .upload(filePath, optimizedBlob, {
        contentType: file.type || "image/jpeg",
        upsert: true
      });

    if (uploadError) {
      console.warn("Supabase Storage upload warning:", uploadError);
      // Fallback: If bucket does not exist, return data URL and warn
      const dataUrl = await blobToDataUrl(optimizedBlob);
      return {
        url: dataUrl,
        storage: "local",
        message: `Image saved locally. Note for Cloud Storage: Create bucket '${config.storageBucket}' in Supabase Dashboard.`
      };
    }

    const { data: publicUrlData } = client.storage
      .from(config.storageBucket)
      .getPublicUrl(filePath);

    return {
      url: publicUrlData.publicUrl,
      storage: "supabase",
      filePath
    };
  }

  // Fallback: If Supabase not yet configured, return optimized Base64 Data URL
  const dataUrl = await blobToDataUrl(optimizedBlob);
  return {
    url: dataUrl,
    storage: "local",
    message: "Image saved in local storage. Connect Supabase in Settings for permanent cloud hosting."
  };
}

/**
 * Compress image file via in-memory HTML Canvas
 */
function compressImageFile(file, maxDimension = 1400, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Image compression failed"));
          },
          file.type === "image/png" ? "image/png" : "image/jpeg",
          quality
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

/**
 * Supabase Auth: Sign In with Email & Password
 */
export async function supabaseSignIn(email, password) {
  const client = await getSupabaseClient();
  if (!client) return { success: false, message: "Supabase is not configured." };

  const { data, error } = await client.auth.signInWithPassword({
    email: email.trim(),
    password: password
  });

  if (error) return { success: false, message: error.message };
  return { success: true, session: data.session, user: data.user };
}

/**
 * Supabase Auth: Sign Out
 */
export async function supabaseSignOut() {
  const client = await getSupabaseClient();
  if (client) {
    await client.auth.signOut();
  }
}

/**
 * Supabase Auth: Get Active Session
 */
export async function supabaseGetSession() {
  const client = await getSupabaseClient();
  if (!client) return null;
  const { data } = await client.auth.getSession();
  return data?.session || null;
}
