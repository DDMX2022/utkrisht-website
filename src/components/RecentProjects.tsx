'use client';

import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ProjectDto {
  id: string;
  title: string;
  description?: string | null;
  summary?: string | null;
  content?: string | null;
  category: string;
  createdAt: string;
  year?: string | null;
  location?: string | null;
  images?: { id: string; url: string; order: number }[];
}

const fallbackProjectSeeds: {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
}[] = [
  {
    id: '1',
    title: 'Cozy Minimalist Living Room',
    category: 'Living Room',
    description:
      'A warm and inviting minimalist living room styled with soft neutral tones, plush seating, and organic textures for a calm atmosphere.',
    imageUrl:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762001985/pexels-vika-glitter-392079-1648768_c7mtfl.jpg',
  },
  {
    id: '2',
    title: 'Modern Luxury Living Room',
    category: 'Living Room',
    description:
      'An elegant living room featuring contemporary furniture, statement lighting, and a balanced blend of comfort and sophistication.',
    imageUrl:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762001984/pexels-houzlook-3797991_nrnff3.jpg',
  },
  {
    id: '3',
    title: 'Serene Natural Living Space',
    category: 'Living Room',
    description:
      'A tranquil living area with earthy hues, soft fabrics, and abundant natural light that creates a relaxed and peaceful setting.',
    imageUrl:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762001983/pexels-fotoaibe-1571471_cj7yl5.jpg',
  },
  {
    id: '4',
    title: 'Contemporary Living Elegance',
    category: 'Living Room',
    description:
      'A refined living room design that pairs modern furniture with artistic décor and cozy lighting for everyday sophistication.',
    imageUrl:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762001983/pexels-fotoaibe-1571459_dykcja.jpg',
  },
  {
    id: '6',
    title: 'Compact Urban Living Room',
    category: 'Living Room',
    description:
      'A space-efficient living room designed for modern apartments, featuring multifunctional furniture and smart layout optimization.',
    imageUrl:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762001982/pexels-fotoaibe-1571453_rgyvgc.jpg',
  },
  {
    id: '7',
    title: 'Modern Modular Kitchen',
    category: 'Kitchen',
    description:
      'A sleek modular kitchen featuring matte cabinets, clean lines, and modern appliances for efficient cooking.',
    imageUrl:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762002580/pexels-asphotograpy-94865_oipyoz.jpg',
  },
  {
    id: '8',
    title: 'Sunlit Contemporary Kitchen',
    category: 'Kitchen',
    description:
      'Bright and airy kitchen with natural light, elegant countertops, and minimalist décor for an inviting cooking space.',
    imageUrl:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762002580/pexels-pixabay-279648_igvit6.jpg',
  },
  {
    id: '9',
    title: 'Elegant Open Kitchen',
    category: 'Kitchen',
    description:
      'An open-plan kitchen seamlessly connected to the dining area, designed with marble surfaces and ambient lighting.',
    imageUrl:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762002579/pexels-hakimsatoso-3634740_h5lhgj.jpg',
  },
  {
    id: '10',
    title: 'Rustic Wooden Kitchen',
    category: 'Kitchen',
    description:
      'A cozy rustic kitchen with reclaimed wood accents, vintage textures, and a warm earthy color palette.',
    imageUrl:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762002579/pexels-alex-qian-1180283-2343467_izthu3.jpg',
  },
  {
    id: '11',
    title: 'Luxury Chef’s Kitchen',
    category: 'Kitchen',
    description:
      'A high-end kitchen space featuring premium finishes, stone countertops, and modern lighting for gourmet cooking.',
    imageUrl:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762002578/pexels-arina-krasnikova-6654105_hpgxyy.jpg',
  },
  {
    id: '13',
    title: 'Modern Office Lobby',
    category: 'Commercial',
    description:
      'A sleek corporate lobby with polished finishes, warm lighting, and a welcoming ambiance for clients and guests.',
    imageUrl:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762002913/pexels-pixabay-263209_b5tydq.jpg',
  },
  {
    id: '14',
    title: 'Contemporary Café Interior',
    category: 'Commercial',
    description:
      'A vibrant café space featuring wooden textures, open seating, and cozy lighting for a relaxed social atmosphere.',
    imageUrl:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762002911/pexels-marta-dzedyshko-1042863-9785778_s0atgz.jpg',
  },
  {
    id: '15',
    title: 'Retail Showroom Design',
    category: 'Commercial',
    description:
      'A bright, spacious showroom layout emphasizing product display and seamless customer flow with elegant design elements.',
    imageUrl:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762002912/pexels-pixabay-236730_bnx9rs.jpg',
  },
  {
    id: '16',
    title: 'Executive Conference Room',
    category: 'Commercial',
    description:
      'A modern boardroom designed for productivity and collaboration, featuring ergonomic furniture and acoustic paneling.',
    imageUrl:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762002911/pexels-mikhail-nilov-9300731_aurymy.jpg',
  },
  {
    id: '17',
    title: 'High-End Restaurant Interior',
    category: 'Commercial',
    description:
      'An elegant fine-dining environment blending ambient lighting, textured walls, and premium furniture for an upscale experience.',
    imageUrl:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762002910/pexels-kseniachernaya-8535622_jueu3a.jpg',
  },
  {
    id: '18',
    title: 'Industrial Workspace Loft',
    category: 'Commercial',
    description:
      'A creative open workspace with exposed brick, steel elements, and collaborative zones inspired by industrial aesthetics.',
    imageUrl:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762002910/pexels-atbo-66986-245240_et6wes.jpg',
  },
  {
    id: '19',
    title: 'Modern Minimalist Bedroom',
    category: 'Bedroom',
    description:
      'A serene minimalist bedroom with soft lighting, neutral colors, and sleek furniture for a peaceful retreat.',
    imageUrl:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003184/pexels-pixabay-279746_ptddpv.jpg',
  },
  {
    id: '20',
    title: 'Classic Wooden Bedroom',
    category: 'Bedroom',
    description:
      'A timeless bedroom featuring natural wood textures, cozy fabrics, and warm tones for an inviting atmosphere.',
    imageUrl:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003182/pexels-pixabay-271624_yjqase.jpg',
  },
  {
    id: '21',
    title: 'Luxury Master Suite',
    category: 'Bedroom',
    description:
      'An opulent master bedroom showcasing premium materials, accent lighting, and a sophisticated design aesthetic.',
    imageUrl:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003181/pexels-marywhitneyph-90317_jsufk8.jpg',
  },
  {
    id: '22',
    title: 'Coastal Chic Bedroom',
    category: 'Bedroom',
    description:
      'A bright and airy coastal-style bedroom with whitewashed tones, ocean-inspired décor, and natural fabrics.',
    imageUrl:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003180/pexels-marywhitneyph-90319_ekbajp.jpg',
  },
  {
    id: '23',
    title: 'Urban Apartment Bedroom',
    category: 'Bedroom',
    description:
      'A contemporary bedroom with a compact layout, modern finishes, and clever storage for city living.',
    imageUrl:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003179/pexels-lisa-anna-901356985-19899055_tcfcpi.jpg',
  },
  {
    id: '24',
    title: 'Bohemian Style Bedroom',
    category: 'Bedroom',
    description:
      'An artistic bedroom full of character, layered textiles, greenery, and handcrafted décor elements.',
    imageUrl:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003178/pexels-lisa-anna-901356985-19866405_hcnsiw.jpg',
  },
  {
    id: '25',
    title: 'Scandinavian Comfort Bedroom',
    category: 'Bedroom',
    description:
      'A cozy Nordic-inspired bedroom featuring light wood finishes, neutral hues, and minimalist design for calm living.',
    imageUrl:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/v1762003177/pexels-l-ng-studio-3030613-16648029_flnir8.jpg',
  },
];

