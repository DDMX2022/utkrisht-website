'use client';

import {
  ArrowRight,
  Building2,
  Check,
  Eye,
  Layers,
  Monitor,
  Sparkles,
  ShoppingBag,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

interface PackageItem {
  id: string;
  title: string;
  tagline: string;
  price: string;
  originalPrice: string;
  priceNote: string;
  icon: LucideIcon;
  popular?: boolean;
  included: string[];
  idealFor: string[];
  deliverables: string[];
}

const packages: PackageItem[] = [
  {
    id: 'e-design-studio',
    title: 'E-Design Studio Package',
    tagline:
      'Expert design guidance from the comfort of your home — professional direction without full-service execution.',
    price: '₹4,999',
    originalPrice: '₹9,999',
    priceNote: 'starting (customizable on scope)',
    icon: Monitor,
    included: [
      'One-on-one online consultation sessions',
      'Space planning and layout suggestions',
      'Vastu-based planning and recommendations (optional)',
      'Customized color schemes and palette selection',
      'Concept boards and mood boards for design visualization',
      'Material selection guidance aligned with your style and budget',
      'Detailed material list with brand names and product codes',
      'Furniture, décor, lighting, and finish recommendations',
    ],
    idealFor: [
      'New home owners planning interiors',
      'Renovation and makeover projects',
      'Clients living in different cities or countries',
      'DIY homeowners who need professional guidance',
      'Anyone looking for clear design direction before execution',
    ],
    deliverables: [
      'Concept/Mood Board',
      'Color Palette',
      'Vastu Recommendations (if required)',
      'Material Specification Sheet with Brand References',
      'Layout Suggestions',
      'Shopping & Sourcing Guidance',
    ],
  },
  {
    id: 'concept-to-visualization',
    title: 'Concept-to-Visualization Package',
    tagline:
      'See exactly how your space will look and function before investing in construction or interiors.',
    price: '₹6,499',
    originalPrice: '₹12,999',
    priceNote: 'starting (varies by project size)',
    icon: Eye,
    included: [
      'Site dimension verification and space planning',
      'Structural coordination considering beams and columns',
      'Accurate 2D floor plan',
      'Detailed furniture layout plan',
      'Design concepts and mood boards',
      'Material and color direction',
      'High-quality 3D realistic renders',
      'Multiple views of key spaces for better visualization',
    ],
    idealFor: [
      'Homeowners planning a new home or renovation',
      'Clients who want visual clarity before execution',
      'Interior and architectural projects requiring design presentation',
      'Builders and developers seeking presentation-ready visuals',
    ],
    deliverables: [
      'Accurate Floor Plan',
      'Furniture Layout',
      'Concept/Mood Board',
      'Photorealistic 3D Renders',
      'Design Presentation PDF',
    ],
  },
  {
    id: 'design-shopping-companion',
    title: 'Design Shopping Companion Package',
    tagline:
      'Already have a design direction? Get expert guidance while you shop and avoid costly mistakes.',
    price: '₹3,499',
    originalPrice: '₹6,999',
    priceNote: 'starting (based on timeline & locality)',
    icon: ShoppingBag,
    included: [
      '4–5 hours of designer assistance (online or offline)',
      'Selection of laminates, veneers, wallpapers, louvers, fabrics, tiles, paints, and finishes',
      'Furniture, décor, lighting, and furnishing recommendations',
      'Material and color coordination so everything works together',
      'Budget-friendly alternatives and value engineering suggestions',
      'Avoid costly purchasing mistakes with professional guidance',
    ],
    idealFor: [
      'Clients who already have a mood board / Pinterest board',
      'Clients with finalized designs who need help selecting materials',
      'Homeowners purchasing furnishings and décor independently',
      'Renovation projects requiring expert shopping support',
    ],
    deliverables: [
      'Curated material selections',
      'Shopping recommendations list',
      'Vendor/store suggestions',
      'On-the-spot design consultation during purchases',
    ],
  },
  {
    id: 'concept-to-execution',
    title: 'Concept to Execution Package',
    tagline:
      'Complete design clarity and execution-ready documentation, from realistic renders to technical drawings.',
    price: '₹8,999',
    originalPrice: '₹17,999',
    priceNote: 'starting (varies by scope)',
    icon: Layers,
    popular: true,
    included: [
      'Site dimension verification & space planning',
      'Structural coordination (beams & columns)',
      'Accurate 2D floor plans',
      'Detailed furniture layout plans',
      'Concept development & mood boards',
      'Material & color selection guidance',
      'Photorealistic 3D renders',
      'Multiple views for better visualization',
      'Detailed working drawings',
      'Electrical layout drawings',
      'Plumbing layout drawings',
      'Reflected Ceiling Plan (RCP)',
      'Design presentation PDF',
    ],
    idealFor: [
      'New home construction projects',
      'Home renovations & remodels',
      'Interior design projects requiring technical documentation',
      'Clients seeking design clarity before execution',
      'Builders & developers requiring presentation-ready designs',
    ],
    deliverables: [
      'Floor Plan',
      'Furniture Layout',
      'Concept/Mood Board',
      '3D Realistic Renders',
      'Working Drawings Set',
      'Electrical Layout',
      'Plumbing Layout',
      'Reflected Ceiling Plan (RCP)',
      'Design Presentation PDF',
    ],
  },
  {
    id: 'architectural-planning',
    title: 'Architectural Planning & Drawing Package',
    tagline:
      'A complete architectural drawing solution for plot owners planning to build their dream home from scratch.',
    price: '₹50/sqft',
    originalPrice: '₹100/sqft',
    priceNote: 'based on plot size & scope',
    icon: Building2,
    included: [
      'Detailed 2D architectural floor plans',
      'Space planning and room layouts',
      'Vastu-compliant planning (optional)',
      'Elevation design concepts',
      'Civil and construction drawings',
      'Furniture layout plans',
      'Electrical point layout',
      'Plumbing layout drawings',
      'Staircase and terrace planning',
      'Door & window schedules',
    ],
    idealFor: [
      'New plot owners',
      'Independent house construction projects',
      'Villa and farmhouse planning',
      'Clients requiring complete drawing sets before construction',
      'Homeowners seeking municipality/contractor-ready plans',
    ],
    deliverables: [
      'Architectural Floor Plans',
      'Elevation Drawings',
      'Electrical & Plumbing Layouts',
      'Furniture Layout Plan',
      'Door & Window Details',
      'Construction/Civil Drawings',
      'PDF & CAD Files',
    ],
  },
];

export default function Packages() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = packages.find((p) => p.id === activeId) || null;
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function closeModal() {
    setActiveId(null);
    setLeadForm({ name: '', email: '', phone: '' });
    setSubmitted(false);
    setSubmitError(null);
  }

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    if (!active) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadForm.name,
          email: leadForm.email,
          phone: leadForm.phone,
          service: active.title,
          message: `Consultation request for the "${active.title}" package.`,
          source: 'Package Consultation',
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || 'Something went wrong. Please try again.');
      }
      setSubmitted(true);
      setLeadForm({ name: '', email: '', phone: '' });
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  }

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
    const elements = sectionRef.current?.querySelectorAll('.package-card');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id='packages' ref={sectionRef} className='py-20 bg-gray-50'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <span className='inline-flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full text-sm font-semibold mb-4'>
            <Sparkles className='h-4 w-4' />
            Tailored design support
          </span>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Design Packages
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Choose the level of support that fits your project — from online
            design guidance to complete, execution-ready documentation.
          </p>
        </div>

        <div className='flex flex-wrap justify-center gap-8'>
          {packages.map((pkg, index) => {
            const Icon = pkg.icon;
            return (
              <div
                key={pkg.id}
                className={`package-card opacity-0 relative w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)] bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 p-8 flex flex-col ${
                  pkg.popular
                    ? 'ring-2 ring-amber-400'
                    : 'ring-1 ring-gray-100'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {pkg.popular && (
                  <span className='absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10'>
                    <Sparkles className='h-3 w-3' />
                    MOST POPULAR
                  </span>
                )}

                <div className='absolute top-0 right-0 bg-amber-500 text-white rounded-tr-2xl rounded-bl-xl px-3 py-2 text-center leading-none shadow-md'>
                  <div className='text-lg font-extrabold'>50%</div>
                  <div className='text-[10px] font-bold tracking-wide'>
                    OFF
                  </div>
                </div>

                <div
                  className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 ${
                    pkg.popular
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-900 text-white'
                  }`}
                >
                  <Icon className='h-7 w-7' />
                </div>

                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                  {pkg.title}
                </h3>
                <p className='text-gray-500 text-sm leading-relaxed mb-6'>
                  {pkg.tagline}
                </p>

                <div className='border-t border-gray-100 pt-6 mb-6'>
                  <div className='flex items-baseline gap-2'>
                    <span className='text-3xl font-extrabold text-gray-900'>
                      {pkg.price}
                    </span>
                    <span className='text-base text-gray-400 line-through'>
                      {pkg.originalPrice}
                    </span>
                  </div>
                  <span className='text-xs text-gray-400'>
                    {pkg.priceNote}
                  </span>
                </div>

                <ul className='space-y-3 mb-8 flex-1'>
                  {pkg.included.slice(0, 4).map((item) => (
                    <li
                      key={item}
                      className='flex items-start text-sm text-gray-600'
                    >
                      <span className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-amber-50 flex items-center justify-center'>
                        <Check className='h-3 w-3 text-amber-600' />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                  {pkg.included.length > 4 && (
                    <li className='text-xs font-medium text-gray-400 pl-7'>
                      +{pkg.included.length - 4} more inclusions
                    </li>
                  )}
                </ul>

                <button
                  onClick={() => setActiveId(pkg.id)}
                  className={`w-full group inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full font-semibold transition-colors ${
                    pkg.popular
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  Get More Info
                  <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details Modal */}
      {active && (
        <div className='fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4'>
          <div className='bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col'>
            <div className='bg-gray-900 text-white p-6 lg:p-8 relative'>
              <button
                onClick={closeModal}
                className='absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors'
              >
                <X className='h-5 w-5' />
              </button>
              <div className='flex items-center gap-4 mb-3'>
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    active.popular ? 'bg-amber-500' : 'bg-white/10'
                  }`}
                >
                  <active.icon className='h-6 w-6' />
                </div>
                <h3 className='text-2xl lg:text-3xl font-bold pr-10'>
                  {active.title}
                </h3>
              </div>
              <p className='text-gray-300 mb-4'>{active.tagline}</p>
              <div className='flex items-baseline gap-2 flex-wrap'>
                <span className='text-3xl font-extrabold'>
                  {active.price}
                </span>
                <span className='text-base text-gray-400 line-through'>
                  {active.originalPrice}
                </span>
                <span className='bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full'>
                  50% OFF
                </span>
                <span className='text-sm text-gray-400 ml-1'>
                  {active.priceNote}
                </span>
              </div>
            </div>

            <div className='p-6 lg:p-8 overflow-y-auto'>
              <div className='mb-8'>
                <h4 className='text-lg font-semibold text-gray-900 mb-3'>
                  What&apos;s Included
                </h4>
                <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                  {active.included.map((item) => (
                    <li
                      key={item}
                      className='flex items-start text-sm text-gray-700'
                    >
                      <span className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-amber-50 flex items-center justify-center'>
                        <Check className='h-3 w-3 text-amber-600' />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8'>
                <div>
                  <h4 className='text-lg font-semibold text-gray-900 mb-3'>
                    Ideal For
                  </h4>
                  <ul className='space-y-2'>
                    {active.idealFor.map((item) => (
                      <li
                        key={item}
                        className='flex items-start text-sm text-gray-700'
                      >
                        <span className='mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400' />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className='text-lg font-semibold text-gray-900 mb-3'>
                    Deliverables
                  </h4>
                  <ul className='space-y-2'>
                    {active.deliverables.map((item) => (
                      <li
                        key={item}
                        className='flex items-start text-sm text-gray-700'
                      >
                        <span className='mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400' />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className='border-t border-gray-100 pt-6'>
                {submitted ? (
                  <div className='text-center bg-amber-50 rounded-xl p-6'>
                    <p className='text-gray-900 font-semibold mb-1'>
                      Request received!
                    </p>
                    <p className='text-sm text-gray-600'>
                      We&apos;ll reach out shortly to schedule your
                      consultation for the {active.title}.
                    </p>
                  </div>
                ) : (
                  <>
                    <h4 className='text-lg font-semibold text-gray-900 mb-3'>
                      Book a Consultation
                    </h4>
                    <form onSubmit={submitLead} className='space-y-3'>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        <input
                          type='text'
                          required
                          placeholder='Your name'
                          value={leadForm.name}
                          onChange={(e) =>
                            setLeadForm({ ...leadForm, name: e.target.value })
                          }
                          className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors'
                        />
                        <input
                          type='tel'
                          placeholder='Phone number'
                          value={leadForm.phone}
                          onChange={(e) =>
                            setLeadForm({ ...leadForm, phone: e.target.value })
                          }
                          className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors'
                        />
                      </div>
                      <input
                        type='email'
                        required
                        placeholder='Email address'
                        value={leadForm.email}
                        onChange={(e) =>
                          setLeadForm({ ...leadForm, email: e.target.value })
                        }
                        className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors'
                      />
                      {submitError && (
                        <p className='text-sm text-red-600'>{submitError}</p>
                      )}
                      <button
                        type='submit'
                        disabled={submitting}
                        className='w-full inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white px-4 py-3 rounded-full font-semibold transition-colors'
                      >
                        {submitting ? 'Sending...' : 'Request Consultation'}
                        <ArrowRight className='h-4 w-4' />
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
