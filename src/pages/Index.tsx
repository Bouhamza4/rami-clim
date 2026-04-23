import { HeroTech } from "@/components/sections/HeroTech";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { AboutSection } from "@/components/sections/AboutSection";
import { BeforeAfterSection } from "@/components/sections/BeforeAfterSection";
import { Reviews } from "@/components/sections/Reviews";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";

const Index = () => (
  <>
    <HeroTech />
    <ServicesGrid compact />
    <AboutSection />
    <BeforeAfterSection />
    <Reviews />
    <FAQ />
    <CTA />
  </>
);

export default Index;
