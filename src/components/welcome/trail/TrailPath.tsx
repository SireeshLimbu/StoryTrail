import { motion, useTransform, type MotionValue } from "framer-motion";

interface TrailPathProps {
  scrollYProgress: MotionValue<number>;
}

const TrailPath = ({ scrollYProgress }: TrailPathProps) => {
  const pathLength = useTransform(scrollYProgress, [0, 0.95], [0, 1]);

  // Winding trail through 5 stops:
  // Stop 1: center (x=50, y=50)
  // Stop 2: left   (x=30, y=150)
  // Stop 3: right  (x=70, y=250)
  // Stop 4: left   (x=35, y=350)
  // Stop 5: center (x=50, y=450)
  const trailPath = `
    M 50 10
    C 50 40, 35 70, 30 100
    C 25 130, 30 140, 30 150
    C 30 170, 55 190, 70 220
    C 78 240, 70 245, 70 250
    C 70 260, 45 280, 35 320
    C 28 345, 35 345, 35 350
    C 35 360, 55 390, 60 420
    C 63 440, 55 445, 50 450
    L 50 490
  `;

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
        d={trailPath}
        stroke="hsl(42 53% 55% / 0.12)"
        strokeWidth="1.5"
        strokeDasharray="3 5"
        fill="none"
      />
      {/* Animated foreground trail (draws as user scrolls) */}
      <motion.path
        d={trailPath}
        stroke="hsl(42 53% 55%)"
        strokeWidth="2"
        strokeDasharray="4 5"
        fill="none"
        style={{ pathLength }}
        strokeLinecap="round"
      />
      {/* Location dots on the trail */}
      {[
        { cx: 50, cy: 50 },
        { cx: 30, cy: 150 },
        { cx: 70, cy: 250 },
        { cx: 35, cy: 350 },
        { cx: 50, cy: 450 },
      ].map((dot, i) => (
        <circle
          key={i}
          cx={dot.cx}
          cy={dot.cy}
          r="3"
          fill="hsl(42 53% 55% / 0.15)"
        />
      ))}

      {/* Finish flag at trail end */}
      <g transform="translate(50, 488)">
        {/* Flag pole */}
        <line x1="0" y1="0" x2="0" y2="-10" stroke="hsl(0 0% 7% / 0.6)" strokeWidth="0.6" />
        {/* Flag */}
        <rect x="0" y="-10" width="6" height="4" fill="hsl(42 53% 55%)" />
        {/* Checkered pattern on flag */}
        <rect x="0" y="-10" width="3" height="2" fill="hsl(0 0% 100%)" />
        <rect x="3" y="-8" width="3" height="2" fill="hsl(0 0% 100%)" />
      </g>
    </svg>
  );
};

export default TrailPath;
