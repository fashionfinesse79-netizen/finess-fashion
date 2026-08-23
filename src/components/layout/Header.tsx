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


      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-header border-b border-[#58111A]/15 py-3 shadow-md'
            : 'bg-white py-5 border-b border-[#58111A]/10'
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
          <nav className="hidden lg:flex items-center gap-8 w-1/3">
            {mainNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors hover:text-[#D4AF37] ${
                  pathname === link.href ? 'text-[#D4AF37]' : 'text-[#58111A]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Centered Brand Logo: FINESSE FASHION BY DHANI Image Logo */}
          <div className="text-center flex-1 flex flex-col items-center justify-center">
            <Link href="/" className="inline-block group">
              <div className={`relative transition-all duration-300 flex items-center justify-center ${
                isScrolled ? 'w-20 h-20' : 'w-28 h-28'
              }`}>
                <Image
                  src="/logo.jpg"
                  alt="Finesse Fashion By Dhani Logo"
                  fill
                  sizes="(max-w-768px) 80px, 112px"
                  priority
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Desktop & Mobile Right: Actions (Search, Account, Wishlist, Cart) */}
          <div className="flex items-center justify-end gap-4 sm:gap-6 w-1/4 lg:w-1/3">
            
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden lg:block p-1.5 text-[#58111A] hover:text-[#D4AF37] transition-colors"
              title="Search store"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            <Link
              href="/account"
              className="p-1.5 text-[#58111A] hover:text-[#D4AF37] transition-colors"
              title="My Account"
            >
              <User className="w-5 h-5 stroke-[1.5]" />
            </Link>

            <Link
              href="/wishlist"
              className="relative p-1.5 text-[#58111A] hover:text-[#D4AF37] transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#58111A] text-[#FAF6F0] text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 text-[#58111A] hover:text-[#D4AF37] transition-colors"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#D4AF37] text-[#58111A] text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
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
