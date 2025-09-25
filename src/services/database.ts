
import { supabase } from '../lib/supabase'
import type { Project } from '../types'
import type { User } from '../types/user'
import type { Audit } from '../types/audit'
import type { Report } from '../types/reports'

// Projects
export const projectsService = {
  async getAll(): Promise<Project[]> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        access_granted:access_items(*),
        progress_reports(*),
        documents:project_documents(*),
        queries(*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Project | null> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        access_granted:access_items(*),
        progress_reports(*),
        documents:project_documents(*),
        queries(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(project: Omit<Project, 'id' | 'accessGranted' | 'progressReports' | 'documents' | 'queries'>): Promise<Project> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: project.name,
        client_name: project.clientName,
        status: project.status,
        start_date: project.startDate,
        duration: project.duration,
        project_type: project.projectType,
        deadline: project.deadline,
        weekly_hours: project.weeklyHours,
        upwork_profile: project.upworkProfile,
        business_developer: project.businessDeveloper,
        equivalent_hours: project.equivalentHours,
        team_members: project.teamMembers,
        primary_goals: project.primaryGoals,
        focus_keywords: project.focusKeywords
      })
      .select()
      .single()

    if (error) throw error
    return this.mapDbProjectToProject(data)
  },

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('projects')
      .update({
        name: updates.name,
        client_name: updates.clientName,
        status: updates.status,
        start_date: updates.startDate,
        duration: updates.duration,
        project_type: updates.projectType,
        deadline: updates.deadline,
        weekly_hours: updates.weeklyHours,
        upwork_profile: updates.upworkProfile,
        business_developer: updates.businessDeveloper,
        equivalent_hours: updates.equivalentHours,
        team_members: updates.teamMembers,
        primary_goals: updates.primaryGoals,
        focus_keywords: updates.focusKeywords,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return this.mapDbProjectToProject(data)
  },

  async delete(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  mapDbProjectToProject(dbProject: any): Project {
    return {
      id: dbProject.id,
      name: dbProject.name,
      clientName: dbProject.client_name,
      status: dbProject.status,
      startDate: dbProject.start_date,
      duration: dbProject.duration,
      projectType: dbProject.project_type,
      deadline: dbProject.deadline,
      weeklyHours: dbProject.weekly_hours,
      upworkProfile: dbProject.upwork_profile,
      businessDeveloper: dbProject.business_developer,
      equivalentHours: dbProject.equivalent_hours,
      teamMembers: dbProject.team_members || [],
      primaryGoals: dbProject.primary_goals || [],
      focusKeywords: dbProject.focus_keywords || [],
      accessGranted: dbProject.access_granted || [],
      progressReports: dbProject.progress_reports || [],
      documents: dbProject.documents || [],
      queries: dbProject.queries || []
    }
  }
}

// Users
export const usersService = {
  async getAll(): Promise<User[]> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(this.mapDbUserToUser)
  },

  async getById(id: string): Promise<User | null> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data ? this.mapDbUserToUser(data) : null
  },

  async create(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: user.email,
        name: user.name,
        role: user.role,
        project_assignments: user.projectAssignments,
        has_all_projects: user.hasAllProjects,
        last_login: user.lastLogin,
        is_active: user.isActive,
        avatar: user.avatar
      })
      .select()
      .single()

    if (error) throw error
    return this.mapDbUserToUser(data)
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('users')
      .update({
        email: updates.email,
        name: updates.name,
        role: updates.role,
        project_assignments: updates.projectAssignments,
        has_all_projects: updates.hasAllProjects,
        last_login: updates.lastLogin,
        is_active: updates.isActive,
        avatar: updates.avatar,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return this.mapDbUserToUser(data)
  },

  async delete(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  mapDbUserToUser(dbUser: any): User {
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      projectAssignments: dbUser.project_assignments || [],
      hasAllProjects: dbUser.has_all_projects,
      createdAt: dbUser.created_at,
      lastLogin: dbUser.last_login,
      isActive: dbUser.is_active,
      avatar: dbUser.avatar
    }
  }
}

// Audits
export const auditsService = {
  async getAll(): Promise<Audit[]> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('audits')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(this.mapDbAuditToAudit)
  },

  async create(audit: Omit<Audit, 'id' | 'createdAt'>): Promise<Audit> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('audits')
      .insert({
        client_website: audit.clientWebsite,
        project_name: audit.projectName,
        business_developer: audit.businessDeveloper,
        auditor: audit.auditor,
        date: audit.date,
        month: audit.month,
        audit_sheet_links: audit.auditSheetLinks
      })
      .select()
      .single()

    if (error) throw error
    return this.mapDbAuditToAudit(data)
  },

  async update(id: string, updates: Partial<Audit>): Promise<Audit> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('audits')
      .update({
        client_website: updates.clientWebsite,
        project_name: updates.projectName,
        business_developer: updates.businessDeveloper,
        auditor: updates.auditor,
        date: updates.date,
        month: updates.month,
        audit_sheet_links: updates.auditSheetLinks,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return this.mapDbAuditToAudit(data)
  },

  async delete(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { error } = await supabase
      .from('audits')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  mapDbAuditToAudit(dbAudit: any): Audit {
    return {
      id: dbAudit.id,
      clientWebsite: dbAudit.client_website,
      projectName: dbAudit.project_name,
      businessDeveloper: dbAudit.business_developer,
      auditor: dbAudit.auditor,
      date: dbAudit.date,
      month: dbAudit.month,
      auditSheetLinks: dbAudit.audit_sheet_links || [],
      createdAt: dbAudit.created_at,
      updatedAt: dbAudit.updated_at
    }
  }
}

// Reports
export const reportsService = {
  async getAll(): Promise<Report[]> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(this.mapDbReportToReport)
  },

  async create(report: Omit<Report, 'id' | 'createdAt'>): Promise<Report> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('reports')
      .insert({
        project_name: report.projectName,
        client_name: report.clientName,
        upwork_profile: report.upworkProfile,
        business_developer: report.businessDeveloper,
        reporting_person: report.reportingPerson,
        report_day: report.reportDay,
        department_name: report.departmentName,
        is_active: report.isActive,
        completion_history: report.completionHistory
      })
      .select()
      .single()

    if (error) throw error
    return this.mapDbReportToReport(data)
  },

  async update(id: string, updates: Partial<Report>): Promise<Report> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('reports')
      .update({
        project_name: updates.projectName,
        client_name: updates.clientName,
        upwork_profile: updates.upworkProfile,
        business_developer: updates.businessDeveloper,
        reporting_person: updates.reportingPerson,
        report_day: updates.reportDay,
        department_name: updates.departmentName,
        is_active: updates.isActive,
        completion_history: updates.completionHistory,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return this.mapDbReportToReport(data)
  },

  async delete(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  mapDbReportToReport(dbReport: any): Report {
    return {
      id: dbReport.id,
      projectName: dbReport.project_name,
      clientName: dbReport.client_name,
      upworkProfile: dbReport.upwork_profile,
      businessDeveloper: dbReport.business_developer,
      reportingPerson: dbReport.reporting_person,
      reportDay: dbReport.report_day,
      departmentName: dbReport.department_name,
      createdAt: dbReport.created_at,
      updatedAt: dbReport.updated_at,
      isActive: dbReport.is_active,
      completionHistory: dbReport.completion_history || []
    }
  }
}

// Authentication
export const authService = {
  async signUp(email: string, password: string, userData: { name: string; role: string }) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  async signOut() {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentSession() {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  async getCurrentUser() {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }
}
