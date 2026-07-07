import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  Film, 
  Zap, 
  Home, 
  HeartPulse, 
  GraduationCap, 
  HelpCircle
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Format currency helper
export const formatCurrency = (amount: number, currency = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Format date to human-readable format
export const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-').map(Number);
  // Create Date using local timezone to prevent offset shifting
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Format date to long month/year for summary (e.g. January 2026)
export const formatMonthYear = (dateString: string): string => {
  const [year, month] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
};

// Get Lucide Icon for categories dynamically
export const getCategoryIcon = (categoryId: string): LucideIcon => {
  switch (categoryId) {
    case 'food':
      return Utensils;
    case 'transport':
      return Car;
    case 'shopping':
      return ShoppingBag;
    case 'entertainment':
      return Film;
    case 'utilities':
      return Zap;
    case 'housing':
      return Home;
    case 'health':
      return HeartPulse;
    case 'education':
      return GraduationCap;
    default:
      return HelpCircle;
  }
};
