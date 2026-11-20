# She & She Kids Wear — E-Commerce Website & Brand Portal

> **"Making Every Childhood More Stylish"**  
> Premium, comfortable, and affordable clothing for children aged 1–16 years.  
> **Flagship Boutique:** Plot 14, Main Dadabari Circle, Dadabari, Kota, Rajasthan - 324009, India.

---

## 🌸 Brand Overview & Design System

**She & She Kids Wear** is an Indian children's fashion e-commerce platform designed for parents seeking royal festive wear, elegant birthday frocks, dapper kurta-jacket sets, and breathable organic everyday playwear.

### 🎨 Visual & Palette Identity
* **Soft Pastel Pink (`#FCE7F3`, `#FDF2F8`)**: Warm, gentle aesthetic representing innocent childhood joy.
* **Warm Cream & Off-White (`#FFFDF7`, `#FEF9C3`)**: Clean backdrop enhancing product color clarity.
* **Light Peach (`#FFE4E6`, `#FFF1F2`)**: Friendly accents for badges, chips, and micro-interactions.
* **Deep Royal Rose (`#BE185D`, `#DB2777`)**: High-contrast, accessible primary buttons, badges, and CTAs.
* **Typography**:
  * Headings: *Playfair Display* (Editorial luxury serif).
  * Interface & Descriptions: *Plus Jakarta Sans* (Clean, modern geometry).

---

## 🚀 Key Features

### 1. 🛍️ Comprehensive Product Catalog & Categories
* **Boys Wear**: Slub Chanderi Kurtas with floral Nehru jackets, European linen shirts, velvet bandhgala tuxedos, and dungarees.
* **Girls Wear**: French tulle princess frocks, Bandhani & Gota Patti Anarkali suits, floral tiered dresses, and Banarasi brocade lehengas.
* **Baby Wear (1–3 Years)**: 4-layer GOTS organic muslin rompers with bonnets, soft sleepsuits with fold-over scratch mittens.
* **Party Wear**: Red-carpet velvets, sequin-embroidered frocks, and festive ethnic wear.
* **Casual Wear**: Breathable combed cotton playsuits, summer shorts, and cozy bear fleece sets.
* **Special Highlights**: New Arrivals, Best Sellers, and Limited Festive Offers.

### 2. 📏 Comprehensive Sizing (1–16 Years)
Full support for 10 age-based sizes:
* **1–2 Years** • **2–3 Years** • **3–4 Years** • **4–5 Years** • **5–6 Years**
* **7–8 Years** • **9–10 Years** • **11–12 Years** • **13–14 Years** • **15–16 Years**
* Interactive **Size Chart Modal** displaying chest, dress length, waist, and child height in both cm and inches.

### 3. 🎨 Color Swatches & Dynamic Switching
* Interactive color swatches update the active photo preview on product cards and modals.
* Selected color name and size are accurately preserved in the cart and order invoice.

### 4. 🛒 Shopping Cart & Free Delivery Meter
* Slide-out cart drawer with real-time quantity adjusters (`+`/`-`) and item deletion.
* Dynamic **Free Shipping Progress Bar** (Free delivery unlocked above ₹999).
* Coupon system:
  * `FIRSTKID`: Flat 15% OFF for new parents.
  * `KIDSWEAR10`: Flat 10% OFF on all items.
  * `KOTA500`: ₹500 OFF on orders above ₹2,500.

### 5. 💳 Checkout & Razorpay Payment Gateway (Test Mode)
* Complete delivery address form with Indian state selection and 6-digit PIN code validation.
* Multiple payment methods:
  * **Online Payment Gateway (Razorpay)**: Integrates the official Razorpay Checkout SDK with test mode support for UPI, Cards, and Netbanking.
  * **Cash on Delivery (COD)**: Available for all Indian PIN codes.
  * **Direct Store UPI**: Instant payment verification to the Dadabari Kota store.
* Print-ready confirmation receipt with unique Order ID (e.g. `SSKW-84920`).

### 6. 📦 Live Order Tracking
* Search by **Order ID** or **Customer Phone Number**.
* 4-stage tracking journey:
  1. Order Placed
  2. Processing & Packed at Dadabari Store
  3. Dispatched / In Transit via BlueDart Express / Delhivery
  4. Out for Delivery & Delivered

### 7. 📍 Dadabari, Kota Boutique & Contact Section
* Embedded Google Map centered on Dadabari, Kota.
* One-click "Get Directions" button.
* Floating WhatsApp customer support button.
* Active inquiry form for custom party wear or sizing advice.

### 8. 🔐 Full Store Admin Dashboard
* **Default Admin Credentials**:
  * Email: `admin@sheandshe.com`
  * Password: `admin123`
* **Features**:
  * Real-time metrics: Revenue, Orders Count, Product Count, and Low Stock Alerts.
  * Product CRUD: Add new outfits with image URL, edit descriptions, adjust prices, and toggle sizes.
  * Order Management: Change status (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
  * Customer Directory: View customer lifetime spend and past order counts.
  * Gateway Configuration: Configure custom Razorpay Key ID (`rzp_test_...` or live key).
  * Data Backup: One-click JSON database export and factory reset.

---

## 💻 How to Run the Website

### Option 1: Using the PowerShell Web Server (Recommended on Windows)
1. Right-click `server.ps1` and select **Run with PowerShell**, or run in terminal:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\server.ps1
   ```
2. The browser will automatically open: `http://localhost:3000/`

### Option 2: Direct Browser Launch
Open `index.html` directly in any web browser (Google Chrome, Microsoft Edge, Firefox, Safari).

### Option 3: VS Code / Live Server
Right-click `index.html` and click **Open with Live Server**.

---

## 🌐 Deploying to Production & Connecting a Custom Domain

### Deploying to Netlify (1-Click)
1. Push this folder to a GitHub repository.
2. Sign in to [Netlify](https://www.netlify.com).
3. Click **Add new site** → **Import an existing project** from GitHub.
4. Set Publish Directory to `.` (root).
5. Click **Deploy Site**.

### Connecting a Custom Domain (e.g. `sheandshekidswear.com`)
1. In the Netlify / Vercel dashboard, go to **Domain management** → **Add custom domain**.
2. Enter your domain: `sheandshekidswear.com`.
3. Update DNS records at your domain registrar (GoDaddy, Hostinger, Namecheap):
   * `CNAME` for `www` pointing to your deployment URL.
   * `A` record pointing to the hosting IP address.
4. Automatic free SSL certificates (HTTPS) will be provisioned.

---

## 🔑 Razorpay Payment Gateway Setup Guide

1. Create a free account at [Razorpay](https://razorpay.com).
2. Go to **Settings** → **API Keys** → Generate **Test Key ID**.
3. Log in to the She & She Admin Panel (`admin@sheandshe.com` / `admin123`).
4. Go to **Gateway & Settings** tab and paste your `rzp_test_xxxxxxxx` key into the **Razorpay Key ID** field.
5. Save settings. All checkout transactions will now use your own Razorpay test account!
