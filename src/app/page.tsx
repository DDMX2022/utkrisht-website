import AboutUs from '@/components/AboutUs';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';
import DesignGallery from '@/components/DesignGallery';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Portfolio from '@/components/Portfolio';
import RecentProjects from '@/components/RecentProjects';
import Services from '@/components/Services';
import Team from '@/components/Team';
import WhyChooseUs from '@/components/WhyChooseUs';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <AboutUs />

      {/* Services Section */}
      <Services />

      <Portfolio />

      <RecentProjects />

      {/* Gallery Section */}
      <DesignGallery />

      {/* Blog Section */}
      {/* <Blog /> */}

      <WhyChooseUs />

      <Team />

      <Contact />

      {/* Footer */}
      <Footer />
    </main>
  );
}
