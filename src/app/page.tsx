import { LandingNav } from "@/features/landing/components/landing-nav";
import { LandingFooter } from "@/features/landing/components/landing-footer";
import { HeroSection } from "@/features/landing/components/hero-section";
import { WhyChooseSection } from "@/features/landing/components/why-choose-section";
import { HowItWorksSection } from "@/features/landing/components/how-it-works-section";
import { ForYouSection } from "@/features/landing/components/for-you-section";
import { ComparisonSection } from "@/features/landing/components/comparison-section";
import { CtaBanner } from "@/features/landing/components/cta-banner";
import { FaqSection } from "@/features/landing/components/faq-section";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNav />
      <main className="flex-1">
        <HeroSection />
        <WhyChooseSection />
        <HowItWorksSection />
        <ForYouSection />
        <ComparisonSection />
        <FaqSection />
        <CtaBanner />
      </main>
      <LandingFooter />
    </div>
  );
}
