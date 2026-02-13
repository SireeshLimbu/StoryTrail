import { MapPin, BookOpen, Headphones, Footprints, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface TrailStop {
  id: number;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  features?: { icon: LucideIcon; text: string }[];
  ctaText?: string;
  ctaLink?: string;
  partnerCta?: boolean;
}

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
  },
  {
    id: 4,
    label: "The Experience",
    title: "Real places become living stories.",
    subtitle: "More than a tour. More than a story.",
    description:
      "Through sound, narrative, and discovery, the place itself becomes part of the story. Using AI-supported audio guides, text, and interactive elements, we transform real environments into living stories you explore with your body, not just your screen.",
    icon: Footprints,
  },
  {
    id: 5,
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
