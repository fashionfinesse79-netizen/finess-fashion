'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { X, Check } from 'lucide-react';

export default function SizeGuideModal() {
  const { sizeGuideOpen, setSizeGuideOpen } = useStore();
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!sizeGuideOpen) return null;

  const measurements = [
    { size: 'XS', bustIn: '31-32', waistIn: '24-25', hipIn: '34-35', bustCm: '78-81', waistCm: '60-63', hipCm: '86-89' },
    { size: 'S', bustIn: '33-34', waistIn: '26-27', hipIn: '36-37', bustCm: '83-86', waistCm: '66-68', hipCm: '91-94' },
    { size: 'M', bustIn: '35-36', waistIn: '28-29', hipIn: '38-39', bustCm: '88-91', waistCm: '71-73', hipCm: '96-99' },
    { size: 'L', bustIn: '37-38', waistIn: '30-31', hipIn: '40-41', bustCm: '93-96', waistCm: '76-78', hipCm: '101-104' },
    { size: 'XL', bustIn: '39-41', waistIn: '32-34', hipIn: '42-44', bustCm: '99-104', waistCm: '81-86', hipCm: '106-111' },
    { size: 'XXL', bustIn: '42-44', waistIn: '35-37', hipIn: '45-47', bustCm: '106-111', waistCm: '88-93', hipCm: '114-119' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#FAF6F0] border border-[#58111A]/15 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setSizeGuideOpen(false)}
          className="absolute top-4 right-4 text-[#7A3B43] hover:text-[#58111A] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase font-semibold">
            FINESSE FIT GUIDE
          </span>
          <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#58111A] mt-1">
            Women's Size Chart
          </h3>
          <p className="text-xs text-[#7A3B43] mt-1">
            All garments are cut to international luxury sizing standards.
          </p>
        </div>

        {/* Unit Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 bg-white border border-[#58111A]/15">
            <button
              onClick={() => setUnit('in')}
              className={`px-4 py-1.5 text-xs font-medium tracking-wider transition-all ${
                unit === 'in' ? 'bg-[#58111A] text-[#FAF6F0]' : 'text-[#7A3B43]'
              }`}
            >
              INCHES
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-4 py-1.5 text-xs font-medium tracking-wider transition-all ${
                unit === 'cm' ? 'bg-[#58111A] text-[#FAF6F0]' : 'text-[#7A3B43]'
              }`}
            >
              CENTIMETERS
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#58111A] text-[#58111A] font-medium uppercase tracking-wider">
                <th className="py-3 px-3">Size</th>
                <th className="py-3 px-3">Bust</th>
                <th className="py-3 px-3">Waist</th>
                <th className="py-3 px-3">Hips</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#58111A]/15">
              {measurements.map((row) => (
                <tr key={row.size} className="hover:bg-white/50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-[#58111A]">{row.size}</td>
                  <td className="py-3 px-3 text-[#7A3B43]">
                    {unit === 'in' ? row.bustIn : row.bustCm}
                  </td>
                  <td className="py-3 px-3 text-[#7A3B43]">
                    {unit === 'in' ? row.waistIn : row.waistCm}
                  </td>
                  <td className="py-3 px-3 text-[#7A3B43]">
                    {unit === 'in' ? row.hipIn : row.hipCm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Instructions */}
        <div className="bg-white p-4 text-xs text-[#7A3B43] space-y-2 border border-[#58111A]/15">
          <h4 className="font-semibold text-[#58111A] uppercase tracking-wider text-[11px]">
            How to Measure
          </h4>
          <p>
            <strong>Bust:</strong> Measure around the fullest part of your bust, keeping tape horizontal.
          </p>
          <p>
            <strong>Waist:</strong> Measure around your natural waistline (narrowest part of torso).
          </p>
          <p>
            <strong>Hips:</strong> Stand with feet together and measure around fullest part of your hips.
          </p>
        </div>
      </div>
    </div>
  );
}
