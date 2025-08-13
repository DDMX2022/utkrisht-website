'use client';

import * as Dialog from '@radix-ui/react-dialog';

import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
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
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
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
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex-shrink-0'>
            <h1 className='text-2xl font-bold text-gray-900'>Utkrisht</h1>
          </div>

          <nav className='hidden md:block'>
            <div className='ml-10 flex items-baseline space-x-8'>
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className='text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 hover:scale-105'
                >
                  {item.name}
                </a>
              ))}
            </div>
          </nav>

          <div className='hidden md:flex items-center gap-3'>
            <Button
              className='bg-gray-900 hover:bg-gray-800 text-white'
              onClick={() => setQuoteOpen(true)}
            >
              Get Quote
            </Button>
          </div>

          <div className='md:hidden'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className='md:hidden bg-white border-t'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className='text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium'
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <Button
              className='w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white'
              onClick={() => {
                setQuoteOpen(true);
                setIsMenuOpen(false);
              }}
            >
              Get Quote
            </Button>
          </div>
        </div>
      )}

      {/* Get Quote Modal */}
      <Dialog.Root open={quoteOpen} onOpenChange={setQuoteOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 z-[140] bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out' />
          <Dialog.Content className='fixed left-1/2 top-1/2 z-[150] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out'>
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
                    className='w-full border rounded px-3 py-2'
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
                    className='w-full border rounded px-3 py-2'
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
                    className='w-full border rounded px-3 py-2'
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
                    className='w-full border rounded px-3 py-2'
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
                  className='w-full border rounded px-3 py-2'
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
                  className='bg-gray-900 hover:bg-gray-800 text-white'
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
