'use client';

import React, { useState } from 'react';
import TestDriveModal from '@/components/TestDriveModal';
import ReserveModal from '@/components/ReserveModal';
import EmiCalculator from '@/components/EmiCalculator';
import { getWhatsAppCarInquiryUrl, calculateEMI } from '@/lib/utils';
import { 
  Car, 
  Lock, 
  MessageCircle, 
  Calculator, 
  ChevronDown, 
  ChevronUp, 
  CalendarClock 
} from 'lucide-react';

interface CarDetailsClientActionsProps {
  car: {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    status: string;
  };
}

export default function CarDetailsClientActions({ car }: CarDetailsClientActionsProps) {
  const [testDriveOpen, setTestDriveOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [showEmiCalculator, setShowEmiCalculator] = useState(false);

  const whatsappUrl = getWhatsAppCarInquiryUrl(car);

  // Approximate starting EMI
  const loanPrincipal = car.price * 0.8;
  const emi = calculateEMI(loanPrincipal, 9.5, 5);

  const isSold = car.status === 'SOLD';

  return (
    <div className="space-y-4">
      {/* Primary Action Buttons */}
      <div className="space-y-2.5">
        
        {/* 1. Book Test Drive */}
        <button
          onClick={() => setTestDriveOpen(true)}
          disabled={isSold}
          className="w-full py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white shadow-md hover:shadow-brand-500/20 transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <CalendarClock className="w-5 h-5" />
          <span>Book Free Test Drive</span>
        </button>

        {/* 2. Advance Booking / Reserve Button */}
        <button
          onClick={() => setReserveOpen(true)}
          disabled={isSold}
          className="w-full py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-md hover:shadow-amber-500/20 transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Lock className="w-5 h-5" />
          <span>Advance Booking / Reserve</span>
        </button>

        {/* 3. Prominent WhatsApp Button with Dynamic Pre-filled Template */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-emerald-600/20 transition-all active:scale-98 flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>Instant WhatsApp Inquiry</span>
        </a>
      </div>

      {/* EMI Teaser Strip & Toggle */}
      <div className="pt-3 border-t border-slate-100">
        <div 
          onClick={() => setShowEmiCalculator(!showEmiCalculator)}
          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors border border-slate-200/80"
        >
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-brand-600" />
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Estimated EMI: ₹{emi.monthlyEmi.toLocaleString('en-IN')}/mo*
              </span>
              <span className="text-[11px] text-slate-500 block">
                Based on 20% down payment @ 9.5% for 5 years
              </span>
            </div>
          </div>
          <button className="text-brand-600 text-xs font-bold flex items-center gap-1">
            <span>{showEmiCalculator ? 'Hide' : 'Calculate'}</span>
            {showEmiCalculator ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Expandable EMI Calculator */}
        {showEmiCalculator && (
          <div className="mt-3 animate-fadeIn">
            <EmiCalculator 
              initialPrice={car.price} 
              onApplyLoan={() => setTestDriveOpen(true)}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <TestDriveModal
        isOpen={testDriveOpen}
        onClose={() => setTestDriveOpen(false)}
        car={car}
      />

      <ReserveModal
        isOpen={reserveOpen}
        onClose={() => setReserveOpen(false)}
        car={car}
      />
    </div>
  );
}
