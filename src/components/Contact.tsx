'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Mail, MapPin, Phone, Send, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const MAP_URL = 'https://maps.app.goo.gl/uPzf7nA2CzJhAW3w8?g_st=aw';
const CONTACT_EMAIL = 'utkrisht.interiors@gmail.com';
const PRIMARY_PHONE = '9891347353';
const SECONDARY_PHONE = '9999258001';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  // New: modal open/close state
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    function handleOpenRequest() {
      setIsOpen(true);
    }
    window.addEventListener('open-contact-form', handleOpenRequest);
    return () =>
      window.removeEventListener('open-contact-form', handleOpenRequest);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    try {
      setSubmitting(true);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'Contact Form' }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitError('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  function closeModal() {
    setIsOpen(false);
    setSubmitted(false);
    setSubmitError(null);
  }

  return (
    <section id='contact' className='py-20 bg-gray-900'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-white mb-4'>
            Get In Touch
          </h2>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
            Ready to transform your space? Contact us today for a consultation
            and let's bring your vision to life.
          </p>
        </div>

        <div className='hidden md:grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Contact Information */}
          <div className='space-y-8'>
            <div>
              <h3 className='text-2xl font-bold text-white mb-6'>
                Contact Information
              </h3>
              <div className='space-y-6'>
                <div className='flex items-center space-x-4'>
                  <div className='w-12 h-12 bg-white rounded-lg flex items-center justify-center'>
                    <Phone className='h-6 w-6 text-gray-900' />
                  </div>
                  <div>
                    <h4 className='text-white font-semibold'>Phone</h4>
                    <div className='space-y-1 text-gray-300'>
                      <a
                        href={`tel:+91${PRIMARY_PHONE}`}
                        className='block hover:text-white transition-colors'
                      >
                        +91 {PRIMARY_PHONE}
                      </a>
                      <a
                        href={`tel:+91${SECONDARY_PHONE}`}
                        className='block hover:text-white transition-colors'
                      >
                        +91 {SECONDARY_PHONE}
                      </a>
                    </div>
                  </div>
                </div>

                <div className='flex items-center space-x-4'>
                  <div className='w-12 h-12 bg-white rounded-lg flex items-center justify-center'>
                    <Mail className='h-6 w-6 text-gray-900' />
                  </div>
                  <div>
                    <h4 className='text-white font-semibold'>Email</h4>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className='text-gray-300 hover:text-white transition-colors'
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                </div>

                <div className='flex items-center space-x-4'>
                  <div className='w-12 h-12 bg-white rounded-lg flex items-center justify-center'>
                    <MapPin className='h-6 w-6 text-gray-900' />
                  </div>
                  <div>
                    <h4 className='text-white font-semibold'>Address</h4>
                    <a
                      href={MAP_URL}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='block text-gray-300 hover:text-white transition-colors'
                    >
                      Plot No. 1, 4th floor - A 405 -Shakti Khand 2
                      <br />
                      Indirapuram, Ghaziabad, Uttar Pradesh 201014
                    </a>
                  </div>
                </div>

                <div className='flex items-center space-x-4'>
                  <div className='w-12 h-12 bg-white rounded-lg flex items-center justify-center'>
                    <Clock className='h-6 w-6 text-gray-900' />
                  </div>
                  <div>
                    <h4 className='text-white font-semibold'>Business Hours</h4>
                    <p className='text-gray-300'>
                      Mon - Fri: 9:00 AM - 6:00 PM
                      <br />
                      Sat: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form trigger */}
          <div className='bg-white rounded-lg p-8 flex flex-col items-start justify-center'>
            <h3 className='text-2xl font-bold text-gray-900 mb-4'>
              Send us a Message
            </h3>
            <p className='text-gray-600 mb-6'>
              Open the form in a modal to send us your project details.
            </p>
            <Button
              type='button'
              size='lg'
              className='bg-gray-900 hover:bg-gray-800'
              onClick={() => setIsOpen(true)}
              disabled={submitting}
            >
              {submitting ? 'Please wait...' : 'Open Contact Form'}
              <Send className='ml-2 h-5 w-5' />
            </Button>
          </div>
        </div>

        {/* Mobile */}
        <div className='md:hidden space-y-4'>
          <div className='grid grid-cols-3 gap-2'>
            <a
              href={`tel:+91${PRIMARY_PHONE}`}
              className='flex flex-col items-center gap-1.5 py-3.5 rounded-xl bg-white/10 active:bg-white/20 transition-colors'
            >
              <Phone className='h-5 w-5 text-amber-400' />
              <span className='text-xs font-medium text-white'>Call</span>
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className='flex flex-col items-center gap-1.5 py-3.5 rounded-xl bg-white/10 active:bg-white/20 transition-colors'
            >
              <Mail className='h-5 w-5 text-amber-400' />
              <span className='text-xs font-medium text-white'>Email</span>
            </a>
            <a
              href={MAP_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='flex flex-col items-center gap-1.5 py-3.5 rounded-xl bg-white/10 active:bg-white/20 transition-colors'
            >
              <MapPin className='h-5 w-5 text-amber-400' />
              <span className='text-xs font-medium text-white'>Map</span>
            </a>
          </div>

          <div className='bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4'>
            <div className='flex items-start gap-3'>
              <Phone className='h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5' />
              <div className='text-sm text-gray-300 space-y-0.5'>
                <a href={`tel:+91${PRIMARY_PHONE}`} className='block active:text-white'>
                  +91 {PRIMARY_PHONE}
                </a>
                <a href={`tel:+91${SECONDARY_PHONE}`} className='block active:text-white'>
                  +91 {SECONDARY_PHONE}
                </a>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <Mail className='h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5' />
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className='text-sm text-gray-300 active:text-white break-all'
              >
                {CONTACT_EMAIL}
              </a>
            </div>
            <div className='flex items-start gap-3'>
              <MapPin className='h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5' />
              <a
                href={MAP_URL}
                target='_blank'
                rel='noopener noreferrer'
                className='text-sm text-gray-300 active:text-white leading-relaxed'
              >
                Plot No. 1, 4th floor - A 405 -Shakti Khand 2, Indirapuram,
                Ghaziabad, Uttar Pradesh 201014
              </a>
            </div>
            <div className='flex items-start gap-3'>
              <Clock className='h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5' />
              <p className='text-sm text-gray-300 leading-relaxed'>
                Mon - Fri: 9:00 AM - 6:00 PM
                <br />
                Sat: 10:00 AM - 4:00 PM
              </p>
            </div>
          </div>

          <button
            type='button'
            onClick={() => setIsOpen(true)}
            disabled={submitting}
            className='w-full flex items-center justify-center gap-2 bg-amber-500 active:bg-amber-600 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl active:scale-95 transition-all'
          >
            {submitting ? 'Please wait...' : 'Send us a Message'}
            <Send className='h-5 w-5' />
          </button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className='fixed inset-0 z-[200] flex items-end sm:items-center justify-center overflow-y-auto sm:py-4'
            aria-modal='true'
            role='dialog'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            {/* Dialog */}
            <motion.div
              className='relative z-10 w-full sm:max-w-2xl sm:mx-auto'
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className='bg-white rounded-t-2xl sm:rounded-lg shadow-xl max-h-[88vh] flex flex-col overflow-hidden'>
                <div className='flex-shrink-0 px-5 sm:px-8 pt-4 sm:pt-6 pb-4 border-b border-gray-100'>
                  <div className='mx-auto mb-3 h-1.5 w-10 rounded-full bg-gray-200 sm:hidden' />
                  <div className='flex items-center justify-between'>
                    <h3 className='text-xl sm:text-2xl font-bold text-gray-900'>
                      Send us a Message
                    </h3>
                    <button
                      type='button'
                      aria-label='Close'
                      className='p-2 rounded-full bg-gray-100 active:bg-gray-200 transition-colors'
                      onClick={closeModal}
                    >
                      <X className='h-5 w-5 text-gray-600' />
                    </button>
                  </div>
                </div>

                <div className='overflow-y-auto p-5 sm:p-8'>
                {submitted ? (
                  <div className='text-center bg-gray-50 rounded-lg p-8'>
                    <p className='text-xl font-semibold text-gray-900 mb-2'>
                      Message sent successfully
                    </p>
                    <p className='text-gray-600 mb-6'>
                      Thanks for reaching out — we&apos;ll get back to you
                      shortly.
                    </p>
                    <Button
                      type='button'
                      className='bg-gray-900 hover:bg-gray-800 active:scale-95'
                      onClick={closeModal}
                    >
                      Close
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-6'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label
                          htmlFor='name'
                          className='block text-sm font-medium text-gray-700 mb-2'
                        >
                          Full Name *
                        </label>
                        <input
                          type='text'
                          id='name'
                          name='name'
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors'
                          placeholder='Your full name'
                        />
                      </div>

                      <div>
                        <label
                          htmlFor='email'
                          className='block text-sm font-medium text-gray-700 mb-2'
                        >
                          Email Address *
                        </label>
                        <input
                          type='email'
                          id='email'
                          name='email'
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors'
                          placeholder='your@email.com'
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label
                          htmlFor='phone'
                          className='block text-sm font-medium text-gray-700 mb-2'
                        >
                          Phone Number
                        </label>
                        <input
                          type='tel'
                          id='phone'
                          name='phone'
                          value={formData.phone}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors'
                          placeholder={`+91 ${PRIMARY_PHONE}`}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor='service'
                          className='block text-sm font-medium text-gray-700 mb-2'
                        >
                          Service Interest
                        </label>
                        <select
                          id='service'
                          name='service'
                          value={formData.service}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors'
                        >
                          <option value=''>Select a service</option>
                          <option value='residential'>
                            Residential Design
                          </option>
                          <option value='commercial'>Commercial Design</option>
                          <option value='consultation'>
                            Design Consultation
                          </option>
                          <option value='renovation'>Home Renovation</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor='message'
                        className='block text-sm font-medium text-gray-700 mb-2'
                      >
                        Message *
                      </label>
                      <textarea
                        id='message'
                        name='message'
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors resize-none'
                        placeholder='Tell us about your project...'
                      />
                    </div>

                    {submitError && (
                      <p className='text-sm text-red-600'>{submitError}</p>
                    )}

                    <Button
                      type='submit'
                      size='lg'
                      className='w-full bg-gray-900 hover:bg-gray-800 active:scale-95'
                      disabled={submitting}
                    >
                      {submitting ? 'Sending...' : 'Send Message'}
                      <Send className='ml-2 h-5 w-5' />
                    </Button>
                  </form>
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
