'use client';

import { Building, Compass, Eye, Home, Palette, Settings } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            entry.target.classList.remove('opacity-0');
            observer.unobserve(entry.target as Element);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.service-category');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const serviceCategories = [
    {
      icon: Home,
      title: 'Interior Design Services',
      services: [
        'Modular Kitchens',
        'Custom Furniture Design',
        'Lighting & False Ceiling Concepts',
        'Wardrobe Design',
        'Space Optimization',
      ],
    },
    {
      icon: Settings,
      title: 'Turnkey Solutions',
      services: [
        'Design to Execution',
        'Vendor Management',
        'Material Selection',
        'Budget Planning & Timeline Control',
      ],
    },
    {
      icon: Compass,
      title: 'Architectural Planning',
      services: ['Space Planning', 'Layout & Zoning', 'MEP Coordination'],
    },
    {
      icon: Eye,
      title: '3D & 2D Visualization',
      services: [
        'Photo-Realistic Renders',
        'Walkthrough Videos',
        'Working Drawings',
      ],
    },
    {
      icon: Building,
      title: 'Vastu Consultancy',
      services: [
        'Space alignment based on Vastu principles',
        'Interior adjustments for harmony and energy',
      ],
    },
    {
      icon: Palette,
      title: 'Exterior Design',
      services: [
        'Elevation Design (3D & Working Drawings)',
        'Gate, Balcony & Wall Design',
        'Material & Texture Selection',
        'Façade Lighting Concepts',
        'Landscaping Elements Integration',
      ],
    },
  ];

  return (
    <section id='services' ref={sectionRef} className='py-20 bg-gray-50'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Our Services
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Comprehensive design solutions from concept to completion
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {serviceCategories.map((category, index) => (
            <div
              key={index}
              className='service-category opacity-0 bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2'
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className='flex items-center justify-center w-16 h-16 bg-gray-900 text-white rounded-lg mb-6'>
                <category.icon className='h-8 w-8' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                {category.title}
              </h3>
              <ul className='space-y-2'>
                {category.services.map((service, serviceIndex) => (
                  <li
                    key={serviceIndex}
                    className='text-gray-600 flex items-start'
                  >
                    <span className='w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0'></span>
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
