import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ThemeProvider } from './contexts/ThemeContext';
import Dashboard from './components/Dashboard';
import ProjectDetail from './components/ProjectDetail';
import UserManagementDashboard from './components/admin/UserManagementDashboard';
import AuditManagementDashboard from './components/audit/AuditManagementDashboard';
import ReportsManagementDashboard from './components/reports/ReportsManagementDashboard';
import { useProjects } from './hooks/useDatabase';
import { Project } from './types';

function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'projects' | 'users' | 'audits' | 'reports'>('projects');
  const { projects, loading, error, addProject, updateProject, deleteProject } = useProjects();

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleProjectUpdate = async (updatedProject: Project) => {
    try {
      const updated = await updateProject(updatedProject.id, updatedProject);
      setSelectedProject(updated);
    } catch (err) {
      console.error('Error updating project:', err);
    }
  };

  const handleProjectAdd = async (newProject: Omit<Project, 'id'>) => {
    try {
      await addProject(newProject);
    } catch (err) {
      console.error('Error adding project:', err);
    }
  };

  const handleProjectDelete = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject(null);
      }
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const handleViewChangeExtended = (view: 'dashboard' | 'projects' | 'users' | 'audits' | 'reports') => {
    setCurrentView(view);
    setSelectedProject(null); // Clear selected project when changing views
  };

  // Handle hash-based navigation for cross-page links
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'audits') {
        setCurrentView('audits');
      } else if (hash === 'reports') {
        setCurrentView('reports');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check initial hash

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderCurrentView = () => {
    if (selectedProject) {
      return (
        <ProjectDetail 
          project={selectedProject} 
          onBack={() => setSelectedProject(null)}
          onUpdate={handleProjectUpdate}
        />
      );
    }

    switch (currentView) {
      case 'users':
        return (
          <ProtectedRoute requiredRole={['admin']}>
            <UserManagementDashboard onBack={() => setCurrentView('projects')} />
          </ProtectedRoute>
        );
      case 'audits':
        return (
          <AuditManagementDashboard onBack={() => setCurrentView('projects')} />
        );
      case 'reports':
        return (
          <ReportsManagementDashboard onBack={() => setCurrentView('projects')} />
        );
      case 'projects':
      default:
        if (loading) {
          return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
              <div className="text-xl">Loading projects...</div>
            </div>
          );
        }
        
        if (error) {
          return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
              <div className="text-xl text-red-600">Error loading projects: {error}</div>
            </div>
          );
        }
        
        return (
          <Dashboard 
            projects={projects} 
            onProjectSelect={handleProjectSelect}
            onProjectAdd={handleProjectAdd}
            onProjectDelete={handleProjectDelete}
            onViewChange={handleViewChangeExtended}
            currentView={currentView}
          />
        );
    }
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <ProtectedRoute>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            {renderCurrentView()}
          </div>
        </ProtectedRoute>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;