'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    console.log('[LOGIN] signIn result', res);
    setLoading(false);
    if (res?.error) {
      setError(res.error || 'Invalid credentials');
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='w-full max-w-md bg-white shadow-lg rounded-lg p-8'>
        <h1 className='text-2xl font-bold text-gray-900 mb-6 text-center'>
          Admin Login
        </h1>
        {error && (
          <div className='mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2'>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none'
              placeholder='admin@example.com'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none'
              placeholder='••••••••'
            />
          </div>
          <Button
            type='submit'
            className='w-full bg-gray-900 hover:bg-gray-800'
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
