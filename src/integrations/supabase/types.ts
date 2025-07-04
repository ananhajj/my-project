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
      attendance_records: {
        Row: {
          date: string
          id: string
          notes: string | null
          period: number | null
          recorded_at: string
          recorded_by: string | null
          school_id: string
          status: string
          student_id: string
        }
        Insert: {
          date?: string
          id?: string
          notes?: string | null
          period?: number | null
          recorded_at?: string
          recorded_by?: string | null
          school_id: string
          status: string
          student_id: string
        }
        Update: {
          date?: string
          id?: string
          notes?: string | null
          period?: number | null
          recorded_at?: string
          recorded_by?: string | null
          school_id?: string
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string | null
          grade: string
          id: string
          name: string
          section: string
          teacher_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          grade: string
          id?: string
          name: string
          section: string
          teacher_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          grade?: string
          id?: string
          name?: string
          section?: string
          teacher_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          file_url: string | null
          id: string
          is_read: boolean | null
          message_type: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          file_url?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          file_url?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      period_settings: {
        Row: {
          academic_year: string
          created_at: string
          created_by: string | null
          end_date: string
          id: string
          is_active: boolean
          period_type: string
          start_date: string
          updated_at: string
        }
        Insert: {
          academic_year: string
          created_at?: string
          created_by?: string | null
          end_date: string
          id?: string
          is_active?: boolean
          period_type: string
          start_date: string
          updated_at?: string
        }
        Update: {
          academic_year?: string
          created_at?: string
          created_by?: string | null
          end_date?: string
          id?: string
          is_active?: boolean
          period_type?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          class_id: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          school_id: string | null
          teacher_id: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          class_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          school_id?: string | null
          teacher_id?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          class_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          school_id?: string | null
          teacher_id?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      school_attendance: {
        Row: {
          created_at: string
          date: string
          id: string
          school_id: string
          status: string
          student_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          school_id: string
          status: string
          student_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          school_id?: string
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_attendance_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "school_students"
            referencedColumns: ["id"]
          },
        ]
      }
      school_classes: {
        Row: {
          capacity: number | null
          created_at: string
          grade: string
          id: string
          name: string
          room_number: string | null
          school_id: string
          section: string
          teacher_name: string | null
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          grade: string
          id?: string
          name: string
          room_number?: string | null
          school_id: string
          section: string
          teacher_name?: string | null
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          grade?: string
          id?: string
          name?: string
          room_number?: string | null
          school_id?: string
          section?: string
          teacher_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_classes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      school_settings: {
        Row: {
          absence_alert_days: number | null
          absence_alert_description: string | null
          absence_alert_title: string | null
          alert_rules: Json | null
          attendance_type: string | null
          country: string | null
          created_at: string
          education_department: string | null
          educational_supervision: string | null
          id: string
          late_alert_count: number | null
          late_alert_description: string | null
          late_alert_title: string | null
          logo_url: string | null
          ministry: string | null
          periods_per_day: number | null
          school_id: string
          school_name: string
          stages: Json | null
          updated_at: string
        }
        Insert: {
          absence_alert_days?: number | null
          absence_alert_description?: string | null
          absence_alert_title?: string | null
          alert_rules?: Json | null
          attendance_type?: string | null
          country?: string | null
          created_at?: string
          education_department?: string | null
          educational_supervision?: string | null
          id?: string
          late_alert_count?: number | null
          late_alert_description?: string | null
          late_alert_title?: string | null
          logo_url?: string | null
          ministry?: string | null
          periods_per_day?: number | null
          school_id: string
          school_name: string
          stages?: Json | null
          updated_at?: string
        }
        Update: {
          absence_alert_days?: number | null
          absence_alert_description?: string | null
          absence_alert_title?: string | null
          alert_rules?: Json | null
          attendance_type?: string | null
          country?: string | null
          created_at?: string
          education_department?: string | null
          educational_supervision?: string | null
          id?: string
          late_alert_count?: number | null
          late_alert_description?: string | null
          late_alert_title?: string | null
          logo_url?: string | null
          ministry?: string | null
          periods_per_day?: number | null
          school_id?: string
          school_name?: string
          stages?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      school_students: {
        Row: {
          created_at: string
          grade: string
          id: string
          school_id: string
          section: string
          student_id: string
          student_name: string
        }
        Insert: {
          created_at?: string
          grade: string
          id?: string
          school_id: string
          section: string
          student_id: string
          student_name: string
        }
        Update: {
          created_at?: string
          grade?: string
          id?: string
          school_id?: string
          section?: string
          student_id?: string
          student_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          created_at: string
          email: string
          id: string
          phone: string | null
          school_name: string
          status: string
          students_count: number | null
          subscription_end: string | null
          subscription_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          phone?: string | null
          school_name: string
          status?: string
          students_count?: number | null
          subscription_end?: string | null
          subscription_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          phone?: string | null
          school_name?: string
          status?: string
          students_count?: number | null
          subscription_end?: string | null
          subscription_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_classes: {
        Row: {
          class_id: string
          enrolled_at: string | null
          id: string
          is_active: boolean | null
          student_id: string
        }
        Insert: {
          class_id: string
          enrolled_at?: string | null
          id?: string
          is_active?: boolean | null
          student_id: string
        }
        Update: {
          class_id?: string
          enrolled_at?: string | null
          id?: string
          is_active?: boolean | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_classes_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          address: string | null
          birth_date: string | null
          created_at: string
          enrollment_date: string | null
          grade: string
          id: string
          name: string
          parent_phone: string | null
          phone: string | null
          school_id: string
          section: string
          status: string | null
          student_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          created_at?: string
          enrollment_date?: string | null
          grade: string
          id?: string
          name: string
          parent_phone?: string | null
          phone?: string | null
          school_id: string
          section: string
          status?: string | null
          student_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          created_at?: string
          enrollment_date?: string | null
          grade?: string
          id?: string
          name?: string
          parent_phone?: string | null
          phone?: string | null
          school_id?: string
          section?: string
          status?: string | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_alerts: {
        Row: {
          alert_type: string
          created_at: string
          expires_at: string
          id: string
          school_id: string
          sent_at: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          expires_at: string
          id?: string
          school_id: string
          sent_at?: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          expires_at?: string
          id?: string
          school_id?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_alerts_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_subscription_status: {
        Args: { school_uuid: string }
        Returns: {
          is_active: boolean
          days_remaining: number
          status: string
          message: string
        }[]
      }
      generate_random_email: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_secure_password: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_subscription_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_school_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      hash_password: {
        Args: { password: string }
        Returns: string
      }
      verify_password: {
        Args: { password: string; hashed_password: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
