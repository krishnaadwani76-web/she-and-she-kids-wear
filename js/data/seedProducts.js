/**
 * She & She Kids Wear - Initial Product Catalog Database
 * High-quality Indian kidswear catalog with realistic pricing, photos, and SEO specs.
 */

export const INITIAL_PRODUCTS = [
  {
    id: "prod_001",
    name: "Rose Blush Princess Tulle Party Frock",
    slug: "rose-blush-princess-tulle-party-frock",
    category: "girls",
    subCategory: "party",
    badge: "Bestseller",
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    price: 2499,
    discountPrice: 1599,
    rating: 4.9,
    reviewCount: 84,
    stock: 22,
    images: [
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Blush Pink", hex: "#FCE7F3", imageIndex: 0 },
      { name: "Soft Peach", hex: "#FFE4E6", imageIndex: 1 },
      { name: "Cream White", hex: "#FFFDF7", imageIndex: 2 }
    ],
    sizes: ["1-2Y", "2-3Y", "3-4Y", "4-5Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y"],
    fabric: "Multi-layered Premium French Tulle with 100% Hypoallergenic Cotton Inner Lining",
    ageGroup: "1 to 12 Years",
    comfortAndStyling: "Designed with a seamless soft-stitched inner bodice so your little angel enjoys itchy-free celebrations. Features delicate flower-corsage embellishments and an adjustable satin tie-back sash for a royal tailored fit.",
    washingInstructions: "Dry clean recommended for first wash. Thereafter gentle hand wash in lukewarm water. Do not wring or tumble dry. Steam iron on low setting.",
    description: "Make her birthday and festive memories sparkle with the Rose Blush Princess Tulle Frock from She & She Kids Wear. Handcrafted with airy, voluminous layers of pastel tulle over breathable Indian cotton lining, this fairy-tale dress gives effortless twirl-factor without compromising comfort.",
    seoTitle: "Rose Blush Princess Tulle Party Frock | Girls Wear Kota",
    seoDescription: "Buy Rose Blush Princess Tulle Party Frock at She & She Kids Wear Kota. Voluminous pastel layers with 100% hypoallergenic cotton lining for birthday twirls.",
    seoKeywords: "princess tulle frock, girls birthday dress, party frock Kota, pink tulle dress kids"
  },
  {
    id: "prod_002",
    name: "Pastel Mint Kurta Pajama with Floral Nehru Jacket",
    slug: "pastel-mint-kurta-pajama-floral-nehru-jacket",
    category: "boys",
    subCategory: "party",
    badge: "Festive Pick",
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    price: 2999,
    discountPrice: 1899,
    rating: 4.8,
    reviewCount: 62,
    stock: 18,
    images: [
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1471286174890-9c112ffca56a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Mint Green", hex: "#D1FAE5", imageIndex: 0 },
      { name: "Powder Blue", hex: "#E0F2FE", imageIndex: 1 },
      { name: "Warm Cream", hex: "#FEF3C7", imageIndex: 2 }
    ],
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y", "13-14Y", "15-16Y"],
    fabric: "Pure Slub Chanderi Cotton Kurta with Jacquard Floral Waistcoat & Cotton Pajama",
    ageGroup: "2 to 16 Years",
    comfortAndStyling: "Tailored to modern festive elegance with mandarin collar, antiqued metallic buttons, and a comfortable elasticated drawstring churidar pajama that stays comfy during long wedding rituals.",
    washingInstructions: "Gentle machine wash or hand wash in cold water with mild detergent. Wash dark colors separately. Iron at medium temperature.",
    description: "Dress your young prince in effortless royal charm. This 3-piece ethnic ensemble from She & She Kids Wear Dadabari combines refreshing mint cotton tones with a regal floral woven jacket, striking the perfect balance between traditional heritage and all-day play comfort.",
    seoTitle: "Pastel Mint Kurta Pajama with Floral Jacket | Boys Wear",
    seoDescription: "Shop boys pastel mint kurta pajama set with floral woven Nehru jacket at She & She Kids Wear Kota. Pure Chanderi cotton tailored for festive celebrations.",
    seoKeywords: "boys kurta pajama, floral nehru jacket, festive ethnic wear boys, boys traditional dress"
  },
  {
    id: "prod_003",
    name: "Organic Muslin Cloud Baby Romper & Bonnet Set",
    slug: "organic-muslin-cloud-baby-romper-bonnet-set",
    category: "baby",
    subCategory: "casual",
    badge: "Pure Organic",
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    price: 1499,
    discountPrice: 899,
    rating: 5.0,
    reviewCount: 47,
    stock: 30,
    images: [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Cream White", hex: "#FFFDF7", imageIndex: 0 },
      { name: "Baby Peach", hex: "#FFE4E6", imageIndex: 1 },
      { name: "Sage Mist", hex: "#E2E8F0", imageIndex: 2 }
    ],
    sizes: ["1-2Y", "2-3Y"],
    fabric: "100% GOTS Certified Organic 4-Layer Muslin Cotton",
    ageGroup: "0 to 3 Years",
    comfortAndStyling: "Ultra-breathable open-weave cotton that softens with every wash. Designed with coconut wood buttons and easy-snap crotch buttons for rapid, tear-free diaper changes.",
    washingInstructions: "Machine wash cold on delicate cycle. Air dry flat. Do not bleach. No ironing necessary - the natural muslin crinkle adds texture.",
    description: "Gently wrapping your newborn in cloud-like gentleness, our Organic Muslin Baby Romper comes paired with a matching sun bonnet. Hand-stitched with love in Rajasthan for ultra-sensitive newborn skin.",
    seoTitle: "Organic Muslin Baby Romper & Bonnet Set | Kota Baby Wear",
    seoDescription: "Order GOTS certified organic muslin baby romper and sun bonnet set at She & She Kids Wear. Ultra-breathable, gentle on sensitive skin, with snap buttons.",
    seoKeywords: "organic muslin romper, baby bonnet set, newborn organic clothes, soft baby wear Kota"
  },
  {
    id: "prod_004",
    name: "Sunshine Yellow Floral Anarkali Kurta & Dupatta Set",
    slug: "sunshine-yellow-floral-anarkali-kurta-dupatta-set",
    category: "girls",
    subCategory: "party",
    badge: "Festive Hit",
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    price: 3299,
    discountPrice: 2199,
    rating: 4.9,
    reviewCount: 112,
    stock: 14,
    images: [
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Marigold Yellow", hex: "#FEF08A", imageIndex: 0 },
      { name: "Pastel Pink", hex: "#FCE7F3", imageIndex: 1 },
      { name: "Sky Blue", hex: "#BAE6FD", imageIndex: 2 }
    ],
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y", "13-14Y", "15-16Y"],
    fabric: "Pure Cotton Mulmul with Gota Patti Lace Detailing and Soft Cotton Pants",
    ageGroup: "2 to 16 Years",
    comfortAndStyling: "Kalidar 32-kali flare that swirls like magic. Decorated with traditional golden Rajasthani gota work along hemline and sleeves, finished with a feather-light net dupatta.",
    washingInstructions: "Hand wash gently with mild liquid soap. Do not soak. Shade dry. Warm iron inside out.",
    description: "Bring radiant festive cheer to your daughter's wardrobe with our Marigold Anarkali set. Made from heritage Kota-inspired mulmul cotton, it keeps little girls comfortable throughout Diwali, Eid, Haldi, or wedding celebrations.",
    seoTitle: "Sunshine Yellow Floral Anarkali Kurta Set | Girls Ethnic",
    seoDescription: "Shop sunshine yellow floral anarkali kurta set with dupatta at She & She Kids Wear Kota. Pure mulmul cotton with Gota Patti detailing for festive joy.",
    seoKeywords: "yellow anarkali kids, girls festive kurta set, gota patti dress kids, Indian ethnic wear girls"
  },
  {
    id: "prod_005",
    name: "Classic Linen Chambray Shirt & Chino Shorts Set",
    slug: "classic-linen-chambray-shirt-chino-shorts-set",
    category: "boys",
    subCategory: "casual",
    badge: "Summer Chic",
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    price: 1899,
    discountPrice: 1199,
    rating: 4.7,
    reviewCount: 39,
    stock: 25,
    images: [
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1471286174890-9c112ffca56a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Powder Blue", hex: "#E0F2FE", imageIndex: 0 },
      { name: "Beige Khaki", hex: "#F5F5DC", imageIndex: 1 },
      { name: "Soft White", hex: "#FFFFFF", imageIndex: 2 }
    ],
    sizes: ["1-2Y", "2-3Y", "3-4Y", "4-5Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y"],
    fabric: "70% European Flax Linen & 30% Combed Cotton Blend",
    ageGroup: "1 to 12 Years",
    comfortAndStyling: "Tailored collar with wooden button placket and roll-up sleeve tabs. Comes with stretchable waistband chinos with internal button adjusters for easy growth fits.",
    washingInstructions: "Machine wash cold, cycle normal. Tumble dry low or line dry. Warm iron while slightly damp for crisp linen drape.",
    description: "Effortlessly dapper for weekend brunches, family holidays, and birthday outings. This lightweight linen-cotton duo keeps young boys sharp and sweat-free under warm Indian afternoons.",
    seoTitle: "Linen Chambray Shirt & Chino Shorts Set | Boys Casual",
    seoDescription: "Buy boys classic linen chambray shirt and chino shorts combo at She & She Kids Wear Dadabari. Breathable European linen blend tailored for summer outings.",
    seoKeywords: "boys linen shirt, chino shorts set, summer boys casual, boys stylish outfits Kota"
  },
  {
    id: "prod_006",
    name: "Pastel Lavender Flutter Sleeve Tiered Dress",
    slug: "pastel-lavender-flutter-sleeve-tiered-dress",
    category: "girls",
    subCategory: "casual",
    badge: "Trending",
    isNew: true,
    isBestSeller: true,
    isFeatured: false,
    price: 1999,
    discountPrice: 1249,
    rating: 4.8,
    reviewCount: 53,
    stock: 20,
    images: [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Lilac Mist", hex: "#EDE9FE", imageIndex: 0 },
      { name: "Pastel Pink", hex: "#FCE7F3", imageIndex: 1 },
      { name: "Butter Yellow", hex: "#FEF9C3", imageIndex: 2 }
    ],
    sizes: ["1-2Y", "2-3Y", "3-4Y", "4-5Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y", "13-14Y"],
    fabric: "100% Premium Poplin Cotton with Dobby Weave Texture",
    ageGroup: "1 to 14 Years",
    comfortAndStyling: "Charming flutter sleeves, square neckline with elasticated back, and a three-tier airy silhouette that moves gracefully with active little girls.",
    washingInstructions: "Machine wash gentle in cold water. Wash with like colors. Line dry in shade.",
    description: "Everyday luxury for your little fashionista. Our Lavender Flutter Dress combines dreamy pastel shades with pure cotton comfort, making it a go-to choice for school picnics, playdates, and dinner parties.",
    seoTitle: "Lavender Flutter Sleeve Tiered Dress | Girls Cotton Frock",
    seoDescription: "Explore pastel lavender flutter sleeve tiered cotton dress for girls at She & She Kids Wear Kota. Airy poplin cotton with dobby texture for all-day comfort.",
    seoKeywords: "girls tiered dress, lavender cotton frock, flutter sleeve dress kids, casual girls wear"
  },
  {
    id: "prod_007",
    name: "Royal Navy Bandhgala Velvet Tuxedo 3-Piece Set",
    slug: "royal-navy-bandhgala-velvet-tuxedo-set",
    category: "boys",
    subCategory: "party",
    badge: "Royal Luxury",
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    price: 4499,
    discountPrice: 2899,
    rating: 4.9,
    reviewCount: 71,
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1471286174890-9c112ffca56a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Midnight Navy", hex: "#1E3A8A", imageIndex: 0 },
      { name: "Wine Burgundy", hex: "#881337", imageIndex: 1 },
      { name: "Forest Emerald", hex: "#064E3B", imageIndex: 2 }
    ],
    sizes: ["3-4Y", "4-5Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y", "13-14Y", "15-16Y"],
    fabric: "Plush Micro-Velvet Blazer with Satin Lapel, Crisp Cotton Shirt & Structured Trousers",
    ageGroup: "3 to 16 Years",
    comfortAndStyling: "Features tailored satin-trimmed pocket square, bespoke crest brass buttons, and a removable satin bowtie. Tailored with room for easy movement on the dance floor.",
    washingInstructions: "Specialist dry clean only. Store in garment bag with cedar balls.",
    description: "A show-stopping red carpet tuxedo for weddings and evening galas. Designed specifically for young gentlemen, this plush velvet ensemble radiates timeless sophistication.",
    seoTitle: "Royal Navy Bandhgala Velvet Tuxedo Set | Boys Suits Kota",
    seoDescription: "Tailored 3-piece royal navy velvet bandhgala tuxedo for young boys at She & She Kids Wear. Satin lapel blazer, cotton shirt, and trousers for weddings.",
    seoKeywords: "boys velvet tuxedo, bandhgala suit kids, boys wedding suit Kota, royal navy tuxedo boys"
  },
  {
    id: "prod_008",
    name: "Peaches & Cream Floral Brocade Lehenga Choli Set",
    slug: "peaches-cream-floral-brocade-lehenga-choli-set",
    category: "girls",
    subCategory: "party",
    badge: "Bridal Festive",
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    price: 3999,
    discountPrice: 2599,
    rating: 5.0,
    reviewCount: 96,
    stock: 16,
    images: [
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Peach Gold", hex: "#FED7AA", imageIndex: 0 },
      { name: "Rose Quartz", hex: "#FCE7F3", imageIndex: 1 },
      { name: "Mint Pistachio", hex: "#D1FAE5", imageIndex: 2 }
    ],
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y", "13-14Y", "15-16Y"],
    fabric: "Banarasi Woven Silk Brocade with 100% Pure Cotton Can-Can Lining",
    ageGroup: "2 to 16 Years",
    comfortAndStyling: "Features a soft-lined choli with back hook closure, can-can mesh skirt insert for dreamy twirl volume, handmade potli bag, and pure organza ruffled dupatta.",
    washingInstructions: "Dry clean only to maintain brocade weave luster.",
    description: "Directly inspired by royal Indian palaces, this peach and gold lehenga choli set turns every young girl into a princess. Fully lined in soft cotton to ensure she can dance all night without irritation.",
    seoTitle: "Peach Floral Brocade Lehenga Choli Set | Girls Ethnic",
    seoDescription: "Buy royal Banarasi silk brocade lehenga choli set with organza dupatta at She & She Kids Wear Kota. Pure cotton can-can lining for twirls without irritation.",
    seoKeywords: "kids lehenga choli, banarasi brocade kids lehenga, girls bridal wear, ethnic gown kids"
  },
  {
    id: "prod_009",
    name: "Sweet Dreams Pastel Striped Cotton Sleepsuit Set (Pack of 2)",
    slug: "sweet-dreams-pastel-striped-cotton-sleepsuit-set",
    category: "baby",
    subCategory: "casual",
    badge: "Parent Favorite",
    isNew: false,
    isBestSeller: true,
    isFeatured: false,
    price: 1699,
    discountPrice: 1099,
    rating: 4.9,
    reviewCount: 142,
    stock: 35,
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Pastel Stripe", hex: "#FCE7F3", imageIndex: 0 },
      { name: "Sky Cloud", hex: "#E0F2FE", imageIndex: 1 },
      { name: "Cream Honey", hex: "#FEF3C7", imageIndex: 2 }
    ],
    sizes: ["1-2Y", "2-3Y", "3-4Y"],
    fabric: "100% Combed Interlock Bio-Washed Cotton",
    ageGroup: "1 to 4 Years",
    comfortAndStyling: "Two-way safety zip with chin guard protector. Built-in fold-over scratch mittens for toddlers and slip-resistant silicone foot grips.",
    washingInstructions: "Machine wash warm (40°C). Tumble dry medium. Safe for daily baby laundering.",
    description: "Ensure snuggly, uninterrupted sleep for your precious little one. Made with extra-soft combed cotton, these adorable sleepsuits are pediatrician-approved and chemical-free.",
    seoTitle: "Pastel Striped Cotton Baby Sleepsuit Set | She & She",
    seoDescription: "Shop 2-pack combed interlock cotton baby sleepsuits at She & She Kids Wear Kota. Features two-way safety zipper, chin guard, and non-slip silicone foot grips.",
    seoKeywords: "baby sleepsuit pack, cotton baby onesie, infant nightwear Kota, newborn zip sleepsuit"
  },
  {
    id: "prod_010",
    name: "Safari Explorer Cotton Dungaree & Striped Tee Set",
    slug: "safari-explorer-cotton-dungaree-striped-tee-set",
    category: "boys",
    subCategory: "casual",
    badge: "Play Ready",
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    price: 1899,
    discountPrice: 1199,
    rating: 4.8,
    reviewCount: 44,
    stock: 28,
    images: [
      "https://images.unsplash.com/photo-1471286174890-9c112ffca56a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Olive Khaki", hex: "#D97706", imageIndex: 0 },
      { name: "Navy Denim", hex: "#1E3A8A", imageIndex: 1 },
      { name: "Warm Rust", hex: "#B45309", imageIndex: 2 }
    ],
    sizes: ["1-2Y", "2-3Y", "3-4Y", "4-5Y", "5-6Y", "7-8Y"],
    fabric: "100% Twill Cotton Dungarees with Soft Jersey Cotton Inner Tee",
    ageGroup: "1 to 8 Years",
    comfortAndStyling: "Adjustable buckle shoulder straps that grow with your child, functional front kangaroo pouch pocket, and snap crotch on toddler sizes.",
    washingInstructions: "Machine wash cold inside out. Tumble dry normal.",
    description: "Ready for playground climbs, park strolls, and nursery days. The Safari Dungaree set is rugged, fashionable, and ultra-durable for energetic boys.",
    seoTitle: "Safari Explorer Cotton Dungaree & Tee Set | Boys Casual",
    seoDescription: "Order rugged 100% twill cotton dungaree and striped jersey t-shirt set at She & She Kids Wear Kota. Adjustable straps and kangaroo pockets for play days.",
    seoKeywords: "boys cotton dungaree, kids overalls set, boys playwear, toddler dungaree Kota"
  },
  {
    id: "prod_011",
    name: "Embroidered Peplum Kurti & Dhoti Pant Set",
    slug: "embroidered-peplum-kurti-dhoti-pant-set",
    category: "girls",
    subCategory: "party",
    badge: "Festive Hit",
    isNew: true,
    isBestSeller: true,
    isFeatured: false,
    price: 2499,
    discountPrice: 1699,
    rating: 4.9,
    reviewCount: 68,
    stock: 19,
    images: [
      "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Candy Pink", hex: "#F472B6", imageIndex: 0 },
      { name: "Teal Turquoise", hex: "#2DD4BF", imageIndex: 1 },
      { name: "Royal Magenta", hex: "#BE185D", imageIndex: 2 }
    ],
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y", "13-14Y"],
    fabric: "Soft Silk-Cotton Georgette with Pure Cotton Lining and Rayon Dhoti",
    ageGroup: "2 to 14 Years",
    comfortAndStyling: "Thread-embroidered mirror motifs with tassel tie-up dori. Flowing dhoti pants with soft elastic waist ensure total comfort while sitting cross-legged during pujas.",
    washingInstructions: "Gentle hand wash with cold water. Line dry in shade.",
    description: "An Indo-Western classic! This peplum kurti and dhoti pant set brings contemporary festival flair to your young daughter's ethnic closet.",
    seoTitle: "Embroidered Peplum Kurti & Dhoti Pant Set | Girls Wear",
    seoDescription: "Shop stylish mirror-work peplum kurti and soft dhoti pant set at She & She Kids Wear Kota. Pure cotton lined festive Indo-Western wear for girls ages 2-14.",
    seoKeywords: "peplum kurti dhoti set, girls indo western, mirror work kidswear, festive ethnic girls"
  },
  {
    id: "prod_012",
    name: "Cozy Bear Fleece Hooded Jacket & Joggers",
    slug: "cozy-bear-fleece-hooded-jacket-joggers",
    category: "casual",
    subCategory: "casual",
    badge: "Winter Warmth",
    isNew: false,
    isBestSeller: false,
    isFeatured: true,
    price: 2199,
    discountPrice: 1399,
    rating: 4.8,
    reviewCount: 51,
    stock: 24,
    images: [
      "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Cream Teddy", hex: "#FEF3C7", imageIndex: 0 },
      { name: "Dusty Rose", hex: "#FBCFE8", imageIndex: 1 },
      { name: "Slate Grey", hex: "#CBD5E1", imageIndex: 2 }
    ],
    sizes: ["1-2Y", "2-3Y", "3-4Y", "4-5Y", "5-6Y", "7-8Y", "9-10Y"],
    fabric: "Ultra-Soft Sherpa Fleece Outer with 100% Jersey Cotton Inner Lining",
    ageGroup: "1 to 10 Years",
    comfortAndStyling: "Adorned with 3D teddy ears on the hood, ribbed storm cuffs to seal out cold drafts, and a smooth nylon zipper with protective chin garage.",
    washingInstructions: "Machine wash cold gentle cycle. Do not iron fleece directly.",
    description: "Wrap your little ones in irresistible cozy comfort with our Sherpa Bear track set. Perfect for Kota's winter mornings and holiday travels.",
    seoTitle: "Cozy Bear Fleece Hooded Jacket & Joggers | Kids Winter",
    seoDescription: "Keep your little ones warm with ultra-soft Sherpa bear fleece hooded jacket and joggers set from She & She Kids Wear Kota. 100% jersey cotton inner lining.",
    seoKeywords: "kids winter fleece set, bear hooded jacket kids, cozy track set kids, winter kidswear Kota"
  }
];

