/**
 * Map decorations layer — positioned with CSS percentages (like the walker)
 * so each SVG keeps its own aspect ratio and doesn't distort.
 * Sizes are in px so they look consistent on all screen widths.
 */

import mooseImg from "@/images/moose.png";
import deerImg from "@/images/deer.png";
import rabbitImg from "@/images/rabbit.png";

/* ── Shared warm palette (matches StoryTrail brand) ── */
const P = {
  trunk: "hsl(25 35% 32%)",
  trunkLight: "hsl(25 30% 42%)",
  leafDark: "hsl(140 28% 32%)",
  leaf: "hsl(140 28% 40%)",
  leafLight: "hsl(140 25% 50%)",
  bushDark: "hsl(135 22% 35%)",
  bush: "hsl(135 22% 45%)",
  rockDark: "hsl(30 10% 48%)",
  rock: "hsl(30 10% 58%)",
  rockLight: "hsl(30 10% 68%)",
  snow: "hsl(0 0% 94%)",
  mtDark: "hsl(220 8% 50%)",
  mt: "hsl(220 8% 60%)",
  mtLight: "hsl(220 8% 70%)",
  stone: "hsl(30 15% 55%)",
  stoneDark: "hsl(30 15% 42%)",
  stoneLight: "hsl(30 15% 68%)",
  water: "hsl(200 45% 65%)",
  waterLight: "hsl(200 40% 78%)",
  waterDark: "hsl(200 45% 52%)",
  reed: "hsl(80 25% 40%)",
  flag: "hsl(0 55% 50%)",
};

/* ── Decoration wrapper: absolute-positioned, no pointer events ── */
const Decor = ({
  left,
  top,
  w,
  h,
  children,
  className = "",
}: {
  left: string;
  top: string;
  w: number;
  h: number;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`absolute pointer-events-none ${className}`}
    style={{ left, top, width: w, height: h, transform: "translate(-50%, -100%)" }}
  >
    {children}
  </div>
);

/* ── Tree cluster: mixed pines + deciduous + bushes ── */
const TreeCluster = ({ w = 70, h = 55 }: { w?: number; h?: number }) => (
  <svg viewBox="0 0 70 55" width={w} height={h} fill="none">
    {/* Bush back */}
    <ellipse cx="15" cy="48" rx="10" ry="5" fill={P.bushDark} />
    <ellipse cx="58" cy="50" rx="8" ry="4" fill={P.bush} />
    {/* Pine left */}
    <rect x="18" y="30" width="2.5" height="10" fill={P.trunk} />
    <polygon points="19.25,12 28,32 10.5,32" fill={P.leafDark} />
    <polygon points="19.25,6 26,22 12.5,22" fill={P.leaf} />
    {/* Deciduous center */}
    <rect x="37" y="28" width="3" height="14" fill={P.trunkLight} />
    <circle cx="38.5" cy="22" r="9" fill={P.leaf} />
    <circle cx="33" cy="25" r="6" fill={P.leafLight} />
    <circle cx="44" cy="24" r="6.5" fill={P.leafDark} />
    {/* Small pine right */}
    <rect x="56" y="35" width="2" height="8" fill={P.trunk} />
    <polygon points="57,22 63,37 51,37" fill={P.leaf} />
    <polygon points="57,17 61.5,28 52.5,28" fill={P.leafLight} />
    {/* Tiny bush front */}
    <ellipse cx="44" cy="50" rx="6" ry="3.5" fill={P.leafLight} />
  </svg>
);

/* ── Small bush pair ── */
const Bushes = ({ w = 40, h = 22 }: { w?: number; h?: number }) => (
  <svg viewBox="0 0 40 22" width={w} height={h} fill="none">
    <ellipse cx="12" cy="17" rx="11" ry="5" fill={P.bush} />
    <ellipse cx="10" cy="15" rx="8" ry="4.5" fill={P.leafLight} />
    <ellipse cx="30" cy="19" rx="8" ry="3.5" fill={P.bushDark} />
    <ellipse cx="29" cy="17" rx="6" ry="3" fill={P.leaf} />
    {/* Grass tufts */}
    <line x1="22" y1="20" x2="21" y2="15" stroke={P.leafLight} strokeWidth="0.7" strokeLinecap="round" />
    <line x1="24" y1="20" x2="24" y2="14.5" stroke={P.leaf} strokeWidth="0.7" strokeLinecap="round" />
    <line x1="26" y1="20" x2="27" y2="15.5" stroke={P.leafLight} strokeWidth="0.7" strokeLinecap="round" />
  </svg>
);

