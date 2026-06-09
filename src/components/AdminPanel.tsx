import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  LogIn, 
  LogOut, 
  User, 
  Trash2, 
  Edit3, 
  AlertCircle, 
  PlusCircle, 
  X,
  FileCheck2,
  Calendar,
  Layers,
  Phone,
  BookmarkPlus,
  Compass,
  Home,
  Map,
  Sparkles,
  Info,
  CheckCircle,
  Palette,
  Eye,
  Settings,
  Image
} from 'lucide-react';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  setDoc,
  onSnapshot,
  query
} from 'firebase/firestore';
import { 
  db, 
  logout 
} from '../firebase';
import { Plot, BookingRequest } from '../types';

interface AdminPanelProps {
  plots: Plot[];
  onRefreshPlots: () => void;
  isAdminMode: boolean;
  setIsAdminMode: (open: boolean) => void;
}

export default function AdminPanel({ plots, onRefreshPlots, isAdminMode, setIsAdminMode }: AdminPanelProps) {
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [passcodeVerified, setPasscodeVerified] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'bookings' | 'plots' | 'slideshow' | 'settings'>('bookings');

  // Edit plot modal states
  const [editingPlot, setEditingPlot] = useState<Plot | null>(null);
  const [isAddingPlot, setIsAddingPlot] = useState(false);
  const [newPlotNum, setNewPlotNum] = useState('');
  const [newPlotSize, setNewPlotSize] = useState(3.0);
  const [newPlotPricePerKatha, setNewPlotPricePerKatha] = useState(120000);
  const [newPlotFacing, setNewPlotFacing] = useState('দক্ষিণমুখী (South-Facing)');
  const [newPlotRoad, setNewPlotRoad] = useState('১০ ফুট সংযোগ রাস্তা');
  const [newPlotNotes, setNewPlotNotes] = useState('');

  // Slideshow State
  const [slides, setSlides] = useState<any[]>([]);
  const [editingSlide, setEditingSlide] = useState<any | null>(null);
  const [isAddingSlide, setIsAddingSlide] = useState(false);
  const [newSlideImage, setNewSlideImage] = useState('');
  const [newSlideBadge, setNewSlideBadge] = useState('');
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideSub, setNewSlideSub] = useState('');
  const [newSlideDesc, setNewSlideDesc] = useState('');
  const [newSlideOrder, setNewSlideOrder] = useState(1);
  const [newSlideIcon, setNewSlideIcon] = useState('Compass');

  // Dynamic Settings / Theme Colors editing
  const [primaryColor, setPrimaryColor] = useState('#020617');
  const [accentColor, setAccentColor] = useState('#10b981');
  const [installmentPeriod, setInstallmentPeriod] = useState('১২ থেকে ২৪ মাস');
  const [siteTitle, setSiteTitle] = useState('মেহেরুন্নেসা সোসাইটি');
  const [phone, setPhone] = useState('01535491716');
  const [locationAddress, setLocationAddress] = useState('দক্ষিণ চকমোক্তার, এনামুলের মোড়, দুর্গাপুর টু দয়ালের মোড় রোড, নওগাঁ সদর, নওগাঁ।');
  const [locationUrl, setLocationUrl] = useState('https://maps.google.com/?q=DurgaPur,Naogaon');
  const [headerSubtitle, setHeaderSubtitle] = useState('প্রজেক্ট ২ | নওগাঁ');
  const [heroTitle, setHeroTitle] = useState('নওগাঁ শহরে নিজের একটি নিষ্কণ্টক জমা জমি ও স্থায়ী আবাসনের স্বপ্ন পূরণ করুন');
  const [heroSubtitle, setHeroSubtitle] = useState('দুর্গাপুর টু দয়ালের মোড় পিচ ঢালাই মেইন রোড সংলগ্ন সম্পূর্ণ উচু লাল কাদা মাটি দ্বারা নতুন ভরাটকৃত নিষ্কণ্টক প্লট আজই বুকিং করুন।');

  // Load and restore admin login state from localStorage
  useEffect(() => {
    try {
      const persisted = localStorage.getItem('admin_session_active');
      if (persisted === 'true') {
        setPasscodeVerified(true);
      }
    } catch (err) {}
  }, []);

  // Sync Bookings data
  useEffect(() => {
    if (isAdminMode && passcodeVerified) {
      const bookingsCol = collection(db, 'bookings');
      const q = query(bookingsCol);
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list: BookingRequest[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            customerEmail: data.customerEmail || '',
            plotId: data.plotId || '',
            message: data.message || '',
            status: data.status || 'pending',
            createdAt: data.createdAt || ''
          });
        });
        list.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookings(list);
      }, (error) => {
        console.warn("Could not load bookings list.", error);
      });

      return () => unsubscribe();
    }
  }, [isAdminMode, passcodeVerified]);

  // Sync Slideshow configurations
  useEffect(() => {
    if (isAdminMode && passcodeVerified) {
      const q = query(collection(db, 'slideshow'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const sliderList: any[] = [];
        snapshot.forEach((doc) => {
          sliderList.push({ id: doc.id, ...doc.data() });
        });
        sliderList.sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
        setSlides(sliderList);
      });
      return () => unsubscribe();
    }
  }, [isAdminMode, passcodeVerified]);

  // Sync Global Settings
  useEffect(() => {
    if (isAdminMode && passcodeVerified) {
      const configRef = doc(db, 'settings', 'app_config');
      const unsubscribe = onSnapshot(configRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPrimaryColor(data.primaryColor || '#020617');
          setAccentColor(data.accentColor || '#10b981');
          setInstallmentPeriod(data.installmentPeriod || '১২ থেকে ২৪ মাস');
          setSiteTitle(data.title || 'মেহেরুন্নেসা সোসাইটি');
          setPhone(data.phone || '01535491716');
          setLocationAddress(data.locationAddress || 'দক্ষিণ চকমোক্তার...');
          setLocationUrl(data.locationUrl || '');
          setHeaderSubtitle(data.headerSubtitle || '');
          setHeroTitle(data.heroTitle || '');
          setHeroSubtitle(data.heroSubtitle || '');
        }
      });
      return () => unsubscribe();
    }
  }, [isAdminMode, passcodeVerified]);

  // Handle credentials login submit
  const handleAdminCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername === 'admin' && adminPassword === '1254') {
      setPasscodeVerified(true);
      setLoginError('');
      try {
        localStorage.setItem('admin_session_active', 'true');
      } catch (err) {}
      setStatusMessage('সাফল্যের সাথে লগইন সম্পন্ন হয়েছে! এডমিন প্যানেলে স্বাগতম।');
    } else {
      setLoginError('ভুল ইউজারনেম অথবা পাসওয়ার্ড! অনুগ্রহ করে আবার যাচাই করুন।');
    }
  };

  const handleAdminLogout = () => {
    setPasscodeVerified(false);
    try {
      localStorage.removeItem('admin_session_active');
    } catch (err) {}
    setStatusMessage('অ্যাডমিন সেশন সফলভাবে ডিসকানেক্ট করা হয়েছে।');
  };

  // Alter booking status
  const handleToggleBookingStatus = async (booking: BookingRequest) => {
    const newStatus = booking.status === 'pending' ? 'contacted' : booking.status === 'contacted' ? 'completed' : 'pending';
    try {
      const docRef = doc(db, 'bookings', booking.id);
      await updateDoc(docRef, { status: newStatus });
      setStatusMessage(`বুকিং স্থিতি সফলভাবে '${newStatus}' এ পরিবর্তন করা হয়েছে।`);
    } catch (err) {
      setStatusMessage('স্থিরতা পরিবর্তন লক অবরুদ্ধ!');
    }
  };

  // Delete booking request
  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই বুকিংটি মুছে ফেলতে চান?')) return;
    try {
      await deleteDoc(doc(db, 'bookings', id));
      setStatusMessage('বুকিং অনুরোধ চিরতরে মুছে ফেলা হয়েছে!');
    } catch (err) {
      setStatusMessage('বুকিং ডিলিট করার অনুমতি নেই!');
    }
  };

  // Edit plot parameter settings
  const handleSavePlotSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlot) return;
    try {
      const plotDoc = doc(db, 'plots', editingPlot.id);
      await updateDoc(plotDoc, {
        sizeKatha: Number(editingPlot.sizeKatha),
        pricePerKatha: Number(editingPlot.pricePerKatha),
        totalPrice: Number(editingPlot.sizeKatha) * Number(editingPlot.pricePerKatha),
        status: editingPlot.status,
        facing: editingPlot.facing,
        roadWidth: editingPlot.roadWidth,
        notes: editingPlot.notes || ''
      });
      setStatusMessage(`প্লট ${editingPlot.plotNumber} এর যাবতীয় তথ্য আপডেট করা হয়েছে!`);
      setEditingPlot(null);
      onRefreshPlots();
    } catch (err) {
      setStatusMessage('প্লটের তথ্য সেভ করার অনুমতি নেই!');
    }
  };

  // Create new parcel plot
  const handleAddNewPlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlotNum.trim()) return;

    try {
      const plotsCol = collection(db, 'plots');
      const docRef = doc(plotsCol, `plot-${newPlotNum.trim()}`);
      await setDoc(docRef, {
        plotNumber: newPlotNum.trim().toUpperCase(),
        sizeKatha: Number(newPlotSize),
        pricePerKatha: Number(newPlotPricePerKatha),
        totalPrice: Number(newPlotSize) * Number(newPlotPricePerKatha),
        status: 'available',
        facing: newPlotFacing,
        roadWidth: newPlotRoad,
        block: "নতুন ব্লক",
        notes: newPlotNotes.trim() || ""
      });
      setStatusMessage(`নতুন প্লট ${newPlotNum} ডাটাবেজে যুক্ত করা হয়েছে!`);
      setIsAddingPlot(false);
      setNewPlotNum('');
      onRefreshPlots();
    } catch (err) {
      setStatusMessage('নতুন প্লট যুক্ত করার অনুমতি নেই!');
    }
  };

  // Add slideshow item
  const handleAddNewSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlideImage.trim() || !newSlideTitle.trim()) return;

    try {
      await addDoc(collection(db, 'slideshow'), {
        image: newSlideImage.trim(),
        badge: newSlideBadge.trim() || 'বিশেষ হাইলাইট',
        title: newSlideTitle.trim(),
        subTitle: newSlideSub.trim() || 'নিষ্কণ্টক প্লট',
        description: newSlideDesc.trim() || '',
        order: Number(newSlideOrder) || 1,
        iconName: newSlideIcon
      });
      setStatusMessage('নতুন স্লাইড সফলভাবে যুক্ত করা হয়েছে!');
      setIsAddingSlide(false);
      // Reset setup
      setNewSlideImage('');
      setNewSlideBadge('');
      setNewSlideTitle('');
      setNewSlideSub('');
      setNewSlideDesc('');
      setNewSlideOrder(slides.length + 2);
    } catch (err) {
      setStatusMessage('নতুন স্লাইড যুক্ত করার অনুমতি নেই!');
    }
  };

  // Update existing slide
  const handleUpdateSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;

    try {
      const docRef = doc(db, 'slideshow', editingSlide.id);
      await updateDoc(docRef, {
        image: editingSlide.image,
        badge: editingSlide.badge,
        title: editingSlide.title,
        subTitle: editingSlide.subTitle,
        description: editingSlide.description,
        order: Number(editingSlide.order) || 1,
        iconName: editingSlide.iconName || 'Compass'
      });
      setStatusMessage('স্লাইড সফলভাবে সম্পাদনা করা হয়েছে!');
      setEditingSlide(null);
    } catch (err) {
      setStatusMessage('স্লাইড সম্পাদনা করার অনুমতি নেই!');
    }
  };

  // Delete slideshow slide
  const handleDeleteSlide = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই স্লাইডটি ডিলিট করতে চান?')) return;
    try {
      await deleteDoc(doc(db, 'slideshow', id));
      setStatusMessage('স্লাইডটি সফলভাবে ডিলিট করা হয়েছে!');
    } catch (err) {
      setStatusMessage('স্লাইডটি ডিলিট করার অনুমতি নেই!');
    }
  };

  // Save Website information & custom themes
  const handleSaveGlobalConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const configRef = doc(db, 'settings', 'app_config');
      await setDoc(configRef, {
        primaryColor,
        accentColor,
        installmentPeriod,
        title: siteTitle,
        phone,
        locationAddress,
        locationUrl,
        headerSubtitle,
        heroTitle,
        heroSubtitle
      });
      setStatusMessage('সাইটের থিম ও তথ্য সমূহ সফলভাবে ক্লাউডে সেভ করা হয়েছে!');
    } catch (err) {
      setStatusMessage('কনফিগারেশন সেভ করার অনুমতি নেই!');
    }
  };

  return (
    <section id="admin-section" className="py-12 bg-slate-100 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Title admin banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-300 pb-5 mb-8 text-center sm:text-left gap-4">
          <div>
            <span className="text-xs uppercase bg-slate-900 text-slate-200 px-3 py-1 rounded-full font-bold tracking-widest inline-block mb-2">সেটিংস অ্যান্ড পোর্টাল</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
              মেহেরুন্নেসা ড্যাশবোর্ড কনসোল
            </h2>
          </div>

          <button
            onClick={() => setIsAdminMode(!isAdminMode)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer bg-slate-900 text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
            <span>কনসোল বন্ধ করুন</span>
          </button>
        </div>

        {/* Console view active */}
        {isAdminMode && (
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-300">
            
            {/* Status alerts */}
            {statusMessage && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-150 rounded-xl text-emerald-800 text-xs flex justify-between items-center">
                <span className="font-semibold">{statusMessage}</span>
                <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-650 font-bold">বন্ধ করুন</button>
              </div>
            )}

            {/* Lock Overlay prompt */}
            {!passcodeVerified ? (
              <div className="py-12 text-center max-w-sm mx-auto space-y-6">
                <div className="inline-flex items-center justify-center bg-amber-50 text-amber-600 rounded-full p-4">
                  <Lock className="w-12 h-12" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">অ্যাডমিন লগইন প্রমাণীকরণ</h3>
                <p className="text-slate-500 text-xs">
                  তথ্য সংযোজন, পরিবর্তন বা ডিলিট করার জন্য এডমিন ইউজারনেম এবং পাসওয়ার্ড দিন।
                </p>

                {/* Username Password secure form login */}
                <form onSubmit={handleAdminCredentialsLogin} className="space-y-4 text-left">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">ইউজারনেম</label>
                    <input
                      id="admin-username"
                      required
                      type="text"
                      placeholder="যেমন: admin"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">পাসওয়ার্ড</label>
                    <input
                      id="admin-password"
                      required
                      type="password"
                      placeholder="পাসওয়ার্ড লিখুন"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                    />
                  </div>
                  {loginError && <p className="text-rose-500 text-[10px] font-bold text-center mt-1">{loginError}</p>}
                  
                  <button
                    type="submit"
                    className="w-full py-3 mt-4 bg-emerald-500 text-slate-900 rounded-xl text-xs font-extrabold shadow hover:bg-emerald-450 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>এডমিন প্যানেলে লগইন করুন</span>
                  </button>
                </form>
              </div>
            ) : (
              /* Inside active logged-in control console */
              <div className="space-y-6">
                
                {/* Admin user credit panel */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm select-none">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">অ্যাডমিন সিস্টেম সচল (লগড-ইন)</p>
                      <p className="text-slate-450 text-[10px]">সম্পূর্ণ এডিটিং, ডিলিট এবং কালার কাস্টমাইজেশন অ্যাক্সেস সচল রয়েছে।</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] bg-emerald-555 bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest font-mono">
                      ADMINISTRATOR_OK
                    </span>
                    <button
                      onClick={handleAdminLogout}
                      className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 border border-rose-300/30 px-2 py-1 rounded-md bg-rose-50 hover:bg-rose-100/50"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>লগ-আউট</span>
                    </button>
                  </div>
                </div>

                {/* Tab layout selectors */}
                <div className="flex flex-wrap border-b border-slate-200">
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`px-5 py-3 font-extrabold text-sm border-b-2 transition-all flex items-center gap-1.5 ${
                      activeTab === 'bookings'
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-slate-550 hover:text-slate-705'
                    }`}
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>বুকিং অনুরোধ সমূহ ({bookings.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('plots')}
                    className={`px-5 py-3 font-extrabold text-sm border-b-2 transition-all flex items-center gap-1.5 ${
                      activeTab === 'plots'
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-slate-550 hover:text-slate-705'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>প্লট ডাটাবেজ এডিট ({plots.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('slideshow')}
                    className={`px-5 py-3 font-extrabold text-sm border-b-2 transition-all flex items-center gap-1.5 ${
                      activeTab === 'slideshow'
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-slate-550 hover:text-slate-705'
                    }`}
                  >
                    <Image className="w-4 h-4" />
                    <span>ফটো গ্যালারি স্লাইড শো ({slides.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-5 py-3 font-extrabold text-sm border-b-2 transition-all flex items-center gap-1.5 ${
                      activeTab === 'settings'
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-slate-550 hover:text-slate-705'
                    }`}
                  >
                    <Palette className="w-4 h-4" />
                    <span>সাইট কালার ও ইনফো সেটিংস</span>
                  </button>
                </div>

                {/* Toggle tab content */}
                {activeTab === 'bookings' && (
                  <div>
                    {bookings.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        <FileCheck2 className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                        <h4 className="font-bold text-slate-600">কোনো বুকিং অনুরোধ এখনও পাওয়া যায়নি</h4>
                        <p className="text-xs">হোমপেজের অনলাইন বুকিং ফর্ম ফিলাপ করা হলে তা এখানে রিয়েল-টাইমে প্রদর্শিত হবে।</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                        {bookings.map((booking) => (
                          <motion.div
                            key={booking.id}
                            layout
                            className={`border rounded-2xl p-5 shadow-sm text-sm space-y-3 relative overflow-hidden transition-all bg-white hover:shadow-md ${
                              booking.status === 'completed'
                                ? 'border-emerald-250 bg-emerald-50/10'
                                : booking.status === 'contacted'
                                ? 'border-teal-250'
                                : 'border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <div>
                                <span className="font-semibold text-slate-450 text-[10px] uppercase font-mono block">ID: #{booking.id.slice(0,6)}</span>
                                <span className="text-[10px] text-slate-400 font-sans flex items-center gap-1 mt-0.5">
                                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                  <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                                </span>
                              </div>

                              {/* Action Badges */}
                              <button
                                onClick={() => handleToggleBookingStatus(booking)}
                                className={`px-2.5 py-1 text-[10px] rounded-lg font-bold tracking-wide transition-all text-white ${
                                  booking.status === 'completed'
                                    ? 'bg-emerald-500 hover:bg-emerald-600'
                                    : booking.status === 'contacted'
                                    ? 'bg-teal-500 hover:bg-teal-600'
                                    : 'bg-amber-500 hover:bg-amber-650'
                                }`}
                              >
                                {booking.status === 'completed' ? 'সম্পন্ন' : booking.status === 'contacted' ? 'যোগাযোগকৃত' : 'ঝুলন্ত (Pending)'}
                              </button>
                            </div>

                            {/* Core Details */}
                            <div className="space-y-1.5 text-xs text-slate-605">
                              <p className="text-slate-800 text-sm font-black">আবেদনকারী: {booking.customerName}</p>
                              
                              <p className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                <a href={`tel:${booking.customerPhone}`} className="text-emerald-650 font-bold hover:underline">{booking.customerPhone}</a>
                              </p>
                              
                              {booking.customerEmail && (
                                <p className="text-slate-500">ইমেইল: {booking.customerEmail}</p>
                              )}

                              <p className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded font-semibold w-max text-slate-705">
                                <BookmarkPlus className="w-3.5 h-3.5 text-emerald-555" />
                                <span>আগ্রহী প্লট: <strong className="text-slate-900">{booking.plotId}</strong></span>
                              </p>

                              {booking.message && (
                                <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-150 text-slate-600 text-xs italic leading-relaxed">
                                  "{booking.message}"
                                </div>
                              )}
                            </div>

                            {/* Trash icon */}
                            <div className="absolute bottom-4 right-4 flex gap-2">
                              <button
                                onClick={() => handleDeleteBooking(booking.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-650 rounded bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer"
                                title="ডিলিট করুন"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'plots' && (
                  /* Plots list tab under admin active mode */
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-slate-450 font-semibold">প্লটের বিবরণ, ফেস, বুকিংয়ের স্থিতি বা কাঠার মূল্য আপডেট করতে এডিট বাটনে প্রেস করুন।</p>
                      
                      <button
                        onClick={() => setIsAddingPlot(!isAddingPlot)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-450 text-slate-900 rounded-lg text-xs font-bold transition-all cursor-pointer shadow"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>নতুন প্লট যোগ করুন</span>
                      </button>
                    </div>

                    {/* New Plot Overlay Form if isAddingPlot is true */}
                    {isAddingPlot && (
                      <form onSubmit={handleAddNewPlot} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-3 border-b pb-2 mb-2 flex justify-between items-center">
                          <h4 className="font-bold text-slate-800 text-xs">নতুন প্লট যুক্ত করার প্যানেল</h4>
                          <button type="button" onClick={() => setIsAddingPlot(false)} className="text-slate-400 hover:text-rose-600"><X className="w-4 h-4" /></button>
                        </div>
                        <div>
                          <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">প্লট নম্বর</label>
                          <input required type="text" placeholder="উদাঃ D-1" className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg text-xs text-slate-800" value={newPlotNum} onChange={(e) => setNewPlotNum(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">জমির আকার (কাঠা)</label>
                          <input type="number" step="0.01" className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg text-xs" value={newPlotSize} onChange={(e) => setNewPlotSize(Number(e.target.value))} />
                        </div>
                        <div>
                          <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">কাঠা প্রতি মূল্য (টাকা)</label>
                          <input type="number" step="5000" className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg text-xs" value={newPlotPricePerKatha} onChange={(e) => setNewPlotPricePerKatha(Number(e.target.value))} />
                        </div>
                        <div>
                          <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">মুখী অবস্থান (Facing)</label>
                          <input type="text" className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg text-xs" value={newPlotFacing} onChange={(e) => setNewPlotFacing(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">রাস্তার প্রশস্ততা</label>
                          <input type="text" className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg text-xs" value={newPlotRoad} onChange={(e) => setNewPlotRoad(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">প্লট সম্পর্কে নোট</label>
                          <input type="text" placeholder="অনান্য বিস্তারিত..." className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg text-xs" value={newPlotNotes} onChange={(e) => setNewPlotNotes(e.target.value)} />
                        </div>
                        <div className="sm:col-span-3 text-right">
                          <button type="submit" className="px-5 py-2 bg-emerald-500 hover:bg-emerald-450 text-slate-900 rounded-lg text-xs font-bold cursor-pointer">সংরক্ষণ করুন</button>
                        </div>
                      </form>
                    )}

                    {/* Plots Edit Layout Board list */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <thead className="bg-slate-50 text-slate-550 font-bold uppercase border-b border-slate-200">
                          <tr>
                            <th className="p-4">প্লট নং</th>
                            <th className="p-4">আকার (কাঠা)</th>
                            <th className="p-4">কাঠা প্রতি মূল্য (৳)</th>
                            <th className="p-4">মোট দাম (৳)</th>
                            <th className="p-4">স্ট্যাটাস</th>
                            <th className="p-4 text-right">পদক্ষেপ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {plots.map((plot) => (
                            <tr key={plot.id} className="hover:bg-slate-50">
                              <td className="p-4 font-extrabold text-slate-800 text-sm">প্লট {plot.plotNumber}</td>
                              <td className="p-4 font-semibold text-slate-600">{plot.sizeKatha} কাঠা</td>
                              <td className="p-4 text-slate-600 font-mono">৳ {plot.pricePerKatha.toLocaleString('bn-BD')}</td>
                              <td className="p-4 font-bold text-slate-800 font-mono">৳ {plot.totalPrice.toLocaleString('bn-BD')}</td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  plot.status === 'available'
                                    ? 'bg-emerald-50 text-emerald-750 border border-emerald-200'
                                    : plot.status === 'booked'
                                    ? 'bg-amber-50 text-amber-750 border border-amber-200'
                                    : 'bg-rose-50 text-rose-750 border border-rose-200'
                                }`}>
                                  {plot.status === 'available' ? 'বিক্রয়যোগ্য' : plot.status === 'booked' ? 'বুকড' : 'বিক্রিত'}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => setEditingPlot(plot)}
                                  className="inline-flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold transition-all cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>সম্পাদনা</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'slideshow' && (
                  /* Slideshow slideshow images manager tab */
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-slate-450 font-semibold">হোমপেজের গ্যালারি ইমেজ স্লাইড শো স্লাইডগুলো যোগ, ডিলিট এবং পরিবর্তন করুন। স্লাইডের ক্রম সাজাতে order ডেসিমাল নাম্বার ব্যবহার করুন।</p>
                      
                      <button
                        onClick={() => setIsAddingSlide(!isAddingSlide)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-450 text-slate-900 rounded-lg text-xs font-bold transition-all cursor-pointer shadow"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>নতুন স্লাইড যোগ করুন</span>
                      </button>
                    </div>

                    {isAddingSlide && (
                      <form onSubmit={handleAddNewSlide} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-3 border-b pb-2 mb-2 flex justify-between items-center">
                          <h4 className="font-bold text-slate-800 text-xs">নতুন স্লাইড যুক্ত করার ফর্ম</h4>
                          <button type="button" onClick={() => setIsAddingSlide(false)} className="text-slate-400 hover:text-rose-600"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">ছবি ইউআরএল (Image Path/URL)</label>
                          <input required type="text" placeholder="/src/assets/images/..." className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg text-xs" value={newSlideImage} onChange={(e) => setNewSlideImage(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">অগ্রাধিকার সূচক (Order)</label>
                          <input type="number" className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg text-xs" value={newSlideOrder} onChange={(e) => setNewSlideOrder(Number(e.target.value))} />
                        </div>
                        <div>
                          <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">ব্যাজ টাইটেল (Badge Text)</label>
                          <input required type="text" placeholder="উদাঃ প্রধান প্রবেশদ্বার" className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg text-xs" value={newSlideBadge} onChange={(e) => setNewSlideBadge(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">মূল শিরোনাম (Title)</label>
                          <input required type="text" placeholder="যেমন: মেহেরুন্নেসা গেট" className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg text-xs" value={newSlideTitle} onChange={(e) => setNewSlideTitle(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">উপ শিরোনাম (Sub-title)</label>
                          <input type="text" placeholder="যেমন: সুদৃশ্য ও সুপরিকল্পিত" className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg text-xs" value={newSlideSub} onChange={(e) => setNewSlideSub(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">আইকন টাইপ (Icon Name)</label>
                          <select className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg text-xs" value={newSlideIcon} onChange={(e) => setNewSlideIcon(e.target.value)}>
                            <option value="Compass">Compass (দিকনির্দেশক)</option>
                            <option value="Home">Home (ভিলা/বাড়ি)</option>
                            <option value="Map">Map (মানচিত্র)</option>
                            <option value="Sparkles">Sparkles (চমৎকারিত্ব)</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">সচিত্র দীর্ঘ বিবরণ (Description)</label>
                          <input type="text" placeholder="স্লাইড সম্পর্কে আকর্ষণীয় বিবরণ লিখুন..." className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg text-xs" value={newSlideDesc} onChange={(e) => setNewSlideDesc(e.target.value)} />
                        </div>
                        <div className="sm:col-span-3 text-right">
                          <button type="submit" className="px-5 py-2 bg-emerald-500 hover:bg-emerald-450 text-slate-900 rounded-lg text-xs font-bold cursor-pointer">স্লাইড যুক্ত করুন</button>
                        </div>
                      </form>
                    )}

                    {/* Slides Grid list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                      {slides.map((slide) => (
                        <div key={slide.id} className="border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-xs relative flex flex-col md:flex-row">
                          <div className="w-full md:w-1/3 h-32 md:h-auto bg-slate-900 relative">
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <span className="absolute top-2 left-2 bg-slate-900/80 text-white rounded text-[9px] px-1.5 py-0.5 font-bold font-mono">Order: {slide.order}</span>
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                            <div>
                              <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider inline-block bg-emerald-50 px-2 py-0.5 rounded">{slide.badge}</span>
                              <h4 className="text-sm font-extrabold text-slate-900 leading-snug mt-1">{slide.title}</h4>
                              <p className="text-[11px] font-bold text-slate-500">{slide.subTitle}</p>
                              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{slide.description}</p>
                            </div>
                            <div className="flex gap-2 pt-2 border-t justify-end">
                              <button
                                onClick={() => setEditingSlide(slide)}
                                className="inline-flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 px-2 py-1 rounded text-[10px] border font-bold cursor-pointer"
                              >
                                <Edit3 className="w-3" />
                                <span>সম্পাদনা</span>
                              </button>
                              <button
                                onClick={() => handleDeleteSlide(slide.id)}
                                className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 px-2 py-1 rounded text-[10px] border border-rose-250 font-bold cursor-pointer"
                              >
                                <Trash2 className="w-3" />
                                <span>ডিলিট</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  /* Colors & App configs settings tab block */
                  <form onSubmit={handleSaveGlobalConfig} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-6">
                    <div className="border-b pb-2">
                      <h4 className="font-extrabold text-slate-800 text-sm">ওয়েবসাইটের গ্লোবাল থিম কালার ও তথ্য কাস্টমাইজেশন</h4>
                      <p className="text-[11px] text-slate-500">এখানে যেকোনো সেকশন বা কালার সেভ করলে তা রিয়েল-টাইমে সম্পূর্ণ ওয়েবসাইটে রিফ্লেক্ট করবে।</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">১. প্রাইমারি কালার (Primary Slate Color)</label>
                        <div className="flex gap-2 items-center">
                          <input type="color" className="w-10 h-10 border border-slate-300 rounded cursor-pointer" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                          <input type="text" className="bg-white border text-xs px-3 py-2 rounded-lg font-mono text-slate-700 uppercase" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">২. অ্যাকসেন্ট কালার (Accent Brand Color)</label>
                        <div className="flex gap-2 items-center">
                          <input type="color" className="w-10 h-10 border border-slate-300 rounded cursor-pointer" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
                          <input type="text" className="bg-white border text-xs px-3 py-2 rounded-lg font-mono text-slate-700 uppercase" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
                        </div>
                      </div>

                      <div className="sm:col-span-2 border-t pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">সাইট মেইন হেডার টাইটেল</label>
                          <input type="text" className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg text-xs font-bold" value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">হেডার সাব-টাইটেল (মেটা)</label>
                          <input type="text" className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg text-xs" value={headerSubtitle} onChange={(e) => setHeaderSubtitle(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">যোগাযোগ কন্টাক্ট নম্বর</label>
                          <input type="text" className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg text-xs font-semibold" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">কিস্তি পরিশোধের সর্বোচ্চ সময়কাল (মাস)</label>
                          <input type="text" className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg text-xs font-medium" value={installmentPeriod} onChange={(e) => setInstallmentPeriod(e.target.value)} />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">গুগল ম্যাপ ইউআরএল অবস্থান (Google Maps Coordinate link)</label>
                          <input type="text" className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg text-xs" value={locationUrl} onChange={(e) => setLocationUrl(e.target.value)} />
                        </div>
                      </div>

                      <div className="sm:col-span-2 border-t pt-4 space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">হিরো ব্যানার প্রধান টাইটেল প্রচারাবরণ (Hero Primary Message)</label>
                          <textarea rows={2} className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg text-xs leading-relaxed" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">হিরো ব্যানার উপ-টাইটেল বিবরণী (Hero Subtitle details)</label>
                          <textarea rows={2} className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg text-xs leading-relaxed" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">অফিস যাতায়াত এবং সম্পূর্ণ লোকাল ঠিকানা (Address details)</label>
                          <textarea rows={2} className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg text-xs leading-relaxed" value={locationAddress} onChange={(e) => setLocationAddress(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className="text-right pt-4 border-t">
                      <button type="submit" className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-450 text-slate-900 rounded-xl text-xs font-extrabold shadow cursor-pointer">
                        কনফিগারেশন সেভ করুন
                      </button>
                    </div>
                  </form>
                )}

              </div>
            )}

          </div>
        )}

      </div>

      {/* Edit Plot Specifications Modal Panel overlay */}
      {editingPlot && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex justify-center items-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-300 w-full max-w-md text-left"
          >
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase">প্লট {editingPlot.plotNumber} পরিমার্জন</h3>
              <button onClick={() => setEditingPlot(null)} className="text-slate-400 hover:text-rose-650 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlotSettings} className="space-y-4 text-xs font-medium text-slate-700">
              <div>
                <label className="block mb-1 font-bold">জমির আকার (কাঠা)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                  value={editingPlot.sizeKatha}
                  onChange={(e) => setEditingPlot({ ...editingPlot, sizeKatha: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="block mb-1 font-bold">কাঠা প্রতি মূল্য (টাকা)</label>
                <input
                  type="number"
                  step="5000"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-mono"
                  value={editingPlot.pricePerKatha}
                  onChange={(e) => setEditingPlot({ ...editingPlot, pricePerKatha: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="block mb-1 font-bold">বুকিং স্থিতি (Status)</label>
                <select
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                  value={editingPlot.status}
                  onChange={(e) => setEditingPlot({ ...editingPlot, status: e.target.value as any })}
                >
                  <option value="available">বিক্রয়যোগ্য (Available)</option>
                  <option value="booked">বুকড করা (Booked)</option>
                  <option value="sold">সম্পূর্ণ বিক্রিত (Sold)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-bold">মুখী অবস্থান (Facing)</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                  value={editingPlot.facing}
                  onChange={(e) => setEditingPlot({ ...editingPlot, facing: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-1 font-bold">সংযোগ রাস্তার প্রশস্থতা</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                  value={editingPlot.roadWidth}
                  onChange={(e) => setEditingPlot({ ...editingPlot, roadWidth: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-1 font-bold">প্লট নোট বিবরণ</label>
                <textarea
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                  value={editingPlot.notes || ''}
                  onChange={(e) => setEditingPlot({ ...editingPlot, notes: e.target.value })}
                />
              </div>

              <div className="pt-4 border-t flex justify-end gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setEditingPlot(null)}
                  className="px-4 py-2 border rounded-lg text-slate-650 cursor-pointer hover:bg-slate-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-450 text-slate-900 font-bold rounded-lg cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Slide Specifications Modal Panel overlay */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex justify-center items-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-300 w-full max-w-sm text-left"
          >
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase">স্লাইড সম্পাদনা</h3>
              <button onClick={() => setEditingSlide(null)} className="text-slate-400 hover:text-rose-650 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSlide} className="space-y-4 text-xs font-medium text-slate-700">
              <div>
                <label className="block mb-1 font-bold">ছবি ইউআরএল (Image URL)</label>
                <input
                  required
                  type="text"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                  value={editingSlide.image}
                  onChange={(e) => setEditingSlide({ ...editingSlide, image: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-1 font-bold">অগ্রাধিকার ক্রম (Order)</label>
                <input
                  type="number"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                  value={editingSlide.order}
                  onChange={(e) => setEditingSlide({ ...editingSlide, order: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="block mb-1 font-bold">ব্যাজ মেটা টেক্সট</label>
                <input
                  required
                  type="text"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                  value={editingSlide.badge}
                  onChange={(e) => setEditingSlide({ ...editingSlide, badge: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-1 font-bold">মূল শিরোনাম</label>
                <input
                  required
                  type="text"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                  value={editingSlide.title}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-1 font-bold">উপ-শিরোনাম</label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                  value={editingSlide.subTitle}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subTitle: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-1 font-bold">আইকন ক্যারেক্টার (Icon)</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-semibold"
                  value={editingSlide.iconName || 'Compass'} 
                  onChange={(e) => setEditingSlide({ ...editingSlide, iconName: e.target.value })}
                >
                  <option value="Compass">Compass (দিকনির্দেশক)</option>
                  <option value="Home">Home (ভিলা/বাড়ি)</option>
                  <option value="Map">Map (মানচিত্র)</option>
                  <option value="Sparkles">Sparkles (চমৎকারিত্ব)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-bold">পূর্ণ ছবি বিবরণী</label>
                <textarea
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                  value={editingSlide.description || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, description: e.target.value })}
                />
              </div>

              <div className="pt-4 border-t flex justify-end gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
                  className="px-4 py-2 border rounded-lg text-slate-650 cursor-pointer hover:bg-slate-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-450 text-slate-900 font-bold rounded-lg cursor-pointer"
                >
                  স্লাইড সংরক্ষণ
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </section>
  );
}
