import { ArrowRight, CheckCircle2, Home, Users } from 'lucide-react';

import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PartnersCarousel from '@/components/PartnersCarousel';

export const metadata = {
  title: 'Collaborators | Utkrisht Interiors',
  description:
    'Trusted partners and collaborators working with Utkrisht Interiors across design, execution, and construction projects.',
};

const collaborationPillars = [
  {
    title: 'Design Vision',
    description:
      'Utkrisht Interiors defines the concept, planning, material direction, and client experience.',
  },
  {
    title: 'Execution Strength',
    description:
      'Specialist partners help manage site work, vendor coordination, finishing, and timelines.',
  },
  {
    title: 'Complete Delivery',
    description:
      'Together, the network supports projects from concept development to final handover.',
  },
];

export default function CollaboratorsPage() {
  return (
    <main className='bg-white'>
      <Header transparent />
      <BottomNav />

      <section className='relative min-h-[72vh] flex items-center overflow-hidden'>
        <div className='absolute inset-0'>
          <img
            src='https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762001535/Int._Desg_yadfry.jpg'
            alt='Collaborative interior design workspace'
            className='h-full w-full object-cover'
          />
          <div className='absolute inset-0 bg-black/60' />
        </div>

        <div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20'>
          <div className='max-w-4xl text-white'>
            <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm'>
              <Users className='h-4 w-4' />
              Collaborative Design Network
            </div>
            <h1 className='text-4xl sm:text-5xl md:text-7xl font-bold mb-6'>
              Collaborators
            </h1>
            <p className='text-base sm:text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl'>
              At Utkrisht Interiors, our goal goes beyond building our own
              brand name. We are passionate about designing dream homes and
              creating spaces that truly reflect our clients&apos; vision,
              regardless of which brand ultimately receives the credit.
            </p>
          </div>
        </div>
      </section>

      <section className='py-20 bg-white'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-start'>
            <div>
              <div className='flex items-center gap-3 mb-6'>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gray-900 text-white'>
                  <Home className='h-6 w-6' />
                </div>
                <h2 className='text-4xl md:text-5xl font-bold text-gray-900'>
                  Client-first partnerships
                </h2>
              </div>
              <p className='text-lg text-gray-600 leading-relaxed'>
                To ensure our expertise reaches as many people as possible, we
                have proudly partnered with multiple brands and organizations.
                These collaborations allow us to contribute our design skills to
                a wider range of projects while maintaining the same commitment
                to quality, creativity, and client satisfaction that defines
                Utkrisht Interiors.
              </p>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
              {collaborationPillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className='rounded-lg border border-gray-200 bg-gray-50 p-6'
                >
                  <CheckCircle2 className='h-7 w-7 text-gray-900 mb-4' />
                  <h3 className='font-semibold text-gray-900 mb-2'>
                    {pillar.title}
                  </h3>
                  <p className='text-sm text-gray-600 leading-relaxed'>
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='py-20 bg-gray-50'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
              Our Trusted Partners
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              Great design is built on strong collaborations with professionals
              and organizations who share our commitment to quality,
              transparency, and client satisfaction.
            </p>
          </div>

          <div className='max-w-3xl mx-auto px-6 sm:px-10'>
            <PartnersCarousel />
          </div>
        </div>
      </section>

      <section className='py-20 bg-gray-900 text-white'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-10 items-center'>
            <div className='lg:col-span-2'>
              <h2 className='text-4xl md:text-5xl font-bold mb-6'>
                A Collaborative Approach
              </h2>
              <p className='text-lg text-gray-300 leading-relaxed'>
                Through these partnerships, Utkrisht Interiors combines
                innovative design with reliable execution and construction
                expertise. This collaborative network enables us to offer
                clients a seamless experience from concept development and
                interior design to execution, construction, and final handover,
                ensuring every dream home is brought to life with precision and
                care.
              </p>
            </div>
            <div className='flex lg:justify-end'>
              <a
                href='/#contact'
                className='inline-flex items-center rounded-lg bg-white px-6 py-3 font-semibold text-gray-900 transition-all active:scale-95 hover:bg-gray-100'
              >
                Start a Project
                <ArrowRight className='ml-2 h-5 w-5' />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
