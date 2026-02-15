import { useState, useRef, useEffect, useCallback } from "react";
import {
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { TRAIL_PATH_D } from "./trailData";

interface TrailWalkerProps {
  scrollYProgress: MotionValue<number>;
}

const VIEWBOX_W = 100;
const VIEWBOX_H = 500;

type Facing = "front" | "left" | "right";

/* Shared color constants */
const C = {
  skin: "hsl(28 50% 70%)",
  hair: "hsl(25 40% 25%)",
  shirt: "white",
  shirtStroke: "hsl(0 0% 25%)",
  pants: "hsl(220 20% 25%)",
  shoe: "hsl(25 30% 30%)",
  cap: "hsl(48 95% 50%)",
  capTop: "hsl(48 95% 58%)",
  pack: "hsl(15 40% 35%)",
  packDark: "hsl(15 40% 28%)",
  packPocket: "hsl(15 40% 30%)",
  buckle: "hsl(40 30% 55%)",
  bedroll: "hsl(120 15% 40%)",
  bedrollStroke: "hsl(120 15% 30%)",
  stick: "hsl(30 40% 35%)",
  stickTip: "hsl(0 0% 50%)",
  eye: "hsl(220 20% 25%)",
  outline: "hsl(0 0% 20%)",
};

type AnimState = "idle" | "walking" | "frozen";

const TrailWalker = ({ scrollYProgress }: TrailWalkerProps) => {
  const [animState, setAnimState] = useState<AnimState>("idle");
  const [facing, setFacing] = useState<Facing>("front");
  const timeoutRef = useRef<number>();
  const pathRef = useRef<SVGPathElement>(null);
  const walkerRef = useRef<HTMLDivElement>(null);

  // Set initial position
  useEffect(() => {
    if (!pathRef.current || !walkerRef.current) return;
    const point = pathRef.current.getPointAtLength(0);
    walkerRef.current.style.left = `${(point.x / VIEWBOX_W) * 100}%`;
    walkerRef.current.style.top = `${(point.y / VIEWBOX_H) * 100}%`;
  }, []);

  const handleChange = useCallback(
    (latest: number) => {
      if (!pathRef.current || !walkerRef.current) return;

      const totalLength = pathRef.current.getTotalLength();
      const point = pathRef.current.getPointAtLength(
        Math.min(latest, 0.98) * totalLength
      );

      // Update position directly on DOM for performance (no re-renders)
      walkerRef.current.style.left = `${(point.x / VIEWBOX_W) * 100}%`;
      walkerRef.current.style.top = `${(point.y / VIEWBOX_H) * 100}%`;

      // Determine facing by sampling the path direction slightly ahead
      const currentLen = Math.min(latest, 0.98) * totalLength;
      const ahead = pathRef.current.getPointAtLength(
        Math.min(currentLen + 5, totalLength)
      );
      const dx = ahead.x - point.x;
      if (Math.abs(dx) > 0.15) {
        setFacing(dx > 0 ? "right" : "left");
      } else {
        setFacing("front");
      }

      // Toggle walking animation — freeze mid-stride instead of snapping to idle
      setAnimState("walking");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setAnimState("frozen"), 150);
    },
    []
  );

  useMotionValueEvent(scrollYProgress, "change", handleChange);

  const isSide = facing === "left" || facing === "right";
  const showAnim = animState !== "idle";

  // Class names must be full literals (not template-constructed) so Tailwind's
  // purge scanner can detect them inside @layer utilities.
  const lArm = !showAnim ? "" : isSide ? "trail-walk-left-arm" : "trail-walk-front-left-arm";
  const rArm = !showAnim ? "" : isSide ? "trail-walk-right-arm" : "trail-walk-front-right-arm";
  const lThigh = !showAnim ? "" : isSide ? "trail-walk-left-thigh" : "trail-walk-front-left-thigh";
  const rThigh = !showAnim ? "" : isSide ? "trail-walk-right-thigh" : "trail-walk-front-right-thigh";
  const lCalf = !showAnim ? "" : isSide ? "trail-walk-left-calf" : "trail-walk-front-left-calf";
  const rCalf = !showAnim ? "" : isSide ? "trail-walk-right-calf" : "trail-walk-front-right-calf";

  return (
    <>
      {/* Hidden SVG for path calculations */}
      <svg
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        aria-hidden="true"
      >
        <path ref={pathRef} d={TRAIL_PATH_D} fill="none" />
      </svg>

      {/* Walking hiker */}
      <div
        ref={walkerRef}
        className={`absolute z-30 pointer-events-none${animState === "frozen" ? " trail-walk-frozen" : ""}`}
        style={{ transform: "translate(-50%, -100%)" }}
      >
        <svg
          viewBox="0 0 40 56"
          width="60"
          height="84"
          className="overflow-visible"
          style={{
            transform: facing === "right" ? "scaleX(-1)" : "scaleX(1)",
            transition: "transform 0.2s ease-out",
          }}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Shadow */}
          <ellipse cx="20" cy="55" rx="8" ry="2" fill="rgba(0,0,0,0.15)" />

          {isSide ? (
            /* ===== SIDE VIEW ===== */
            <>
              {/* Left leg (two segments: thigh + calf) */}
              <g className={lThigh} style={{ transformOrigin: "18px 36px" }}>
                <line x1="18" y1="36" x2="16" y2="43" stroke={C.pants} strokeWidth="3.5" />
                <g className={lCalf} style={{ transformOrigin: "16px 43px" }}>
                  <line x1="16" y1="43" x2="14" y2="50" stroke={C.pants} strokeWidth="3.5" />
                  <ellipse cx="14" cy="51" rx="3" ry="1.5" fill={C.shoe} />
                </g>
              </g>
              {/* Right leg */}
              <g className={rThigh} style={{ transformOrigin: "22px 36px" }}>
                <line x1="22" y1="36" x2="24" y2="43" stroke={C.pants} strokeWidth="3.5" />
                <g className={rCalf} style={{ transformOrigin: "24px 43px" }}>
                  <line x1="24" y1="43" x2="26" y2="50" stroke={C.pants} strokeWidth="3.5" />
                  <ellipse cx="26" cy="51" rx="3" ry="1.5" fill={C.shoe} />
                </g>
              </g>

              {/* Torso — white shirt */}
              <path
                d="M14 18 C14 18, 13 28, 14 36 L26 36 C27 28, 26 18, 26 18 Z"
                fill={C.shirt} stroke={C.shirtStroke} strokeWidth="0.8"
              />
              <line x1="20" y1="19" x2="20" y2="35" stroke={C.shirtStroke} strokeWidth="0.5" />

              {/* Rucksack */}
              <path
                d="M23 14 C23 12, 24 11, 27 11 C30 11, 31 12, 31 14 L32 32 C32 34, 30 35, 27 35 C24 35, 22 34, 22 32 Z"
                fill={C.pack} stroke={C.packDark} strokeWidth="0.6"
              />
              <path
                d="M22.5 16 C22.5 13, 24 11, 27 11 C30 11, 31.5 13, 31.5 16 L31 17 L23 17 Z"
                fill="hsl(15 40% 40%)" stroke={C.packDark} strokeWidth="0.4"
              />
              <rect x="26" y="17" width="2" height="1.5" rx="0.3" fill={C.buckle} />
              <path
                d="M24 24 L30 24 L30 30 C30 31, 29 32, 27 32 C25 32, 24 31, 24 30 Z"
                fill={C.packPocket} stroke="hsl(15 40% 25%)" strokeWidth="0.4"
              />
              <line x1="23" y1="16" x2="22" y2="19" stroke={C.packDark} strokeWidth="0.8" />
              <line x1="23" y1="28" x2="22" y2="32" stroke={C.packDark} strokeWidth="0.8" />
              <ellipse cx="27" cy="11" rx="4" ry="1.8" fill={C.bedroll} stroke={C.bedrollStroke} strokeWidth="0.4" />

              {/* Left arm + walking stick */}
              <g className={lArm} style={{ transformOrigin: "15px 20px" }}>
                <line x1="15" y1="20" x2="10" y2="32" stroke={C.outline} strokeWidth="4.2" />
                <line x1="15" y1="20" x2="10" y2="32" stroke={C.shirt} strokeWidth="3" />
                <line x1="10" y1="12" x2="10" y2="54" stroke={C.stick} strokeWidth="1.5" />
                <line x1="7" y1="12" x2="13" y2="12" stroke={C.stick} strokeWidth="1.8" />
                <circle cx="10" cy="54" r="1" fill={C.stickTip} />
              </g>
              {/* Right arm */}
              <g className={rArm} style={{ transformOrigin: "25px 20px" }}>
                <line x1="25" y1="20" x2="30" y2="32" stroke={C.outline} strokeWidth="4.2" />
                <line x1="25" y1="20" x2="30" y2="32" stroke={C.shirt} strokeWidth="3" />
              </g>

              {/* Neck */}
              <rect x="18" y="13" width="4" height="5" rx="1" fill={C.skin} />
              {/* Head */}
              <circle cx="20" cy="10" r="6" fill={C.skin} />
              {/* Hair */}
              <path d="M14 9 C14 5, 17 3, 20 3 C23 3, 26 5, 26 9 C26 7, 24 5.5, 20 5.5 C16 5.5, 14 7, 14 9 Z" fill={C.hair} />
              {/* Cap */}
              <ellipse cx="20" cy="7" rx="7.5" ry="1.8" fill={C.cap} />
              <path d="M13.5 7 C13.5 4, 16 2, 20 2 C24 2, 26.5 4, 26.5 7" fill={C.capTop} stroke="none" />
              {/* Eye */}
              <circle cx="18" cy="10" r="0.8" fill={C.eye} />
              {/* Smile */}
              <path d="M17 12.5 Q18.5 13.5, 20 12.5" stroke={C.eye} strokeWidth="0.6" fill="none" />
            </>
          ) : (
            /* ===== FRONT VIEW ===== */
            <>
              {/* Left leg (two segments) */}
              <g className={lThigh} style={{ transformOrigin: "17px 36px" }}>
                <line x1="17" y1="36" x2="15" y2="43" stroke={C.pants} strokeWidth="3.5" />
                <g className={lCalf} style={{ transformOrigin: "15px 43px" }}>
                  <line x1="15" y1="43" x2="13" y2="50" stroke={C.pants} strokeWidth="3.5" />
                  <ellipse cx="13" cy="51" rx="3" ry="1.5" fill={C.shoe} />
                </g>
              </g>
              {/* Right leg */}
              <g className={rThigh} style={{ transformOrigin: "23px 36px" }}>
                <line x1="23" y1="36" x2="25" y2="43" stroke={C.pants} strokeWidth="3.5" />
                <g className={rCalf} style={{ transformOrigin: "25px 43px" }}>
                  <line x1="25" y1="43" x2="27" y2="50" stroke={C.pants} strokeWidth="3.5" />
                  <ellipse cx="27" cy="51" rx="3" ry="1.5" fill={C.shoe} />
                </g>
              </g>

              {/* Backpack peeking from behind */}
              <path
                d="M13 16 C13 12, 15 10, 20 10 C25 10, 27 12, 27 16 L27 33 C27 35, 25 36, 20 36 C15 36, 13 35, 13 33 Z"
                fill={C.pack} stroke={C.packDark} strokeWidth="0.5"
              />
              <ellipse cx="20" cy="10.5" rx="5" ry="1.8" fill={C.bedroll} stroke={C.bedrollStroke} strokeWidth="0.4" />

              {/* Torso — white shirt */}
              <path
                d="M14 18 C14 18, 13 28, 14 36 L26 36 C27 28, 26 18, 26 18 Z"
                fill={C.shirt} stroke={C.shirtStroke} strokeWidth="0.8"
              />
              <line x1="20" y1="19" x2="20" y2="35" stroke={C.shirtStroke} strokeWidth="0.5" />

              {/* Backpack shoulder straps */}
              <line x1="16" y1="17" x2="17" y2="27" stroke={C.packDark} strokeWidth="1.6" />
              <line x1="24" y1="17" x2="23" y2="27" stroke={C.packDark} strokeWidth="1.6" />

              {/* Left arm + walking stick */}
              <g className={lArm} style={{ transformOrigin: "14px 20px" }}>
                <line x1="14" y1="20" x2="8" y2="32" stroke={C.outline} strokeWidth="4.2" />
                <line x1="14" y1="20" x2="8" y2="32" stroke={C.shirt} strokeWidth="3" />
                <line x1="8" y1="12" x2="8" y2="54" stroke={C.stick} strokeWidth="1.5" />
                <line x1="5" y1="12" x2="11" y2="12" stroke={C.stick} strokeWidth="1.8" />
                <circle cx="8" cy="54" r="1" fill={C.stickTip} />
              </g>
              {/* Right arm */}
              <g className={rArm} style={{ transformOrigin: "26px 20px" }}>
                <line x1="26" y1="20" x2="32" y2="32" stroke={C.outline} strokeWidth="4.2" />
                <line x1="26" y1="20" x2="32" y2="32" stroke={C.shirt} strokeWidth="3" />
              </g>

              {/* Neck */}
              <rect x="18" y="13" width="4" height="5" rx="1" fill={C.skin} />
              {/* Head */}
              <circle cx="20" cy="10" r="6" fill={C.skin} />
              {/* Hair */}
              <path d="M14 8 C14 4, 17 2, 20 2 C23 2, 26 4, 26 8 C25 6, 23 5, 20 5 C17 5, 15 6, 14 8 Z" fill={C.hair} />
              {/* Cap */}
              <ellipse cx="20" cy="6.5" rx="7.5" ry="2" fill={C.cap} />
              <path d="M13 6.5 C13 3.5, 16 1.5, 20 1.5 C24 1.5, 27 3.5, 27 6.5" fill={C.capTop} stroke="none" />
              {/* Eyes */}
              <circle cx="17" cy="10" r="0.8" fill={C.eye} />
              <circle cx="23" cy="10" r="0.8" fill={C.eye} />
              {/* Smile */}
              <path d="M17.5 12.5 Q20 14, 22.5 12.5" stroke={C.eye} strokeWidth="0.6" fill="none" />
            </>
          )}
        </svg>
      </div>
    </>
  );
};

export default TrailWalker;
