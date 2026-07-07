import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile as firebaseUpdateProfile, 
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../firebase/config';
import type { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isDemo: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserBudget: (budget: number) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_BUDGET = 2000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo] = useState(!isFirebaseConfigured);

  // Sync auth state
  useEffect(() => {
    if (isFirebaseConfigured && auth && db) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Fetch additional user details like budget from Firestore
            const userDocRef = doc(db!, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            
            let monthlyBudget = DEFAULT_BUDGET;
            
            if (userDoc.exists()) {
              monthlyBudget = userDoc.data().monthlyBudget || DEFAULT_BUDGET;
            } else {
              // Create user profile document in Firestore
              await setDoc(userDocRef, {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                monthlyBudget: DEFAULT_BUDGET,
                createdAt: new Date().toISOString()
              });
            }

            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              monthlyBudget
            });
          } catch (error) {
            console.error('Error fetching user profile from Firestore:', error);
            // Fallback user state
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              monthlyBudget: DEFAULT_BUDGET
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Demo Mode auth state sync
      const savedUser = localStorage.getItem('expense_tracker_current_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    }
  }, [isDemo]);

  // Auth Operations
  const login = async (email: string, password: string) => {
    if (isFirebaseConfigured && auth) {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      // Demo Mode login check
      const usersRaw = localStorage.getItem('expense_tracker_demo_users');
      const users: any[] = usersRaw ? JSON.parse(usersRaw) : [];
      const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      
      if (matched) {
        const profile: UserProfile = {
          uid: matched.uid,
          email: matched.email,
          displayName: matched.displayName,
          photoURL: null,
          monthlyBudget: matched.monthlyBudget || DEFAULT_BUDGET
        };
        localStorage.setItem('expense_tracker_current_user', JSON.stringify(profile));
        setUser(profile);
      } else {
        throw new Error('Invalid email or password. (Demo Mode: Try signing up first!)');
      }
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    if (isFirebaseConfigured && auth && db) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update Auth Profile
      await firebaseUpdateProfile(firebaseUser, { displayName });
      
      // Save details to Firestore
      const userDocRef = doc(db!, 'users', firebaseUser.uid);
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: displayName,
        monthlyBudget: DEFAULT_BUDGET,
        createdAt: new Date().toISOString()
      });

      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: displayName,
        photoURL: null,
        monthlyBudget: DEFAULT_BUDGET
      });
    } else {
      // Demo Mode signup
      const usersRaw = localStorage.getItem('expense_tracker_demo_users');
      const users: any[] = usersRaw ? JSON.parse(usersRaw) : [];
      
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email already exists. Please choose a different one.');
      }

      const newUid = 'demo_user_' + Math.random().toString(36).substr(2, 9);
      const newMockUser = {
        uid: newUid,
        email,
        password,
        displayName,
        monthlyBudget: DEFAULT_BUDGET
      };
      
      users.push(newMockUser);
      localStorage.setItem('expense_tracker_demo_users', JSON.stringify(users));
      
      const profile: UserProfile = {
        uid: newUid,
        email,
        displayName,
        photoURL: null,
        monthlyBudget: DEFAULT_BUDGET
      };
      localStorage.setItem('expense_tracker_current_user', JSON.stringify(profile));
      setUser(profile);
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    } else {
      localStorage.removeItem('expense_tracker_current_user');
      setUser(null);
    }
  };

  const updateUserBudget = async (budget: number) => {
    if (!user) throw new Error('No user is logged in');
    
    if (isFirebaseConfigured && db) {
      const userDocRef = doc(db!, 'users', user.uid);
      await updateDoc(userDocRef, { monthlyBudget: budget });
      setUser(prev => prev ? { ...prev, monthlyBudget: budget } : null);
    } else {
      // Demo Mode budget update
      const updatedProfile = { ...user, monthlyBudget: budget };
      localStorage.setItem('expense_tracker_current_user', JSON.stringify(updatedProfile));
      setUser(updatedProfile);

      // Also update in registered user array
      const usersRaw = localStorage.getItem('expense_tracker_demo_users');
      if (usersRaw) {
        const users: any[] = JSON.parse(usersRaw);
        const idx = users.findIndex(u => u.uid === user.uid);
        if (idx !== -1) {
          users[idx].monthlyBudget = budget;
          localStorage.setItem('expense_tracker_demo_users', JSON.stringify(users));
        }
      }
    }
  };

  const updateUserProfile = async (displayName: string) => {
    if (!user) throw new Error('No user is logged in');

    if (isFirebaseConfigured && auth && db) {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await firebaseUpdateProfile(currentUser, { displayName });
        const userDocRef = doc(db!, 'users', user.uid);
        await updateDoc(userDocRef, { displayName });
      }
      setUser(prev => prev ? { ...prev, displayName } : null);
    } else {
      // Demo Mode profile update
      const updatedProfile = { ...user, displayName };
      localStorage.setItem('expense_tracker_current_user', JSON.stringify(updatedProfile));
      setUser(updatedProfile);

      const usersRaw = localStorage.getItem('expense_tracker_demo_users');
      if (usersRaw) {
        const users: any[] = JSON.parse(usersRaw);
        const idx = users.findIndex(u => u.uid === user.uid);
        if (idx !== -1) {
          users[idx].displayName = displayName;
          localStorage.setItem('expense_tracker_demo_users', JSON.stringify(users));
        }
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDemo, login, signup, logout, updateUserBudget, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
