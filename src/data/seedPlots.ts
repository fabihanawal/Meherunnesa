import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Plot } from '../types';

const INITIAL_PLOTS: Omit<Plot, 'id'>[] = [
  {
    plotNumber: "1",
    sizeKatha: 5.00,
    pricePerKatha: 1500000,
    totalPrice: 7500000,
    status: "booked",
    facing: "দক্ষিণমুখী (South-Facing)",
    roadWidth: "২০ ফুট মেইন সড়ক সংলগ্ন",
    block: "ব্লক এ (Block A)",
    notes: "মেইন পিচঢালা রাস্তার পাশে কমার্শিয়াল ও প্রিমিয়াম ক্যাটাগরির প্লট।"
  },
  {
    plotNumber: "2",
    sizeKatha: 4.00,
    pricePerKatha: 1500000,
    totalPrice: 6000000,
    status: "sold",
    facing: "দক্ষিণমুখী (South-Facing)",
    roadWidth: "২০ ফুট মেইন সড়ক সংলগ্ন",
    block: "ব্লক এ (Block A)",
    notes: "রেডি বাউন্ডারি ওয়াল করা চমৎকার আবাসিক নিষ্কণ্টক জমি।"
  },
  {
    plotNumber: "3",
    sizeKatha: 2.47,
    pricePerKatha: 1500000,
    totalPrice: 3700000, // exact as image: ৩৭,০০,০০০
    status: "available",
    facing: "পূর্বমুখী (East-Facing)",
    roadWidth: "১০ ফুট সংযোগ রাস্তা",
    block: "ব্লক এ (Block A)",
    notes: "১০ ফুট সংযোগ রাস্তা সংলগ্ন উচু সুন্দর ভরাট প্লট।"
  },
  {
    plotNumber: "4",
    sizeKatha: 2.00,
    pricePerKatha: 1500000,
    totalPrice: 3000000, // exact as image: ৩০,০০,০০০
    status: "available",
    facing: "পূর্বমুখী (East-Facing)",
    roadWidth: "১০ ফুট সংযোগ রাস্তা",
    block: "ব্লক এ (Block A)",
    notes: "স্বল্প বাজেটে চমৎকার ২ কাঠার রেডি বাউন্ডারি করা প্লট।"
  },
  {
    plotNumber: "5",
    sizeKatha: 3.00,
    pricePerKatha: 1500000,
    totalPrice: 4500000, // exact as image: ৪৫,০০,০০০
    status: "available",
    facing: "দক্ষিণমুখী (South-Facing)",
    roadWidth: "১০ ফুট সংযোগ রাস্তা",
    block: "ব্লক এ (Block A)",
    notes: "আকর্ষণীয় দক্ষিণমুখী ৩ কাঠার রেডি প্লট, এখনই বাড়ি বানানোর উপযোগী।"
  },
  {
    plotNumber: "6",
    sizeKatha: 2.20,
    pricePerKatha: 1200000,
    totalPrice: 2640000, // exact as image: ২৬,৪০,০০০
    status: "available",
    facing: "পশ্চিমমুখী (West-Facing)",
    roadWidth: "১০ ফুট সংযোগ রাস্তা",
    block: "ব্লক বি (Block B)",
    notes: "১২ লক্ষ টাকা কাঠা মূল্যে অত্যন্ত সাশ্রয়ী বাজেট ফ্রেন্ডলি প্লট।"
  },
  {
    plotNumber: "7",
    sizeKatha: 3.28,
    pricePerKatha: 1200000,
    totalPrice: 3936000, // exact as image: ৩৯,৩৬,০০০
    status: "available",
    facing: "উত্তরমুখী (North-Facing)",
    roadWidth: "১০ ফুট সংযোগ রাস্তা",
    block: "ব্লক বি (Block B)",
    notes: "উত্তরমুখী উচু সলিড জমি, চমৎকার বসবাসের পরিবেশ।"
  },
  {
    plotNumber: "8",
    sizeKatha: 2.06,
    pricePerKatha: 1300000,
    totalPrice: 2678000, // exact as image: ২৬,৭৮,০০০
    status: "available",
    facing: "পূর্বমুখী (East-Facing)",
    roadWidth: "১০ ফুট সংযোগ রাস্তা",
    block: "ব্লক বি (Block B)",
    notes: "পূর্বমুখী আকর্ষণীয় ২.০৬ কাঠার চমৎকার পরিমাপের সুন্দর প্লট।"
  },
  {
    plotNumber: "9",
    sizeKatha: 3.50,
    pricePerKatha: 1500000,
    totalPrice: 5254000, // exact as image: ৫২,৫৪,০০০
    status: "available",
    facing: "দক্ষিণ-পূর্ব কর্নার (Corner Plot)",
    roadWidth: "১০ ফুট সংযোগ রাস্তা",
    block: "ব্লক বি (Block B)",
    notes: "প্রিমিয়াম দক্ষিণ-পূর্ব কর্নার সলিড রেডি প্লট।"
  }
];

