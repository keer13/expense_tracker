import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { useAuth } from './AuthContext';
import type { Expense } from '../types';

interface ExpenseContextType {
  expenses: Expense[];
  loading: boolean;
  addExpense: (expense: Omit<Expense, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateExpense: (id: string, expense: Omit<Expense, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Sample data for demo mode
const getSampleExpenses = (userId: string): Expense[] => {
  const now = new Date();
  const getPastDateString = (daysAgo: number) => {
    const d = new Date();
    d.setDate(now.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };

  const getFirstOfMonth = () => {
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  };

  return [
    {
      id: 'sample-1',
      userId,
      title: 'Whole Foods Groceries',
      amount: 142.50,
      date: getPastDateString(1),
      category: 'food',
      description: 'Weekly grocery restock',
      createdAt: new Date(getPastDateString(1)).toISOString()
    },
    {
      id: 'sample-2',
      userId,
      title: 'Chevron Gas Station',
      amount: 48.00,
      date: getPastDateString(3),
      category: 'transport',
      description: 'Fuel fill up',
      createdAt: new Date(getPastDateString(3)).toISOString()
    },
    {
      id: 'sample-3',
      userId,
      title: 'Apartment Rent',
      amount: 1100.00,
      date: getFirstOfMonth(),
      category: 'housing',
      description: 'Monthly rent payment',
      createdAt: new Date(getFirstOfMonth()).toISOString()
    },
    {
      id: 'sample-4',
      userId,
      title: 'Electric & Gas Bill',
      amount: 112.40,
      date: getPastDateString(8),
      category: 'utilities',
      description: 'Utility company bill',
      createdAt: new Date(getPastDateString(8)).toISOString()
    },
    {
      id: 'sample-5',
      userId,
      title: 'Target Retail Shopping',
      amount: 89.95,
      date: getPastDateString(5),
      category: 'shopping',
      description: 'Clothes and household items',
      createdAt: new Date(getPastDateString(5)).toISOString()
    },
    {
      id: 'sample-6',
      userId,
      title: 'Netflix Standard Plan',
      amount: 15.49,
      date: getPastDateString(12),
      category: 'entertainment',
      description: 'Monthly video streaming',
      createdAt: new Date(getPastDateString(12)).toISOString()
    },
    {
      id: 'sample-7',
      userId,
      title: 'Pharmacy Refill',
      amount: 32.00,
      date: getPastDateString(14),
      category: 'health',
      description: 'Prescription medication',
      createdAt: new Date(getPastDateString(14)).toISOString()
    }
  ];
};

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    if (isFirebaseConfigured && db) {
      // Firebase listener
      try {
        const q = query(
          collection(db, 'expenses'),
          where('userId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedExpenses: Expense[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            fetchedExpenses.push({
              id: docSnap.id,
              userId: data.userId,
              title: data.title,
              amount: data.amount,
              date: data.date,
              category: data.category,
              description: data.description,
              createdAt: data.createdAt
            });
          });

          // Sort by date descending locally
          fetchedExpenses.sort((a, b) => b.date.localeCompare(a.date));
          setExpenses(fetchedExpenses);
          setLoading(false);
        }, (error) => {
          console.error('Error fetching expenses from Firestore:', error);
          setLoading(false);
        });

        return unsubscribe;
      } catch (err) {
        console.error('Error initializing expenses subscription:', err);
        setLoading(false);
      }
    } else {
      // Demo Mode logic
      const key = `expense_tracker_expenses_${user.uid}`;
      const savedExpenses = localStorage.getItem(key);
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      } else {
        // Hydrate default sample data
        const sampleData = getSampleExpenses(user.uid);
        localStorage.setItem(key, JSON.stringify(sampleData));
        setExpenses(sampleData);
      }
      setLoading(false);
    }
  }, [user]);

  // CRUD actions
  const addExpense = async (newExpense: Omit<Expense, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) throw new Error('Must be logged in to add an expense');

    const expensePayload = {
      ...newExpense,
      userId: user.uid,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && db) {
      await addDoc(collection(db!, 'expenses'), expensePayload);
    } else {
      const key = `expense_tracker_expenses_${user.uid}`;
      const newRecord: Expense = {
        ...expensePayload,
        id: 'expense_' + Math.random().toString(36).substr(2, 9)
      };

      const updatedExpenses = [newRecord, ...expenses];
      // Sort by date descending
      updatedExpenses.sort((a, b) => b.date.localeCompare(a.date));
      localStorage.setItem(key, JSON.stringify(updatedExpenses));
      setExpenses(updatedExpenses);
    }
  };

  const updateExpense = async (id: string, updatedFields: Omit<Expense, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) throw new Error('Must be logged in to update an expense');

    if (isFirebaseConfigured && db) {
      const docRef = doc(db!, 'expenses', id);
      await updateDoc(docRef, { ...updatedFields });
    } else {
      const key = `expense_tracker_expenses_${user.uid}`;
      const updatedExpenses = expenses.map(exp => {
        if (exp.id === id) {
          return { ...exp, ...updatedFields };
        }
        return exp;
      });

      updatedExpenses.sort((a, b) => b.date.localeCompare(a.date));
      localStorage.setItem(key, JSON.stringify(updatedExpenses));
      setExpenses(updatedExpenses);
    }
  };

  const deleteExpense = async (id: string) => {
    if (!user) throw new Error('Must be logged in to delete an expense');

    if (isFirebaseConfigured && db) {
      const docRef = doc(db!, 'expenses', id);
      await deleteDoc(docRef);
    } else {
      const key = `expense_tracker_expenses_${user.uid}`;
      const updatedExpenses = expenses.filter(exp => exp.id !== id);
      localStorage.setItem(key, JSON.stringify(updatedExpenses));
      setExpenses(updatedExpenses);
    }
  };

  return (
    <ExpenseContext.Provider value={{ expenses, loading, addExpense, updateExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
