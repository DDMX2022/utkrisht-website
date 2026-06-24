'use client';

import {
  Briefcase,
  Check,
  Download,
  ExternalLink,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Share2,
  Youtube,
} from 'lucide-react';
import { useState } from 'react';

const business = {
  name: 'Utkrisht',
  legalName: 'Utkrisht Interiors',
  tagline: 'Vastu-Compliant Interior Design',
  description:
    'Transforming spaces with innovative, Vastu-compliant interior design solutions. Your vision, our expertise.',
  phone: '9891347353',
  phoneSecondary: '9999258001',
  email: 'utkrisht.interiors@gmail.com',
  address:
    'Plot No. 1, 4th floor - A 405 - Shakti Khand 2, Indirapuram, Ghaziabad, Uttar Pradesh 201014',
  mapUrl: 'https://maps.app.goo.gl/uPzf7nA2CzJhAW3w8?g_st=aw',
  services: [
    { icon: '🏠', label: 'Interior Design' },
    { icon: '🛠️', label: 'Turnkey Solutions' },
    { icon: '📐', label: 'Architectural Planning' },
    { icon: '🖼️', label: '3D & 2D Visualization' },
    { icon: '🧭', label: 'Vastu Consultancy' },
    { icon: '🌿', label: 'Exterior Design' },
  ],
  social: [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/interiorsbyutkrisht/',
      icon: Instagram,
      color: 'bg-gray-900',
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/feed/',
      icon: Linkedin,
      color: 'bg-gray-900',
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/@UtkrishtInteriors',
      icon: Youtube,
      color: 'bg-gray-900',
    },
  ],
};

const founders = [
  {
    name: 'Tanusha Dutt Misra',
    role: 'Co-Founder',
    image:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/c_fill,g_face,w_200,h_200,q_auto,f_auto/v1782234487/tanusha-dutt-misra_vgnlds.png',
    fallbackImage: '/founders/tanusha-dutt-misra.svg',
  },
  {
    name: 'Vikas Sharma',
    role: 'Co-Founder',
    image:
      'https://res.cloudinary.com/dsvz8fu0u/image/upload/c_fill,g_face,w_200,h_200,q_auto,f_auto/v1782234019/vikas-sharma_ychc2l.jpg',
    fallbackImage: '/founders/vikas-sharma.svg',
  },
];

