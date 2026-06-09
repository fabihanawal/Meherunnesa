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
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error seeding land plots: ", error);
    return false;
  }
}
