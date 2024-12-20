import { Navigation } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export const NavigationBar = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('section');
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        const scrollPosition = window.scrollY;
        setIsSticky(scrollPosition >= heroHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToLogo = () => {
    const logoSection = document.querySelector('.logo-section');
    if (logoSection) {
      logoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`${isSticky ? 'fixed top-0 left-0 right-0 z-50' : ''} bg-black/50 backdrop-blur-sm border-y border-primary/20`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Navigation className="text-primary w-6 h-6" />
            <div className="hidden md:flex space-x-8">
              <button onClick={scrollToLogo} className="text-white hover:text-primary transition-colors">Home</button>
              <button onClick={() => scrollToSection('about')} className="text-white hover:text-primary transition-colors">About</button>
              <button onClick={() => scrollToSection('music')} className="text-white hover:text-primary transition-colors">Music</button>
              <button onClick={() => scrollToSection('events')} className="text-white hover:text-primary transition-colors">Events</button>
              <button onClick={() => scrollToSection('contact')} className="text-white hover:text-primary transition-colors">Contact</button>
            </div>
          </div>
          <button className="md:hidden text-white">
            <Navigation className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};