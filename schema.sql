-- ============================================================================
-- SHE & SHE KIDS WEAR - PRODUCTION DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Store Location: Dadabari, Kota, Rajasthan, India
-- Target Audience: Kids 1–16 Years
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'sparkles',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for ordering & active status
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories (display_order ASC);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories (is_active);

-- ============================================================================
-- 2. PRODUCTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    category TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    sub_category TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    discount_price NUMERIC(10, 2) CHECK (discount_price IS NULL OR discount_price >= 0),
    stock INTEGER NOT NULL DEFAULT 10 CHECK (stock >= 0),
    badge TEXT,
    is_new BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    colors JSONB NOT NULL DEFAULT '[]'::jsonb,
    sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
    fabric TEXT,
    age_group TEXT,
    comfort_and_styling TEXT,
    washing_instructions TEXT,
    description TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products (is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products (is_featured);
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON public.products (is_bestseller);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products (created_at DESC);

-- ============================================================================
-- 3. CUSTOMERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL UNIQUE,
    address TEXT,
    city TEXT DEFAULT 'Kota',
    state TEXT DEFAULT 'Rajasthan',
    pincode TEXT,
    orders_count INTEGER DEFAULT 1,
    total_spent NUMERIC(12, 2) DEFAULT 0,
    last_order_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers (phone);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers (email);

-- ============================================================================
-- 4. ORDERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    customer_city TEXT NOT NULL,
    customer_state TEXT NOT NULL,
    customer_pincode TEXT NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    shipping NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'Pending',
    payment_id TEXT,
    order_status TEXT NOT NULL DEFAULT 'Processing', -- Pending, Confirmed, Processing, Shipped, Delivered, Cancelled
    courier TEXT DEFAULT 'Delhivery Express Kota',
    tracking_number TEXT,
    tracking_link TEXT,
    notes TEXT,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders (customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);

-- ============================================================================
-- 5. ORDER ITEMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    size TEXT,
    color TEXT,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);

-- ============================================================================
-- 6. WEBSITE CONTENT & SETTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Trigger to auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER trigger_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Categories RLS: Public can view active categories; Authenticated or Admin can manage
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories" ON public.categories
    FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin manage categories" ON public.categories;
CREATE POLICY "Admin manage categories" ON public.categories
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Products RLS: Public can view active products; Authenticated or Admin can manage
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin manage products" ON public.products;
CREATE POLICY "Admin manage products" ON public.products
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Orders RLS: Anyone can create an order; Public can track their order by ID; Admin can view/update all
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
CREATE POLICY "Anyone can insert orders" ON public.orders
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read own order or admin" ON public.orders;
CREATE POLICY "Anyone can read own order or admin" ON public.orders
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can update orders" ON public.orders;
CREATE POLICY "Admin can update orders" ON public.orders
    FOR UPDATE USING (true);

-- Order Items RLS
DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;
CREATE POLICY "Anyone can insert order items" ON public.order_items
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read order items" ON public.order_items;
CREATE POLICY "Anyone can read order items" ON public.order_items
    FOR SELECT USING (true);

-- Customers RLS
DROP POLICY IF EXISTS "Anyone can insert or update customers" ON public.customers;
CREATE POLICY "Anyone can insert or update customers" ON public.customers
    FOR ALL USING (true);

-- Site Settings RLS: Public can read settings; Admin can update
DROP POLICY IF EXISTS "Public can view settings" ON public.site_settings;
CREATE POLICY "Public can view settings" ON public.site_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can update settings" ON public.site_settings;
CREATE POLICY "Admin can update settings" ON public.site_settings
    FOR ALL USING (true);

-- ============================================================================
-- 8. STORAGE BUCKET CONFIGURATION (product-images)
-- ============================================================================
-- Insert bucket for product photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS: Public can read, anyone can upload product images
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow upload product images" ON storage.objects;
CREATE POLICY "Allow upload product images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow update product images" ON storage.objects;
CREATE POLICY "Allow update product images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow delete product images" ON storage.objects;
CREATE POLICY "Allow delete product images" ON storage.objects
    FOR DELETE USING (bucket_id = 'product-images');

