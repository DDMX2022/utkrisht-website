'use client';

import { Award, Clock, DollarSign, Users } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement>(null);

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

    const elements = sectionRef.current?.querySelectorAll('.stat-card');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: Award,
      number: '50+',
      title: 'Completed Projects',
      description:
        'Successfully delivered projects across residential and commercial spaces',
    },
    {
      icon: Users,
      number: '100%',
      title: '3D Render Expertise',
      description: 'Photo-realistic renders that bring your vision to life',
    },
    {
      icon: Clock,
      number: 'On-Time',
      title: 'Timely Delivery',
      description: 'Committed to delivering projects within agreed timelines',
    },
    {
      icon: DollarSign,
      number: 'Budget',
      title: 'Friendly Pricing',
      description: 'Transparent pricing with no hidden costs or surprises',
    },
  ];

  return (
    <section ref={sectionRef} className='py-20 bg-gray-900 text-white'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold mb-4'>Why Choose Us</h2>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
            Professional team with personal touch, delivering excellence in
            every project
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {stats.map((stat, index) => (
            <div
              key={index}
              className='stat-card opacity-0 text-center group'
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className='flex items-center justify-center w-20 h-20 bg-white text-gray-900 rounded-full mb-6 mx-auto group-hover:scale-110 transition-transform duration-300'>
                <stat.icon className='h-10 w-10' />
              </div>
              <div className='text-4xl font-bold mb-2 text-white'>
                {stat.number}
              </div>
              <h3 className='text-xl font-semibold mb-4 text-gray-100'>
                {stat.title}
              </h3>
              <p className='text-gray-400'>{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
