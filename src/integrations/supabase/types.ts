export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      dj_bookings: {
        Row: {
          created_at: string
          email: string | null
          end_time: string | null
          equipment_details: string | null
          event_date: string | null
          event_description: string | null
          event_duration: string | null
          event_type: string | null
          id: string
          name: string
          needs_equipment: boolean | null
          number_of_guests: number | null
          phone: string | null
          rate_per_hour: number | null
          start_time: string | null
          total_amount: number | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          end_time?: string | null
          equipment_details?: string | null
          event_date?: string | null
          event_description?: string | null
          event_duration?: string | null
          event_type?: string | null
          id?: string
          name: string
          needs_equipment?: boolean | null
          number_of_guests?: number | null
          phone?: string | null
          rate_per_hour?: number | null
          start_time?: string | null
          total_amount?: number | null
        }
        Update: {
          created_at?: string
          email?: string | null
          end_time?: string | null
          equipment_details?: string | null
          event_date?: string | null
          event_description?: string | null
          event_duration?: string | null
          event_type?: string | null
          id?: string
          name?: string
          needs_equipment?: boolean | null
          number_of_guests?: number | null
          phone?: string | null
          rate_per_hour?: number | null
          start_time?: string | null
          total_amount?: number | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          end_time: string
          ical_uid: string | null
          id: string
          is_imported: boolean | null
          is_live: boolean | null
          location: string
          packages: Json | null
          start_time: string
          title: string
          type: string
          updated_at: string
          venue: string
        }
        Insert: {
          created_at?: string
          end_time: string
          ical_uid?: string | null
          id?: string
          is_imported?: boolean | null
          is_live?: boolean | null
          location: string
          packages?: Json | null
          start_time: string
          title: string
          type: string
          updated_at?: string
          venue: string
        }
        Update: {
          created_at?: string
          end_time?: string
          ical_uid?: string | null
          id?: string
          is_imported?: boolean | null
          is_live?: boolean | null
          location?: string
          packages?: Json | null
          start_time?: string
          title?: string
          type?: string
          updated_at?: string
          venue?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_admin: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          is_admin?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_admin?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          created_at: string
          email: string | null
          end_time: string | null
          equipment_details: string | null
          event_date: string | null
          event_description: string | null
          event_duration: string | null
          event_id: string | null
          event_type: string | null
          id: string
          name: string
          needs_equipment: boolean
          number_of_guests: number
          phone: string | null
          start_time: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          end_time?: string | null
          equipment_details?: string | null
          event_date?: string | null
          event_description?: string | null
          event_duration?: string | null
          event_id?: string | null
          event_type?: string | null
          id?: string
          name: string
          needs_equipment?: boolean
          number_of_guests?: number
          phone?: string | null
          start_time?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          end_time?: string | null
          equipment_details?: string | null
          event_date?: string | null
          event_description?: string | null
          event_duration?: string | null
          event_id?: string | null
          event_type?: string | null
          id?: string
          name?: string
          needs_equipment?: boolean
          number_of_guests?: number
          phone?: string | null
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
