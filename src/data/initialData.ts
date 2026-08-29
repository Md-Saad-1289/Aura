import {
  Product,
  Category,
  Order,
  User,
  Review,
  Coupon,
  ShippingMethod,
  StoreSettings,
  ActivityLog,
  BlogPost
} from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Audio & Acoustics',
    slug: 'audio-acoustics',
    description: 'High-fidelity headphones, studio monitors, and lossless portable sound.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    productCount: 4,
    isFeatured: true,
    subcategories: ['Over-Ear Headphones', 'Earbuds', 'Wireless Speakers', 'DAC & Amps'],
  },
  {
    id: 'cat-2',
    name: 'Apparel & Knitwear',
    slug: 'apparel-knitwear',
    description: 'Tailored silhouettes crafted from organic merino wool, cashmere, and Japanese cotton.',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1000&auto=format&fit=crop',
    productCount: 4,
    isFeatured: true,
    subcategories: ['Cashmere & Sweaters', 'Tailored Outerwear', 'Organic Tees', 'Trousers'],
  },
  {
    id: 'cat-3',
    name: 'Timepieces & Horology',
    slug: 'timepieces',
    description: 'Precision mechanical and minimalist automatic watches engineered with sapphire crystal.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
    productCount: 3,
    isFeatured: true,
    subcategories: ['Automatic', 'Chronograph', 'Minimalist Dial', 'Leather Straps'],
  },
  {
    id: 'cat-4',
    name: 'Leather Goods & Bags',
    slug: 'leather-goods',
    description: 'Full-grain vegetable tanned Italian leather bags, weekender totes, and cardholders.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
    productCount: 4,
    isFeatured: true,
    subcategories: ['Weekender Bags', 'Backpacks', 'Bifold Wallets', 'Laptop Sleeves'],
  },
  {
    id: 'cat-5',
    name: 'Living & Interior',
    slug: 'living-interior',
    description: 'Sculptural desk lighting, ceramic vessels, and artisanal home fragrances.',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1000&auto=format&fit=crop',
    productCount: 3,
    isFeatured: false,
    subcategories: ['Desk Lamps', 'Ceramics', 'Diffusers', 'Workspace Tools'],
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Aura Studio Lossless ANC Headphones',
    slug: 'aura-studio-anc-headphones',
    brand: 'AURA SOUND',
    shortDescription: 'Active noise cancelling headphones with custom 40mm titanium drivers and 45h battery.',
    description: 'Engineered for true audiophiles and discerning listeners. The Aura Studio combines custom 40mm electro-dynamic titanium drivers with hybrid active noise cancellation for pristine acoustic transparency. Hand-stitched lambskin ear cushions deliver all-day comfort, while our lossless wireless codec ensures uncompressed studio fidelity.',
    category: 'Audio & Acoustics',
    subcategory: 'Over-Ear Headphones',
    price: 349,
    compareAtPrice: 399,
    costPrice: 140,
    sku: 'AUR-HP-001',
    stock: 28,
    lowStockThreshold: 5,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: {
      colors: [
        { name: 'Matte Obsidian', hex: '#1c1c1e', inStock: true },
        { name: 'Brushed Silver', hex: '#d1d5db', inStock: true },
        { name: 'Champagne Gold', hex: '#e2d3b5', inStock: true }
      ]
    },
    rating: 4.9,
    reviewCount: 124,
    tags: ['wireless', 'noise-cancelling', 'audio', 'bestseller', 'premium'],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: true,
    status: 'active',
    specifications: {
      'Driver Size': '40mm Custom Titanium',
      'Frequency Response': '10Hz – 40,000Hz',
      'Battery Life': 'Up to 45 hours (ANC On)',
      'Connectivity': 'Bluetooth 5.3 + 3.5mm Lossless',
      'Weight': '265 grams',
      'Warranty': '2 Years International'
    },
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-08-10T14:30:00Z'
  },
  {
    id: 'prod-2',
    name: 'Atelier Minimalist Automatic Watch',
    slug: 'atelier-minimalist-automatic-watch',
    brand: 'ATELIER HOROLOGY',
    shortDescription: 'Japanese Miyota automatic movement encased in 316L brushed stainless steel.',
    description: 'An homage to modern architectural purity. Designed with an ultra-thin 38mm surgical-grade stainless steel case, anti-reflective sapphire glass, and a bespoke sapphire exhibition caseback revealing the oscillating rotor. Paired with a genuine Horween leather quick-release strap.',
    category: 'Timepieces & Horology',
    subcategory: 'Automatic',
    price: 495,
    compareAtPrice: 580,
    costPrice: 190,
    sku: 'ATL-WT-002',
    stock: 14,
    lowStockThreshold: 4,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: {
      colors: [
        { name: 'Silver & Noir', hex: '#27272a', inStock: true },
        { name: 'Rose Gold & Saddle', hex: '#b45309', inStock: true },
        { name: 'Monochrome Steel', hex: '#9ca3af', inStock: true }
      ],
      sizes: ['38mm Case', '41mm Case']
    },
    rating: 4.8,
    reviewCount: 89,
    tags: ['watch', 'automatic', 'leather', 'horology', 'featured'],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: true,
    status: 'active',
    specifications: {
      'Movement': 'Miyota 9015 Automatic (28,800 vph)',
      'Power Reserve': '42 Hours',
      'Case Diameter': '38mm / 41mm',
      'Water Resistance': '5 ATM / 50 meters',
      'Crystal': 'Double Domed AR Sapphire',
      'Strap Width': '20mm Genuine Horween Leather'
    },
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-08-12T11:00:00Z'
  },
  {
    id: 'prod-3',
    name: 'Nordic Organic Merino Wool Cardigan',
    slug: 'nordic-organic-merino-cardigan',
    brand: 'NORDIC ATELIER',
    shortDescription: '100% extra-fine merino wool with natural horn buttons and relaxed raglan sleeves.',
    description: 'Crafted from sustainably sourced 19.5-micron extra-fine Merino wool spun in Biella, Italy. Exceptionally soft against the skin, breathable, and naturally thermo-regulating. Features durable horn buttons, ribbed cuffs, and a modern relaxed drape that transitions effortlessly across seasons.',
    category: 'Apparel & Knitwear',
    subcategory: 'Cashmere & Sweaters',
    price: 220,
    compareAtPrice: 260,
    costPrice: 75,
    sku: 'NOR-CD-003',
    stock: 42,
    lowStockThreshold: 8,
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: {
      colors: [
        { name: 'Oatmeal Heather', hex: '#d6cbbe', inStock: true },
        { name: 'Charcoal Melange', hex: '#374151', inStock: true },
        { name: 'Deep Sage', hex: '#4d5d53', inStock: true }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL']
    },
    rating: 4.9,
    reviewCount: 67,
    tags: ['knitwear', 'wool', 'sustainable', 'apparel', 'cozy'],
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isOnSale: true,
    status: 'active',
    specifications: {
      'Material': '100% Extra-fine Italian Merino Wool',
      'Gauge': '7-Gauge Chunky Knit',
      'Buttons': 'Real Corozo Nut Buttons',
      'Care': 'Hand wash cold or dry clean',
      'Origin': 'Ethically spun in Italy'
    },
    createdAt: '2026-03-10T12:00:00Z',
    updatedAt: '2026-08-15T09:00:00Z'
  },
  {
    id: 'prod-4',
    name: 'Vanguard Italian Leather Weekender Bag',
    slug: 'vanguard-italian-leather-weekender',
    brand: 'VANGUARD LEATHER',
    shortDescription: 'Full-grain vegetable tanned vachetta leather with solid brass hardware.',
    description: 'The definitive travel companion. Built to endure a lifetime of journeys, the Vanguard Weekender is handcrafted from 2.2mm full-grain Tuscan leather that matures with a rich, unique patina over time. Features a padded 16-inch laptop compartment, dedicated shoe pocket, and a detachable padded shoulder strap.',
    category: 'Leather Goods & Bags',
    subcategory: 'Weekender Bags',
    price: 480,
    compareAtPrice: 550,
    costPrice: 180,
    sku: 'VAN-BG-004',
    stock: 19,
    lowStockThreshold: 3,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: {
      colors: [
        { name: 'Cognac Saddle', hex: '#9a3412', inStock: true },
        { name: 'Espresso Brown', hex: '#3e2723', inStock: true },
        { name: 'Midnight Black', hex: '#18181b', inStock: true }
      ]
    },
    rating: 5.0,
    reviewCount: 94,
    tags: ['leather', 'travel', 'duffel', 'bestseller', 'luxury'],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: false,
    status: 'active',
    specifications: {
      'Dimensions': '52cm x 30cm x 26cm (42L Capacity)',
      'Leather': 'Full-grain Tuscan Vachetta Leather',
      'Hardware': 'Solid Antiqued Brass YKK Excella Zippers',
      'Lining': 'Water-resistant 10oz Cotton Twill',
      'Weight': '1.8 kg'
    },
    createdAt: '2026-01-20T14:00:00Z',
    updatedAt: '2026-08-16T16:00:00Z'
  },
  {
    id: 'prod-5',
    name: 'Kanso Solid Brass & Ceramic Desk Lamp',
    slug: 'kanso-brass-ceramic-desk-lamp',
    brand: 'KANSO OBJECTS',
    shortDescription: 'Hand-thrown stoneware base with brushed brass stem and dimmable 2700K warm LED.',
    description: 'Harmonizing warm materials with contemporary precision. The Kanso Lamp features a heavy ceramic base textured with natural volcanic slip, a counterbalanced solid brass arm, and a step-less optical touch dimmer for sublime ambient workspace illumination.',
    category: 'Living & Interior',
    subcategory: 'Desk Lamps',
    price: 195,
    compareAtPrice: 230,
    costPrice: 65,
    sku: 'KAN-LP-005',
    stock: 22,
    lowStockThreshold: 5,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: {
      colors: [
        { name: 'Warm Terracotta', hex: '#c2410c', inStock: true },
        { name: 'Sandstone Beige', hex: '#e7e5e4', inStock: true },
        { name: 'Matte Charcoal', hex: '#262626', inStock: true }
      ]
    },
    rating: 4.7,
    reviewCount: 41,
    tags: ['lighting', 'interior', 'ceramic', 'decor', 'minimalist'],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isOnSale: true,
    status: 'active',
    specifications: {
      'Light Source': 'Integrated 9W Warm LED (2700K, 90+ CRI)',
      'Brightness': '800 Lumens (Smooth Rotary Dimming)',
      'Height': '44cm',
      'Base Diameter': '16cm',
      'Cord': '2.0m Braided Fabric Cord'
    },
    createdAt: '2026-04-05T09:00:00Z',
    updatedAt: '2026-08-11T13:20:00Z'
  },
  {
    id: 'prod-6',
    name: 'Horizon Lossless Hi-Fi Wireless Speaker',
    slug: 'horizon-lossless-hifi-speaker',
    brand: 'AURA SOUND',
    shortDescription: 'Room-filling 120W acoustic architecture with walnut cabinet and AirPlay 2.',
    description: 'Crafted with an acoustically tuned real American Walnut cabinet, two neodymium silk-dome tweeters, and a dedicated 4.5-inch long-throw subwoofer. Delivers pristine spatial clarity with Wi-Fi streaming, AirPlay 2, Spotify Connect, and optical digital inputs.',
    category: 'Audio & Acoustics',
    subcategory: 'Wireless Speakers',
    price: 520,
    compareAtPrice: 599,
    costPrice: 210,
    sku: 'AUR-SP-006',
    stock: 12,
    lowStockThreshold: 4,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: {
      colors: [
        { name: 'Natural Walnut', hex: '#78350f', inStock: true },
        { name: 'Nordic Ash', hex: '#d6d3d1', inStock: true },
        { name: 'Black Ash', hex: '#1c1917', inStock: true }
      ]
    },
    rating: 4.9,
    reviewCount: 53,
    tags: ['speaker', 'audio', 'hifi', 'walnut', 'smart-home'],
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: false,
    isOnSale: false,
    status: 'active',
    specifications: {
      'Amplifier': '120W Class-D Tri-Amped System',
      'Frequency Range': '38Hz – 22,000Hz',
      'Wireless': 'Wi-Fi 6, AirPlay 2, Bluetooth 5.3 aptX HD',
      'Inputs': 'Optical TOSLINK, RCA Line-in, USB-C',
      'Dimensions': '36cm x 19cm x 15cm'
    },
    createdAt: '2026-02-18T15:00:00Z',
    updatedAt: '2026-08-14T10:45:00Z'
  },
  {
    id: 'prod-7',
    name: 'Kyoto Structured Trench Coat',
    slug: 'kyoto-structured-trench-coat',
    brand: 'NORDIC ATELIER',
    shortDescription: 'Waterproof Japanese gabardine cotton with storm flap and horn buckles.',
    description: 'A contemporary rethinking of the classic double-breasted trench. Tailored from high-density, water-repellent Japanese cotton gabardine with clean architectural lines, deep welt pockets, raglan shoulders, and a storm collar designed to withstand unpredictable weather.',
    category: 'Apparel & Knitwear',
    subcategory: 'Tailored Outerwear',
    price: 390,
    compareAtPrice: 450,
    costPrice: 135,
    sku: 'NOR-TC-007',
    stock: 18,
    lowStockThreshold: 5,
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce667823?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: {
      colors: [
        { name: 'Heritage Khaki', hex: '#ca8a04', inStock: true },
        { name: 'Midnight Navy', hex: '#1e3a8a', inStock: true },
        { name: 'Stone Grey', hex: '#9ca3af', inStock: true }
      ],
      sizes: ['S', 'M', 'L', 'XL']
    },
    rating: 4.8,
    reviewCount: 38,
    tags: ['coat', 'outerwear', 'waterproof', 'apparel'],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isOnSale: true,
    status: 'active',
    specifications: {
      'Shell': '100% Japanese High-Density Cotton Gabardine',
      'Water Resistance': 'DWR Fluorocarbon-Free Coating',
      'Lining': '100% Cupro Satin',
      'Length': 'Below Knee Tailored Cut'
    },
    createdAt: '2026-03-25T11:00:00Z',
    updatedAt: '2026-08-16T17:00:00Z'
  },
  {
    id: 'prod-8',
    name: 'Slimline Bi-Fold Leather Cardholder',
    slug: 'slimline-bifold-leather-cardholder',
    brand: 'VANGUARD LEATHER',
    shortDescription: 'Ultra-thin profile holding up to 10 cards with RFID shielding protection.',
    description: 'Laser cut and saddle-stitched by master artisans using premium French Chèvre goat leather. Designed to maintain an ultra-slim pocket silhouette while securely carrying folded banknotes, 10 payment cards, and built-in RFID blocking fabric.',
    category: 'Leather Goods & Bags',
    subcategory: 'Bifold Wallets',
    price: 85,
    compareAtPrice: 110,
    costPrice: 22,
    sku: 'VAN-WL-008',
    stock: 55,
    lowStockThreshold: 10,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: {
      colors: [
        { name: 'Racing Green', hex: '#14532d', inStock: true },
        { name: 'Saddle Tan', hex: '#b45309', inStock: true },
        { name: 'Charcoal Black', hex: '#18181b', inStock: true }
      ]
    },
    rating: 4.9,
    reviewCount: 156,
    tags: ['wallet', 'cardholder', 'leather', 'accessories'],
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: true,
    status: 'active',
    specifications: {
      'Capacity': '6-10 Cards + Cash Slot',
      'Material': 'French Chèvre Goatskin',
      'Protection': 'Full RFID Signal Blocking',
      'Thickness': 'Just 6mm when loaded'
    },
    createdAt: '2026-01-05T08:00:00Z',
    updatedAt: '2026-08-17T14:10:00Z'
  },
  {
    id: 'prod-9',
    name: 'Chronograph Pioneer Edition 42mm',
    slug: 'chronograph-pioneer-edition-42mm',
    brand: 'ATELIER HOROLOGY',
    shortDescription: 'Dual-register chronograph with sunray dial and ceramic tachymeter bezel.',
    description: 'Precision timing meets vintage motorsport heritage. The Pioneer Edition features mechanical chronograph pushers, a scratchproof high-polish black ceramic bezel, Swiss Super-LumiNova luminescence on indices, and a quick-adjust mesh bracelet.',
    category: 'Timepieces & Horology',
    subcategory: 'Chronograph',
    price: 620,
    compareAtPrice: 695,
    costPrice: 240,
    sku: 'ATL-CH-009',
    stock: 8,
    lowStockThreshold: 3,
    images: [
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: {
      colors: [
        { name: 'Panda White/Black', hex: '#f4f4f5', inStock: true },
        { name: 'Midnight Sunray', hex: '#0f172a', inStock: true }
      ],
      sizes: ['42mm Case']
    },
    rating: 4.9,
    reviewCount: 32,
    tags: ['watch', 'chronograph', 'sports', 'luxury'],
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isOnSale: false,
    status: 'active',
    specifications: {
      'Movement': 'Seiko VK64 Meca-Quartz Hybrid Movement',
      'Bezel': 'Polished Ceramic Tachymeter',
      'Luminescence': 'Swiss Super-LumiNova BGW9',
      'Strap': 'Solid 316L Stainless Steel Milanese Mesh'
    },
    createdAt: '2026-04-12T10:30:00Z',
    updatedAt: '2026-08-18T12:00:00Z'
  },
  {
    id: 'prod-10',
    name: 'Artisan Terracotta Aromatherapy Diffuser',
    slug: 'artisan-terracotta-aroma-diffuser',
    brand: 'KANSO OBJECTS',
    shortDescription: 'Ultrasonic cold mist diffuser crafted from raw matte terracotta pottery.',
    description: 'Transform your indoor atmosphere with gentle ultrasonic misting. Quietly diffuses pure botanical essential oils for up to 8 continuous hours, featuring a soft warm breathing ambient light ring and automatic shut-off safety.',
    category: 'Living & Interior',
    subcategory: 'Diffusers',
    price: 110,
    compareAtPrice: 135,
    costPrice: 35,
    sku: 'KAN-DF-010',
    stock: 30,
    lowStockThreshold: 6,
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: {
      colors: [
        { name: 'Earthy Sienna', hex: '#9a3412', inStock: true },
        { name: 'Raw Chalk White', hex: '#f5f5f4', inStock: true },
        { name: 'Slate Stone', hex: '#475569', inStock: true }
      ]
    },
    rating: 4.8,
    reviewCount: 74,
    tags: ['wellness', 'diffuser', 'home', 'aromatherapy'],
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: true,
    status: 'active',
    specifications: {
      'Coverage': 'Up to 500 sq ft',
      'Capacity': '250ml Water Reservoir',
      'Run Time': '8h Continuous / 16h Intermittent',
      'Noise Level': '< 20 dB Whisper Quiet'
    },
    createdAt: '2026-02-14T09:00:00Z',
    updatedAt: '2026-08-13T15:00:00Z'
  },
  {
    id: 'prod-11',
    name: 'Aura True Wireless Active Earbuds',
    slug: 'aura-true-wireless-earbuds',
    brand: 'AURA SOUND',
    shortDescription: 'IPX7 waterproof earbuds with adaptive transparency and spatial audio.',
    description: 'Designed for relentless movement and uncompromised audio dynamics. Featuring graphene acoustic diaphragms, 6 beamforming microphones for crystal-clear calls, wireless fast charging case, and personalized parametric equalizer app control.',
    category: 'Audio & Acoustics',
    subcategory: 'Earbuds',
    price: 189,
    compareAtPrice: 229,
    costPrice: 70,
    sku: 'AUR-EB-011',
    stock: 64,
    lowStockThreshold: 12,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: {
      colors: [
        { name: 'Pearl Matte', hex: '#f1f5f9', inStock: true },
        { name: 'Carbon Black', hex: '#0f172a', inStock: true },
        { name: 'Sage Green', hex: '#3f6212', inStock: true }
      ]
    },
    rating: 4.8,
    reviewCount: 110,
    tags: ['earbuds', 'wireless', 'sports', 'audio'],
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: true,
    status: 'active',
    specifications: {
      'Battery': '8h Earbuds + 28h Case',
      'Waterproof': 'IPX7 Water & Sweat Resistant',
      'Charging': 'Qi Wireless + USB-C Fast Charge',
      'Codecs': 'aptX Lossless, AAC, LDAC'
    },
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-08-17T08:30:00Z'
  },
  {
    id: 'prod-12',
    name: 'Japanese Organic Cotton Heavyweight Tee',
    slug: 'japanese-organic-cotton-tee',
    brand: 'NORDIC ATELIER',
    shortDescription: '280 GSM heavyweight loopwheel knit cotton with reinforced bound collar.',
    description: 'The archetype of the everyday t-shirt. Woven on vintage slow-spinning loopwheel machines in Wakayama, Japan. Has zero side seams, an exceptionally soft hand-feel, and dense 280 GSM structure that will never lose its shape.',
    category: 'Apparel & Knitwear',
    subcategory: 'Organic Tees',
    price: 68,
    compareAtPrice: 80,
    costPrice: 20,
    sku: 'NOR-TS-012',
    stock: 90,
    lowStockThreshold: 15,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: {
      colors: [
        { name: 'Natural Ecru', hex: '#f5f5f4', inStock: true },
        { name: 'Washed Black', hex: '#27272a', inStock: true },
        { name: 'Olive Drab', hex: '#365314', inStock: true },
        { name: 'Indigo Blue', hex: '#1e3a8a', inStock: true }
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    rating: 4.9,
    reviewCount: 215,
    tags: ['tshirt', 'cotton', 'everyday', 'bestseller'],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: false,
    status: 'active',
    specifications: {
      'Weight': '280 GSM Heavyweight Jersey',
      'Cotton': '100% Certified Organic Supima Cotton',
      'Construction': 'Tubular Body (Seamless)',
      'Pre-shrunk': 'Sanforized to prevent shrinkage'
    },
    createdAt: '2026-01-10T11:00:00Z',
    updatedAt: '2026-08-18T16:20:00Z'
  }
];

export const INITIAL_SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'ship-std',
    name: 'Standard Carbon-Neutral Delivery',
    description: 'Tracked ground transit with certified carbon offset.',
    estimatedDays: '3–5 Business Days',
    price: 12,
    freeThreshold: 150
  },
  {
    id: 'ship-exp',
    name: 'Express Priority Air',
    description: 'Fast-tracked air courier with signature required.',
    estimatedDays: '1–2 Business Days',
    price: 24
  },
  {
    id: 'ship-overnight',
    name: 'Overnight White-Glove Courier',
    description: 'Guaranteed next morning delivery before 12:00 PM.',
    estimatedDays: 'Next Day Morning',
    price: 45
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'WELCOME10',
    description: '10% discount on your first order with AURA',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 50,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 5000,
    usageCount: 412,
    isActive: true
  },
  {
    id: 'coup-2',
    code: 'AURA20',
    description: '20% discount for orders over $200',
    discountType: 'percentage',
    discountValue: 20,
    minSpend: 200,
    maxDiscount: 100,
    startDate: '2026-06-01',
    endDate: '2026-12-31',
    usageLimit: 1000,
    usageCount: 289,
    isActive: true
  },
  {
    id: 'coup-3',
    code: 'LUXURY50',
    description: '$50 flat discount for orders over $300',
    discountType: 'fixed',
    discountValue: 50,
    minSpend: 300,
    startDate: '2026-05-01',
    endDate: '2026-11-30',
    usageLimit: 500,
    usageCount: 167,
    isActive: true
  },
  {
    id: 'coup-4',
    code: 'VIPEXCLUSIVE',
    description: 'Exclusive 25% off storewide VIP pass',
    discountType: 'percentage',
    discountValue: 25,
    minSpend: 150,
    startDate: '2026-08-01',
    endDate: '2026-09-30',
    usageLimit: 200,
    usageCount: 44,
    isActive: true
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Elena Rostova',
    email: 'admin@aura.store',
    role: 'super_admin',
    phone: '+1 (555) 892-4112',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    status: 'active',
    createdAt: '2025-10-01T09:00:00Z',
    addresses: [
      {
        fullName: 'Elena Rostova',
        email: 'admin@aura.store',
        phone: '+1 (555) 892-4112',
        street: '742 Evergreen Terrace, Suite 400',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94107',
        country: 'United States',
        isDefault: true
      }
    ]
  },
  {
    id: 'usr-mgr-1',
    name: 'Marcus Vance',
    email: 'marcus.vance@aura.store',
    role: 'manager',
    phone: '+1 (555) 319-8744',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    status: 'active',
    createdAt: '2025-11-15T14:20:00Z',
    addresses: []
  },
  {
    id: 'usr-cust-1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'customer',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    status: 'active',
    createdAt: '2026-01-12T11:45:00Z',
    totalSpent: 1245,
    orderCount: 4,
    addresses: [
      {
        fullName: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '+1 (555) 234-5678',
        street: '450 West 33rd Street, Apt 18B',
        apartment: 'Apt 18B',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States',
        isDefault: true
      },
      {
        fullName: 'Jane Doe (Office)',
        email: 'jane.doe@example.com',
        phone: '+1 (555) 234-5678',
        street: '120 Broadway, Floor 24',
        city: 'New York',
        state: 'NY',
        postalCode: '10271',
        country: 'United States',
        isDefault: false
      }
    ]
  },
  {
    id: 'usr-cust-2',
    name: 'Alexander Hayes',
    email: 'a.hayes@architect.design',
    role: 'customer',
    phone: '+1 (555) 902-8114',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    status: 'active',
    createdAt: '2026-02-04T16:10:00Z',
    totalSpent: 870,
    orderCount: 2,
    addresses: [
      {
        fullName: 'Alexander Hayes',
        email: 'a.hayes@architect.design',
        phone: '+1 (555) 902-8114',
        street: '880 Michigan Ave',
        city: 'Chicago',
        state: 'IL',
        postalCode: '60611',
        country: 'United States',
        isDefault: true
      }
    ]
  },
  {
    id: 'usr-cust-3',
    name: 'Sophie Laurent',
    email: 'sophie.laurent@paris.fr',
    role: 'customer',
    phone: '+33 6 12 34 56 78',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    status: 'active',
    createdAt: '2026-03-20T10:05:00Z',
    totalSpent: 480,
    orderCount: 1,
    addresses: [
      {
        fullName: 'Sophie Laurent',
        email: 'sophie.laurent@paris.fr',
        phone: '+33 6 12 34 56 78',
        street: '14 Rue de Rivoli',
        city: 'Paris',
        state: 'Île-de-France',
        postalCode: '75004',
        country: 'France',
        isDefault: true
      }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'AUR-89410',
    customer: {
      id: 'usr-cust-1',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '+1 (555) 234-5678'
    },
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedVariant: {
          color: { name: 'Matte Obsidian', hex: '#1c1c1e' }
        },
        unitPrice: 349
      },
      {
        id: 'item-2',
        productId: 'prod-8',
        product: INITIAL_PRODUCTS[7],
        quantity: 1,
        selectedVariant: {
          color: { name: 'Saddle Tan', hex: '#b45309' }
        },
        unitPrice: 85
      }
    ],
    shippingAddress: {
      fullName: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '+1 (555) 234-5678',
      street: '450 West 33rd Street, Apt 18B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States'
    },
    billingAddress: {
      fullName: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '+1 (555) 234-5678',
      street: '450 West 33rd Street, Apt 18B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States'
    },
    shippingMethod: INITIAL_SHIPPING_METHODS[0],
    paymentMethod: {
      type: 'credit_card',
      last4: '4242',
      brand: 'Visa'
    },
    paymentStatus: 'paid',
    status: 'delivered',
    subtotal: 434,
    discount: 43.4,
    couponCode: 'WELCOME10',
    shippingCost: 0,
    tax: 33.20,
    total: 423.80,
    trackingNumber: 'TRK-9928174US',
    carrier: 'FedEx Priority',
    notes: 'Please leave at the concierge front desk.',
    timeline: [
      {
        id: 'tl-1',
        status: 'new',
        title: 'Order Placed',
        description: 'Payment authorized and verified.',
        timestamp: '2026-08-14T09:12:00Z'
      },
      {
        id: 'tl-2',
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Inventory reserved at New York Fulfillment Center.',
        timestamp: '2026-08-14T09:30:00Z'
      },
      {
        id: 'tl-3',
        status: 'processing',
        title: 'Packaging & Quality Check',
        description: 'Packaged in recyclable luxury magnetic box with inspection seal.',
        timestamp: '2026-08-14T14:00:00Z'
      },
      {
        id: 'tl-4',
        status: 'shipped',
        title: 'Dispatched via FedEx Priority',
        description: 'Carrier picked up package. Tracking # TRK-9928174US.',
        timestamp: '2026-08-15T08:20:00Z',
        location: 'Newark Dispatch Hub, NJ'
      },
      {
        id: 'tl-5',
        status: 'delivered',
        title: 'Delivered',
        description: 'Signed and accepted at building reception.',
        timestamp: '2026-08-16T13:45:00Z',
        location: 'New York, NY 10001'
      }
    ],
    createdAt: '2026-08-14T09:12:00Z',
    updatedAt: '2026-08-16T13:45:00Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'AUR-89411',
    customer: {
      id: 'usr-cust-2',
      name: 'Alexander Hayes',
      email: 'a.hayes@architect.design',
      phone: '+1 (555) 902-8114'
    },
    items: [
      {
        id: 'item-3',
        productId: 'prod-4',
        product: INITIAL_PRODUCTS[3],
        quantity: 1,
        selectedVariant: {
          color: { name: 'Cognac Saddle', hex: '#9a3412' }
        },
        unitPrice: 480
      },
      {
        id: 'item-4',
        productId: 'prod-3',
        product: INITIAL_PRODUCTS[2],
        quantity: 1,
        selectedVariant: {
          color: { name: 'Charcoal Melange', hex: '#374151' },
          size: 'L'
        },
        unitPrice: 220
      }
    ],
    shippingAddress: {
      fullName: 'Alexander Hayes',
      email: 'a.hayes@architect.design',
      phone: '+1 (555) 902-8114',
      street: '880 Michigan Ave',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60611',
      country: 'United States'
    },
    billingAddress: {
      fullName: 'Alexander Hayes',
      email: 'a.hayes@architect.design',
      phone: '+1 (555) 902-8114',
      street: '880 Michigan Ave',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60611',
      country: 'United States'
    },
    shippingMethod: INITIAL_SHIPPING_METHODS[1],
    paymentMethod: {
      type: 'apple_pay'
    },
    paymentStatus: 'paid',
    status: 'shipped',
    subtotal: 700,
    discount: 50,
    couponCode: 'LUXURY50',
    shippingCost: 24,
    tax: 55.25,
    total: 729.25,
    trackingNumber: 'DHL-558291048',
    carrier: 'DHL Express',
    timeline: [
      {
        id: 'tl-10',
        status: 'new',
        title: 'Order Placed',
        description: 'Payment captured via Apple Pay.',
        timestamp: '2026-08-18T10:00:00Z'
      },
      {
        id: 'tl-11',
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Items allocated from Chicago distribution warehouse.',
        timestamp: '2026-08-18T10:15:00Z'
      },
      {
        id: 'tl-12',
        status: 'processing',
        title: 'Packed & Weighed',
        description: 'Security tags affixed and custom dust bag included.',
        timestamp: '2026-08-18T16:00:00Z'
      },
      {
        id: 'tl-13',
        status: 'shipped',
        title: 'In Transit with DHL Express',
        description: 'Estimated delivery tomorrow by 3:00 PM.',
        timestamp: '2026-08-19T06:30:00Z',
        location: 'O’Hare Transit Facility, IL'
      }
    ],
    createdAt: '2026-08-18T10:00:00Z',
    updatedAt: '2026-08-19T06:30:00Z'
  },
  {
    id: 'ord-1003',
    orderNumber: 'AUR-89412',
    customer: {
      id: 'usr-cust-3',
      name: 'Sophie Laurent',
      email: 'sophie.laurent@paris.fr',
      phone: '+33 6 12 34 56 78'
    },
    items: [
      {
        id: 'item-5',
        productId: 'prod-2',
        product: INITIAL_PRODUCTS[1],
        quantity: 1,
        selectedVariant: {
          color: { name: 'Rose Gold & Saddle', hex: '#b45309' },
          size: '38mm Case'
        },
        unitPrice: 495
      }
    ],
    shippingAddress: {
      fullName: 'Sophie Laurent',
      email: 'sophie.laurent@paris.fr',
      phone: '+33 6 12 34 56 78',
      street: '14 Rue de Rivoli',
      city: 'Paris',
      state: 'Île-de-France',
      postalCode: '75004',
      country: 'France'
    },
    billingAddress: {
      fullName: 'Sophie Laurent',
      email: 'sophie.laurent@paris.fr',
      phone: '+33 6 12 34 56 78',
      street: '14 Rue de Rivoli',
      city: 'Paris',
      state: 'Île-de-France',
      postalCode: '75004',
      country: 'France'
    },
    shippingMethod: INITIAL_SHIPPING_METHODS[0],
    paymentMethod: {
      type: 'credit_card',
      last4: '9812',
      brand: 'Mastercard'
    },
    paymentStatus: 'paid',
    status: 'processing',
    subtotal: 495,
    discount: 0,
    shippingCost: 0,
    tax: 42.08,
    total: 537.08,
    timeline: [
      {
        id: 'tl-20',
        status: 'new',
        title: 'Order Placed',
        description: 'Payment authorized.',
        timestamp: '2026-08-19T14:15:00Z'
      },
      {
        id: 'tl-21',
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Authenticity certificate serial generated.',
        timestamp: '2026-08-19T14:40:00Z'
      },
      {
        id: 'tl-22',
        status: 'processing',
        title: 'Hand Assembly & Inspection',
        description: 'Watch regulated on timing machine prior to boxing.',
        timestamp: '2026-08-20T03:00:00Z'
      }
    ],
    createdAt: '2026-08-19T14:15:00Z',
    updatedAt: '2026-08-20T03:00:00Z'
  },
  {
    id: 'ord-1004',
    orderNumber: 'AUR-89413',
    customer: {
      name: 'Oliver Thorne',
      email: 'oliver.thorne@london.co.uk',
      phone: '+44 20 7946 0912'
    },
    items: [
      {
        id: 'item-6',
        productId: 'prod-5',
        product: INITIAL_PRODUCTS[4],
        quantity: 2,
        selectedVariant: {
          color: { name: 'Warm Terracotta', hex: '#c2410c' }
        },
        unitPrice: 195
      }
    ],
    shippingAddress: {
      fullName: 'Oliver Thorne',
      email: 'oliver.thorne@london.co.uk',
      phone: '+44 20 7946 0912',
      street: '22 Kensington High St',
      city: 'London',
      state: 'Greater London',
      postalCode: 'W8 4PT',
      country: 'United Kingdom'
    },
    billingAddress: {
      fullName: 'Oliver Thorne',
      email: 'oliver.thorne@london.co.uk',
      phone: '+44 20 7946 0912',
      street: '22 Kensington High St',
      city: 'London',
      state: 'Greater London',
      postalCode: 'W8 4PT',
      country: 'United Kingdom'
    },
    shippingMethod: INITIAL_SHIPPING_METHODS[0],
    paymentMethod: {
      type: 'paypal'
    },
    paymentStatus: 'paid',
    status: 'new',
    subtotal: 390,
    discount: 0,
    shippingCost: 0,
    tax: 33.15,
    total: 423.15,
    timeline: [
      {
        id: 'tl-30',
        status: 'new',
        title: 'Order Placed',
        description: 'Customer completed PayPal express checkout.',
        timestamp: '2026-08-20T05:10:00Z'
      }
    ],
    createdAt: '2026-08-20T05:10:00Z',
    updatedAt: '2026-08-20T05:10:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    productName: 'Aura Studio Lossless ANC Headphones',
    userId: 'usr-cust-1',
    userName: 'Jane Doe',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    title: 'The acoustic resolution is astounding',
    comment: 'I own several $800+ studio headphones, but the Aura Studio blew me away with its balanced mid-range and punchy sub-bass. The ANC blocks out subway rumble completely without creating ear pressure.',
    isVerifiedBuyer: true,
    status: 'approved',
    createdAt: '2026-08-17T11:00:00Z',
    reply: {
      text: 'Thank you Jane! Our acoustic engineering team spent 18 months fine-tuning those titanium drivers. We are thrilled you love the resolution.',
      repliedAt: '2026-08-17T14:30:00Z',
      repliedBy: 'Aura Sound Team'
    }
  },
  {
    id: 'rev-2',
    productId: 'prod-4',
    productName: 'Vanguard Italian Leather Weekender Bag',
    userId: 'usr-cust-2',
    userName: 'Alexander Hayes',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    title: 'Incredible craftsmanship and patina',
    comment: 'The scent of real Italian vachetta leather right when opening the box is unforgettable. Heavy duty brass zips and spacious enough for 4 days of travel with laptop and shoes separated.',
    isVerifiedBuyer: true,
    status: 'approved',
    createdAt: '2026-08-18T15:20:00Z'
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    productName: 'Atelier Minimalist Automatic Watch',
    userId: 'usr-cust-3',
    userName: 'Sophie Laurent',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    title: 'Pure elegance on the wrist',
    comment: 'The exhibition caseback showing the automatic rotor movement is mesmerizing. Clean dial, smooth sweeping second hand, and the Horween leather strap broke in on day one.',
    isVerifiedBuyer: true,
    status: 'approved',
    createdAt: '2026-08-19T16:00:00Z'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act-1',
    userId: 'usr-admin-1',
    userName: 'Elena Rostova',
    userRole: 'Super Admin',
    action: 'Order Status Updated',
    entityType: 'order',
    entityId: 'AUR-89410',
    details: 'Marked order as Delivered with FedEx tracking confirmation.',
    timestamp: '2026-08-16T13:45:00Z',
    ip: '192.168.1.104'
  },
  {
    id: 'act-2',
    userId: 'usr-admin-1',
    userName: 'Elena Rostova',
    userRole: 'Super Admin',
    action: 'Product Inventory Updated',
    entityType: 'product',
    entityId: 'AUR-HP-001',
    details: 'Restocked +20 units of Aura Studio ANC Headphones.',
    timestamp: '2026-08-17T09:15:00Z',
    ip: '192.168.1.104'
  },
  {
    id: 'act-3',
    userId: 'usr-mgr-1',
    userName: 'Marcus Vance',
    userRole: 'Manager',
    action: 'Review Replied',
    entityType: 'review',
    entityId: 'rev-1',
    details: 'Published official reply to Jane Doe review.',
    timestamp: '2026-08-17T14:30:00Z',
    ip: '192.168.1.118'
  },
  {
    id: 'act-4',
    userId: 'usr-mgr-1',
    userName: 'Marcus Vance',
    userRole: 'Manager',
    action: 'Order Dispatched',
    entityType: 'order',
    entityId: 'AUR-89411',
    details: 'Generated shipping label via DHL Express (DHL-558291048).',
    timestamp: '2026-08-19T06:30:00Z',
    ip: '192.168.1.118'
  }
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: 'AURA LUXURY ATELIER',
  storeTagline: 'Modern Minimalist Goods Crafted for a Lifetime',
  currency: {
    code: 'USD',
    symbol: '$',
    rate: 1.0
  },
  supportEmail: 'concierge@aura.store',
  supportPhone: '+1 (800) 555-AURA',
  address: '742 Evergreen Terrace, San Francisco, CA 94107',
  taxRate: 8.5,
  freeShippingThreshold: 150,
  orderAutoConfirm: true,
  lowStockAlertThreshold: 5,
  maintenanceMode: false,
  socialLinks: {
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    facebook: 'https://facebook.com'
  }
};

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'The Art of Slow Metallurgy: Crafting Aerospace-Grade Titanium Acoustics',
    slug: 'the-art-of-slow-metallurgy-titanium-acoustics',
    excerpt: 'An inside look into our metallurgical foundry in Kyoto, where raw titanium ingots undergo 48 hours of precision CNC acoustic milling to eliminate micro-harmonic distortions.',
    content: `## The Quest for Pure Resonance

In the realm of high-fidelity transducers, material rigidity and damping coefficient dictate everything. While polycarbonate and injection-molded plastics dominate mass manufacturing, they introduce subtle cabinet flex at sub-harmonic frequencies.

At AURA Atelier, our engineering thesis was simple: **what if we carved an acoustic chamber out of an uncompromised solid billet of Grade 5 Titanium?**

> "Titanium exhibits a unique strength-to-density ratio that prevents resonant standing waves, delivering absolute silence between the notes."
> — *Kenji Takahashi, Head of Acoustic Metallurgy*

### 1. The 48-Hour Micro-Milling Process
Each ear-cup housing begins as a solid 2.4-kilogram cylindrical titanium ingot. Over two continuous days of subterranean 5-axis CNC machining, 94% of the metal is carefully carved away in temperature-controlled coolant baths. The resulting shell weighs merely 62 grams, yet retains extraordinary structural tension.

### 2. Hand-Polishing with Diamond Paste
Following the precision CNC cut, each chassis is hand-burnished by master artisans using progressive micron-grade diamond slurries. This produces a satin, anisotropic brush texture that ages gracefully without fingerprints or oxidation.

### 3. Harmonic Damping & Leather Integration
To isolate the 40mm bio-cellulose dynamic drivers, the interior chamber is lined with micro-perforated damping foam and sealed with vegetable-tanned Italian lambskin. The result is a soundstage that expands beyond physical boundaries—revealing the subtle breath of a vocalist and the micro-textures of orchestral strings.`,
    coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Elena Rostova',
      role: 'Principal Acoustic Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
    },
    category: 'Materials & Metallurgy',
    tags: ['Acoustics', 'Titanium', 'Craftsmanship', 'Industrial Design', 'Kyoto'],
    readTime: '6 min read',
    publishedAt: '2026-08-20T10:00:00Z',
    status: 'published',
    featured: true,
    relatedProductIds: ['prod-1', 'prod-2'],
    likes: 142,
    views: 1890,
    comments: [
      {
        id: 'c-1',
        postId: 'blog-1',
        userName: 'Julian Vance',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
        comment: 'The acoustic separation on the Masterpiece headphones is unlike anything I have heard in 20 years of mastering audio. Fascinating breakdown of the titanium milling!',
        createdAt: '2026-08-21T14:22:00Z'
      },
      {
        id: 'c-2',
        postId: 'blog-1',
        userName: 'Aria Montgomery',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
        comment: 'Love the deep dive into the Kyoto workshop. True craftsmanship is so rare these days.',
        createdAt: '2026-08-22T09:15:00Z'
      }
    ]
  },
  {
    id: 'blog-2',
    title: 'Vegetable-Tanned Buttero Leather: A Century-Old Tuscan Heritage',
    slug: 'vegetable-tanned-buttero-leather-tuscan-heritage',
    excerpt: 'Exploring the Santa Croce sull’Arno tanneries where chestnut tannins, slow wooden drum tumbling, and organic fats yield leather that develops an inimitable amber patina over decades.',
    content: `## The Soul of Tuscan Vegetable Tanning

Modern fast fashion relies almost exclusively on chromium tanning—a chemical process that finishes hides in hours but creates inert, plastic-feeling surfaces that peel rather than age.

In contrast, our leather goods are shaped exclusively from **Pelle Conciata al Vegetale in Toscana**, certified by the Italian Leather Consortium.

### What Makes Buttero Leather Extraordinary?
Sourced from full-grain French cattle hides, Buttero leather undergoes a 60-day natural tanning ritual in subterranean wooden drums filled with organic extracts from chestnut and mimosa bark.

* **Natural Tactility:** The natural grain is never corrected or sanded down.
* **Warm Organic Scent:** Sweet, earthy, and unmistakable.
* **The Living Patina:** As you carry our Weekender Bag or Slim Cardholder, body heat, natural oils, and sunlight gradually transform the leather into a rich, lustrous honey-amber hue.

> "A fine leather object is not finished when it leaves our workshop. It is merely born. Its true character is written by the life of its owner."

### Caring for Full-Grain Leather
To maintain suppleness without darkening the surface, we recommend applying a light natural beeswax balm once every four seasons. Allow it to absorb overnight, then gently buff with a horsehair brush.`,
    coverImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Matteo Bellini',
      role: 'Master Leather Tanner & Artisan',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop'
    },
    category: 'Craft & Provenance',
    tags: ['Leather', 'Tuscany', 'Patina', 'Slow Fashion', 'Sustainability'],
    readTime: '5 min read',
    publishedAt: '2026-08-15T08:30:00Z',
    status: 'published',
    featured: false,
    relatedProductIds: ['prod-6', 'prod-7'],
    likes: 98,
    views: 1420,
    comments: [
      {
        id: 'c-3',
        postId: 'blog-2',
        userName: 'Soren Lindqvist',
        comment: 'My Atelier weekender is already developing a deep caramel sheen after just six months of travel. Unbeatable quality.',
        createdAt: '2026-08-16T11:45:00Z'
      }
    ]
  },
  {
    id: 'blog-3',
    title: 'The Philosophy of Reductive Form: Dieter Rams Meets Modern Living',
    slug: 'philosophy-of-reductive-form-modern-living',
    excerpt: 'Why eliminating extraneous details is the most difficult design discipline. How our design team approaches proportion, optical weight, and enduring functional minimalism.',
    content: `## Less, But Uncompromising

When creating objects that inhabit your daily living sanctuary, the greatest challenge is knowing when to stop designing. Every seam, bezel, button, and indicator light must earn its right to exist.

### The Principles of Quiet Design
1. **Honesty of Purpose:** A clock must celebrate time; an audio amplifier must celebrate acoustic clarity.
2. **Invisible Ergonomics:** Controls that fall naturally under the fingertips without visual searching.
3. **Monochrome Harmony:** Utilizing natural metal tones, deep obsidian, and warm neutrals to avoid visual fatigue.

> "Good design is as little design as possible. It concentrates on the essential aspects, and the products are not burdened with non-essentials."

In our latest homeware and desk accessories, you will notice zero external branding on primary faces. Luxury is not a logo; it is the tactile click of an anodized aluminum dial, the weighted balance of a brass pen, and the seamless convergence of glass and stone.`,
    coverImage: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Claire Moreau',
      role: 'Creative Director of Design',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop'
    },
    category: 'Design Philosophy',
    tags: ['Minimalism', 'Industrial Design', 'Interior', 'Architecture'],
    readTime: '4 min read',
    publishedAt: '2026-08-10T15:00:00Z',
    status: 'published',
    featured: false,
    relatedProductIds: ['prod-8', 'prod-9'],
    likes: 215,
    views: 2900,
    comments: [
      {
        id: 'c-4',
        postId: 'blog-3',
        userName: 'David Miller',
        comment: 'This philosophy is why I keep coming back to Aura. No unnecessary lights or gimmicks—just pure, honest form.',
        createdAt: '2026-08-11T16:05:00Z'
      }
    ]
  },
  {
    id: 'blog-4',
    title: 'Horological Precision: Automatic Movements & Sapphire Optics',
    slug: 'horological-precision-automatic-movements-sapphire-optics',
    excerpt: 'An exploration into the heartbeat of our automatic chronographs, calibrated to within -4/+6 seconds per day and encased in double-domed anti-reflective sapphire crystal.',
    content: `## 28,800 Vibrations Per Hour

At the core of the Atelier Chronograph lies a bespoke 26-jewel automatic mechanical caliber. Driven solely by the kinetic motion of the wearer’s wrist, it requires no battery, no software update, and no planned obsolescence.

### The Engineering Anatomy
* **Glucydur Balance Wheel:** Engineered from a copper-beryllium-iron alloy to remain immune to thermal expansion.
* **Double-Domed Sapphire Crystal:** Second only to diamond in Mohs hardness (9/10), treated with 5 layers of internal anti-reflective coating for distortion-free legibility in glaring sunlight.
* **Surgical 316L Stainless Case:** Saltwater-proof and corrosion-resistant up to 100 meters of hydrostatic pressure.

### The Joy of Mechanical Autonomy
In an era dominated by disposable smart screens and fleeting notifications, glancing down at a sweeping second hand is a grounding ritual. It connects us to 300 years of horological engineering.`,
    coverImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Jean-Luc Berthier',
      role: 'Chief Horologist',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop'
    },
    category: 'Craft & Provenance',
    tags: ['Horology', 'Timepieces', 'Sapphire', 'Mechanical', 'Swiss Calibration'],
    readTime: '7 min read',
    publishedAt: '2026-08-04T12:00:00Z',
    status: 'published',
    featured: false,
    relatedProductIds: ['prod-4', 'prod-5'],
    likes: 180,
    views: 2150,
    comments: []
  },
  {
    id: 'blog-5',
    title: 'Lifetime Garment Preservation: The Definitive Merino & Cashmere Care Guide',
    slug: 'lifetime-garment-preservation-merino-cashmere-care-guide',
    excerpt: 'Step-by-step master rituals for washing, de-pilling, seasonal cedar storage, and steam pressing your fine knitwear and tailoring pieces.',
    content: `## Caring for Noble Natural Fibers

Fine knitwear spun from Grade-A Mongolian cashmere and extrafine Australian merino wool possesses remarkable natural elasticity and odor resistance. However, improper laundering is the primary cause of fiber distress.

### 1. Washing Ritual
* **Frequency:** Natural wool fibers need washing only once every 5 to 7 wears. Often, simply airing the garment overnight in a well-ventilated room will naturally refresh the fibers.
* **Water Temperature:** Strictly tepid or cold (never exceeding 30°C / 86°F).
* **Detergent:** Use a pH-neutral wool wash containing natural lanolin to restore fiber lubrication.

### 2. Drying & Reshaping
Never wring or hang wet knitwear, as water weight will deform shoulder seams.
1. Lay the damp sweater flat on a clean dry towel.
2. Roll the towel up like a cylinder and press gently to absorb excess moisture.
3. Unroll and dry flat on a horizontal drying mesh away from direct heat sources.

### 3. Off-Season Cedar Storage
Before storing knitwear for summer, ensure pieces are cleaned. Store in breathable organic cotton garment boxes with aromatic red cedar blocks to naturally deter moths.`,
    coverImage: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Claire Moreau',
      role: 'Creative Director of Design',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop'
    },
    category: 'Care Guide',
    tags: ['Care Guide', 'Cashmere', 'Merino Wool', 'Sustainable Living', 'Longevity'],
    readTime: '5 min read',
    publishedAt: '2026-07-28T09:00:00Z',
    status: 'published',
    featured: false,
    relatedProductIds: ['prod-3'],
    likes: 89,
    views: 1100,
    comments: []
  }
];