/* ── Mountain range with snow caps ── */
const Mountains = ({ w = 90, h = 55 }: { w?: number; h?: number }) => (
  <svg viewBox="0 0 90 55" width={w} height={h} fill="none">
    {/* Far mountain */}
    <polygon points="60,8 90,55 30,55" fill={P.mtLight} />
    <polygon points="60,8 65,18 55,18" fill={P.snow} />
    {/* Main peak */}
    <polygon points="35,2 72,55 0,55" fill={P.mt} />
    <polygon points="35,2 41,14 29,14" fill={P.snow} />
    <polygon points="35,2 38,8 32,10" fill="white" />
    {/* Ridge detail */}
    <line x1="35" y1="2" x2="50" y2="25" stroke={P.mtDark} strokeWidth="0.5" opacity="0.4" />
    <line x1="35" y1="2" x2="20" y2="28" stroke={P.mtDark} strokeWidth="0.4" opacity="0.3" />
    {/* Small foreground hill */}
    <polygon points="75,35 90,55 60,55" fill={P.mtDark} opacity="0.3" />
    {/* Trees at base */}
    <polygon points="12,42 16,55 8,55" fill={P.leafDark} opacity="0.5" />
    <polygon points="22,40 27,55 17,55" fill={P.leaf} opacity="0.4" />
    <polygon points="70,44 74,55 66,55" fill={P.leafDark} opacity="0.4" />
  </svg>
);

/* ── Castle with towers and walls ── */
const CastleDecor = ({ w = 60, h = 55 }: { w?: number; h?: number }) => (
  <svg viewBox="0 0 60 55" width={w} height={h} fill="none">
    {/* Base wall */}
    <rect x="8" y="28" width="44" height="27" fill={P.stone} />
    <rect x="8" y="28" width="44" height="4" fill={P.stoneDark} />
    {/* Wall texture lines */}
    <line x1="10" y1="38" x2="50" y2="38" stroke={P.stoneDark} strokeWidth="0.3" opacity="0.3" />
    <line x1="10" y1="44" x2="50" y2="44" stroke={P.stoneDark} strokeWidth="0.3" opacity="0.3" />
    {/* Gate */}
    <rect x="22" y="38" width="12" height="17" rx="6" fill={P.stoneDark} />
    <rect x="24" y="40" width="8" height="15" rx="4" fill="hsl(25 20% 22%)" />
    {/* Gate detail */}
    <line x1="28" y1="40" x2="28" y2="55" stroke={P.stoneDark} strokeWidth="0.5" />
    {/* Left tower */}
    <rect x="2" y="12" width="14" height="43" fill={P.stoneLight} />
    <rect x="2" y="12" width="14" height="3" fill={P.stoneDark} />
    {/* Left battlements */}
    <rect x="1" y="8" width="4" height="5" fill={P.stone} />
    <rect x="7" y="8" width="4" height="5" fill={P.stone} />
    <rect x="13" y="8" width="4" height="5" fill={P.stone} />
    {/* Left window */}
    <rect x="7" y="20" width="4" height="6" rx="2" fill="hsl(200 30% 75%)" />
    <line x1="9" y1="20" x2="9" y2="26" stroke={P.stoneDark} strokeWidth="0.4" />
    {/* Right tower (taller) */}
    <rect x="42" y="5" width="16" height="50" fill={P.stone} />
    <rect x="42" y="5" width="16" height="3" fill={P.stoneDark} />
    {/* Right battlements */}
    <rect x="41" y="1" width="4" height="5" fill={P.stoneDark} />
    <rect x="47" y="1" width="4" height="5" fill={P.stoneDark} />
    <rect x="53" y="1" width="4" height="5" fill={P.stoneDark} />
    {/* Right windows */}
    <rect x="48" y="14" width="4" height="6" rx="2" fill="hsl(200 30% 75%)" />
    <line x1="50" y1="14" x2="50" y2="20" stroke={P.stoneDark} strokeWidth="0.4" />
    <rect x="48" y="28" width="4" height="6" rx="2" fill="hsl(200 30% 75%)" />
    {/* Flag */}
    <line x1="50" y1="1" x2="50" y2="-8" stroke={P.stoneDark} strokeWidth="0.8" />
    <polygon points="50,-8 58,-5.5 50,-3" fill={P.flag} />
    {/* Wall battlements */}
    {[10, 16, 22, 32, 38].map((bx) => (
      <rect key={bx} x={bx} y="25" width="3" height="4" fill={P.stoneDark} />
    ))}
  </svg>
);

