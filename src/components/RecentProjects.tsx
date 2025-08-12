'use client';

import { Calendar, ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

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

export default function RecentProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentProject, setCurrentProject] = useState(0);
  const [filter, setFilter] = useState<'All' | string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProjectIndex, setModalProjectIndex] = useState<number | null>(
    null
  );
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const [projects, setProjects] = useState<ProjectDto[]>([]);
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
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/projects', { cache: 'no-store' });
        if (!res.ok) return;
        const list = await res.json();
        setProjects(list);
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
  ];
  const categories = [
    'All',
    ...allowed.filter((cat) => projects.some((p) => p.category === cat)),
  ];
  const filteredProjects =
    filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  useEffect(() => {
    setCurrentProject(0);
  }, [filter]);

  const nextProject = () =>
    setCurrentProject(
      (prev) => (prev + 1) % Math.max(1, filteredProjects.length)
    );
  const prevProject = () =>
    setCurrentProject(
      (prev) =>
        (prev - 1 + Math.max(1, filteredProjects.length)) %
        Math.max(1, filteredProjects.length)
    );

  const openModal = (index: number) => {
    setModalProjectIndex(index);
    setModalImageIndex(0);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setModalProjectIndex(null);
  };

  const current = filteredProjects[currentProject];
  const images = current?.images?.length
    ? current.images.map((i) => i.url)
    : current
    ? [current.summary || '/placeholder.svg']
    : [];

  return (
    <section id='projects' ref={sectionRef} className='py-20 bg-white'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-10'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Recent Projects
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Showcasing our latest interior design transformations
          </p>
        </div>

        {/* Category Filter */}
        <div className='flex flex-wrap justify-center gap-3 mb-10'>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full border transition-colors ${
                filter === c
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {!loading && filteredProjects.length === 0 ? (
          <div className='text-center text-gray-500'>
            No projects yet. Add some from Admin.
          </div>
        ) : (
          <div className='relative'>
            <div className='project-card opacity-0 bg-gray-50 rounded-lg overflow-hidden shadow-xl'>
              <div className='grid grid-cols-1 lg:grid-cols-2'>
                <div className='relative h-64 lg:h-96'>
                  <img
                    src={images[0] || '/placeholder.svg'}
                    alt={current?.title || 'Project'}
                    className='w-full h-full object-cover'
                  />
                  <div className='absolute top-4 left-4 bg-gray-900 text-white px-3 py-1 rounded-full text-sm'>
                    {current?.category || '—'}
                  </div>
                </div>

                <div className='p-8 lg:p-12 flex flex-col justify-center'>
                  <h3 className='text-2xl lg:text-3xl font-bold text-gray-900 mb-4'>
                    {current?.title || 'Untitled Project'}
                  </h3>
                  <p className='text-gray-600 mb-6 leading-relaxed'>
                    {current?.summary || 'Details coming soon.'}
                  </p>

                  <div className='flex items-center space-x-6 mb-6'>
                    <div className='flex items-center text-gray-500'>
                      <MapPin className='h-5 w-5 mr-2' />
                      {current?.location || '—'}
                    </div>
                    <div className='flex items-center text-gray-500'>
                      <Calendar className='h-5 w-5 mr-2' />
                      {current?.year ||
                        new Date(
                          current?.createdAt || Date.now()
                        ).getFullYear()}
                    </div>
                  </div>

                  <Button
                    className='bg-gray-900 hover:bg-gray-800 text-white w-fit'
                    onClick={() => openModal(currentProject)}
                  >
                    View Project Details
                  </Button>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className='flex items-center justify-center mt-8 space-x-4'>
              <Button
                variant='outline'
                size='icon'
                onClick={prevProject}
                className='rounded-full bg-transparent'
              >
                <ChevronLeft className='h-5 w-5' />
              </Button>
              <div className='flex space-x-2'>
                {filteredProjects.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentProject ? 'bg-gray-900' : 'bg-gray-300'
                    }`}
                    onClick={() => setCurrentProject(index)}
                  />
                ))}
              </div>
              <Button
                variant='outline'
                size='icon'
                onClick={nextProject}
                className='rounded-full bg-transparent'
              >
                <ChevronRight className='h-5 w-5' />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen &&
        modalProjectIndex !== null &&
        filteredProjects[modalProjectIndex] && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4'>
            <div className='bg-white w-full max-w-5xl rounded-lg overflow-hidden shadow-2xl relative'>
              <button
                onClick={() => setIsModalOpen(false)}
                className='absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-black'
              >
                <X className='h-5 w-5' />
              </button>

              <div className='grid grid-cols-1 lg:grid-cols-2'>
                {/* Carousel */}
                <div className='relative bg-black flex items-center justify-center h-[480px] lg:h-[560px]'>
                  <img
                    src={
                      (filteredProjects[modalProjectIndex].images?.map(
                        (i) => i.url
                      ) || [images[0]])[modalImageIndex]
                    }
                    alt={filteredProjects[modalProjectIndex].title}
                    className='max-w-full max-h-full object-contain'
                  />
                  <button
                    onClick={() =>
                      setModalImageIndex(
                        (i) =>
                          (i -
                            1 +
                            (filteredProjects[modalProjectIndex].images
                              ?.length || 1)) %
                          (filteredProjects[modalProjectIndex].images?.length ||
                            1)
                      )
                    }
                    className='absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full'
                  >
                    <ChevronLeft className='h-5 w-5' />
                  </button>
                  <button
                    onClick={() =>
                      setModalImageIndex(
                        (i) =>
                          (i + 1) %
                          (filteredProjects[modalProjectIndex].images?.length ||
                            1)
                      )
                    }
                    className='absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full'
                  >
                    <ChevronRight className='h-5 w-5' />
                  </button>

                  {/* Thumbnails */}
                  <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 bg-white/80 rounded-md px-2 py-1 backdrop-blur-sm'>
                    {(
                      filteredProjects[modalProjectIndex].images?.map(
                        (i) => i.url
                      ) || [images[0]]
                    ).map((img, i) => (
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
                          src={img}
                          alt={`thumb-${i}`}
                          className='h-full w-full object-cover'
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className='p-6 lg:p-8 max-h-[560px] overflow-y-auto'>
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
            </div>
          </div>
        )}
    </section>
  );
}
