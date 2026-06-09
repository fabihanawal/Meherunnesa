import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, User, Landmark, Send, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Plot } from '../types';

interface BookingFormProps {
  plots: Plot[];
  selectedPlot: Plot | null;
}

export default function BookingForm({ plots, selectedPlot }: BookingFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [plotId, setPlotId] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync selected plot from outer boards
  useEffect(() => {
    if (selectedPlot) {
      setPlotId(selectedPlot.plotNumber);
    } else {
      setPlotId('');
    }
  }, [selectedPlot]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic frontend verification
    if (!customerName.trim() || !customerPhone.trim()) {
      setError('দয়া করে আপনার নাম এবং মোবাইল নম্বরটি সঠিকভাবে প্রদান করুন।');
      setLoading(false);
      return;
    }

    if (customerPhone.length < 11) {
      setError('মোবাইল নম্বরটি কমপক্ষে ১১ ডিজিটের হতে হবে।');
      setLoading(false);
      return;
    }

    try {
      const bookingsCol = collection(db, 'bookings');
      
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || null,
        plotId: plotId || 'General Inquiry',
        message: message.trim() || null,
        status: 'pending',
        createdAt: new Date().toISOString() // Fallback string representation
      };

      // Create document in Firestore
      await addDoc(bookingsCol, payload);

      // Generate WhatsApp message and redirect to WhatsApp number 01535491716
      const formattedWhatsAppPhone = "8801535491716";
      const waText = `আসসালামু আলাইকুম,

আমি মেহেরুন্নেসা সোসাইটি প্রজেক্ট ২ এ প্লট বুকিং / তথ্য অনুসন্ধানের জন্য যোগাযোগ করছি। বিস্তারিত নিম্নরূপঃ

👤 নাম: ${customerName.trim()}
📞 মোবাইল নম্বর: ${customerPhone.trim()}
📧 ইমেইল: ${customerEmail.trim() || 'প্রদান করা হয়নি'}
🗺️ আগ্রহী প্লট: ${plotId ? `প্লট ${plotId}` : 'সাধারণ তথ্য / আলোচনা'}
💬 বিশেষ জিজ্ঞাসা/বার্তা: ${message.trim() || 'নেই'}

ধন্যবাদ!`;

      const whatsappUrl = `https://wa.me/${formattedWhatsAppPhone}?text=${encodeURIComponent(waText)}`;
      
      // Attempt to open in a new window/tab
      try {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      } catch (err) {
        console.error("Window open blocked. Falling back to setting window.location.href", err);
        window.location.href = whatsappUrl;
      }

      setSuccess(true);
      // Reset form variables
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      setMessage('');
    } catch (err: unknown) {
      console.error("Booking submission error: ", err);
      setError('দুঃখিত, কোনো একটি ত্রুটির কারণে আপনার বুকিং অনুরোধটি পাঠানো যায়নি। অনুগ্রহ করে ফোনে সরাসরি যোগাযোগ করুন।');
      
      // Mandatory: call global firestore error tracker helper
      try {
        handleFirestoreError(err, OperationType.CREATE, 'bookings');
      } catch (logErr) {
        // Keep moving
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="booking-section" className="py-16 bg-white text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Title Group */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            অনলাইনে বুকিং বুকিং অনুরোধ / যেকোনো তথ্য জানুন
          </h2>
          <p className="mt-3 text-slate-500 font-sans text-sm">
            নিচের ফর্মটি পূরণ করুন এবং আপনার পছন্দের প্লট বা কিস্তি ডিল বুকিং করতে সাবমিট করুন। আমাদের প্রতিনিধি আপনার সাথে অল্প সময়ের মাঝে যোগাযোগ করবেন।
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-8 space-y-4"
              >
                <div className="inline-flex items-center justify-center bg-emerald-100 text-emerald-650 rounded-full p-2.5 mb-2">
                  <CheckCircle2 className="w-14 h-14" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">অনেক ধন্যবাদ!</h3>
                <p className="text-slate-600 max-w-md mx-auto text-sm leading-relaxed">
                  আপনার বুকিং অনুরোধ ও তথ্য আমাদের ডেটাবেজে সফলভাবে সংরক্ষিত হয়েছে। আমরা খুব শীঘ্রই <strong>{customerPhone}</strong> নম্বরে আপনার সাথে কথা বলবো।
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-sans cursor-pointer transition-all"
                >
                  আবার নতুন বার্তা পাঠান
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form-fields"
                onSubmit={handleSubmit}
                className="space-y-6 text-left"
              >
                {/* Error Banner */}
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div>
                    <label className="block text-slate-700 text-xs font-bold uppercase mb-2">আপনার পূর্ণ নাম (আবশ্যক)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="উদাঃ কাজী আশরাফুল"
                        className="pl-10 w-full bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Phone field */}
                  <div>
                    <label className="block text-slate-700 text-xs font-bold uppercase mb-2">মোবাইল নম্বর (আবশ্যক — সচল মোবাইল দিন)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="উদাঃ 01535491716"
                        className="pl-10 w-full bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email field */}
                  <div>
                    <label className="block text-slate-705 text-xs font-bold uppercase mb-2">ইমেইল ঠিকানা (ঐচ্ছিক)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        placeholder="উদাঃ info@example.com"
                        className="pl-10 w-full bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Plot selection dropdown */}
                  <div>
                    <label className="block text-slate-705 text-xs font-bold uppercase mb-2">কোন প্লটে আগ্রহী?</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Landmark className="w-4 h-4" />
                      </div>
                      <select
                        className="pl-10 w-full bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                        value={plotId}
                        onChange={(e) => setPlotId(e.target.value)}
                      >
                        <option value="">সাধারণ তথ্য / আলোচনা করতে চাই</option>
                        {plots.map((plot) => (
                          <option key={plot.id} value={plot.plotNumber}>
                            প্লট {plot.plotNumber} ফেস ({plot.facing}) — {plot.sizeKatha} কাঠা
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Message custom details */}
                <div>
                  <label className="block text-slate-705 text-xs font-bold uppercase mb-2">আপনার মন্তব্য / বিশেষ কোনো জিজ্ঞাসা (ঐচ্ছিক)</label>
                  <textarea
                    rows={3}
                    placeholder="কিস্তির সময়কাল, পরিশোধ প্রক্রিয়া কিংবা সামনাসামনি জমি প্রদর্শনের সম্ভাব্য দিন সম্পর্কে বিস্তারিত লিখতে পারেন।"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                {/* Submit button */}
                <div className="text-right">
                  <button
                    type="submit"
                    id="submit-booking"
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-450 disabled:bg-emerald-300 disabled:cursor-not-allowed text-slate-900 hover:text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>প্রক্রিয়া করা হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>বার্তা সাবমিট করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
