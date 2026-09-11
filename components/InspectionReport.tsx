import React from 'react';
import { ShieldCheck, CheckCircle2, Award, Zap, Wrench, CircleDot } from 'lucide-react';

export default function InspectionReport() {
  const checkCategories = [
    { name: 'Engine & Transmission', score: '5 / 5', desc: 'Zero oil leaks, smooth gear shifts, pristine compression', icon: Wrench },
    { name: 'Suspension & Steering', score: '5 / 5', desc: 'No squeaks, shock absorbers calibrated, precise alignment', icon: CircleDot },
    { name: 'Brakes & Wheels', score: '5 / 5', desc: 'Brake pads >80% life, ABS responsive, premium tyres', icon: Award },
    { name: 'Electricals & AC', score: '5 / 5', desc: 'Chilling climate control, all sensors & infotainment tested', icon: Zap },
    { name: 'Body Structure & Chassis', score: '5 / 5', desc: 'Certified non-accidental, factory apron & pillars intact', icon: ShieldCheck },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-navy-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-2xl">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              Brothers Autos Certified
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              200-Point Quality Inspection Report
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold self-start sm:self-auto">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Passed &bull; Grade A+ Certified</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
        {checkCategories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-brand-400" />
                  <h4 className="text-xs font-bold text-white">{cat.name}</h4>
                </div>
                <span className="text-xs font-black text-emerald-400 font-mono">
                  {cat.score}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {cat.desc}
              </p>
            </div>
          );
        })}

        {/* Certificate Stamp Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-900/50 to-emerald-900/50 border border-brand-700/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-brand-300 font-bold uppercase tracking-wider">
              Warranty Coverage
            </span>
            <p className="text-sm font-bold text-white mt-0.5">1-Year Engine Warranty</p>
            <p className="text-[10px] text-slate-300 mt-1">24x7 Pan-India Roadside Assistance</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/40">
            100%
          </div>
        </div>
      </div>
    </div>
  );
}
