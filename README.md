# She & She Kids Wear — E-Commerce Website & Admin Control Center

> **"Making Every Childhood More Stylish"**  
> Premium, comfortable, and affordable clothing for children aged 1–16 years.  
> **Physical Boutique:** Plot 14, Main Dadabari Circle, Dadabari, Kota, Rajasthan - 324009, India.  
> **Live Website:** [https://krishnaadwani76-web.github.io/she-and-she-kids-wear/](https://krishnaadwani76-web.github.io/she-and-she-kids-wear/)  
> **Admin Dashboard:** [https://krishnaadwani76-web.github.io/she-and-she-kids-wear/admin.html](https://krishnaadwani76-web.github.io/she-and-she-kids-wear/admin.html)

---

## 🌸 Brand Overview & Architecture

**She & She Kids Wear** is a full-featured e-commerce platform and back-office management system designed for a premier Indian kidswear brand in Dadabari, Kota.

### 🎨 Visual & Palette Identity
* **Soft Pastel Pink (`#FCE7F3`, `#FDF2F8`)**: Warm, gentle aesthetic representing innocent childhood joy.
* **Warm Cream & Off-White (`#FFFDF7`, `#FEF9C3`)**: Clean, luxurious backdrop enhancing product clarity.
* **Light Peach (`#FFE4E6`, `#FFF1F2`)**: Friendly accents for badges, chips, and micro-interactions.
* **Deep Royal Rose (`#BE185D`, `#DB2777`)**: High-contrast, accessible primary buttons, badges, and CTAs.
* **Typography**:
  * Headings: *Playfair Display* (Editorial luxury serif).
  * Interface & Descriptions: *Plus Jakarta Sans* (Clean modern geometry).

---

## 🔐 Complete Backend & Admin Dashboard

The application features a dedicated, standalone **Admin Control Center** accessible via `/admin.html` or through the storefront footer and top navigation (`#admin`).

### 1. 🛡️ Admin Authentication & Security
* **Authentication**: Email and password credentials with session expiration and route protection.
* **Default Store Credentials**:
  * **Email**: `admin@sheandshe.com`
  * **Password**: `admin123`
* **Route Protection**: Direct access to `/admin.html` requires administrator authentication before dashboard data is displayed.
* **Cloud Auth**: Seamlessly integrates with Supabase Auth (`supabase.auth.signInWithPassword`).

### 2. 📊 Store Dashboard Overview
* **KPI Metrics**: Total Sales Revenue (₹), Total Orders, Pending Orders (requiring fulfillment), Active Catalog Products, and Low Stock inventory alerts (< 5 items).
* **Recent Orders Table**: Quick view of recent customer purchases with instant order status update controls.
* **System Status**: Displays live Supabase Cloud connection or offline Local Storage fallback.

### 3. 👗 Product Management & Direct Photo Uploads
* **Direct Image Upload**: Select images directly from your computer (Drag-and-drop or file picker).
* **Automatic Performance Optimization**: High-resolution camera photos are automatically scaled and compressed using an in-memory Canvas to ensure fast loading speeds on mobile devices.
* **Cloud Storage**: Uploads photos to the Supabase Cloud Storage bucket (`product-images`) and generates permanent CDN links.
* **Full Product CRUD**: Add, edit, and delete products with real-time updates on the storefront.
* **Product Details**: Name, regular MRP, discounted selling price, inventory stock, badges (e.g. *Bestseller*, *Trending*), fabric details, age group, comfort & styling, and washing instructions.
* **Age Sizes (1–16 Years)**: Selectable checkboxes for:
  `1-2Y`, `2-3Y`, `3-4Y`, `4-5Y`, `5-6Y`, `7-8Y`, `9-10Y`, `11-12Y`, `13-14Y`, `15-16Y`.
* **Colour Swatches**: Add color swatches with built-in color picker and matching image assignments.
* **Catalog Visibility**: 1-click enable/disable toggle to hide out-of-season or archived products from customers.

### 4. 🏷️ Dynamic Category Management
* Add, edit, and delete product categories directly from the admin panel without editing code.
* Built-in support for:
  * **Girls Wear** (Frocks, Anarkalis, Twirl Dresses)
  * **Boys Wear** (Kurtas, Nehru Jackets, Linen Shirts, Tuxedos)
  * **Born Baby** (Hypoallergenic Organic Essentials for 0-12 Months)
  * **Baby Wear** (Muslin Rompers, Sleepsuits for 1-3 Years)
  * **Party Wear** (Festive Brocade, Tuxedos, Birthday Gowns)
  * **Casual Wear** (Play Suits, Dungarees, Cotton Sets)
  * **New Arrivals** & **Sale / Offers**

### 5. 📦 Order Fulfillment & Shipment Tracking
* View complete customer details: Full Name, Phone, Email, Delivery Address, City, State, and PIN code.
* View itemized order summary: Product name, size, selected color, quantity, and line-item total.
* **Order Status Workflow**:
  `Pending` → `Confirmed` → `Processing` → `Shipped` → `Delivered` → `Cancelled`.
* **Courier & Tracking Details**: Add courier partner name (e.g., Delhivery, BlueDart, DTDC), AWB tracking number, and tracking link for customer order tracking.

### 6. 🎨 Website Content Management
Store owners can update all website content in real time from the admin panel:
* **Homepage Banner**: Update banner image URL or upload new banner photos.
* **Headings & Subtitles**: Update headline, subheading, and promotional badges.
* **Announcement Bar**: Edit the top notification banner and set free delivery thresholds.
* **Store Contact Details**: Update phone number, WhatsApp customer care number, and email.
* **Store Location**: Edit Dadabari Kota address and Google Maps directions link.
* **Policies**: Edit 7-day return policy, shipping timelines, and About Us story.

---

## ☁️ Supabase Database & Cloud Storage Setup

The project includes production-ready database definitions in `schema.sql`.

### Quick Setup Steps:
1. Sign up for a free account at [https://supabase.com](https://supabase.com) and create a **New Project**.
2. Open the **SQL Editor** from your Supabase Project Dashboard.
3. Open `schema.sql` from this repository, copy all contents, paste into the SQL editor, and click **RUN**.
   * Creates the `categories`, `products`, `customers`, `orders`, `order_items`, and `site_settings` tables.
   * Configures Row Level Security (RLS) policies.
   * Sets up the `product-images` storage bucket.
   * Inserts the initial seed kidswear products and store settings.
4. Go to **Project Settings → API** and copy:
   * **Project URL** (e.g., `https://xyzcompany.supabase.co`)
   * **anon / public key** (e.g., `eyJhbGciOiJIUzI1Ni...`)
5. Open your Admin Dashboard at `/admin.html`, go to the **Cloud & Supabase Setup** tab, paste the Project URL and Anon Key, and click **Save Credentials**.
6. Click **Test Live Connection** to verify your database connection.
7. Click **Sync Local Catalog to Supabase Database** to push all initial products and categories to your cloud database in one click!

> 🔒 **Security Notice:** Frontend code and GitHub only use the public `anon` key. Never expose your `service_role` secret key or PostgreSQL database password in frontend code or repository commits.

---

## 💻 Local Development

### Option 1: PowerShell Local Server (Windows)
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
Opens the storefront at `http://localhost:3000/` and admin portal at `http://localhost:3000/admin.html`.

### Option 2: Live Server or Any Static Host
Serve the project directory using VS Code Live Server, Python (`python -m http.server 3000`), or Node (`npx serve .`).

---

## 📦 Deployment

The project is structured as a modern static web application compatible with:
* **GitHub Pages**: Deployed automatically from the `main` branch.
* **Netlify**: Configured via `netlify.toml`.
* **Vercel**: Configured via `vercel.json`.

---

© 2026 **She & She Kids Wear**. All Rights Reserved. Dadabari, Kota, Rajasthan, India.
