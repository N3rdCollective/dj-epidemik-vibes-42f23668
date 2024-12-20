import { Hero } from "@/components/Hero";
import { LogoSection } from "@/components/LogoSection";
import { Music } from "@/components/Music";
import { About } from "@/components/About";
import { Events } from "@/components/Events";
import { Contact } from "@/components/Contact";
import { SocialFeeds } from "@/components/SocialFeeds";
import { ParallaxDivider } from "@/components/ParallaxDivider";
import { NavigationBar } from "@/components/NavigationBar";

const Index = () => {
  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      <Hero />
      <NavigationBar />
      <LogoSection />
      <About />
      <ParallaxDivider />
      <Music />
      <SocialFeeds />
      <Events />
      <Contact />
    </div>
  );
};

export default Index;