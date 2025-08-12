'use client';

import * as Dialog from '@radix-ui/react-dialog';

import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import LoginForm from '@/components/LoginForm';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

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
            <Button className='bg-gray-900 hover:bg-gray-800 text-white'>
              Get Quote
            </Button>
            <Dialog.Root open={loginOpen} onOpenChange={setLoginOpen}>
              <Dialog.Trigger asChild>
                <Button
                  variant='outline'
                  className='border-gray-300 hover:bg-gray-100'
                >
                  Login
                </Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className='fixed inset-0 z-[120] bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out' />
                <Dialog.Content className='fixed left-1/2 top-1/2 z-[130] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out'>
                  <div className='flex items-start justify-between mb-4'>
                    <Dialog.Title className='text-xl font-semibold text-gray-900'>
                      Admin Login
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button className='text-gray-500 hover:text-gray-700'>
                        <X className='h-5 w-5' />
                      </button>
                    </Dialog.Close>
                  </div>
                  <LoginForm onSuccess={() => setLoginOpen(false)} />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
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
            <Button className='w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white'>
              Get Quote
            </Button>
            <Button
              variant='outline'
              className='w-full border-gray-300 hover:bg-gray-100'
              onClick={() => {
                setLoginOpen(true);
                setIsMenuOpen(false);
              }}
            >
              Login
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