function downloadVCard() {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${business.legalName}
ORG:${business.legalName}
TEL;TYPE=WORK,VOICE:+91${business.phone}
TEL;TYPE=WORK:+91${business.phoneSecondary}
EMAIL;TYPE=WORK:${business.email}
ADR;TYPE=WORK:;;${business.address};;;;
URL:${typeof window !== 'undefined' ? window.location.origin : ''}
NOTE:${business.description}
END:VCARD`;

  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Utkrisht-Interiors.vcf';
  a.click();
  URL.revokeObjectURL(url);
}

export default function DigitalCardPage() {
  const [shared, setShared] = useState(false);

  async function handleShare() {
    const origin = window.location.origin;
    const shareData = {
      title: `${business.name} – ${business.tagline}`,
      text: `${business.legalName} – ${business.description}`,
      url: `${origin}/card`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        /* user cancelled or share failed */
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareData.url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure/non-HTTPS context)
      window.prompt('Copy this link to share:', shareData.url);
    }
  }

  return (
    <main className='min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-3xl shadow-2xl overflow-hidden'>
          {/* Header */}
          <div className='relative bg-amber-500 px-6 pt-8 pb-14 text-center'>
            <div className='absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4' />
            <div className='absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4' />

            <div className='relative mx-auto w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-4'>
              <span className='text-3xl font-black text-amber-600'>U</span>
            </div>

            <h1 className='text-white font-black text-2xl tracking-tight'>
              {business.name}
            </h1>
            <p className='text-white/80 text-sm font-medium mt-1'>
              {business.tagline}
            </p>
          </div>

          {/* Co-founders strip (overlaps header) */}
          <div className='relative -mt-8 px-6'>
            <div className='bg-gray-50 rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4'>
              <div className='flex -space-x-3 flex-shrink-0'>
                {founders.map((f) => (
                  <img
                    key={f.name}
                    src={f.image}
                    alt={f.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = f.fallbackImage;
                    }}
                    className='w-12 h-12 rounded-xl object-cover object-top border-2 border-white shadow'
                  />
                ))}
              </div>
              <div>
                <p className='font-bold text-gray-900 text-sm'>
                  {founders.map((f) => f.name).join(' & ')}
                </p>
                <p className='text-xs text-amber-600 font-medium'>
                  Co-Founders
                </p>
                <p className='text-[10px] text-gray-400 mt-0.5'>
                  {business.legalName}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className='px-6 mt-5'>
            <div className='grid grid-cols-3 gap-2.5'>
              <a
                href={`tel:+91${business.phone}`}
                className='flex flex-col items-center gap-1.5 p-3 rounded-xl bg-amber-50 hover:bg-amber-100 active:scale-95 transition-all'
              >
                <Phone className='w-5 h-5 text-amber-600' />
                <span className='text-[10px] font-semibold text-amber-700'>
                  Call
                </span>
              </a>
              <a
                href={`mailto:${business.email}`}
                className='flex flex-col items-center gap-1.5 p-3 rounded-xl bg-amber-50 hover:bg-amber-100 active:scale-95 transition-all'
              >
                <Mail className='w-5 h-5 text-amber-600' />
                <span className='text-[10px] font-semibold text-amber-700'>
                  Email
                </span>
              </a>
              <a
                href='/'
                className='flex flex-col items-center gap-1.5 p-3 rounded-xl bg-amber-50 hover:bg-amber-100 active:scale-95 transition-all'
              >
                <Globe className='w-5 h-5 text-amber-600' />
                <span className='text-[10px] font-semibold text-amber-700'>
                  Website
                </span>
              </a>
            </div>
          </div>

          {/* Contact Details */}
          <div className='px-6 mt-5'>
            <div className='space-y-2.5'>
              <a
                href={`tel:+91${business.phone}`}
                className='flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-[0.98] transition-all'
              >
                <div className='w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0'>
                  <Phone className='w-4 h-4 text-amber-600' />
                </div>
                <div>
                  <p className='text-xs text-gray-400 font-medium'>Phone</p>
                  <p className='text-sm font-semibold text-gray-900'>
                    +91 {business.phone}
                  </p>
                </div>
                <ExternalLink className='w-3.5 h-3.5 text-gray-300 ml-auto' />
              </a>

              <a
                href={`mailto:${business.email}`}
                className='flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-[0.98] transition-all'
              >
                <div className='w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0'>
                  <Mail className='w-4 h-4 text-amber-600' />
                </div>
                <div>
                  <p className='text-xs text-gray-400 font-medium'>Email</p>
                  <p className='text-sm font-semibold text-gray-900'>
                    {business.email}
                  </p>
                </div>
                <ExternalLink className='w-3.5 h-3.5 text-gray-300 ml-auto' />
              </a>

              <a
                href={business.mapUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-[0.98] transition-all'
              >
                <div className='w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5'>
                  <MapPin className='w-4 h-4 text-amber-600' />
                </div>
                <div>
                  <p className='text-xs text-gray-400 font-medium'>Office</p>
                  <p className='text-sm font-semibold text-gray-900 leading-snug'>
                    {business.address}
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Services */}
          <div className='px-6 mt-5'>
            <div className='flex items-center gap-2 mb-3'>
              <Briefcase className='w-4 h-4 text-amber-600' />
              <h3 className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                Our Services
              </h3>
            </div>
            <div className='grid grid-cols-2 gap-2'>
              {business.services.map((s) => (
                <div
                  key={s.label}
                  className='flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100'
                >
                  <span className='text-base'>{s.icon}</span>
                  <span className='text-xs font-medium text-gray-700'>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className='px-6 mt-5'>
            <h3 className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-3'>
              Connect With Us
            </h3>
            <div className='flex gap-2.5'>
              {business.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  title={s.label}
                  className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center shadow-sm hover:shadow-md active:scale-90 transition-all`}
                >
                  <s.icon className='w-4 h-4 text-white' />
                </a>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='px-6 pt-6 pb-6 mt-4 border-t border-gray-100'>
            <div className='grid grid-cols-2 gap-3'>
              <button
                onClick={downloadVCard}
                className='flex items-center justify-center gap-2 bg-amber-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-amber-600 active:scale-95 transition-all shadow-lg shadow-amber-500/20'
              >
                <Download className='w-4 h-4' />
                Save Contact
              </button>
              <button
                onClick={handleShare}
                className='flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 active:scale-95 transition-all'
              >
                {shared ? (
                  <>
                    <Check className='w-4 h-4 text-green-400' />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 className='w-4 h-4' />
                    Share Card
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <p className='text-center text-[10px] text-gray-500 mt-4'>
          Utkrisht Interiors · Digital Business Card
        </p>
      </div>
    </main>
  );
}
