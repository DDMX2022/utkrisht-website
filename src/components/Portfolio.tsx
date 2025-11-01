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
  'Commercial',
  // 'Dining Room',
  // 'Bathroom',
];

const portfolioData: PortfolioItem[] = [
{
  id: '1',
  title: 'Cozy Minimalist Living Room',
  category: 'Living Room',
  description: 'A warm and inviting minimalist living room styled with soft neutral tones, plush seating, and organic textures for a calm atmosphere.',
  imageUrl: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762001985/pexels-vika-glitter-392079-1648768_c7mtfl.jpg',
},
{
  id: '2',
  title: 'Modern Luxury Living Room',
  category: 'Living Room',
  description: 'An elegant living room featuring contemporary furniture, statement lighting, and a balanced blend of comfort and sophistication.',
  imageUrl: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762001984/pexels-houzlook-3797991_nrnff3.jpg',
},
{
  id: '3',
  title: 'Serene Natural Living Space',
  category: 'Living Room',
  description: 'A tranquil living area with earthy hues, soft fabrics, and abundant natural light that creates a relaxed and peaceful setting.',
  imageUrl: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762001983/pexels-fotoaibe-1571471_cj7yl5.jpg',
},
{
  id: '4',
  title: 'Contemporary Living Elegance',
  category: 'Living Room',
  description: 'A refined living room design that pairs modern furniture with artistic décor and cozy lighting for everyday sophistication.',
  imageUrl: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762001983/pexels-fotoaibe-1571459_dykcja.jpg',
},
{
  id: '6',
  title: 'Compact Urban Living Room',
  category: 'Living Room',
  description: 'A space-efficient living room designed for modern apartments, featuring multifunctional furniture and smart layout optimization.',
  imageUrl: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762001982/pexels-fotoaibe-1571453_rgyvgc.jpg',
},

{
  id: '7',
  title: 'Modern Modular Kitchen',
  category: 'Kitchen',
  description: 'A sleek modular kitchen featuring matte cabinets, clean lines, and modern appliances for efficient cooking.',
  imageUrl: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762002580/pexels-asphotograpy-94865_oipyoz.jpg',
},
{
  id: '8',
  title: 'Sunlit Contemporary Kitchen',
  category: 'Kitchen',
  description: 'Bright and airy kitchen with natural light, elegant countertops, and minimalist décor for an inviting cooking space.',
  imageUrl: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762002580/pexels-pixabay-279648_igvit6.jpg',
},
{
  id: '9',
  title: 'Elegant Open Kitchen',
  category: 'Kitchen',
  description: 'An open-plan kitchen seamlessly connected to the dining area, designed with marble surfaces and ambient lighting.',
  imageUrl: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762002579/pexels-hakimsatoso-3634740_h5lhgj.jpg',
},
{
  id: '10',
  title: 'Rustic Wooden Kitchen',
  category: 'Kitchen',
  description: 'A cozy rustic kitchen with reclaimed wood accents, vintage textures, and a warm earthy color palette.',
  imageUrl: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762002579/pexels-alex-qian-1180283-2343467_izthu3.jpg',
},
{
  id: '11',
  title: 'Luxury Chef’s Kitchen',
  category: 'Kitchen',
  description: 'A high-end kitchen space featuring premium finishes, stone countertops, and modern lighting for gourmet cooking.',
  imageUrl: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762002578/pexels-arina-krasnikova-6654105_hpgxyy.jpg',
},

  {
  id: '13',
  title: 'Modern Office Lobby',
  category: 'Commercial',
  description: 'A sleek corporate lobby with polished finishes, warm lighting, and a welcoming ambiance for clients and guests.',
  imageUrl: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762002913/pexels-pixabay-263209_b5tydq.jpg',
},
{
  id: '14',
  title: 'Contemporary Café Interior',
  category: 'Commercial',
  description: 'A vibrant café space featuring wooden textures, open seating, and cozy lighting for a relaxed social atmosphere.',
  imageUrl: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762002911/pexels-marta-dzedyshko-1042863-9785778_s0atgz.jpg',
},
{
  id: '15',
  title: 'Retail Showroom Design',
  category: 'Commercial',
  description: 'A bright, spacious showroom layout emphasizing product display and seamless customer flow with elegant design elements.',
  imageUrl: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762002912/pexels-pixabay-236730_bnx9rs.jpg',
},
{
  id: '16',
  title: 'Executive Conference Room',
  category: 'Commercial',
  description: 'A modern boardroom designed for productivity and collaboration, featuring ergonomic furniture and acoustic paneling.',
  imageUrl: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762002911/pexels-mikhail-nilov-9300731_aurymy.jpg',
},
{
  id: '17',
  title: 'High-End Restaurant Interior',
  category: 'Commercial',
  description: 'An elegant fine-dining environment blending ambient lighting, textured walls, and premium furniture for an upscale experience.',
  imageUrl: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762002910/pexels-kseniachernaya-8535622_jueu3a.jpg',
},
{
  id: '18',
  title: 'Industrial Workspace Loft',
  category: 'Commercial',
  description: 'A creative open workspace with exposed brick, steel elements, and collaborative zones inspired by industrial aesthetics.',
  imageUrl: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762002910/pexels-atbo-66986-245240_et6wes.jpg',
},
{
  id: '19',
  title: 'Modern Minimalist Bedroom',
  category: 'Bedroom',
  description: 'A serene minimalist bedroom with soft lighting, neutral colors, and sleek furniture for a peaceful retreat.',
  imageUrl: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003184/pexels-pixabay-279746_ptddpv.jpg',
},
{
  id: '20',
  title: 'Classic Wooden Bedroom',
  category: 'Bedroom',
  description: 'A timeless bedroom featuring natural wood textures, cozy fabrics, and warm tones for an inviting atmosphere.',
  imageUrl: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003182/pexels-pixabay-271624_yjqase.jpg',
},
{
  id: '21',
  title: 'Luxury Master Suite',
  category: 'Bedroom',
  description: 'An opulent master bedroom showcasing premium materials, accent lighting, and a sophisticated design aesthetic.',
  imageUrl: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003181/pexels-marywhitneyph-90317_jsufk8.jpg',
},
{
  id: '22',
  title: 'Coastal Chic Bedroom',
  category: 'Bedroom',
  description: 'A bright and airy coastal-style bedroom with whitewashed tones, ocean-inspired décor, and natural fabrics.',
  imageUrl: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003180/pexels-marywhitneyph-90319_ekbajp.jpg',
},
{
  id: '23',
  title: 'Urban Apartment Bedroom',
  category: 'Bedroom',
  description: 'A contemporary bedroom with a compact layout, modern finishes, and clever storage for city living.',
  imageUrl: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003179/pexels-lisa-anna-901356985-19899055_tcfcpi.jpg',
},
{
  id: '24',
  title: 'Bohemian Style Bedroom',
  category: 'Bedroom',
  description: 'An artistic bedroom full of character, layered textiles, greenery, and handcrafted décor elements.',
  imageUrl: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003178/pexels-lisa-anna-901356985-19866405_hcnsiw.jpg',
},
{
  id: '25',
  title: 'Scandinavian Comfort Bedroom',
  category: 'Bedroom',
  description: 'A cozy Nordic-inspired bedroom featuring light wood finishes, neutral hues, and minimalist design for calm living.',
  imageUrl: 'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003177/pexels-l-ng-studio-3030613-16648029_flnir8.jpg',
},


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
      const filtered =
  category && category !== 'All'
    ? portfolioData.filter((item) => item.category === category)
    : portfolioData;

setItems(filtered);

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