export const CATEGORIES = [
  { id: "all", name: "All Products", count: 12, icon: "sparkles" },
  { id: "girls", name: "Girls Wear", count: 5, icon: "heart", description: "Frocks, Anarkalis, Twirl Dresses & Party Gowns" },
  { id: "boys", name: "Boys Wear", count: 4, icon: "crown", description: "Kurtas, Nehru Jackets, Linen Shirts & Tuxedos" },
  { id: "baby", name: "Baby Wear", count: 3, icon: "smile", description: "Muslin Rompers, Soft Sleepsuits & Newborn Sets" },
  { id: "party", name: "Party Wear", count: 6, icon: "star", description: "Festive Brocade, Tuxedos & Birthday Gowns" },
  { id: "casual", name: "Casual Wear", count: 5, icon: "sun", description: "Play Suits, Dungarees & Breathable Cotton Daywear" },
  { id: "new", name: "New Arrivals", count: 6, icon: "flame", description: "Fresh Spring/Festive 2026 Collection" },
  { id: "bestsellers", name: "Best Sellers", count: 6, icon: "award", description: "Most Loved Outfits by 5,000+ Happy Parents" }
];

export const SIZE_LIST = [
  "1-2Y", "2-3Y", "3-4Y", "4-5Y", "5-6Y", 
  "7-8Y", "9-10Y", "11-12Y", "13-14Y", "15-16Y"
];

