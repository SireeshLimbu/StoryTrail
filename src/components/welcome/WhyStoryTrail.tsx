import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Footprints, Lightbulb, Users, Building2, Puzzle, Timer, Sparkles } from "lucide-react";

const features = [
  { icon: MapPin, text: "Designed for real places" },
  { icon: Footprints, text: "Built for walking and discovery" },
  { icon: Sparkles, text: "AI-supported voice guides that respond to you" },
  { icon: Lightbulb, text: "Based on research, storytelling, and design" },
  { icon: Puzzle, text: "Solve location-based challenges together" },
  { icon: Timer, text: "Compete to finish fast or take time to enjoy the surroundings" },
  { icon: Users, text: "Accessible for families, schools, and visitors" },
  { icon: Building2, text: "Scalable to cities, regions, and destinations" },
];

const WhyStoryTrail = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 bg-background text-foreground">
      <div className="container px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-display font-semibold tracking-wide uppercase text-sm">
              Why StoryTrail?
            </span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold leading-tight text-foreground">
              More than a tour.{" "}
              <span className="text-gradient">More than a story.</span>
            </h2>
            <p className="mt-6 text-lg text-foreground/70 leading-relaxed">
              StoryTrail works just as well for history as for fiction, education as for entertainment.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-secondary shadow-soft hover:shadow-warm transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-warm flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-display font-medium text-lg text-secondary-foreground">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyStoryTrail;
