import { SHOWROOM_INFO } from './constants';

export function formatPrice(price: number): string {
  if (price >= 10000000) {
    const crore = price / 10000000;
    return `₹${crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(2)} Cr`;
  } else if (price >= 100000) {
    const lakh = price / 100000;
    return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2)} Lakh`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatExactPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatKm(km: number): string {
  return `${new Intl.NumberFormat('en-IN').format(km)} km`;
}

export function calculateEMI(principal: number, annualRate: number = 9.5, tenureYears: number = 5): {
  monthlyEmi: number;
  totalInterest: number;
  totalPayable: number;
} {
  const monthlyRate = annualRate / (12 * 100);
  const numberOfMonths = tenureYears * 12;

  if (principal <= 0 || monthlyRate <= 0 || numberOfMonths <= 0) {
    return { monthlyEmi: 0, totalInterest: 0, totalPayable: 0 };
  }

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) /
    (Math.pow(1 + monthlyRate, numberOfMonths) - 1);

  const totalPayable = emi * numberOfMonths;
  const totalInterest = totalPayable - principal;

  return {
    monthlyEmi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayable: Math.round(totalPayable),
  };
}

export function getWhatsAppCarInquiryUrl(car: {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
}): string {
  const formattedPrice = formatPrice(car.price);
  const message = `Hi Brothers Autos, I am interested in the ${car.year} ${car.make} ${car.model} (Price: ${formattedPrice}, Ref: ${car.id.slice(-6).toUpperCase()}). Is it available for inspection and test drive?`;
  return `https://wa.me/${SHOWROOM_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function getGeneralWhatsAppUrl(): string {
  const message = `Hi Brothers Autos, I am looking for a certified pre-owned car. Could you please share the latest available inventory?`;
  return `https://wa.me/${SHOWROOM_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function parseJsonArray<T = string>(raw: string | undefined | null, fallback: T[] = []): T[] {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}