/* ── River — flowing from left to right across the entire map ── */
const RiverDecor = ({ w = 4000, h = 280 }: { w?: number; h?: number }) => (
  <svg viewBox="-50 -5 1100 130" width={w} height={h} fill="none">
    {/* Shore/bank edge — subtle sandy rim */}
    <path
      d="M-50,32 Q125,5 300,38 Q475,68 650,28 Q825,-2 1050,35
         L1050,88 Q825,55 650,88 Q475,118 300,82 Q125,52 -50,85 Z"
      fill="hsl(200 40% 45%)"
      opacity="0.12"
    />
    {/* Main water body */}
    <path
      d="M-50,35 Q125,10 300,42 Q475,70 650,32 Q825,2 1050,38
         L1050,85 Q825,52 650,85 Q475,115 300,78 Q125,48 -50,82 Z"
      fill="hsl(210 55% 28%)"
    />
    {/* Mid layer — slightly lighter */}
    <path
      d="M-50,40 Q125,18 300,47 Q475,72 650,37 Q825,10 1050,42
         L1050,80 Q825,48 650,80 Q475,110 300,73 Q125,43 -50,77 Z"
      fill="hsl(210 50% 33%)"
    />
    {/* Deep center channel */}
    <path
      d="M-50,48 Q125,30 300,54 Q475,75 650,45 Q825,22 1050,50
         L1050,72 Q825,40 650,67 Q475,95 300,68 Q125,35 -50,68 Z"
      fill="hsl(215 55% 24%)"
      opacity="0.5"
    />
    {/* Wave highlights */}
    <path d="M50,48 Q100,42 150,50" stroke="hsl(200 35% 50%)" strokeWidth="0.8" opacity="0.3" />
    <path d="M280,58 Q330,52 380,60" stroke="hsl(200 35% 52%)" strokeWidth="0.7" opacity="0.25" />
    <path d="M520,45 Q570,38 620,47" stroke="hsl(200 35% 48%)" strokeWidth="0.8" opacity="0.3" />
    <path d="M750,42 Q800,36 850,44" stroke="hsl(200 35% 50%)" strokeWidth="0.6" opacity="0.2" />
    <path d="M150,62 Q190,57 230,64" stroke="hsl(200 35% 55%)" strokeWidth="0.5" opacity="0.2" />
    <path d="M680,58 Q720,52 760,60" stroke="hsl(200 35% 52%)" strokeWidth="0.5" opacity="0.2" />
    {/* Shore rocks */}
    <ellipse cx="80" cy="82" rx="3" ry="1.5" fill={P.rockDark} opacity="0.3" />
    <ellipse cx="350" cy="80" rx="2.5" ry="1.3" fill={P.rock} opacity="0.25" />
    <ellipse cx="580" cy="86" rx="3" ry="1.5" fill={P.rockDark} opacity="0.3" />
    <ellipse cx="900" cy="38" rx="2.5" ry="1.3" fill={P.rock} opacity="0.25" />
    <ellipse cx="200" cy="36" rx="2" ry="1.2" fill={P.rockDark} opacity="0.25" />
    <ellipse cx="750" cy="35" rx="3" ry="1.5" fill={P.rock} opacity="0.3" />
    {/* Reeds along banks */}
    {[40, 120, 250, 420, 580, 720, 880, 960].map((rx, i) => {
      const isBottom = i % 2 === 0;
      const bankY = isBottom ? 82 + (rx % 5) : 36 - (rx % 4);
      return (
        <g key={rx}>
          <line x1={rx} y1={bankY} x2={rx - 0.5} y2={bankY - 8} stroke={P.reed} strokeWidth="0.7" strokeLinecap="round" />
          <ellipse cx={rx - 0.5} cy={bankY - 8.5} rx="1.2" ry="2.2" fill={P.reed} opacity="0.6" />
        </g>
      );
    })}
  </svg>
);

/* ── Wooden bridge — planks with side rails, viewed from above ── */
const Bridge = ({ w = 70, h = 90 }: { w?: number; h?: number }) => (
  <svg viewBox="0 0 36 50" preserveAspectRatio="none" width={w} height={h} fill="none">
    {/* Side rails */}
    <rect x="1" y="0" width="2" height="50" rx="0.5" fill="hsl(30 40% 30%)" />
    <rect x="33" y="0" width="2" height="50" rx="0.5" fill="hsl(30 40% 30%)" />
    {/* Planks */}
    {[1, 7, 13, 19, 25, 31, 37, 43].map((y) => (
      <rect key={y} x="3" y={y} width="30" height="4.5" rx="0.5" fill="hsl(30 30% 48%)" stroke="hsl(30 25% 35%)" strokeWidth="0.4" />
    ))}
    {/* Plank wood-grain highlights */}
    {[1, 7, 13, 19, 25, 31, 37, 43].map((y) => (
      <line key={`g-${y}`} x1="5" y1={y + 1.2} x2="31" y2={y + 1.2} stroke="hsl(35 30% 58%)" strokeWidth="0.4" opacity="0.4" />
    ))}
    {/* Rail posts */}
    {[0, 10, 22, 34, 46].map((y) => (
      <g key={`p-${y}`}>
        <rect x="0" y={y} width="4" height="4" rx="1" fill="hsl(30 35% 35%)" />
        <rect x="32" y={y} width="4" height="4" rx="1" fill="hsl(30 35% 35%)" />
      </g>
    ))}
  </svg>
);

