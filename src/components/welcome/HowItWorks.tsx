import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Map, Route, HelpCircle, Sparkles } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Map,
    title: "Choose a story",
    description: "Each StoryTrail is tied to a real location — a town, a landscape, a site.",
  },
  {
    number: "2",
    icon: Route,
    title: "Walk the route",
    description: "An AI-supported guide leads you through the environment. Each stop reveals a new chapter.",
  },
  {
    number: "3",
    icon: HelpCircle,
    title: "Solve the challenge",
    description: "A challenge, puzzle or riddle must be solved before entering the new chapter.",
  },
  {
    number: "4",
    icon: Sparkles,
    title: "Experience the story",
    description: "Through sound, narrative, and discovery, the place itself becomes part of the story.",
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how" ref={ref} className="py-32 bg-card text-card-foreground">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-primary font-display font-semibold tracking-wide uppercase text-sm">
            How It Works
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold text-card-foreground">
            Follow the <span className="text-gradient">trail</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative text-center"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-primary/10" />
              )}

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-warm shadow-warm flex items-center justify-center mb-6">
                  <step.icon className="w-10 h-10 text-primary-foreground" />
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-card-foreground text-card font-display font-bold text-sm flex items-center justify-center">
                  {step.number}
                </span>
              </div>

              <h3 className="font-display text-xl font-bold mb-3 text-card-foreground">
                {step.title}
              </h3>
              <p className="text-card-foreground/70 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