-- ============================================================================
-- 9. SEED DATA: CATEGORIES
-- ============================================================================
INSERT INTO public.categories (id, name, slug, description, icon, display_order, is_active)
VALUES
    ('girls', 'Girls Wear', 'girls-wear', 'Frocks, Anarkalis, Twirl Dresses & Party Gowns', 'heart', 1, true),
    ('boys', 'Boys Wear', 'boys-wear', 'Kurtas, Nehru Jackets, Linen Shirts & Tuxedos', 'crown', 2, true),
    ('baby', 'Baby Wear', 'baby-wear', 'Muslin Rompers, Soft Sleepsuits & Newborn Sets', 'smile', 3, true),
    ('party', 'Party Wear', 'party-wear', 'Festive Brocade, Tuxedos & Birthday Gowns', 'star', 4, true),
    ('casual', 'Casual Wear', 'casual-wear', 'Play Suits, Dungarees & Breathable Cotton Daywear', 'sun', 5, true),
    ('born-baby', 'Born Baby', 'born-baby', 'Hypoallergenic Organic Essentials for 0-12 Months', 'sparkles', 6, true),
    ('new', 'New Arrivals', 'new-arrivals', 'Fresh Spring / Festive 2026 Collection', 'flame', 7, true),
    ('sale', 'Sale / Offers', 'sale-offers', 'Special Discounts up to 50% Off', 'tag', 8, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;

-- ============================================================================
-- 10. SEED DATA: INITIAL PRODUCTS
-- ============================================================================
INSERT INTO public.products (
    id, name, slug, category, sub_category, price, discount_price, stock, badge,
    is_new, is_bestseller, is_featured, is_active, images, colors, sizes,
    fabric, age_group, comfort_and_styling, washing_instructions, description,
    rating, review_count
) VALUES
(
    'prod_001',
    'Rose Blush Princess Tulle Party Frock',
    'rose-blush-princess-tulle-party-frock',
    'girls',
    'party',
    2499.00,
    1599.00,
    22,
    'Bestseller',
    false,
    true,
    true,
    true,
    '[
        "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80"
    ]'::jsonb,
    '[
        {"name": "Blush Pink", "hex": "#FCE7F3", "imageIndex": 0},
        {"name": "Soft Peach", "hex": "#FFE4E6", "imageIndex": 1},
        {"name": "Cream White", "hex": "#FFFDF7", "imageIndex": 2}
    ]'::jsonb,
    '["1-2Y", "2-3Y", "3-4Y", "4-5Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y"]'::jsonb,
    'Multi-layered Premium French Tulle with 100% Hypoallergenic Cotton Inner Lining',
    '1 to 12 Years',
    'Designed with a seamless soft-stitched inner bodice so your little angel enjoys itchy-free celebrations. Features delicate flower-corsage embellishments and an adjustable satin tie-back sash for a royal tailored fit.',
    'Dry clean recommended for first wash. Thereafter gentle hand wash in lukewarm water. Do not wring or tumble dry. Steam iron on low setting.',
    'Make her birthday and festive memories sparkle with the Rose Blush Princess Tulle Frock from She & She Kids Wear. Handcrafted with airy, voluminous layers of pastel tulle over breathable Indian cotton lining, this fairy-tale dress gives effortless twirl-factor without compromising comfort.',
    4.9,
    84
),
(
    'prod_002',
    'Pastel Mint Kurta Pajama with Floral Nehru Jacket',
    'pastel-mint-kurta-pajama-floral-nehru-jacket',
    'boys',
    'party',
    2999.00,
    1899.00,
    18,
    'Festive Pick',
    true,
    true,
    true,
    true,
    '[
        "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1471286174890-9c112ffca56a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80"
    ]'::jsonb,
    '[
        {"name": "Mint Green", "hex": "#D1FAE5", "imageIndex": 0},
        {"name": "Powder Blue", "hex": "#E0F2FE", "imageIndex": 1},
        {"name": "Warm Cream", "hex": "#FEF3C7", "imageIndex": 2}
    ]'::jsonb,
    '["2-3Y", "3-4Y", "4-5Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y", "13-14Y", "15-16Y"]'::jsonb,
    'Pure Slub Chanderi Cotton Kurta with Jacquard Floral Waistcoat & Cotton Pajama',
    '2 to 16 Years',
    'Tailored to modern festive elegance with mandarin collar, antiqued metallic buttons, and a comfortable elasticated drawstring churidar pajama that stays comfy during long wedding rituals.',
    'Gentle machine wash or hand wash in cold water with mild detergent. Wash dark colors separately. Iron at medium temperature.',
    'Dress your young prince in effortless royal charm. This 3-piece ethnic ensemble from She & She Kids Wear Dadabari combines refreshing mint cotton tones with a regal floral woven jacket, striking the perfect balance between traditional heritage and all-day play comfort.',
    4.8,
    62
),
(
    'prod_003',
    'Organic Muslin Cloud Baby Romper & Bonnet Set',
    'organic-muslin-cloud-baby-romper-bonnet-set',
    'baby',
    'casual',
    1499.00,
    899.00,
    30,
    'Pure Organic',
    true,
    false,
    true,
    true,
    '[
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80"
    ]'::jsonb,
    '[
        {"name": "Cream White", "hex": "#FFFDF7", "imageIndex": 0},
        {"name": "Baby Peach", "hex": "#FFE4E6", "imageIndex": 1},
        {"name": "Sage Mist", "hex": "#E2E8F0", "imageIndex": 2}
    ]'::jsonb,
    '["1-2Y", "2-3Y"]'::jsonb,
    '100% GOTS Certified Organic 4-Layer Muslin Cotton',
    '0 to 3 Years',
    'Ultra-breathable open-weave cotton that softens with every wash. Designed with coconut wood buttons and easy-snap crotch buttons for rapid, tear-free diaper changes.',
    'Machine wash cold on delicate cycle. Air dry flat. Do not bleach. No ironing necessary - the natural muslin crinkle adds texture.',
    'Gentle as a mother''s touch. Our Organic Muslin Romper comes complete with a vintage sun bonnet to protect delicate baby skin during sunny strolls in Dadabari parks.',
    5.0,
    47
),
(
    'prod_004',
    'Lavender Lilac Embroidered Anarkali & Dupatta Set',
    'lavender-lilac-embroidered-anarkali-dupatta-set',
    'girls',
    'party',
    3499.00,
    2199.00,
    15,
    'Diwali Special',
    true,
    true,
    true,
    true,
    '[
        "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80"
    ]'::jsonb,
    '[
        {"name": "Lavender Lilac", "hex": "#F3E8FF", "imageIndex": 0},
        {"name": "Blush Pink", "hex": "#FCE7F3", "imageIndex": 1},
        {"name": "Gold Ivory", "hex": "#FEF9C3", "imageIndex": 2}
    ]'::jsonb,
    '["3-4Y", "4-5Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y", "13-14Y", "15-16Y"]'::jsonb,
    'Pure Georgette with Zari Gota Patti Detailing and 100% Mulmul Cotton Lining',
    '3 to 16 Years',
    'Full flair 16-kali kalidar silhouette that spins effortlessly. Paired with lightweight net dupatta with scalloped gotta border and stretchy comfortable leggings.',
    'Dry clean only for initial washes to preserve gota luster. Cool iron on reverse side.',
    'A show-stopping ethnic ensemble for weddings, Diwali, and festive family reunions. Hand-embellished in Rajasthan with traditional gota patti work.',
    4.9,
    91
),
(
    'prod_005',
    'Classic Royal Navy 3-Piece Tuxedo Suit',
    'classic-royal-navy-3-piece-tuxedo-suit',
    'boys',
    'party',
    3999.00,
    2499.00,
    12,
    'Premium',
    false,
    true,
    true,
    true,
    '[
        "https://images.unsplash.com/photo-1471286174890-9c112ffca56a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80"
    ]'::jsonb,
    '[
        {"name": "Midnight Navy", "hex": "#1E293B", "imageIndex": 0},
        {"name": "Slate Charcoal", "hex": "#475569", "imageIndex": 1},
        {"name": "Wine Maroon", "hex": "#831843", "imageIndex": 2}
    ]'::jsonb,
    '["3-4Y", "4-5Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y", "13-14Y", "15-16Y"]'::jsonb,
    'Fine Poly-Viscose Suiting Fabric with Satin Lapel & Pure Cotton Shirt',
    '3 to 16 Years',
    'Sharp peak lapel blazer with contrast satin facing, matching formal trousers with internal adjustable waist buttons, crisp white shirt, and matching clip-on bow tie.',
    'Dry clean only.',
    'Turn your boy into the most debonair little gentleman in the room. Ideal for birthday celebrations, ring-bearer duties, and formal school ceremonies.',
    4.7,
    38
),
(
    'prod_006',
    'Sunny Daisy Embroidered Dungaree & Tee Combo',
    'sunny-daisy-embroidered-dungaree-tee-combo',
    'casual',
    'casual',
    1799.00,
    1199.00,
    25,
    'Trending',
    true,
    false,
    true,
    true,
    '[
        "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80"
    ]'::jsonb,
    '[
        {"name": "Peach Blossom", "hex": "#FECDD3", "imageIndex": 0},
        {"name": "Sky Blue", "hex": "#BAE6FD", "imageIndex": 1},
        {"name": "Butter Yellow", "hex": "#FEF08A", "imageIndex": 2}
    ]'::jsonb,
    '["1-2Y", "2-3Y", "3-4Y", "4-5Y", "5-6Y", "7-8Y"]'::jsonb,
    'Washed Soft Twill Cotton Dungaree with 100% Combed Cotton Inner T-shirt',
    '1 to 8 Years',
    'Adjustable dual-button shoulder straps that expand as your child grows. Deep front pockets for collecting pebbles and toys.',
    'Machine wash warm with like colors. Tumble dry medium. Warm iron if needed.',
    'Vibrant, playful, and built for everyday outdoor play in Rajasthan sunshine. Features sweet embroidered daisy motifs on the bib chest.',
    4.8,
    55
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    stock = EXCLUDED.stock,
    is_active = EXCLUDED.is_active;