const fallbackProjects: ProjectDto[] = fallbackProjectSeeds.map((seed) => ({
  id: seed.id,
  title: seed.title,
  category: seed.category,
  summary: seed.description,
  createdAt: new Date().toISOString(),
  images: [{ id: seed.id, url: seed.imageUrl, order: 0 }],
}));

export default function RecentProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [filter, setFilter] = useState<'All' | string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProjectIndex, setModalProjectIndex] = useState<number | null>(
    null
  );
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const [projects, setProjects] = useState<ProjectDto[]>(fallbackProjects);
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

    const elements = sectionRef.current?.querySelectorAll('.project-card');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [projects, filter]);

  function handleScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollProgress(max > 0 ? el.scrollLeft / max : 0);
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/projects', { cache: 'no-store' });
        if (!res.ok) return;
        const list: ProjectDto[] = await res.json();
        setProjects(list.length > 0 ? list : fallbackProjects);
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const allowed = [
    'Living Room',
    'Bedroom',
    'Kitchen',
    'Office',
    'Dining Room',
    'Bathroom',
    'Commercial',
  ];
  const categories = [
    'All',
    ...allowed.filter((cat) => projects.some((p) => p.category === cat)),
  ];
  const categoryCounts: Record<string, number> = {
    All: projects.length,
    ...Object.fromEntries(
      allowed.map((cat) => [
        cat,
        projects.filter((p) => p.category === cat).length,
      ])
    ),
  };
  const filteredProjects =
    filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  const openModal = (index: number) => {
    setModalProjectIndex(index);
    setModalImageIndex(0);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setModalProjectIndex(null);
  };

  const activeModalImages =
    modalProjectIndex !== null
      ? filteredProjects[modalProjectIndex]?.images?.length || 1
      : 1;

  const showPrevImage = () =>
    setModalImageIndex((i) => (i - 1 + activeModalImages) % activeModalImages);
  const showNextImage = () =>
    setModalImageIndex((i) => (i + 1) % activeModalImages);

  const handleImageDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (activeModalImages <= 1) return;
    if (info.offset.x < -60) showNextImage();
    else if (info.offset.x > 60) showPrevImage();
  };

  return (
    <section id='projects' ref={sectionRef} className='py-20 bg-white'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-10'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Our Projects
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Explore our portfolio of stunning interior transformations
          </p>
        </div>

        {/* Category Filter */}
        <div className='flex md:flex-wrap md:justify-center gap-2 mb-12 overflow-x-auto scrollbar-hide md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0'>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`inline-flex shrink-0 items-center gap-1.5 px-4 py-2 rounded-full border transition-all active:scale-95 ${
                filter === c
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {c}
              <span
                className={`text-xs rounded-full px-1.5 py-0.5 ${
                  filter === c
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {categoryCounts[c] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {!loading && filteredProjects.length === 0 ? (
          <div className='text-center text-gray-500'>
            No projects yet. Add some from Admin.
          </div>
        ) : (
          <>
            <div className='hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {filteredProjects.map((project, index) => {
                const cover =
                  project.images?.[0]?.url ||
                  project.summary ||
                  '/placeholder.svg';
                return (
                  <div
                    key={project.id}
                    className='project-card opacity-0 group cursor-pointer rounded-xl shadow-md hover:shadow-xl active:scale-[0.98] transition-all duration-300 bg-white overflow-hidden'
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => openModal(index)}
                  >
                    <div className='relative aspect-[4/3] overflow-hidden'>
                      <img
                        src={cover}
                        alt={project.title}
                        className='absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                      {(project.images?.length ?? 0) > 1 && (
                        <span className='absolute top-2 right-2 bg-black/60 text-white text-[11px] font-medium px-2 py-0.5 rounded-full'>
                          {project.images?.length} photos
                        </span>
                      )}
                    </div>
                    <div className='p-4'>
                      <h3 className='text-base font-semibold text-gray-900 truncate'>
                        {project.title}
                      </h3>
                      <div className='flex items-center justify-between mt-1'>
                        <span className='text-sm text-gray-500'>
                          {project.category}
                        </span>
                        {(project.year || project.createdAt) && (
                          <span className='text-xs text-gray-400'>
                            {project.year ||
                              new Date(project.createdAt).getFullYear()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className='md:hidden'>
              <div
                ref={scrollerRef}
                onScroll={handleScroll}
                className='flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide -mx-4 px-4'
              >
                {filteredProjects.map((project, index) => {
                  const cover =
                    project.images?.[0]?.url ||
                    project.summary ||
                    '/placeholder.svg';
                  return (
                    <div
                      key={project.id}
                      className='project-card opacity-0 group cursor-pointer snap-center shrink-0 w-[78%] rounded-xl shadow-md active:scale-[0.98] transition-transform bg-white overflow-hidden'
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => openModal(index)}
                    >
                      <div className='relative aspect-[4/3] overflow-hidden'>
                        <img
                          src={cover}
                          alt={project.title}
                          className='absolute inset-0 w-full h-full object-cover'
                        />
                        {(project.images?.length ?? 0) > 1 && (
                          <span className='absolute top-2 right-2 bg-black/60 text-white text-[11px] font-medium px-2 py-0.5 rounded-full'>
                            {project.images?.length} photos
                          </span>
                        )}
                      </div>
                      <div className='p-3'>
                        <h3 className='text-sm font-semibold text-gray-900 truncate'>
                          {project.title}
                        </h3>
                        <span className='text-xs text-gray-500'>
                          {project.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className='text-center text-xs font-medium text-gray-400 mt-1'>
                {Math.min(
                  filteredProjects.length,
                  Math.round(scrollProgress * (filteredProjects.length - 1)) +
                    1
                )}{' '}
                / {filteredProjects.length}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen &&
          modalProjectIndex !== null &&
          filteredProjects[modalProjectIndex] && (
            <motion.div
              className='fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-4 overflow-y-auto'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                className='bg-white w-full max-w-5xl rounded-t-2xl sm:rounded-lg overflow-hidden shadow-2xl relative'
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
              <button
                onClick={closeModal}
                className='absolute top-3 right-3 z-10 p-2 rounded-full bg-black/70 text-white hover:bg-black active:scale-90 transition-transform'
              >
                <X className='h-5 w-5' />
              </button>

              <div className='grid grid-cols-1 lg:grid-cols-2'>
                {/* Carousel */}
                <div className='relative bg-black flex items-center justify-center h-64 sm:h-80 lg:h-[560px] overflow-hidden touch-pan-y'>
                  <motion.img
                    key={modalImageIndex}
                    src={
                      (filteredProjects[modalProjectIndex].images?.map(
                        (i) => i.url
                      ) || ['/placeholder.svg'])[modalImageIndex]
                    }
                    alt={filteredProjects[modalProjectIndex].title}
                    className='max-w-full max-h-full object-contain'
                    drag={activeModalImages > 1 ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.6}
                    onDragEnd={handleImageDragEnd}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                  />
                  {(filteredProjects[modalProjectIndex].images?.length ?? 0) >
                    1 && (
                    <>
                      <button
                        onClick={showPrevImage}
                        className='hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full active:scale-90 transition-transform'
                      >
                        <ChevronLeft className='h-5 w-5' />
                      </button>
                      <button
                        onClick={showNextImage}
                        className='hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full active:scale-90 transition-transform'
                      >
                        <ChevronRight className='h-5 w-5' />
                      </button>

                      {/* Dots (mobile) */}
                      <div className='sm:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5'>
                        {filteredProjects[modalProjectIndex].images!.map(
                          (_, i) => (
                            <span
                              key={i}
                              className={`h-1.5 rounded-full transition-all ${
                                i === modalImageIndex
                                  ? 'w-4 bg-white'
                                  : 'w-1.5 bg-white/40'
                              }`}
                            />
                          )
                        )}
                      </div>

                      {/* Thumbnails (desktop) */}
                      <div className='hidden sm:flex absolute bottom-3 left-1/2 -translate-x-1/2 gap-2 bg-white/80 rounded-md px-2 py-1 backdrop-blur-sm'>
                        {filteredProjects[modalProjectIndex].images!.map(
                          (img, i) => (
                            <button
                              key={i}
                              onClick={() => setModalImageIndex(i)}
                              className={`h-12 w-16 overflow-hidden rounded border ${
                                i === modalImageIndex
                                  ? 'border-gray-900'
                                  : 'border-transparent'
                              }`}
                            >
                              <img
                                src={img.url}
                                alt={`thumb-${i}`}
                                className='h-full w-full object-cover'
                              />
                            </button>
                          )
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Details */}
                <div className='p-6 lg:p-8 lg:max-h-[560px] lg:overflow-y-auto'>
                  <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                    {filteredProjects[modalProjectIndex].title}
                  </h3>
                  <p className='text-gray-600 mb-4'>
                    {filteredProjects[modalProjectIndex].summary || '—'}
                  </p>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 mb-6'>
                    <div>
                      <span className='font-semibold'>Category:</span>{' '}
                      {filteredProjects[modalProjectIndex].category}
                    </div>
                    {filteredProjects[modalProjectIndex].location && (
                      <div className='flex items-center'>
                        <MapPin className='h-4 w-4 mr-1' />
                        {filteredProjects[modalProjectIndex].location}
                      </div>
                    )}
                    {(filteredProjects[modalProjectIndex].year ||
                      filteredProjects[modalProjectIndex].createdAt) && (
                      <div className='flex items-center'>
                        <Calendar className='h-4 w-4 mr-1' />
                        {filteredProjects[modalProjectIndex].year ||
                          new Date(
                            filteredProjects[modalProjectIndex].createdAt
                          ).getFullYear()}
                      </div>
                    )}
                  </div>
                  {filteredProjects[modalProjectIndex].content && (
                    <div className='prose prose-sm max-w-none'>
                      <h4 className='text-lg font-semibold text-gray-900 mb-2'>
                        Details
                      </h4>
                      <p className='text-gray-700 whitespace-pre-line'>
                        {filteredProjects[modalProjectIndex].content}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>
    </section>
  );
}
