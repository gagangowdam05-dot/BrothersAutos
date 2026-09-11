'use client';

import React, { useState } from 'react';
import { X, Lock, CheckCircle2, ShieldCheck, Phone, Mail, User, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface ReserveModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
  };
}

export default function ReserveModal({ isOpen, onClose, car }: ReserveModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    tokenAmount: 10000,
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMessage('Please enter your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: car.id,
          carTitle: `${car.year} ${car.make} ${car.model}`,
          customerName: formData.name,
          phone: formData.phone,
          email: formData.email,
          inquiryType: 'RESERVE_BOOKING',
          tokenAmount: formData.tokenAmount,
          message: formData.message || `Advance token reservation request of ₹${formData.tokenAmount.toLocaleString('en-IN')}.`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit reservation');
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      tokenAmount: 10000,
      message: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 relative">
          <button
            onClick={handleReset}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-100 uppercase tracking-wider mb-1">
            <Lock className="w-3.5 h-3.5" />
            Exclusive Vehicle Hold
          </span>
          <h3 className="text-xl font-black tracking-tight text-white">
            Advance Booking / Reservation
          </h3>
          <p className="text-xs text-amber-100 mt-1">
            Lock the <strong className="text-white">{car.year} {car.make} {car.model}</strong> ({formatPrice(car.price)}) for 48 hours so nobody else can claim it.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Reservation Request Initiated!</h4>
                <p className="text-sm text-slate-600 max-w-sm mx-auto mt-1">
                  Thank you, <span className="font-semibold text-slate-900">{formData.name}</span>. 
                  Our Senior Sales Executive will contact you immediately at <span className="font-semibold text-slate-900">{formData.phone}</span> with the official Brothers Autos booking account details & token receipt.
                </p>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 text-left space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  100% Refundable Token Policy
                </div>
                <p className="text-[11px] text-amber-800">
                  If you inspect the car and decide not to proceed, your booking deposit of ₹{formData.tokenAmount.toLocaleString('en-IN')} is refunded in full with zero deduction.
                </p>
              </div>

              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors shadow-md"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Notice Box */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  Cars sell fast! Placing a refundable reservation token prevents other buyers from purchasing this vehicle for 48 hours.
                </p>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Vikram Malhotra"
                      className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9811122334"
                      className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. vikram@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Token Deposit Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Refundable Reservation Token
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[5000, 10000, 25000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setFormData({ ...formData, tokenAmount: amt })}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        formData.tokenAmount === amt
                          ? 'border-amber-600 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Special Instructions / Financing Queries
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Need assistance with loan approval, RC transfer in Thane, etc."
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm shadow-md transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                {isSubmitting ? 'Reserving Vehicle...' : `Reserve Car (₹${formData.tokenAmount.toLocaleString('en-IN')})`}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Refundable &bull; Official Digital Tax Invoice Issued</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
