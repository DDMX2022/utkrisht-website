'use client';

import { Linkedin, Mail } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type MediaItem = { url: string; title?: string | null };

function normalizeName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  const [teamPhotos, setTeamPhotos] = useState<MediaItem[]>([]);

  const teamMembers = [
    {
      name: 'Tanusha Dutt Misra',
      role: 'Co-Founder',
      image:
        'https://res.cloudinary.com/dsvz8fu0u/image/upload/c_fill,g_face,w_900,h_1100,q_auto,f_auto/v1782234487/tanusha-dutt-misra_vgnlds.png',
      fallbackImage: '/founders/tanusha-dutt-misra.svg',
      imagePosition: 'object-top',
      description:
        "A design enthusiast with an instinct for aesthetics and personalization, Tanusha Dutt Misra leads the creative vision at Utkrisht. Her passion for perfection and eye for detail help translate every client's brief into a dream space with a soul.",
      expertise: 'Creative Direction, Space Planning, Client Relations',
    },
    {
      name: 'Vikas Sharma',
      role: 'Co-Founder',
      image:
        'https://res.cloudinary.com/dsvz8fu0u/image/upload/c_fill,g_face,w_900,h_1100,q_auto,f_auto/v1782234019/vikas-sharma_ychc2l.jpg',
      fallbackImage: '/founders/vikas-sharma.svg',
      imagePosition: 'object-top',
      description:
        'With a sharp eye for detail and a deep understanding of materials, structures, and spatial functionality, Vikas Sharma is the technical backbone of Utkrisht. From structural planning to choosing the right finishes, he ensures every element serves both form and function.',
      expertise: 'Technical Planning, Material Sourcing, Structural Design',
    },
  ];

  // Load up to two team photos from Media (utkrisht/team)
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          '/api/media?folder=' + encodeURIComponent('utkrisht/team'),
          { cache: 'no-store' }
        );
        if (!res.ok) return;
        const data: MediaItem[] = await res.json();
        setTeamPhotos(data || []);
      } catch {}
    }
    load();
  }, []);

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

    const elements = sectionRef.current?.querySelectorAll('.team-card');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [teamPhotos]);

  const byTitle = new Map<string, string>();
  teamPhotos.forEach((m) => {
    if (m.title) byTitle.set(normalizeName(m.title), m.url);
  });
  const orderedUrls = teamPhotos.map((m) => m.url).slice(0, 2);
  const rendered = teamMembers.map((m, i) => ({
    ...m,
    image:
      byTitle.get(normalizeName(m.name)) || // match by title
      orderedUrls[i] || // fallback by order
      m.image,
  }));

  return (
    <section ref={sectionRef} className='py-20 bg-gray-50'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Our Team
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Meet the creative minds behind Utkrisht's exceptional interior
            design solutions
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {rendered.map((member, index) => (
            <div
              key={index}
              className='team-card bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300'
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className='md:flex'>
                <div className='relative h-[34rem] overflow-hidden bg-gray-100 md:h-auto md:w-1/2 md:self-stretch'>
                  <img
                    src={member.image || '/placeholder.svg'}
                    alt={member.name}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = member.fallbackImage;
                    }}
                    className={`absolute inset-0 h-full w-full object-cover ${member.imagePosition}`}
                  />
                </div>
                <div className='md:w-1/2 p-8'>
                  <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                    {member.name}
                  </h3>
                  <p className='text-lg text-gray-600 mb-4 font-medium'>
                    {member.role}
                  </p>
                  <p className='text-gray-600 mb-4 leading-relaxed'>
                    {member.description}
                  </p>
                  <div className='mb-6'>
                    <h4 className='font-semibold text-gray-900 mb-2'>
                      Expertise:
                    </h4>
                    <p className='text-gray-600 text-sm'>{member.expertise}</p>
                  </div>
                  <div className='flex space-x-4'>
                    <button className='p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors'>
                      <Linkedin className='h-5 w-5' />
                    </button>
                    <button className='p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors'>
                      <Mail className='h-5 w-5' />
                    </button>
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
