'use client';

import React, { useState } from 'react';
import { Ruler, Check } from 'lucide-react';

export default function SizeGuidePage() {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  const measurements = [
    { size: 'XS', bustIn: '31 - 32', waistIn: '24 - 25', hipIn: '34 - 35', bustCm: '78 - 81', waistCm: '60 - 63', hipCm: '86 - 89' },
    { size: 'S', bustIn: '33 - 34', waistIn: '26 - 27', hipIn: '36 - 37', bustCm: '83 - 86', waistCm: '66 - 68', hipCm: '91 - 94' },
    { size: 'M', bustIn: '35 - 36', waistIn: '28 - 29', hipIn: '38 - 39', bustCm: '88 - 91', waistCm: '71 - 73', hipCm: '96 - 99' },
    { size: 'L', bustIn: '37 - 38', waistIn: '30 - 31', hipIn: '40 - 41', bustCm: '93 - 96', waistCm: '76 - 78', hipCm: '101 - 104' },
    { size: 'XL', bustIn: '39 - 41', waistIn: '32 - 34', hipIn: '42 - 44', bustCm: '99 - 104', waistCm: '81 - 86', hipCm: '106 - 111' },
    { size: 'XXL', bustIn: '42 - 44', waistIn: '35 - 37', hipIn: '45 - 47', bustCm: '106 - 111', waistCm: '88 - 93', hipCm: '114 - 119' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-white">
      
      <div className="text-center pb-8 border-b border-[#58111A]/15">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">
          ATELIER FIT ADVICE
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl text-[#58111A] mt-1 uppercase">
          SIZE & MEASUREMENT GUIDE
        </h1>
        <p className="text-xs text-[#7A3B43] mt-2">
          FINESSE FASHION garments are tailored according to international luxury sizing standards.
        </p>
      </div>

      {/* Unit Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-[#FAF6F0] border border-[#58111A]/15">
          <button
            onClick={() => setUnit('in')}
            className={`px-6 py-2 text-xs font-semibold tracking-wider transition-all ${
              unit === 'in' ? 'bg-[#58111A] text-[#FAF6F0]' : 'text-[#7A3B43]'
            }`}
          >
            INCHES (IN)
          </button>
          <button
            onClick={() => setUnit('cm')}
            className={`px-6 py-2 text-xs font-semibold tracking-wider transition-all ${
              unit === 'cm' ? 'bg-[#58111A] text-[#FAF6F0]' : 'text-[#7A3B43]'
            }`}
          >
            CENTIMETERS (CM)
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#58111A]/15 overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#58111A] text-[#FAF6F0] uppercase tracking-wider font-semibold">
              <th className="py-4 px-4">Size</th>
              <th className="py-4 px-4">Bust</th>
              <th className="py-4 px-4">Waist</th>
              <th className="py-4 px-4">Hips</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#58111A]/15">
            {measurements.map((row) => (
              <tr key={row.size} className="hover:bg-[#FAF6F0] transition-colors">
                <td className="py-4 px-4 font-bold text-sm text-[#58111A]">{row.size}</td>
                <td className="py-4 px-4 text-[#7A3B43]">{unit === 'in' ? row.bustIn : row.bustCm}</td>
                <td className="py-4 px-4 text-[#7A3B43]">{unit === 'in' ? row.waistIn : row.waistCm}</td>
                <td className="py-4 px-4 text-[#7A3B43]">{unit === 'in' ? row.hipIn : row.hipCm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Measurement Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 bg-[#FAF6F0] border border-[#58111A]/15 space-y-2 text-xs text-[#7A3B43]">
          <h4 className="font-semibold text-[#58111A] text-sm uppercase tracking-wider">1. Bust</h4>
          <p className="leading-relaxed">Measure over the fullest part of your chest, ensuring the tape measure remains level across your back.</p>
        </div>

        <div className="p-6 bg-[#FAF6F0] border border-[#58111A]/15 space-y-2 text-xs text-[#7A3B43]">
          <h4 className="font-semibold text-[#58111A] text-sm uppercase tracking-wider">2. Waist</h4>
          <p className="leading-relaxed">Measure around your natural waistline (the narrowest point of your torso, typically above the navel).</p>
        </div>

        <div className="p-6 bg-[#FAF6F0] border border-[#58111A]/15 space-y-2 text-xs text-[#58111A]/80">
          <h4 className="font-semibold text-[#58111A] text-sm uppercase tracking-wider">3. Hips</h4>
          <p className="leading-relaxed">Stand with feet together and pass tape around the fullest part of your hips and seat area.</p>
        </div>
      </div>

    </div>
  );
}
