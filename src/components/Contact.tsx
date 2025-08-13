'use client';

import { Clock, Mail, MapPin, Phone, Send, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

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
    try {
      setSubmitting(true);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to submit');
      // Reset form
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      // Close modal after submit
      setIsOpen(false);
      // Optional: basic feedback
      if (typeof window !== 'undefined') alert('Message sent successfully');
    } catch (err) {
      console.error(err);
      if (typeof window !== 'undefined') alert('Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

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

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
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
                    <p className='text-gray-300'>+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className='flex items-center space-x-4'>
                  <div className='w-12 h-12 bg-white rounded-lg flex items-center justify-center'>
                    <Mail className='h-6 w-6 text-gray-900' />
                  </div>
                  <div>
                    <h4 className='text-white font-semibold'>Email</h4>
                    <p className='text-gray-300'>info@utkrisht.com</p>
                  </div>
                </div>

                <div className='flex items-center space-x-4'>
                  <div className='w-12 h-12 bg-white rounded-lg flex items-center justify-center'>
                    <MapPin className='h-6 w-6 text-gray-900' />
                  </div>
                  <div>
                    <h4 className='text-white font-semibold'>Address</h4>
                    <p className='text-gray-300'>
                      123 Design Street
                      <br />
                      New York, NY 10001
                    </p>
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
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center'
          aria-modal='true'
          role='dialog'
        >
          {/* Backdrop */}
          <div
            className='absolute inset-0 bg-black/60'
            onClick={() => setIsOpen(false)}
          />

          {/* Dialog */}
          <div className='relative z-10 w-full max-w-2xl mx-auto px-4'>
            <div className='bg-white rounded-lg shadow-xl p-6 sm:p-8'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-2xl font-bold text-gray-900'>Send us a Message</h3>
                <button
                  type='button'
                  aria-label='Close'
                  className='p-2 rounded-md hover:bg-gray-100'
                  onClick={() => setIsOpen(false)}
                >
                  <X className='h-5 w-5 text-gray-600' />
                </button>
              </div>

              {/* Form moved into modal */}
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                      placeholder='(555) 123-4567'
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
                      <option value='residential'>Residential Design</option>
                      <option value='commercial'>Commercial Design</option>
                      <option value='consultation'>Design Consultation</option>
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
                    rows={5}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors resize-none'
                    placeholder='Tell us about your project...'
                  />
                </div>

                <Button
                  type='submit'
                  size='lg'
                  className='w-full bg-gray-900 hover:bg-gray-800'
                  disabled={submitting}
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                  <Send className='ml-2 h-5 w-5' />
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
