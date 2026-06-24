import { ArrowRight, HelpCircle } from 'lucide-react';

import BottomNav from '@/components/BottomNav';
import FaqAccordion from '@/components/FaqAccordion';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const metadata = {
  title: 'FAQ | Utkrisht Interiors',
  description:
    'Frequently asked questions about Utkrisht Interiors’ design packages, pricing, timelines, and consultation process.',
};

export default function FaqPage() {
  return (
    <main className='bg-gray-50'>
      <Header />
      <BottomNav />

      <section className='pt-28 pb-12 sm:pb-16 bg-white'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700'>
            <HelpCircle className='h-4 w-4' />
            Frequently Asked Questions
          </div>
          <h1 className='text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4'>
            Got Questions?
          </h1>
          <p className='text-base sm:text-xl text-gray-600 max-w-2xl mx-auto'>
            Answers to the questions we hear most about our packages,
            pricing, and process.
          </p>
        </div>
      </section>

      <section className='py-12 sm:py-16'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl'>
          <FaqAccordion />

          <div className='mt-10 text-center bg-gray-900 rounded-2xl p-6 sm:p-8'>
            <p className='text-white font-semibold text-lg sm:text-xl mb-2'>
              Still have questions?
            </p>
            <p className='text-gray-300 text-sm sm:text-base mb-5'>
              Reach out and our team will get back to you within 1–2
              business days.
            </p>
            <a
              href='/#contact'
              className='inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-semibold px-6 py-3 rounded-full transition-all'
            >
              Contact Us
              <ArrowRight className='h-4 w-4' />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