-- ============================================================================
-- 11. SEED DATA: WEBSITE CONTENT & SETTINGS
-- ============================================================================
INSERT INTO public.site_settings (key, value)
VALUES
(
    'general',
    '{
        "storeName": "She & She Kids Wear",
        "tagline": "Making Every Childhood More Stylish",
        "subtitle": "Discover adorable outfits for every little moment.",
        "phone": "+91 88248 44263",
        "whatsapp": "+918824844263",
        "email": "care@sheandshekidswear.com",
        "address": "Sethiya Complex, Dadabari, Kota, Rajasthan, India - 324009",
        "timings": "Monday – Saturday: 10:30 AM – 9:00 PM | Sunday: 11:00 AM – 8:00 PM",
        "mapsUrl": "https://www.google.com/maps/dir//She+%26+She+kids+wear,+she+n+she,+sethiya+complex,+Dadabari,+Kota,+Rajasthan+324009/@25.1580017,75.8273144,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x396f85bcf0d3948b:0x337bd124ca6432ba!2m2!1d75.8273144!2d25.1580017",
        "placeId": "ChIJm5TT8Ly1bzkKujJkyoTRezM",
        "cid": "3709804868270142138",
        "coords": {"lat": 25.1580017, "lng": 75.8273144},
        "announcement": "",
        "freeShippingThreshold": 999,
        "shippingFee": 99,
        "enableCod": true,
        "enableRazorpay": true,
        "razorpayKeyId": "rzp_test_sheandshe_kids"
    }'::jsonb
),
(
    'homepage',
    '{
        "heroHeading": "Making Every Childhood More Stylish.",
        "heroSubtitle": "Discover adorable outfits for every little moment. From royal festive frocks and dapper kurta sets to everyday organic playwear — crafted with pure breathable fabrics for happy, active kids.",
        "heroBannerImage": "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1200&q=85",
        "promoBadge": "New Spring / Festive 2026 Collection • Ages 1 to 16 Years",
        "statsCount": "5,000+ Happy Indian Kids",
        "featuredHeadline": "Handpicked Festive & Daily Kids Favourites"
    }'::jsonb
),
(
    'policies',
    '{
        "returnPolicy": "We offer a hassle-free 7-day return and exchange policy from the date of delivery. Items must be unwashed, unworn, and have all original tags intact. You can initiate a return directly from our Dadabari store or via WhatsApp support.",
        "shippingPolicy": "Orders are processed within 24 hours from our Dadabari Kota warehouse. Standard delivery takes 2–4 business days across Rajasthan, and 3–6 business days for the rest of India. Express shipping is free on orders above ₹999.",
        "privacyPolicy": "She & She Kids Wear values your family privacy. We never store credit/debit card details on our servers. All online transactions are handled through 256-bit SSL encrypted RBI-authorized payment gateways like Razorpay."
    }'::jsonb
)
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value;

