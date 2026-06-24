import { ArrowRight, Users } from 'lucide-react';
import Link from 'next/link';

export default function CollaboratorsTeaser() {
  return (
    <section className='py-16 bg-gray-900'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8'>
          <div className='flex items-center gap-4'>
            <div className='h-12 w-12 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0'>
              <Users className='h-6 w-6 text-white' />
            </div>
            <div>
              <h3 className='text-xl font-bold text-white'>
                Trusted Execution Partners
              </h3>
              <p className='text-gray-300 text-sm mt-1'>
                Meet the contractors and collaborators who bring our designs
                to life across Delhi NCR.
              </p>
            </div>
          </div>
          <Link
            href='/collaborators'
            className='w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-semibold px-6 py-3 rounded-full transition-all flex-shrink-0'
          >
            Meet Our Collaborators
            <ArrowRight className='h-4 w-4' />
          </Link>
        </div>
      </div>
    </section>
  );
}
