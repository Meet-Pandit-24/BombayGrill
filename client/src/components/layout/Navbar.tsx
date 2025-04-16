import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MenuIcon, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClasses = isScrolled
    ? "bg-white/95 backdrop-blur-sm shadow-md"
    : "bg-white shadow-md";

  return (
    <nav
      id="navbar"
      className={`fixed w-full z-50 transition-all duration-300 ${navClasses}`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/#home" className="flex items-center space-x-2">
            <span className="text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
            <span className="font-heading font-bold text-2xl">Spice Haven</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#home" className="text-dark hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link href="/#menu" className="text-dark hover:text-primary transition-colors font-medium">
              Menu
            </Link>
            <Link href="/#about" className="text-dark hover:text-primary transition-colors font-medium">
              About
            </Link>
            <Link href="/#gallery" className="text-dark hover:text-primary transition-colors font-medium">
              Gallery
            </Link>
            <Link href="/#contact" className="text-dark hover:text-primary transition-colors font-medium">
              Contact
            </Link>
            <Link href="/#reservation">
              <Button className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full">
                Reservations
              </Button>
            </Link>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </Button>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <Link href="/#home" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-dark hover:text-primary">
              Home
            </Link>
            <Link href="/#menu" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-dark hover:text-primary">
              Menu
            </Link>
            <Link href="/#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-dark hover:text-primary">
              About
            </Link>
            <Link href="/#gallery" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-dark hover:text-primary">
              Gallery
            </Link>
            <Link href="/#contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-dark hover:text-primary">
              Contact
            </Link>
            <Link href="/#reservation" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-primary font-medium">
              Reservations
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
