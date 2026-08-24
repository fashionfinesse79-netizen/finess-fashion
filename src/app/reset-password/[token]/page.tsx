'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const params = useParams();
  const token = params?.token as string;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to reset password. The link may have expired or is invalid.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-[#FAF6F0] p-8 border border-[#58111A]/15 shadow-sm space-y-6">
        <div className="text-center">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">
            ATELIER SECURITY
          </span>
          <h1 className="font-serif-luxury text-3xl text-[#58111A] mt-1">
            NEW CREDENTIALS
          </h1>
          <p className="text-xs text-[#7A3B43] mt-2 font-light">
            Set your new secure access credentials below to access your account.
          </p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="bg-[#58111A]/5 text-[#58111A] text-xs border border-[#58111A]/15 p-4 uppercase tracking-wider font-semibold leading-relaxed">
              Your password has been reset successfully. You can now use your new credentials to log in.
            </div>
            <Link
              href="/account"
              className="block w-full py-3.5 bg-[#58111A] text-[#FAF6F0] text-xs text-center uppercase tracking-[0.2em] font-semibold hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors"
            >
              SIGN IN TO PORTAL
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 text-xs border border-red-200 p-3 font-semibold uppercase tracking-wider">
                {error}
              </div>
            )}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#7A3B43] font-semibold mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#58111A]/15 text-xs text-[#58111A] focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#7A3B43] font-semibold mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#58111A]/15 text-xs text-[#58111A] focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#58111A] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors disabled:opacity-50"
            >
              {loading ? 'RESETTING...' : 'UPDATE PASSWORD'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
