import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  DollarSign, 
  Moon, 
  Sun, 
  Cloud, 
  Database, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const budgetSchema = z.object({
  monthlyBudget: z.number({ message: 'Budget is required' }).positive('Budget must be positive').min(100, 'Minimum budget limit is ₹100'),
});

type BudgetInput = z.infer<typeof budgetSchema>;

export const Settings: React.FC = () => {
  const { user, updateUserBudget, isDemo } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BudgetInput>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      monthlyBudget: user?.monthlyBudget || 2000,
    },
  });

  const onSubmitBudget = async (data: BudgetInput) => {
    setSuccessMsg(null);
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await updateUserBudget(data.monthlyBudget);
      setSuccessMsg('Budget limit updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to update budget settings.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12 select-none">
      {/* Header Area */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Settings
        </h2>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Configure your financial goals, visual theme, and database settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Column: Sections list summary */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <Card className="p-5 flex flex-col gap-2">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Budget Limit</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Set limits to visualize and track when your spending exhausts budget targets.
            </p>
          </Card>
          <Card className="p-5 flex flex-col gap-2">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Visual Appearance</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Choose dark or light visual modes to comfort your eye experience.
            </p>
          </Card>
          <Card className="p-5 flex flex-col gap-2">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Infrastructure</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Review cloud database synchronizations status and environment state.
            </p>
          </Card>
        </div>

        {/* Right Column: Setting components Panels */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* Panel: Budget Settings */}
          <Card className="p-6.5 flex flex-col gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Budget Configurations</h3>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Define your default monthly spending limit</p>
            </div>

            <form onSubmit={handleSubmit(onSubmitBudget)} className="flex flex-col gap-5 text-left mt-2">
              {successMsg && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium animate-fade-in">
                  <CheckCircle size={18} className="shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-medium animate-fade-in">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <Input
                id="monthlyBudget"
                type="number"
                label="Monthly Budget Target (₹)"
                placeholder="e.g. 2000"
                icon={DollarSign}
                error={errors.monthlyBudget?.message}
                {...register('monthlyBudget', { valueAsNumber: true })}
              />

              <div className="flex items-center justify-end border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-2">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="px-5.5 font-semibold font-base"
                >
                  Save Limit
                </Button>
              </div>
            </form>
          </Card>

          {/* Panel: Appearance Settings */}
          <Card className="p-6.5 flex flex-col gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Visual Mode Selection</h3>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Choose between dark and light modes</p>
            </div>

            <div className="flex items-center justify-between p-4.5 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-white/50 dark:bg-slate-950/40">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-blue-500" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500" />
                )}
                <div className="text-left">
                  <h4 className="text-sm font-bold text-slate-850 dark:text-slate-150">Dark Visual Theme</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Switch modes of application colors</p>
                </div>
              </div>

              {/* Styled Slide Switcher */}
              <button
                onClick={toggleTheme}
                className={`
                  w-12 h-6.5 rounded-full p-1 cursor-pointer transition-colors duration-200 focus:outline-none
                  ${theme === 'dark' ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'}
                `}
                aria-label="Toggle visual theme"
              >
                <div 
                  className={`
                    w-4.5 h-4.5 bg-white rounded-full shadow-md transform transition-transform duration-200
                    ${theme === 'dark' ? 'translate-x-5.5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          </Card>

          {/* Panel: Database Status Integration */}
          <Card className="p-6.5 flex flex-col gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Database Connection Status</h3>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Infrastructure and backend cloud states</p>
            </div>

            {!isDemo ? (
              <div className="flex items-start gap-4 p-4.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400">
                <Cloud size={24} className="shrink-0 mt-0.5" />
                <div className="text-left">
                  <h4 className="text-sm font-bold">Cloud Mode Enabled</h4>
                  <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 mt-1">
                    Spenda is connected with a live Google Cloud Firebase. Your expense logs are backed up automatically in real-time under Firestore collections.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4 p-4.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-400">
                <Database size={24} className="shrink-0 mt-0.5" />
                <div className="text-left">
                  <h4 className="text-sm font-bold">Sandbox (Local Storage) Mode</h4>
                  <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1">
                    You are in offline sandbox mode. Transactions are persisted inside your local web browser. To connect a secure production Firestore:
                  </p>
                  <ol className="text-xs list-decimal list-inside mt-2 flex flex-col gap-1 font-medium pl-1">
                    <li>Create a Firebase Project in the Firebase Console.</li>
                    <li>Copy your API key and Project Credentials.</li>
                    <li>Create a <code className="bg-amber-500/20 px-1 py-0.5 rounded">.env</code> file in the project root.</li>
                    <li>Define variables from <code className="bg-amber-500/20 px-1 py-0.5 rounded">.env.example</code>.</li>
                  </ol>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
