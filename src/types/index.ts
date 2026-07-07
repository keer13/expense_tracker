export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  monthlyBudget: number;
}

export interface Expense {
  id: string;
  userId: string;
  title: string;
  amount: number;
  date: string; // YYYY-MM-DD format
  category: string;
  description?: string;
  createdAt?: string; // ISO string
}

export interface BudgetSettings {
  monthlyBudget: number;
  currency: string;
}

export const CATEGORIES = [
  { id: 'food', name: 'Food & Dining', color: '#ef4444', icon: 'Utensils' },
  { id: 'transport', name: 'Transportation', color: '#3b82f6', icon: 'Car' },
  { id: 'shopping', name: 'Shopping', color: '#ec4899', icon: 'ShoppingBag' },
  { id: 'entertainment', name: 'Entertainment', color: '#8b5cf6', icon: 'Film' },
  { id: 'utilities', name: 'Bills & Utilities', color: '#eab308', icon: 'Zap' },
  { id: 'housing', name: 'Housing & Rent', color: '#10b981', icon: 'Home' },
  { id: 'health', name: 'Health & Medical', color: '#14b8a6', icon: 'HeartPulse' },
  { id: 'education', name: 'Education', color: '#6366f1', icon: 'GraduationCap' },
  { id: 'other', name: 'Other Expenses', color: '#6b7280', icon: 'HelpCircle' }
] as const;

export type CategoryType = typeof CATEGORIES[number]['id'];
