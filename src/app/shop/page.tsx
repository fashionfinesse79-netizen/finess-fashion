'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ui/ProductCard';
import { useStore } from '@/context/StoreContext';
import { Category, Size } from '@/lib/types';
import { Filter, X, SlidersHorizontal, ChevronDown, RotateCcw } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const { products } = useStore();

  const categoryParam = searchParams.get('category') || 'All';
  const collectionParam = searchParams.get('collection') || 'All';
  const searchParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedCollection, setSelectedCollection] = useState<string>(collectionParam);
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(searchParam);

  const categoriesList: (Category | 'All')[] = [
    'All',
    'Dresses',
    'Co-Ord Sets',
    'Tops',
    'Bottoms',
    'Outerwear',
    'Occasion Wear'
  ];

  const sizesList: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const colorsList = [
    { name: 'Gold / Champagne', hex: '#D4AF37' },
    { name: 'Black / Raven', hex: '#121212' },
    { name: 'Beige / Sand', hex: '#E8DED1' },
    { name: 'Ivory / White', hex: '#FAF8F5' },
    { name: 'Emerald / Green', hex: '#0F281E' }
  ];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      // Collection
      if (selectedCollection !== 'All' && !p.collections.includes(selectedCollection as any)) return false;
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesTagline = p.tagline.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        if (!matchesName && !matchesTagline && !matchesCategory) return false;
      }
      // Sizes
      if (selectedSizes.length > 0) {
        const hasSize = selectedSizes.some((s) => p.sizes.includes(s));
        if (!hasSize) return false;
      }
      // Colors
      if (selectedColors.length > 0) {
        const hasColor = selectedColors.some((cName) =>
          p.colors.some((pc) => pc.name.toLowerCase().includes(cName.toLowerCase()))
        );
        if (!hasColor) return false;
      }
      // Price
      if (p.price > maxPrice) return false;
      // Stock
      if (inStockOnly && !p.inStock) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedCollection, searchQuery, selectedSizes, selectedColors, maxPrice, inStockOnly, sortBy]);

  const toggleSize = (s: Size) => {
    setSelectedSizes((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedCollection('All');
    setSelectedSizes([]);
    setSelectedColors([]);
    setMaxPrice(50000);
    setInStockOnly(false);
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Banner */}
      <div className="text-center pb-8 border-b border-[#58111A]/15">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">
          FINESSE BOUTIQUE CATALOG
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl text-[#58111A] mt-1">
          {selectedCategory === 'All' ? 'ALL COLLECTIONS' : selectedCategory.toUpperCase()}
        </h1>
        <p className="text-xs text-[#7A3B43] mt-2 max-w-md mx-auto">
          Explore artisanal silk gowns, tailored power suits, and hand-embellished occasion wear.
        </p>
      </div>

      {/* Bar Controls */}
      <div className="py-5 flex flex-wrap items-center justify-between gap-4 border-b border-[#58111A]/15">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-[#58111A] text-[#FAF6F0] text-xs uppercase tracking-wider font-medium"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters ({filteredProducts.length})
          </button>
          <span className="text-xs text-[#7A3B43] hidden sm:inline">
            Showing <strong>{filteredProducts.length}</strong> luxury pieces
          </span>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-[#7A3B43] font-medium hidden sm:inline">Sort By:</label>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white border border-[#58111A]/15 text-xs text-[#58111A] focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="featured">Featured / Atelier Pick</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block space-y-8 pr-4 border-r border-[#58111A]/15">
          
          {/* Active Filter Clear */}
          <div className="flex justify-between items-center pb-4 border-b border-[#58111A]/15">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#58111A]">Filters</h3>
            <button
              onClick={resetFilters}
              className="text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#7A3B43] font-semibold mb-2">Search</label>
            <input
              type="text"
              placeholder="Search keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-[#58111A]/15 text-xs bg-white text-[#58111A] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#7A3B43] font-semibold mb-3">Categories</label>
            <div className="space-y-2">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block text-xs transition-colors w-full text-left py-1 ${
                    selectedCategory === cat
                      ? 'text-[#D4AF37] font-semibold underline'
                      : 'text-[#58111A] hover:text-[#D4AF37]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#7A3B43] font-semibold mb-3">Size</label>
            <div className="grid grid-cols-3 gap-2">
              {sizesList.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSize(s)}
                  className={`py-1.5 text-xs border transition-colors ${
                    selectedSizes.includes(s)
                      ? 'bg-[#58111A] text-[#FAF6F0] border-[#58111A]'
                      : 'border-[#58111A]/15 text-[#58111A] hover:border-[#58111A]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#7A3B43] font-semibold mb-3">Color</label>
            <div className="space-y-2">
              {colorsList.map((c) => (
                <button
                  key={c.name}
                  onClick={() => toggleColor(c.name)}
                  className={`flex items-center gap-2.5 text-xs w-full text-left transition-colors ${
                    selectedColors.includes(c.name) ? 'font-semibold text-[#58111A]' : 'text-[#7A3B43]'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/20"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[11px] uppercase tracking-wider text-[#7A3B43] font-semibold">Max Price</label>
              <span className="text-xs font-semibold text-[#58111A]">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="50000"
              step="2000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#58111A]"
            />
          </div>

          {/* Stock Filter */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="inStockCheck"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="accent-[#58111A]"
            />
            <label htmlFor="inStockCheck" className="text-xs text-[#58111A] cursor-pointer">
              In Stock Items Only
            </label>
          </div>

        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-[#FAF6F0] border border-[#58111A]/15 space-y-4">
              <p className="font-serif-luxury text-2xl text-[#58111A]">No pieces matched your selected filter.</p>
              <p className="text-xs text-[#7A3B43]">Try broadening your price range or clearing specific size filters.</p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-[#58111A] text-[#FAF6F0] text-xs uppercase tracking-wider"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Drawer Filter */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden animate-fade-in">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#FAF6F0] p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-[#58111A]/15">
                <h3 className="font-serif-luxury text-xl text-[#58111A]">Filters</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-[#7A3B43]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7A3B43] font-semibold mb-2">
                    Category
                  </label>
                  <div className="space-y-1">
                    {categoriesList.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`block text-xs w-full text-left py-1 ${
                          selectedCategory === cat ? 'text-[#D4AF37] font-bold' : 'text-[#58111A]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7A3B43] font-semibold mb-2">
                    Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {sizesList.map((s) => (
                      <button
                        key={s}
                        onClick={() => toggleSize(s)}
                        className={`py-1.5 text-xs border ${
                          selectedSizes.includes(s) ? 'bg-[#58111A] text-[#FAF6F0]' : 'border-[#58111A]/15'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3 bg-[#58111A] text-[#FAF6F0] text-xs uppercase font-semibold"
            >
              Apply Filters ({filteredProducts.length})
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading FINESSE Boutique...</div>}>
      <ShopContent />
    </Suspense>
  );
}
