import AboutUs from '@/components/AboutUs';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Packages from '@/components/Packages';
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

      {/* Packages Section */}
      <Packages />

      {/* Projects Section */}
      <RecentProjects />

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
