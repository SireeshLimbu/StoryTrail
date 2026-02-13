import { motion, useTransform, type MotionValue } from "framer-motion";

interface TrailProgressIndicatorProps {
  scrollYProgress: MotionValue<number>;
  totalStops: number;
}

const TrailProgressIndicator = ({
  scrollYProgress,
  totalStops,
}: TrailProgressIndicatorProps) => {
  return (
    <div
      className="fixed right-3 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3"
      aria-hidden="true"
    >
      {Array.from({ length: totalStops }, (_, i) => (
        <ProgressDot
          key={i}
          index={i}
          totalStops={totalStops}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
};

interface ProgressDotProps {
  index: number;
  totalStops: number;
  scrollYProgress: MotionValue<number>;
}

const ProgressDot = ({
  index,
  totalStops,
  scrollYProgress,
}: ProgressDotProps) => {
  const segmentStart = index / totalStops;
  const segmentEnd = (index + 1) / totalStops;

  const scale = useTransform(scrollYProgress, (v) =>
    v >= segmentStart && v < segmentEnd ? 1.5 : 1
  );

  const backgroundColor = useTransform(scrollYProgress, (v) =>
    v >= segmentStart && v < segmentEnd
      ? "hsl(42 53% 55%)"
      : "hsl(37 20% 85%)"
  );

  const handleClick = () => {
    const el = document.getElementById(`stop-${index + 1}`);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.button
      className="w-2.5 h-2.5 rounded-full cursor-pointer"
      style={{ scale, backgroundColor }}
      onClick={handleClick}
      aria-label={`Go to stop ${index + 1}`}
    />
  );
};

export default TrailProgressIndicator;
