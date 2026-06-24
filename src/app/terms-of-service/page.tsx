import { FileText } from 'lucide-react';

import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const metadata = {
  title: 'Terms of Service | Utkrisht Interiors',
  description:
    'Terms and conditions for using the Utkrisht Interiors website and engaging our interior design services.',
};

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: `By accessing or using this website, or by engaging Utkrisht Interiors ("Utkrisht", "we", "us") for design or execution services, you agree to be bound by these Terms of Service. If you do not agree, please do not use this site or our services.`,
  },
  {
    title: '2. Services Offered',
    body: `Utkrisht provides interior design, architectural planning, 3D/2D visualization, Vastu consultancy, design shopping assistance, and related execution-support services, as described in our Packages section. Specific deliverables, timelines, and pricing for any engagement are confirmed in writing (email or a signed proposal/agreement) before work begins.`,
  },
  {
    title: '3. Quotations & Pricing',
    body: `Prices shown on this website are starting prices and indicative only. Final pricing depends on project scope, site conditions, material selection, and other factors, and will be confirmed with you before any payment is due. Quoted prices do not include third-party costs such as materials, furniture, contractor labour, or vendor charges unless explicitly stated.`,
  },
  {
    title: '4. Payments',
    body: `Projects are typically taken up against an advance booking amount, with the balance payable in milestones as outlined in your specific project agreement. Failure to make timely payments may result in delays or suspension of work until payment is received.`,
  },
  {
    title: '5. Project Timelines',
    body: `Estimated timelines shared with clients are based on the information available at the time of quoting. Timelines may be affected by factors outside our control, including site readiness, vendor/material availability, third-party contractor performance, and client approval turnaround. We will communicate any material changes to timelines as they arise.`,
  },
  {
    title: '6. Client Responsibilities',
    body: `Clients are responsible for providing accurate site information and measurements, timely feedback and approvals on designs/drawings, and access to the site for surveys and execution as required. Delays caused by incomplete information or delayed approvals may affect the project timeline.`,
  },
  {
    title: '7. Intellectual Property',
    body: `All concepts, mood boards, renders, drawings, and other design materials created by Utkrisht remain the intellectual property of Utkrisht Interiors until full payment for the relevant package/service has been received. Clients may use final deliverables for their own project but may not resell, redistribute, or use them for commercial publication without our written consent.`,
  },
  {
    title: '8. Cancellations & Refunds',
    body: `Cancellation and refund terms vary by package and project stage, and are governed by our Refund & Cancellation Policy and/or the specific terms agreed in your project proposal. Please contact us directly if you wish to discuss cancelling an ongoing engagement.`,
  },
  {
    title: '9. Limitation of Liability',
    body: `Utkrisht Interiors will exercise reasonable professional care in providing services, but is not liable for delays or issues caused by third-party contractors, vendors, material suppliers, or factors beyond our reasonable control. Our total liability for any claim relating to a project is limited to the fees actually paid by the client for that specific engagement.`,
  },
  {
    title: '10. Website Use',
    body: `This website and its content (text, images, branding) are the property of Utkrisht Interiors unless otherwise credited, and may not be copied or reused without permission. We make reasonable efforts to keep information on this site accurate and up to date, but do not guarantee it is free of errors at all times.`,
  },
  {
    title: '11. Governing Law',
    body: `These terms are governed by the laws of India. Any disputes arising from these terms or our services will be subject to the jurisdiction of the courts in Ghaziabad, Uttar Pradesh.`,
  },
  {
    title: '12. Contact',
    body: `For questions about these Terms of Service, contact us at utkrisht.interiors@gmail.com or +91 9891347353.`,
  },
];

export default function TermsOfServicePage() {
  return (
    <main className='bg-white'>
      <Header />
      <BottomNav />

      <section className='pt-28 pb-12 sm:pb-16 bg-gray-50'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600'>
            <FileText className='h-4 w-4' />
            Legal
          </div>
          <h1 className='text-3xl sm:text-5xl font-bold text-gray-900 mb-4'>
            Terms of Service
          </h1>
          <p className='text-sm sm:text-base text-gray-500'>
            Last updated: June 2026
          </p>
        </div>
      </section>

      <section className='py-12 sm:py-16'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-8'>
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className='text-lg sm:text-xl font-bold text-gray-900 mb-2'>
                {section.title}
              </h2>
              <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
