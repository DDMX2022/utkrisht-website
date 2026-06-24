'use client';

import { Home, Image, Layers, Send, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useScrollSpy } from '@/hooks/useScrollSpy';

const SECTION_IDS = ['home', 'about', 'services', 'packages', 'projects', 'contact'];

const NAV_ITEMS = [
  { name: 'Home', href: '/#home', sectionId: 'home', icon: Home },
  { name: 'Services', href: '/#services', sectionId: 'services', icon: Wrench },
  { name: 'Projects', href: '/#projects', sectionId: 'projects', icon: Image },
  { name: 'Packages', href: '/#packages', sectionId: 'packages', icon: Layers },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const activeId = useScrollSpy(SECTION_IDS, pathname === '/');

  return (
    <nav
      className='fixed bottom-0 inset-x-0 z-[100] md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 pb-safe'
      aria-label='Primary'
    >
      <div className='flex h-bottom-nav'>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === '/' && activeId === item.sectionId;
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} className='relative flex-1'>
              <motion.div
                whileTap={{ scale: 0.88 }}
                className='relative flex h-full flex-col items-center justify-center gap-0.5'
              >
                {isActive && (
                  <motion.div
                    layoutId='bottomNavActivePill'
                    className='absolute top-1 h-1 w-8 rounded-full bg-gray-900'
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    isActive ? 'text-gray-900' : 'text-gray-400'
                  }`}
                />
                <span
                  className={`text-[11px] font-medium transition-colors ${
                    isActive ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {item.name}
                </span>
              </motion.div>
            </Link>
          );
        })}

        {pathname === '/' ? (
          <button
            type='button'
            onClick={() =>
              window.dispatchEvent(new CustomEvent('open-contact-form'))
            }
            className='relative flex-1 flex h-full flex-col items-center justify-center gap-0.5 active:scale-90 transition-transform'
            aria-label='Get a Quote'
          >
            <Send className='h-5 w-5 text-amber-600' />
            <span className='text-[11px] font-semibold text-amber-600'>
              Get a Quote
            </span>
          </button>
        ) : (
          <Link
            href='/#contact'
            className='relative flex-1 flex h-full flex-col items-center justify-center gap-0.5 active:scale-90 transition-transform'
            aria-label='Get a Quote'
          >
            <Send className='h-5 w-5 text-amber-600' />
            <span className='text-[11px] font-semibold text-amber-600'>
              Get a Quote
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