/* ── Rocky outcrop ── */
const Rocks = ({ w = 45, h = 25 }: { w?: number; h?: number }) => (
  <svg viewBox="0 0 45 25" width={w} height={h} fill="none">
    <polygon points="5,25 0,18 4,12 10,10 15,14 12,25" fill={P.rockDark} />
    <polygon points="12,25 15,14 22,8 28,10 30,18 25,25" fill={P.rock} />
    <polygon points="25,25 28,10 34,6 40,9 42,16 38,25" fill={P.rockLight} />
    {/* Highlight edges */}
    <line x1="10" y1="10" x2="15" y2="14" stroke={P.rockLight} strokeWidth="0.4" opacity="0.5" />
    <line x1="22" y1="8" x2="28" y2="10" stroke="white" strokeWidth="0.3" opacity="0.3" />
    <line x1="34" y1="6" x2="40" y2="9" stroke="white" strokeWidth="0.3" opacity="0.4" />
    {/* Grass between rocks */}
    <line x1="13" y1="25" x2="12" y2="21" stroke={P.leaf} strokeWidth="0.5" strokeLinecap="round" />
    <line x1="15" y1="25" x2="15" y2="20.5" stroke={P.leafLight} strokeWidth="0.5" strokeLinecap="round" />
    <line x1="26" y1="25" x2="27" y2="21" stroke={P.leaf} strokeWidth="0.5" strokeLinecap="round" />
  </svg>
);

/* ── Single detailed pine ── */
const TallPine = ({ w = 28, h = 50 }: { w?: number; h?: number }) => (
  <svg viewBox="0 0 28 50" width={w} height={h} fill="none">
    <rect x="12.5" y="30" width="3" height="18" fill={P.trunk} />
    <polygon points="14,4 24,22 4,22" fill={P.leafDark} />
    <polygon points="14,0 22,16 6,16" fill={P.leaf} />
    <polygon points="14,10 20,26 8,26" fill={P.leafDark} />
    <polygon points="14,18 22,34 6,34" fill={P.leaf} opacity="0.8" />
    {/* Shadow side */}
    <polygon points="14,0 14,34 6,16 6,26 8,26 14,18 6,16" fill={P.leafDark} opacity="0.2" />
    {/* Ground bush */}
    <ellipse cx="14" cy="48" rx="8" ry="3" fill={P.bush} />
  </svg>
);

/* ── Rabbit — PNG image ── */
const Rabbit = ({ w = 60, h = 30 }: { w?: number; h?: number }) => (
  <img src={rabbitImg} alt="" width={w} height={h} style={{ objectFit: "contain" }} />
);

/* ── Moose — PNG image ── */
const Moose = ({ w = 80, h = 70 }: { w?: number; h?: number }) => (
  <img src={mooseImg} alt="" width={w} height={h} style={{ objectFit: "contain" }} />
);

/* ── Watchtower fort ── */
const Fort = ({ w = 40, h = 55 }: { w?: number; h?: number }) => (
  <svg viewBox="0 0 40 55" width={w} height={h} fill="none">
    {/* Base platform */}
    <rect x="5" y="40" width="30" height="15" fill={P.stone} />
    <rect x="5" y="40" width="30" height="3" fill={P.stoneDark} />
    {/* Door */}
    <rect x="15" y="44" width="8" height="11" rx="4" fill={P.stoneDark} />
    <rect x="16.5" y="45.5" width="5" height="9.5" rx="2.5" fill="hsl(25 20% 22%)" />
    {/* Main tower */}
    <rect x="10" y="10" width="20" height="32" fill={P.stoneLight} />
    <rect x="10" y="10" width="20" height="3" fill={P.stoneDark} />
    {/* Battlements */}
    <rect x="8" y="5" width="5" height="6" fill={P.stone} />
    <rect x="17" y="5" width="5" height="6" fill={P.stone} />
    <rect x="26" y="5" width="5" height="6" fill={P.stone} />
    {/* Windows */}
    <rect x="16" y="18" width="4" height="5" rx="2" fill="hsl(200 30% 75%)" />
    <line x1="18" y1="18" x2="18" y2="23" stroke={P.stoneDark} strokeWidth="0.4" />
    <rect x="16" y="30" width="4" height="5" rx="2" fill="hsl(200 30% 75%)" />
    {/* Flag */}
    <line x1="20" y1="5" x2="20" y2="-3" stroke={P.stoneDark} strokeWidth="0.8" />
    <polygon points="20,-3 28,-1 20,1" fill={P.flag} />
    {/* Texture */}
    <line x1="12" y1="24" x2="28" y2="24" stroke={P.stoneDark} strokeWidth="0.3" opacity="0.2" />
    <line x1="12" y1="36" x2="28" y2="36" stroke={P.stoneDark} strokeWidth="0.3" opacity="0.2" />
  </svg>
);

