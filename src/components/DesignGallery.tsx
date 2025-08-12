'use client';

import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

interface MediaItem {
  id: string;
  url: string;
  category?: string | null;
  title?: string | null;
  folder?: string | null;
}

export default function DesignGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    'All',
    'Living Room',
    'Bedroom',
    'Kitchen',
    'Commercial',
    '3D Renders',
  ];

  async function load(category?: string) {
    setLoading(true);
    setError(null);
    try {
      const base =
        '/api/media?folder=' + encodeURIComponent('utkrisht/gallery');
      const qs =
        category && category !== 'All'
          ? `&category=${encodeURIComponent(category)}`
          : '';
      const res = await fetch(base + qs, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load gallery');
      const data: MediaItem[] = await res.json();
      setItems(data);
    } catch (e: any) {
      setError(e?.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(activeCategory);
  }, [activeCategory]);

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

    const elements = sectionRef.current?.querySelectorAll('.gallery-item');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <section id='gallery' ref={sectionRef} className='py-20 bg-gray-50'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Design Gallery
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Explore our portfolio of stunning interior transformations
          </p>
        </div>

        {/* Category Filter */}
        <div className='flex flex-wrap justify-center gap-4 mb-12'>
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category)}
              className={
                activeCategory === category
                  ? 'bg-gray-900 hover:bg-gray-800 text-white'
                  : 'hover:bg-gray-100'
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {loading && (
          <div className='text-center text-gray-500'>Loading gallery...</div>
        )}
        {error && <div className='text-center text-red-600'>{error}</div>}

        {/* Gallery Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {!loading && items.length === 0 && (
            <div className='col-span-full text-center text-gray-500'>
              No images yet. Upload from Admin.
            </div>
          )}
          {items.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className='gallery-item opacity-0 group cursor-pointer'
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className='relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300'>
                <img
                  src={item.url || '/placeholder.svg'}
                  alt={item.title || item.category || 'Gallery image'}
                  className='w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300'
                />
                <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                  <div className='text-center text-white'>
                    <h3 className='text-lg font-semibold mb-2'>
                      {item.title || '—'}
                    </h3>
                    <p className='text-sm text-gray-200'>
                      {item.category || 'Gallery'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
