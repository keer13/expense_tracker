import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar,
  AlertCircle,
  Receipt
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { CATEGORIES } from '../types';
import type { Expense } from '../types';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { formatCurrency, formatDate, getCategoryIcon } from '../utils';
import type { ExpenseInput } from '../validation';

export const Expenses: React.FC = () => {
  const { expenses, addExpense, updateExpense, deleteExpense, loading } = useExpenses();

  // Filter/Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse list dynamically
  const processedExpenses = useMemo(() => {
    let result = [...expenses];

    // 1. Search Query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (exp) => 
          exp.title.toLowerCase().includes(q) || 
          exp.description?.toLowerCase().includes(q)
      );
    }

    // 2. Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((exp) => exp.category === selectedCategory);
    }

    // 3. Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return a.date.localeCompare(b.date);
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        case 'date-desc':
        default:
          return b.date.localeCompare(a.date);
      }
    });

    return result;
  }, [expenses, searchQuery, selectedCategory, sortBy]);

  // Operations
  const handleAddSubmit = async (data: ExpenseInput) => {
    setIsSubmitting(true);
    try {
      await addExpense(data);
      setIsAddOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (data: ExpenseInput) => {
    if (!selectedExpense) return;
    setIsSubmitting(true);
    try {
      await updateExpense(selectedExpense.id, data);
      setIsEditOpen(false);
      setSelectedExpense(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedExpense) return;
    setIsSubmitting(true);
    try {
      await deleteExpense(selectedExpense.id);
      setIsDeleteOpen(false);
      setSelectedExpense(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...CATEGORIES.map(c => ({ value: c.id, label: c.name }))
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Date: Newest First' },
    { value: 'date-asc', label: 'Date: Oldest First' },
    { value: 'amount-desc', label: 'Amount: Highest First' },
    { value: 'amount-asc', label: 'Amount: Lowest First' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12 select-none">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Expenses History
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            View and manage all your logged financial transaction logs
          </p>
        </div>
        
        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md shadow-blue-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm"
        >
          <Plus size={18} />
          Add Transaction
        </button>
      </div>

      {/* Filter and Search Box panel */}
      <div className="bg-white/80 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-xs flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Search bar */}
          <div className="md:col-span-2 relative flex flex-col gap-1.5 text-left">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Search logs</span>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by description or title..."
                className="w-full py-2.5 pl-10.5 pr-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 input-focus-ring text-base"
              />
            </div>
          </div>

          {/* Category Filter */}
          <Select
            options={categoryOptions}
            label="Filter by Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            icon={Filter}
          />

          {/* Sort selection */}
          <Select
            options={sortOptions}
            label="Sort by Order"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            icon={SlidersHorizontal}
          />
        </div>
      </div>

      {/* Transaction List Cards */}
      <div className="flex flex-col gap-3.5">
        {loading ? (
          <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400">
            Syncing expense sheets...
          </div>
        ) : processedExpenses.length === 0 ? (
          <div className="bg-white/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 rounded-2xl py-16 px-6 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 flex items-center justify-center border border-slate-100 dark:border-slate-800/40">
              <Receipt size={32} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Transactions Found</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 max-w-sm mt-1 mx-auto">
                {searchQuery || selectedCategory !== 'all' 
                  ? "We couldn't find any results matching your search queries or filter categories."
                  : "Start logging your spendings by clicking the 'Add Transaction' button."}
              </p>
            </div>
            
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          processedExpenses.map((exp) => {
            const category = CATEGORIES.find(c => c.id === exp.category) || CATEGORIES[CATEGORIES.length - 1];
            const Icon = getCategoryIcon(exp.category);

            return (
              <div 
                key={exp.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4.5 rounded-2xl border border-slate-100/80 dark:border-slate-800/40 bg-white/80 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 shadow-xs hover:shadow-md transition-all duration-350 gap-4"
              >
                <div className="flex items-start gap-4 min-w-0">
                  {/* Category icon */}
                  <div 
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-white mt-0.5 shadow-sm"
                    style={{ backgroundColor: category.color }}
                  >
                    <Icon size={20} />
                  </div>
                  
                  {/* Info details */}
                  <div className="min-w-0 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                        {exp.title}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-slate-700/40">
                        {category.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(exp.date)}
                      </span>
                    </div>

                    {exp.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100/40 dark:border-slate-800/40 italic">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Amount and editing triggers */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-100 dark:border-slate-800/40 pt-3 sm:pt-0 gap-3.5 shrink-0">
                  <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                    {formatCurrency(exp.amount)}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedExpense(exp);
                        setIsEditOpen(true);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/5 dark:hover:bg-blue-500/10 transition-colors cursor-pointer"
                      aria-label="Edit record"
                    >
                      <Edit2 size={16} />
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedExpense(exp);
                        setIsDeleteOpen(true);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                      aria-label="Delete record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add Expense */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Expense Transaction"
      >
        <ExpenseForm
          onSubmit={handleAddSubmit}
          isLoading={isSubmitting}
          onCancel={() => setIsAddOpen(false)}
          submitLabel="Log Expense"
        />
      </Modal>

      {/* Modal: Edit Expense */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedExpense(null);
        }}
        title="Edit Expense Details"
      >
        {selectedExpense && (
          <ExpenseForm
            onSubmit={handleEditSubmit}
            isLoading={isSubmitting}
            initialValues={{
              title: selectedExpense.title,
              amount: selectedExpense.amount,
              date: selectedExpense.date,
              category: selectedExpense.category,
              description: selectedExpense.description,
            }}
            onCancel={() => {
              setIsEditOpen(false);
              setSelectedExpense(null);
            }}
            submitLabel="Update Transaction"
          />
        )}
      </Modal>

      {/* Modal: Delete Confirmation */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedExpense(null);
        }}
        title="Delete Transaction"
      >
        <div className="flex flex-col gap-4.5 text-center">
          <div className="w-14 h-14 rounded-full bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20">
            <AlertCircle size={28} />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">Confirm Deletion</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Are you sure you want to delete this expense record: <strong className="text-slate-800 dark:text-slate-200">"{selectedExpense?.title}"</strong>? This operation cannot be undone.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3.5 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteOpen(false);
                setSelectedExpense(null);
              }}
              disabled={isSubmitting}
              className="px-5.5"
            >
              Cancel
            </Button>
            
            <Button
              type="button"
              variant="danger"
              onClick={handleDeleteConfirm}
              isLoading={isSubmitting}
              className="px-5.5 font-semibold"
            >
              Delete Log
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
