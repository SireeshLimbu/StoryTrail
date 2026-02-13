export interface City {
  id: string;
  name: string;
  description: string | null;
  tagline: string | null;
  story_description: string | null;
  image_url: string | null;
  price_cents: number;
  is_published: boolean;
  distance_km: number | null;
  created_at: string;
  updated_at: string;
}

export interface Character {
  id: string;
  city_id: string;
  name: string;
  age: number | null;
  gender: string | null;
  height: string | null;
  bio: string | null;
  image_url: string | null;
  is_suspect: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  city_id: string;
  name: string;
  sequence_order: number;
  latitude: number | null;
  longitude: number | null;
  intro_text: string | null;
  riddle_text: string | null;
  answer_options: string[];
  correct_answer_index: number | null;
  clue_text: string | null;
  image_url: string | null;
  is_intro_location: boolean;
  is_reveal: boolean;
  reveal_image_url: string | null;
  is_end_location: boolean;
  answer_type: 'multiple_choice' | 'free_text';
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  city_id: string;
  location_id: string;
  completed_at: string;
}

export interface UserPurchase {
  id: string;
  user_id: string;
  city_id: string;
  purchased_at: string;
  stripe_payment_id: string | null;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  player_name: string | null;
  created_at: string;
  updated_at: string;
}
