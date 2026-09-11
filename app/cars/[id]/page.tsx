import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  formatPrice, 
  formatExactPrice, 
  formatKm, 
  parseJsonArray,
  getWhatsAppCarInquiryUrl 
} from '@/lib/utils';
import { SHOWROOM_INFO } from '@/lib/constants';
import PhotoGallery from '@/components/PhotoGallery';
import QuickSpecs from '@/components/QuickSpecs';
import InspectionReport from '@/components/InspectionReport';
import CarDetailsClientActions from './CarDetailsClientActions';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  MapPin, 
  Phone, 
  FileText, 
  CheckCircle2,
  Lock,
  Calendar
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const car = await prisma.car.findUnique({
    where: { id: params.id },
  });

  if (!car) {
    return { title: 'Car Not Found | Brothers Autos' };
  }

  return {
    title: `${car.year} ${car.make} ${car.model} for Sale | Brothers Autos`,
    description: `Certified ${car.year} ${car.make} ${car.model} (${formatPrice(car.price)}). 200-point inspection certified, ${formatKm(car.mileageKm)}, ${car.fuelType}, single-hand verified at Brothers Autos showroom.`,
  };
}

export default async function CarDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const car = await prisma.car.findUnique({
    where: { id: params.id },
  });

  if (!car) {
    notFound();
  }

  const images = parseJsonArray<string>(car.images, []);
  const features = parseJsonArray<string>(car.features, []);
  const carTitle = `${car.year} ${car.make} ${car.model}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Inventory</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span>/</span>
          <Link href="/inventory" className="hover:text-slate-600">Inventory</Link>
          <span>/</span>
          <span className="text-slate-700 font-semibold">{car.make} {car.model}</span>
        </div>
      </div>

      {/* Main Grid: Left Gallery & Overview (7 cols) + Right Sticky Pricing & CTAs (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Photo Gallery Component */}
          <PhotoGallery
            images={images}
            carTitle={carTitle}
            status={car.status}
          />

          {/* Quick Specs Bar */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Vehicle Technical Specifications
            </h3>
            <QuickSpecs car={car} />
          </div>

          {/* Detailed Description */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600" />
              Showroom Advisor Description
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {car.description}
            </p>
          </div>

          {/* Equipment & Key Features List */}
          {features.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Featured Equipment & Factory Extras
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800"
                  >
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 200-Point Certified Inspection Card */}
          <InspectionReport />
        </div>

        {/* Right Sticky Column (5 cols): Title, Price, EMI & Conversion CTAs */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-lg space-y-6">
            
            {/* Top Badges */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full uppercase tracking-wider">
                {car.year} Certified Model
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-xs ${
                car.status === 'AVAILABLE' ? 'bg-emerald-600' : car.status === 'RESERVED' ? 'bg-amber-600' : 'bg-slate-700'
              }`}>
                {car.status === 'AVAILABLE' ? 'Available in Showroom' : car.status === 'RESERVED' ? 'Reserved (Token Hold)' : 'Vehicle Sold'}
              </span>
            </div>

            {/* Title & Price */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {car.make} {car.model}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {car.ownership} &bull; {formatKm(car.mileageKm)} &bull; {car.fuelType} &bull; {car.transmission}
              </p>
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {formatPrice(car.price)}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    ({formatExactPrice(car.price)})
                  </span>
                </div>
                <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Includes Complete RTO Transfer & Documentation
                </p>
              </div>
            </div>

            {/* Interactive Conversion CTAs Component (Client Side: Modals & WhatsApp) */}
            <CarDetailsClientActions car={car} />

            {/* Showroom Direct Assist Strip */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Available for physical inspection at Mumbai Showroom</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1-Year Comprehensive Warranty & 24x7 Roadside Assistance</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Immediate Same-Day Delivery Option Available</span>
              </div>
            </div>

          </div>

          {/* Need help card */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold">Have questions about this car?</p>
              <h4 className="text-sm font-bold text-white mt-0.5">Call Our Senior Appraiser</h4>
              <a href={`tel:${SHOWROOM_INFO.phoneRaw}`} className="text-xs text-amber-400 font-bold hover:underline">
                {SHOWROOM_INFO.phone}
              </a>
            </div>
            <a
              href={`tel:${SHOWROOM_INFO.phoneRaw}`}
              className="p-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white shadow-md transition-colors"
              title="Call Sales Advisor"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
