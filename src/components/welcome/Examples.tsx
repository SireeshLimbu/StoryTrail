import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen } from "lucide-react";

const Examples = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 bg-background text-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="text-primary font-display font-semibold tracking-wide uppercase text-sm">
            Examples
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold text-foreground">
            One platform. <span className="text-gradient">Many stories.</span>
          </h2>
          <p className="mt-6 text-xl text-foreground/70 leading-relaxed">
            From historic towns to hidden landscapes, from dramatic events to everyday lives — StoryTrail adapts to place, time, and audience.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-card shadow-soft"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-warm flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold text-card-foreground">
              Every place has a story.
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Examples;
