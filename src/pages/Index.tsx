import { Hero } from "@/components/Hero";
import { Music } from "@/components/Music";
import { About } from "@/components/About";
import { Events } from "@/components/Events";
import { Contact } from "@/components/Contact";
import { SocialFeeds } from "@/components/SocialFeeds";

const Index = () => {
  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      <Hero />
      <Music />
      <About />
      <SocialFeeds />
      <Events />
      <Contact />
    </div>
  );
};

export default Index;