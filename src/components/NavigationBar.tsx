import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";

export const NavigationBar = () => {
  const { user, isAdmin } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const scrollToLogo = (e: React.MouseEvent) => {
    e.preventDefault();
    const logoSection = document.querySelector('.logo-section');
    if (logoSection) {
      logoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-black/50 backdrop-blur-sm sticky top-0 w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-8">
            <a href="/" onClick={scrollToLogo} className="text-white hover:text-primary">
              Home
            </a>
            <a href="#about" className="text-white hover:text-primary">
              About
            </a>
            <a href="#music" className="text-white hover:text-primary">
              Music
            </a>
            <a href="#events" className="text-white hover:text-primary">
              Events
            </a>
            <a href="#contact" className="text-white hover:text-primary">
              Contact
            </a>
          </div>
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <>
                <span className="text-primary text-sm">Admin Access</span>
                <Link to="/admin" className="text-white hover:text-primary">
                  Dashboard
                </Link>
              </>
            )}
            {user ? (
              <Button
                variant="ghost"
                className="text-white hover:text-primary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-white hover:text-primary"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};