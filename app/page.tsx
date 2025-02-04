import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { Benefits } from "@/components/benefits";
import { Contact } from "@/components/contact";
import { Features } from "@/components/features";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <Benefits />
      <AboutSection />
      <Features />
      <Contact />
    </div>
  );
}