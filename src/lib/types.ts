export type Category = 
  | 'Dresses'
  | 'Co-Ord Sets'
  | 'Tops'
  | 'Bottoms'
  | 'Outerwear'
  | 'Occasion Wear';

export type Collection = 
  | 'New Arrivals'
  | 'The Royal Edit'
  | 'Silken Silhouette'
  | 'Resort & Riviera'
  | 'Bestsellers';

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type Color = {
  name: string;
  hex: string;
};

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  category: Category;
  collections: Collection[];
  description: string;
  fabricAndCare: string[];
  shippingAndReturns: string;
  sizeAndFit: string[];
  colors: Color[];
  sizes: Size[];
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  isNew?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  selectedColor: Color;
  selectedSize: Size;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  selectedColor: string;
  selectedSize: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 
  | 'Pending Payment'
  | 'Paid'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type ReturnStatus =
  | 'Requested'
  | 'Approved'
  | 'Rejected'
  | 'Pickup Scheduled'
  | 'Returned'
  | 'Refund Processed';

export interface ReturnRequest {
  reason: string;
  status: ReturnStatus;
  requestedAt: string;
  adminNotes?: string;
  updatedAt?: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Order {
  id: string;
  trackingNumber: string;
  createdAt: string;
  customer: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Wallet' | 'COD';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: OrderStatus;
  estimatedDelivery: string;
  courierName?: string;
  awbNumber?: string;
  returnRequest?: ReturnRequest;
  historyTimeline: {
    status: OrderStatus;
    timestamp: string;
    description: string;
  }[];
}


export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // percentage (e.g. 10 for 10%) or fixed amount in INR
  minPurchase: number;
  expiryDate: string;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: ShippingAddress[];
  savedWishlistIds: string[];
  isAdmin: boolean;
}

export interface FilterState {
  category: string;
  collection: string;
  sizes: Size[];
  colors: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'newest';
  searchQuery: string;
}

export interface Poster {
  id: string;
  tagline: string;
  title: string;
  subtitle: string;
  scriptTitle: string;
  description: string;
  image: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
}

export interface VideoProduct {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  originalPrice: number;
  salePrice: number;
  order: number;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  postUrl: string;
  createdAt: string;
}

