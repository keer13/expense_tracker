import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Type, DollarSign, Calendar, Tag, AlignLeft } from 'lucide-react';
import { expenseSchema } from '../../validation';
import type { ExpenseInput } from '../../validation';
import { CATEGORIES } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface ExpenseFormProps {
  onSubmit: (data: ExpenseInput) => Promise<void>;
  initialValues?: Partial<ExpenseInput>;
  isLoading?: boolean;
  onCancel: () => void;
  submitLabel?: string;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  initialValues,
  isLoading = false,
  onCancel,
  submitLabel = 'Save Transaction',
}) => {
  // Set default date to today in YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseInput>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: initialValues?.title || '',
      amount: initialValues?.amount || undefined,
      date: initialValues?.date || today,
      category: initialValues?.category || 'food',
      description: initialValues?.description || '',
    },
  });

  const categoryOptions = CATEGORIES.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-left">
      {/* Title */}
      <Input
        id="title"
        type="text"
        label="Transaction Title"
        placeholder="e.g. Whole Foods Groceries"
        icon={Type}
        error={errors.title?.message}
        {...register('title')}
      />

      {/* Amount and Date (Grid for compact layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="amount"
          type="number"
          step="0.01"
          label="Amount (₹)"
          placeholder="0.00"
          icon={DollarSign}
          error={errors.amount?.message}
          {...register('amount', { valueAsNumber: true })}
        />

        <Input
          id="date"
          type="date"
          label="Date"
          icon={Calendar}
          error={errors.date?.message}
          {...register('date')}
        />
      </div>

      {/* Category Selection */}
      <Select
        id="category"
        label="Category"
        options={categoryOptions}
        icon={Tag}
        error={errors.category?.message}
        {...register('category')}
      />

      {/* Description */}
      <div className="w-full flex flex-col gap-1.5 animate-fade-in">
        <label
          htmlFor="description"
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Description (Optional)
        </label>
        <div className="relative rounded-xl">
          <div className="absolute top-3.5 left-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <AlignLeft size={18} />
          </div>
          <textarea
            id="description"
            rows={3}
            placeholder="Add dynamic note details..."
            className={`
              w-full py-2.5 pl-10.5 pr-3.5 rounded-xl border border-slate-200 dark:border-slate-800
              bg-white/80 dark:bg-slate-900/60
              text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500
              input-focus-ring text-base resize-none
              ${errors.description ? 'border-rose-500 dark:border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20' : ''}
            `}
            {...register('description')}
          />
        </div>
        {errors.description && (
          <span className="text-xs text-rose-500 font-medium pl-1 animate-fade-in">
            {errors.description.message}
          </span>
        )}
      </div>

      {/* Form Buttons */}
      <div className="flex items-center justify-end gap-3 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="px-5"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          className="px-5 font-semibold"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
