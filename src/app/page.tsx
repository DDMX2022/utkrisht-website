import AboutUs from '@/components/AboutUs';
import Blog from '@/components/Blog';
import BottomNav from '@/components/BottomNav';
import CollaboratorsTeaser from '@/components/CollaboratorsTeaser';
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
      <BottomNav />
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

      <CollaboratorsTeaser />

      <Contact />

      {/* Footer */}
      <Footer />
    </main>
  );
}
