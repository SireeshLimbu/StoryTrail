import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const WelcomeHero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-[15%] w-64 h-64 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-32 left-[10%] w-96 h-96 rounded-full bg-accent/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="container relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
        >
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-display font-medium text-primary">Walk the story</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl text-center max-w-5xl leading-tight tracking-[-0.04em] font-display font-semibold"
        >
          Story<span className="text-gradient">Trail</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-4 text-xl md:text-2xl lg:text-3xl text-center text-foreground/80 tracking-[0.03em] font-display"
        >
          Walk the story
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 text-xl md:text-2xl text-muted-foreground text-center max-w-3xl leading-relaxed"
        >
          StoryTrail turns streets, landscapes, and historic sites into immersive stories and thrilling challenges you experience by walking through them.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mt-12"
        >
          <Button asChild size="lg" className="bg-gradient-warm shadow-warm hover:opacity-90 transition-opacity text-lg px-8 py-6 font-display">
            <Link to="/stories">
              Explore stories
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 font-display border-2"
            onClick={() => document.getElementById('who')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Partner with us
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-foreground/20 flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 rounded-full bg-foreground/40" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WelcomeHero;
