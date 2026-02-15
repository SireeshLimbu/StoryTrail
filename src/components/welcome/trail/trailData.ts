import { MapPin, BookOpen, Headphones, Footprints, ArrowRight, Sparkles, Route, CircleHelp, Lightbulb, Puzzle, Clock, Users, Building2, Landmark, GraduationCap, Globe, Castle, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface TrailStop {
  id: number;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  features?: { icon: LucideIcon; text: string }[];
  steps?: { icon: LucideIcon; title: string; description: string }[];
  ctaText?: string;
  ctaLink?: string;
  partnerCta?: boolean;
}

// Shared SVG path data — used by TrailPath (rendering) and TrailWalker (positioning)
export const TRAIL_PATH_D = `
  M 50 10
  L 50 70
  C 50 80, 25 90, 25 100
  C 25 110, 50 120, 50 130
  L 50 170
  C 50 180, 75 190, 75 200
  C 75 210, 50 220, 50 230
  L 50 370
  C 50 380, 65 390, 65 400
  C 65 410, 50 420, 50 430
  L 50 490
`;

export const trailStops: TrailStop[] = [
  {
    id: 1,
    label: "Start Here",
    title: "StoryTrail",
    subtitle: "Walk the story",
    description:
      "StoryTrail turns streets, landscapes, and historic sites into immersive stories and thrilling challenges you experience by walking through them.",
    icon: MapPin,
  },
  {
    id: 2,
    label: "What is StoryTrail?",
    title: "Stories are better when you walk through them.",
    subtitle: "Place-based storytelling",
    description:
      "We create guided story experiences where visitors follow a narrative step by step — in the exact place where it unfolds.",
    icon: BookOpen,
    features: [
      { icon: Headphones, text: "Audio" },
      { icon: BookOpen, text: "Text" },
      { icon: MapPin, text: "Interactive" },
      { icon: Sparkles, text: "AI-supported" },
    ],
  },
  {
    id: 3,
    label: "How It Works",
    title: "Follow the trail",
    subtitle: "AI-powered guides lead the way",
    description:
      "An AI-supported guide leads you through the environment. Each stop reveals a new chapter. Solve challenges, discover clues, and experience the story.",
    icon: Headphones,
    steps: [
      { icon: BookOpen, title: "Choose a story", description: "Each StoryTrail is tied to a real location — a town, a landscape, a site." },
      { icon: Route, title: "Walk the route", description: "An AI-supported guide leads you through the environment. Each stop reveals a new chapter." },
      { icon: CircleHelp, title: "Solve the challenge", description: "A challenge, puzzle or riddle must be solved before entering the new chapter." },
      { icon: Sparkles, title: "Experience the story", description: "Through sound, narrative, and discovery, the place itself becomes part of the story." },
    ],
  },
  {
    id: 4,
    label: "Why StoryTrail?",
    title: "More than a tour. More than a story.",
    subtitle: "",
    description:
      "StoryTrail works just as well for history as for fiction, education as for entertainment.",
    icon: Footprints,
    features: [
      { icon: MapPin, text: "Designed for real places" },
      { icon: Footprints, text: "Built for walking and discovery" },
      { icon: Sparkles, text: "AI-supported voice guides that respond to you" },
      { icon: Lightbulb, text: "Based on research, storytelling, and design" },
      { icon: Puzzle, text: "Solve location-based challenges together" },
      { icon: Clock, text: "Compete to finish fast or take time to enjoy the surroundings" },
      { icon: Users, text: "Accessible for families, schools, and visitors" },
      { icon: Building2, text: "Scalable to cities, regions, and destinations" },
    ],
  },
  {
    id: 5,
    label: "Who It's For",
    title: "Made for places that want to tell their story",
    subtitle: "",
    description:
      "We truly believe the best stories and trails are known locally and better told with a local voice. Since we want our stories and walks to be of highest quality please contact us if you have a trail or story you believe should be experienced!",
    icon: Users,
    features: [
      { icon: Building2, text: "Cities & municipalities" },
      { icon: Landmark, text: "Museums & cultural institutions" },
      { icon: GraduationCap, text: "Schools & education providers" },
      { icon: Globe, text: "Tourism & destination marketing" },
      { icon: Castle, text: "Heritage sites & historical environments" },
      { icon: Trophy, text: "Group & company competitions" },
    ],
  },
  {
    id: 6,
    label: "Your Trail Awaits",
    title: "Ready to walk the story?",
    subtitle: "",
    description:
      "Every place has a story. Discover trails near you or partner with us to create your own.",
    icon: ArrowRight,
    ctaText: "Explore stories",
    ctaLink: "/stories",
    partnerCta: true,
  },
];
