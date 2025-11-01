'use client';

import { Eye, Target } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

export default function AboutUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const [aboutImg, setAboutImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            entry.target.classList.remove('opacity-0');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.fade-in-element');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Fetch About image (public endpoint)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/about?limit=1', { cache: 'no-store' });
        if (!res.ok) return;
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0) setAboutImg("https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762001168/About_us_gbseug.jpg");
      } catch (err) {
        console.error('Failed to load About image', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
const AboutImg = "https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762001168/About_us_gbseug.jpg";
  return (
    <section id='about' ref={sectionRef} className='py-20 bg-white'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          <div className='fade-in-element opacity-0'>
            <img
              src={AboutImg || '/placeholder.svg?height=600&width=800'}
              alt='About Utkrisht Interiors'
              className='rounded-lg shadow-xl'
            />
            {!AboutImg && !loading && (
              <p className='mt-2 text-sm text-gray-500'>
                Upload an About image from the admin panel.
              </p>
            )}
          </div>

          <div className='fade-in-element opacity-0'>
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
              Your Vision, Our Expertise
            </h2>
            <p className='text-lg text-gray-600 mb-6 leading-relaxed'>
              At Utkrisht, we believe interior design is more than
              aesthetics—it's about creating spaces that resonate with the soul.
              Founded with a passion for functional and beautiful environments,
              we specialize in residential, commercial, and turnkey projects.
            </p>
            <p className='text-lg text-gray-600 mb-8 leading-relaxed'>
              We bring spaces to life with photo-realistic 3D renders, detailed
              working drawings, and on-site execution. Whether it's a cozy home,
              a modern office, or a retail setup, we manage everything from
              concept to completion.
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
              <div className='flex items-start space-x-4'>
                <div className='flex-shrink-0'>
                  <Target className='h-8 w-8 text-gray-900' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-2'>Mission</h3>
                  <p className='text-gray-600'>
                    To make every space elegant, efficient, and emotionally
                    connected.
                  </p>
                </div>
              </div>

              <div className='flex items-start space-x-4'>
                <div className='flex-shrink-0'>
                  <Eye className='h-8 w-8 text-gray-900' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-2'>Vision</h3>
                  <p className='text-gray-600'>
                    To be a leading name in India for delivering value-based,
                    sustainable interior solutions.
                  </p>
                </div>
              </div>
            </div>

            <Button
              size='lg'
              className='bg-gray-900 hover:bg-gray-800 text-white'
            >
              Learn More About Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
