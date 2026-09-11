import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { SHOWROOM_INFO } from '@/lib/constants';
import CarCard from '@/components/CarCard';
import EmiCalculator from '@/components/EmiCalculator';
import { 
  ShieldCheck, 
  Award, 
  Gauge, 
  FileCheck2, 
  Landmark, 
  RefreshCw, 
  ArrowRight, 
  Car, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  PhoneCall,
  ChevronRight,
  Search
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch top featured & available cars dynamically from the SQLite database
  let featuredCars = await prisma.car.findMany({
    where: {
      status: 'AVAILABLE',
      isFeatured: true,
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  // If less than 4 featured available cars, fetch latest available cars
  if (featuredCars.length < 4) {
    const additionalCars = await prisma.car.findMany({
      where: {
        id: { notIn: featuredCars.map((c) => c.id) },
      },
      take: 4 - featuredCars.length,
      orderBy: { createdAt: 'desc' },
    });
    featuredCars = [...featuredCars, ...additionalCars];
  }

  // Fetch unique makes for quick finder
  const allCars = await prisma.car.findMany({ select: { make: true } });
  const uniqueMakes = Array.from(new Set(allCars.map((c) => c.make))).sort();

  const trustIcons: Record<string, React.ReactNode> = {
    ShieldCheck: <ShieldCheck className="w-6 h-6 text-brand-500" />,
    Award: <Award className="w-6 h-6 text-amber-500" />,
    Gauge: <Gauge className="w-6 h-6 text-emerald-500" />,
    FileCheck2: <FileCheck2 className="w-6 h-6 text-blue-500" />,
    Landmark: <Landmark className="w-6 h-6 text-indigo-500" />,
    RefreshCw: <RefreshCw className="w-6 h-6 text-rose-500" />,
  };

  const testimonials = [
    {
      name: "Rohit Agarwal",
      car: "Bought 2022 Hyundai Creta SX(O)",
      city: "Mumbai",
      rating: 5,
      review: "Brothers Autos gave me absolute transparency. The 200-point inspection report was totally accurate, and their team got my car loan approved from HDFC within 2 hours. Car delivered like brand new!",
    },
    {
      name: "Col. Sanjeev Rawat",
      car: "Bought 2021 BMW 330i M Sport",
      city: "Pune",
      rating: 5,
      review: "Purchasing a pre-owned luxury car usually comes with doubts, but Brothers Autos showed digital OBD scan records and zero meter tampering proof. Unbelievable professionalism.",
    },
    {
      name: "Pooja Hegde",
      car: "Bought 2023 Tata Nexon EV Max",
      city: "Thane",
      rating: 5,
      review: "Smooth test drive right to my society gate. RC transfer was handled completely by Brothers Autos with zero extra follow-up needed. Truly 5-star experience!",
    }
  ];

  return (
    <div className="flex flex-col space-y-16 sm:space-y-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-navy-900 text-white pt-12 pb-20 lg:pt-16 lg:pb-28">
        {/* Subtle background glow & automotive grid texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1.5" fill="#60a5fa" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-pattern)" />
          </svg>
        </div>

        {/* Ambient colored lighting orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-600/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-semibold text-amber-400 shadow-inner">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Brothers Autos Verified Inventory &bull; 2026 Stock</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Certified Pre-Owned Cars at{' '}
                <span className="bg-gradient-to-r from-brand-400 via-blue-300 to-brand-500 bg-clip-text text-transparent">
                  Best Prices
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Discover showroom-grade certified cars backed by a rigorous 200-point inspection, 
                non-accidental guarantee, 7-day money back assurance, and instant paperless financing.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/inventory"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white shadow-lg hover:shadow-brand-500/25 transition-all duration-200 active:scale-95"
                >
                  <Car className="w-4 h-4" />
                  <span>View All Inventory</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`tel:${SHOWROOM_INFO.phoneRaw}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 transition-all duration-200"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>Speak to Car Advisor</span>
                </a>
              </div>

              {/* Trust Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 text-left">
                {SHOWROOM_INFO.stats.map((s, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <span className="text-2xl font-black text-white">{s.value}</span>
                    <p className="text-xs text-slate-400 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Right Quick Search Widget Card (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-slate-700/80 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-brand-400" />
                    <h2 className="text-base font-bold text-white tracking-tight">
                      Find Your Dream Car
                    </h2>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                    Live Stock
                  </span>
                </div>

                <form action="/inventory" method="GET" className="space-y-3.5">
                  {/* Select Make */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">
                      Choose Brand / Make
                    </label>
                    <select
                      name="make"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-semibold border border-slate-700 focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                      <option value="ALL">All Brands (Hyundai, BMW, Tata, etc.)</option>
                      {uniqueMakes.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">
                      Your Budget
                    </label>
                    <select
                      name="priceRange"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-semibold border border-slate-700 focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                      <option value="ALL">Any Budget</option>
                      <option value="under_15">Under ₹15 Lakh</option>
                      <option value="15_to_25">₹15 Lakh – ₹25 Lakh</option>
                      <option value="25_to_40">₹25 Lakh – ₹40 Lakh</option>
                      <option value="above_40">Luxury (Above ₹40 Lakh)</option>
                    </select>
                  </div>

                  {/* Body Style */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">
                      Body Type
                    </label>
                    <select
                      name="bodyType"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-semibold border border-slate-700 focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                      <option value="ALL">All Body Types</option>
                      <option value="SUV">SUV / Compact SUV</option>
                      <option value="Sedan">Sedan / Luxury Sedan</option>
                      <option value="Hatchback">Hatchback</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Certified Cars</span>
                  </button>
                </form>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Zero Tampering Verified
                  </span>
                  <Link href="/inventory" className="text-brand-400 hover:underline font-semibold">
                    Browse All &rarr;
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. FEATURED CARS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              Handpicked Deals
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Pre-Owned Cars
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Top evaluated cars ready for immediate showroom inspection and doorstep delivery
            </p>
          </div>

          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors group"
          >
            <span>View All Available Cars ({allCars.length})</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      {/* 3. WHY CHOOSE BROTHERS AUTOS (TRUST PILLARS) */}
      <section id="why-choose-us" className="bg-slate-100/70 py-16 sm:py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              The Brothers Autos Promise
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Why Buying From Us Is Safe & Smart
            </h2>
            <p className="text-sm text-slate-500">
              We eliminate all the risks associated with buying a used car through full engineering transparency and legal guarantees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SHOWROOM_INFO.trustPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {trustIcons[pillar.icon] || <ShieldCheck className="w-6 h-6 text-brand-600" />}
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE EMI CALCULATOR TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <EmiCalculator />
      </section>

      {/* 5. VERIFIED BUYER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            Real Experiences
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Loved By Over 2,500+ Car Owners
          </h2>
          <p className="text-sm text-slate-500">
            Read verified reviews from customers who purchased certified cars from Brothers Autos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{t.review}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-brand-600 font-medium">{t.car}</p>
                </div>
                <span className="text-[11px] text-slate-400">{t.city}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-brand-900 via-slate-900 to-navy-950 text-white p-8 sm:p-12 overflow-hidden shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
              Ready to Drive?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Schedule Your VIP Showroom Visit Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Drop by Brothers Autos for a warm cup of coffee and a comprehensive inspection of any vehicle with our technical engineers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/inventory"
              className="px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold uppercase tracking-wider text-center shadow-lg transition-all active:scale-95"
            >
              Explore All Cars
            </Link>
            <a
              href={`tel:${SHOWROOM_INFO.phoneRaw}`}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold uppercase tracking-wider text-center transition-all"
            >
              Call {SHOWROOM_INFO.phone}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
