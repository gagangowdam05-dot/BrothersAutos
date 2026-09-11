'use client';

import React from 'react';
import Link from 'next/link';
import { 
  formatPrice, 
  formatKm, 
  parseJsonArray, 
  getWhatsAppCarInquiryUrl,
  calculateEMI 
} from '@/lib/utils';
import { 
  Fuel, 
  Gauge, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight,
  MessageCircle
} from 'lucide-react';

interface CarCardProps {
  car: {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileageKm: number;
    fuelType: string;
    transmission: string;
    ownership: string;
    bodyType?: string;
    status: string;
    images: string;
    isFeatured?: boolean;
    registrationCity?: string;
  };
}

export default function CarCard({ car }: CarCardProps) {
  const images = parseJsonArray<string>(car.images, ['/placeholder-car.jpg']);
  const coverImage = images[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';

  // Calculate starting EMI estimate (assuming 20% down payment, 5 years)
  const loanAmount = car.price * 0.8;
  const emiData = calculateEMI(loanAmount, 9.5, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/90 text-white backdrop-blur-sm shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Available
          </span>
        );
      case 'RESERVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/95 text-white backdrop-blur-sm shadow-sm">
            Reserved
          </span>
        );
      case 'SOLD':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-700/95 text-white backdrop-blur-sm shadow-sm">
            Sold
          </span>
        );
      default:
        return null;
    }
  };

  const whatsappUrl = getWhatsAppCarInquiryUrl(car);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Top Image & Badges Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={coverImage}
          alt={`${car.year} ${car.make} ${car.model}`}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-70 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div>{getStatusBadge(car.status)}</div>
          {car.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 text-amber-300 border border-amber-400/40 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Featured
            </span>
          )}
        </div>

        {/* Bottom image spec: Reg City / Inspection */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium pointer-events-none">
          <span className="bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md">
            {car.registrationCity || 'Certified RTO'}
          </span>
          <span className="flex items-center gap-1 bg-emerald-950/60 text-emerald-300 backdrop-blur-sm px-2 py-0.5 rounded-md border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            200-Pt Verified
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Year & Car Title */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              {car.year}
            </span>
            <span className="text-xs text-slate-400 font-medium">&bull;</span>
            <span className="text-xs font-semibold text-slate-500">
              {car.ownership}
            </span>
          </div>

          <Link href={`/cars/${car.id}`} className="block group-hover:text-brand-600 transition-colors">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight line-clamp-1">
              {car.make} {car.model}
            </h3>
          </Link>

          {/* Quick Specs Grid Strip */}
          <div className="grid grid-cols-3 gap-2 py-3 mt-3 border-y border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-700 truncate">{formatKm(car.mileageKm)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-700 truncate">{car.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 flex items-center justify-center font-mono font-bold text-[10px] text-slate-500 bg-slate-100 rounded">
                AT
              </span>
              <span className="font-semibold text-slate-700 truncate">{car.transmission}</span>
            </div>
          </div>
        </div>

        {/* Pricing and Action CTAs */}
        <div className="mt-4 pt-2">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                {formatPrice(car.price)}
              </span>
              <p className="text-[11px] text-slate-500 font-medium">
                EMI from <strong className="text-slate-800">₹{emiData.monthlyEmi.toLocaleString('en-IN')}/mo*</strong>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* View Details */}
            <Link
              href={`/cars/${car.id}`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors"
            >
              <span>Details</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>

            {/* Instant WhatsApp CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
