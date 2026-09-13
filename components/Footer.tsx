'use client';

import React from 'react';
import Link from 'next/link';
import { SHOWROOM_INFO } from '@/lib/constants';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Car, 
  ExternalLink,
  Award,
  CheckCircle2,
  Navigation
} from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact-location" className="bg-slate-950 text-slate-200 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800/80">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="p-3 bg-brand-950 text-brand-400 rounded-lg border border-brand-800/50">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">200-Point Inspection</h4>
              <p className="text-xs text-slate-400 mt-1">
                Every vehicle passes rigorous mechanical, electrical, and structural certified checks.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="p-3 bg-amber-950 text-amber-400 rounded-lg border border-amber-800/50">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Zero Hidden Charges</h4>
              <p className="text-xs text-slate-400 mt-1">
                Transparent on-road pricing with comprehensive RTO transfer documentation included.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="p-3 bg-emerald-950 text-emerald-400 rounded-lg border border-emerald-800/50">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">7-Day Return Policy</h4>
              <p className="text-xs text-slate-400 mt-1">
                Drive with full peace of mind. Exchange or return within 7 days if not satisfied.
              </p>
            </div>
          </div>
        </div>

        {/* Showroom Information & Interactive Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-12 border-b border-slate-800/80">
          
          {/* Brand & Showroom Details (5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Brothers Autos"
                style={{ height: '42px', width: 'auto' }}
                className="object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div>
                <span className="text-2xl font-black text-white tracking-tight">
                  BROTHERS <span className="text-brand-500">AUTOS</span>
                </span>
                <p className="text-xs text-slate-400 font-medium tracking-wide">
                  Certified Pre-Owned Showroom & Hub
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Brothers Autos is your trusted destination for premium, certified pre-owned vehicles. 
              We blend thorough technical inspections with seamless financing and hassle-free paperwork, 
              delivering an elite car buying experience.
            </p>

            {/* Address Block */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">{SHOWROOM_INFO.address.line1}</p>
                  <p className="text-slate-400">{SHOWROOM_INFO.address.line2}</p>
                  <p className="text-slate-400">
                    {SHOWROOM_INFO.address.city}, {SHOWROOM_INFO.address.state} – {SHOWROOM_INFO.address.pincode}
                  </p>
                  <p className="text-xs text-amber-400 mt-0.5">
                    Landmark: {SHOWROOM_INFO.address.landmark}
                  </p>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-3 pt-2">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Showroom Timings:</p>
                  {SHOWROOM_INFO.operatingHours.map((h, i) => (
                    <p key={i} className="text-slate-400 text-xs mt-0.5">
                      <span className="text-slate-300 font-medium">{h.days}:</span> {h.time}
                    </p>
                  ))}
                </div>
              </div>

              {/* Contact numbers */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={`tel:${SHOWROOM_INFO.phoneRaw}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-white text-sm font-semibold transition-all hover:bg-slate-800"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call: {SHOWROOM_INFO.phone}</span>
                </a>
                <a
                  href={`mailto:${SHOWROOM_INFO.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-brand-500 text-slate-300 hover:text-white text-sm font-medium transition-all hover:bg-slate-800"
                >
                  <Mail className="w-4 h-4 text-brand-400" />
                  <span>{SHOWROOM_INFO.email}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Embedded Google Map (7 columns) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                <Navigation className="w-4 h-4 text-brand-400" />
                Showroom Location & Directions
              </h4>
              <a
                href={SHOWROOM_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-semibold"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Embedded Google Maps Container */}
            <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 flex flex-col">
              <iframe
                src={SHOWROOM_INFO.mapsEmbedSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Brothers Autos Showroom Location"
                className="w-full h-full"
              />

              {/* Bottom Quick Map Bar */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 shadow-lg">
                <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5 truncate pr-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                  <span className="truncate">Machohalli Showroom &bull; Magadi Main Rd</span>
                </span>
                <a
                  href={SHOWROOM_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors shrink-0 shadow-sm"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & quick links bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Brothers Autos. All Rights Reserved. Certified Pre-Owned Dealership.</p>
          <div className="flex items-center space-x-6">
            <Link href="/inventory" className="hover:text-slate-300 transition-colors">
              Browse Cars
            </Link>
            <Link href="/#loan-calculator" className="hover:text-slate-300 transition-colors">
              EMI Calculator
            </Link>
            <Link href="/admin" className="hover:text-amber-400 transition-colors">
              Dealer Portal
            </Link>
            <a 
              href={`https://wa.me/${SHOWROOM_INFO.whatsappNumber}?text=${encodeURIComponent('Hi Brothers Autos, I would like to inquire about Used Cars')}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
