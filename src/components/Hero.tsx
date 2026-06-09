import { motion } from 'motion/react';
import { ShieldCheck, MapPin, Compass, Landmark, PhoneCall } from 'lucide-react';

interface HeroProps {
  totalPlots: number;
  availablePlots: number;
  soldPlots: number;
  onScrollToPlots: () => void;
  onScrollToCalculator: () => void;
  customTitle?: string;
  customSubtitle?: string;
}

export default function Hero({
  totalPlots,
  availablePlots,
  soldPlots,
  onScrollToPlots,
  onScrollToCalculator,
  customTitle,
  customSubtitle
}: HeroProps) {
  return (
    <div id="home" className="relative bg-slate-900 border-b border-slate-800 text-white overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Intro */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>নিষ্কণ্টক সরাসরি রেডি প্লট বিক্রয় চলছে</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans whitespace-pre-line"
            >
              {customTitle || (
                <>
                  মেহেরুন্নেসা সোসাইটি <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                    প্রজেক্ট ২ - স্বপ্নের প্লট কিনুন
                  </span>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-350 max-w-2xl leading-relaxed font-sans whitespace-pre-line"
            >
              {customSubtitle || "আজই বেছে নিন আপনার ভবিষ্যৎ আবাসন কিংবা বাণিজ্যিক ঠিকানা। নওগাঁর দক্ষিণ চকমোক্তার (এনামুলের মোড়) সংলগ্ন মনোরম পরিবেশে ২০ ফুট প্রশস্ত পিচঢালা মেইন রোড ঘেঁষে গড়ে উঠছে এক স্বপ্নীল আবাসন প্রকল্প। সুদ-মুক্ত সহজ কিস্তি সুবিধা নিয়ে এখনই ঘর বানানোর উপযোগী নিষ্কণ্টক জমি।"}
            </motion.p>

            {/* Quick Benefits Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3"
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1 text-emerald-400 rounded bg-emerald-500/10 mt-1">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-100 text-sm">চমৎকার সংযোগ</h4>
                  <p className="text-slate-400 text-xs">২০ ফুট মেইন পিস রাস্তা এবং ১০ ফুট অভ্যন্তরীণ সংযোগ পথ</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 text-emerald-400 rounded bg-emerald-500/10 mt-1">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-100 text-sm">মনোরম পরিবেশ ও এখনই বাড়ীযোগ্য</h4>
                  <p className="text-slate-400 text-xs">প্লট এলাকাতেই ইতিমধ্যে ১ ও ৩ তলা বাড়ী বিদ্যমান ও নিরাপদ পরিবেশ</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 col-span-1 sm:col-span-2">
                <div className="p-1 text-emerald-400 rounded bg-emerald-500/10 mt-0.5">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-100 text-sm">সীমিত সময়ের কিস্তি অফার: </span>
                  <span className="text-slate-300 text-sm font-medium">১৫মে - ১৫জুন, ২০২৬ পর্যন্ত সুদ মুক্ত কিস্তির সুবিধা!</span>
                </div>
              </div>
            </motion.div>

            {/* CTA Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <button
                onClick={onScrollToPlots}
                id="cta-view-plots"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-base font-medium rounded-xl text-slate-900 bg-emerald-400 hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all font-sans font-semibold cursor-pointer shadow-lg shadow-emerald-500/25"
              >
                প্লট ও মূল্য তালিকা দেখুন
              </button>
              <button
                onClick={onScrollToCalculator}
                id="cta-calculator"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-slate-700 hover:border-slate-500 text-base font-medium rounded-xl text-white bg-slate-800/40 hover:bg-slate-800 transition-all font-sans cursor-pointer"
              >
                কিস্তি হিসাব করুন
              </button>
              <a
                href="tel:01535491716"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-dashed border-teal-500/50 hover:border-teal-400 text-base font-semibold rounded-xl text-teal-300 bg-teal-500/5 hover:bg-teal-500/10 transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>০১৫৩৫৪৯১৭১৬</span>
              </a>
            </motion.div>
          </div>

          {/* Right Image Feature & Dashboard Metrics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl shadow-emerald-950/20 group">
              <img
                src="/src/assets/images/meherunnesa_hero_1780851448884.png"
                alt="Meherunnesa Society Premium Layout"
                className="w-full h-[320px] sm:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
            </div>

            {/* Dashboard Floating Real-time Stats */}
            <div className="absolute -bottom-6 -left-6 sm:bottom-4 sm:left-4 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 p-5 rounded-xl text-left shadow-2xl max-w-[280px] w-full hidden sm:block">
              <h5 className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-3">লাইভ প্রজেক্ট ডাটাবেজ</h5>
              <div className="grid grid-cols-3 gap-3 border-t border-slate-800 pt-2.5">
                <div>
                  <p className="text-2xl font-bold text-emerald-400 font-mono">{totalPlots || 12}</p>
                  <p className="text-[10px] text-slate-400">মোট প্লট</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-teal-400 font-mono">{availablePlots ?? 8}</p>
                  <p className="text-[10px] text-slate-400">অবশিষ্ট</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-rose-400 font-mono">{soldPlots ?? 2}</p>
                  <p className="text-[10px] text-slate-400">বিক্রিত</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
