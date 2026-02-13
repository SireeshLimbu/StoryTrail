import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Headphones, FileText, Smartphone, Sparkles } from "lucide-react";

const WhatIsStoryTrail = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="what" ref={ref} className="py-32 bg-background">
      <div className="container px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-primary font-display font-semibold tracking-wide uppercase text-sm"
          >
            What is StoryTrail?
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 font-display text-4xl md:text-5xl font-bold leading-tight"
          >
            Stories are better when you{" "}
            <span className="text-gradient">walk through them.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-xl text-muted-foreground leading-relaxed"
          >
            StoryTrail is a platform for place-based storytelling. We create guided story experiences where visitors follow a narrative step by step — in the exact place where it unfolds.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-xl text-muted-foreground leading-relaxed"
          >
            Using AI-supported audio guides, text, and interactive elements, we transform real environments into living stories you explore with your body, not just your screen.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-wrap justify-center gap-8"
          >
            <div className="flex items-center gap-3 text-foreground/70">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Headphones className="w-6 h-6 text-primary" />
              </div>
              <span className="font-display font-medium">Audio</span>
            </div>
            <div className="flex items-center gap-3 text-foreground/70">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <span className="font-display font-medium">Text</span>
            </div>
            <div className="flex items-center gap-3 text-foreground/70">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <span className="font-display font-medium">Interactive</span>
            </div>
            <div className="flex items-center gap-3 text-foreground/70">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <span className="font-display font-medium">AI-supported</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsStoryTrail;
