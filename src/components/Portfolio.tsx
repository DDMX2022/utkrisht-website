'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description?: string | null;
  imageUrl?: string | null;
}

const categories = [
  'All',
  'Living Room',
  'Bedroom',
  'Kitchen',
  'Office',
  'Dining Room',
  'Bathroom',
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  async function load(category?: string) {
    setLoading(true);
    setError(null);
    try {
      const qs =
        category && category !== 'All'
          ? `?category=${encodeURIComponent(category)}`
          : '';
      const res = await fetch(`/api/portfolio${qs}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load portfolio');
      const data: PortfolioItem[] = await res.json();
      setItems(data);
    } catch (e: any) {
      setError(e?.message || 'Error loading');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(activeCategory);
  }, [activeCategory]);

  return (
    <section id='projects' className='py-20 bg-gray-50'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Our Projects
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Explore our portfolio of stunning interior design projects that
            showcase our expertise and creativity.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className='flex flex-wrap justify-center gap-4 mb-12'>
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category)}
              className='transition-all duration-300'
            >
              {category}
            </Button>
          ))}
        </div>

        {loading && (
          <div className='text-center text-gray-500'>Loading portfolio...</div>
        )}
        {error && <div className='text-center text-red-600'>{error}</div>}

        {/* Portfolio Grid */}
        {!loading && !error && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {items.length === 0 && (
              <div className='col-span-full text-center text-gray-500'>
                No portfolio items found.
              </div>
            )}
            {items.map((item, index) => (
              <div
                key={item.id}
                className='group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2'
              >
                <div className='relative overflow-hidden'>
                  <img
                    src={item.imageUrl || '/placeholder.svg'}
                    alt={item.title}
                    className='w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110'
                  />
                  <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                    <Button
                      variant='outline'
                      className='border-white text-white hover:bg-white hover:text-gray-900'
                      onClick={() => {
                        setModalIndex(index);
                        setIsModalOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
                <div className='p-6'>
                  <span className='text-sm text-gray-500 font-medium'>
                    {item.category}
                  </span>
                  <h3 className='text-xl font-bold text-gray-900 mt-1 mb-2'>
                    {item.title}
                  </h3>
                  <p className='text-gray-600'>{item.description || ''}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* <div className='text-center mt-12'>
          <Button
            size='lg'
            className='bg-gray-900 hover:bg-gray-800'
            onClick={() => setActiveCategory('All')}
          >
            View All Projects
          </Button>
        </div> */}
      </div>

      {/* Modal */}
      {isModalOpen && modalIndex !== null && items[modalIndex] && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4'>
          <div className='bg-white w-full max-w-3xl rounded-lg overflow-hidden shadow-2xl relative'>
            <button
              onClick={() => setIsModalOpen(false)}
              className='absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-black'
            >
              <X className='h-5 w-5' />
            </button>

            <div className='grid grid-cols-1 md:grid-cols-2'>
              <div className='relative bg-black flex items-center justify-center h-[360px] md:h-[420px]'>
                <img
                  src={items[modalIndex].imageUrl || '/placeholder.svg'}
                  alt={items[modalIndex].title}
                  className='max-w-full max-h-full object-contain'
                />
              </div>

              <div className='p-6 md:p-8 max-h-[420px] overflow-y-auto'>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                  {items[modalIndex].title}
                </h3>
                <p className='text-sm text-gray-500 mb-4'>
                  {items[modalIndex].category}
                </p>
                <p className='text-gray-700 whitespace-pre-line'>
                  {items[modalIndex].description || '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
