import { Product, Coupon, Order, Poster } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'fin-001',
    slug: 'the-elysian-silk-gown',
    name: 'The Elysian Silk Gown',
    tagline: 'Hand-draped pure mulberry silk with champagne metallic embroidery',
    price: 34500,
    originalPrice: 42000,
    category: 'Occasion Wear',
    collections: ['New Arrivals', 'The Royal Edit'],
    description: 'A masterpiece of couture craftsmanship. The Elysian Silk Gown features a sculpted corseted bodice and fluid asymmetric draping crafted from pure mulberry silk. Designed for galas and black-tie affairs, it radiates quiet opulence.',
    fabricAndCare: [
      '100% Pure Mulberry Silk',
      'Champagne Zari hand-embroidery',
      'Specialist dry clean only',
      'Store in provided breathable cotton garment bag'
    ],
    shippingAndReturns: 'Complimentary white-glove courier shipping across India within 3-5 business days. 14-day return window for unworn items with original security tags attached.',
    sizeAndFit: [
      'Fits true to size. Take your standard luxury size.',
      'Designed to skim the curves with a floor-sweeping hem.',
      'Model is 178cm / 5\'10" and wearing size S.'
    ],
    colors: [
      { name: 'Champagne Gold', hex: '#D4AF37' },
      { name: 'Ivory Noir', hex: '#FAF8F5' },
      { name: 'Midnight Charcoal', hex: '#1C1B1A' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85'
    ],
    inStock: true,
    stockQuantity: 12,
    isNew: true,
    isBestseller: true,
    isFeatured: true,
    rating: 5.0,
    reviewCount: 0,
    createdAt: '2026-07-15T10:00:00Z',
    reviews: []
  },
  {
    id: 'fin-002',
    slug: 'aurora-pleated-coord-set',
    name: 'Aurora Pleated Co-Ord Set',
    tagline: 'Precision pleated satin top with tailored wide-leg trousers',
    price: 22800,
    originalPrice: 26500,
    category: 'Co-Ord Sets',
    collections: ['New Arrivals', 'Silken Silhouette'],
    description: 'Effortless sophistication meets sculptural movement. The Aurora Co-Ord features micro-pleated satin construction in warm parchment tone, paired with high-waisted fluid wide-leg pants.',
    fabricAndCare: [
      'Japanese Micro-Pleated Satin Silk',
      'Elasticized concealed waistband',
      'Steam iron inside-out on low heat',
      'Dry clean recommended'
    ],
    shippingAndReturns: 'Complimentary shipping across India. Standard returns valid within 14 days.',
    sizeAndFit: [
      'Relaxed high-fashion silhouette.',
      'Pants feature elasticated back waist for flexible fit.',
      'Model is 176cm / 5\'9" wearing size S.'
    ],
    colors: [
      { name: 'Warm Beige', hex: '#E8DED1' },
      { name: 'Obsidian Black', hex: '#121212' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85'
    ],
    inStock: true,
    stockQuantity: 18,
    isNew: true,
    isBestseller: true,
    isFeatured: true,
    rating: 5.0,
    reviewCount: 0,
    createdAt: '2026-07-20T10:00:00Z',
    reviews: []
  },
  {
    id: 'fin-003',
    slug: 'monarch-sculpted-blazer',
    name: 'Monarch Sculpted Wool Blazer',
    tagline: 'Hourglass tailored silhouette with gold filigree hardware buttons',
    price: 28900,
    category: 'Outerwear',
    collections: ['The Royal Edit'],
    description: 'The definitive power jacket. Cut from heavy virgin wool blend with structured shoulders and pinched waistline, accented with bespoke hand-molded champagne gold crest buttons.',
    fabricAndCare: [
      '70% Virgin Wool, 30% Silk Satin Lining',
      'Custom brushed brass buttons',
      'Dry clean only'
    ],
    shippingAndReturns: 'Dispatched in custom garment gift box. 14 days easy exchange.',
    sizeAndFit: [
      'Tailored architectural silhouette.',
      'Model is wearing size S.'
    ],
    colors: [
      { name: 'Charcoal Black', hex: '#1A1A1A' },
      { name: 'Ivory Cream', hex: '#F7F4EE' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=85'
    ],
    inStock: true,
    stockQuantity: 8,
    isNew: false,
    isBestseller: true,
    isFeatured: true,
    rating: 5.0,
    reviewCount: 0,
    createdAt: '2026-06-10T10:00:00Z',
    reviews: []
  },
  {
    id: 'fin-004',
    slug: 'celeste-draped-corset-top',
    name: 'Celeste Draped Satin Corset Top',
    tagline: 'Structured boning with fluid organza cowl neck detail',
    price: 14500,
    category: 'Tops',
    collections: ['New Arrivals', 'Resort & Riviera'],
    description: 'Sensual yet structured, the Celeste Corset Top weaves architectural internal boning with a delicate hand-draped silk cowl overlay. Pairs seamlessly with tailored trousers or high-waisted skirts.',
    fabricAndCare: [
      '100% Silk Satin & Silk Organza',
      'Concealed back zip closure',
      'Dry clean only'
    ],
    shippingAndReturns: 'Complimentary shipping across India within 3 business days.',
    sizeAndFit: [
      'Structured form fit around torso.',
      'Size up if between sizes.'
    ],
    colors: [
      { name: 'Champagne Gold', hex: '#D4AF37' },
      { name: 'Blush Pearl', hex: '#F3E5DC' },
      { name: 'Raven Black', hex: '#000000' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&w=1200&q=85'
    ],
    inStock: true,
    stockQuantity: 15,
    isNew: true,
    isBestseller: false,
    isFeatured: false,
    rating: 5.0,
    reviewCount: 0,
    createdAt: '2026-07-25T10:00:00Z',
    reviews: []
  },
  {
    id: 'fin-005',
    slug: 'valencia-silk-wide-leg-trousers',
    name: 'Valencia High-Waist Silk Trousers',
    tagline: 'Fluid double-creased floor-length tailored trousers',
    price: 16800,
    category: 'Bottoms',
    collections: ['Silken Silhouette'],
    description: 'Designed for statuesque elegance, Valencia trousers feature a high-rise waistline, dual front pleats, and sweeping floor-length wide legs in heavy crepe-de-chine silk.',
    fabricAndCare: [
      'Heavy Silk Crepe-de-Chine',
      'Horn button closure',
      'Dry clean only'
    ],
    shippingAndReturns: 'Complimentary shipping across India.',
    sizeAndFit: [
      'High-waisted wide-leg cut.',
      'Model is 177cm tall.'
    ],
    colors: [
      { name: 'Sand Beige', hex: '#D8CBB7' },
      { name: 'Midnight Charcoal', hex: '#1C1B1A' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85'
    ],
    inStock: true,
    stockQuantity: 20,
    isNew: false,
    isBestseller: true,
    isFeatured: false,
    rating: 5.0,
    reviewCount: 0,
    createdAt: '2026-05-18T10:00:00Z',
    reviews: []
  },
  {
    id: 'fin-006',
    slug: 'solaris-embellished-maxi-dress',
    name: 'Solaris Embellished Linen Maxi Dress',
    tagline: 'Hand-strung crystal bead trim with keyhole back opening',
    price: 26400,
    originalPrice: 31000,
    category: 'Dresses',
    collections: ['Resort & Riviera', 'New Arrivals'],
    description: 'Breathable Belgian linen meets discreet red-carpet shimmer. Featuring hand-sewn glass bead edging along the plunging neck and keyhole back.',
    fabricAndCare: [
      '100% Organic Belgian Linen',
      'Hand-applied crystal beads',
      'Delicate hand wash or dry clean'
    ],
    shippingAndReturns: '14-day easy return policy.',
    sizeAndFit: [
      'Column silhouette with soft fluid stretch.',
      'Model wears size Small.'
    ],
    colors: [
      { name: 'Ivory White', hex: '#FAF7F2' },
      { name: 'Sunburnt Gold', hex: '#CBA76B' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85'
    ],
    inStock: true,
    stockQuantity: 10,
    isNew: true,
    isBestseller: false,
    isFeatured: true,
    rating: 5.0,
    reviewCount: 0,
    createdAt: '2026-07-28T10:00:00Z',
    reviews: []
  },
  {
    id: 'fin-007',
    slug: 'seraphina-cape-gown',
    name: 'Seraphina Velvet Cape Gown',
    tagline: 'Deep emerald silk-velvet gown with sweeping shoulder capelet',
    price: 39500,
    category: 'Occasion Wear',
    collections: ['The Royal Edit'],
    description: 'Regal drama reimagined. Seraphina is crafted from heavy silk-velvet with an integrated capelet that flows gently behind as you move.',
    fabricAndCare: [
      '80% Silk Velvet, 20% Mulberry Silk',
      'Dry clean only',
      'Do not steam directly'
    ],
    shippingAndReturns: 'Delivered in luxury velvet hanger garment bag.',
    sizeAndFit: [
      'Full floor length gown with trailing cape.',
      'Model wears size M.'
    ],
    colors: [
      { name: 'Noir Emerald', hex: '#0F281E' },
      { name: 'Royal Onyx', hex: '#111111' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85'
    ],
    inStock: true,
    stockQuantity: 6,
    isNew: false,
    isBestseller: true,
    isFeatured: true,
    rating: 5.0,
    reviewCount: 0,
    createdAt: '2026-04-12T10:00:00Z',
    reviews: []
  },
  {
    id: 'fin-008',
    slug: 'venetia-asymmetric-satin-dress',
    name: 'Venetia Asymmetric Satin Slip Dress',
    tagline: 'Bias-cut liquid satin dress with cowl halter neckline',
    price: 19800,
    category: 'Dresses',
    collections: ['Silken Silhouette'],
    description: 'Sensual fluid drape that caresses the body. Cut on the bias in heavy silk satin, featuring a backless cross-strap detail and gentle train hem.',
    fabricAndCare: [
      '100% Silk Satin',
      'Dry clean recommended'
    ],
    shippingAndReturns: 'Complimentary shipping across India.',
    sizeAndFit: [
      'Bias cut molds softly to silhouette.',
      'Fits true to size.'
    ],
    colors: [
      { name: 'Bronze Gold', hex: '#8C6E43' },
      { name: 'Ivory Cream', hex: '#FAF7F2' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85'
    ],
    inStock: true,
    stockQuantity: 14,
    isNew: true,
    isBestseller: false,
    isFeatured: false,
    rating: 5.0,
    reviewCount: 0,
    createdAt: '2026-07-22T10:00:00Z',
    reviews: []
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c-1',
    code: 'FINESS10',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 10000,
    expiryDate: '2026-12-31',
    isActive: true
  },
  {
    id: 'c-2',
    code: 'WELCOME5000',
    discountType: 'fixed',
    discountValue: 5000,
    minPurchase: 30000,
    expiryDate: '2026-12-31',
    isActive: true
  },
  {
    id: 'c-3',
    code: 'ROYAL15',
    discountType: 'percentage',
    discountValue: 15,
    minPurchase: 25000,
    expiryDate: '2026-11-30',
    isActive: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-88241',
    trackingNumber: 'FIN-EX-99214',
    createdAt: '2026-08-05T14:30:00Z',
    customer: {
      fullName: 'Ananya Singhania',
      email: 'ananya@finess.fashion',
      phone: '+91 98200 12345',
      street: '14, Altamount Road, Cumballa Hill',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400026',
      country: 'India'
    },
    items: [
      {
        productId: 'fin-001',
        productName: 'The Elysian Silk Gown',
        productImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
        selectedColor: 'Champagne Gold',
        selectedSize: 'S',
        price: 34500,
        quantity: 1
      }
    ],
    subtotal: 34500,
    shippingFee: 0,
    discountAmount: 3450,
    couponCode: 'FINESS10',
    totalAmount: 31050,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    estimatedDelivery: '2026-08-08',
    historyTimeline: [
      { status: 'Paid', timestamp: '2026-08-05 15:10', description: 'Payment verified via Razorpay UPI.' },
      { status: 'Processing', timestamp: '2026-08-06 09:00', description: 'Hand-inspected by Atelier Quality Team.' },
      { status: 'Shipped', timestamp: '2026-08-07 08:30', description: 'Handed to BlueDart Express Air Courier.' }
    ]
  }
];

export const INITIAL_POSTERS: Poster[] = [
  {
    id: 'post-1',
    tagline: 'HAUTE COUTURE • AUTUMN / WINTER',
    title: 'FINESSE FASHION',
    subtitle: 'BY DHANI',
    scriptTitle: 'The Art of Elegance',
    description: 'Timeless silhouettes. Modern femininity. Sculpted for the extraordinary.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80',
    primaryBtnText: 'SHOP COLLECTION',
    primaryBtnLink: '/shop',
    secondaryBtnText: 'EXPLORE THE HOUSE',
    secondaryBtnLink: '/about'
  },
  {
    id: 'post-2',
    tagline: 'EXCLUSIVE RELEASE • VELVET ROYALTY',
    title: 'THE DYNASTY GOWNS',
    subtitle: 'ATELIER EXCLUSIVE',
    scriptTitle: 'Velvet & Shadows',
    description: 'Plunge into deep emerald and onyx shades made of heavy silk-velvet fabrics.',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=80',
    primaryBtnText: 'VIEW GOWNS',
    primaryBtnLink: '/shop?category=Occasion+Wear',
    secondaryBtnText: 'SIZE GUIDE',
    secondaryBtnLink: '/size-guide'
  },
  {
    id: 'post-3',
    tagline: 'SILK ESSENTIALS • ATELIER ESSENTIALS',
    title: 'SILKEN SILHOUETTES',
    subtitle: 'NEW IN STORE',
    scriptTitle: 'Liquid Gold Flow',
    description: 'Everyday opulence crafted from 100% pure organic mulberry silk.',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1400&q=80',
    primaryBtnText: 'EXPLORE NEW IN',
    primaryBtnLink: '/shop?collection=New+Arrivals',
    secondaryBtnText: 'OUR HERITAGE',
    secondaryBtnLink: '/about'
  }
];
