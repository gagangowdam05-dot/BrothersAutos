import React from 'react';
import { 
  Gauge, 
  Fuel, 
  Sliders, 
  UserCheck, 
  ShieldAlert, 
  Palette, 
  MapPin, 
  CarFront 
} from 'lucide-react';
import { formatKm } from '@/lib/utils';

interface QuickSpecsProps {
  car: {
    mileageKm: number;
    fuelType: string;
    transmission: string;
    ownership: string;
    bodyType?: string;
    registrationCity?: string;
    insuranceValidTill?: string;
    color?: string;
  };
}

export default function QuickSpecs({ car }: QuickSpecsProps) {
  const specs = [
    {
      label: 'Kilometers',
      value: formatKm(car.mileageKm),
      icon: Gauge,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Fuel Type',
      value: car.fuelType,
      icon: Fuel,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Transmission',
      value: car.transmission,
      icon: Sliders,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      label: 'Ownership',
      value: car.ownership,
      icon: UserCheck,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Body Style',
      value: car.bodyType || 'SUV / Sedan',
      icon: CarFront,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      label: 'Registration',
      value: car.registrationCity || 'Certified',
      icon: MapPin,
      color: 'text-rose-600 bg-rose-50',
    },
    {
      label: 'Exterior Color',
      value: car.color || 'Standard',
      icon: Palette,
      color: 'text-slate-600 bg-slate-100',
    },
    {
      label: 'Insurance Validity',
      value: car.insuranceValidTill || 'Comprehensive',
      icon: ShieldAlert,
      color: 'text-teal-600 bg-teal-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {specs.map((spec, i) => {
        const Icon = spec.icon;
        return (
          <div
            key={i}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-brand-400 transition-colors"
          >
            <div className={`p-2.5 rounded-lg shrink-0 ${spec.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
                {spec.label}
              </span>
              <span className="block text-sm font-bold text-slate-900 truncate">
                {spec.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
