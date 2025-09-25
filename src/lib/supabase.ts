
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Using fallback mode.')
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null

// Database Types
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          client_name: string
          status: 'Active' | 'On Pause' | 'Ended'
          start_date: string
          duration: string
          project_type: 'milestone' | 'timer' | 'fixed' | 'direct-client'
          deadline?: string
          weekly_hours?: number
          upwork_profile?: string
          business_developer?: string
          equivalent_hours?: number
          team_members: string[]
          primary_goals: string[]
          focus_keywords: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          client_name: string
          status: 'Active' | 'On Pause' | 'Ended'
          start_date: string
          duration: string
          project_type: 'milestone' | 'timer' | 'fixed' | 'direct-client'
          deadline?: string
          weekly_hours?: number
          upwork_profile?: string
          business_developer?: string
          equivalent_hours?: number
          team_members: string[]
          primary_goals: string[]
          focus_keywords: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          client_name?: string
          status?: 'Active' | 'On Pause' | 'Ended'
          start_date?: string
          duration?: string
          project_type?: 'milestone' | 'timer' | 'fixed' | 'direct-client'
          deadline?: string
          weekly_hours?: number
          upwork_profile?: string
          business_developer?: string
          equivalent_hours?: number
          team_members?: string[]
          primary_goals?: string[]
          focus_keywords?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'manager' | 'viewer'
          project_assignments: any[]
          has_all_projects: boolean
          created_at: string
          last_login?: string
          is_active: boolean
          avatar?: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'admin' | 'manager' | 'viewer'
          project_assignments?: any[]
          has_all_projects?: boolean
          created_at?: string
          last_login?: string
          is_active?: boolean
          avatar?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'manager' | 'viewer'
          project_assignments?: any[]
          has_all_projects?: boolean
          created_at?: string
          last_login?: string
          is_active?: boolean
          avatar?: string
        }
      }
      audits: {
        Row: {
          id: string
          client_website: string
          project_name: string
          business_developer: string
          auditor: string
          date: string
          month: string
          audit_sheet_links: any[]
          created_at: string
          updated_at?: string
        }
        Insert: {
          id?: string
          client_website: string
          project_name: string
          business_developer: string
          auditor: string
          date: string
          month: string
          audit_sheet_links?: any[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_website?: string
          project_name?: string
          business_developer?: string
          auditor?: string
          date?: string
          month?: string
          audit_sheet_links?: any[]
          created_at?: string
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          project_name: string
          client_name: string
          upwork_profile: string
          business_developer: string
          reporting_person: string
          report_day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
          department_name: string
          created_at: string
          updated_at?: string
          is_active: boolean
          completion_history: any[]
        }
        Insert: {
          id?: string
          project_name: string
          client_name: string
          upwork_profile: string
          business_developer: string
          reporting_person: string
          report_day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
          department_name: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
          completion_history?: any[]
        }
        Update: {
          id?: string
          project_name?: string
          client_name?: string
          upwork_profile?: string
          business_developer?: string
          reporting_person?: string
          report_day?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
          department_name?: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
          completion_history?: any[]
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
      [_ in never]: never
    }
  }
}
