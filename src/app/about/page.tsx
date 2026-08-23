'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-24 pb-20 bg-white">
      
      {/* Hero Banner */}
      <section className="relative h-[60vh] flex items-center justify-center bg-[#58111A] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2000&q=85"
          alt="FINESSE Atelier"
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="relative z-10 text-center text-[#FAF6F0] space-y-4 px-4 max-w-3xl">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">
            THE HOUSE OF FINESSE FASHION
          </span>
          <h1 className="font-serif-luxury text-5xl sm:text-7xl font-light uppercase">
            OUR STORY & HERITAGE
          </h1>
          <p className="text-xs sm:text-sm text-gray-200 italic max-w-xl mx-auto font-light">
            "Redefining modern luxury through couture craftsmanship and timeless femininity."
          </p>
        </div>
      </section>

      {/* Section 1: Our Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">
              ORIGINS
            </span>
            <h2 className="font-serif-luxury text-4xl sm:text-5xl text-[#58111A] leading-tight uppercase">
              Bespoke Artistry Born in Mumbai
            </h2>
            <p className="text-xs sm:text-sm text-[#7A3B43] font-light leading-relaxed">
              Established as a private haute couture atelier in Mumbai, FINESSE FASHION was born out of a passion to bridge historical Indian textile art with contemporary Paris fashion week aesthetics in regal maroon and champagne gold palettes.
            </p>
            <p className="text-xs sm:text-sm text-[#7A3B43] font-light leading-relaxed">
              Every garment in our collection is an investment piece — crafted from hand-woven mulberry silks, micro-pleated satins, and sculpted velvets, cut to accentuate the natural posture and motion of the body.
            </p>
          </div>

          <div className="relative h-[480px] w-full border border-[#58111A]/15 overflow-hidden shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85"
              alt="Craftsmanship"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Craftsmanship Pillars Grid */}
      <section className="bg-[#FAF6F0] py-20 border-y border-[#58111A]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">
              PILLARS OF EXCELLENCE
            </span>
            <h2 className="font-serif-luxury text-4xl text-[#58111A] uppercase">
              OUR CRAFTSMANSHIP
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-[#58111A]/15 space-y-4 shadow-sm">
              <span className="font-serif-luxury text-4xl text-[#D4AF37]">01</span>
              <h3 className="font-serif-luxury text-2xl text-[#58111A] uppercase">Mulberry Silk & Drape</h3>
              <p className="text-xs text-[#7A3B43] font-light leading-relaxed">
                We source Grade-A pure mulberry silk woven by master weavers. Each fold is draped by hand on the form to achieve fluid weightlessness.
              </p>
            </div>

            <div className="bg-white p-8 border border-[#58111A]/15 space-y-4 shadow-sm">
              <span className="font-serif-luxury text-4xl text-[#D4AF37]">02</span>
              <h3 className="font-serif-luxury text-2xl text-[#58111A] uppercase">Architectural Boning</h3>
              <p className="text-xs text-[#7A3B43] font-light leading-relaxed">
                Our corsets and blazers feature internal flexible boning structures designed to contour without sacrificing ease of breath.
              </p>
            </div>

            <div className="bg-white p-8 border border-[#58111A]/15 space-y-4 shadow-sm">
              <span className="font-serif-luxury text-4xl text-[#D4AF37]">03</span>
              <h3 className="font-serif-luxury text-2xl text-[#58111A] uppercase">Hand Zari & Beading</h3>
              <p className="text-xs text-[#7A3B43] font-light leading-relaxed">
                Zari embellishments and glass seed beads are sewn one by one in our private studio by generational master artisans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: The Finesse Woman & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">
          OUR VISION
        </span>
        <h2 className="font-serif-luxury text-4xl sm:text-5xl text-[#58111A] max-w-3xl mx-auto leading-tight italic">
          "Fashion is not merely what you wear. It is how you move through the world."
        </h2>
        <div className="pt-4">
          <Link
            href="/shop"
            className="inline-block px-9 py-4 bg-[#58111A] text-[#FAF6F0] text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors shadow-lg"
          >
            DISCOVER THE COLLECTIONS
          </Link>
        </div>
      </section>

    </div>
  );
}
