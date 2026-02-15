import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const WelcomeNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/90 backdrop-blur-md shadow-soft" : "bg-transparent"
      }`}
    >
      <div className="container px-6">
        <div className="flex items-center justify-between h-20">
          <a href="/" className="flex items-center gap-2 font-display text-2xl font-bold">
            <span className="tracking-[-0.04em]">Story<span className="text-primary">Trail</span></span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#stop-2" className="font-display text-sm font-medium hover:text-primary transition-colors">What is StoryTrail?</a>
            <a href="#stop-3" className="font-display text-sm font-medium hover:text-primary transition-colors">How It Works</a>
            <a href="#stop-5" className="font-display text-sm font-medium hover:text-primary transition-colors">For Partners</a>
            <Button asChild className="bg-gradient-warm shadow-warm hover:opacity-90 transition-opacity font-display">
              <Link to="/login?mode=signup">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-6 space-y-4"
          >
            <a href="#stop-2" onClick={() => setIsMobileMenuOpen(false)} className="block font-display text-sm font-medium hover:text-primary transition-colors">What is StoryTrail?</a>
            <a href="#stop-3" onClick={() => setIsMobileMenuOpen(false)} className="block font-display text-sm font-medium hover:text-primary transition-colors">How It Works</a>
            <a href="#stop-5" onClick={() => setIsMobileMenuOpen(false)} className="block font-display text-sm font-medium hover:text-primary transition-colors">For Partners</a>
            <Button asChild className="w-full bg-gradient-warm shadow-warm hover:opacity-90 transition-opacity font-display">
              <Link to="/login?mode=signup">Sign Up</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default WelcomeNavbar;
