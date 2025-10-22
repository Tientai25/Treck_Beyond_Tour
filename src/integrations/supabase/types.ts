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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bank_accounts: {
        Row: {
          account_holder_name: string
          account_number: string
          bank_name: string
          created_at: string
          id: string
          is_default: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_holder_name: string
          account_number: string
          bank_name: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          bank_name?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string
          content_en: string | null
          cover_image: string | null
          created_at: string | null
          excerpt: string
          excerpt_en: string | null
          id: string
          published: boolean | null
          slug: string
          tags: string[] | null
          title: string
          title_en: string | null
          updated_at: string | null
          views: number | null
        }
        Insert: {
          author_id?: string | null
          content: string
          content_en?: string | null
          cover_image?: string | null
          created_at?: string | null
          excerpt: string
          excerpt_en?: string | null
          id?: string
          published?: boolean | null
          slug: string
          tags?: string[] | null
          title: string
          title_en?: string | null
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          author_id?: string | null
          content?: string
          content_en?: string | null
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string
          excerpt_en?: string | null
          id?: string
          published?: boolean | null
          slug?: string
          tags?: string[] | null
          title?: string
          title_en?: string | null
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          additional_services: Json | null
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at: string | null
          id: string
          participants: number
          special_requests: string | null
          start_date: string
          status: Database["public"]["Enums"]["booking_status"] | null
          total_price: number
          tour_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          additional_services?: Json | null
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at?: string | null
          id?: string
          participants: number
          special_requests?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price: number
          tour_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          additional_services?: Json | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string | null
          id?: string
          participants?: number
          special_requests?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price?: number
          tour_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      health_assessments: {
        Row: {
          age: number
          created_at: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          experience_level: number
          fitness_level: number
          has_heart_conditions: boolean | null
          has_mobility_issues: boolean | null
          has_respiratory_conditions: boolean | null
          height: number | null
          id: string
          medical_conditions: string[] | null
          recommended_difficulty:
            | Database["public"]["Enums"]["tour_difficulty"]
            | null
          score: number | null
          user_id: string | null
          warnings: string[] | null
          weight: number | null
        }
        Insert: {
          age: number
          created_at?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          experience_level: number
          fitness_level: number
          has_heart_conditions?: boolean | null
          has_mobility_issues?: boolean | null
          has_respiratory_conditions?: boolean | null
          height?: number | null
          id?: string
          medical_conditions?: string[] | null
          recommended_difficulty?:
            | Database["public"]["Enums"]["tour_difficulty"]
            | null
          score?: number | null
          user_id?: string | null
          warnings?: string[] | null
          weight?: number | null
        }
        Update: {
          age?: number
          created_at?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          experience_level?: number
          fitness_level?: number
          has_heart_conditions?: boolean | null
          has_mobility_issues?: boolean | null
          has_respiratory_conditions?: boolean | null
          height?: number | null
          id?: string
          medical_conditions?: string[] | null
          recommended_difficulty?:
            | Database["public"]["Enums"]["tour_difficulty"]
            | null
          score?: number | null
          user_id?: string | null
          warnings?: string[] | null
          weight?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          language: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          language?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tours: {
        Row: {
          active: boolean | null
          created_at: string | null
          departure_dates: string[] | null
          description: string
          description_en: string | null
          difficulty: Database["public"]["Enums"]["tour_difficulty"]
          duration_days: number
          excluded_services: Json | null
          featured: boolean | null
          id: string
          images: string[] | null
          included_services: Json | null
          itinerary: Json | null
          location: string
          location_en: string | null
          main_image: string | null
          max_participants: number
          min_participants: number | null
          price: number
          quality_tier: string | null
          requirements: string | null
          requirements_en: string | null
          slug: string
          title: string
          title_en: string | null
          tour_type: Database["public"]["Enums"]["tour_type"]
          transportation: string[] | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          departure_dates?: string[] | null
          description: string
          description_en?: string | null
          difficulty: Database["public"]["Enums"]["tour_difficulty"]
          duration_days: number
          excluded_services?: Json | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          included_services?: Json | null
          itinerary?: Json | null
          location: string
          location_en?: string | null
          main_image?: string | null
          max_participants: number
          min_participants?: number | null
          price: number
          quality_tier?: string | null
          requirements?: string | null
          requirements_en?: string | null
          slug: string
          title: string
          title_en?: string | null
          tour_type: Database["public"]["Enums"]["tour_type"]
          transportation?: string[] | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          departure_dates?: string[] | null
          description?: string
          description_en?: string | null
          difficulty?: Database["public"]["Enums"]["tour_difficulty"]
          duration_days?: number
          excluded_services?: Json | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          included_services?: Json | null
          itinerary?: Json | null
          location?: string
          location_en?: string | null
          main_image?: string | null
          max_participants?: number
          min_participants?: number | null
          price?: number
          quality_tier?: string | null
          requirements?: string | null
          requirements_en?: string | null
          slug?: string
          title?: string
          title_en?: string | null
          tour_type?: Database["public"]["Enums"]["tour_type"]
          transportation?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      tour_difficulty: "easy" | "moderate" | "challenging" | "extreme"
      tour_type:
        | "trekking"
        | "experience"
        | "traditional"
        | "international"
        | "team_building"
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
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      tour_difficulty: ["easy", "moderate", "challenging", "extreme"],
      tour_type: [
        "trekking",
        "experience",
        "traditional",
        "international",
        "team_building",
      ],
    },
  },
} as const