export async function seedPlotsIfEmpty(): Promise<boolean> {
  try {
    // 1. Seed plots
    const plotsCol = collection(db, 'plots');
    const snapshot = await getDocs(plotsCol);
    
    // Check if the current collection has old seed data
    let shouldOverwriteHead = false;
    if (!snapshot.empty) {
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        if (d.plotNumber && (d.plotNumber.includes('A-') || d.plotNumber.includes('B-') || d.plotNumber.includes('C-'))) {
          shouldOverwriteHead = true;
        }
      });
      // Also if we have a mismatch in size (e.g. 12 instead of 9)
      if (snapshot.size !== 9) {
        shouldOverwriteHead = true;
      }
    } else {
      shouldOverwriteHead = true;
    }
    
    if (shouldOverwriteHead) {
      console.log("Old plots or incorrect count detected. Writing the 9 official plots into Firestore...");
      const batch = writeBatch(db);
      
      // Delete existing documents first
      snapshot.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
      
      INITIAL_PLOTS.forEach((plot) => {
        // Document ID equals plot number formatted (e.g. "plot-1")
        const docRef = doc(plotsCol, `plot-${plot.plotNumber}`);
        batch.set(docRef, plot);
      });
      
      await batch.commit();
      console.log("Successfully seeded/reset 9 official land plots in Firestore matching table!");
    }

    // 2. Seed slideshow images
    const slideshowCol = collection(db, 'slideshow');
    const slideshowSnap = await getDocs(slideshowCol);
    if (slideshowSnap.empty) {
      console.log("Slideshow vacant. Seeding 4 default slideshow slides...");
      const batch = writeBatch(db);
      const DEFAULT_SLIDES = [
        {
          image: '/src/assets/images/meherunnesa_gate_1780852437783.png',
          badge: 'প্রধান প্রবেশদ্বার',
          title: 'মেহেরুন্নেসা সোসাইটি মেইন গেট',
          subTitle: 'সুদৃশ্য ও সুপরিকল্পিত প্রবেশদ্বার',
          description: 'প্রজেক্টের মূল গেট এবং তার সাথে সংযুক্ত ২০ ফুট প্রশস্ত পিচ ঢালাই সংযোগ সড়ক যা সরাসরি দুর্গাপুর টু দয়ালের মোড় রোডের সাথে যুক্ত। নিরাপত্তা ও স্বকীয়তায় মোড়ানো আধুনিক আবাসন পরিবেশ।',
          order: 1,
          iconName: 'Compass'
        },
        {
          image: '/src/assets/images/meherunnesa_villa_1780852454160.png',
          badge: 'ভবিষ্যৎ আবাসন পরিকল্পনা',
          title: 'আপনার স্বপ্নের আধুনিক ভিলা বা অট্টালিকা',
          subTitle: '৩ থেকে ৫ কাঠা জমিতে দৃষ্টিনন্দন নকশা',
          description: 'মেহেরুন্নেসা সোসাইটির লাল কাদা মাটির উঁচু ভরাট প্লটগুলোতে ২, ৩ বা ৫ কাঠার সুনিপুণ বিন্যাসে আপনার শখের বহুতল ভবন বা নান্দনিক কান্ট্রি ভিলা গড়ার এখনই মোক্ষম সুযোগ।',
          order: 2,
          iconName: 'Home'
        },
        {
          image: '/src/assets/images/meherunnesa_layout_1780851468838.png',
          badge: 'মাস্টারপ্ল্যান নকশা',
          title: 'পরিকল্পিত সোসাইটি লেআউট ও প্লট বিন্যাস',
          subTitle: 'সঠিক পরিমাপ ও নিষ্কণ্টক সীমানা',
          description: 'সম্পূর্ণ প্রজেক্টের ভৌত বিন্যাস এবং সড়ক বিন্যাসের নিখুঁত নকশাচিত্র। প্রতিটি প্লটের মুখোমুখি ১০ ফুট অভ্যন্তরীণ চওড়া রাস্তা বিদ্যমান, যা অত্যন্ত সুশৃঙ্খলভাবে সাজানো হয়েছে।',
          order: 3,
          iconName: 'Map'
        },
        {
          image: '/src/assets/images/meherunnesa_hero_1780851448884.png',
          badge: 'প্রাকৃতিক ও মনোরম পরিবেশ',
          title: 'শান্ত, সবুজ ও উন্নত নাগরিক পরিবেশ',
          subTitle: 'ইতোমধ্যেই পরিবার নিয়ে নাগরিক জীবন যাপন',
          description: 'দক্ষিণ চকমোক্তারের কোলাহলমুক্ত স্বাস্থ্যকর পরিবেশ এবং প্রজেক্ট সংলগ্ন এলাকায় গড়ে ওঠা আবাসিক ঘরবাড়ি। পানি ও বিদ্যুৎ লাইনের তাত্ক্ষণিক সুবিধা সহ আজই বসবাস উপযোগী।',
          order: 4,
          iconName: 'Sparkles'
        }
      ];

      DEFAULT_SLIDES.forEach((slide) => {
        const docRef = doc(slideshowCol);
        batch.set(docRef, slide);
      });
      await batch.commit();
      console.log("Slideshow initialized successfully!");
    }

    // 3. Seed site settings configurations
    const settingsCol = collection(db, 'settings');
    const configDocRef = doc(settingsCol, 'app_config');
    const settingsSnap = await getDocs(settingsCol);
    
    // Check if app_config specific doc exists, if not seed it
    const configExists = settingsSnap.docs.some(doc => doc.id === 'app_config');
    if (!configExists) {
      console.log("Global Settings app_config configuration vacant. Establishing presets...");
      const DEFAULT_SETTINGS = {
        primaryColor: "#020617",
        accentColor: "#10b981",
        installmentPeriod: "১২ থেকে ২৪ মাস",
        title: "মেহেরুন্নেসা সোসাইটি",
        phone: "01535491716",
        locationAddress: "দক্ষিণ চকমোক্তার, এনামুলের মোড়, দুর্গাপুর টু দয়ালের মোড় রোড, নওগাঁ সদর, নওগাঁ।",
        locationUrl: "https://maps.google.com/?q=DurgaPur,Naogaon",
        headerSubtitle: "প্রজেক্ট ২ | নওগাঁ",
        heroTitle: "নওগাঁ শহরে নিজের একটি নিষ্কণ্টক জমা জমি ও স্থায়ী আবাসনের স্বপ্ন পূরণ করুন",
        heroSubtitle: "দুর্গাপুর টু দয়ালের মোড় পিচ ঢালাই মেইন রোড সংলগ্ন সম্পূর্ণ উচু লাল কাদা মাটি দ্বারা নতুন ভরাটকৃত নিষ্কণ্টক প্লট আজই বুকিং করুন।"
      };
      const batch = writeBatch(db);
      batch.set(configDocRef, DEFAULT_SETTINGS);
      await batch.commit();
      console.log("Global App Config seeded successfully!");
    }

    return true;
  } catch (error) {
    console.error("Error seeding application data: ", error);
    return false;
  }
}
