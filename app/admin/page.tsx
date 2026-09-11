'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  formatPrice, 
  formatExactPrice, 
  formatKm, 
  parseJsonArray 
} from '@/lib/utils';
import { 
  Car, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Phone, 
  MessageCircle, 
  RefreshCw, 
  Search, 
  Filter, 
  ExternalLink, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  X,
  Sliders,
  DollarSign,
  LogOut,
  UploadCloud,
  Star,
  Loader2
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'leads'>('inventory');
  const [cars, setCars] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State for Add/Edit Car
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<any | null>(null);
  const [carFormData, setCarFormData] = useState({
    make: '',
    model: '',
    year: 2022,
    price: 1500000,
    mileageKm: 30000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    ownership: '1st Owner',
    bodyType: 'SUV',
    color: 'White',
    registrationCity: 'Mumbai (MH-02)',
    insuranceValidTill: 'Valid Comprehensive',
    description: '',
    featuresText: 'Panoramic Sunroof, Touchscreen Infotainment, 6 Airbags, Alloy Wheels',
    images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'] as string[],
    imagesText: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    status: 'AVAILABLE',
    isFeatured: false,
  });

  // Image Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState('');
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    setUploadingImages(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload images');
      }

      const newUrls: string[] = data.urls || (data.url ? [data.url] : []);
      setCarFormData((prev) => {
        const updated = [...(prev.images || []), ...newUrls];
        return {
          ...prev,
          images: updated,
          imagesText: updated.join('\n'),
        };
      });
      setActionMessage({
        type: 'success',
        text: `Uploaded ${newUrls.length} photo${newUrls.length > 1 ? 's' : ''} successfully!`,
      });
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error uploading file');
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setCarFormData((prev) => {
      const updated = prev.images.filter((_, i) => i !== indexToRemove);
      return {
        ...prev,
        images: updated,
        imagesText: updated.join('\n'),
      };
    });
  };

  const handleMakeCoverImage = (indexToCover: number) => {
    setCarFormData((prev) => {
      const target = prev.images[indexToCover];
      const rest = prev.images.filter((_, i) => i !== indexToCover);
      const updated = [target, ...rest];
      return {
        ...prev,
        images: updated,
        imagesText: updated.join('\n'),
      };
    });
  };

  const handleAddManualUrl = () => {
    if (!manualUrlInput.trim()) return;
    setCarFormData((prev) => {
      const updated = [...(prev.images || []), manualUrlInput.trim()];
      return {
        ...prev,
        images: updated,
        imagesText: updated.join('\n'),
      };
    });
    setManualUrlInput('');
  };

  const [savingCar, setSavingCar] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch data
  const loadData = async () => {
    try {
      setLoading(true);
      const [carsRes, inqRes] = await Promise.all([
        fetch('/api/cars'),
        fetch('/api/inquiries'),
      ]);
      const carsData = await carsRes.json();
      const inqData = await inqRes.json();

      if (Array.isArray(carsData)) setCars(carsData);
      if (Array.isArray(inqData)) setInquiries(inqData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Quick Status Flip for a Car (Available, Reserved, Sold)
  const handleStatusChange = async (carId: string, newStatus: string) => {
    try {
      // Optimistic update
      setCars((prev) =>
        prev.map((c) => (c.id === carId ? { ...c, status: newStatus } : c))
      );

      const res = await fetch(`/api/cars/${carId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      setActionMessage({
        type: 'success',
        text: `Vehicle status updated to ${newStatus}!`,
      });
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Error updating status' });
      loadData(); // Revert
    }
  };

  // Delete Car
  const handleDeleteCar = async (carId: string, carTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete ${carTitle} from inventory?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/cars/${carId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete car');

      setCars((prev) => prev.filter((c) => c.id !== carId));
      setActionMessage({ type: 'success', text: `${carTitle} removed from inventory.` });
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to delete' });
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (car: any) => {
    setEditingCar(car);
    const featuresArr = parseJsonArray<string>(car.features, []);
    const imagesArr = parseJsonArray<string>(car.images, []);

    setCarFormData({
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      mileageKm: car.mileageKm,
      fuelType: car.fuelType,
      transmission: car.transmission,
      ownership: car.ownership,
      bodyType: car.bodyType || 'SUV',
      color: car.color || 'White',
      registrationCity: car.registrationCity || 'Mumbai',
      insuranceValidTill: car.insuranceValidTill || 'Comprehensive',
      description: car.description || '',
      featuresText: featuresArr.join(', '),
      images: imagesArr,
      imagesText: imagesArr.join('\n'),
      status: car.status,
      isFeatured: Boolean(car.isFeatured),
    });
    setIsCarModalOpen(true);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingCar(null);
    setCarFormData({
      make: '',
      model: '',
      year: 2023,
      price: 1500000,
      mileageKm: 25000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      ownership: '1st Owner',
      bodyType: 'SUV',
      color: 'White',
      registrationCity: 'Mumbai (MH-02)',
      insuranceValidTill: 'Valid Comprehensive',
      description: '',
      featuresText: 'Panoramic Sunroof, Touchscreen Infotainment, 6 Airbags, Alloy Wheels, Cruise Control',
      images: [],
      imagesText: '',
      status: 'AVAILABLE',
      isFeatured: false,
    });
    setIsCarModalOpen(true);
  };

  // Save Car (Create or Update)
  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carFormData.make || !carFormData.model) {
      alert('Please fill in make and model.');
      return;
    }

    setSavingCar(true);
    try {
      const features = carFormData.featuresText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      // Collect images from images array or fallback to imagesText
      let images = (carFormData.images || []).filter(Boolean);
      if (images.length === 0 && carFormData.imagesText.trim()) {
        images = carFormData.imagesText
          .split('\n')
          .map((s) => s.trim())
          .filter((s) => s.startsWith('http') || s.startsWith('/'));
      }

      const payload = {
        ...carFormData,
        year: Number(carFormData.year),
        price: Number(carFormData.price),
        mileageKm: Number(carFormData.mileageKm),
        features,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'],
      };

      if (editingCar) {
        // Update
        const res = await fetch(`/api/cars/${editingCar.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update car');
        const updated = await res.json();
        setCars((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        setActionMessage({ type: 'success', text: 'Vehicle updated successfully!' });
      } else {
        // Create
        const res = await fetch('/api/cars', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to create car');
        const created = await res.json();
        setCars((prev) => [created, ...prev]);
        setActionMessage({ type: 'success', text: 'New vehicle added to inventory!' });
      }

      setIsCarModalOpen(false);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save car');
    } finally {
      setSavingCar(false);
    }
  };

  // Update Inquiry Status
  const handleInquiryStatus = async (inqId: string, newStatus: string) => {
    try {
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === inqId ? { ...inq, status: newStatus } : inq))
      );

      await fetch(`/api/inquiries/${inqId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error('Failed to update inquiry status:', err);
    }
  };

  // Re-seed Database
  const handleReseed = async () => {
    if (!window.confirm('Reset and re-seed the database with default showcase inventory?')) {
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      alert(data.message || 'Database re-seeded!');
      loadData();
    } catch (err) {
      alert('Failed to re-seed database');
    } finally {
      setLoading(false);
    }
  };

  // Admin Logout Handler
  const [loggingOut, setLoggingOut] = useState(false);
  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to log out of the Dealer Portal?')) {
      return;
    }
    try {
      setLoggingOut(true);
      await fetch('/api/admin/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch (err) {
      console.error('Logout failed:', err);
      window.location.href = '/admin/login';
    }
  };

  // Computed Stats
  const totalCount = cars.length;
  const availableCount = cars.filter((c) => c.status === 'AVAILABLE').length;
  const reservedCount = cars.filter((c) => c.status === 'RESERVED').length;
  const soldCount = cars.filter((c) => c.status === 'SOLD').length;
  const newLeadsCount = inquiries.filter((i) => i.status === 'NEW').length;

  // Filtered Cars in Admin Table
  const displayCars = cars.filter((car) => {
    if (statusFilter !== 'ALL' && car.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchMake = car.make.toLowerCase().includes(q);
      const matchModel = car.model.toLowerCase().includes(q);
      return matchMake || matchModel;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider">
              Dealer Control Center
            </span>
            <span className="text-xs text-slate-400 font-medium">Brothers Autos Admin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Showroom Fleet & Lead Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReseed}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs"
            title="Reset to 8 default showcase cars"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo DB</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Vehicle</span>
          </button>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors shadow-xs active:scale-95 disabled:opacity-50"
            title="Log out and lock dealer dashboard"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span>{loggingOut ? 'Signing out...' : 'Logout'}</span>
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Key Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Fleet</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalCount}</div>
          <span className="text-[11px] text-slate-400 font-medium">Cars listed in DB</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 shadow-xs">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Available</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{availableCount}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Ready for sale</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 shadow-xs">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Reserved</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{reservedCount}</div>
          <span className="text-[11px] text-amber-600 font-medium">Token advance hold</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Sold</span>
          <div className="text-2xl font-black text-slate-700 mt-1">{soldCount}</div>
          <span className="text-[11px] text-slate-500 font-medium">Completed deals</span>
        </div>

        <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-200 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-wider block">Active Leads</span>
          <div className="text-2xl font-black text-brand-700 mt-1">{inquiries.length}</div>
          <span className="text-[11px] text-brand-600 font-semibold">{newLeadsCount} New Pending</span>
        </div>
      </div>

      {/* Tabs: Fleet Inventory vs Customer Leads */}
      <div className="flex items-center space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Vehicle Inventory Table ({cars.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'leads'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customer Leads & Inquiries ({inquiries.length})</span>
          {newLeadsCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
              {newLeadsCount}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: FLEET INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Table Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inventory by make or model..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white cursor-pointer focus:outline-none focus:border-brand-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="SOLD">Sold</option>
              </select>
            </div>
          </div>

          {/* Cars Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Vehicle</th>
                    <th className="py-3.5 px-3">Price</th>
                    <th className="py-3.5 px-3">Specs</th>
                    <th className="py-3.5 px-3">Status (1-Click Flip)</th>
                    <th className="py-3.5 px-3">Featured</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayCars.map((car) => {
                    const images = parseJsonArray<string>(car.images, []);
                    const cover = images[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80';

                    return (
                      <tr key={car.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Vehicle Image & Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={cover}
                              alt={car.model}
                              className="w-14 h-10 object-cover rounded-lg shrink-0 border border-slate-200"
                            />
                            <div>
                              <div className="font-bold text-slate-900 text-sm">
                                {car.year} {car.make} {car.model}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {car.ownership} &bull; {car.color} &bull; {car.registrationCity}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-3 font-bold text-slate-900">
                          <div className="text-sm">{formatPrice(car.price)}</div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            {formatExactPrice(car.price)}
                          </div>
                        </td>

                        {/* Specs */}
                        <td className="py-3 px-3 text-slate-600">
                          <div className="font-semibold">{formatKm(car.mileageKm)}</div>
                          <div className="text-[11px] text-slate-400">
                            {car.fuelType} &bull; {car.transmission}
                          </div>
                        </td>

                        {/* 1-Click Status Flip */}
                        <td className="py-3 px-3">
                          <select
                            value={car.status}
                            onChange={(e) => handleStatusChange(car.id, e.target.value)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider cursor-pointer border focus:outline-none transition-colors ${
                              car.status === 'AVAILABLE'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                : car.status === 'RESERVED'
                                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            <option value="AVAILABLE">Available</option>
                            <option value="RESERVED">Reserved</option>
                            <option value="SOLD">Sold</option>
                          </select>
                        </td>

                        {/* Featured */}
                        <td className="py-3 px-3">
                          {car.isFeatured ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              <Sparkles className="w-3 h-3 text-amber-500" />
                              Yes
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">No</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/cars/${car.id}`}
                              target="_blank"
                              className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                              title="View Public Page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleOpenEdit(car)}
                              className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Edit Vehicle"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteCar(car.id, `${car.make} ${car.model}`)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Vehicle"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {displayCars.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs">
                No vehicles found matching current search.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOMER LEADS & INQUIRIES */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Lead Type</th>
                    <th className="py-3.5 px-4">Customer Name & Contact</th>
                    <th className="py-3.5 px-3">Vehicle Interested</th>
                    <th className="py-3.5 px-3">Date & Preference</th>
                    <th className="py-3.5 px-3">Lead Status</th>
                    <th className="py-3.5 px-4 text-right">Instant Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inquiries.map((inq) => {
                    const cleanPhone = inq.phone.replace(/[^0-9]/g, '');
                    return (
                      <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Type */}
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                            inq.inquiryType === 'TEST_DRIVE'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : inq.inquiryType === 'RESERVE_BOOKING'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {inq.inquiryType === 'TEST_DRIVE' ? 'Test Drive' : inq.inquiryType === 'RESERVE_BOOKING' ? `Reserve (₹${(inq.tokenAmount || 10000).toLocaleString('en-IN')})` : 'General'}
                          </span>
                        </td>

                        {/* Customer details */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-sm">
                            {inq.customerName}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2">
                            <span>{inq.phone}</span>
                            {inq.email && <span>&bull; {inq.email}</span>}
                          </div>
                        </td>

                        {/* Vehicle */}
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-slate-900">
                            {inq.carTitle || 'General Showroom'}
                          </div>
                          {inq.message && (
                            <div className="text-[11px] text-slate-500 max-w-xs truncate" title={inq.message}>
                              {inq.message}
                            </div>
                          )}
                        </td>

                        {/* Preferred Date & Window */}
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-slate-700">
                            {inq.preferredDate || 'Immediate'}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {inq.preferredTime || 'Anytime'}
                          </div>
                        </td>

                        {/* Lead Status */}
                        <td className="py-3.5 px-3">
                          <select
                            value={inq.status}
                            onChange={(e) => handleInquiryStatus(inq.id, e.target.value)}
                            className={`px-2 py-1 rounded-lg text-xs font-bold cursor-pointer border ${
                              inq.status === 'NEW'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : inq.status === 'CONTACTED'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            <option value="NEW">New</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="COMPLETED">Completed</option>
                          </select>
                        </td>

                        {/* Contact CTAs */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`tel:${cleanPhone}`}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 transition-colors"
                              title="Call Lead"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${inq.customerName}, thanks for reaching out to Brothers Autos regarding the ${inq.carTitle || 'vehicle'}. How can we assist you today?`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                              title="WhatsApp Customer"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {inquiries.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs">
                No customer inquiries yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD / EDIT CAR MODAL */}
      {isCarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Showroom Fleet Management
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {editingCar ? `Edit ${editingCar.year} ${editingCar.make} ${editingCar.model}` : 'Add New Vehicle to Inventory'}
                </h3>
              </div>
              <button
                onClick={() => setIsCarModalOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveCar} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Row 1: Make, Model, Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Make / Brand *</label>
                  <input
                    type="text"
                    required
                    value={carFormData.make}
                    onChange={(e) => setCarFormData({ ...carFormData, make: e.target.value })}
                    placeholder="e.g. Hyundai, BMW, Tata"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Model & Variant *</label>
                  <input
                    type="text"
                    required
                    value={carFormData.model}
                    onChange={(e) => setCarFormData({ ...carFormData, model: e.target.value })}
                    placeholder="e.g. Creta SX(O) AT"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Model Year *</label>
                  <input
                    type="number"
                    required
                    min={2005}
                    max={2027}
                    value={carFormData.year}
                    onChange={(e) => setCarFormData({ ...carFormData, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-semibold"
                  />
                </div>
              </div>

              {/* Row 2: Price, Mileage, Fuel, Transmission */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    step={10000}
                    value={carFormData.price}
                    onChange={(e) => setCarFormData({ ...carFormData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">KM Driven *</label>
                  <input
                    type="number"
                    required
                    value={carFormData.mileageKm}
                    onChange={(e) => setCarFormData({ ...carFormData, mileageKm: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fuel Type</label>
                  <select
                    value={carFormData.fuelType}
                    onChange={(e) => setCarFormData({ ...carFormData, fuelType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Transmission</label>
                  <select
                    value={carFormData.transmission}
                    onChange={(e) => setCarFormData({ ...carFormData, transmission: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Ownership, Body Type, Color, Reg City */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ownership</label>
                  <select
                    value={carFormData.ownership}
                    onChange={(e) => setCarFormData({ ...carFormData, ownership: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold"
                  >
                    <option value="1st Owner">1st Owner</option>
                    <option value="2nd Owner">2nd Owner</option>
                    <option value="3rd Owner">3rd Owner</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Body Type</label>
                  <select
                    value={carFormData.bodyType}
                    onChange={(e) => setCarFormData({ ...carFormData, bodyType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold"
                  >
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Color</label>
                  <input
                    type="text"
                    value={carFormData.color}
                    onChange={(e) => setCarFormData({ ...carFormData, color: e.target.value })}
                    placeholder="e.g. Polar White"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reg RTO City</label>
                  <input
                    type="text"
                    value={carFormData.registrationCity}
                    onChange={(e) => setCarFormData({ ...carFormData, registrationCity: e.target.value })}
                    placeholder="e.g. Mumbai (MH-02)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* Status & Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vehicle Status</label>
                  <select
                    value={carFormData.status}
                    onChange={(e) => setCarFormData({ ...carFormData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-bold"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="RESERVED">RESERVED</option>
                    <option value="SOLD">SOLD</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={carFormData.isFeatured}
                    onChange={(e) => setCarFormData({ ...carFormData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                  />
                  <label htmlFor="isFeatured" className="font-bold text-slate-800 cursor-pointer">
                    Show in Homepage "Featured Cars"
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Vehicle Description</label>
                <textarea
                  rows={3}
                  value={carFormData.description}
                  onChange={(e) => setCarFormData({ ...carFormData, description: e.target.value })}
                  placeholder="Detailed dealer appraisal, condition notes, and inspection report..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              {/* Features (comma separated) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Key Features (comma separated)
                </label>
                <input
                  type="text"
                  value={carFormData.featuresText}
                  onChange={(e) => setCarFormData({ ...carFormData, featuresText: e.target.value })}
                  placeholder="Panoramic Sunroof, 6 Airbags, Ventilated Seats, Bose Audio"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              {/* Vehicle Photos Upload & Management */}
              <div className="space-y-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-bold text-slate-800 text-xs">
                      Vehicle Photos & Showcase Gallery
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Upload photos directly from your computer or phone (.jpg, .png, .webp).
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {carFormData.images?.length || 0} Photos
                  </span>
                </div>

                {/* Dropzone / Upload Area */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                    isDragOver 
                      ? 'border-brand-500 bg-brand-50/60' 
                      : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/60'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="car-photos-upload"
                  />

                  {uploadingImages ? (
                    <div className="flex flex-col items-center justify-center py-3">
                      <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-2" />
                      <p className="font-bold text-slate-700 text-xs">Uploading vehicle photos...</p>
                      <p className="text-[11px] text-slate-400">Optimizing and saving to dealer storage</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-2">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-3 shadow-xs">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-slate-800 text-xs mb-1">
                        Drag and drop car photos here, or{' '}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-brand-600 hover:text-brand-700 underline font-bold cursor-pointer"
                        >
                          browse files
                        </button>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Supports JPG, PNG, and WebP (up to 10MB each). Multiple files allowed.
                      </p>
                    </div>
                  )}
                </div>

                {/* Uploaded Thumbnails Grid */}
                {carFormData.images && carFormData.images.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-[11px] font-bold text-slate-600">Attached Photos Preview:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {carFormData.images.map((imgUrl, index) => {
                        const isCover = index === 0;
                        return (
                          <div 
                            key={index} 
                            className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 bg-slate-900 group shadow-xs ${
                              isCover ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'
                            }`}
                          >
                            <img
                              src={imgUrl}
                              alt={`Vehicle photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Badges & Actions Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                              <div className="flex justify-between items-start">
                                {isCover ? (
                                  <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded shadow">
                                    <Star className="w-3 h-3 fill-current" /> Cover Photo
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleMakeCoverImage(index)}
                                    className="bg-black/60 hover:bg-amber-500 hover:text-slate-950 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm transition-colors cursor-pointer"
                                    title="Make this the primary showcase photo"
                                  >
                                    Set as Cover
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(index)}
                                  className="p-1 rounded bg-rose-600/90 hover:bg-rose-700 text-white shadow transition-colors ml-auto cursor-pointer"
                                  title="Remove this photo"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>

                              <span className="text-[10px] font-mono text-slate-300 truncate max-w-full">
                                #{index + 1}
                              </span>
                            </div>

                            {/* Persistent Cover Ribbon if not hovered */}
                            {isCover && (
                              <div className="absolute bottom-1.5 left-1.5 pointer-events-none group-hover:hidden">
                                <span className="inline-flex items-center gap-1 bg-amber-500/95 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded shadow-sm">
                                  <Star className="w-2.5 h-2.5 fill-current" /> Cover
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Collapsible Manual URL Fallback */}
                <div className="pt-2 border-t border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => setShowManualUrl(!showManualUrl)}
                    className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showManualUrl ? '− Hide external URL option' : '+ Or paste external image URL'}</span>
                  </button>

                  {showManualUrl && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="url"
                        value={manualUrlInput}
                        onChange={(e) => setManualUrlInput(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleAddManualUrl}
                        className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 cursor-pointer"
                      >
                        Add URL
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCarModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCar}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md disabled:opacity-50"
                >
                  {savingCar ? 'Saving...' : editingCar ? 'Save Changes' : 'Create Car Listing'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
