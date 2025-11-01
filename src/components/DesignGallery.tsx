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
export const galleryData: MediaItem[] = [
  {
    id: '1',
    url: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003641/pexels-thisispav-29383010_oiw9ah.jpg',
    title: 'Luxury Villa Exterior Render',
    category: '3D Renders',
    folder: 'utkrisht/gallery',
  },
  {
    id: '2',
    url: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003639/pexels-the-ghazi-2152398165-33314761_atdllf.jpg',
    title: 'Modern Living Room Visualization',
    category: '3D Renders',
    folder: 'utkrisht/gallery',
  },
  {
    id: '3',
    url: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003638/pexels-the-ghazi-2152398165-33167283_xuyitl.jpg',
    title: 'Open Kitchen & Dining Concept',
    category: '3D Renders',
    folder: 'utkrisht/gallery',
  },
  {
    id: '4',
    url: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003636/pexels-the-ghazi-2152398165-33167281_pxvens.jpg',
    title: 'Sunlit Bedroom Interior Render',
    category: '3D Renders',
    folder: 'utkrisht/gallery',
  },
  {
    id: '5',
    url: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003635/pexels-the-ghazi-2152398165-32473240_ixy4wk.jpg',
    title: 'Contemporary Office Visualization',
    category: '3D Renders',
    folder: 'utkrisht/gallery',
  },
  {
    id: '6',
    url: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003633/pexels-the-ghazi-2152398165-32421761_bt3lxl.jpg',
    title: 'Elegant Hotel Lobby Design',
    category: '3D Renders',
    folder: 'utkrisht/gallery',
  },
  {
    id: '7',
    url: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003632/pexels-the-ghazi-2152398165-32421758_l4ihub.jpg',
    title: 'Industrial Loft Render',
    category: '3D Renders',
    folder: 'utkrisht/gallery',
  },
  {
    id: '8',
    url: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003630/pexels-scene-design-144978225-14512058_swko4n.jpg',
    title: 'Architectural Facade Lighting Concept',
    category: '3D Renders',
    folder: 'utkrisht/gallery',
  },
  {
    id: '9',
    url: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003629/pexels-pu-ca-adryan-163345030-32383875_jp9zj7.jpg',
    title: 'Luxury Bathroom Visualization',
    category: '3D Renders',
    folder: 'utkrisht/gallery',
  },
  {
    id: '10',
    url: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003627/pexels-pu-ca-adryan-163345030-32246936_hgz5dr.jpg',
    title: 'Minimalist Bedroom Design Render',
    category: '3D Renders',
    folder: 'utkrisht/gallery',
  },
  {
    id: '11',
    url: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003625/pexels-pu-ca-adryan-163345030-31525131_pmahxy.jpg',
    title: 'Modern Kitchen Interior',
    category: '3D Renders',
    folder: 'utkrisht/gallery',
  },
  {
    id: '12',
    url: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003624/pexels-perqued-17840533_uhlnwh.jpg',
    title: '3D Concept Apartment Layout',
    category: '3D Renders',
    folder: 'utkrisht/gallery',
  },
  {
    id: '13',
    url: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003624/pexels-perqued-17840536_wzmz0o.jpg',
    title: 'Exterior Night Render',
    category: '3D Renders',
    folder: 'utkrisht/gallery',
  },
  {
    id: '14',
    url: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003621/pexels-perqued-10919437_qqygki.jpg',
    title: 'Urban Penthouse Visualization',
    category: '3D Renders',
    folder: 'utkrisht/gallery',
  },
  {
    id: '15',
    url: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003621/pexels-paulseling-20551757_vzh1h5.jpg',
    title: 'Scandinavian Living Area Render',
    category: '3D Renders',
    folder: 'utkrisht/gallery',
  },
  {
    id: '16',
    url: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003620/pexels-maruf-ahammed-381941310-15575713_iw7u1a.jpg',
    title: 'Concept Store Interior',
    category: '3D Renders',
    folder: 'utkrisht/gallery',
  },
  {
    id: '17',
    url: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003616/pexels-jivitharsan-suresh-3647340-30871314_bqz9e8.jpg',
    title: 'Studio Apartment Render',
    category: '3D Renders',
    folder: 'utkrisht/gallery',
  },
  {
    id: '18',
    url: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003616/pexels-jivitharsan-suresh-3647340-30871307_mjvm1u.jpg',
    title: 'Futuristic Concept Interior',
    category: '3D Renders',
    folder: 'utkrisht/gallery',
  },
  {
    id: '19',
    url: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003615/pexels-jivitharsan-suresh-3647340-30871309_u9sqa4.jpg',
    title: 'Luxury Dining Space Render',
    category: '3D Renders',
    folder: 'utkrisht/gallery',
  },
  {
    id: '20',
    url: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003614/pexels-carlos-montelara-3450804-6032597_nfoc2c.jpg',
    title: 'Corporate Lobby Visualization',
    category: '3D Renders',
    folder: 'utkrisht/gallery',
  },
  {
    id: '21',
    url: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003613/pexels-arutnevv-32485942_th9sxg.jpg',
    title: 'Architectural Night Scene Render',
    category: '3D Renders',
    folder: 'utkrisht/gallery',
  },
];

export default function DesignGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    // 'All',
    // 'Living Room',
    // 'Bedroom',
    // 'Kitchen',
    // 'Commercial',
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
     const filteredItems =
  activeCategory === 'All'
    ? galleryData
    : galleryData.filter((item) => item.category === activeCategory);
setItems(filteredItems);

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
