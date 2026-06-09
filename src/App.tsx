import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Calculator as CalcIcon, 
  HelpCircle, 
  ExternalLink, 
  MessageSquare, 
  Clock, 
  ArrowRight,
  Menu,
  X,
  Compass,
  CheckCircle,
  ChevronDown
} from 'lucide-react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from './firebase';
import { Plot } from './types';
import { seedPlotsIfEmpty } from './data/seedPlots';

// Import components
import Hero from './components/Hero';
import Slideshow from './components/Slideshow';
import PlotSelector from './components/PlotSelector';
import Calculator from './components/Calculator';
import BookingForm from './components/BookingForm';
import AdminPanel from './components/AdminPanel';

const toBengaliNumber = (num: number | string): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);
};

const formatKatha = (size: number): string => {
  return toBengaliNumber(size.toFixed(2)) + ' কাঠা';
};

const formatPrice = (price: number): string => {
  const formatted = price.toLocaleString('en-IN');
  return toBengaliNumber(formatted) + '/-';
};

export default function App() {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Seed plots and sync data real-time from Firestore on mount
  useEffect(() => {
    const handleInit = async () => {
      // 1. Seed initial listings if vacant
      await seedPlotsIfEmpty();

      // 2. Realtime listener to plots data
      const q = query(collection(db, 'plots'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const plotList: Plot[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          plotList.push({
            id: doc.id,
            plotNumber: data.plotNumber,
            sizeKatha: data.sizeKatha,
            pricePerKatha: data.pricePerKatha,
            totalPrice: data.totalPrice,
            status: data.status,
            facing: data.facing,
            roadWidth: data.roadWidth,
            block: data.block || 'Block A',
            notes: data.notes
          });
        });
        
        // Sort plot list alphabetically by plotNumber (e.g. A-1, A-2, B-1)
        plotList.sort((a, b) => a.plotNumber.localeCompare(b.plotNumber, undefined, { numeric: true }));
        setPlots(plotList);
        setLoading(false);
      }, (error) => {
        console.error("Firestore loading error on client view: ", error);
        setLoading(false);
      });

      return unsubscribe;
    };

    handleInit();
  }, []);

  const totalPlots = plots.length;
  const availablePlots = plots.filter(p => p.status === 'available').length;
  const soldPlots = plots.filter(p => p.status === 'sold').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center text-white font-sans">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full mb-4"
        />
        <h3 className="text-lg font-bold tracking-wider animate-pulse text-slate-200">মেহেরুন্নেসা সোসাইটি ডাটাবেজ লোড হচ্ছে...</h3>
        <p className="text-slate-500 text-xs mt-1">অনুগ্রহ করে কয়েক সেকেন্ড অপেক্ষা করুন।</p>
      </div>
    );
  }

  // FAQs data
  const FAQS = [
    {
      q: "জমিটি কি এখনই বাড়ি বা মার্কেট করার উপযোগী?",
      a: "হ্যাঁ, সম্পূর্ণ মেহেরুন্নেসা সোসাইটি প্রজেক্ট ২ উঁচু ভরাট জমি যেখানে এখনই বাড়ী বা মার্কেট করার কাজ শুরু করা সম্ভব। প্রজেক্ট এলাকাতে ইতিমধ্যে তিনতলা ও একতলা আবাসিক বিল্ডিং তৈরি করা রয়েছে এবং পরিবার নিয়ে অনেক মানুষ বসবাস করছেন।"
    },
    {
      q: "নিবন্ধন বা দলিলের প্রক্রিয়া কি নিষ্কণ্টক?",
      a: "সম্পূর্ণ জমি নিষ্কণ্টক, দায়-মুক্ত ও নির্ভেজাল। বুকিং গ্রহণের প্রাক্কালে কাজী আশরাফ আলী আপনাকে যাবতীয় মূল দলিল, খতিয়ান, দাগ ও নামজারি পর্চা প্রদর্শন করবেন এবং কেনার সাথে সাথেই সরাসরি সরাসরি দলিলের ব্যবস্থা করে দেওয়া হবে।"
    },
    {
      q: "সুদ-মুক্ত কিস্তির নিয়মাবলী কি?",
      a: "১৫ই মে থেকে ১৫ই জুন, ২০২৬ এর ক্যাম্পেইনে আপনি ন্যূনতম ১০% থেকে সর্বোচ্চ ৩০% ডাউন পেমেন্ট বা এককালীন অ্যাডভান্স দিয়ে স্বপ্নের প্লটের বুকিং নিশ্চিত করতে পারেন। অবশিষ্ট বকেয়া অর্থ আগামী ১২ থেকে সর্বোচ্চ ২৪ মাসের সুদ-মুক্ত সহজ মাসিক কিস্তিতে পরিশোধ করতে পারবেন।"
    },
    {
      q: "প্রজেক্টের রাস্তার প্রশস্ততা কেমন?",
      a: "মেহেরুন্নেসা প্রজেক্ট ২ এর মূল সম্মুখ রাস্তাটি ২০ ফুট চওড়া সংযোগ পিচ ঢালাই রাস্তা (দুর্গাপুর টু দয়ালের মোড় রোড)। এবং প্রতিটি প্লটের অভ্যন্তরে প্রবেশের জন্য রয়েছে প্রশস্ত ১০ ফুটের সলিং অভ্যন্তরীণ সংযোগ রাস্তা।"
    },
    {
      q: "প্রজেক্টের গ্যাস, বিদ্যুৎ ও পানির অবস্থা কেমন?",
      a: "সোসাইটির প্লট সংলগ্ন মেইন রাস্তার ধারেই সরকারি বিদ্যুৎ সংযোগ লাইন বিদ্যমান। ইতিমধ্যে বাড়িগুলোতে পানির জন্য নিজস্ব নলকূপ ও পাম্পিং ব্যবস্থার কাজ সম্পন্ন হয়েছে।"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-400 selection:text-slate-900 antialiased overflow-x-hidden">
      
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800 shadow-md backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2.5 rounded-xl shadow-md">
                <Compass className="w-5 h-5 text-slate-950 animate-spin-slow" />
              </div>
              <div className="text-left">
                <span className="font-sans font-black text-lg tracking-tight hover:text-emerald-400 transition-all cursor-pointer">মেহেরুন্নেসা সোসাইটি</span>
                <p className="text-[10px] text-emerald-400 tracking-wider font-extrabold uppercase leading-none">প্রজেক্ট ২ | নওগাঁ</p>
              </div>
            </div>

            {/* Desktop Navigation Linkages */}
            <nav className="hidden md:flex items-center space-x-6 text-sm font-bold">
              <a href="#home" className="hover:text-emerald-400 transition-colors">হোম</a>
              <a href="#about-section" className="hover:text-emerald-400 transition-colors">কেন আমাদের প্রজেক্ট?</a>
              <a href="#project-gallery" className="hover:text-emerald-400 transition-colors">প্রকল্প গ্যালারি</a>
              <a href="#map-layout" className="hover:text-emerald-400 transition-colors">প্লট ও লেআউট</a>
              <a href="#calculator-section" className="hover:text-emerald-400 transition-colors">কিস্তি ক্যালকুলেটর</a>
              <a href="#booking-section" className="hover:text-emerald-400 transition-colors">অনলাইন বুকিং</a>
              <a href="#location-section" className="hover:text-emerald-400 transition-colors">লোকেশন</a>
            </nav>

            {/* Header direct call */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="tel:01535491716"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-lg shadow-sm transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>০১৫৩৫৪৯১৭১৬</span>
              </a>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-slate-900 border-b border-slate-800 text-left px-4 py-6 space-y-4 text-sm font-bold"
            >
              <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-emerald-400">হোম</a>
              <a href="#about-section" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-emerald-400">কেন আমাদের প্রজেক্ট?</a>
              <a href="#project-gallery" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-emerald-400">প্রকল্প গ্যালারি</a>
              <a href="#map-layout" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-emerald-400">প্লট ও লেআউট</a>
              <a href="#calculator-section" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-emerald-400">কিস্তি ক্যালকুলেটর</a>
              <a href="#booking-section" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-emerald-400">অনলাইন বুকিং</a>
              <a href="#location-section" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-emerald-400">লোকেশন</a>
              <div className="pt-2">
                <a
                  href="tel:01535491716"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 text-slate-950 rounded-xl"
                >
                  <Phone className="w-4 h-4" />
                  <span>কল করুন: ০১৫৩৫৪৯১৭১৬</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. Hero banner segment */}
      <Hero 
        totalPlots={totalPlots} 
        availablePlots={availablePlots} 
        soldPlots={soldPlots} 
        onScrollToPlots={() => {
          document.getElementById('map-layout')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onScrollToCalculator={() => {
          document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3. Value Proposition / why buy section */}
      <section id="about-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-905 tracking-tight font-sans">
              কেন মেহেরুন্নেসা সোসাইটি প্রজেক্ট ২ সেরা?
            </h2>
            <p className="mt-4 text-slate-500 text-sm sm:text-base leading-relaxed font-sans">
              নওগাঁ এলাকার অন্যতম নির্ভরযোগ্য ও উন্নত নাগরিক সুযোগ-সুবিধা সম্বলিত পরিকল্পিত এই বেসরকারি আবাসন প্রকল্প। 
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-850">১০০% নিষ্কণ্টক জমি</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-sans">
                মালিকানার সম্পূর্ণ চেইন নিষ্কণ্টক ও কাগজ নিশ্চিত করা। কাজী আশরাফ আলীর নামের সরাসরি দলিলভুক্ত দাগ থেকে সরাসরি রেজিস্ট্রেশনের সুযোগ।
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-850">১০ ও ২০ ফুট প্রশস্ত চওড়া সড়ক</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-sans">
                প্রজেক্টের সম্মুখভাগে ২০ ফুট পিচঢালা সরাসরি মেইন দুর্গাপুর টু দয়ালের মোড় রোড এবং ভেতর রয়েছে যাতায়াতের জন্য ১০ ফুট সংযোগ রাস্তা।
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-605 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-850">সুদ-মুক্ত বিশেষ কিস্তি</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-sans">
                ১৫মে - ১৫জুন ২০২৬ এর বিশেষ অফারের আওতায় সুদ ছাড়া সহজ কিস্তিতে জমি পেমেন্টের সুযোগ, মধ্যম আয়ের পরিবারের বাড়ি বানানোর সেরা পার্টনার।
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Slideshow gallery */}
      <Slideshow />

      {/* 4. Plot selector live map */}
      <PlotSelector 
        plots={plots} 
        selectedPlot={selectedPlot} 
        onSelectPlot={(p) => setSelectedPlot(p)} 
      />

      {/* 5. Complete Detailed dynamic Pricing breakdown Table */}
      <section className="py-16 bg-white border-t border-slate-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-2xl mx-auto mb-10 text-center">
            <h3 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-sans">
              সর্বশেষ আপডেটকৃত প্লট মূল্য তালিকা
            </h3>
            <p className="text-emerald-600 font-extrabold text-base sm:text-lg mt-3">
              জমির পরিমাণ, প্রতি কাঠার মূল্য ও মোট প্লট মূল্য নিচে দেওয়া হলো
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-4 font-bold text-xs sm:text-sm tracking-wide font-sans text-center text-white select-none">
              <span className="bg-slate-900 py-4 px-2 border-r border-slate-800">প্লট নং</span>
              <span className="bg-slate-900 py-4 px-2 border-r border-slate-800">জমির পরিমাণ</span>
              <span className="bg-slate-900 py-4 px-2 border-r border-slate-800">১ কাঠার মূল্য</span>
              <span className="bg-[#1d4ed8] py-4 px-2">সর্বমোট মূল্য</span>
            </div>

            <div className="divide-y divide-slate-150 text-center">
              {plots.map((plot) => {
                const isSelected = selectedPlot?.id === plot.id;
                
                // Customize row backgrounds and colors matching the image
                let rowBg = isSelected ? 'bg-emerald-500/10' : 'bg-white';
                let col1Color = 'text-[#1e3a8a]';
                let col2Color = 'text-slate-700';
                let col3Content: ReactNode = <span>{formatPrice(plot.pricePerKatha)}</span>;
                let col4Content: ReactNode = <span className="text-[#2563eb] font-black text-sm sm:text-base">{formatPrice(plot.totalPrice)}</span>;

                if (plot.plotNumber === '1') {
                  rowBg = isSelected ? 'bg-emerald-500/10' : 'bg-white';
                  col1Color = 'text-[#991b1b]';
                  col2Color = 'text-[#991b1b]';
                  col3Content = <span className="font-extrabold text-[#334155] tracking-wider font-sans">BOOKED</span>;
                  col4Content = null;
                } else if (plot.plotNumber === '2') {
                  rowBg = isSelected ? 'bg-emerald-500/10' : 'bg-[#fff1f2]';
                  col1Color = 'text-[#e11d48]';
                  col2Color = 'text-[#e11d48]';
                  col3Content = <span className="font-bold text-[#e11d48]">বিক্রয় হয়ে গেছে (SOLD)</span>;
                  col4Content = null;
                }

                return (
                  <div 
                    key={plot.id} 
                    onClick={() => {
                      setSelectedPlot(plot);
                      document.getElementById('map-layout')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`grid grid-cols-4 py-4.5 px-2 text-xs sm:text-sm font-semibold items-center hover:bg-slate-100/80 transition-all cursor-pointer ${rowBg}`}
                  >
                    <span className={`font-black ${col1Color}`}>{toBengaliNumber(plot.plotNumber)} নং</span>
                    <span className={`font-bold ${col2Color}`}>{formatKatha(plot.sizeKatha)}</span>
                    <span className="font-bold text-slate-800">{col3Content}</span>
                    <span className="font-bold text-slate-900">{col4Content}</span>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* 6. Dynamic calculator slider segment */}
      <Calculator 
        plots={plots} 
        selectedPlot={selectedPlot} 
        onSelectPlot={(p) => setSelectedPlot(p)} 
      />

      {/* 7. Booking dynamic form */}
      <BookingForm 
        plots={plots} 
        selectedPlot={selectedPlot} 
      />

      {/* 8. Interactive Location Section */}
      <section id="location-section" className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-emerald-500/10 rounded-full filter blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Map Info Card Left */}
            <div className="lg:col-span-5 text-left space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>সরাসরি প্রজেক্ট লোকেশন</span>
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-white font-sans leading-tight">
                দক্ষিণ চকমোক্তার, এনামুলের মোড়, নওগাঁ
              </h2>

              <div className="space-y-4 text-sm text-slate-350 leading-relaxed font-sans">
                <p>
                  <strong>ঠিকানা:</strong> দক্ষিণ চকমোক্তার, এনামুলের মোড়, দুর্গাপুর টু দয়ালের মোড় রোড, নওগাঁ সদর, নওগাঁ।
                </p>
                <p>
                  আপনি চাইলে যেকোনো দিন সরাসরি নওগাঁ সদর বা দুর্গাপুর সংলগ্ন স্থান থেকে আমাদের প্রজেক্টটি ভিজিট করতে পারেন। আমাদের প্রতিনিধি সরাসরি সাইটে উপস্থিত থেকে আপনাকে সম্পূর্ণ নকশা এবং বাউন্ডারি প্রদর্শন করবেন।
                </p>
              </div>

              {/* Call to maps action link */}
              <div className="pt-2">
                <a
                  href="https://maps.app.goo.gl/u3hJZ22mPjjMf8Me6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-emerald-400/15"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Google Maps-এ অবস্থান দেখুন</span>
                </a>
              </div>
            </div>

            {/* Simulated Live maps component Right */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl h-[330px] sm:h-[400px]">
                {/* Visual placeholder matching Naogaon coordinates */}
                <iframe
                  title="Meherunnesa Project Map Location Frame"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.318854497528!2d88.94824317616147!3d24.81881694605992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fc93b664d6ebd5%3A0xc3fec89cbcedbe57!2z4Kau4KeH4Ka54Kaw4KeB4Kao4KeN4Kao4KeH4Ka44Ka-IOCmuOCni-CmuOCmvuCmh_Cmn-CmvCDgpqugp4RigI3gpqXgp4AgMg!5e0!3m2!1sbn!2sbd!4v1717774000000!5m2!1sbn!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="filter grayscale-[10%] brightness-[90%] contrast-[105%]"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. FAQ Accordion section */}
      <section className="py-20 bg-white border-b border-slate-205 text-left">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <HelpCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2.5" />
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              সাধারণ জিজ্ঞাসা ও প্রশ্নাবলী (FAQs)
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div 
                key={idx} 
                className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-all bg-slate-50/50"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180 text-emerald-500' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-200 bg-white p-5 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 10. Admin Configuration Board Segment */}
      <AdminPanel 
        plots={plots} 
        onRefreshPlots={() => {
          // Dummy toggler to refresh since snapshots handles realtime updates anyway
          console.log("Realtime plots re-synergized from Firestore console updates.");
        }} 
      />

      {/* 11. Custom Contact Directory Footer footer */}
      <footer className="bg-slate-950 text-white py-16 text-left relative overflow-hidden border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Logo description */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xl font-black text-white hover:text-emerald-400 transition-colors">মেহেরুন্নেসা সোসাইটি - প্রজেক্ট ২</h4>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm font-sans">
              নওগাঁর দুর্গাপুর এনামুলের মোড় সংলগ্ন দক্ষিণ চকমোক্তার এলাকায় দীর্ঘস্থায়ী আবাসনের জন্য সম্পূর্ণ ভরাট নিষ্কণ্টক লাল কাদা মাটির প্লট বিক্রয়কারী স্বনামধন্য প্রতিষ্ঠান।
            </p>
            
            <div className="pt-3 flex gap-3 text-xs">
              <a 
                href="https://wa.me/8801535491716" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp মেসেজ</span>
              </a>
              <a 
                href="tel:01535491716" 
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800/80 text-slate-100 font-bold border border-slate-700 rounded-lg hover:bg-slate-800 transition-all font-mono"
              >
                <Phone className="w-4 h-4 text-emerald-450" />
                <span>01535491716</span>
              </a>
            </div>
          </div>

          {/* Quick links list */}
          <div className="space-y-4 text-xs font-semibold">
            <h5 className="text-slate-200 text-xs uppercase tracking-widest font-black">নেভিগেশন</h5>
            <ul className="space-y-2.5">
              <li><a href="#home" className="text-slate-400 hover:text-white transition-colors">হোম পেজ</a></li>
              <li><a href="#about-section" className="text-slate-400 hover:text-white transition-colors">প্রজেক্ট ফিচারসমূহ</a></li>
              <li><a href="#map-layout" className="text-slate-400 hover:text-white transition-colors">নকশা ও প্লট ম্যাপ</a></li>
              <li><a href="#calculator-section" className="text-slate-400 hover:text-white transition-colors">কিস্তি ক্যালকুলেটর</a></li>
              <li><a href="#booking-section" className="text-slate-400 hover:text-white transition-colors">অনলাইন প্লট বুকিং</a></li>
            </ul>
          </div>

          {/* Site address details right */}
          <div className="space-y-4 text-xs">
            <h5 className="text-slate-200 text-xs uppercase tracking-widest font-black">যাতায়াত ও যোগাযোগ</h5>
            <div className="space-y-3 text-slate-400 font-sans">
              <p>কাজী আশরাফ আলী</p>
              <p className="leading-relaxed">দক্ষিণ চকমোক্তার, এনামুলের মোড়, দুর্গাপুর টু দয়ালের মোড় রোড, নওগাঁ সদর, নওগাঁ।</p>
              <p className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-2 rounded text-[10px] text-teal-400 font-mono w-max">
                <Clock className="w-3.5 h-3.5" />
                <span>যোগাযোগের সময়: সকাল ৯টা - রাত্রি ৯টা</span>
              </p>
            </div>
          </div>

        </div>

        {/* Legal copyrights line */}
        <div className="border-t border-slate-900 mt-12 pt-6 text-center text-[10px] text-slate-500 font-sans">
          <p>© {new Date().getFullYear()} মেহেরুন্নেসা সোসাইটি প্রজেক্ট ২। সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="mt-1 font-bold text-slate-600">পেশাদার ডাইনামিক ডেটাবেজ ম্যানেজমেন্ট অ্যাপ প্রজেক্ট।</p>
        </div>
      </footer>

    </div>
  );
}
