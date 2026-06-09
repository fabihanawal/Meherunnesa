import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Landmark, Calendar, Percent, ShieldCheck, DollarSign } from 'lucide-react';
import { Plot } from '../types';

interface CalculatorProps {
  plots: Plot[];
  selectedPlot: Plot | null;
  onSelectPlot: (plot: Plot) => void;
}

export default function Calculator({ plots, selectedPlot, onSelectPlot }: CalculatorProps) {
  const [customPrice, setCustomPrice] = useState<number>(500000);
  const [useCustom, setUseCustom] = useState<boolean>(false);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(30); // percents
  const [months, setMonths] = useState<number>(12); // installment months

  // Force custom use off if selectedPlot is loaded or updated
  useEffect(() => {
    if (selectedPlot) {
      setUseCustom(false);
    }
  }, [selectedPlot]);

  const activePrice = useCustom ? customPrice : (selectedPlot?.totalPrice || 450000);
  const downPaymentVal = Math.round((activePrice * downPaymentPct) / 100);
  const remainingValue = activePrice - downPaymentVal;
  const monthlyInstallment = Math.round(remainingValue / months);

  // Suggested values for quick buttons
  const isSelectedPlotNull = !selectedPlot;

  return (
    <section id="calculator-section" className="py-16 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Description Left */}
          <div className="lg:col-span-5 space-y-5 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
              <Landmark className="w-3.5 h-3.5" />
              <span>সহজ কিস্তি গণনা</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans tracking-tight">
              সুদ-মুক্ত বিশেষ কিস্তি ক্যালকুলেটর
            </h2>
            
            <p className="text-slate-650 text-sm leading-relaxed font-sans">
              মেহেরুন্নেসা সোসাইটিতে আমরা দীর্ঘমেয়াদী কিস্তি সুবিধা দিয়ে থাকি। ১৫ই মে থেকে ১৫ই জুন, ২০২৬ পর্যন্ত বিশেষ ক্যাম্পেইনে আপনার মনোনীত যেকোনো রেডি প্লট কিনতে পারবেন <strong>সম্পূর্ণ সুদ-মুক্ত ১০% থেকে সর্বোচ্চ ২৪ মাসের সহজ কিস্তিতে!</strong>
            </p>

            <div className="space-y-3 bg-white p-4.5 rounded-xl border border-slate-200 shadow-sm text-xs text-slate-500 font-sans">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <p>কোনো সুদ চার্জ নেই — সম্পূর্ণ আসল দাম কিস্তি হবে।</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <p>ডাউন পেমেন্টের পরিমাণ বাড়িয়ে মাসিক কিস্তি আরও কমাতে পারেন।</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <p>১ মাসের মধ্যে এককালীন ক্রয়ে বিশেষ ক্যাশ ডিসকাউন্ট রয়েছে।</p>
              </div>
            </div>
          </div>

          {/* Dynamic Calculator panel Right */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-36 h-36 bg-teal-500/10 rounded-full filter blur-2xl pointer-events-none" />

              <div className="text-left mb-6">
                <h4 className="text-lg font-bold text-white mb-1">আপনার হিসাবটি তৈরি করুন</h4>
                <p className="text-slate-450 text-xs">প্লট সিলেক্ট করে নিচের স্লাইডার দিয়ে দাম সামঞ্জস্য করুন।</p>
              </div>

              {/* Step 1: Base Calculation Setup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6 text-left">
                {/* Selector */}
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase">মনোনীত প্লট সিলেক্ট করুন</label>
                  <select
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-3 text-slate-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={useCustom ? 'custom' : (selectedPlot?.id || '')}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'custom') {
                        setUseCustom(true);
                      } else {
                        const found = plots.find(p => p.id === val);
                        if (found) {
                          onSelectPlot(found);
                          setUseCustom(false);
                        }
                      }
                    }}
                  >
                    {plots.map((plot) => (
                      <option key={plot.id} value={plot.id}>
                        প্লট {plot.plotNumber} ({plot.sizeKatha} কাঠা — ৳{plot.totalPrice.toLocaleString('bn-BD')})
                      </option>
                    ))}
                    <option value="custom">অনান্য (নিজের মূল্য লিখুন)</option>
                  </select>
                </div>

                {/* Land Value Entry */}
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase select-none">জমির মোট মূল্য (টাকা)</label>
                  {useCustom ? (
                    <input
                      type="number"
                      step="5000"
                      min="100000"
                      max="10000000"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-emerald-400 text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(Number(e.target.value))}
                    />
                  ) : (
                    <div className="w-full bg-slate-800 border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-emerald-300 text-base font-extrabold font-mono flex justify-between items-center bg-slate-800/80">
                      <span>৳ {activePrice.toLocaleString('bn-BD')}</span>
                      <span className="text-[10px] text-teal-400 border border-teal-500/20 px-1.5 py-0.5 rounded font-sans font-bold">প্লট {selectedPlot?.plotNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Downpayment Slider */}
              <div className="space-y-4 mb-6 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold uppercase flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-teal-400" />
                    <span>ডাউন পেমেন্ট ({downPaymentPct}%)</span>
                  </span>
                  <span className="text-emerald-400 font-extrabold font-mono text-sm">
                    ৳ {downPaymentVal.toLocaleString('bn-BD')} /-
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  value={downPaymentPct}
                  onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                  <span>১০% (ন্যূনতম)</span>
                  <span>৩০% (সুপারিশ)</span>
                  <span>৫০%</span>
                  <span>৮০% (সর্বোচ্চ)</span>
                </div>
              </div>

              {/* Installment Term slider */}
              <div className="space-y-4 mb-8 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold uppercase flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" />
                    <span>কিস্তির মেয়াদ সময় ({months} মাস)</span>
                  </span>
                  <span className="text-emerald-300 font-bold font-mono">
                    বাকি মূল্য: ৳ {remainingValue.toLocaleString('bn-BD')}
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="24"
                  step="3"
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                  <span>৩ মাস</span>
                  <span>৬ মাস (অর্ধ-বছর)</span>
                  <span>১২ মাস (১ বছর)</span>
                  <span>২৪ মাস (২ বছর)</span>
                </div>
              </div>

              {/* Results Area Box */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-2xl p-5 border border-emerald-500/20 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-left">
                <div className="sm:col-span-2">
                  <span className="text-slate-400 text-xs font-semibold uppercase block mb-1">আসল সুদ-মুক্ত কিস্তিতে</span>
                  <p className="text-[10px] text-amber-300 flex items-center gap-1 mb-2 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>১০০% বিএসডিআর রেট ফি - ০% ব্যাংক সুদ</span>
                  </p>
                  <span className="text-[10px] text-slate-500 block leading-tight">মেয়াদ পর্যন্ত মোট পরিশোধযোগ্য কিস্তি সংখ্যা: {months} টি</span>
                </div>
                
                {/* Monthly Cost Final Show */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-center sm:text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">মাসিক কিস্তি</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono block leading-tight">
                    ৳ {monthlyInstallment.toLocaleString('bn-BD')}
                  </span>
                  <span className="text-[9px] text-slate-550 block mt-1 font-bold">প্রতি মাস /-</span>
                </div>
              </div>

              {/* Call-to-action details */}
              <div className="mt-5 text-center">
                <span className="text-[11px] text-slate-450 italic font-sans">
                  *কিস্তি ক্রয়ের চুক্তির প্রাক্কালে কোনো প্রসেসিং চার্জ কর্তন করা হবে না। আজই আপনার সুবিধামত প্লট বুকিং করুন।
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
