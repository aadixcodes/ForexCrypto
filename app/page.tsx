import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { Features } from "@/components/features";
import { Contact } from "@/components/contact";
import { Trusted } from "@/components/trust";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <Features />
      <AboutSection />
      <Trusted />
      <Contact />
    </div>
  );
}