export const SIZE_CHART = [
  { size: "1-2Y", chest: "51 cm (20\")", length: "48 cm (19\")", waist: "48 cm (19\")", height: "86-92 cm" },
  { size: "2-3Y", chest: "53 cm (21\")", length: "52 cm (20.5\")", waist: "50 cm (19.5\")", height: "92-98 cm" },
  { size: "3-4Y", chest: "56 cm (22\")", length: "56 cm (22\")", waist: "52 cm (20.5\")", height: "98-104 cm" },
  { size: "4-5Y", chest: "58 cm (23\")", length: "61 cm (24\")", waist: "54 cm (21.5\")", height: "104-110 cm" },
  { size: "5-6Y", chest: "61 cm (24\")", length: "66 cm (26\")", waist: "56 cm (22\")", height: "110-116 cm" },
  { size: "7-8Y", chest: "66 cm (26\")", length: "72 cm (28.5\")", waist: "58 cm (23\")", height: "122-128 cm" },
  { size: "9-10Y", chest: "71 cm (28\")", length: "78 cm (31\")", waist: "62 cm (24.5\")", height: "134-140 cm" },
  { size: "11-12Y", chest: "76 cm (30\")", length: "85 cm (33.5\")", waist: "66 cm (26\")", height: "146-152 cm" },
  { size: "13-14Y", chest: "81 cm (32\")", length: "92 cm (36\")", waist: "70 cm (27.5\")", height: "158-164 cm" },
  { size: "15-16Y", chest: "86 cm (34\")", length: "98 cm (38.5\")", waist: "74 cm (29\")", height: "170-176 cm" }
];

