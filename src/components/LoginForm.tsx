'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: Props) {
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
    setLoading(false);
    if (res?.error) {
      setError('Invalid credentials');
    } else {
      onSuccess?.();
      router.push('/admin');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      {error && (
        <div className='text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2'>
          {error}
        </div>
      )}
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
  );
}
