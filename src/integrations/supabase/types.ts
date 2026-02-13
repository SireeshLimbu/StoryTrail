export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      characters: {
        Row: {
          age: number | null
          bio: string | null
          city_id: string
          created_at: string
          display_order: number
          gender: string | null
          height: string | null
          id: string
          image_url: string | null
          is_suspect: boolean
          name: string
          updated_at: string
        }
        Insert: {
          age?: number | null
          bio?: string | null
          city_id: string
          created_at?: string
          display_order?: number
          gender?: string | null
          height?: string | null
          id?: string
          image_url?: string | null
          is_suspect?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          age?: number | null
          bio?: string | null
          city_id?: string
          created_at?: string
          display_order?: number
          gender?: string | null
          height?: string | null
          id?: string
          image_url?: string | null
          is_suspect?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "characters_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          distance_km: number | null
          google_maps_url: string | null
          how_it_works: Json | null
          id: string
          image_url: string | null
          is_published: boolean
          name: string
          price_cents: number
          story_description: string | null
          tagline: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          distance_km?: number | null
          google_maps_url?: string | null
          how_it_works?: Json | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          name: string
          price_cents?: number
          story_description?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          distance_km?: number | null
          google_maps_url?: string | null
          how_it_works?: Json | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          name?: string
          price_cents?: number
          story_description?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          answer_options: Json | null
          answer_type: string
          city_id: string
          clue_text: string | null
          correct_answer_index: number | null
          correct_answer_indices: number[] | null
          created_at: string
          free_text_answer: string | null
          id: string
          image_url: string | null
          intro_text: string | null
          is_end_location: boolean
          is_intro_location: boolean
          is_reveal: boolean
          latitude: number | null
          longitude: number | null
          name: string
          reveal_image_url: string | null
          riddle_text: string | null
          sequence_order: number
          updated_at: string
        }
        Insert: {
          answer_options?: Json | null
          answer_type?: string
          city_id: string
          clue_text?: string | null
          correct_answer_index?: number | null
          correct_answer_indices?: number[] | null
          created_at?: string
          free_text_answer?: string | null
          id?: string
          image_url?: string | null
          intro_text?: string | null
          is_end_location?: boolean
          is_intro_location?: boolean
          is_reveal?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          reveal_image_url?: string | null
          riddle_text?: string | null
          sequence_order?: number
          updated_at?: string
        }
        Update: {
          answer_options?: Json | null
          answer_type?: string
          city_id?: string
          clue_text?: string | null
          correct_answer_index?: number | null
          correct_answer_indices?: number[] | null
          created_at?: string
          free_text_answer?: string | null
          id?: string
          image_url?: string | null
          intro_text?: string | null
          is_end_location?: boolean
          is_intro_location?: boolean
          is_reveal?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          reveal_image_url?: string | null
          riddle_text?: string | null
          sequence_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_admin_emails: {
        Row: {
          added_by: string | null
          created_at: string
          email: string
          id: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          added_by?: string | null
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          player_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          player_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          player_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trail_completions: {
        Row: {
          city_id: string
          completed_at: string
          completion_time_ms: number
          id: string
          user_id: string
        }
        Insert: {
          city_id: string
          completed_at?: string
          completion_time_ms: number
          id?: string
          user_id: string
        }
        Update: {
          city_id?: string
          completed_at?: string
          completion_time_ms?: number
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trail_completions_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          city_id: string
          completed_at: string
          id: string
          location_id: string
          user_id: string
        }
        Insert: {
          city_id: string
          completed_at?: string
          id?: string
          location_id: string
          user_id: string
        }
        Update: {
          city_id?: string
          completed_at?: string
          id?: string
          location_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations_public"
            referencedColumns: ["id"]
          },
        ]
      }
      user_purchases: {
        Row: {
          city_id: string
          id: string
          purchased_at: string
          stripe_payment_id: string | null
          user_id: string
        }
        Insert: {
          city_id: string
          id?: string
          purchased_at?: string
          stripe_payment_id?: string | null
          user_id: string
        }
        Update: {
          city_id?: string
          id?: string
          purchased_at?: string
          stripe_payment_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_purchases_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      locations_public: {
        Row: {
          answer_options: Json | null
          answer_type: string | null
          city_id: string | null
          created_at: string | null
          id: string | null
          image_url: string | null
          intro_text: string | null
          is_end_location: boolean | null
          is_intro_location: boolean | null
          is_reveal: boolean | null
          latitude: number | null
          longitude: number | null
          name: string | null
          reveal_image_url: string | null
          riddle_text: string | null
          sequence_order: number | null
          updated_at: string | null
        }
        Insert: {
          answer_options?: Json | null
          answer_type?: string | null
          city_id?: string | null
          created_at?: string | null
          id?: string | null
          image_url?: string | null
          intro_text?: string | null
          is_end_location?: boolean | null
          is_intro_location?: boolean | null
          is_reveal?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          reveal_image_url?: string | null
          riddle_text?: string | null
          sequence_order?: number | null
          updated_at?: string | null
        }
        Update: {
          answer_options?: Json | null
          answer_type?: string | null
          city_id?: string | null
          created_at?: string | null
          id?: string | null
          image_url?: string | null
          intro_text?: string | null
          is_end_location?: boolean | null
          is_intro_location?: boolean | null
          is_reveal?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          reveal_image_url?: string | null
          riddle_text?: string | null
          sequence_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_purchased_city: { Args: { _city_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
