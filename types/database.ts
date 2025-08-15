export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          department: string | null
          created_at: string
          updated_at: string
          last_login_at: string | null
          is_active: boolean
        }
        Insert: {
          id: string
          email: string
          name: string
          department?: string | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          name?: string
          department?: string | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          is_active?: boolean
        }
      }
      permissions: {
        Row: {
          id: string
          name: string
          description: string | null
          can_view_forecast: boolean
          can_edit_forecast: boolean
          can_add_new_hire: boolean
          can_access_settings: boolean
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          can_view_forecast?: boolean
          can_edit_forecast?: boolean
          can_add_new_hire?: boolean
          can_access_settings?: boolean
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          can_view_forecast?: boolean
          can_edit_forecast?: boolean
          can_add_new_hire?: boolean
          can_access_settings?: boolean
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_permissions: {
        Row: {
          id: string
          user_id: string
          permission_id: string
          assigned_at: string
          assigned_by: string | null
        }
        Insert: {
          id?: string
          user_id: string
          permission_id: string
          assigned_at?: string
          assigned_by?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          permission_id?: string
          assigned_at?: string
          assigned_by?: string | null
        }
      }
      employees: {
        Row: {
          id: string
          employee_number: string | null
          name: string
          name_kana: string | null
          gender: string | null
          age: number | null
          recruitment_type: 'new_graduate' | 'mid_career' | 'contract' | 'part_time' | 'intern' | null
          employment_type: 'full_time' | 'contract' | 'part_time' | 'temporary' | 'intern' | null
          role: string | null
          department: string | null
          join_date: string | null
          recruitment_cost: number | null
          application_source: string | null
          recruiter_id: string | null
          hr_status: string | null
          it_status: string | null
          hr_admin_status: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          employee_number?: string | null
          name: string
          name_kana?: string | null
          gender?: string | null
          age?: number | null
          recruitment_type?: 'new_graduate' | 'mid_career' | 'contract' | 'part_time' | 'intern' | null
          employment_type?: 'full_time' | 'contract' | 'part_time' | 'temporary' | 'intern' | null
          role?: string | null
          department?: string | null
          join_date?: string | null
          recruitment_cost?: number | null
          application_source?: string | null
          recruiter_id?: string | null
          hr_status?: string | null
          it_status?: string | null
          hr_admin_status?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          employee_number?: string | null
          name?: string
          name_kana?: string | null
          gender?: string | null
          age?: number | null
          recruitment_type?: 'new_graduate' | 'mid_career' | 'contract' | 'part_time' | 'intern' | null
          employment_type?: 'full_time' | 'contract' | 'part_time' | 'temporary' | 'intern' | null
          role?: string | null
          department?: string | null
          join_date?: string | null
          recruitment_cost?: number | null
          application_source?: string | null
          recruiter_id?: string | null
          hr_status?: string | null
          it_status?: string | null
          hr_admin_status?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          name: string
          display_order: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      fields: {
        Row: {
          id: string
          category_id: string
          name: string
          field_type: 'text' | 'select' | 'multiselect' | 'date' | 'checkbox'
          is_required: boolean
          display_order: number
          column_width: number
          is_active: boolean
          is_archived: boolean
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          field_type: 'text' | 'select' | 'multiselect' | 'date' | 'checkbox'
          is_required?: boolean
          display_order: number
          column_width?: number
          is_active?: boolean
          is_archived?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          field_type?: 'text' | 'select' | 'multiselect' | 'date' | 'checkbox'
          is_required?: boolean
          display_order?: number
          column_width?: number
          is_active?: boolean
          is_archived?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      departments: {
        Row: {
          id: string
          name: string
          display_order: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          display_order?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          display_order?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      roles: {
        Row: {
          id: string
          name: string
          category: string | null
          display_order: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category?: string | null
          display_order?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string | null
          display_order?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      field_type: 'text' | 'select' | 'multiselect' | 'date' | 'checkbox'
      recruitment_type: 'new_graduate' | 'mid_career' | 'contract' | 'part_time' | 'intern'
      employment_type: 'full_time' | 'contract' | 'part_time' | 'temporary' | 'intern'
    }
  }
}