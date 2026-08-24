'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { Product, Order, Coupon, Category, OrderStatus, Size, Poster, VideoProduct } from '@/lib/types';
import { formatINR, saveProducts, getStoredProducts, saveOrders, getStoredOrders, saveCoupons, getStoredCoupons, getStoredPosters, savePosters, getStoredVideos, saveVideos } from '@/lib/store';
import { Film, ArrowUp, ArrowDown } from 'lucide-react';
import { Package, ShoppingBag, Users, Tag, Plus, Edit, Trash2, CheckCircle2, ShieldAlert, Sparkles, RefreshCw, X } from 'lucide-react';
import { CloudinaryUpload } from '@/components/admin/CloudinaryUpload';

export default function AdminPage() {
  const { products, setProducts, showToast } = useStore();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user || !user.isAdmin) {
        router.push('/account');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !user.isAdmin) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-2 border-[#58111A] border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#58111A] font-bold">
          Verifying Atelier Credentials...
        </span>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'customers' | 'coupons' | 'posters' | 'videos'>('products');

  // Products state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // New product form
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newPrice, setNewPrice] = useState<number>(20000);
  const [newCategory, setNewCategory] = useState<Category>('Dresses');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85');
  const [newStock, setNewStock] = useState<number>(15);

  // Posters state
  const [postersList, setPostersList] = useState<Poster[]>(getStoredPosters());
  const [editingPoster, setEditingPoster] = useState<Poster | null>(null);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [newPosterTitle, setNewPosterTitle] = useState('');
  const [newPosterTagline, setNewPosterTagline] = useState('');
  const [newPosterImage, setNewPosterImage] = useState('');
  const [newPosterPrimaryBtnText, setNewPosterPrimaryBtnText] = useState('');
  const [newPosterPrimaryBtnLink, setNewPosterPrimaryBtnLink] = useState('');

  // Videos state
  const [videosList, setVideosList] = useState<VideoProduct[]>(getStoredVideos());
  const [editingVideo, setEditingVideo] = useState<VideoProduct | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoThumbnail, setNewVideoThumbnail] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoOriginalPrice, setNewVideoOriginalPrice] = useState(5000);
  const [newVideoSalePrice, setNewVideoSalePrice] = useState(3500);

  // Orders state
  const [ordersList, setOrdersList] = useState<Order[]>(getStoredOrders());

  // Coupons state
  const [couponsList, setCouponsList] = useState<Coupon[]>(getStoredCoupons());

  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState(15);
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');

  // Save new/edited product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    if (editingProduct) {
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: newTitle,
              tagline: newTagline,
              price: newPrice,
              category: newCategory,
              stockQuantity: newStock,
              images: [newImage, ...p.images.slice(1)]
            }
          : p
      );
      setProducts(updated);
      saveProducts(updated);
      showToast(`Updated ${newTitle}`);
    } else {
      const newProd: Product = {
        id: `fin-${Date.now().toString().slice(-4)}`,
        slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: newTitle,
        tagline: newTagline || 'Haute couture release',
        price: newPrice,
        category: newCategory,
        collections: ['New Arrivals'],
        description: 'Bespoke silk garment cut with architectural precision.',
        fabricAndCare: ['100% Mulberry Silk', 'Dry clean only'],
        shippingAndReturns: 'Complimentary shipping across India.',
        sizeAndFit: ['Fits true to luxury size.'],
        colors: [{ name: 'Champagne Gold', hex: '#D4AF37' }],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        images: [newImage],
        inStock: true,
        stockQuantity: newStock,
        isNew: true,
        rating: 5.0,
        reviewCount: 1,
        reviews: [],
        createdAt: new Date().toISOString()
      };
      const updated = [newProd, ...products];
      setProducts(updated);
      saveProducts(updated);
      showToast(`Added new product ${newTitle}`);
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
    setNewTitle('');
    setNewTagline('');
  };

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
    showToast('Product deleted');
  };

  // Update order status
  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    const updated = ordersList.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          orderStatus: nextStatus,
          historyTimeline: [
            ...o.historyTimeline,
            {
              status: nextStatus,
              timestamp: new Date().toLocaleString(),
              description: `Status updated by Admin Atelier to ${nextStatus}.`
            }
          ]
        };
      }
      return o;
    });
    setOrdersList(updated);
    saveOrders(updated);
    showToast(`Order ${orderId} updated to ${nextStatus}`);
  };

  // Create Coupon
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    const newC: Coupon = {
      id: `c-${Date.now()}`,
      code: newCouponCode.toUpperCase().trim(),
      discountType: newCouponType,
      discountValue: newCouponValue,
      minPurchase: 10000,
      expiryDate: '2026-12-31',
      isActive: true
    };
    const updated = [newC, ...couponsList];
    setCouponsList(updated);
    saveCoupons(updated);
    showToast(`Created Coupon ${newC.code}`);
    setNewCouponCode('');
  };

  // Video CRUD
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle || !newVideoUrl) return;
    const videoData: VideoProduct = {
      id: editingVideo ? editingVideo.id : `vid-${Date.now()}`,
      title: newVideoTitle,
      thumbnailUrl: newVideoThumbnail || 'https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=800&q=80',
      videoUrl: newVideoUrl,
      originalPrice: newVideoOriginalPrice,
      salePrice: newVideoSalePrice,
      order: editingVideo ? editingVideo.order : videosList.length,
    };
    let updated;
    if (editingVideo) {
      updated = videosList.map(v => v.id === videoData.id ? videoData : v);
      showToast('Video updated');
    } else {
      updated = [...videosList, videoData];
      showToast('Video added');
    }
    setVideosList(updated);
    saveVideos(updated);
    setIsVideoModalOpen(false);
    setEditingVideo(null);
    setNewVideoTitle('');
    setNewVideoThumbnail('');
    setNewVideoUrl('');
    setNewVideoOriginalPrice(5000);
    setNewVideoSalePrice(3500);
  };

  const handleDeleteVideo = (id: string) => {
    const updated = videosList.filter(v => v.id !== id);
    setVideosList(updated);
    saveVideos(updated);
    showToast('Video deleted');
  };

  const handleMoveVideo = (id: string, direction: 'up' | 'down') => {
    const sorted = [...videosList].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(v => v.id === id);
    if (direction === 'up' && idx > 0) {
      const temp = sorted[idx].order;
      sorted[idx].order = sorted[idx - 1].order;
      sorted[idx - 1].order = temp;
    } else if (direction === 'down' && idx < sorted.length - 1) {
      const temp = sorted[idx].order;
      sorted[idx].order = sorted[idx + 1].order;
      sorted[idx + 1].order = temp;
    }
    setVideosList(sorted);
    saveVideos(sorted);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-[#58111A] text-[#FAF6F0] p-8 border border-[#D4AF37]/40 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] tracking-[0.25em] uppercase font-bold border border-[#D4AF37]/30 mb-2">
            <Sparkles className="w-3 h-3" /> HAUTE COUTURE ATELIER MANAGEMENT
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl">FINESSE ADMIN DASHBOARD</h1>
          <p className="text-xs text-gray-300 font-light mt-1">Manage luxury product catalog, orders pipeline, coupons & customer roster.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingProduct(null);
              setNewTitle('');
              setNewTagline('');
              setIsProductModalOpen(true);
            }}
            className="px-5 py-3 bg-[#D4AF37] text-[#58111A] text-xs uppercase tracking-widest font-semibold hover:bg-white transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> ADD NEW PRODUCT
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-[#58111A]/15 bg-white">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'products' ? 'border-[#58111A] text-[#58111A] bg-[#FAF6F0]' : 'border-transparent text-gray-400 hover:text-[#58111A]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Products ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'orders' ? 'border-[#58111A] text-[#58111A] bg-[#FAF6F0]' : 'border-transparent text-gray-400 hover:text-[#58111A]'
          }`}
        >
          <Package className="w-4 h-4" /> Orders ({ordersList.length})
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'coupons' ? 'border-[#58111A] text-[#58111A] bg-[#FAF6F0]' : 'border-transparent text-gray-400 hover:text-[#58111A]'
          }`}
        >
          <Tag className="w-4 h-4" /> Coupons & Discounts ({couponsList.length})
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'customers' ? 'border-[#58111A] text-[#58111A] bg-[#FAF6F0]' : 'border-transparent text-gray-400 hover:text-[#58111A]'
          }`}
        >
          <Users className="w-4 h-4" /> Customers Roster
        </button>
        
        <button
          onClick={() => setActiveTab('posters')}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'posters' ? 'border-[#58111A] text-[#58111A] bg-[#FAF6F0]' : 'border-transparent text-gray-400 hover:text-[#58111A]'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Posters ({postersList.length})
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'videos' ? 'border-[#58111A] text-[#58111A] bg-[#FAF6F0]' : 'border-transparent text-gray-400 hover:text-[#58111A]'
          }`}
        >
          <Film className="w-4 h-4" /> Videos ({videosList.length})
        </button>
      </div>

      {/* TAB 1: PRODUCTS MANAGER */}
      {activeTab === 'products' && (
        <div className="bg-white border border-[#58111A]/15 overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#58111A] text-[#FAF6F0] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Inventory</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#58111A]/15">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-[#FAF6F0]">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={prod.images[0]} alt={prod.name} className="w-10 h-12 object-cover border border-[#58111A]/15" />
                      <div>
                        <h4 className="font-semibold text-[#58111A]">{prod.name}</h4>
                        <p className="text-[10px] text-gray-400">{prod.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#7A3B43]">{prod.category}</td>
                  <td className="py-3 px-4 font-semibold text-[#58111A]">{formatINR(prod.price)}</td>
                  <td className="py-3 px-4 font-semibold">{prod.stockQuantity} pcs</td>
                  <td className="py-3 px-4">
                    {prod.inStock ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold">IN STOCK</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold">SOLD OUT</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(prod);
                          setNewTitle(prod.name);
                          setNewTagline(prod.tagline);
                          setNewPrice(prod.price);
                          setNewCategory(prod.category);
                          setNewImage(prod.images[0]);
                          setNewStock(prod.stockQuantity);
                          setIsProductModalOpen(true);
                        }}
                        className="p-1.5 bg-gray-100 text-gray-700 hover:bg-[#58111A] hover:text-white transition-colors"
                        title="Edit product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 bg-gray-100 text-gray-700 hover:bg-red-600 hover:text-white transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGER */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {ordersList.map((ord) => (
            <div key={ord.id} className="bg-white p-6 border border-[#58111A]/15 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start border-b border-[#58111A]/15 pb-4 gap-2">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">ORDER REFERENCE</span>
                  <h3 className="font-serif-luxury text-xl font-medium text-[#58111A]">#{ord.id} • {ord.customer.fullName}</h3>
                  <p className="text-xs text-[#7A3B43]">{ord.customer.email} • {ord.customer.phone}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-serif-luxury font-bold text-lg block text-[#58111A]">{formatINR(ord.totalAmount)}</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-700">Payment: {ord.paymentMethod} ({ord.paymentStatus})</span>
                </div>
              </div>

              {/* Delivery Address & Status Pipeline Controller */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div>
                  <h4 className="font-semibold text-[#58111A] uppercase tracking-wider mb-1">Shipping Address:</h4>
                  <p className="text-[#7A3B43]">{ord.customer.street}, {ord.customer.city}, {ord.customer.state} - {ord.customer.pincode}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-[#58111A] uppercase tracking-wider">Update Fulfillment Pipeline Status:</h4>
                  <div className="flex gap-2">
                    <select
                      value={ord.orderStatus}
                      onChange={(e: any) => handleUpdateOrderStatus(ord.id, e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-[#58111A]/15 text-xs font-semibold text-[#58111A] focus:outline-none"
                    >
                      <option value="Placed">Placed</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: COUPONS MANAGER */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white border border-[#58111A]/15 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#58111A] text-[#FAF6F0] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Min Purchase</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#58111A]/15">
                {couponsList.map((c) => (
                  <tr key={c.id}>
                    <td className="py-3 px-4 font-bold text-[#58111A]">{c.code}</td>
                    <td className="py-3 px-4 font-semibold text-[#D4AF37]">
                      {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : formatINR(c.discountValue)}
                    </td>
                    <td className="py-3 px-4">{formatINR(c.minPurchase)}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold">ACTIVE</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:col-span-5 bg-[#FAF6F0] p-6 border border-[#58111A]/15 space-y-4">
            <h3 className="font-serif-luxury text-xl text-[#58111A]">Create Discount Code</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#7A3B43] mb-1">Coupon Code (e.g. VIP20)</label>
                <input
                  type="text"
                  placeholder="ROYAL20"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="w-full px-3 py-2 border border-[#58111A]/15 bg-white uppercase font-bold text-[#58111A]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#7A3B43] mb-1">Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e: any) => setNewCouponType(e.target.value)}
                    className="w-full px-3 py-2 border border-[#58111A]/15 bg-white text-[#58111A]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#7A3B43] mb-1">Value</label>
                  <input
                    type="number"
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#58111A]/15 bg-white text-[#58111A]"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-[#58111A] text-[#FAF6F0] text-xs uppercase tracking-wider font-semibold hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors">
                Generate Coupon Code
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOMERS ROSTER */}
      {activeTab === 'customers' && (
        <div className="bg-white border border-[#58111A]/15 p-6 space-y-4">
          <h3 className="font-serif-luxury text-2xl text-[#58111A]">Registered Private Clients</h3>
          <div className="p-4 bg-[#FAF6F0] border border-[#58111A]/15 flex justify-between items-center text-xs">
            <div>
              <h4 className="font-semibold text-[#58111A]">Ananya Singhania</h4>
              <p className="text-gray-500">ananya@finesse.fashion • +91 98200 98765</p>
            </div>
            <span className="px-3 py-1 bg-[#58111A] text-[#D4AF37] text-[10px] uppercase font-bold">VIP MEMBER</span>
          </div>
        </div>
      )}
{/* TAB 5: POSTERS MANAGER */}
{activeTab === 'posters' && (
  <div className="bg-white border border-[#58111A]/15 overflow-x-auto shadow-sm">
    <div className="flex justify-between items-center p-4">
      <h3 className="font-serif-luxury text-xl text-[#58111A]">Hero Posters</h3>
      <button
        onClick={() => {
          setEditingPoster(null);
          setNewPosterTitle('');
          setNewPosterTagline('');
          setNewPosterImage('');
          setNewPosterPrimaryBtnText('');
          setNewPosterPrimaryBtnLink('');
          setIsPosterModalOpen(true);
        }}
        className="px-5 py-2 bg-[#D4AF37] text-[#58111A] text-xs uppercase tracking-widest font-semibold hover:bg-white transition-colors flex items-center gap-2"
      >
        <Plus className="w-4 h-4" /> ADD NEW POSTER
      </button>
    </div>
    <table className="w-full text-left text-xs">
      <thead>
        <tr className="bg-[#58111A] text-[#FAF6F0] uppercase tracking-wider font-semibold">
          <th className="py-3 px-4">Title</th>
          <th className="py-3 px-4">Tagline</th>
          <th className="py-3 px-4">Image</th>
          <th className="py-3 px-4">Primary Btn</th>
          <th className="py-3 px-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#58111A]/15">
        {postersList.map(p => (
          <tr key={p.id} className="hover:bg-[#FAF6F0]">
            <td className="py-3 px-4">{p.title}</td>
            <td className="py-3 px-4">{p.tagline}</td>
            <td className="py-3 px-4">
              <img src={p.image} alt={p.title} className="w-16 h-12 object-cover border border-[#58111A]/15" />
            </td>
            <td className="py-3 px-4">
              {p.primaryBtnText && <a href={p.primaryBtnLink} className="text-[#58111A] underline">{p.primaryBtnText}</a>}
            </td>
            <td className="py-3 px-4 text-right">
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setEditingPoster(p);
                    setNewPosterTitle(p.title);
                    setNewPosterTagline(p.tagline);
                    setNewPosterImage(p.image);
                    setNewPosterPrimaryBtnText(p.primaryBtnText);
                    setNewPosterPrimaryBtnLink(p.primaryBtnLink);
                    setIsPosterModalOpen(true);
                  }}
                  className="p-1.5 bg-gray-100 text-gray-700 hover:bg-[#58111A] hover:text-white transition-colors"
                  title="Edit poster"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    const updated = postersList.filter(post => post.id !== p.id);
                    setPostersList(updated);
                    savePosters(updated);
                    showToast('Poster deleted');
                  }}
                  className="p-1.5 bg-gray-100 text-gray-700 hover:bg-red-600 hover:text-white transition-colors"
                  title="Delete poster"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

      {/* TAB 6: VIDEOS MANAGER */}
      {activeTab === 'videos' && (
        <div className="bg-white border border-[#58111A]/15 overflow-x-auto shadow-sm">
          <div className="flex justify-between items-center p-4">
            <h3 className="font-serif-luxury text-xl text-[#58111A]">Video Lookbook</h3>
            <button
              onClick={() => {
                setEditingVideo(null);
                setNewVideoTitle('');
                setNewVideoThumbnail('');
                setNewVideoUrl('');
                setNewVideoOriginalPrice(5000);
                setNewVideoSalePrice(3500);
                setIsVideoModalOpen(true);
              }}
              className="px-5 py-2 bg-[#D4AF37] text-[#58111A] text-xs uppercase tracking-widest font-semibold hover:bg-white transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> ADD NEW VIDEO
            </button>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#58111A] text-[#FAF6F0] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Thumbnail</th>
                <th className="py-3 px-4">Original Price</th>
                <th className="py-3 px-4">Sale Price</th>
                <th className="py-3 px-4">Video URL</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#58111A]/15">
              {[...videosList].sort((a, b) => a.order - b.order).map((v, idx) => (
                <tr key={v.id} className="hover:bg-[#FAF6F0]">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveVideo(v.id, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                        title="Move up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveVideo(v.id, 'down')}
                        disabled={idx === videosList.length - 1}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                        title="Move down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#58111A]">{v.title}</td>
                  <td className="py-3 px-4">
                    <img src={v.thumbnailUrl} alt={v.title} className="w-16 h-24 object-cover border border-[#58111A]/15 rounded" />
                  </td>
                  <td className="py-3 px-4">{formatINR(v.originalPrice)}</td>
                  <td className="py-3 px-4 text-[#D4AF37] font-bold">{formatINR(v.salePrice)}</td>
                  <td className="py-3 px-4 max-w-[200px] truncate text-gray-500">{v.videoUrl}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingVideo(v);
                          setNewVideoTitle(v.title);
                          setNewVideoThumbnail(v.thumbnailUrl);
                          setNewVideoUrl(v.videoUrl);
                          setNewVideoOriginalPrice(v.originalPrice);
                          setNewVideoSalePrice(v.salePrice);
                          setIsVideoModalOpen(true);
                        }}
                        className="p-1.5 bg-gray-100 text-gray-700 hover:bg-[#58111A] hover:text-white transition-colors"
                        title="Edit video"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(v.id)}
                        className="p-1.5 bg-gray-100 text-gray-700 hover:bg-red-600 hover:text-white transition-colors"
                        title="Delete video"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {videosList.length === 0 && (
            <div className="p-10 text-center text-gray-400 text-xs">
              No videos added yet. Click &quot;Add New Video&quot; to create your first video lookbook item.
            </div>
          )}
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#FAF6F0] border border-[#58111A]/15 p-6 shadow-2xl space-y-4">
            <button onClick={() => setIsProductModalOpen(false)} className="absolute top-4 right-4 text-gray-500">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif-luxury text-2xl text-[#58111A]">
              {editingProduct ? 'Edit Garment Details' : 'Add New Garment to Boutique'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#7A3B43] mb-1">Product Title</label>
                <input
                  type="text"
                  placeholder="The Royale Velvet Corset Gown"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#58111A]/15 bg-white text-[#58111A]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#7A3B43] mb-1">Editorial Tagline</label>
                <input
                  type="text"
                  placeholder="Pure mulberry silk with hand zari embroidery"
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  className="w-full px-3 py-2 border border-[#58111A]/15 bg-white text-[#58111A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#7A3B43] mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#58111A]/15 bg-white text-[#58111A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#7A3B43] mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-[#58111A]/15 bg-white text-[#58111A]"
                  >
                    <option value="Dresses">Dresses</option>
                    <option value="Co-Ord Sets">Co-Ord Sets</option>
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Occasion Wear">Occasion Wear</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#7A3B43] mb-1">Image URL</label>
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full px-3 py-2 border border-[#58111A]/15 bg-white text-[#58111A]"
                />
                <CloudinaryUpload
                  currentValue={newImage}
                  onUploadSuccess={(url) => setNewImage(url)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#7A3B43] mb-1">Stock Quantity</label>
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#58111A]/15 bg-white text-[#58111A]"
                />
              </div>

              <button type="submit" className="w-full py-3 bg-[#58111A] text-[#FAF6F0] uppercase tracking-wider font-semibold hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors">
                Save Product to Atelier Store
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Poster Add / Edit Modal */}
      {isPosterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#FAF6F0] border border-[#58111A]/15 p-6 shadow-2xl space-y-4">
            <button onClick={() => setIsPosterModalOpen(false)} className="absolute top-4 right-4 text-gray-500">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif-luxury text-2xl text-[#58111A]">
              {editingPoster ? 'Edit Poster' : 'Add New Poster'}
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const posterData: Poster = {
                id: editingPoster ? editingPoster.id : `poster-${Date.now()}`,
                title: newPosterTitle,
                tagline: newPosterTagline,
                subtitle: '',
                description: '',
                scriptTitle: '',
                image: newPosterImage,
                primaryBtnText: newPosterPrimaryBtnText,
                primaryBtnLink: newPosterPrimaryBtnLink,
                secondaryBtnText: '',
                secondaryBtnLink: ''
              };
              let updated;
              if (editingPoster) {
                updated = postersList.map(p => p.id === posterData.id ? posterData : p);
                showToast('Poster updated');
              } else {
                updated = [posterData, ...postersList];
                showToast('New poster added');
              }
              setPostersList(updated);
              savePosters(updated);
              setIsPosterModalOpen(false);
              setEditingPoster(null);
              setNewPosterTitle('');
              setNewPosterTagline('');
              setNewPosterImage('');
              setNewPosterPrimaryBtnText('');
              setNewPosterPrimaryBtnLink('');
            }} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#7A3B43] mb-1">Title</label>
                <input type="text" value={newPosterTitle} onChange={e => setNewPosterTitle(e.target.value)} className="w-full px-3 py-2 border border-[#58111A]/15 bg-white text-[#58111A]" required />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#7A3B43] mb-1">Tagline</label>
                <input type="text" value={newPosterTagline} onChange={e => setNewPosterTagline(e.target.value)} className="w-full px-3 py-2 border border-[#58111A]/15 bg-white text-[#58111A]" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#7A3B43] mb-1">Image URL</label>
                <input type="text" value={newPosterImage} onChange={e => setNewPosterImage(e.target.value)} className="w-full px-3 py-2 border border-[#58111A]/15 bg-white text-[#58111A]" />
                <CloudinaryUpload
                  currentValue={newPosterImage}
                  onUploadSuccess={(url) => setNewPosterImage(url)}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#7A3B43] mb-1">Primary Button Text</label>
                <input type="text" value={newPosterPrimaryBtnText} onChange={e => setNewPosterPrimaryBtnText(e.target.value)} className="w-full px-3 py-2 border border-[#58111A]/15 bg-white text-[#58111A]" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#7A3B43] mb-1">Primary Button Link</label>
                <input type="text" value={newPosterPrimaryBtnLink} onChange={e => setNewPosterPrimaryBtnLink(e.target.value)} className="w-full px-3 py-2 border border-[#58111A]/15 bg-white text-[#58111A]" />
              </div>
              <button type="submit" className="w-full py-3 bg-[#58111A] text-[#FAF6F0] uppercase tracking-wider font-semibold hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors">
                {editingPoster ? 'Update Poster' : 'Create Poster'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Video Add / Edit Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#FAF6F0] border border-[#58111A]/15 p-6 shadow-2xl space-y-4">
            <button onClick={() => setIsVideoModalOpen(false)} className="absolute top-4 right-4 text-gray-500">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif-luxury text-2xl text-[#58111A]">
              {editingVideo ? 'Edit Video' : 'Add New Video'}
            </h3>
            <form onSubmit={handleSaveVideo} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#7A3B43] mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Silk Drape Saree Lookbook"
                  value={newVideoTitle}
                  onChange={e => setNewVideoTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#58111A]/15 bg-white text-[#58111A]"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#7A3B43] mb-1">Thumbnail URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={newVideoThumbnail}
                  onChange={e => setNewVideoThumbnail(e.target.value)}
                  className="w-full px-3 py-2 border border-[#58111A]/15 bg-white text-[#58111A]"
                />
                <CloudinaryUpload
                  currentValue={newVideoThumbnail}
                  onUploadSuccess={(url) => setNewVideoThumbnail(url)}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#7A3B43] mb-1">Video URL (YouTube or direct MP4 link)</label>
                <input
                  type="text"
                  placeholder="https://youtube.com/watch?v=... or https://example.com/video.mp4"
                  value={newVideoUrl}
                  onChange={e => setNewVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-[#58111A]/15 bg-white text-[#58111A]"
                  required
                />
                <CloudinaryUpload
                  currentValue={newVideoUrl}
                  onUploadSuccess={(url) => setNewVideoUrl(url)}
                  resourceType="video"
                  label="Upload Video from Device"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#7A3B43] mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={newVideoOriginalPrice}
                    onChange={e => setNewVideoOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#58111A]/15 bg-white text-[#58111A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#7A3B43] mb-1">Sale Price (₹)</label>
                  <input
                    type="number"
                    value={newVideoSalePrice}
                    onChange={e => setNewVideoSalePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#58111A]/15 bg-white text-[#58111A]"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-[#58111A] text-[#FAF6F0] uppercase tracking-wider font-semibold hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors">
                {editingVideo ? 'Update Video' : 'Add Video to Lookbook'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
