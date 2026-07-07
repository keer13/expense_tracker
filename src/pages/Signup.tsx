import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User, ArrowRight, AlertCircle, Receipt } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signupSchema } from '../validation';
import type { SignupInput } from '../validation';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const Signup: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupInput) => {
    setGeneralError(null);
    setIsSubmitting(true);
    try {
      await signup(data.email, data.password, data.displayName);
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      setGeneralError(error.message || 'Failed to register account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md flex flex-col gap-6 relative z-10">
        {/* Logo and branding */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Receipt size={24} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Create Account</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Start tracking your monthly expenses and budgets
          </p>
        </div>

        {/* Signup card */}
        <Card className="p-8 shadow-xl bg-white/90 dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {generalError && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-medium animate-fade-in">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{generalError}</span>
              </div>
            )}

            {/* Name Input */}
            <Input
              id="displayName"
              type="text"
              label="Full Name"
              placeholder="Alex Johnson"
              icon={User}
              error={errors.displayName?.message}
              {...register('displayName')}
            />

            {/* Email Input */}
            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="name@example.com"
              icon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />

            {/* Password Input */}
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              icon={Lock}
              error={errors.password?.message}
              {...register('password')}
            />

            {/* Password Confirmation */}
            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              icon={Lock}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            {/* Submit button */}
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full py-3 mt-3 font-semibold"
            >
              Sign Up <ArrowRight size={18} />
            </Button>
          </form>

          {/* Toggle back to Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
