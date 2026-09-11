'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CarCard from '@/components/CarCard';
import FilterBar from '@/components/FilterBar';
import { Car, Sparkles, Loader2 } from 'lucide-react';

function InventoryContent() {
  const searchParams = useSearchParams();

  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States initialized from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedMake, setSelectedMake] = useState(searchParams.get('make') || 'ALL');
  const [selectedFuel, setSelectedFuel] = useState(searchParams.get('fuelType') || 'ALL');
  const [selectedTransmission, setSelectedTransmission] = useState(searchParams.get('transmission') || 'ALL');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'ALL');
  const [priceRange, setPriceRange] = useState(searchParams.get('priceRange') || 'ALL');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch cars from API
  useEffect(() => {
    async function fetchCars() {
      try {
        setLoading(true);
        const res = await fetch('/api/cars');
        const data = await res.json();
        if (Array.isArray(data)) {
          setCars(data);
        }
      } catch (err) {
        console.error('Failed to load cars:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  // Compute available makes from fetched cars
  const availableMakes = useMemo(() => {
    const set = new Set<string>();
    cars.forEach((c) => {
      if (c.make) set.add(c.make);
    });
    return Array.from(set).sort();
  }, [cars]);

  // Client filtering & sorting
  const filteredCars = useMemo(() => {
    return cars
      .filter((car) => {
        // Keyword Search
        if (search.trim()) {
          const query = search.toLowerCase();
          const matchMake = car.make.toLowerCase().includes(query);
          const matchModel = car.model.toLowerCase().includes(query);
          const matchDesc = (car.description || '').toLowerCase().includes(query);
          const matchColor = (car.color || '').toLowerCase().includes(query);
          if (!matchMake && !matchModel && !matchDesc && !matchColor) return false;
        }

        // Make filter
        if (selectedMake !== 'ALL' && car.make !== selectedMake) {
          return false;
        }

        // Fuel Type
        if (selectedFuel !== 'ALL' && car.fuelType !== selectedFuel) {
          return false;
        }

        // Transmission
        if (selectedTransmission !== 'ALL' && car.transmission !== selectedTransmission) {
          return false;
        }

        // Status
        if (selectedStatus !== 'ALL' && car.status !== selectedStatus) {
          return false;
        }

        // Price Range
        if (priceRange === 'under_15' && car.price >= 1500000) return false;
        if (priceRange === '15_to_25' && (car.price < 1500000 || car.price > 2500000)) return false;
        if (priceRange === '25_to_40' && (car.price < 2500000 || car.price > 4000000)) return false;
        if (priceRange === 'above_40' && car.price <= 4000000) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'year_desc') return b.year - a.year;
        if (sortBy === 'km_asc') return a.mileageKm - b.mileageKm;
        // Default: featured first, then newest
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [
    cars,
    search,
    selectedMake,
    selectedFuel,
    selectedTransmission,
    selectedStatus,
    priceRange,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedMake('ALL');
    setSelectedFuel('ALL');
    setSelectedTransmission('ALL');
    setSelectedStatus('ALL');
    setPriceRange('ALL');
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          Certified Secondhand Showroom
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Vehicle Inventory Catalog
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Browse our certified fleet of pre-owned cars. Every vehicle is thoroughly inspected, legally verified, and backed by Brothers Autos quality assurance.
        </p>
      </div>

      {/* Filter Bar Component */}
      <FilterBar
        search={search}
        setSearch={setSearch}
        selectedMake={selectedMake}
        setSelectedMake={setSelectedMake}
        selectedFuel={selectedFuel}
        setSelectedFuel={setSelectedFuel}
        selectedTransmission={selectedTransmission}
        setSelectedTransmission={setSelectedTransmission}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onReset={handleResetFilters}
        availableMakes={availableMakes}
        totalResults={filteredCars.length}
      />

      {/* Loading State */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading showroom inventory...</p>
        </div>
      ) : filteredCars.length === 0 ? (
        /* Empty State */
        <div className="py-16 px-6 text-center bg-white rounded-3xl border border-dashed border-slate-300 max-w-md mx-auto space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Car className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">No Vehicles Match Your Filters</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your price range, make, or clearing keyword search terms.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        /* Inventory Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function InventoryPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading inventory...</p>
        </div>
      }
    >
      <InventoryContent />
    </Suspense>
  );
}
