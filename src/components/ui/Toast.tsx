'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { Sparkles } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in flex items-center gap-3 bg-[#58111A] text-[#FAF6F0] px-5 py-3.5 shadow-2xl rounded-none border border-[#D4AF37]/40 tracking-wide text-xs uppercase font-medium">
      <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
      <span>{toastMessage}</span>
    </div>
  );
}
