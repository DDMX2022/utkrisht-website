'use client';

import { ArrowRight, Play } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

interface HeroMedia {
  id: string;
  url: string;
}

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroImages, setHeroImages] = useState<HeroMedia[]>([]);

  const fallbackSlides = [
    {
      image: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762001419/Vastu_Consultancy_xlt63e.jpg',
      title: 'Transforming Spaces, Elevating Lifestyles',
    },
    {
      image: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762001418/Exterior_Design_l6y2gw.jpg',
      title: 'Innovative Design Solutions',
    },
    {
      image: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762001535/Int._Desg_yadfry.jpg',
      title: 'Vastu-Compliant Interiors',
    },
  ];

  const slides = heroImages.length
    ? heroImages.map((m, idx) => ({
        image: m.url,
        title: fallbackSlides[idx % fallbackSlides.length].title,
      }))
    : fallbackSlides;

  useEffect(() => {
    (async () => {
      try {
        let res = await fetch('/api/media?category=Hero&folder=utkrisht/hero', {
          cache: 'no-store',
        });
        let list = res.ok ? await res.json() : [];
        if (!Array.isArray(list) || list.length === 0) {
          // Fallback to older records that have category only (folder null)
          res = await fetch('/api/media?category=Hero', { cache: 'no-store' });
          list = res.ok ? await res.json() : [];
        }
        setHeroImages(list);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section
      id='home'
      className='relative h-screen flex items-center justify-center overflow-hidden'
    >
      {/* Background Slideshow */}
      <div className='absolute inset-0'>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image || '/placeholder.svg'}
              alt={slide.title}
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-black/50'></div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className='relative z-10 text-center text-white max-w-4xl mx-auto px-4'>
        <h1 className='text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up'>
          Transforming Spaces,
          <span className='block text-gray-300'>Elevating Lifestyles</span>
        </h1>
        <p className='text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in-up animation-delay-200'>
          Innovative, Vastu-Compliant & Turnkey Interior Design Solutions for
          Modern Living
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400'>
          <Button
            size='lg'
            className='bg-white text-gray-900 hover:bg-gray-100 group'
          >
            Explore Our Work
            <ArrowRight className='ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform' />
          </Button>
          <Button
            size='lg'
            variant='outline'
            className='border-white text-white hover:bg-white hover:text-gray-900 group bg-transparent'
          >
            <Play className='mr-2 h-5 w-5' />
            Get Free Consultation
          </Button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2'>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}
