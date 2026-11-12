import Link from "next/link";
import { HeroSection } from "@/components/home/HeroSection";
import { AudienceCards } from "@/components/home/AudienceCards";
import { StatsSection } from "@/components/home/StatsSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { WhySection } from "@/components/home/WhySection";
import { IndustriesSection } from "@/components/home/IndustriesSection";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AudienceCards />
      <StatsSection />
      <ProcessSection />
      <WhySection />
      <IndustriesSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
