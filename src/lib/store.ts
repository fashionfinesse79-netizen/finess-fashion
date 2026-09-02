import { Product, Coupon, Order, User, Poster, VideoProduct, InstagramPost } from './types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_ORDERS, INITIAL_POSTERS } from './initialData';

const PRODUCTS_KEY = 'finess_products_v2';
const COUPONS_KEY = 'finess_coupons_v1';
const ORDERS_KEY = 'finess_orders_v1';

export function sanitizeProducts(products: Product[]): Product[] {
  if (!Array.isArray(products)) return [];
  return products.map((p) => {
    const reviews = Array.isArray(p.reviews) ? p.reviews : [];
    const reviewCount = reviews.length;
    const rating = reviewCount > 0
      ? Number((reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / reviewCount).toFixed(1))
      : 5.0;
    return {
      ...p,
      reviews,
      reviewCount,
      rating
    };
  });
}

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return sanitizeProducts(INITIAL_PRODUCTS);
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    if (!data) {
      localStorage.removeItem('finess_products_v1');
      const sanitized = sanitizeProducts(INITIAL_PRODUCTS);
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(sanitized));
      return sanitized;
    }
    const parsed = JSON.parse(data);
    return sanitizeProducts(parsed);
  } catch (e) {
    return sanitizeProducts(INITIAL_PRODUCTS);
  }
}

export function saveProducts(products: Product[]) {
  if (typeof window === 'undefined') return;
  const sanitized = sanitizeProducts(products);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(sanitized));

  const token = localStorage.getItem('authToken');
  fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(sanitized)
  }).catch((e) => console.error('Failed to sync products to MongoDB:', e));
}


export function getStoredCoupons(): Coupon[] {
  if (typeof window === 'undefined') return INITIAL_COUPONS;
  try {
    const data = localStorage.getItem(COUPONS_KEY);
    if (!data) {
      localStorage.setItem(COUPONS_KEY, JSON.stringify(INITIAL_COUPONS));
      return INITIAL_COUPONS;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_COUPONS;
  }
}

export function saveCoupons(coupons: Coupon[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons));

  const token = localStorage.getItem('authToken');
  fetch('/api/coupons', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(coupons)
  }).catch((e) => console.error('Failed to sync coupons to MongoDB:', e));
}


export function getStoredOrders(): Order[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    if (!data) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_ORDERS;
  }
}

export function saveOrders(orders: Order[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function getStoredPosters(): Poster[] {
  if (typeof window === 'undefined') return INITIAL_POSTERS;
  try {
    const data = localStorage.getItem('finess_posters_v1');
    if (!data) {
      localStorage.setItem('finess_posters_v1', JSON.stringify(INITIAL_POSTERS));
      return INITIAL_POSTERS;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_POSTERS;
  }
}

export function savePosters(posters: Poster[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('finess_posters_v1', JSON.stringify(posters));

  const token = localStorage.getItem('authToken');
  fetch('/api/posters', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(posters)
  }).catch((e) => console.error('Failed to sync posters to MongoDB:', e));
}


export function getStoredVideos(): VideoProduct[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('finess_videos_v1');
    if (!data) {
      localStorage.setItem('finess_videos_v1', JSON.stringify([]));
      return [];
    }
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export function saveVideos(videos: VideoProduct[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('finess_videos_v1', JSON.stringify(videos));

  const token = localStorage.getItem('authToken');
  fetch('/api/videos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(videos)
  }).catch((e) => console.error('Failed to sync videos to MongoDB:', e));
}

export function getStoredInstagram(): InstagramPost[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('finess_instagram_v1');
    if (!data) {
      localStorage.setItem('finess_instagram_v1', JSON.stringify([]));
      return [];
    }
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export function saveInstagram(posts: InstagramPost[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('finess_instagram_v1', JSON.stringify(posts));

  const token = localStorage.getItem('authToken');
  fetch('/api/instagram', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(posts)
  }).catch((e) => console.error('Failed to sync instagram feed to MongoDB:', e));
}


