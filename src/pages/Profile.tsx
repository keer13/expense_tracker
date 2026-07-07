import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters').max(30, 'Name must be under 30 characters'),
});

type ProfileInput = z.infer<typeof profileSchema>;

export const Profile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
    },
  });

  const onSubmit = async (data: ProfileInput) => {
    setSuccessMsg(null);
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await updateUserProfile(data.displayName);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12 select-none">
      {/* Header Area */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          User Profile
        </h2>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Manage your personal details and account configurations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Column: Visual details card */}
        <Card className="md:col-span-1 text-center py-8 flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center font-bold text-3xl text-blue-600 dark:text-blue-400 shadow-md">
            {user?.displayName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {user?.displayName || 'User'}
            </h3>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">
              Member
            </p>
          </div>
          <div className="w-full border-t border-slate-100 dark:border-slate-800/80 pt-4.5 text-xs text-left px-2 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-widest text-[10px]">Email ID</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold truncate">{user?.email}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-widest text-[10px]">User Reference ID</span>
              <span className="text-slate-800 dark:text-slate-200 font-mono text-[10px] break-all select-all">{user?.uid}</span>
            </div>
          </div>
        </Card>

        {/* Right Column: Profile modification form */}
        <Card className="md:col-span-2 p-8 flex flex-col gap-5">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Account Details</h3>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Edit the fields you wish to update</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5.5 mt-2">
            
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

            {/* Display Name Input */}
            <Input
              id="displayName"
              type="text"
              label="Full Name / Display Name"
              placeholder="e.g. Alex Johnson"
              icon={User}
              error={errors.displayName?.message}
              {...register('displayName')}
            />

            {/* Read-only Email Field */}
            <div className="w-full flex flex-col gap-1.5 text-left opacity-60">
              <label className="text-sm font-medium text-slate-500">
                Email Address (Cannot be modified)
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full py-2.5 pl-10.5 pr-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-500 cursor-not-allowed text-base"
                />
              </div>
            </div>

            {/* Actions buttons */}
            <div className="flex items-center justify-end border-t border-slate-100 dark:border-slate-800/80 pt-5 mt-2">
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="px-6 font-semibold"
              >
                Update Profile
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
