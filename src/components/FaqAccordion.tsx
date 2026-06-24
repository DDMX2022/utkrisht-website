'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'What areas do you serve?',
    answer:
      'We primarily serve Delhi NCR, including Noida, Greater Noida, Ghaziabad, and Indirapuram. For larger or out-of-town projects, please reach out and we’ll let you know if we can take it on.',
  },
  {
    question: 'What design packages do you offer?',
    answer:
      'We offer five packages: E-Design Studio (online design guidance), Concept-to-Visualization (floor plans + 3D renders), Design Shopping Companion (in-person shopping support), Concept to Execution (full design + technical drawings), and Architectural Planning & Drawing. See the Packages section for full details and pricing.',
  },
  {
    question: 'How long does a typical project take?',
    answer:
      'It depends on scope. E-Design and visualization packages are usually delivered within 1–3 weeks. Full execution projects vary based on site size and complexity — we’ll share a clear timeline once we understand your project.',
  },
  {
    question: 'Do you offer Vastu-compliant design?',
    answer:
      'Yes. Vastu-based planning and recommendations are available as an optional add-on across most of our packages, including architectural planning.',
  },
  {
    question: 'How do I book a consultation?',
    answer:
      'Use the "Get a Quote" button or the contact form on this site with your name, phone number, and a short note about your project. Our team will reach out to schedule a consultation.',
  },
  {
    question: 'What’s included in the package price?',
    answer:
      'Package pricing covers the deliverables listed for that package (consultations, drawings, renders, documentation, etc.). Site execution, materials, furniture, and vendor costs are quoted separately based on your project’s scope once finalized.',
  },
  {
    question: 'Can a package be customized?',
    answer:
      'Yes. Listed prices are starting prices — every package can be tailored to your specific project size, scope, and timeline after an initial discussion.',
  },
  {
    question: 'Do you work with my own contractor or execution team?',
    answer:
      'Yes, we’re happy to collaborate with your existing team. We also work with a network of trusted execution partners — see our Collaborators page to learn more about them.',
  },
  {
    question: 'How can I get in touch directly?',
    answer:
      'Call us at +91 9891347353 / +91 9999258001, email utkrisht.interiors@gmail.com, or use the contact form on this site — we typically respond within 1–2 business days.',
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className='space-y-3'>
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.question}
            className='bg-white rounded-xl border border-gray-200 overflow-hidden'
          >
            <button
              type='button'
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className='w-full flex items-center justify-between gap-4 text-left px-4 sm:px-6 py-4 active:bg-gray-50 transition-colors'
            >
              <span className='font-semibold text-gray-900 text-sm sm:text-base'>
                {faq.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-amber-600 flex-shrink-0 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className='overflow-hidden'
                >
                  <p className='px-4 sm:px-6 pb-4 text-sm sm:text-base text-gray-600 leading-relaxed'>
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
