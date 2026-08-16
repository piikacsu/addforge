import HeroSection from '../sections/HeroSection'
import ShowcasePinned from '../sections/ShowcasePinned'
import FeaturesGrid from '../sections/FeaturesGrid'
import CTABanner from '../sections/CTABanner'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A12]">
      <HeroSection />
      <ShowcasePinned />
      <FeaturesGrid />
      <CTABanner
        title="Want to Create Your Own?"
        subtitle="Build a custom website ad with our ad generator. Choose your style, add your link, and export in seconds."
        buttonText="Launch Ad Builder →"
        buttonTo="/create"
      />
    </div>
  )
}