/* ── Cathedral with rose window and bell tower ── */
const Cathedral = ({ w = 80, h = 75 }: { w?: number; h?: number }) => (
  <svg viewBox="0 0 80 75" width={w} height={h} fill="none">
    {/* Main nave */}
    <rect x="15" y="30" width="50" height="45" fill={P.stone} />
    <rect x="15" y="30" width="50" height="4" fill={P.stoneDark} />
    {/* Roof */}
    <polygon points="40,10 70,30 10,30" fill={P.stoneDark} />
    <polygon points="40,10 55,20 25,20" fill={P.stoneLight} opacity="0.4" />
    {/* Bell tower */}
    <rect x="33" y="0" width="14" height="30" fill={P.stoneLight} />
    <rect x="33" y="0" width="14" height="3" fill={P.stoneDark} />
    {/* Tower top — pointed spire */}
    <polygon points="40,-10 48,0 32,0" fill={P.stoneDark} />
    {/* Cross on top */}
    <line x1="40" y1="-14" x2="40" y2="-10" stroke={P.stoneDark} strokeWidth="1" />
    <line x1="38" y1="-12" x2="42" y2="-12" stroke={P.stoneDark} strokeWidth="1" />
    {/* Bell opening */}
    <rect x="36" y="6" width="8" height="8" rx="4" fill="hsl(200 30% 75%)" />
    <line x1="40" y1="6" x2="40" y2="14" stroke={P.stoneDark} strokeWidth="0.4" />
    {/* Rose window */}
    <circle cx="40" cy="42" r="7" fill="hsl(200 30% 75%)" />
    <circle cx="40" cy="42" r="5.5" fill="hsl(220 40% 65%)" />
    <circle cx="40" cy="42" r="2" fill="hsl(200 30% 80%)" />
    {/* Rose window spokes */}
    {[0, 45, 90, 135].map((angle) => (
      <line
        key={angle}
        x1={40 + 5.5 * Math.cos((angle * Math.PI) / 180)}
        y1={42 + 5.5 * Math.sin((angle * Math.PI) / 180)}
        x2={40 - 5.5 * Math.cos((angle * Math.PI) / 180)}
        y2={42 - 5.5 * Math.sin((angle * Math.PI) / 180)}
        stroke={P.stoneDark}
        strokeWidth="0.4"
        opacity="0.5"
      />
    ))}
    {/* Main door */}
    <rect x="34" y="56" width="12" height="19" rx="6" fill={P.stoneDark} />
    <rect x="36" y="58" width="8" height="17" rx="4" fill="hsl(25 20% 22%)" />
    <line x1="40" y1="58" x2="40" y2="75" stroke={P.stoneDark} strokeWidth="0.5" />
    {/* Side windows */}
    <rect x="20" y="40" width="4" height="8" rx="2" fill="hsl(200 30% 75%)" />
    <rect x="56" y="40" width="4" height="8" rx="2" fill="hsl(200 30% 75%)" />
    {/* Buttresses */}
    <polygon points="10,30 15,30 15,75 10,75" fill={P.stoneDark} opacity="0.3" />
    <polygon points="65,30 70,30 70,75 65,75" fill={P.stoneDark} opacity="0.3" />
    {/* Texture lines */}
    <line x1="17" y1="50" x2="63" y2="50" stroke={P.stoneDark} strokeWidth="0.3" opacity="0.2" />
    <line x1="17" y1="62" x2="63" y2="62" stroke={P.stoneDark} strokeWidth="0.3" opacity="0.2" />
  </svg>
);

/* ── Small village house ── */
const House = ({ w = 36, h = 32 }: { w?: number; h?: number }) => (
  <svg viewBox="0 0 36 32" width={w} height={h} fill="none">
    {/* Walls */}
    <rect x="4" y="14" width="28" height="18" fill={P.stoneLight} />
    {/* Roof */}
    <polygon points="18,2 36,14 0,14" fill="hsl(15 40% 38%)" />
    <polygon points="18,2 27,8 9,8" fill="hsl(15 35% 45%)" opacity="0.4" />
    {/* Door */}
    <rect x="14" y="22" width="8" height="10" rx="4" fill={P.stoneDark} />
    <rect x="15.5" y="23.5" width="5" height="8.5" rx="2.5" fill="hsl(25 20% 22%)" />
    {/* Window */}
    <rect x="6" y="18" width="5" height="5" fill="hsl(200 30% 75%)" />
    <line x1="8.5" y1="18" x2="8.5" y2="23" stroke={P.stoneDark} strokeWidth="0.3" />
    <line x1="6" y1="20.5" x2="11" y2="20.5" stroke={P.stoneDark} strokeWidth="0.3" />
    <rect x="25" y="18" width="5" height="5" fill="hsl(200 30% 75%)" />
    <line x1="27.5" y1="18" x2="27.5" y2="23" stroke={P.stoneDark} strokeWidth="0.3" />
    {/* Chimney */}
    <rect x="24" y="4" width="4" height="10" fill={P.stoneDark} />
    <rect x="23" y="3" width="6" height="2" fill={P.stone} />
  </svg>
);

