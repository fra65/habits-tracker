import Footer from "@/components/layout/footer"
import Navbar from "@/components/layout/navbar"
import HeroSection from "@/components/sections/heroSection"
import FeaturesSection from "@/components/sections/featuresSection"
import HowItWorksSection from "@/components/sections/howItWorksSection"
import TestimonialsSection from "@/components/sections/testimonialsSection"
import CtaSection from "@/components/sections/ctaSection"

export default function HabitsTrackerLanding() {
  return (
    <div className="w-full bg-background">


      {/* Header */}
      <Navbar />


      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />


      {/* How it Works */}
      <HowItWorksSection />


      {/* Testimonials */}
      <TestimonialsSection />


      {/* CTA Section */}
      <CtaSection />

      {/* Footer */}
      <Footer />


    </div>
  )
}
