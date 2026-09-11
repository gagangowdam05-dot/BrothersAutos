'use client';

import React, { useState, useEffect } from 'react';
import { calculateEMI, formatExactPrice, formatPrice } from '@/lib/utils';
import { Calculator, CheckCircle, Percent, Calendar, IndianRupee, Landmark } from 'lucide-react';

interface EmiCalculatorProps {
  initialPrice?: number;
  onApplyLoan?: () => void;
}

export default function EmiCalculator({ initialPrice = 1500000, onApplyLoan }: EmiCalculatorProps) {
  const [carPrice, setCarPrice] = useState(initialPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenureYears, setTenureYears] = useState(5);

  useEffect(() => {
    if (initialPrice) {
      setCarPrice(initialPrice);
    }
  }, [initialPrice]);

  const downPaymentAmount = Math.round((carPrice * downPaymentPercent) / 100);
  const loanAmount = carPrice - downPaymentAmount;

  const { monthlyEmi, totalInterest, totalPayable } = calculateEMI(
    loanAmount,
    interestRate,
    tenureYears
  );

  const interestPercentage = totalPayable > 0 ? Math.round((totalInterest / totalPayable) * 100) : 0;
  const principalPercentage = 100 - interestPercentage;

  return (
    <div id="loan-calculator" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Car Loan & EMI Estimator
            </h3>
            <p className="text-xs text-slate-500">
              Calculate your estimated monthly installment with competitive bank interest rates
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle className="w-3.5 h-3.5" />
          Zero Prepayment Charges*
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Interactive Sliders (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Car Price */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Vehicle Price
              </label>
              <span className="text-sm font-bold text-slate-900">
                {formatExactPrice(carPrice)}
              </span>
            </div>
            <input
              type="range"
              min={200000}
              max={10000000}
              step={50000}
              value={carPrice}
              onChange={(e) => setCarPrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
          </div>

          {/* Down Payment */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Down Payment ({downPaymentPercent}%)
              </label>
              <span className="text-sm font-bold text-slate-900">
                {formatExactPrice(downPaymentAmount)}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Min 10%</span>
              <span className="text-brand-600 font-semibold">Loan Principal: {formatExactPrice(loanAmount)}</span>
              <span>Max 60%</span>
            </div>
          </div>

          {/* Interest Rate & Tenure Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Interest Rate (p.a.)
                </label>
                <span className="text-sm font-bold text-slate-900">{interestRate}%</span>
              </div>
              <input
                type="range"
                min={7.5}
                max={15}
                step={0.25}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Loan Tenure
                </label>
                <span className="text-sm font-bold text-slate-900">{tenureYears} Years</span>
              </div>
              <input
                type="range"
                min={1}
                max={7}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
              />
            </div>
          </div>

          {/* Quick Tenure Badges */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-slate-400 font-medium">Quick Tenure:</span>
            {[3, 4, 5, 7].map((yr) => (
              <button
                key={yr}
                onClick={() => setTenureYears(yr)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  tenureYears === yr
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {yr} Years
              </button>
            ))}
          </div>
        </div>

        {/* Right EMI Result Card (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-navy-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Estimated Monthly EMI
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
              ₹{monthlyEmi.toLocaleString('en-IN')}
              <span className="text-sm font-normal text-slate-400"> / month</span>
            </div>

            {/* Visual ratio bar */}
            <div className="mt-5 space-y-2">
              <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div 
                  style={{ width: `${principalPercentage}%` }} 
                  className="bg-brand-500 h-full transition-all"
                  title={`Principal: ${principalPercentage}%`}
                />
                <div 
                  style={{ width: `${interestPercentage}%` }} 
                  className="bg-amber-400 h-full transition-all"
                  title={`Interest: ${interestPercentage}%`}
                />
              </div>

              <div className="flex justify-between text-xs text-slate-300 font-medium pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-500" />
                  Principal: {principalPercentage}%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Interest: {interestPercentage}%
                </span>
              </div>
            </div>

            {/* Breakdown numbers */}
            <div className="mt-5 space-y-2.5 pt-4 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Principal Loan Amount:</span>
                <strong className="text-white">{formatExactPrice(loanAmount)}</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Interest Payable:</span>
                <strong className="text-amber-300">+{formatExactPrice(totalInterest)}</strong>
              </div>
              <div className="flex justify-between text-slate-300 font-semibold pt-1 border-t border-slate-800">
                <span className="text-white">Total Amount Payable:</span>
                <strong className="text-white">{formatExactPrice(totalPayable)}</strong>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Landmark className="w-3.5 h-3.5 text-brand-400" />
              <span>Partnered with HDFC, ICICI, SBI & Axis Bank</span>
            </div>
            {onApplyLoan && (
              <button
                onClick={onApplyLoan}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-brand-500 hover:bg-brand-400 text-white transition-colors shadow-md"
              >
                Inquire for Instant Loan Approval
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