/* ── Deer — PNG image ── */
const Deer = ({ w = 60, h = 55 }: { w?: number; h?: number }) => (
  <img src={deerImg} alt="" width={w} height={h} style={{ objectFit: "contain" }} />
);

/* ── Small woodland pond ── */
const Pond = ({ w = 80, h = 50 }: { w?: number; h?: number }) => (
  <svg viewBox="0 0 80 50" width={w} height={h} fill="none">
    {/* Shore rim */}
    <ellipse cx="40" cy="28" rx="38" ry="20" fill="hsl(30 20% 55%)" opacity="0.25" />
    {/* Water body */}
    <ellipse cx="40" cy="27" rx="35" ry="18" fill="hsl(210 55% 30%)" />
    {/* Lighter inner */}
    <ellipse cx="38" cy="25" rx="26" ry="13" fill="hsl(210 50% 38%)" />
    {/* Highlight shimmer */}
    <ellipse cx="32" cy="22" rx="12" ry="5" fill="hsl(200 40% 55%)" opacity="0.3" />
    <ellipse cx="48" cy="30" rx="8" ry="3.5" fill="hsl(200 40% 55%)" opacity="0.2" />
    {/* Reeds */}
    <line x1="12" y1="30" x2="11" y2="20" stroke={P.reed} strokeWidth="0.8" strokeLinecap="round" />
    <ellipse cx="11" cy="19" rx="1.3" ry="2.5" fill={P.reed} opacity="0.6" />
    <line x1="65" y1="32" x2="66" y2="22" stroke={P.reed} strokeWidth="0.8" strokeLinecap="round" />
    <ellipse cx="66" cy="21" rx="1.3" ry="2.5" fill={P.reed} opacity="0.6" />
    <line x1="14" y1="34" x2="12" y2="25" stroke={P.reed} strokeWidth="0.6" strokeLinecap="round" />
    {/* Small rocks on shore */}
    <ellipse cx="70" cy="35" rx="3" ry="1.5" fill={P.rockDark} opacity="0.3" />
    <ellipse cx="8" cy="36" rx="2.5" ry="1.3" fill={P.rock} opacity="0.25" />
  </svg>
);

/* ══════ Placement data: [left%, top%, Component, props?] ══════ */
/* Trail path: x=50% center, curves to ~25% and ~75%
   Stops at: ~10%, ~30%, ~50%, ~70%, ~90% height
   Place decorations on opposite side of curves, away from cards */

