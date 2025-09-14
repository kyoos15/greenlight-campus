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
      ai_insights: {
        Row: {
          building_id: number | null
          created_at: string | null
          description: string
          id: number
          insight_type: string
          potential_savings: number | null
          priority: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          building_id?: number | null
          created_at?: string | null
          description: string
          id?: number
          insight_type: string
          potential_savings?: number | null
          priority: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          building_id?: number | null
          created_at?: string | null
          description?: string
          id?: number
          insight_type?: string
          potential_savings?: number | null
          priority?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      buildings: {
        Row: {
          building_id: number
          created_at: string | null
          floor_count: number | null
          id: number
          primary_use: string
          site_id: number
          square_feet: number
          updated_at: string | null
          year_built: number | null
        }
        Insert: {
          building_id: number
          created_at?: string | null
          floor_count?: number | null
          id?: number
          primary_use: string
          site_id: number
          square_feet: number
          updated_at?: string | null
          year_built?: number | null
        }
        Update: {
          building_id?: number
          created_at?: string | null
          floor_count?: number | null
          id?: number
          primary_use?: string
          site_id?: number
          square_feet?: number
          updated_at?: string | null
          year_built?: number | null
        }
        Relationships: []
      }
      energy_consumption: {
        Row: {
          anomaly_score: number | null
          building_id: number
          created_at: string | null
          id: number
          meter: number
          meter_reading: number
          predicted_reading: number | null
          sustainability_score: number | null
          timestamp: string
          updated_at: string | null
        }
        Insert: {
          anomaly_score?: number | null
          building_id: number
          created_at?: string | null
          id?: number
          meter: number
          meter_reading: number
          predicted_reading?: number | null
          sustainability_score?: number | null
          timestamp: string
          updated_at?: string | null
        }
        Update: {
          anomaly_score?: number | null
          building_id?: number
          created_at?: string | null
          id?: number
          meter?: number
          meter_reading?: number
          predicted_reading?: number | null
          sustainability_score?: number | null
          timestamp?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ml_predictions: {
        Row: {
          building_id: number
          confidence_score: number | null
          created_at: string | null
          features: Json | null
          id: number
          model_version: string | null
          predicted_consumption: number
          prediction_date: string
        }
        Insert: {
          building_id: number
          confidence_score?: number | null
          created_at?: string | null
          features?: Json | null
          id?: number
          model_version?: string | null
          predicted_consumption: number
          prediction_date: string
        }
        Update: {
          building_id?: number
          confidence_score?: number | null
          created_at?: string | null
          features?: Json | null
          id?: number
          model_version?: string | null
          predicted_consumption?: number
          prediction_date?: string
        }
        Relationships: []
      }
      weather_data: {
        Row: {
          air_temperature: number | null
          cloud_coverage: number | null
          created_at: string | null
          dew_temperature: number | null
          id: number
          precip_depth_1_hr: number | null
          sea_level_pressure: number | null
          site_id: number
          timestamp: string
          wind_direction: number | null
          wind_speed: number | null
        }
        Insert: {
          air_temperature?: number | null
          cloud_coverage?: number | null
          created_at?: string | null
          dew_temperature?: number | null
          id?: number
          precip_depth_1_hr?: number | null
          sea_level_pressure?: number | null
          site_id: number
          timestamp: string
          wind_direction?: number | null
          wind_speed?: number | null
        }
        Update: {
          air_temperature?: number | null
          cloud_coverage?: number | null
          created_at?: string | null
          dew_temperature?: number | null
          id?: number
          precip_depth_1_hr?: number | null
          sea_level_pressure?: number | null
          site_id?: number
          timestamp?: string
          wind_direction?: number | null
          wind_speed?: number | null
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
