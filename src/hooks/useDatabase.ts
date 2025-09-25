
import { useState, useEffect } from 'react';
import { projectsService, usersService, auditsService, reportsService } from '../services/database';
import { MOCK_USERS } from '../types/user';
import { MOCK_AUDITS } from '../types/audit';
import { MOCK_REPORTS } from '../types/reports';
import type { Project } from '../types';
import type { User } from '../types/user';
import type { Audit } from '../types/audit';
import type { Report } from '../types/reports';

const useSupabase = () => {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      if (useSupabase()) {
        const data = await projectsService.getAll();
        setProjects(data);
      } else {
        // Use mock data from App.tsx
        setProjects([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const addProject = async (project: Omit<Project, 'id' | 'accessGranted' | 'progressReports' | 'documents' | 'queries'>) => {
    try {
      if (useSupabase()) {
        const newProject = await projectsService.create(project);
        setProjects(prev => [newProject, ...prev]);
        return newProject;
      } else {
        throw new Error('Mock data mode - implement in parent component');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      if (useSupabase()) {
        const updatedProject = await projectsService.update(id, updates);
        setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
        return updatedProject;
      } else {
        throw new Error('Mock data mode - implement in parent component');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      if (useSupabase()) {
        await projectsService.delete(id);
        setProjects(prev => prev.filter(p => p.id !== id));
      } else {
        throw new Error('Mock data mode - implement in parent component');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
      if (useSupabase()) {
        const data = await usersService.getAll();
        setUsers(data);
      } else {
        setUsers(MOCK_USERS);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const addUser = async (user: Omit<User, 'id' | 'createdAt'>) => {
    try {
      if (useSupabase()) {
        const newUser = await usersService.create(user);
        setUsers(prev => [newUser, ...prev]);
        return newUser;
      } else {
        const newUser: User = {
          ...user,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          avatar: user.name.split(' ').map(n => n[0]).join('')
        };
        setUsers(prev => [newUser, ...prev]);
        return newUser;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      if (useSupabase()) {
        const updatedUser = await usersService.update(id, updates);
        setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
        return updatedUser;
      } else {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
        return { ...updates, id } as User;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      if (useSupabase()) {
        await usersService.delete(id);
        setUsers(prev => prev.filter(u => u.id !== id));
      } else {
        setUsers(prev => prev.filter(u => u.id !== id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
      if (useSupabase()) {
        const data = await auditsService.getAll();
        setAudits(data);
      } else {
        setAudits(MOCK_AUDITS);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAudits();
  }, []);

  const addAudit = async (audit: Omit<Audit, 'id' | 'createdAt'>) => {
    try {
      if (useSupabase()) {
        const newAudit = await auditsService.create(audit);
        setAudits(prev => [newAudit, ...prev]);
        return newAudit;
      } else {
        const newAudit: Audit = {
          ...audit,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        setAudits(prev => [newAudit, ...prev]);
        return newAudit;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateAudit = async (id: string, updates: Partial<Audit>) => {
    try {
      if (useSupabase()) {
        const updatedAudit = await auditsService.update(id, updates);
        setAudits(prev => prev.map(a => a.id === id ? updatedAudit : a));
        return updatedAudit;
      } else {
        const updatedAudit = { ...updates, id, updatedAt: new Date().toISOString() } as Audit;
        setAudits(prev => prev.map(a => a.id === id ? updatedAudit : a));
        return updatedAudit;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteAudit = async (id: string) => {
    try {
      if (useSupabase()) {
        await auditsService.delete(id);
        setAudits(prev => prev.filter(a => a.id !== id));
      } else {
        setAudits(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
      if (useSupabase()) {
        const data = await reportsService.getAll();
        setReports(data);
      } else {
        setReports(MOCK_REPORTS);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const addReport = async (report: Omit<Report, 'id' | 'createdAt'>) => {
    try {
      if (useSupabase()) {
        const newReport = await reportsService.create(report);
        setReports(prev => [newReport, ...prev]);
        return newReport;
      } else {
        const newReport: Report = {
          ...report,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        setReports(prev => [newReport, ...prev]);
        return newReport;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateReport = async (id: string, updates: Partial<Report>) => {
    try {
      if (useSupabase()) {
        const updatedReport = await reportsService.update(id, updates);
        setReports(prev => prev.map(r => r.id === id ? updatedReport : r));
        return updatedReport;
      } else {
        const updatedReport = { ...updates, id, updatedAt: new Date().toISOString() } as Report;
        setReports(prev => prev.map(r => r.id === id ? updatedReport : r));
        return updatedReport;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteReport = async (id: string) => {
    try {
      if (useSupabase()) {
        await reportsService.delete(id);
        setReports(prev => prev.filter(r => r.id !== id));
      } else {
        setReports(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