const TrailMapDecorations = () => (
  <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
    {/* ── Section 1 (0-20%): Forest entrance ── */}
    {/* Left tree row */}
    <Decor left="3%" top="2%" w={140} h={110}><TreeCluster w={140} h={110} /></Decor>
    <Decor left="7%" top="4%" w={100} h={180}><TallPine w={100} h={180} /></Decor>
    <Decor left="2%" top="6%" w={120} h={220}><TallPine w={120} h={220} /></Decor>
    <Decor left="5%" top="8%" w={140} h={78}><Bushes w={140} h={78} /></Decor>
    <Decor left="6%" top="10%" w={160} h={88}><Bushes w={160} h={88} /></Decor>
    <Decor left="4%" top="12%" w={100} h={180}><TallPine w={100} h={180} /></Decor>
    <Decor left="8%" top="13%" w={120} h={95}><TreeCluster w={120} h={95} /></Decor>
    <Decor left="3%" top="15%" w={120} h={220}><TallPine w={120} h={220} /></Decor>
    <Decor left="7%" top="17%" w={140} h={78}><Bushes w={140} h={78} /></Decor>
    <Decor left="5%" top="19%" w={100} h={180}><TallPine w={100} h={180} /></Decor>
    {/* Right tree row */}
    <Decor left="90%" top="2%" w={160} h={88}><Bushes w={160} h={88} /></Decor>
    <Decor left="96%" top="4%" w={100} h={180}><TallPine w={100} h={180} /></Decor>
    <Decor left="93%" top="6%" w={120} h={95}><TreeCluster w={120} h={95} /></Decor>
    <Decor left="92%" top="8%" w={120} h={220}><TallPine w={120} h={220} /></Decor>
    <Decor left="96%" top="9%" w={140} h={78}><Bushes w={140} h={78} /></Decor>
    <Decor left="94%" top="11%" w={140} h={78}><Bushes w={140} h={78} /></Decor>
    <Decor left="97%" top="14%" w={100} h={180}><TallPine w={100} h={180} /></Decor>
    <Decor left="91%" top="16%" w={120} h={95}><TreeCluster w={120} h={95} /></Decor>
    <Decor left="95%" top="17%" w={160} h={88}><Bushes w={160} h={88} /></Decor>
    <Decor left="93%" top="19%" w={100} h={180}><TallPine w={100} h={180} /></Decor>
    <Decor left="91%" top="20%" w={140} h={110}><TreeCluster w={140} h={110} /></Decor>
    {/* Rocks (non-tree accents) */}
    <Decor left="72%" top="16%" w={220} h={120}><Rocks w={220} h={120} /></Decor>
    <Decor left="15%" top="18%" w={200} h={110}><Rocks w={200} h={110} /></Decor>
    {/* Near-trail: deer */}
    <Decor left="35%" top="7%" w={140} h={140}><Deer w={140} h={140} /></Decor>

    {/* ── Section 2 (20-40%): Mountain range ── */}
    <Decor left="10%" top="23%" w={420} h={260}><Mountains w={420} h={260} /></Decor>
    <Decor left="5%" top="30%" w={120} h={220}><TallPine w={120} h={220} /></Decor>
    <Decor left="20%" top="33%" w={300} h={235}><TreeCluster w={300} h={235} /></Decor>
    <Decor left="8%" top="36%" w={200} h={110}><Bushes w={200} h={110} /></Decor>
    <Decor left="18%" top="38%" w={180} h={100}><Rocks w={180} h={100} /></Decor>
    <Decor left="88%" top="24%" w={340} h={265}><TreeCluster w={340} h={265} /></Decor>
    <Decor left="95%" top="28%" w={120} h={220}><TallPine w={120} h={220} /></Decor>
    <Decor left="82%" top="32%" w={200} h={110}><Bushes w={200} h={110} /></Decor>
    <Decor left="92%" top="36%" w={180} h={100}><Rocks w={180} h={100} /></Decor>
    <Decor left="78%" top="38%" w={160} h={88}><Bushes w={160} h={88} /></Decor>
    <Decor left="85%" top="22%" w={160} h={88}><Bushes w={160} h={88} /></Decor>
    {/* Near-trail: moose + fort + rabbit */}
    <Decor left="65%" top="25%" w={170} h={155}><Moose w={170} h={155} /></Decor>
    <Decor left="35%" top="22%" w={70} h={40}><Rabbit w={70} h={40} /></Decor>
    <Decor left="70%" top="34%" w={160} h={220}><Fort w={160} h={220} /></Decor>
    <Decor left="38%" top="30%" w={120} h={220}><TallPine w={120} h={220} /></Decor>
    <Decor left="32%" top="37%" w={160} h={88}><Bushes w={160} h={88} /></Decor>

    {/* ── Section 3 (40-60%): River crossing ── */}
    {/* River flowing across the map */}
    <Decor left="50%" top="60%" w={4000} h={840}><RiverDecor w={4000} h={840} /></Decor>
    {/* Bridge where the trail crosses the river */}
    <Decor left="50%" top="55%" w={81} h={243}><Bridge w={81} h={243} /></Decor>
    <Decor left="93%" top="42%" w={120} h={220}><TallPine w={120} h={220} /></Decor>
    <Decor left="8%" top="43%" w={220} h={120}><Rocks w={220} h={120} /></Decor>
    {/* Near-trail: deer + rabbit */}
    <Decor left="38%" top="44%" w={75} h={43}><Rabbit w={75} h={43} /></Decor>
    <Decor left="65%" top="42%" w={140} h={140}><Deer w={140} h={140} /></Decor>

    {/* ── Section 3.5 (44-58%): Village & cathedral filling the gap ── */}
    {/* Cathedral — prominent on the left, pushed up away from river */}
    <Decor left="14%" top="45%" w={260} h={245}><Cathedral w={260} h={245} /></Decor>
    {/* Village houses scattered around */}
    <Decor left="6%" top="48%" w={100} h={90}><House w={100} h={90} /></Decor>
    <Decor left="24%" top="49%" w={80} h={72}><House w={80} h={72} /></Decor>
    {/* Houses on right side */}
    <Decor left="82%" top="47%" w={90} h={80}><House w={90} h={80} /></Decor>
    <Decor left="92%" top="50%" w={80} h={72}><House w={80} h={72} /></Decor>
    {/* Trees filling both sides */}
    <Decor left="88%" top="44%" w={300} h={235}><TreeCluster w={300} h={235} /></Decor>
    <Decor left="96%" top="48%" w={120} h={220}><TallPine w={120} h={220} /></Decor>
    <Decor left="4%" top="44%" w={120} h={220}><TallPine w={120} h={220} /></Decor>
    <Decor left="26%" top="46%" w={200} h={110}><Bushes w={200} h={110} /></Decor>
    {/* Near-trail accents */}
    <Decor left="38%" top="48%" w={120} h={220}><TallPine w={120} h={220} /></Decor>
    <Decor left="62%" top="46%" w={120} h={220}><TallPine w={120} h={220} /></Decor>
    <Decor left="60%" top="57%" w={70} h={40}><Rabbit w={70} h={40} /></Decor>
    <Decor left="85%" top="58%" w={220} h={120}><Rocks w={220} h={120} /></Decor>

    {/* ── Section 4 (60-80%): Castle district ── */}
    <Decor left="12%" top="64%" w={300} h={275}><CastleDecor w={300} h={275} /></Decor>
    <Decor left="4%" top="62%" w={120} h={220}><TallPine w={120} h={220} /></Decor>
    <Decor left="22%" top="72%" w={200} h={110}><Bushes w={200} h={110} /></Decor>
    <Decor left="6%" top="74%" w={220} h={120}><Rocks w={220} h={120} /></Decor>
    <Decor left="18%" top="77%" w={160} h={88}><Bushes w={160} h={88} /></Decor>
    <Decor left="3%" top="78%" w={120} h={220}><TallPine w={120} h={220} /></Decor>
    <Decor left="88%" top="62%" w={340} h={265}><TreeCluster w={340} h={265} /></Decor>
    <Decor left="95%" top="66%" w={120} h={220}><TallPine w={120} h={220} /></Decor>
    <Decor left="80%" top="70%" w={200} h={110}><Bushes w={200} h={110} /></Decor>
    <Decor left="92%" top="74%" w={220} h={120}><Rocks w={220} h={120} /></Decor>
    <Decor left="78%" top="77%" w={300} h={235}><TreeCluster w={300} h={235} /></Decor>
    <Decor left="85%" top="78%" w={160} h={88}><Bushes w={160} h={88} /></Decor>
    {/* Near-trail: fort + moose + rabbit */}
    <Decor left="68%" top="63%" w={160} h={220}><Fort w={160} h={220} /></Decor>
    <Decor left="35%" top="66%" w={170} h={155}><Moose w={170} h={155} /></Decor>
    <Decor left="60%" top="61%" w={75} h={43}><Rabbit w={75} h={43} /></Decor>
    <Decor left="40%" top="72%" w={120} h={220}><TallPine w={120} h={220} /></Decor>
    <Decor left="33%" top="76%" w={200} h={110}><Bushes w={200} h={110} /></Decor>
    <Decor left="65%" top="75%" w={160} h={88}><Bushes w={160} h={88} /></Decor>

    {/* ── Section 5 (80-100%): Trail end, dense both sides ── */}
    <Decor left="8%" top="83%" w={340} h={265}><TreeCluster w={340} h={265} /></Decor>
    <Decor left="5%" top="86%" w={120} h={220}><TallPine w={120} h={220} /></Decor>
    <Decor left="18%" top="88%" w={220} h={120}><Rocks w={220} h={120} /></Decor>
    <Decor left="3%" top="91%" w={200} h={110}><Bushes w={200} h={110} /></Decor>
    <Decor left="15%" top="94%" w={300} h={235}><TreeCluster w={300} h={235} /></Decor>
    <Decor left="10%" top="97%" w={160} h={88}><Bushes w={160} h={88} /></Decor>
    <Decor left="88%" top="83%" w={300} h={235}><TreeCluster w={300} h={235} /></Decor>
    <Decor left="95%" top="86%" w={120} h={220}><TallPine w={120} h={220} /></Decor>
    <Decor left="82%" top="89%" w={200} h={110}><Bushes w={200} h={110} /></Decor>
    <Decor left="92%" top="92%" w={220} h={120}><Rocks w={220} h={120} /></Decor>
    <Decor left="78%" top="95%" w={300} h={235}><TreeCluster w={300} h={235} /></Decor>
    <Decor left="85%" top="97%" w={160} h={88}><Bushes w={160} h={88} /></Decor>
    {/* Near-trail: deer + rabbit + castle */}
    <Decor left="35%" top="82%" w={70} h={40}><Rabbit w={70} h={40} /></Decor>
    <Decor left="65%" top="85%" w={140} h={140}><Deer w={140} h={140} /></Decor>
    <Decor left="38%" top="88%" w={200} h={185}><CastleDecor w={200} h={185} /></Decor>
    <Decor left="62%" top="91%" w={170} h={155}><Moose w={170} h={155} /></Decor>
    <Decor left="68%" top="95%" w={120} h={220}><TallPine w={120} h={220} /></Decor>
    <Decor left="32%" top="95%" w={160} h={88}><Bushes w={160} h={88} /></Decor>
  </div>
);

export default TrailMapDecorations;
