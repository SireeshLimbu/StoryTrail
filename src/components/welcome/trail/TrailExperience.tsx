import { useRef } from "react";
import { useScroll } from "framer-motion";
import TrailPath from "./TrailPath";
import TrailLocationStop from "./TrailLocationStop";
import TrailProgressIndicator from "./TrailProgressIndicator";
import { trailStops } from "./trailData";

const TrailExperience = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={containerRef} className="relative bg-background">
      {/* Map-like grid background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 trail-grid-bg opacity-[0.03]" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* SVG winding trail */}
      <TrailPath scrollYProgress={scrollYProgress} />

      {/* Location stops */}
      <div className="relative z-10">
        {trailStops.map((stop, index) => (
          <TrailLocationStop key={stop.id} stop={stop} index={index} />
        ))}
      </div>

      {/* Fixed progress dots */}
      <TrailProgressIndicator
        scrollYProgress={scrollYProgress}
        totalStops={trailStops.length}
      />
    </section>
  );
};

export default TrailExperience;
