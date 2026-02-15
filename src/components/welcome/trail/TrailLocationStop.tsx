import { useRef, useState, useEffect, type RefObject } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { TrailStop } from "./trailData";

interface TrailLocationStopProps {
  stop: TrailStop;
  index: number;
  scrollYProgress: MotionValue<number>;
  totalStops: number;
  containerRef: RefObject<HTMLDivElement>;
  getPathFraction: (targetY: number) => number;
}

const TrailLocationStop = ({
  stop,
  index,
  scrollYProgress,
  totalStops,
  containerRef,
  getPathFraction,
}: TrailLocationStopProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30% 0px -30% 0px" });
  const [isRevealed, setIsRevealed] = useState(false);
  const [threshold, setThreshold] = useState((index + 0.5) / totalStops);

  // Measure pin's actual DOM position → convert to SVG Y → binary-search path.
  // Walker is at (pathY / 500) * containerHeight from container top.
  // Pin is at pinOffset from container top.
  // They overlap when pathY = 500 * pinOffset / containerHeight.
  useEffect(() => {
    const compute = () => {
      const pin = pinRef.current;
      const container = containerRef.current;
      if (!pin || !container) return;
      // Pin's offset within the container (scroll-independent)
      const pinOffset = pin.getBoundingClientRect().top - container.getBoundingClientRect().top
        + pin.getBoundingClientRect().height / 2;
      const containerHeight = container.scrollHeight;
      if (containerHeight <= 0) return;
      // Convert to SVG viewBox Y (0-500)
      const targetY = 500 * pinOffset / containerHeight;
      // Binary-search the path to find scrollYProgress when walker is at this Y
      setThreshold(getPathFraction(targetY));
    };

    const timer = setTimeout(compute, 150);
    const ro = new ResizeObserver(compute);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => { clearTimeout(timer); ro.disconnect(); };
  }, [containerRef, getPathFraction]);

  const isFirst = index === 0;
  const isLast = stop.ctaText != null;
  const isRight = index === 4 ? false : index % 2 === 0; // 0,2 → right; 1,3 → left; 4 forced left (trail curves right)

  // Reactive — card appears/disappears as walker crosses threshold
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsRevealed(latest >= threshold);
  });

  return (
    <div
      ref={ref}
      id={`stop-${stop.id}`}
      className={`min-h-[150vh] flex flex-col items-center justify-center px-6 py-24 relative ${
        isFirst ? "pt-32" : index === 2 ? "pb-[60vh]" : index === 3 ? "pb-[80vh]" : ""
      }`}
    >
      {/* Location Pin */}
      <div ref={pinRef} className={index === 2 ? "translate-x-[25vw]" : index === 4 ? "translate-x-[4.5vw]" : ""}>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative z-20 mb-4"
      >
        {/* Celebration burst when walker arrives */}
        <AnimatePresence>
          {isRevealed && (
            <>
              {/* Expanding rings */}
              {[0, 0.15, 0.3].map((delay) => (
                <motion.div
                  key={`ring-${delay}`}
                  initial={{ scale: 0.5, opacity: 0.9 }}
                  animate={{ scale: 8, opacity: 0 }}
                  transition={{ duration: 1, delay }}
                  className="absolute inset-0 rounded-full border-2 border-red-500"
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Ongoing pulse ring */}
        {isRevealed && (
          <motion.div
            animate={{
              scale: [1, 2.5, 2.5],
              opacity: [0.4, 0, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="absolute inset-0 rounded-full bg-red-500/20"
          />
        )}

        {/* Pin — Google Maps style teardrop, bounces on reveal */}
        <motion.div
          animate={
            isRevealed
              ? { y: 0, scale: [1, 1.3, 1] }
              : {
                  y: [0, -20, 0, -14, 0, 0, 0],
                }
          }
          transition={
            isRevealed
              ? { duration: 0.4, times: [0, 0.4, 1] }
              : {
                  duration: 2,
                  times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 1],
                  repeat: Infinity,
                  repeatDelay: 1,
                }
          }
          className="relative flex items-center justify-center"
        >
          <svg width="48" height="64" viewBox="0 0 24 32" className="drop-shadow-lg">
            <path
              d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20C24 5.373 18.627 0 12 0z"
              fill="#EF4444"
            />
            <circle cx="12" cy="12" r="5" fill="white" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Label */}
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative z-20 text-primary font-display font-semibold tracking-wide uppercase text-xs mb-2 bg-card px-3 py-1 rounded-full border border-border shadow-soft"
      >
        {stop.label}
      </motion.span>
      </div>

      {/* Dotted connector + Card — fades in/out with walker */}
      <div className="h-0 overflow-visible w-full -mt-[250px]">
      <AnimatePresence>
        {isRevealed && stop.steps ? (
          /* Step cards only — no wrapper card */
          <motion.div
            key="steps-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-20 w-full max-w-6xl mx-auto px-4 pt-[300px]"
          >
            <div className="w-px h-12 border-l-2 border-dashed border-primary/30 mx-auto" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {stop.steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 1 }}
                  className="relative bg-card rounded-3xl p-8 border border-border shadow-soft text-center"
                >
                  <div className="relative w-16 h-16 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-5">
                    <step.icon className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-sm">
                      {i + 1}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-lg text-card-foreground">
                    {step.title}
                  </h4>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : isRevealed ? (
          <motion.div
            key="card-section"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 z-20 w-full"
          >
            {isRight && <div className="hidden md:block" />}
            <div className={`flex flex-col items-center ${isRight ? 'md:items-start md:pl-[20%]' : 'md:items-end md:pr-[20%]'}`}>
              {/* Dotted connector line */}
              <div className="w-px h-12 border-l-2 border-dashed border-primary/30" />

              {/* Content Card — beside the trail */}
              <div
                className="max-w-[450px] w-full bg-card rounded-3xl p-9 shadow-soft border border-border text-center"
              >
              {/* Title */}
              <h2
                className={`font-display font-bold leading-tight text-card-foreground ${
                  isFirst ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"
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
                  className={`mt-3 font-display ${
                    isFirst
                      ? "text-2xl text-foreground/80"
                      : "text-lg text-primary"
                  }`}
                >
                  {stop.subtitle}
                </p>
              )}

              {/* Description */}
              <p className="mt-5 text-muted-foreground leading-relaxed text-base">
                {stop.description}
              </p>

              {/* Features */}
              {stop.features && (
                stop.features.length === 6 ? (
                  <div className="mt-5 grid grid-cols-3 gap-3 w-full">
                    {stop.features.map((feat) => (
                      <div
                        key={feat.text}
                        className="flex flex-col items-center gap-2 bg-primary/10 rounded-2xl px-2 py-4 text-center"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                          <feat.icon className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-display font-semibold text-xs text-foreground leading-tight">
                          {feat.text}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : stop.features.length > 4 ? (
                  <div className="mt-5 flex flex-col gap-2 w-full">
                    {stop.features.map((feat, i) => (
                      <motion.div
                        key={feat.text}
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.15 }}
                        className="flex items-center gap-4 bg-primary/10 rounded-2xl px-4 py-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                          <feat.icon className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-display font-semibold text-sm text-foreground text-left">
                          {feat.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 grid grid-cols-2 gap-3 w-full">
                    {stop.features.map((feat) => (
                      <div
                        key={feat.text}
                        className="flex items-center gap-3 bg-primary/10 rounded-2xl px-4 py-3"
                      >
                        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                          <feat.icon className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="font-display font-semibold text-sm text-foreground text-left">
                          {feat.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* CTA buttons (Last stop) */}
              {isLast && (
                <div className="mt-8 flex flex-col gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-warm shadow-warm hover:opacity-90 transition-opacity font-display w-full text-base py-6"
                  >
                    <Link to={stop.ctaLink || "/stories"}>
                      {stop.ctaText}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  {stop.partnerCta && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="font-display border-2 w-full text-base py-6"
                      onClick={() =>
                        document
                          .getElementById("footer")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      <Handshake className="mr-2 w-5 h-5" />
                      Partner with us
                    </Button>
                  )}
                </div>
              )}
              </div>
            </div>
            {!isRight && <div className="hidden md:block" />}
          </motion.div>
        ) : null}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default TrailLocationStop;
