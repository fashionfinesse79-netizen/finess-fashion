'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Color, Size, Coupon } from '@/lib/types';
import { getStoredProducts, getStoredCoupons, saveOrders, getStoredOrders } from '@/lib/store';

interface StoreContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  wishlist: string[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  sizeGuideOpen: boolean;
  setSizeGuideOpen: (open: boolean) => void;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  addToCart: (product: Product, selectedColor?: Color, selectedSize?: Size, quantity?: number) => void;
  removeFromCart: (index: number) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  // Cost Calculations
  subtotal: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [couponsList, setCouponsList] = useState<Coupon[]>([]);

  const freeShippingThreshold = 5000;

  // Load from database/cache on mount
  useEffect(() => {
    // 1. Initial synchronous cache render
    setProducts(getStoredProducts());

    // 2. Async database load
    async function loadDbData() {
      try {
        const [prodRes, coupRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/coupons')
        ]);
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData);
        }
        if (coupRes.ok) {
          const coupData = await coupRes.json();
          setCouponsList(coupData);
        }
      } catch (err) {
        console.error('Failed to load database data in StoreContext:', err);
      }
    }
    loadDbData();

    try {
      const savedCart = localStorage.getItem('finess_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('finess_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('finess_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('finess_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const addToCart = (
    product: Product,
    selectedColor?: Color,
    selectedSize?: Size,
    quantity: number = 1
  ) => {
    const color = selectedColor || product.colors[0];
    const size = selectedSize || product.sizes[0];

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor.name === color.name &&
          item.selectedSize === size
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, selectedColor: color, selectedSize: size, quantity }];
      }
    });

    showToast(`Added ${product.name} to Bag`);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast('Item removed from Bag');
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to Wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const applyCoupon = (code: string): boolean => {
    setCouponError(null);
    const cleanCode = code.trim().toUpperCase();
    const coupons = couponsList.length > 0 ? couponsList : getStoredCoupons();
    const found = coupons.find((c) => c.code === cleanCode && c.isActive);


    if (!found) {
      setCouponError('Invalid or expired coupon code.');
      return false;
    }

    if (subtotal < found.minPurchase) {
      setCouponError(`Minimum order value of ₹${found.minPurchase.toLocaleString()} required for this code.`);
      return false;
    }

    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied!`);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    showToast('Coupon removed');
  };

  // Cost calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const shippingFee = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : 350;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      discountAmount = Math.min(subtotal, appliedCoupon.discountValue);
    }
  }

  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  return (
    <StoreContext.Provider
      value={{
        products,
        setProducts,
        cart,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        quickViewProduct,
        setQuickViewProduct,
        sizeGuideOpen,
        setSizeGuideOpen,
        appliedCoupon,
        couponError,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        removeCoupon,
        toastMessage,
        showToast,
        subtotal,
        freeShippingThreshold,
        freeShippingRemaining,
        shippingFee,
        discountAmount,
        totalAmount
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
