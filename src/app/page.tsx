'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import VideoCarousel from '@/components/VideoCarousel';
import { useStore } from '@/context/StoreContext';
import { Sparkles, ArrowRight, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';
import { Poster, InstagramPost } from '@/lib/types';
import { getStoredPosters, getStoredInstagram } from '@/lib/store';

export default function HomePage() {
  const { products } = useStore();
  const [posters, setPosters] = useState<Poster[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [instagramFeed, setInstagramFeed] = useState<InstagramPost[]>(getStoredInstagram());

  useEffect(() => {
    async function loadPosters() {
      try {
        const res = await fetch('/api/posters');
        if (res.ok) {
          const data = await res.json();
          setPosters(data);
        } else {
          setPosters(getStoredPosters());
        }
      } catch (err) {
        setPosters(getStoredPosters());
      }
    }
    loadPosters();
  }, []);

  useEffect(() => {
    async function loadInstagram() {
      try {
        const res = await fetch('/api/instagram');
        if (res.ok) {
          const data = await res.json();
          setInstagramFeed(data);
        } else {
          setInstagramFeed(getStoredInstagram());
        }
      } catch (err) {
        setInstagramFeed(getStoredInstagram());
      }
    }
    loadInstagram();
  }, []);



  // Auto-play interval
  useEffect(() => {
    if (posters.length === 0) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % posters.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [posters]);

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % posters.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + posters.length) % posters.length);
  };

  const newCollectionProducts = products.filter((p) => p.isNew || p.collections.includes('New Arrivals')).slice(0, 4);
  const bestsellerProducts = products.filter((p) => p.isBestseller || p.rating >= 4.8).slice(0, 4);

  const categories = [
    { name: 'Dresses', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80', count: '14 Pieces' },
    { name: 'Co-Ord Sets', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80', count: '10 Pieces' },
    { name: 'Tops', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', count: '18 Pieces' },
    { name: 'Bottoms', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80', count: '12 Pieces' },
    { name: 'Outerwear', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80', count: '8 Pieces' },
    { name: 'Occasion Wear', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80', count: '16 Pieces' }
  ];

  const socialFeed = [
    'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80'
  ];

  return (
    <div className="space-y-24 pb-20 bg-white">

      {/* 1. HERO CAROUSEL SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#58111A]">
        {posters.length > 0 ? (
          posters.map((poster, index) => (
            <div
              key={poster.id}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out flex items-center justify-center ${
                index === activeSlide
                  ? 'opacity-100 scale-100 z-10 pointer-events-auto'
                  : 'opacity-0 scale-95 z-0 pointer-events-none'
              }`}
            >
              {/* Editorial Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={poster.image}
                  alt={poster.title}
                  fill
                  priority={index === 0}
                  className="object-cover object-center opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#58111A] via-[#58111A]/40 to-[#3F0A11]/60" />
              </div>

              {/* Hero Content */}
              <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-[#FAF6F0] space-y-6 pt-16">
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] font-semibold text-[#D4AF37]">
                    {poster.tagline}
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl tracking-[0.25em] text-[#FAF6F0] font-semibold uppercase">
                    {poster.title}
                  </h2>
                  {poster.subtitle && (
                    <span className="text-xs sm:text-sm tracking-[0.55em] uppercase text-[#D4AF37] block font-medium">
                      {poster.subtitle}
                    </span>
                  )}
                </div>

                {/* Premium Handwritten Glowing Script */}
                {poster.scriptTitle && (
                  <div className="py-2">
                    <h1 className="font-script-luxury text-6xl sm:text-8xl lg:text-9xl tracking-wide font-normal glowing-script-text py-2">
                      {poster.scriptTitle}
                    </h1>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-gray-200 tracking-[0.2em] font-light max-w-xl mx-auto italic">
                  {poster.description}
                </p>

                <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                  {poster.primaryBtnText && (
                    <Link
                      href={poster.primaryBtnLink || '/shop'}
                      className="w-full sm:w-auto px-9 py-4 bg-[#D4AF37] text-[#58111A] hover:bg-white hover:text-[#58111A] transition-all duration-300 text-xs tracking-[0.25em] uppercase font-bold shadow-2xl"
                    >
                      {poster.primaryBtnText}
                    </Link>
                  )}
                  {poster.secondaryBtnText && (
                    <Link
                      href={poster.secondaryBtnLink || '/about'}
                      className="w-full sm:w-auto px-9 py-4 border border-[#D4AF37]/60 text-[#FAF6F0] hover:bg-[#D4AF37]/20 transition-all duration-300 text-xs tracking-[0.25em] uppercase font-semibold backdrop-blur-sm"
                    >
                      {poster.secondaryBtnText}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          /* Fallback static content for loading */
          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-[#FAF6F0] space-y-6 pt-16">
            <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]">
              Atelier Campaign Loading...
            </span>
          </div>
        )}

        {/* Carousel Navigation Arrows */}
        {posters.length > 1 && (
          <>
            <button
              onClick={handlePrevSlide}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/15 hover:bg-[#D4AF37]/20 border border-[#FAF6F0]/20 hover:border-[#D4AF37]/50 text-[#FAF6F0] hover:text-[#D4AF37] transition-all duration-300"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/15 hover:bg-[#D4AF37]/20 border border-[#FAF6F0]/20 hover:border-[#D4AF37]/50 text-[#FAF6F0] hover:text-[#D4AF37] transition-all duration-300"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Dots Indicators */}
        {posters.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
            {posters.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`transition-all duration-300 h-1.5 rounded-full ${
                  idx === activeSlide ? 'w-8 bg-[#D4AF37]' : 'w-2.5 bg-[#FAF6F0]/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 2. NEW COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#58111A]/15 pb-6">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-bold block mb-1">
              CURATED CAPSULE
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#58111A] uppercase font-medium">
              NEW COLLECTION
            </h2>
            <p className="text-xs text-[#7A3B43] mt-1 font-light">
              Curated maroon and ivory pieces designed for the modern woman moving with intention.
            </p>
          </div>
          <Link
            href="/shop?collection=New+Arrivals"
            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-bold text-[#58111A] hover:text-[#D4AF37] transition-colors mt-4 md:mt-0"
          >
            <span>VIEW ALL NEW PIECES</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {newCollectionProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-bold block mb-1">
            EXPLORE CATEGORIES
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#58111A] uppercase font-medium">
            SHOP BY CATEGORY
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative h-80 sm:h-96 overflow-hidden border border-[#58111A]/20 shadow-md"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                loading="lazy"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#58111A]/90 via-[#58111A]/20 to-transparent transition-opacity duration-300" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] block font-semibold">
                  {cat.count}
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl text-white font-medium group-hover:translate-x-1 transition-transform uppercase">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. VIDEO LOOKBOOK CAROUSEL */}
      <VideoCarousel />

      {/* 5. FEATURED EDITORIAL COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-[#58111A] text-[#FAF6F0] p-8 sm:p-16 overflow-hidden border border-[#D4AF37]/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
          
          <div className="lg:col-span-7 space-y-6 relative z-10">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-bold block">
              CAPSULE EDIT 04
            </span>
            <h2 className="font-serif-luxury text-4xl sm:text-6xl text-[#FAF6F0] leading-tight uppercase font-light">
              THE ROYAL SILKEN EDIT
            </h2>
            <p className="text-xs sm:text-sm text-gray-200 font-light max-w-lg leading-relaxed">
              Embellished pure mulberry silks, hand-draped corsets, and fluid tailored palazzos drenched in deep maroon and champagne gold accents.
            </p>
            <div>
              <Link
                href="/shop?collection=The+Royal+Edit"
                className="inline-block px-8 py-4 bg-[#D4AF37] text-[#58111A] text-xs uppercase tracking-[0.25em] font-bold hover:bg-white transition-colors shadow-lg"
              >
                DISCOVER THE CAPSULE
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-80 sm:h-[420px] w-full border border-[#D4AF37]/40 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85"
              alt="The Royal Silken Edit"
              fill
              className="object-cover"
            />
          </div>

        </div>
      </section>

      {/* 6. BESTSELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-bold block mb-1">
            MOST COVETED
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#58111A] uppercase font-medium">
            HOUSE BESTSELLERS
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {bestsellerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. INSTAGRAM SOCIAL GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-bold block mb-1">
              @FINESSEFASHION.CO
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#58111A] uppercase font-medium">
              INSTAGRAM EDITORIAL GALLERY
            </h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#58111A] hover:text-[#D4AF37] mt-2 sm:mt-0 font-bold"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>Follow @FINESSEFASHION</span>
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {instagramFeed.map((post, idx) => (
            <a
              key={post.id || idx}
              href={post.postUrl || 'https://instagram.com/finessefashion.co'}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square overflow-hidden group border border-[#58111A]/20 block"
            >
              <Image
                src={post.imageUrl}
                alt="Instagram feed"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#58111A]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}
