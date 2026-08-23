'use client';

import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import { useStore } from '@/context/StoreContext';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { products, wishlist } = useStore();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center pb-8 border-b border-[#58111A]/15">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">
          SAVED CURATION
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl text-[#58111A] mt-1">
          MY WISHLIST ({savedProducts.length})
        </h1>
      </div>

      {savedProducts.length === 0 ? (
        <div className="text-center py-20 bg-[#FAF6F0] border border-[#58111A]/15 space-y-4">
          <Heart className="w-12 h-12 text-[#D4AF37] mx-auto stroke-[1]" />
          <h2 className="font-serif-luxury text-2xl text-[#58111A]">Your Wishlist is Empty</h2>
          <p className="text-xs text-[#7A3B43]">Click the heart icon on any garment to save it to your personal edit.</p>
          <Link href="/shop" className="inline-block px-8 py-3 bg-[#58111A] text-[#FAF6F0] text-xs uppercase tracking-widest font-semibold">
            Explore Boutique
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {savedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
