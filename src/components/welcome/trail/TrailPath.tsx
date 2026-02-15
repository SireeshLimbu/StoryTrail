import { motion, useTransform, type MotionValue } from "framer-motion";
import { TRAIL_PATH_D } from "./trailData";

interface TrailPathProps {
  scrollYProgress: MotionValue<number>;
}

const TrailPath = ({ scrollYProgress }: TrailPathProps) => {
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <svg
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      viewBox="0 0 100 500"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      {/* Faded background trail (shows full route ahead) */}
      <path
        d={TRAIL_PATH_D}
        stroke="hsl(42 53% 55% / 0.12)"
        strokeWidth="1.5"
        strokeDasharray="3 5"
        fill="none"
      />
      {/* Animated foreground trail (draws as user scrolls) */}
      <motion.path
        d={TRAIL_PATH_D}
        stroke="hsl(42 53% 55%)"
        strokeWidth="2"
        strokeDasharray="4 5"
        fill="none"
        style={{ pathLength }}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default TrailPath;
