'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SHOWROOM_INFO } from '@/lib/constants';
import { 
  Phone, 
  Menu, 
  X, 
  Car, 
  ShieldCheck, 
  Calculator, 
  MapPin, 
  UserCog,
  ChevronRight
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Inventory', href: '/inventory' },
    { name: 'Why Us', href: '/#why-choose-us' },
    { name: 'EMI Calculator', href: '/#loan-calculator' },
    { name: 'Contact & Location', href: '/#contact-location' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-sm transition-all">
      {/* Top micro-bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Certified Pre-Owned &bull; 200-Point Inspection Guaranteed
            </span>
            <span className="text-slate-400 hidden lg:inline flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              {SHOWROOM_INFO.address.city}, {SHOWROOM_INFO.address.landmark}
            </span>
          </div>
          <div className="flex items-center space-x-5">
            <span className="text-slate-300">Mon-Sun: 9:30 AM – 8:30 PM</span>
            <a 
              href={`tel:${SHOWROOM_INFO.phoneRaw}`} 
              className="font-semibold text-white hover:text-brand-400 transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              {SHOWROOM_INFO.phone}
            </a>
            <Link 
              href="/admin" 
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 hover:border-amber-500 transition-all"
            >
              <UserCog className="w-3 h-3" />
              Dealer Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Header Title */}
          <Link href="/" className="flex items-center group py-1">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
              Brothers Autos
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-slate-700 hover:text-brand-600 hover:bg-slate-100'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center space-x-3">
            <a
              href={`tel:${SHOWROOM_INFO.phoneRaw}`}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-800 hover:text-brand-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all border border-slate-200"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Call Us</span>
            </a>

            <Link
              href="/inventory"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Car className="w-4 h-4" />
              <span>Explore Cars</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={`tel:${SHOWROOM_INFO.phoneRaw}`}
              className="p-2 text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-200"
              aria-label="Call Brothers Autos"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-fadeIn">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-brand-50 hover:text-brand-600"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100"
            >
              <span className="flex items-center gap-2">
                <UserCog className="w-4 h-4 text-amber-600" />
                Dealer Admin Portal
              </span>
              <ChevronRight className="w-4 h-4 text-amber-500" />
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2.5">
            <a
              href={`tel:${SHOWROOM_INFO.phoneRaw}`}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold shadow hover:bg-emerald-700 text-sm"
            >
              <Phone className="w-4 h-4" />
              Call {SHOWROOM_INFO.phone}
            </a>
            <Link
              href="/inventory"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 text-white font-bold shadow hover:bg-brand-700 text-sm"
            >
              <Car className="w-4 h-4" />
              View Full Inventory
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
