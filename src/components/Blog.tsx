'use client';

import { ArrowRight, Calendar, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

interface BlogPost {
  id: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  status: string;
  createdAt: string;
  author?: { name?: string | null } | null;
  coverImage?: { url: string | null } | null;
  externalUrl?: string | null;
  authorName?: string | null; // NEW
}

export default function Blog() {
  const sectionRef = useRef<HTMLElement>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/blog?limit=6', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load blog posts');
      const data: BlogPost[] = await res.json();
      setPosts(data);
    } catch (e: any) {
      setError(e?.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
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

    const elements = sectionRef.current?.querySelectorAll('.blog-card');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [posts]);

  return (
    <section id='blog' ref={sectionRef} className='py-20 bg-white'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Latest Insights
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Stay updated with the latest trends, tips, and insights from our
            design experts
          </p>
        </div>

        {loading && (
          <div className='text-center text-gray-500'>Loading posts...</div>
        )}
        {error && <div className='text-center text-red-600'>{error}</div>}

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {!loading && posts.length === 0 && (
            <div className='col-span-full text-center text-gray-500'>
              No posts yet. Create one from Admin.
            </div>
          )}
          {posts.map((post, index) => (
            <article
              key={post.id}
              className='blog-card opacity-0 bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group'
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className='relative overflow-hidden'>
                <img
                  src={post.coverImage?.url || '/placeholder.svg'}
                  alt={post.title}
                  className='w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300'
                />
                <div className='absolute top-4 left-4 bg-gray-900 text-white px-3 py-1 rounded-full text-sm'>
                  Published
                </div>
              </div>

              <div className='p-6'>
                <h3 className='text-xl font-semibold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors'>
                  {post.title}
                </h3>
                <p className='text-gray-600 mb-4 line-clamp-3'>
                  {post.excerpt || '—'}
                </p>

                <div className='flex items-center justify-between text-sm text-gray-500 mb-4'>
                  <div className='flex items-center'>
                    <User className='h-4 w-4 mr-1' />
                    {post.authorName || post.author?.name || 'Utkrisht Team'}
                  </div>
                  <div className='flex items-center'>
                    <Calendar className='h-4 w-4 mr-1' />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {post.externalUrl ? (
                  <a
                    href={post.externalUrl}
                    target='_blank'
                    rel='noopener noreferrer nofollow'
                    className='inline-flex items-center font-semibold text-gray-900 hover:bg-gray-100 px-2 py-1 rounded'
                  >
                    Read on external site
                    <ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
                  </a>
                ) : (
                  <Button
                    variant='ghost'
                    className='group-hover:bg-gray-100 p-0 h-auto font-semibold text-gray-900'
                  >
                    Read More
                    <ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className='text-center mt-12'>
          <Button
            size='lg'
            className='bg-gray-900 hover:bg-gray-800 text-white'
          >
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
}
