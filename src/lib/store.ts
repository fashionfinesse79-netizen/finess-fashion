import { Product, Coupon, Order, User, Poster, VideoProduct } from './types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_ORDERS, INITIAL_POSTERS } from './initialData';

const PRODUCTS_KEY = 'finess_products_v1';
const COUPONS_KEY = 'finess_coupons_v1';
const ORDERS_KEY = 'finess_orders_v1';

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    if (!data) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_PRODUCTS;
  }
}

export function saveProducts(products: Product[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
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
}
