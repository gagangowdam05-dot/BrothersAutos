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

          {/* Interactive Embedded Google Map Placeholder (7 columns) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                <Navigation className="w-4 h-4 text-brand-400" />
                Showroom Location & Directions
              </h4>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-medium"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Styled Map Container */}
            <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
              {/* Map background styling simulation with street grid */}
              <div className="absolute inset-0 bg-slate-900">
                {/* SVG styled road map grid simulation */}
                <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="road-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                      <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#334155" strokeWidth="2" />
                      <path d="M 0 40 L 80 40" fill="none" stroke="#1e293b" strokeWidth="6" />
                      <path d="M 40 0 L 40 80" fill="none" stroke="#1e293b" strokeWidth="6" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#road-grid)" />
                  <line x1="0" y1="120" x2="100%" y2="160" stroke="#2563eb" strokeWidth="4" strokeOpacity="0.6" />
                  <line x1="180" y1="0" x2="320" y2="100%" stroke="#475569" strokeWidth="8" />
                </svg>

                {/* Subtle gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
              </div>

              {/* Showroom Marker Pin */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 pointer-events-none">
                <div className="relative mb-2">
                  <div className="absolute -inset-2 bg-brand-500/30 rounded-full animate-ping" />
                  <div className="relative p-3.5 bg-gradient-to-tr from-brand-600 to-brand-500 rounded-full text-white shadow-xl ring-4 ring-white/20">
                    <MapPin className="w-7 h-7" />
                  </div>
                </div>
                <div className="bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700 shadow-xl max-w-xs">
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Brothers Autos Showroom</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">Auto Zone, Opp Metro Pillar 184</p>
                  <p className="text-[10px] text-emerald-400 font-medium mt-1">Open Now &bull; Free Customer Parking Available</p>
                </div>
              </div>

              {/* Bottom Quick Map Bar */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 z-10">
                <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  25+ Premium Cars On Display Today
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Brothers Autos Mumbai')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-brand-600 hover:bg-brand-500 text-white font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors pointer-events-auto"
                >
                  <Navigation className="w-3 h-3" />
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & quick links bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Brothers Autos. All Rights Reserved. Certified Pre-Owned Vehicle Dealership.</p>
          <div className="flex items-center space-x-6">
            <Link href="/inventory" className="hover:text-slate-300 transition-colors">
              Browse Cars
            </Link>
            <Link href="/#loan-calculator" className="hover:text-slate-300 transition-colors">
              EMI Calculator
            </Link>
            <Link href="/admin" className="hover:text-amber-400 transition-colors">
              Dealer Login
            </Link>
            <a 
              href={`https://wa.me/${SHOWROOM_INFO.whatsappNumber}`} 
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
