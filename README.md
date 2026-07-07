# Spenda — Advanced Expense Tracker Hub

Spenda is a premium, fully-functional personal finance and expense tracking web application. It features real-time synchronization, sleek responsive layouts, visual analytics charts, and a high-end glassmorphism dark/light design system.

The application compiles on **React 19** and **Vite** using **TypeScript**, **Tailwind CSS**, **Zod**, and **React Hook Form**. It connects dynamically to **Firebase Authentication** and **Firebase Firestore** with a seamless local storage sandbox fallback if environment variables are not set.

---

## 🚀 Key Features

* **Dynamic Splash Screen**: Animated brand-opening loading indicator.
* **Dual Auth Modes**: Secured email/password signup & login with Firebase, or browser sandbox local storage demo mode.
* **Real-time Synchronization**: Interactive updates of transactions from Google Cloud Firestore.
* **Budget Limit Gauge**: Color-shifting progress gauge (turns amber at 75% utilization, red at 90% utilization).
* **Responsive Sidebar & Navigation**: Collapsible mobile layouts.
* **Interactive Analytics**: Monthly Area chart trend and Category distribution Donut chart powered by Recharts.
* **Full CRUD Logs Operations**: Add, search, filter, sort, edit, and delete transactions.
* **Aesthetic Theme System**: Light and Dark mode options.
* **Form Validations**: Complete error feedback checked via Zod schemas.

---

## 🛠️ Tech Stack & Architectures

1. **Core Framework**: React 19, Vite, TypeScript
2. **Styling Engine**: Tailwind CSS v4 (using Vite `@tailwindcss/vite` imports)
3. **Validations & Forms**: React Hook Form, @hookform/resolvers, Zod
4. **Data Visualization**: Recharts
5. **Database & Authentication**: Firebase v11 (Auth, Firestore)
6. **Icons**: Lucide React

---

## ⚙️ Project Setup Guide

### 1. Prerequisite Installations
Make sure you have Node.js (v18+) and npm installed.

### 2. Install Packages
Clone the repository, enter the directory and install dependencies:
```bash
npm install
```

### 3. Setup Environment Variables
To connect Firebase database sync, copy the sample configurations file:
```bash
cp .env.example .env
```
Fill in the configuration details using credentials from your Firebase Console.

*If you do not configure Firebase immediately, the application will automatically activate **Demo Mode** (local sandbox storage) showing all features instantly.*

### 4. Run Development Server
Start the local Vite preview server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## 🔒 Firebase Security Rules (Recommended)

To protect user transaction privacy, ensure you apply these rules in your Firestore Database settings:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User collection rules
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Expense collection rules
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```