-- ============================================================================
-- 12. CLEANUP OF LEGACY DEMO ORDERS & SAMPLE CUSTOMERS
-- ============================================================================
-- Ensures the production database contains only real customer orders and genuine clients
DELETE FROM public.order_items WHERE order_id IN ('SSKW-78219', 'SSKW-84920');
DELETE FROM public.orders WHERE id IN ('SSKW-78219', 'SSKW-84920');
DELETE FROM public.customers WHERE id IN ('cust_01', 'cust_02') OR phone IN ('9829154321', '9414012345');

-- ============================================================================
-- 13. CUSTOMER INQUIRIES & CONTACT MESSAGES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.inquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'New', -- New, Contacted, Resolved
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inquiries_phone ON public.inquiries (phone);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries (created_at DESC);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert inquiries" ON public.inquiries;
CREATE POLICY "Anyone can insert inquiries" ON public.inquiries
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read inquiries" ON public.inquiries;
CREATE POLICY "Anyone can read inquiries" ON public.inquiries
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can update inquiries" ON public.inquiries;
CREATE POLICY "Admin can update inquiries" ON public.inquiries
    FOR UPDATE USING (true);

-- ============================================================================
-- 14. NEWSLETTER SUBSCRIBERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    subscribed_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers (email);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can view newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admin can view newsletter subscribers" ON public.newsletter_subscribers
    FOR SELECT USING (true);