export const STORE_INFO = {
  name: "She & She Kids Wear",
  tagline: "Making Every Childhood More Stylish",
  subtitle: "Discover adorable outfits for every little moment.",
  phone: "+91 88248 44263",
  whatsapp: "+918824844263",
  whatsappClean: "918824844263",
  whatsappDefaultMsg: "Hi, I am interested in your kids' wear collection.",
  whatsappUrl: "https://wa.me/918824844263?text=Hi%2C%20I%20am%20interested%20in%20your%20kids'%20wear%20collection.",
  email: "care@sheandshekidswear.com",
  address: "Sethiya Complex, Dadabari, Kota, Rajasthan, India - 324009",
  timings: "Monday – Saturday: 10:30 AM – 9:00 PM | Sunday: 11:00 AM – 8:00 PM",
  mapsUrl: "https://www.google.com/maps/dir//She+%26+She+kids+wear,+she+n+she,+sethiya+complex,+Dadabari,+Kota,+Rajasthan+324009/@25.1580017,75.8273144,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x396f85bcf0d3948b:0x337bd124ca6432ba!2m2!1d75.8273144!2d25.1580017",
  placeUrl: "https://www.google.com/maps/place/She+%26+She+kids+wear/@25.1580017,75.8273144,17z/data=!4m6!3m5!1s0x396f85bcf0d3948b:0x337bd124ca6432ba!8m2!3d25.1580017!4d75.8273144!16s%2Fg%2F11y1zq1z1z",
  cid: "3709804868270142138",
  placeId: "ChIJm5TT8Ly1bzkKujJkyoTRezM",
  coords: { lat: 25.1580017, lng: 75.8273144 },
  instagram: "https://www.instagram.com/she_n_she_kids_wear?utm_source=ig_web_button_share_sheet&cnvx=ZDNlZDc0MzIxNw==",
  instagramHandle: "@she_n_she_kids_wear"
};
