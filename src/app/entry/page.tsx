'use client';

import { signIn, useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EntryPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/admin');
    }
  }, [status, router]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-6'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Welcome Back
          </h1>
          <p className='text-gray-600'>Sign in to manage your content.</p>
        </div>
        <div className='space-y-4'>
          <Button
            onClick={() => router.push('/login')}
            className='w-full bg-gray-900 hover:bg-gray-800'
          >
            Go to Login
          </Button>
        </div>
      </div>
    </div>
  );
}
