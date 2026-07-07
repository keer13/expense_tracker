import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  ArrowRight, 
  TrendingUp, 
  Wallet, 
  DollarSign, 
  Activity,
  AlertTriangle,
  Receipt
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../context/ExpenseContext';
import { ExpenseCharts } from '../components/charts/ExpenseCharts';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { formatCurrency, formatDate, getCategoryIcon } from '../utils';
import type { ExpenseInput } from '../validation';
import { CATEGORIES } from '../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { expenses, addExpense, loading } = useExpenses();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute stats based on current month
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM

  const currentMonthExpenses = expenses.filter(
    (exp) => exp.date.substring(0, 7) === currentMonthKey
  );

  const totalSpentThisMonth = currentMonthExpenses.reduce(
    (sum, exp) => sum + exp.amount, 
    0
  );

  const monthlyBudget = user?.monthlyBudget || 2000;
  const remainingBudget = monthlyBudget - totalSpentThisMonth;
  const budgetUtilization = (totalSpentThisMonth / monthlyBudget) * 100;

  const averageTransactionThisMonth = currentMonthExpenses.length > 0 
    ? totalSpentThisMonth / currentMonthExpenses.length 
    : 0;

  // Budget status logic
  const isExceeded = totalSpentThisMonth > monthlyBudget;
  const isClose = !isExceeded && totalSpentThisMonth >= 0.8 * monthlyBudget;

  // Determine budget progress bar colors
  const getProgressBarColor = () => {
    if (isExceeded) return 'bg-rose-500';
    if (isClose) return 'bg-amber-500';
    return 'bg-emerald-500 dark:bg-emerald-400';
  };

  const getProgressBgColor = () => {
    if (isExceeded) return 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400';
    if (isClose) return 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400';
    return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400';
  };

  const handleAddSubmit = async (data: ExpenseInput) => {
    setIsSubmitting(true);
    try {
      await addExpense(data);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Failed to add expense:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Recent 4 expenses across all time
  const recentExpenses = expenses.slice(0, 4);

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {/* Welcome Greeting and Add action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Welcome, {user?.displayName || 'User'}
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Here's your financial status overview for {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md shadow-blue-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm"
        >
          <Plus size={18} />
          Add Expense
        </button>
      </div>

      {/* Dynamic budget warning */}
      {isExceeded && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-700 dark:text-rose-400 animate-pulse">
          <AlertTriangle size={20} className="shrink-0" />
          <div className="text-sm font-semibold">
            ⚠️ You have exceeded your monthly budget by {formatCurrency(totalSpentThisMonth - monthlyBudget)}.
          </div>
        </div>
      )}

      {isClose && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400">
          <AlertTriangle size={20} className="shrink-0" />
          <div className="text-sm font-semibold">
            ⚠️ You are close to reaching your monthly budget.
          </div>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric: Spent */}
        <Card className="hoverable p-6 flex items-center gap-4.5">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <TrendingUp size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Spent This Month
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 truncate">
              {formatCurrency(totalSpentThisMonth)}
            </h3>
          </div>
        </Card>

        {/* Metric: Remaining */}
        <Card className={`hoverable p-6 flex items-center gap-4.5 ${
          !isExceeded && !isClose 
            ? 'border-emerald-500/20 dark:border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10' 
            : ''
        }`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            isExceeded 
              ? 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 dark:text-rose-400' 
              : 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
          }`}>
            <Wallet size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Remaining Balance
            </p>
            <h3 className={`text-xl font-bold mt-1 truncate ${
              isExceeded 
                ? 'text-rose-500' 
                : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {formatCurrency(remainingBudget)}
            </h3>
          </div>
        </Card>

        {/* Metric: Budget */}
        <Card className={`hoverable p-6 flex items-center gap-4.5 ${
          isExceeded 
            ? 'border-rose-500/30 dark:border-rose-500/40 bg-rose-500/5 dark:bg-rose-500/10 shadow-xs shadow-rose-500/5' 
            : isClose 
              ? 'border-amber-500/30 dark:border-amber-500/40 bg-amber-500/5 dark:bg-amber-500/10 shadow-xs shadow-amber-500/5' 
              : ''
        }`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            isExceeded 
              ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400' 
              : isClose 
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' 
                : 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
          }`}>
            <DollarSign size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Monthly Limit
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 truncate">
              {formatCurrency(monthlyBudget)}
            </h3>
          </div>
        </Card>

        {/* Metric: Avg Trans */}
        <Card className="hoverable p-6 flex items-center gap-4.5">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Activity size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Avg Transaction
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 truncate">
              {formatCurrency(averageTransactionThisMonth)}
            </h3>
          </div>
        </Card>
      </div>

      {/* Budget Limit Progress Gauge */}
      <Card className="p-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Budget Utilization Gauge</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${getProgressBgColor()}`}>
              {budgetUtilization.toFixed(0)}% Used
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            {formatCurrency(totalSpentThisMonth)} of {formatCurrency(monthlyBudget)}
          </span>
        </div>
        
        {/* Progress Bar Track */}
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor()}`}
            style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
          />
        </div>
      </Card>

      {/* Charts Visualizer */}
      {loading ? (
        <div className="h-80 bg-white/40 dark:bg-slate-900/40 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800/60">
          <span className="text-sm text-slate-500 dark:text-slate-400">Loading visualizations...</span>
        </div>
      ) : (
        <ExpenseCharts expenses={expenses} />
      )}

      {/* Recent Transactions List & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Expenses list */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Recent Transactions</h3>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Latest financial logs recorded</p>
            </div>
            
            <Link 
              to="/expenses" 
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {loading ? (
              <p className="text-center py-6 text-slate-400 text-sm">Retrieving logs...</p>
            ) : recentExpenses.length === 0 ? (
              <div className="text-center py-8 flex flex-col items-center gap-3">
                <Receipt size={32} className="text-slate-300 dark:text-slate-600" />
                <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">No recent logs</p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                >
                  Create your first transaction
                </button>
              </div>
            ) : (
              recentExpenses.map((exp) => {
                const category = CATEGORIES.find(c => c.id === exp.category) || CATEGORIES[CATEGORIES.length - 1];
                const Icon = getCategoryIcon(exp.category);
                
                return (
                  <div 
                    key={exp.id} 
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100/60 dark:border-slate-800/40 bg-white/50 dark:bg-slate-950/40 hover:bg-slate-50/80 dark:hover:bg-slate-850/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Icon */}
                      <div 
                        className="w-10.5 h-10.5 rounded-xl flex items-center justify-center shrink-0 text-white"
                        style={{ backgroundColor: category.color }}
                      >
                        <Icon size={18} />
                      </div>
                      
                      {/* Meta */}
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {exp.title}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                          <span className="font-semibold">{category.name}</span>
                          <span>•</span>
                          <span>{formatDate(exp.date)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Amount */}
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 shrink-0">
                      {formatCurrency(exp.amount)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Mini budget breakdown category details */}
        <div className="bg-white/80 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-xs flex flex-col gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Monthly breakdown</h3>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Top billing distribution categories</p>
          </div>
          
          <div className="flex flex-col gap-3.5 overflow-y-auto no-scrollbar max-h-[300px] mt-2">
            {CATEGORIES.map(cat => {
              const catTotal = currentMonthExpenses
                .filter(exp => exp.category === cat.id)
                .reduce((sum, exp) => sum + exp.amount, 0);

              if (catTotal === 0) return null;

              const percent = totalSpentThisMonth > 0 
                ? (catTotal / totalSpentThisMonth) * 100 
                : 0;

              return (
                <div key={cat.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </span>
                    <span className="text-slate-900 dark:text-slate-100">
                      {formatCurrency(catTotal)} ({percent.toFixed(0)}%)
                    </span>
                  </div>
                  {/* Progress Line */}
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        backgroundColor: cat.color,
                        width: `${percent}%`
                      }}
                    />
                  </div>
                </div>
              );
            })}
            
            {currentMonthExpenses.length === 0 && (
              <p className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                No monthly transactions recorded yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add Expense Modal Wrapper */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Expense Transaction"
      >
        <ExpenseForm 
          onSubmit={handleAddSubmit}
          isLoading={isSubmitting}
          onCancel={() => setIsAddModalOpen(false)}
          submitLabel="Log Expense"
        />
      </Modal>
    </div>
  );
};
