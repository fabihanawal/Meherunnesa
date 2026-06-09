import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Maximize2, 
  X, 
  Compass, 
  Map, 
  Sparkles, 
  Home,
  CheckCircle,
  Eye,
  Info
} from 'lucide-react';

interface Slide {
  id: number;
  image: string;
  title: string;
  subTitle: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
}

export default function Slideshow() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  const SLIDES: Slide[] = [
    {
      id: 1,
      image: '/src/assets/images/meherunnesa_gate_1780852437783.png',
      badge: 'প্রধান প্রবেশদ্বার',
      title: 'মেহেরুন্নেসা সোসাইটি মেইন গেট',
      subTitle: 'সুদৃশ্য ও সুপরিকল্পিত প্রবেশদ্বার',
      description: 'প্রজেক্টের মূল গেট এবং তার সাথে সংযুক্ত ২০ ফুট প্রশস্ত পিচ ঢালাই সংযোগ সড়ক যা সরাসরি দুর্গাপুর টু দয়ালের মোড় রোডের সাথে যুক্ত। নিরাপত্তা ও স্বকীয়তায় মোড়ানো আধুনিক আবাসন পরিবেশ।',
      icon: <Compass className="w-5 h-5 text-emerald-400" />
    },
    {
      id: 2,
      image: '/src/assets/images/meherunnesa_villa_1780852454160.png',
      badge: 'ভবিষ্যৎ আবাসন পরিকল্পনা',
      title: 'আপনার স্বপ্নের আধুনিক ভিলা বা অট্টালিকা',
      subTitle: '৩ থেকে ৫ কাঠা জমিতে দৃষ্টিনন্দন নকশা',
      description: 'মেহেরুন্নেসা সোসাইটির লাল কাদা মাটির উঁচু ভরাট প্লটগুলোতে ২, ৩ বা ৫ কাঠার সুনিপুণ বিন্যাসে আপনার শখের বহুতল ভবন বা নান্দনিক কান্ট্রি ভিলা গড়ার এখনই মোক্ষম সুযোগ।',
      icon: <Home className="w-5 h-5 text-teal-400" />
    },
    {
      id: 3,
      image: '/src/assets/images/meherunnesa_layout_1780851468838.png',
      badge: 'মাস্টারপ্ল্যান নকশা',
      title: 'পরিকল্পিত সোসাইটি লেআউট ও প্লট বিন্যাস',
      subTitle: 'সঠিক পরিমাপ ও নিষ্কণ্টক সীমানা',
      description: 'সম্পূর্ণ প্রজেক্টের ভৌত বিন্যাস এবং সড়ক বিন্যাসের নিখুঁত নকশাচিত্র। প্রতিটি প্লটের মুখোমুখি ১০ فٹ অভ্যন্তরীণ চওড়া রাস্তা বিদ্যমান, যা অত্যন্ত সুশৃঙ্খলভাবে সাজানো হয়েছে।',
      icon: <Map className="w-5 h-5 text-emerald-400" />
    },
    {
      id: 4,
      image: '/src/assets/images/meherunnesa_hero_1780851448884.png',
      badge: 'প্রাকৃতিক ও মনোরম পরিবেশ',
      title: 'শান্ত, সবুজ ও উন্নত নাগরিক পরিবেশ',
      subTitle: 'ইতোমধ্যেই পরিবার নিয়ে নাগরিক জীবন যাপন',
      description: 'দক্ষিণ চকমোক্তারের কোলাহলমুক্ত স্বাস্থ্যকর পরিবেশ এবং প্রজেক্ট সংলগ্ন এলাকায় গড়ে ওঠা আবাসিক ঘরবাড়ি। পানি ও বিদ্যুৎ লাইনের তাত্ক্ষণিক সুবিধা সহ আজই বসবাস উপযোগী।',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />
    }
  ];

  // Stop auto play on user interaction
  const clearTimer = () => {
    if (autoPlayTimer.current) {
      clearInterval(autoPlayTimer.current);
    }
  };

  const startTimer = () => {
    clearTimer();
    if (isPlaying) {
      autoPlayTimer.current = setInterval(() => {
        setCurrentIdx((prevIdx) => (prevIdx + 1) % SLIDES.length);
      }, 5000);
    }
  };

  useEffect(() => {
    startTimer();
    return () => clearTimer();
  }, [isPlaying, currentIdx]);

  const handleNext = () => {
    clearTimer();
    setCurrentIdx((prevIdx) => (prevIdx + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    clearTimer();
    setCurrentIdx((prevIdx) => (prevIdx - 1 + SLIDES.length) % SLIDES.length);
  };

  const selectSlide = (index: number) => {
    clearTimer();
    setCurrentIdx(index);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section id="project-gallery" className="py-20 bg-slate-950 text-white relative overflow-hidden border-t border-b border-slate-900">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Intro */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Eye className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>লাইভ ফটো গ্যালারি ও ফিচারসমূহ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            মেহেরুন্নেসা সোসাইটির ইন্টারেক্টিভ স্লাইড শো
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
            প্রজেক্টের চারপাশের মনোরম পরিবেশ, দৃষ্টিনন্দন ফটক, আবাসিক বাড়ির আধুনিক নকশা ও মাস্টারপ্ল্যান ছবিতে দেখে নিন।
          </p>
        </div>

        {/* Main Grid Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Left / Upper: The Slider Frame (lg:col-span-8) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
              
              {/* Slides Container */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIdx}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="w-full h-full relative"
                >
                  <img
                    src={SLIDES[currentIdx].image}
                    alt={SLIDES[currentIdx].title}
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                  />
                  {/* Gentle shadow overlay for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                </motion.div>
              </AnimatePresence>

              {/* Status Badge */}
              <div className="absolute top-4 left-4 z-20 flex gap-2">
                <span className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-black tracking-wider text-emerald-400 flex items-center gap-1.5 uppercase shadow-sm">
                  {SLIDES[currentIdx].icon}
                  <span>{SLIDES[currentIdx].badge}</span>
                </span>
              </div>

              {/* Expand to Full-scale Floating button */}
              <button
                onClick={() => setIsFullscreen(true)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-400 hover:text-white hover:scale-105 transition-all shadow-sm cursor-pointer"
                title="পূর্ণ স্ক্রিন ভিউ"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Prev / Next Interactive Arrow Buttons */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none -translate-x-4 group-hover:translate-x-0 cursor-pointer shadow-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none translate-x-4 group-hover:translate-x-0 cursor-pointer shadow-md"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Progress Bar Loader indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800 z-20">
                {isPlaying && (
                  <motion.div
                    key={currentIdx}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                  />
                )}
              </div>
            </div>

            {/* Slider Controls Bar */}
            <div className="flex items-center justify-between mt-4 px-2">
              {/* Play Pause button & index status */}
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer shadow-sm"
                  title={isPlaying ? 'বিরতি দিন' : 'চালু করুন'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <span className="text-xs text-slate-450 font-bold font-mono">
                  {currentIdx + 1} / {SLIDES.length}
                </span>
              </div>

              {/* Custom Dots Indicators */}
              <div className="flex gap-2">
                {SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectSlide(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      currentIdx === idx ? 'w-8 bg-emerald-400' : 'w-2.5 bg-slate-800 hover:bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Right / Side Details Card (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Info className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">স্মার্ট স্লাইড পরিচিতি</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4.5 text-left"
                  >
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block font-sans">
                      {SLIDES[currentIdx].badge}
                    </span>
                    
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight font-sans">
                      {SLIDES[currentIdx].title}
                    </h3>
                    
                    <p className="text-xs font-bold text-slate-350 tracking-wide">
                      {SLIDES[currentIdx].subTitle}
                    </p>
                    
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                      {SLIDES[currentIdx].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Quick Feature Checkmarks */}
              <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-slate-800/60">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-350">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>রেডি বুকিং</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-350">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>নিষ্কণ্টক খতিয়ান</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-350">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>২০ ফুট মেইন সড়ক</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-350">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>সুদ-মুক্ত সহজ কিস্তি</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Fullscreen Full Image Lightbox Modal Overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-xl flex flex-col justify-center items-center p-4 sm:p-6"
          >
            {/* Close trigger button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer shadow-lg hover:scale-105"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Lightbox Contents */}
            <div className="max-w-5xl w-full flex flex-col items-center gap-4 text-center">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full max-h-[75vh] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
                <img
                  src={SLIDES[currentIdx].image}
                  alt={SLIDES[currentIdx].title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />

                {/* Left/Right controls inside lightbox */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Description captions in Lightbox */}
              <div className="max-w-2xl px-4 mt-2">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                  {SLIDES[currentIdx].badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {SLIDES[currentIdx].title}
                </h3>
                <p className="text-slate-405 text-xs sm:text-sm mt-2 max-w-xl mx-auto leading-relaxed">
                  {SLIDES[currentIdx].description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
