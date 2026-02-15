import { useRef, useCallback, useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import TrailPath from "./TrailPath";
import TrailMapDecorations from "./TrailMapDecorations";
import TrailWalker from "./TrailWalker";
import TrailLocationStop from "./TrailLocationStop";
import TrailProgressIndicator from "./TrailProgressIndicator";
import { trailStops, TRAIL_PATH_D } from "./trailData";

const TrailExperience = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const [showScrollHint, setShowScrollHint] = useState(true);
  const hintReady = useRef(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Grace period — don't hide the hint until 2s after mount (avoids HMR / restored scroll killing it)
  useEffect(() => {
    const timer = setTimeout(() => { hintReady.current = true; }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Hide scroll hint once user actually scrolls
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (hintReady.current && latest > 0.02) setShowScrollHint(false);
  });

  // Binary-search the SVG path to find the scrollYProgress fraction
  // where the walker reaches a given y in the 0-500 viewBox.
  // Each stop calls this with its own measured targetY — fully independent.
  const getPathFraction = useCallback((targetY: number) => {
    const path = pathRef.current;
    if (!path) return 0;
    const totalLen = path.getTotalLength();
    let lo = 0, hi = totalLen;
    for (let iter = 0; iter < 50; iter++) {
      const mid = (lo + hi) / 2;
      if (path.getPointAtLength(mid).y < targetY) lo = mid;
      else hi = mid;
    }
    return Math.min((lo + hi) / 2 / totalLen, 1);
  }, []);

  return (
    <section ref={containerRef} className="relative isolate bg-background">
      {/* Hidden SVG — used by stops to binary-search the path */}
      <svg
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
        viewBox="0 0 100 500"
        aria-hidden="true"
      >
        <path ref={pathRef} d={TRAIL_PATH_D} fill="none" />
      </svg>

      {/* Map-like grid background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 trail-grid-bg opacity-[0.03]" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* SVG winding trail */}
      <TrailPath scrollYProgress={scrollYProgress} />

      {/* Adventure map decorations (trees, mountains, castle, lake, rocks) */}
      <TrailMapDecorations />

      {/* Walking character that follows the trail */}
      <TrailWalker scrollYProgress={scrollYProgress} />

      {/* Location stops */}
      <div className="relative z-10">
        {trailStops.map((stop, index) => (
          <TrailLocationStop
            key={stop.id}
            stop={stop}
            index={index}
            scrollYProgress={scrollYProgress}
            totalStops={trailStops.length}
            containerRef={containerRef}
            getPathFraction={getPathFraction}
          />
        ))}
      </div>

      {/* Fixed progress dots */}
      <TrailProgressIndicator
        scrollYProgress={scrollYProgress}
        totalStops={trailStops.length}
      />

      {/* Scroll-down hint — fixed to viewport, just below walker spawn */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            key="scroll-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            transition={{ duration: 0.8, delay: 1 }}
            className="fixed top-[18%] left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none"
          >
            {/* Bouncing double chevron — large */}
            <motion.div
              animate={{ y: [0, 18, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary drop-shadow-lg">
                <polyline points="7 3 12 8 17 3" />
                <polyline points="7 9 12 14 17 9" />
              </svg>
            </motion.div>

            {/* Label */}
            <span className="mt-4 text-base font-display font-semibold text-primary tracking-widest uppercase">
              Scroll down
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TrailExperience;
