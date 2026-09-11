'use client';

import React from 'react';
import { Search, RotateCcw, SlidersHorizontal, ChevronDown } from 'lucide-react';

interface FilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  selectedMake: string;
  setSelectedMake: (val: string) => void;
  selectedFuel: string;
  setSelectedFuel: (val: string) => void;
  selectedTransmission: string;
  setSelectedTransmission: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  priceRange: string;
  setPriceRange: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  onReset: () => void;
  availableMakes: string[];
  totalResults: number;
}

export default function FilterBar({
  search,
  setSearch,
  selectedMake,
  setSelectedMake,
  selectedFuel,
  setSelectedFuel,
  selectedTransmission,
  setSelectedTransmission,
  selectedStatus,
  setSelectedStatus,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  onReset,
  availableMakes,
  totalResults,
}: FilterBarProps) {
  const isAnyFilterActive =
    search !== '' ||
    selectedMake !== 'ALL' ||
    selectedFuel !== 'ALL' ||
    selectedTransmission !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    priceRange !== 'ALL' ||
    sortBy !== 'newest';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 mb-8 transition-all">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pb-4 border-b border-slate-100">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Make, Model, or Keyword (e.g. Creta, BMW, Sunroof)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50/50 hover:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200/60 rounded-full w-5 h-5 flex items-center justify-center"
            >
              &times;
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 shrink-0 hidden sm:inline">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
          >
            <option value="newest">Featured & Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="year_desc">Model Year: Newest</option>
            <option value="km_asc">Kilometers: Lowest</option>
          </select>
        </div>
      </div>

      {/* Multi-facet Filter Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-4">
        {/* Make / Brand */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Make / Brand
          </label>
          <select
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="ALL">All Makes</option>
            {availableMakes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Budget / Price Range */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Budget
          </label>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="ALL">All Budgets</option>
            <option value="under_15">Under ₹15 Lakh</option>
            <option value="15_to_25">₹15 Lakh – ₹25 Lakh</option>
            <option value="25_to_40">₹25 Lakh – ₹40 Lakh</option>
            <option value="above_40">Above ₹40 Lakh</option>
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Fuel Type
          </label>
          <select
            value={selectedFuel}
            onChange={(e) => setSelectedFuel(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="ALL">All Fuel Types</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric (EV)</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Transmission
          </label>
          <select
            value={selectedTransmission}
            onChange={(e) => setSelectedTransmission(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="ALL">All Transmissions</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Availability
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="ALL">All Cars</option>
            <option value="AVAILABLE">Available Only</option>
            <option value="RESERVED">Reserved</option>
            <option value="SOLD">Sold</option>
          </select>
        </div>
      </div>

      {/* Bottom Summary & Clear Button */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs">
        <div className="text-slate-600 font-medium">
          Showing <strong className="text-slate-900 font-bold">{totalResults}</strong> certified car{totalResults === 1 ? '' : 's'}
        </div>

        {isAnyFilterActive && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        )}
      </div>
    </div>
  );
}
