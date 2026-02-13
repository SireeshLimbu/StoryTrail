import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

const WelcomeFooter = () => {
  return (
    <footer id="footer" className="bg-background text-foreground py-16 border-t border-border">
      <div className="container px-6">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="font-display text-2xl font-bold">
              Story<span className="text-primary">Trail</span>
            </h3>
            <p className="mt-2 text-foreground/60 font-display text-lg">Walk the story</p>
            <p className="mt-4 text-foreground/70 max-w-md leading-relaxed">
              Stories you follow — in real places. Transforming streets, landscapes, and historic sites into immersive experiences.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Explore</h4>
            <ul className="space-y-3">
              <li><a href="#stop-2" className="text-foreground/70 hover:text-foreground transition-colors">What is StoryTrail?</a></li>
              <li><a href="#stop-3" className="text-foreground/70 hover:text-foreground transition-colors">How It Works</a></li>
              <li><a href="#stop-5" className="text-foreground/70 hover:text-foreground transition-colors">For Partners</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-foreground/70">
                <Mail className="w-4 h-4" />
                <span>hello@storytrail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-foreground/50 text-sm">
            © {new Date().getFullYear()} StoryTrail. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-foreground/50 hover:text-foreground text-sm transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default WelcomeFooter;
