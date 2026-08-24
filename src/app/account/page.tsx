'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import { formatINR, getStoredOrders } from '@/lib/store';
import { User, Package, MapPin, Heart, LogOut, ShieldAlert, KeyRound, Plus } from 'lucide-react';

export default function AccountPage() {
  const { user, login, register, logout, isAdminMode, toggleAdminMode, addAddress } = useAuth();
  const { products, toggleWishlist, wishlist } = useStore();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'wishlist'>('orders');
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);

  // Forgot password flow states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setError(null);
    setForgotLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });

      if (res.ok) {
        setForgotSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to request password reset.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleTabToggle = (loginTab: boolean) => {
    setIsLoginTab(loginTab);
    setError(null);
  };

  // Address form
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Mumbai');
  const [newState, setNewState] = useState('Maharashtra');
  const [newPincode, setNewPincode] = useState('400001');

  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }
    setLoadingOrders(true);
    try {
      // Orders are stored in localStorage (same source admin uses)
      // Filter by the current user's email
      const allOrders = getStoredOrders();
      const userEmail = user.email?.toLowerCase();
      const myOrders = allOrders.filter((o: any) => {
        const orderEmail = o.customer?.email?.toLowerCase();
        return orderEmail === userEmail;
      });
      setOrders(myOrders);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  }, [user]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setError(null);
    if (isLoginTab) {
      const success = await login(emailInput, passInput);
      if (success) {
        const isEmailAdmin = emailInput.trim() === 'admin@finess.fashion' || emailInput.trim() === 'admin@finesse.fashion';
        if (isEmailAdmin) {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
    } else {
      const success = await register(nameInput || 'FINESSE Client', emailInput, passInput);
      if (success) {
        router.push('/account');
      } else {
        setError('Registration failed. The email might already be registered.');
      }
    }
  };

  const handleAddAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet) return;
    await addAddress({
      fullName: user?.name || 'Client',
      email: user?.email || '',
      phone: user?.phone || '+91 98200 00000',
      street: newStreet,
      city: newCity,
      state: newState,
      pincode: newPincode,
      country: 'India'
    });
    setNewStreet('');
  };

  const savedWishlistProducts = products.filter((p) => wishlist.includes(p.id));

  if (!user) {
    if (showForgotPassword) {
      return (
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-[#FAF6F0] p-8 border border-[#58111A]/15 shadow-sm space-y-6">
            <div className="text-center">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">
                ATELIER MEMBER PORTAL
              </span>
              <h1 className="font-serif-luxury text-3xl text-[#58111A] mt-1">
                RESET PASSWORD
              </h1>
              <p className="text-xs text-[#7A3B43] mt-2 font-light">
                Enter your email address and we will send you a secure link to reset your password.
              </p>
            </div>

            {forgotSuccess ? (
              <div className="space-y-4">
                <div className="bg-[#58111A]/5 text-[#58111A] text-xs border border-[#58111A]/15 p-4 uppercase tracking-wider font-semibold leading-relaxed">
                  If an account is associated with that email, a password reset link has been dispatched. 
                  <span className="block mt-2 text-[10px] text-gray-400 normal-case font-normal italic">
                    (In development mode, you can find the link logged in the server console)
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotSuccess(false);
                    setForgotEmail('');
                  }}
                  className="w-full py-3.5 bg-[#58111A] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors"
                >
                  RETURN TO SIGN IN
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-700 text-xs border border-red-200 p-3 font-semibold uppercase tracking-wider">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#7A3B43] font-semibold mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="ananya@finesse.fashion"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#58111A]/15 text-xs text-[#58111A] focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 bg-[#58111A] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors disabled:opacity-50"
                >
                  {forgotLoading ? 'SENDING REQUEST...' : 'SEND RESET LINK'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setError(null);
                  }}
                  className="w-full text-center text-xs uppercase tracking-wider font-semibold text-[#7A3B43] hover:text-[#D4AF37] transition-colors"
                >
                  CANCEL
                </button>
              </form>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-[#FAF6F0] p-8 border border-[#58111A]/15 shadow-sm space-y-6">
          <div className="text-center">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">
              ATELIER MEMBER PORTAL
            </span>
            <h1 className="font-serif-luxury text-3xl text-[#58111A] mt-1">
              {isLoginTab ? 'CLIENT LOGIN' : 'CREATE AN ACCOUNT'}
            </h1>
          </div>

          <div className="flex border-b border-[#58111A]/15">
            <button
              onClick={() => handleTabToggle(true)}
              className={`flex-1 py-2 text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors ${
                isLoginTab ? 'border-[#58111A] text-[#58111A]' : 'border-transparent text-gray-400'
              }`}
            >
              SIGN IN
            </button>
            <button
              onClick={() => handleTabToggle(false)}
              className={`flex-1 py-2 text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors ${
                !isLoginTab ? 'border-[#58111A] text-[#58111A]' : 'border-transparent text-gray-400'
              }`}
            >
              REGISTER
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 text-xs border border-red-200 p-3 font-semibold uppercase tracking-wider">
                {error}
              </div>
            )}
            {!isLoginTab && (
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#7A3B43] font-semibold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Princess Ananya Singhania"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#58111A]/15 text-xs text-[#58111A] focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#7A3B43] font-semibold mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="ananya@finesse.fashion"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#58111A]/15 text-xs text-[#58111A] focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#7A3B43] font-semibold mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#58111A]/15 text-xs text-[#58111A] focus:outline-none focus:border-[#D4AF37]"
                required
              />
              {isLoginTab && (
                <div className="text-right mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setError(null);
                    }}
                    className="text-[10px] uppercase tracking-wider font-semibold text-[#7A3B43] hover:text-[#D4AF37] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#58111A] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors"
            >
              {isLoginTab ? 'SIGN IN TO PORTAL' : 'CREATE ACCOUNT'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Account Banner */}
      <div className="bg-[#FAF6F0] border border-[#58111A]/15 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">
            FINESSE PRIVATE CLIENT
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#58111A]">
            Welcome, {user.name}
          </h1>
          <p className="text-xs text-[#7A3B43] mt-1">{user.email}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {user.isAdmin && (
            <Link
              href="/admin"
              className="px-4 py-2 bg-[#D4AF37] text-[#58111A] text-xs uppercase tracking-wider font-semibold hover:bg-[#58111A] hover:text-[#FAF6F0] transition-colors"
            >
              Go to Admin Dashboard
            </Link>
          )}
          <button
            onClick={logout}
            className="px-4 py-2 border border-[#58111A] text-[#58111A] text-xs uppercase tracking-wider font-semibold hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {/* Main Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2 border-r border-[#58111A]/15 pr-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-semibold transition-colors ${
              activeTab === 'orders' ? 'bg-[#58111A] text-[#FAF6F0]' : 'text-[#7A3B43] hover:bg-[#FAF6F0]'
            }`}
          >
            <Package className="w-4 h-4" /> Order History ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-semibold transition-colors ${
              activeTab === 'addresses' ? 'bg-[#58111A] text-[#FAF6F0]' : 'text-[#7A3B43] hover:bg-[#FAF6F0]'
            }`}
          >
            <MapPin className="w-4 h-4" /> Saved Addresses ({user.addresses.length})
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-semibold transition-colors ${
              activeTab === 'wishlist' ? 'bg-[#58111A] text-[#FAF6F0]' : 'text-[#7A3B43] hover:bg-[#FAF6F0]'
            }`}
          >
            <Heart className="w-4 h-4" /> Saved Wishlist ({wishlist.length})
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="lg:col-span-9">
          
          {/* Tab 1: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="font-serif-luxury text-2xl text-[#58111A] border-b border-[#58111A]/15 pb-3">
                Your Atelier Orders
              </h2>

              {orders.length === 0 ? (
                <p className="text-xs text-[#7A3B43]">You have not placed any orders yet.</p>
              ) : (
                <div className="space-y-6">
                  {orders.map((ord) => (
                    <div key={ord.id} className="bg-white border border-[#58111A]/15 p-6 space-y-4 shadow-sm">
                      <div className="flex justify-between items-start border-b border-[#58111A]/15 pb-3">
                        <div>
                          <span className="text-xs font-semibold text-[#58111A]">Order #{ord.id}</span>
                          <span className="text-xs text-gray-400 block">{new Date(ord.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="text-right">
                          <span className="px-3 py-1 bg-[#58111A] text-[#D4AF37] text-[10px] uppercase tracking-wider font-semibold">
                            {ord.orderStatus}
                          </span>
                          <span className="text-xs font-serif-luxury font-semibold block mt-1">{formatINR(ord.totalAmount)}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {ord.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex gap-3 items-center">
                            <div className="relative w-12 h-16 bg-[#FAF6F0] border overflow-hidden flex-shrink-0">
                              <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-xs">
                              <h4 className="font-medium text-[#58111A]">{item.productName}</h4>
                              <p className="text-gray-500">{item.selectedColor} • {item.selectedSize} • Qty: {item.quantity}</p>
                              <p className="font-semibold">{formatINR(item.price)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex justify-between items-center text-xs">
                        <span className="text-gray-500">Tracking: <strong>{ord.trackingNumber}</strong></span>
                        <Link href={`/order-tracking?id=${ord.id}`} className="text-[#D4AF37] font-semibold hover:underline">
                          Track Shipment Status →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <h2 className="font-serif-luxury text-2xl text-[#58111A] border-b border-[#58111A]/15 pb-3">
                Saved Shipping Addresses
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.addresses.map((addr, idx) => (
                  <div key={idx} className="bg-[#FAF6F0] p-5 border border-[#58111A]/15 text-xs text-[#7A3B43] space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold block">Address #{idx + 1}</span>
                    <p className="font-semibold text-[#58111A]">{addr.fullName}</p>
                    <p>{addr.street}</p>
                    <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p>{addr.country}</p>
                  </div>
                ))}
              </div>

              {/* Add New Address Form */}
              <form onSubmit={handleAddAddressSubmit} className="bg-white p-6 border border-[#58111A]/15 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#58111A]">Add New Address</h3>
                <div>
                  <label className="block text-[11px] text-[#7A3B43]">Street Address</label>
                  <input
                    type="text"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full px-3 py-2 border border-[#58111A]/15 text-xs"
                    placeholder="Enter street name"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input type="text" value={newCity} onChange={(e) => setNewCity(e.target.value)} className="px-3 py-2 border border-[#58111A]/15 text-xs" placeholder="City" />
                  <input type="text" value={newState} onChange={(e) => setNewState(e.target.value)} className="px-3 py-2 border border-[#58111A]/15 text-xs" placeholder="State" />
                  <input type="text" value={newPincode} onChange={(e) => setNewPincode(e.target.value)} className="px-3 py-2 border border-[#58111A]/15 text-xs" placeholder="PIN" />
                </div>
                <button type="submit" className="px-5 py-2.5 bg-[#58111A] text-[#FAF6F0] text-xs uppercase font-semibold hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors">
                  Save Address
                </button>
              </form>
            </div>
          )}

          {/* Tab 3: Saved Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="font-serif-luxury text-2xl text-[#58111A] border-b border-[#58111A]/15 pb-3">
                Saved Wishlist Items
              </h2>

              {savedWishlistProducts.length === 0 ? (
                <p className="text-xs text-[#7A3B43]">Your wishlist is currently empty.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedWishlistProducts.map((prod) => (
                    <div key={prod.id} className="flex gap-3 p-3 bg-white border border-[#58111A]/15">
                      <img src={prod.images[0]} alt={prod.name} className="w-16 h-20 object-cover" />
                      <div className="text-xs flex-1">
                        <h4 className="font-serif-luxury font-semibold text-sm">{prod.name}</h4>
                        <p className="font-medium text-[#58111A] mt-1">{formatINR(prod.price)}</p>
                        <Link href={`/product/${prod.slug}`} className="text-[#D4AF37] underline block mt-2">
                          View Item →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
