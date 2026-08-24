'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { Search, Heart, ShoppingBag, User, Menu, X, Sparkles } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { cart, wishlist, setIsCartOpen } = useStore();
  const { user } = useAuth();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const mainNavLinks = [
    { name: 'NEW IN', href: '/shop?collection=New+Arrivals' },
    { name: 'COLLECTIONS', href: '/shop' },
    { name: 'SHOP', href: '/shop' }
  ];

  return (
    <>
      {/* Premium Announcement Bar */}
      <div className="bg-[#58111A] text-[#FAF6F0] text-[9px] sm:text-[10px] tracking-[0.25em] font-medium py-2 px-4 uppercase text-center border-b border-[#D4AF37]/30 flex items-center justify-center gap-1.5 shadow-sm">
        <Sparkles className="w-3 h-3 text-[#D4AF37] animate-pulse" />
        <span>COMPLIMENTARY SHIPPING ACROSS INDIA & COMPLIMENTARY BOXPACKING</span>
        <Sparkles className="w-3 h-3 text-[#D4AF37] animate-pulse" />
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'glass-header border-b border-[#D4AF37]/20 py-2.5 shadow-[0_4px_30px_rgba(88,17,26,0.03)]'
            : 'bg-white py-4 border-b border-[#58111A]/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Mobile Left: Hamburger Menu */}
          <div className="flex items-center lg:hidden gap-3 w-1/4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-[#58111A] hover:text-[#D4AF37] transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </button>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 text-[#58111A] hover:text-[#D4AF37] transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Desktop Left: Balanced Nav Links (NEW IN, COLLECTIONS, SHOP) */}
          <nav className="hidden lg:flex items-center gap-10 w-1/3">
            {mainNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase py-1 group transition-colors duration-300 ${
                    isActive ? 'text-[#D4AF37]' : 'text-[#58111A] hover:text-[#D4AF37]'
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-[1.5px] bg-[#D4AF37] transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              );
            })}
          </nav>

          {/* Centered Brand Logo: FINESSE FASHION BY DHANI Medallion Seal */}
          <div className="text-center flex-1 flex flex-col items-center justify-center">
            <Link href="/" className="inline-block group relative z-10">
              <div className={`relative transition-all duration-500 flex items-center justify-center rounded-full overflow-hidden border border-[#D4AF37]/20 shadow-md group-hover:border-[#D4AF37]/70 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] filter group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.4)] ${
                isScrolled ? 'w-16 h-16 sm:w-18 sm:h-18' : 'w-24 h-24 sm:w-28 sm:h-28'
              }`}>
                <Image
                  src="/logo.jpg"
                  alt="Finesse Fashion By Dhani Logo"
                  fill
                  sizes="(max-w-768px) 80px, 112px"
                  priority
                  className="object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </Link>
          </div>

          {/* Desktop & Mobile Right: Actions (Search, Account, Wishlist, Cart) */}
          <div className="flex items-center justify-end gap-3 sm:gap-5 w-1/4 lg:w-1/3">
            
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden lg:block p-2 text-[#58111A] hover:text-[#D4AF37] hover:scale-110 transition-all duration-300 cursor-pointer"
              title="Search store"
            >
              <Search className="w-[18px] h-[18px] stroke-[1.5]" />
            </button>

            <Link
              href="/account"
              className="p-2 text-[#58111A] hover:text-[#D4AF37] hover:scale-110 transition-all duration-300 flex items-center justify-center"
              title="My Account"
            >
              <User className="w-[18px] h-[18px] stroke-[1.5]" />
            </Link>

            <Link
              href="/wishlist"
              className="relative p-2 text-[#58111A] hover:text-[#D4AF37] hover:scale-110 transition-all duration-300 flex items-center justify-center"
              title="Wishlist"
            >
              <Heart className="w-[18px] h-[18px] stroke-[1.5]" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#58111A] text-[#FAF6F0] text-[8px] font-bold rounded-full flex items-center justify-center border border-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#58111A] hover:text-[#D4AF37] hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-[18px] h-[18px] stroke-[1.5]" />
              {totalCartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#D4AF37] text-[#58111A] text-[8px] font-black rounded-full flex items-center justify-center border border-white shadow-sm animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>

        </div>


        {/* Global Expandable Search Bar */}
        {searchOpen && (
          <div className="mt-3 border-t border-[#58111A]/10 bg-[#FAF6F0] py-4 px-4 sm:px-8 animate-fade-in">
            <div className="max-w-3xl mx-auto relative">
              <input
                type="text"
                placeholder="Search luxury silk gowns, maroon co-ords, tops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery) {
                    window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                className="w-full pl-10 pr-12 py-3 bg-white border border-[#58111A]/20 text-sm text-[#58111A] focus:outline-none focus:border-[#D4AF37]"
                autoFocus
              />
              <Search className="w-4 h-4 text-[#7A3B43] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                onClick={() => {
                  if (searchQuery) {
                    window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
                  } else {
                    setSearchOpen(false);
                  }
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs uppercase tracking-wider text-[#D4AF37] font-bold"
              >
                GO
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden animate-fade-in">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#58111A] text-[#FAF6F0] border-r border-[#D4AF37]/30 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-6 border-b border-[#D4AF37]/30">
                <div>
                  <span className="font-serif-luxury text-xl text-[#FAF6F0] font-semibold tracking-widest uppercase block">
                    FINESSE
                  </span>
                  <span className="text-[8px] tracking-[0.4em] uppercase text-[#D4AF37] block">
                    FASHION • BY DHANI
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-gray-300 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="mt-8 space-y-6">
                {mainNavLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-semibold tracking-[0.2em] uppercase text-[#FAF6F0] hover:text-[#D4AF37]"
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/order-tracking"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold tracking-[0.2em] uppercase text-[#D4AF37]"
                >
                  ORDER TRACKING
                </Link>
                {user?.isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-semibold tracking-[0.2em] uppercase text-white"
                  >
                    ADMIN CONSOLE
                  </Link>
                )}
              </nav>
            </div>

            <div className="pt-6 border-t border-[#D4AF37]/30 space-y-3 text-xs text-[#FAF6F0]/80">
              <p className="font-serif-luxury italic text-sm text-[#D4AF37]">"The Art of Elegance"</p>
              <p>Atelier Concierge: concierge@finesse.fashion</p>
              <p>+91 98200 88888</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
