import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { TrailStop } from "./trailData";

interface TrailLocationStopProps {
  stop: TrailStop;
  index: number;
}

const TrailLocationStop = ({ stop, index }: TrailLocationStopProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30% 0px -30% 0px" });

  const isFirst = index === 0;
  const isLast = stop.ctaText != null;

  return (
    <div
      ref={ref}
      id={`stop-${stop.id}`}
      className={`min-h-screen flex flex-col items-center justify-center px-6 py-24 relative ${
        isFirst ? "pt-32" : ""
      }`}
    >
      {/* Location Pin */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative mb-6"
      >
        {/* Pulse ring */}
        {isInView && (
          <motion.div
            animate={{
              scale: [1, 2, 2],
              opacity: [0.5, 0, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="absolute inset-0 rounded-full bg-primary/30"
          />
        )}
        {/* Pin */}
        <div className="relative w-14 h-14 rounded-full bg-gradient-warm shadow-warm flex items-center justify-center trail-pin-glow">
          <span className="text-primary-foreground font-display font-bold text-lg">
            {index + 1}
          </span>
        </div>
      </motion.div>

      {/* Label */}
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-primary font-display font-semibold tracking-wide uppercase text-xs mb-4"
      >
        {stop.label}
      </motion.span>

      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="max-w-sm w-full bg-card rounded-2xl p-6 shadow-soft border border-border text-center"
      >
        {/* Title */}
        <h2
          className={`font-display font-bold leading-tight text-card-foreground ${
            isFirst ? "text-4xl" : "text-2xl"
          }`}
        >
          {isFirst ? (
            <>
              Story<span className="text-gradient">Trail</span>
            </>
          ) : (
            stop.title
          )}
        </h2>

        {/* Subtitle */}
        {stop.subtitle && (
          <p
            className={`mt-2 font-display ${
              isFirst
                ? "text-xl text-foreground/80"
                : "text-base text-primary"
            }`}
          >
            {stop.subtitle}
          </p>
        )}

        {/* Description */}
        <p className="mt-4 text-muted-foreground leading-relaxed text-sm">
          {stop.description}
        </p>

        {/* Features (Stop 2) */}
        {stop.features && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-5 flex flex-wrap justify-center gap-4"
          >
            {stop.features.map((feat) => (
              <div
                key={feat.text}
                className="flex items-center gap-2 text-foreground/70"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feat.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="font-display font-medium text-sm">
                  {feat.text}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {/* CTA buttons (Last stop) */}
        {isLast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 flex flex-col gap-3"
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-warm shadow-warm hover:opacity-90 transition-opacity font-display w-full"
            >
              <Link to={stop.ctaLink || "/stories"}>
                {stop.ctaText}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            {stop.partnerCta && (
              <Button
                size="lg"
                variant="outline"
                className="font-display border-2 w-full"
                onClick={() =>
                  document
                    .getElementById("footer")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Handshake className="mr-2 w-4 h-4" />
                Partner with us
              </Button>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TrailLocationStop;
