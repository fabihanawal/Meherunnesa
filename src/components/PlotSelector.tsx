import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, AlertCircle, Compass, Layers, FileText, Sparkles, Map } from 'lucide-react';
import { Plot } from '../types';

interface PlotSelectorProps {
  plots: Plot[];
  onSelectPlot: (plot: Plot) => void;
  selectedPlot: Plot | null;
  layoutMapUrl?: string;
}

export default function PlotSelector({ plots, onSelectPlot, selectedPlot, layoutMapUrl }: PlotSelectorProps) {
  const [viewMode, setViewMode] = useState<'interactive' | 'map'>('interactive');
  const [filter, setFilter] = useState<'all' | 'available' | 'booked' | 'sold'>('all');

  const filteredPlots = plots.filter((plot) => {
    if (filter === 'all') return true;
    return plot.status === filter;
  });

  // Color mappings based on status
  const getStatusColor = (status: 'available' | 'booked' | 'sold') => {
    switch (status) {
      case 'available':
        return {
          bg: 'bg-emerald-50 text-emerald-750 border-emerald-200 hover:bg-emerald-100',
          darkBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
          pill: 'bg-emerald-500 text-white',
          accent: 'border-emerald-500',
          dot: 'bg-emerald-500'
        };
      case 'booked':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
          darkBg: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
          pill: 'bg-amber-500 text-slate-900',
          accent: 'border-amber-400',
          dot: 'bg-amber-500'
        };
      case 'sold':
        return {
          bg: 'bg-slate-55 text-slate-500 border-slate-200 opacity-80',
          darkBg: 'bg-rose-500/5 text-rose-400 border-rose-500/10 opacity-75',
          pill: 'bg-rose-500 text-white',
          accent: 'border-rose-400',
          dot: 'bg-rose-500'
        };
    }
  };

  return (
    <section id="map-layout" className="py-16 bg-white text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>ইন্টারেক্টিভ রিয়েল-টাইম্প ডেটা</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-sans">
            প্রজেক্টের নকশা ও লাইভ প্লট বোর্ড
          </h2>
          <p className="mt-4 text-slate-500 leading-relaxed font-sans">
            জমির সর্বশেষ বুকিং স্ট্যাটাস দেখুন লাইভ রিডিংয়ে। প্রতিটি প্লটের ওপর ক্লিক করে কাঠা প্রতি মূল্য ও কিস্তির যোগ্যতা পরীক্ষা করতে পারেন।
          </p>

          {/* Toggle Button layout */}
          <div className="mt-8 inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 shadow-sm">
            <button
              onClick={() => setViewMode('interactive')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'interactive'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>ইন্টারেক্টিভ স্পেসিফিকেশন</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>লেআউট নকশা ম্যাপ</span>
            </button>
          </div>
        </div>

        {viewMode === 'interactive' ? (
          <div>
            {/* Filter Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                  filter === 'all'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                সব প্লট ({plots.length})
              </button>
              <button
                onClick={() => setFilter('available')}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                  filter === 'available'
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                বুকিং সম্ভব ({plots.filter(p => p.status === 'available').length})
              </button>
              <button
                onClick={() => setFilter('booked')}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                  filter === 'booked'
                    ? 'bg-amber-500 text-slate-900 border-amber-500 shadow-md'
                    : 'bg-amber-55 text-amber-700 border-amber-100'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                বুকড করা ({plots.filter(p => p.status === 'booked').length})
              </button>
              <button
                onClick={() => setFilter('sold')}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                  filter === 'sold'
                    ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                    : 'bg-rose-50 text-rose-700 border-rose-100'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                বিক্রিত ({plots.filter(p => p.status === 'sold').length})
              </button>
            </div>

            {/* Content Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Plots Selection Board Grid */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 text-sm">সিলেকশন বোর্ড (সিলেক্ট করতে যেকোনো একটিতে ট্যাপ দিন)</h3>
                    <span className="text-[11px] text-slate-400 font-mono">মোট ফিল্টার করা: {filteredPlots.length}</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {filteredPlots.map((plot) => {
                      const color = getStatusColor(plot.status);
                      const isSelected = selectedPlot?.plotNumber === plot.plotNumber;
                      return (
                        <motion.button
                          key={plot.id}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onSelectPlot(plot)}
                          className={`relative border p-4 rounded-xl flex flex-col justify-between items-center h-28 cursor-pointer transition-all ${
                            color.bg
                          } ${isSelected ? 'ring-3 ring-emerald-400 border-emerald-400 font-extrabold shadow-lg' : 'shadow-sm'}`}
                        >
                          <span className="text-xs uppercase text-slate-400 tracking-wider">প্লট নং</span>
                          <span className="text-xl font-black font-sans shrink-0">{plot.plotNumber}</span>
                          
                          <div className="flex items-center gap-1 text-[10px]">
                            <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
                            <span className="capitalize font-medium text-[9px] text-slate-600">
                              {plot.status === 'available' ? 'ফাঁকা' : plot.status === 'booked' ? 'বুকড' : 'বিক্রিত'}
                            </span>
                          </div>

                          {/* Quick selection small tick */}
                          {isSelected && (
                            <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 border border-white">
                              <Check className="w-3.5 h-3.5 stroke-[3px]" />
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-teal-50 border border-teal-100 rounded-xl text-teal-800">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-[11px] font-medium leading-relaxed">
                    <strong>বিজ্ঞপ্তি:</strong> প্লটের বুকিং এবং বিক্রয় লাইভ টাইম আপডেট হচ্ছে। যেকোনো প্লটের বর্তমান বুকিং নিশ্চিতকরনে কাজী আশরাফ আলীর সাথে সরাসরি যোগাযোগ করার অনুরোধ করা হলো।
                  </p>
                </div>
              </div>

              {/* Specification Detail Column */}
              <div className="lg:col-span-5">
                <AnimatePresence mode="wait">
                  {selectedPlot ? (
                    <motion.div
                      key={selectedPlot.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 relative overflow-hidden"
                    >
                      {/* background highlights */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full filter blur-2xl pointer-events-none" />

                      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                        <div>
                          <p className="text-slate-400 text-xs tracking-wider uppercase mb-0.5">বিস্তারিত স্পেসিফিকেশন</p>
                          <h3 className="text-2xl font-extrabold text-white">প্লট নং {selectedPlot.plotNumber}</h3>
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${
                          selectedPlot.status === 'available'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : selectedPlot.status === 'booked'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-55/10 text-rose-400 border border-rose-500/10'
                        }`}>
                          {selectedPlot.status === 'available' ? 'অফার চলছে' : selectedPlot.status === 'booked' ? 'বুকড করা' : 'সম্পূর্ণ বিক্রিত'}
                        </span>
                      </div>

                      {selectedPlot.image && (
                        <div className="mb-5 rounded-xl overflow-hidden border border-slate-800 bg-slate-950/50 aspect-video relative max-h-[220px]">
                          <img 
                            src={selectedPlot.image} 
                            alt={`Plot ${selectedPlot.plotNumber} schematic`} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer" 
                          />
                        </div>
                      )}

                      {/* Info grid details */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                          <div className="flex items-center gap-2.5">
                            <Layers className="w-4 h-4 text-emerald-400" />
                            <span className="text-slate-400 text-sm">জমির পরিমাণ</span>
                          </div>
                          <span className="font-bold text-slate-100">{selectedPlot.sizeKatha} কাঠা</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                          <div className="flex items-center gap-2.5">
                            <Layers className="w-4 h-4 text-emerald-400" />
                            <span className="text-slate-400 text-sm">প্রতি কাঠার মূল্য</span>
                          </div>
                          <span className="font-bold text-slate-100">৳ {selectedPlot.pricePerKatha.toLocaleString('bn-BD')} টাকা</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-emerald-500/20">
                          <div className="flex items-center gap-2.5">
                            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                            <span className="text-amber-300 font-bold text-sm">মোট প্লট মূল্য</span>
                          </div>
                          <span className="text-xl font-black text-emerald-400 font-mono">
                            ৳ {selectedPlot.totalPrice.toLocaleString('bn-BD')} /-
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                          <div className="flex items-center gap-2.5">
                            <Compass className="w-4 h-4 text-teal-400" />
                            <span className="text-slate-400 text-sm">দিক মুখী অবস্থান</span>
                          </div>
                          <span className="font-medium text-slate-200 text-sm">{selectedPlot.facing}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                          <div className="flex items-center gap-2.5">
                            <Compass className="w-4 h-4 text-emerald-400" />
                            <span className="text-slate-400 text-sm">রাস্তার সংযোগ</span>
                          </div>
                          <span className="font-medium text-slate-200 text-xs">{selectedPlot.roadWidth}</span>
                        </div>

                        {selectedPlot.notes && (
                          <div className="p-3.5 rounded-xl bg-slate-800/20 border border-slate-800/60 text-slate-400 text-xs leading-relaxed flex items-start gap-2">
                            <FileText className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />
                            <span>{selectedPlot.notes}</span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons links inside detail card */}
                      <div className="mt-6 pt-5 border-t border-slate-800 flex gap-3">
                        {selectedPlot.status === 'available' ? (
                          <>
                            <a
                              href="#booking-section"
                              className="flex-1 text-center bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md shadow-emerald-400/10 block"
                            >
                              এটি এখনই বুকিং করুন
                            </a>
                            <a
                              href="#calculator-section"
                              className="flex-1 text-center bg-slate-800 hover:bg-slate-755 border border-slate-700 font-semibold py-3 px-4 rounded-xl text-xs text-slate-200 transition-all block"
                            >
                              কিস্তি হিসাব করুন
                            </a>
                          </>
                        ) : (
                          <div className="w-full text-center p-3 rounded-xl bg-slate-800/45 text-slate-400 text-xs font-semibold">
                            এই প্লটটি বর্তমানে বুকড বা বিক্রিত করা হয়েছে। দয়া করে অন্য আরেকটি প্লট নির্বাচন করুন।
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-[430px] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col justify-center items-center text-center p-6 bg-slate-50">
                      <Layers className="w-12 h-12 text-slate-300 mb-3 animate-bounce" />
                      <h4 className="font-bold text-slate-700 mb-1">কোনো প্লট নির্বাচন করা নেই</h4>
                      <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                        বুকিং স্ট্যাটাস এবং সম্পূর্ণ দামের লিস্ট দেখতে বাম পাশের সিলেকশন বোর্ড থেকে যেকোনো একটি প্লট সিলেক্ট করুন।
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        ) : (
          /* Real Image Map view of meherunnesa_layout */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center space-y-4 max-w-4xl mx-auto shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-850 text-sm">মেহেরুন্নেসা সোসাইটি - ব্লক ও প্লট বণ্টন নকশা</h3>
              <span className="text-slate-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                <span>মাস্টার রোড ২-২০ ফুট রাস্তা</span>
              </span>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-white shadow-inner max-w-2xl mx-auto">
              <img
                src={layoutMapUrl || "/src/assets/images/meherunnesa_layout_1780851468838.png"}
                alt="Meherunnesa Layout Blueprint"
                className="w-full h-auto object-contain p-2 max-h-[460px] mx-auto rounded-lg"
              />
            </div>
            
            <p className="text-slate-500 text-xs leading-relaxed max-w-xl mx-auto">
              <strong>মানচিত্রের ব্যাখ্যা:</strong> উপরে প্রদর্শিত নকশা অনুযায়ী ২০ ফুট রাস্তাটি দুর্গাপুর টু দয়ালের মোড়ের সাথে সংযুক্ত। প্রতিটি প্লটের অভ্যন্তরে প্রবেশের জন্য ১০ ফুটের আলাদা সংযোগ সড়ক রাখা হয়েছে যাতে বাড়ি নির্মাণ করা সহজ হয়।
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
