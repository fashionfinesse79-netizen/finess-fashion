'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Color, Size } from '@/lib/types';
import { formatINR } from '@/lib/store';
import { X, Heart, ShoppingBag, Ruler, Check } from 'lucide-react';

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isInWishlist, setSizeGuideOpen } = useStore();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);

  if (!quickViewProduct) return null;

  const color = selectedColor || quickViewProduct.colors[0];
  const size = selectedSize || quickViewProduct.sizes[0];
  const inWish = isInWishlist(quickViewProduct.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#FAF6F0] overflow-hidden border border-[#58111A]/15 shadow-2xl max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 text-[#7A3B43] hover:text-[#58111A] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Image Gallery */}
        <div className="w-full md:w-1/2 relative bg-white flex flex-col items-center justify-center p-6 border-r border-[#58111A]/15">
          <div className="relative w-full aspect-[3/4] overflow-hidden border border-[#58111A]/15">
            <Image
              src={quickViewProduct.images[activeImageIdx] || quickViewProduct.images[0]}
              alt={quickViewProduct.name}
              fill
              className="object-cover transition-all duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Thumbnails */}
          {quickViewProduct.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {quickViewProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative w-12 h-16 border ${
                    activeImageIdx === idx ? 'border-[#58111A]' : 'border-transparent opacity-60'
                  }`}
                >
                  <Image src={img} alt="Thumb" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase font-semibold">
                {quickViewProduct.category}
              </span>
              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className="p-1.5 text-[#A3757C] hover:text-red-500 transition-colors"
              >
                <Heart className={`w-5 h-5 ${inWish ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#58111A] font-medium leading-tight mb-1">
              {quickViewProduct.name}
            </h2>
            <p className="text-xs text-[#7A3B43] italic mb-4">{quickViewProduct.tagline}</p>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-lg font-light text-[#58111A]">
                {formatINR(quickViewProduct.price)}
              </span>
              {quickViewProduct.originalPrice && (
                <span className="text-xs text-[#A3757C] line-through">
                  {formatINR(quickViewProduct.originalPrice)}
                </span>
              )}
            </div>

            {/* Color Selector */}
            <div className="mb-5">
              <label className="block text-[11px] uppercase tracking-widest text-[#7A3B43] mb-2 font-medium">
                Color: <span className="text-[#58111A]">{color.name}</span>
              </label>
              <div className="flex gap-2">
                {quickViewProduct.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`w-7 h-7 rounded-full border-2 p-0.5 transition-all ${
                      color.name === c.name ? 'border-[#58111A] scale-110' : 'border-transparent'
                    }`}
                    title={c.name}
                  >
                    <span
                      className="block w-full h-full rounded-full border border-black/10"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] uppercase tracking-widest text-[#7A3B43] font-medium">
                  Size: <span className="text-[#58111A]">{size}</span>
                </label>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] text-[#D4AF37] underline tracking-wider"
                >
                  <Ruler className="w-3 h-3" /> Size Guide
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {quickViewProduct.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-2 text-xs border tracking-wider transition-all ${
                      size === s
                        ? 'bg-[#58111A] text-[#FAF6F0] border-[#58111A]'
                        : 'border-[#58111A]/15 text-[#58111A] hover:border-[#58111A]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#58111A]/15">
            <button
              onClick={() => {
                addToCart(quickViewProduct, color, size, 1);
                setQuickViewProduct(null);
              }}
              className="w-full py-3.5 bg-[#58111A] text-[#FAF6F0] hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors text-xs tracking-[0.2em] uppercase font-medium flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Bag
            </button>

            <Link
              href={`/product/${quickViewProduct.slug}`}
              onClick={() => setQuickViewProduct(null)}
              className="block w-full text-center py-2 text-xs uppercase tracking-widest text-[#7A3B43] hover:text-[#58111A] transition-colors"
            >
              View Full Product Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
