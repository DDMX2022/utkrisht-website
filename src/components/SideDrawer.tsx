'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronRight,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  X,
  Youtube,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MAP_URL = 'https://maps.app.goo.gl/uPzf7nA2CzJhAW3w8?g_st=aw';
const CONTACT_EMAIL = 'utkrisht.interiors@gmail.com';
const PRIMARY_PHONE = '9891347353';
const INSTAGRAM_URL = 'https://www.instagram.com/interiorsbyutkrisht/';
const LINKEDIN_URL = 'https://www.linkedin.com/feed/';
const YOUTUBE_URL = 'https://www.youtube.com/@UtkrishtInteriors';

const quickLinks = [
  { name: 'Home', href: '/#home' },
  { name: 'About Us', href: '/#about' },
  { name: 'Services', href: '/#services' },
  { name: 'Packages', href: '/#packages' },
  { name: 'Projects', href: '/#projects' },
  { name: 'Collaborators', href: '/collaborators' },
  { name: 'Digital Card', href: '/card' },
];

const legalLinks = [
  { name: 'FAQ', href: '/faq' },
  { name: 'Terms of Service', href: '/terms-of-service' },
  { name: 'Privacy Policy', href: '#' },
  { name: 'Refund & Cancellation Policy', href: '#' },
];

export default function SideDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className='fixed inset-0 z-[140] bg-black/50 backdrop-blur-sm'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.div
                className='fixed top-0 right-0 z-[150] h-full w-[82vw] max-w-xs bg-white shadow-2xl flex flex-col focus:outline-none'
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              >
                {/* Drawer header */}
                <div className='flex items-center justify-between px-4 py-3 border-b border-gray-100'>
                  <div>
                    <Dialog.Title className='text-base font-bold text-gray-900 leading-tight'>
                      Utkrisht
                    </Dialog.Title>
                    <p className='text-[10px] text-gray-400 leading-tight'>
                      Interior Design Studio
                    </p>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 active:bg-gray-200 transition-colors'
                      aria-label='Close'
                    >
                      <X className='w-4 h-4' />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Address bar */}
                <a
                  href={MAP_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-start gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs text-gray-500'
                >
                  <MapPin className='h-3.5 w-3.5 mt-0.5 flex-shrink-0' />
                  <span>
                    Plot No. 1, 4th floor - A 405 - Shakti Khand 2, Indirapuram,
                    Ghaziabad, Uttar Pradesh 201014
                  </span>
                </a>

                {/* Scrollable body */}
                <div className='flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-5'>
                  {/* Contact actions */}
                  <div className='flex gap-2'>
                    <a
                      href={`tel:+91${PRIMARY_PHONE}`}
                      className='flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-50 text-amber-700 text-xs font-medium active:bg-amber-100 transition-colors'
                    >
                      <Phone className='h-3.5 w-3.5' /> Call Us
                    </a>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className='flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-50 text-amber-700 text-xs font-medium active:bg-amber-100 transition-colors'
                    >
                      <Mail className='h-3.5 w-3.5' /> Email Us
                    </a>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <p className='text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2'>
                      Quick Links
                    </p>
                    <div className='grid grid-cols-2 gap-1.5'>
                      {quickLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => onOpenChange(false)}
                          className='text-xs text-gray-700 px-3 py-2 rounded-lg bg-gray-50 active:bg-amber-50 active:text-amber-700 transition-colors'
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Follow Us */}
                  <div>
                    <p className='text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2'>
                      Follow Us
                    </p>
                    <div className='flex gap-2'>
                      <a
                        href={INSTAGRAM_URL}
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label='Instagram'
                        className='w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 active:bg-gray-900 active:text-white transition-all'
                      >
                        <Instagram className='h-4 w-4' />
                      </a>
                      <a
                        href={LINKEDIN_URL}
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label='LinkedIn'
                        className='w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 active:bg-gray-900 active:text-white transition-all'
                      >
                        <Linkedin className='h-4 w-4' />
                      </a>
                      <a
                        href={YOUTUBE_URL}
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label='YouTube'
                        className='w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 active:bg-gray-900 active:text-white transition-all'
                      >
                        <Youtube className='h-4 w-4' />
                      </a>
                    </div>
                  </div>

                  {/* Legal */}
                  <div>
                    <p className='text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2'>
                      Legal
                    </p>
                    <div className='space-y-0.5'>
                      {legalLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => onOpenChange(false)}
                          className='flex items-center justify-between text-xs text-gray-500 py-2 active:text-gray-900 transition-colors'
                        >
                          {link.name}
                          <ChevronRight className='h-3.5 w-3.5 text-gray-300' />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className='px-4 pt-3 pb-[calc(72px+env(safe-area-inset-bottom,0px))] border-t border-gray-100 bg-white'>
                  {pathname === '/' ? (
                    <button
                      type='button'
                      onClick={() => {
                        onOpenChange(false);
                        window.dispatchEvent(new CustomEvent('open-contact-form'));
                      }}
                      className='block w-full text-center py-2.5 rounded-xl bg-gray-900 text-white font-semibold text-sm active:bg-gray-800 transition-colors'
                    >
                      Get in Touch
                    </button>
                  ) : (
                    <Link
                      href='/#contact'
                      onClick={() => onOpenChange(false)}
                      className='block w-full text-center py-2.5 rounded-xl bg-gray-900 text-white font-semibold text-sm active:bg-gray-800 transition-colors'
                    >
                      Get in Touch
                    </Link>
                  )}
                  <p className='text-[9px] text-center text-gray-400 mt-2 pb-1'>
                    © 2025 Utkrisht Interiors. All rights reserved.
                  </p>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
