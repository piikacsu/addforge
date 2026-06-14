import { HeroSection } from '../sections/HeroSection';
import { Footer } from '../components/Footer';
import { BackToTop } from '../components/BackToTop';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A12]">
      <HeroSection />
      <Footer />
      <BackToTop />
    </div>
  );
}
