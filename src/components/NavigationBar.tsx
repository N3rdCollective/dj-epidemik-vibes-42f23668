import { Navigation } from "lucide-react";
import { Link } from "react-router-dom";

export const NavigationBar = () => {
  return (
    <nav className="bg-black/50 backdrop-blur-sm border-y border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Navigation className="text-primary w-6 h-6" />
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="text-white hover:text-primary transition-colors">Home</Link>
              <Link to="#about" className="text-white hover:text-primary transition-colors">About</Link>
              <Link to="#music" className="text-white hover:text-primary transition-colors">Music</Link>
              <Link to="#events" className="text-white hover:text-primary transition-colors">Events</Link>
              <Link to="#contact" className="text-white hover:text-primary transition-colors">Contact</Link>
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