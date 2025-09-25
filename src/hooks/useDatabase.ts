
import { useState, useEffect } from 'react';
import { projectsService, usersService, auditsService, reportsService } from '../services/database';
// Removed mock data imports - now using Supabase exclusively
import type { Project } from '../types';
import type { User } from '../types/user';
import type { Audit } from '../types/audit';
import type { Report } from '../types/reports';

// Removed useSupabase check - now using Supabase exclusively

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectsService.getAll();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const addProject = async (project: Omit<Project, 'id' | 'accessGranted' | 'progressReports' | 'documents' | 'queries'>) => {
    try {
      const newProject = await projectsService.create(project);
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      throw err;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const updatedProject = await projectsService.update(id, updates);
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      return updatedProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await projectsService.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    refetch: loadProjects
  };
};

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await usersService.getAll();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const addUser = async (user: Omit<User, 'id' | 'createdAt'>) => {
    try {
      const newUser = await usersService.create(user);
      setUsers(prev => [newUser, ...prev]);
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      throw err;
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      const updatedUser = await usersService.update(id, updates);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await usersService.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    refetch: loadUsers
  };
};

export const useAudits = () => {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAudits = async () => {
    try {
      setLoading(true);
      const data = await auditsService.getAll();
      setAudits(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audits from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAudits();
  }, []);

  const addAudit = async (audit: Omit<Audit, 'id' | 'createdAt'>) => {
    try {
      const newAudit = await auditsService.create(audit);
      setAudits(prev => [newAudit, ...prev]);
      return newAudit;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create audit');
      throw err;
    }
  };

  const updateAudit = async (id: string, updates: Partial<Audit>) => {
    try {
      const updatedAudit = await auditsService.update(id, updates);
      setAudits(prev => prev.map(a => a.id === id ? updatedAudit : a));
      return updatedAudit;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update audit');
      throw err;
    }
  };

  const deleteAudit = async (id: string) => {
    try {
      await auditsService.delete(id);
      setAudits(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete audit');
      throw err;
    }
  };

  return {
    audits,
    loading,
    error,
    addAudit,
    updateAudit,
    deleteAudit,
    refetch: loadAudits
  };
};

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await reportsService.getAll();
      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const addReport = async (report: Omit<Report, 'id' | 'createdAt'>) => {
    try {
      const newReport = await reportsService.create(report);
      setReports(prev => [newReport, ...prev]);
      return newReport;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create report');
      throw err;
    }
  };

  const updateReport = async (id: string, updates: Partial<Report>) => {
    try {
      const updatedReport = await reportsService.update(id, updates);
      setReports(prev => prev.map(r => r.id === id ? updatedReport : r));
      return updatedReport;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update report');
      throw err;
    }
  };

  const deleteReport = async (id: string) => {
    try {
      await reportsService.delete(id);
      setReports(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete report');
      throw err;
    }
  };

  return {
    reports,
    loading,
    error,
    addReport,
    updateReport,
    deleteReport,
    refetch: loadReports
  };
};
