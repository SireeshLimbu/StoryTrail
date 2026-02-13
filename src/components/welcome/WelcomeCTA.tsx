import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const WelcomeCTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 bg-card text-card-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight text-card-foreground">
            Ready to walk the{" "}
            <span className="text-gradient">story</span>?
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="bg-gradient-warm shadow-warm hover:opacity-90 transition-opacity text-lg px-10 py-7 font-display">
              <Link to="/stories">
                Explore stories
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-10 py-7 font-display border-2">
              <Handshake className="mr-2 w-5 h-5" />
              Partner with StoryTrail
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WelcomeCTA;
