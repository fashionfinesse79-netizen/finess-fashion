'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ui/ProductCard';
import { useStore } from '@/context/StoreContext';
import { Color, Size } from '@/lib/types';
import { formatINR } from '@/lib/store';
import { Heart, ShoppingBag, Ruler, ChevronDown, ChevronUp, Star, ShieldCheck, Truck, RotateCw, Maximize2, X, Sparkles } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { products, addToCart, toggleWishlist, isInWishlist, setSizeGuideOpen } = useStore();

  const product = products.find((p) => p.slug === slug) || products[0];

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<Color>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<Size>(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<'desc' | 'fabric' | 'shipping' | 'fit'>('desc');

  const inWish = isInWishlist(product.id);

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.collections.some(c => product.collections.includes(c))))
    .slice(0, 4);

  const handleBuyNow = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Breadcrumb Navigation */}
      <nav className="text-[11px] uppercase tracking-widest text-[#A3757C] flex items-center gap-2">
        <Link href="/" className="hover:text-[#58111A]">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#58111A]">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#58111A]">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#58111A] font-medium">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Product Image Gallery */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
          
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-y-auto max-h-[600px]">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative w-20 h-28 flex-shrink-0 border-2 transition-all overflow-hidden ${
                    activeImageIdx === idx ? 'border-[#58111A] scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Display */}
          <div className="relative flex-1 aspect-[3/4] bg-[#FAF6F0] border border-[#58111A]/15 overflow-hidden group order-1 md:order-2">
            <Image
              src={product.images[activeImageIdx] || product.images[0]}
              alt={product.name}
              fill
              priority
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#58111A] hover:text-[#D4AF37] transition-colors"
              title="Fullscreen Lightbox Zoom"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right: Product Details & Buying Actions */}
        <div className="lg:col-span-5 space-y-6">
          
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">
                {product.category}
              </span>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="inline-flex items-center gap-1.5 text-xs text-[#7A3B43] hover:text-red-500 transition-colors"
              >
                <Heart className={`w-4 h-4 ${inWish ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{inWish ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#58111A] font-medium leading-tight mt-1">
              {product.name}
            </h1>
            <p className="text-xs text-[#7A3B43] italic mt-1 font-light">{product.tagline}</p>

            {/* Price & Rating */}
            <div className="flex items-center justify-between mt-4 pb-4 border-b border-[#58111A]/15">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-light text-[#58111A]">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[#A3757C] line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-[#7A3B43]">
                <div className="flex text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-[#58111A]">{product.rating}</span>
                <span>({product.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#7A3B43] font-semibold mb-2">
              Color Option: <span className="text-[#58111A]">{selectedColor.name}</span>
            </label>
            <div className="flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  className={`w-8 h-8 rounded-full border-2 p-0.5 transition-all ${
                    selectedColor.name === c.name ? 'border-[#58111A] scale-110' : 'border-transparent'
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

          {/* Size Picker */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs uppercase tracking-widest text-[#7A3B43] font-semibold">
                Select Size: <span className="text-[#58111A]">{selectedSize}</span>
              </label>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="inline-flex items-center gap-1 text-xs text-[#D4AF37] underline tracking-wider font-medium"
              >
                <Ruler className="w-3.5 h-3.5" /> Size Guide & Measurements
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`py-3 text-xs border tracking-wider font-medium transition-all ${
                    selectedSize === s
                      ? 'bg-[#58111A] text-[#FAF6F0] border-[#58111A]'
                      : 'border-[#58111A]/15 text-[#58111A] hover:border-[#58111A]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & In Stock Badge */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#7A3B43] font-semibold uppercase tracking-wider">Quantity:</span>
              <div className="inline-flex items-center border border-[#58111A]/15 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-xs text-[#7A3B43] hover:bg-[#FAF6F0]"
                >
                  -
                </button>
                <span className="px-4 text-xs font-semibold text-[#58111A]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-xs text-[#7A3B43] hover:bg-[#FAF6F0]"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span>In Stock • Ready to Dispatch</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4">
            <button
              onClick={() => addToCart(product, selectedColor, selectedSize, quantity)}
              className="w-full py-4 bg-[#58111A] text-[#FAF6F0] hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors text-xs tracking-[0.25em] uppercase font-semibold flex items-center justify-center gap-2 shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" /> ADD TO SHOPPING BAG
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full py-4 bg-[#D4AF37] text-[#58111A] hover:bg-[#58111A] hover:text-[#FAF6F0] transition-colors text-xs tracking-[0.25em] uppercase font-semibold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> BUY NOW WITH EXPRESS CHECKOUT
            </button>
          </div>

          {/* Value Props Grid */}
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#58111A]/15 text-[11px] text-[#7A3B43]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#D4AF37]" />
              <span>Complimentary India Express Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>100% Authentic Hand-finished Silk</span>
            </div>
          </div>

          {/* Expandable Accordions */}
          <div className="space-y-3 pt-2">
            
            {/* Description */}
            <div className="border-b border-[#58111A]/15 pb-3">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'desc' ? ('' as any) : 'desc')}
                className="w-full flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-[#58111A] py-1"
              >
                <span>Description & Narrative</span>
                {openAccordion === 'desc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'desc' && (
                <p className="text-xs text-[#7A3B43] font-light leading-relaxed mt-2 animate-fade-in">
                  {product.description}
                </p>
              )}
            </div>

            {/* Fabric & Care */}
            <div className="border-b border-[#58111A]/15 pb-3">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'fabric' ? ('' as any) : 'fabric')}
                className="w-full flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-[#58111A] py-1"
              >
                <span>Fabric Composition & Atelier Care</span>
                {openAccordion === 'fabric' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'fabric' && (
                <ul className="text-xs text-[#7A3B43] font-light space-y-1 mt-2 list-disc list-inside animate-fade-in">
                  {product.fabricAndCare.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Shipping & Returns */}
            <div className="border-b border-[#58111A]/15 pb-3">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'shipping' ? ('' as any) : 'shipping')}
                className="w-full flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-[#58111A] py-1"
              >
                <span>White-Glove Shipping & Returns</span>
                {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'shipping' && (
                <p className="text-xs text-[#7A3B43] font-light leading-relaxed mt-2 animate-fade-in">
                  {product.shippingAndReturns}
                </p>
              )}
            </div>

            {/* Size & Fit */}
            <div className="border-b border-[#58111A]/15 pb-3">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'fit' ? ('' as any) : 'fit')}
                className="w-full flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-[#58111A] py-1"
              >
                <span>Model Stats & Fit Advice</span>
                {openAccordion === 'fit' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'fit' && (
                <ul className="text-xs text-[#7A3B43] font-light space-y-1 mt-2 list-disc list-inside animate-fade-in">
                  {product.sizeAndFit.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* RELATED PRODUCTS / COMPLETE THE LOOK */}
      <section className="pt-16 border-t border-[#58111A]/15">
        <div className="text-center mb-10">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">
            ATELIER STYLING SUGGESTIONS
          </span>
          <h2 className="font-serif-luxury text-3xl text-[#58111A] mt-1">
            COMPLETE THE LOOK
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((relProduct) => (
            <ProductCard key={relProduct.id} product={relProduct} />
          ))}
        </div>
      </section>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white p-2 hover:opacity-80"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-4xl h-[85vh]">
            <Image
              src={product.images[activeImageIdx] || product.images[0]}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
