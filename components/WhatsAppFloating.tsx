'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppCarInquiryUrl, getGeneralWhatsAppUrl } from '@/lib/utils';

interface WhatsAppFloatingProps {
  car?: {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
  };
}

export default function WhatsAppFloating({ car }: WhatsAppFloatingProps) {
  const url = car ? getWhatsAppCarInquiryUrl(car) : getGeneralWhatsAppUrl();

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip on hover */}
      <div className="hidden sm:block mr-3 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {car ? `Chat about ${car.make} ${car.model}` : 'Chat with Brothers Autos'}
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        {/* Subtle ping pulse */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400/40 animate-ping pointer-events-none" />
        
        <MessageCircle className="w-7 h-7 fill-current relative z-10" />
      </a>
    </div>
  );
}
