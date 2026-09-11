'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, ShieldCheck, Car, Phone, Mail, User } from 'lucide-react';

interface TestDriveModalProps {
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

export default function TestDriveModal({ isOpen, onClose, car }: TestDriveModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: '11:00 AM - 01:00 PM',
    driveLocation: 'SHOWROOM', // SHOWROOM or DOORSTEP
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMessage('Please provide your name and phone number.');
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
          inquiryType: 'TEST_DRIVE',
          preferredDate: formData.preferredDate || new Date().toISOString().split('T')[0],
          preferredTime: formData.preferredTime,
          message: `Location: ${formData.driveLocation}. Notes: ${formData.notes || 'None'}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit booking');
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
      preferredDate: '',
      preferredTime: '11:00 AM - 01:00 PM',
      driveLocation: 'SHOWROOM',
      notes: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-slate-900 to-navy-900 text-white p-6 relative">
          <button
            onClick={handleReset}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Car className="w-3.5 h-3.5" />
            Test Drive Booking
          </span>
          <h3 className="text-xl font-black tracking-tight text-white">
            Schedule a Free Test Drive
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Experience the <strong className="text-white">{car.year} {car.make} {car.model}</strong> first-hand with zero commitments.
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Test Drive Confirmed!</h4>
                <p className="text-sm text-slate-600 max-w-xs mx-auto mt-1">
                  Thank you, <span className="font-semibold text-slate-900">{formData.name}</span>. 
                  Our showroom manager has received your request for the {car.make} {car.model} and will call you at <span className="font-semibold text-slate-900">{formData.phone}</span> within 30 minutes to confirm your slot.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-500 max-w-sm mx-auto flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>Sanitized vehicle &bull; Valid Driving License required</span>
              </div>

              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors shadow-md"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
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
                      placeholder="e.g. 9876543210"
                      className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. rahul@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Date and Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Time Window
                  </label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                  >
                    <option value="10:00 AM - 12:00 PM">Morning (10 AM - 12 PM)</option>
                    <option value="12:00 PM - 03:00 PM">Afternoon (12 PM - 3 PM)</option>
                    <option value="03:00 PM - 06:00 PM">Evening (3 PM - 6 PM)</option>
                    <option value="06:00 PM - 08:00 PM">Late Evening (6 PM - 8 PM)</option>
                  </select>
                </div>
              </div>

              {/* Test Drive Location Preference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Test Drive Location
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, driveLocation: 'SHOWROOM' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      formData.driveLocation === 'SHOWROOM'
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    At Brothers Autos Hub
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, driveLocation: 'DOORSTEP' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      formData.driveLocation === 'DOORSTEP'
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Doorstep Test Drive*
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-bold text-sm shadow-md transition-all active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? 'Booking Your Slot...' : 'Confirm Test Drive Booking'}
              </button>

              <p className="text-[11px] text-center text-slate-400">
                🔒 Your contact details are 100% confidential. No spam calls.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
