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
  const cardAreaRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30% 0px -30% 0px" });
  const [isRevealed, setIsRevealed] = useState(false);
  const [threshold, setThreshold] = useState((index + 0.5) / totalStops);
  const [hideThreshold, setHideThreshold] = useState(Infinity);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  // Measure actual card height on mobile → hide when walker passes midpoint
  useEffect(() => {
    if (!isMobile || !isRevealed) return;
    const card = cardAreaRef.current;
    const container = containerRef.current;
    if (!card || !container) return;

    const measure = () => {
      const containerHeight = container.scrollHeight;
      if (containerHeight <= 0) return;
      const cardRect = card.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      // 75% point of the entire card area (from top of first card to bottom of last)
      const cardMidOffset = cardRect.top - containerRect.top + cardRect.height * 0.75;
      const hideTargetY = 500 * cardMidOffset / containerHeight;
      setHideThreshold(getPathFraction(Math.min(hideTargetY, 499)));
    };

    // Wait a frame for the card to render fully
    requestAnimationFrame(measure);
  }, [isMobile, isRevealed, containerRef, getPathFraction]);

  const isFirst = index === 0;
  const isLast = stop.ctaText != null;
  const isRight = index === 4 ? false : index % 2 === 0; // 0,2 → right; 1,3 → left; 4 forced left (trail curves right)

  // Reactive — card appears/disappears as walker crosses threshold
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsRevealed(isMobile ? latest >= threshold && latest < hideThreshold : latest >= threshold);
  });

  return (
    <div
      ref={ref}
      id={`stop-${stop.id}`}
      className={`min-h-[100vh] md:min-h-[150vh] flex flex-col items-center justify-center px-4 md:px-6 py-16 md:py-24 relative ${
        isFirst ? "pt-28 md:pt-32" : index === 1 ? "pb-[28vh] md:pb-0" : index === 2 ? "pb-[40vh] md:pb-[60vh]" : index === 3 ? "pb-[30vh] md:pb-[80vh]" : index === 4 ? "pb-[80vh] md:pb-[80vh]" : index === 5 ? "pt-[5vh]" : ""
      }`}
    >
      {/* Location Pin */}
      <div ref={pinRef} className={index === 1 ? "-translate-x-[9vw] md:translate-x-0" : index === 2 ? "translate-x-[24vw] md:translate-x-[25vw]" : index === 4 ? "translate-x-[2vw] md:translate-x-[4.5vw]" : ""}>
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

      {/* Mobile backdrop — dims & blurs background when card is showing */}
      <AnimatePresence>
        {isRevealed && isMobile && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-10 bg-background/50 backdrop-blur-sm pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Dotted connector + Card — fades in/out with walker */}
      <div className="h-0 overflow-visible w-full md:-mt-[250px] relative z-20">
      <AnimatePresence>
        {isRevealed && stop.steps ? (
          /* Step cards only — no wrapper card */
          <motion.div
            ref={cardAreaRef}
            key="steps-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="z-20 w-full max-w-6xl mx-auto px-2 md:px-4 pt-4 md:pt-[300px]"
          >
            <div className="w-px h-12 border-l-2 border-dashed border-primary/30 mx-auto" />
            <div className="flex flex-col gap-2 md:grid md:grid-cols-4 md:gap-5">
              {stop.steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -40, md: { opacity: 0, y: 20 } }}
                  animate={{ opacity: 1, x: 0, md: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.4, delay: i * 0.15 }}
                  className="relative bg-card rounded-2xl md:rounded-3xl p-4 md:p-8 border border-border shadow-soft flex items-center gap-4 md:flex-col md:text-center"
                >
                  <div className="relative w-10 h-10 md:w-16 md:h-16 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 md:mx-auto md:mb-5">
                    <step.icon className="w-5 h-5 md:w-8 md:h-8 text-amber-600 dark:text-amber-400" />
                    <span className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 w-6 h-6 md:w-7 md:h-7 rounded-full bg-primary text-primary-foreground text-xs md:text-sm font-bold flex items-center justify-center shadow-sm">
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display font-bold text-sm md:text-lg text-card-foreground">
                      {step.title}
                    </h4>
                    <p className="mt-1 md:mt-3 text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : isRevealed ? (
          <motion.div
            ref={cardAreaRef}
            key="card-section"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.4, delay: 0 } }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-col items-center md:grid md:grid-cols-2 z-20 w-full"
          >
            {isRight && <div className="hidden md:block" />}
            <div className={`flex flex-col items-center ${isRight ? 'md:items-start md:pl-[20%]' : 'md:items-end md:pr-[20%]'}`}>
              {/* Dotted connector line */}
              <div className="w-px h-12 border-l-2 border-dashed border-primary/30" />

              {/* Content Card — beside the trail */}
              <div
                className="max-w-[320px] md:max-w-[450px] w-full bg-card rounded-2xl md:rounded-3xl p-5 md:p-9 shadow-soft border border-border text-center"
              >
              {/* Title */}
              <h2
                className={`font-display font-bold leading-tight text-card-foreground ${
                  isFirst ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"
                }`}
              >
                {isFirst ? (
                  <>
                    Welcome To Story<span className="text-gradient">Trail</span>
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

              {isFirst && (
                <p className="mt-4 text-sm text-muted-foreground/70 italic">
                  Scroll further to learn more about StoryTrail.
                </p>
              )}

              {/* Features */}
              {stop.features && (
                stop.features.length === 6 ? (
                  <div className="mt-4 md:mt-5 grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 w-full">
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
