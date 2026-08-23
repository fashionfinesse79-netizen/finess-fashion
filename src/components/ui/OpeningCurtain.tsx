'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function OpeningCurtain() {
  const [isVisible, setIsVisible] = useState(true);
  const [stage, setStage] = useState<'white' | 'glowing' | 'warm-transition' | 'done'>('white');

  useEffect(() => {
    // Stage 1: White Canvas with subtle warm golden pulse (0 - 500ms)
    const timer1 = setTimeout(() => {
      setStage('glowing');
    }, 400);

    // Stage 2: Glowing Handwritten reveal & transition to warm atmosphere (4.2s)
    const timer2 = setTimeout(() => {
      handleEnter();
    }, 4200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleEnter = () => {
    setStage('warm-transition');
    setTimeout(() => {
      setIsVisible(false);
      setStage('done');
    }, 1400);
  };

  if (!isVisible || stage === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-all duration-1000 ${
        stage === 'warm-transition'
          ? 'opacity-0 scale-105 backdrop-blur-3xl pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: stage === 'warm-transition' ? 'rgba(88, 17, 26, 0.95)' : '#FFFFFF'
      }}
    >
      {/* Background Soft Warm Light Bloom */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          stage === 'warm-transition' ? 'opacity-100 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FAF6F0] via-[#D4AF37]/30 to-[#58111A]' : 'opacity-30 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.15)_0%,_transparent_70%)]'
        }`}
      />

      {/* Decorative Golden Corner Borders */}
      <div className="absolute inset-6 sm:inset-12 border border-[#D4AF37]/30 pointer-events-none flex flex-col justify-between p-6 transition-all duration-1000">
        <div className="flex justify-between text-[9px] uppercase tracking-[0.45em] text-[#58111A]/80 font-semibold">
          <span>HAUTE COUTURE</span>
          <span>EST. 2026</span>
        </div>
        <div className="flex justify-between text-[9px] uppercase tracking-[0.45em] text-[#58111A]/80 font-semibold">
          <span>MUMBAI • PARIS</span>
          <span>AUTUMN / WINTER</span>
        </div>
      </div>

      {/* Central Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl space-y-8">
        
        {/* Monogram Crest Emblem */}
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full border-2 border-[#D4AF37] flex items-center justify-center bg-white shadow-2xl transition-all duration-1000 ${
            stage === 'glowing' ? 'scale-100 opacity-100 shadow-[0_0_30px_rgba(212,175,55,0.4)]' : 'scale-90 opacity-0'
          }`}
        >
          <span className="font-serif-luxury text-2xl sm:text-3xl text-[#58111A] font-bold tracking-widest pl-0.5">
            FF
          </span>
        </div>

        {/* Handwritten Glowing Brand Identity: FINESSE FASHION BY DHANI */}
        <div className="space-y-3">
          <span
            className={`text-[10px] sm:text-[11px] uppercase tracking-[0.5em] text-[#D4AF37] font-semibold block transition-all duration-700 ${
              stage === 'glowing' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            WELCOME TO THE HOUSE OF
          </span>

          <h1
            className={`font-script-luxury text-5xl sm:text-7xl md:text-8xl tracking-wide font-normal leading-tight glowing-script-text transition-all duration-1000 ${
              stage === 'glowing' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            Finesse Fashion
          </h1>

          <div
            className={`transition-all duration-1000 delay-300 ${
              stage === 'glowing' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <span className="font-serif-luxury text-lg sm:text-2xl tracking-[0.3em] uppercase text-[#58111A] font-semibold block">
              BY DHANI
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.6em] uppercase text-[#D4AF37] block mt-1 font-medium">
              THE ART OF ELEGANCE
            </span>
          </div>
        </div>

        {/* Glowing Divider */}
        <div className="w-56 mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent relative overflow-hidden">
          <div className="absolute inset-y-0 w-1/2 bg-[#58111A] animate-pulse" />
        </div>

        {/* Enter Atelier CTA */}
        <div
          className={`transition-all duration-700 delay-500 ${
            stage === 'glowing' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={handleEnter}
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#58111A] text-[#FAF6F0] text-xs uppercase tracking-[0.3em] font-semibold hover:bg-[#D4AF37] hover:text-[#58111A] transition-all shadow-2xl hover:scale-105"
          >
            <span>ENTER ATELIER</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
