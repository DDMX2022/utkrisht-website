'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Hammer,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const partners = [
  {
    name: 'Ali Interiors',
    leader: 'Led by Mr. Aarif Ali',
    icon: Hammer,
    description:
      'Ali Interiors is known for practical execution capabilities and strong on-site management across Noida, Greater Noida, and Delhi NCR. With a focus on quality workmanship and timely project delivery, the team specializes in transforming design concepts into well-executed living spaces.',
    strengths: [
      'End-to-end interior execution',
      'Strong site supervision and project coordination',
      'Quality-focused craftsmanship',
      'Timely project completion',
      'Extensive experience in residential interiors',
    ],
  },
  {
    name: 'Avni Interiors',
    leader: 'Led by Mr. Satya Prakash',
    icon: ShieldCheck,
    description:
      'Avni Interiors brings extensive execution expertise and a client-centric approach to interior projects across Noida, Greater Noida, and Delhi NCR. Known for attention to detail and systematic project management, the team works closely with designers and homeowners to ensure every element is executed as envisioned.',
    strengths: [
      'Detail-oriented project execution',
      'Efficient resource and vendor management',
      'High standards of finishing and quality control',
      'Strong communication throughout the project lifecycle',
      'Residential and commercial interior execution experience',
    ],
  },
  {
    name: 'Mr. Irfan',
    leader: 'Interior Execution Specialist',
    icon: Users,
    description:
      'With hands-on experience in interior execution across Noida, Greater Noida, and Delhi NCR, Mr. Irfan contributes valuable practical expertise to project delivery. His focus on workmanship, site coordination, and execution efficiency helps ensure smooth project progress and adherence to quality standards.',
    strengths: [
      'Skilled execution management',
      'Practical problem-solving on site',
      'Coordination of multiple trades and vendors',
      'Focus on quality workmanship',
      'Reliable project support and supervision',
    ],
  },
  {
    name: 'Forever Homes',
    leader: 'Led by Mr. Ankur Garg',
    icon: Building2,
    description:
      'Forever Homes specializes in comprehensive construction and development services across Delhi NCR. From ground-up construction to turnkey project delivery, the organization manages every stage of the building process with a focus on structural quality, functionality, and long-term value.',
    strengths: [
      'End-to-end construction management',
      'Ground-up residential development',
      'Turnkey project execution',
      'Strong project planning and coordination',
      'Focus on quality, durability, and client satisfaction',
      'Integrated approach from construction to final handover',
    ],
  },
];

export default function PartnersCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % partners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goPrev = () => setIndex((i) => (i - 1 + partners.length) % partners.length);
  const goNext = () => setIndex((i) => (i + 1) % partners.length);

  const partner = partners[index];
  const Icon = partner.icon;

  return (
    <div className='relative'>
      <div className='relative overflow-hidden rounded-2xl'>
        <AnimatePresence mode='wait' initial={false}>
          <motion.article
            key={partner.name}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className='bg-white rounded-2xl shadow-lg p-6 sm:p-10'
          >
            <div className='flex items-start gap-4 sm:gap-5 mb-6'>
              <div className='flex h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white'>
                <Icon className='h-6 w-6 sm:h-7 sm:w-7' />
              </div>
              <div>
                <h3 className='text-xl sm:text-2xl font-bold text-gray-900'>
                  {partner.name}
                </h3>
                <p className='text-gray-500 font-medium text-sm sm:text-base'>
                  {partner.leader}
                </p>
              </div>
            </div>

            <p className='text-gray-600 leading-relaxed mb-6 text-sm sm:text-base'>
              {partner.description}
            </p>

            <h4 className='font-semibold text-gray-900 mb-4'>Key Strengths</h4>
            <ul className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              {partner.strengths.map((strength) => (
                <li
                  key={strength}
                  className='flex items-start text-sm sm:text-base text-gray-600'
                >
                  <span className='mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-amber-500' />
                  {strength}
                </li>
              ))}
            </ul>
          </motion.article>
        </AnimatePresence>
      </div>

      {/* Arrows */}
      <button
        type='button'
        onClick={goPrev}
        aria-label='Previous partner'
        className='absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 -translate-x-1/2 sm:-translate-x-full h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 active:text-amber-600 active:scale-90 transition-all'
      >
        <ChevronLeft className='h-5 w-5' />
      </button>
      <button
        type='button'
        onClick={goNext}
        aria-label='Next partner'
        className='absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 translate-x-1/2 sm:translate-x-full h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 active:text-amber-600 active:scale-90 transition-all'
      >
        <ChevronRight className='h-5 w-5' />
      </button>

      {/* Dots */}
      <div className='flex justify-center gap-1.5 mt-6'>
        {partners.map((p, i) => (
          <button
            key={p.name}
            aria-label={`Go to ${p.name}`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-6 bg-gray-900' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
