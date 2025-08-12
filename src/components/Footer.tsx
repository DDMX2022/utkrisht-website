import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact Us', href: '#contact' },
    { name: 'Blog', href: '#blog' },
  ];

  const legalLinks = [
    { name: 'FAQ', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Refund & Cancellation Policy', href: '#' },
  ];

  return (
    <footer className='bg-gray-900 text-white'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Company Info */}
          <div>
            <h3 className='text-2xl font-bold mb-4'>Utkrisht</h3>
            <p className='text-gray-300 mb-6 leading-relaxed'>
              Transforming spaces with innovative, Vastu-compliant interior
              design solutions. Your vision, our expertise.
            </p>
            <div className='flex space-x-4'>
              <a
                href='#'
                className='bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors'
                aria-label='Instagram'
              >
                <Instagram className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors'
                aria-label='Facebook'
              >
                <Facebook className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors'
                aria-label='LinkedIn'
              >
                <Linkedin className='h-5 w-5' />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-lg font-semibold mb-4'>Quick Links</h4>
            <ul className='space-y-2'>
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className='text-gray-300 hover:text-white transition-colors'
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className='text-lg font-semibold mb-4'>Legal</h4>
            <ul className='space-y-2'>
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className='text-gray-300 hover:text-white transition-colors'
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className='text-lg font-semibold mb-4'>Contact Info</h4>
            <div className='space-y-3 text-sm'>
              <div className='flex items-start space-x-3'>
                <MapPin className='h-5 w-5 text-gray-400 mt-1 flex-shrink-0' />
                <p className='text-gray-300'>
                  Plot No 1, Shakti Khand -2, 4th Floor, SS Co-Working,
                  Indirapuram, Ghaziabad
                </p>
              </div>
              <div className='flex items-center space-x-3'>
                <Phone className='h-5 w-5 text-gray-400' />
                <p className='text-gray-300'>+91-XXXXXXXXXX</p>
              </div>
              <div className='flex items-center space-x-3'>
                <Mail className='h-5 w-5 text-gray-400' />
                <p className='text-gray-300'>info@utkrishtinteriors.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className='border-t border-gray-800 mt-12 pt-8 text-center'>
          <p className='text-gray-400'>
            © 2025 Utkrisht Interiors. All rights reserved. | Designed with ❤️
            for beautiful spaces
          </p>
        </div>
      </div>
    </footer>
  );
}
