# 💰 Spenda - Expense Tracker

A modern full-stack Expense Tracker web application built using React, TypeScript, Vite, Tailwind CSS, and Firebase.

## 🚀 Live Demo
https://expense-tracker-3uow2ujav-keer13s-projects.vercel.app


---

## ✨ Features

- 🔐 Firebase Authentication (Email & Password)
- 👤 User Registration & Login
- 🔒 Protected Routes
- 💸 Add Expenses
- 📝 Edit Expenses
- 🗑️ Delete Expenses
- 🔍 Search Expenses
- 🏷️ Filter by Category
- 📅 Sort by Date
- 📊 Monthly Expense Summary
- 📈 Category-wise Summary
- 🌙 Dark Mode
- 👤 User Profile
- ⚙️ Settings Page
- 🇮🇳 Indian Rupee (₹) Support
- ☁️ Firebase Firestore Database

---

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- TypeScript
- Tailwind CSS
- React Router DOM
- React Hook Form
- Zod

### Backend / Database
- Firebase Authentication
- Firebase Firestore

### State Management
- React Context API

### Development Tools
- ESLint
- Prettier
- Git
- GitHub

---

## 📂 Folder Structure

```
expense_tracker/
│
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── firebase/
│   ├── pages/
│   ├── router/
│   ├── types/
│   ├── utils/
│   └── validation/
│
├── .env.example
├── package.json
└── README.md
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/keer13/expense_tracker.git
```

Move into the project

```bash
cd expense_tracker
```

Install dependencies

```bash
npm install
```

Create a `.env` file and add your Firebase configuration.

Example:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
```

Run the development server

```bash
npm run dev
```

---

## 🔥 Firebase

This project uses:

- Firebase Authentication
- Cloud Firestore

Make sure Authentication and Firestore are enabled in your Firebase project before running the application.

---

## 📈 Future Enhancements

- Budget notifications
- Export expenses to PDF
- Export to Excel
- Charts & Analytics
- Recurring Expenses
- Multi-Currency Support
- Email Reports
- Mobile Responsive Improvements

---

## 👩‍💻 Author

**Keerthana G**

GitHub:
https://github.com/keer13

---

## 📄 License

This project is licensed under the MIT License.
