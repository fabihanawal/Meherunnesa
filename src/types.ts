export interface Plot {
  id: string; // Document ID
  plotNumber: string; // e.g. "A-1", "A-2"
  sizeKatha: number; // e.g. 3, 5, 4.5
  pricePerKatha: number; // Taka per katha
  totalPrice: number; // total price
  status: 'available' | 'booked' | 'sold';
  facing: string; // e.g. "South", "East"
  roadWidth: string; // e.g. "20 feet main road", "10 feet internal"
  block: string; // e.g. "Block A", "Block B"
  notes?: string;
}

export interface BookingRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  plotId?: string; // Associated plotNumber
  message?: string;
  status: 'pending' | 'contacted' | 'completed';
  createdAt: string; // Date string or ServerTimestamp representation
}

export interface AppSettings {
  id: string;
  title: string;
  phone: string;
  installmentPeriod: string;
  locationAddress: string;
  locationUrl: string;
}
