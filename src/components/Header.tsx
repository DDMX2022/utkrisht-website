'use client';

import * as Dialog from '@radix-ui/react-dialog';

import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import SideDrawer from '@/components/SideDrawer';

export default function Header({
  transparent = false,
}: {
  /** Set when the page renders a dark hero directly behind the header */
  transparent?: boolean;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const showLightText = transparent && !isScrolled;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false); // NEW
  const [submitting, setSubmitting] = useState(false); // NEW
  const [formError, setFormError] = useState<string | null>(null); // NEW
  const [formSuccess, setFormSuccess] = useState(false); // NEW
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  }); // NEW

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/#home' },
    { name: 'About', href: '/#about' },
    { name: 'Services', href: '/#services' },
    { name: 'Packages', href: '/#packages' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Collaborators', href: '/collaborators' },
    { name: 'Contact', href: '/#contact' },
  ];

  async function submitQuote(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFormSuccess(false);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'Get Quote (Header)' }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || 'Something went wrong. Please try again.');
      }
      setFormSuccess(true);
      setForm({ name: '', email: '', phone: '', service: '', message: '' });
    } catch (err: any) {
      setFormError(err?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <header
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        showLightText
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md shadow-lg'
      }`}
    >
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex-shrink-0'>
            <h1
              className={`text-2xl font-bold transition-colors duration-300 ${
                showLightText ? 'text-white' : 'text-gray-900'
              }`}
            >
              Utkrisht
            </h1>
          </div>

          <nav className='hidden md:block'>
            <div className='ml-8 flex items-baseline space-x-4 lg:space-x-6'>
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`px-2 py-2 text-sm font-medium transition-colors duration-200 hover:scale-105 ${
                    showLightText
                      ? 'text-white/90 hover:text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </nav>

          <div className='hidden md:flex items-center gap-3'>
            <Button
              className='bg-amber-500 hover:bg-amber-600 text-white'
              onClick={() => setQuoteOpen(true)}
            >
              Get Quote
            </Button>
          </div>

          <button
            type='button'
            onClick={() => setDrawerOpen(true)}
            className={`md:hidden w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
              showLightText
                ? 'bg-white/10 active:bg-white/20'
                : 'bg-gray-900/5 active:bg-gray-900/10'
            }`}
            aria-label='Open menu'
          >
            <Menu
              className={`h-5 w-5 transition-colors ${
                showLightText ? 'text-white' : 'text-gray-900'
              }`}
            />
          </button>

        </div>
      </div>

      <SideDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />

      {/* Get Quote Modal */}
      <Dialog.Root open={quoteOpen} onOpenChange={setQuoteOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 z-[140] bg-black/60 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0' />
          <Dialog.Content className='fixed left-1/2 top-1/2 z-[150] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'>
            <div className='flex items-start justify-between mb-4'>
              <Dialog.Title className='text-xl font-semibold text-gray-900'>
                Request a Quote
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className='text-gray-500 hover:text-gray-700'>
                  <X className='h-5 w-5' />
                </button>
              </Dialog.Close>
            </div>
            <form onSubmit={submitQuote} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Name *
                  </label>
                  <input
                    required
                    className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors'
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Email *
                  </label>
                  <input
                    type='email'
                    required
                    className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors'
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Phone
                  </label>
                  <input
                    className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors'
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Service
                  </label>
                  <select
                    className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors'
                    value={form.service}
                    onChange={(e) =>
                      setForm({ ...form, service: e.target.value })
                    }
                  >
                    <option value=''>Select</option>
                    <option>Residential Design</option>
                    <option>Commercial Design</option>
                    <option>Turnkey Project</option>
                    <option>Renovation</option>
                  </select>
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors'
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                />
              </div>
              {formError && (
                <div className='text-sm text-red-600'>{formError}</div>
              )}
              {formSuccess && (
                <div className='text-sm text-green-600'>
                  Sent successfully. We will contact you shortly.
                </div>
              )}
              <div className='flex justify-end gap-3 pt-2'>
                <Dialog.Close asChild>
                  <Button variant='outline'>Close</Button>
                </Dialog.Close>
                <Button
                  type='submit'
                  disabled={submitting}
                  className='bg-amber-500 hover:bg-amber-600 text-white'
                >
                  {submitting ? 'Sending...' : 'Send Request'}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}
