'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useStore } from '@/context/StoreContext';
import { formatINR } from '@/lib/store';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';

export default function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isInWishlist, setQuickViewProduct, addToCart } = useStore();

  const inWish = isInWishlist(product.id);
  const secondaryImage = product.images[1] || product.images[0];

  return (
    <div
      className="group relative flex flex-col bg-white transition-shadow duration-300"
    >
      {/* Image Wrapper */}
      <div className="relative w-full aspect-[3/4] bg-[#FAF6F0] overflow-hidden border border-[#58111A]/15">
        
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.isNew && (
            <span className="bg-[#58111A] text-[#FAF6F0] text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 font-medium">
              NEW IN
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-[#D4AF37] text-[#58111A] text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 font-bold">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#58111A] hover:text-red-500 hover:scale-110 transition-all shadow-sm"
          title={inWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWish ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Product Images with Hover Transition - pure CSS, no JS state */}
        <Link href={`/product/${product.slug}`} className="block relative w-full h-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-500 hover-zoom-img group-hover:opacity-0"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={`${product.name} secondary view`}
              fill
              className="object-cover transition-opacity duration-500 hover-zoom-img opacity-0 group-hover:opacity-100"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
        </Link>

        {/* Quick Actions Hover Drawer - pure CSS opacity/translate */}
        <div
          className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-[#58111A]/80 to-transparent transition-all duration-300 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto"
        >
          <button
            onClick={() => setQuickViewProduct(product)}
            className="flex-1 py-2.5 bg-white/95 backdrop-blur-md text-[#58111A] text-[10px] uppercase tracking-widest font-semibold hover:bg-white hover:text-[#D4AF37] transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
          <button
            onClick={() => addToCart(product, product.colors[0], product.sizes[0], 1)}
            className="flex-1 py-2.5 bg-[#58111A] text-[#FAF6F0] text-[10px] uppercase tracking-widest font-semibold hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
          </button>
        </div>
      </div>

      {/* Info Content */}
      <div className="pt-3 pb-2 flex flex-col justify-between flex-1">
        <div>
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-[#7A3B43]">
              <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
              <span>{product.rating}</span>
            </div>
          </div>

          <Link href={`/product/${product.slug}`} className="block group-hover:text-[#D4AF37] transition-colors">
            <h3 className="font-serif-luxury text-base text-[#58111A] font-medium leading-tight mt-0.5">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-light text-[#58111A]">
            {formatINR(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-[#A3757C] line-through">
              {formatINR(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Swatches Preview */}
        {product.colors.length > 1 && (
          <div className="flex gap-1.5 mt-2">
            {product.colors.map((c) => (
              <span
                key={c.name}
                className="w-2.5 h-2.5 rounded-full border border-black/20"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />

            ))}
          </div>
        )}
      </div>
    </div>
  );
}
