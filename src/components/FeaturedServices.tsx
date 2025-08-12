'use client';

import { Building, Compass, Eye, Home, Palette, Settings } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function FeaturedServices() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.service-card');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const services = [
    {
      icon: Home,
      title: 'Modular Interiors',
      description: 'Custom modular solutions for modern living spaces',
    },
    {
      icon: Compass,
      title: 'Vastu-Friendly Designs',
      description: 'Harmonious spaces aligned with ancient wisdom',
    },
    {
      icon: Building,
      title: 'Residential & Commercial',
      description: 'Complete interior solutions for all space types',
    },
    {
      icon: Eye,
      title: '2D/3D Visualizations',
      description: 'Photo-realistic renders and walkthrough videos',
    },
    {
      icon: Settings,
      title: 'Turnkey Execution',
      description: 'End-to-end project management and execution',
    },
    {
      icon: Palette,
      title: 'Custom Furniture',
      description: 'Bespoke furniture designed for your space',
    },
  ];

  return (
    <section id='services' ref={sectionRef} className='py-20 bg-gray-50'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Featured Services
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Comprehensive interior design solutions tailored to your vision and
            lifestyle
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {services.map((service, index) => (
            <div
              key={index}
              className='service-card opacity-0 bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group'
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className='flex items-center justify-center w-16 h-16 bg-gray-900 text-white rounded-lg mb-6 group-hover:bg-gray-800 transition-colors'>
                <service.icon className='h-8 w-8' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                {service.title}
              </h3>
              <p className='text-gray-600'>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
