import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ThemeProvider } from './contexts/ThemeContext';
import Dashboard from './components/Dashboard';
import ProjectDetail from './components/ProjectDetail';
import UserManagementDashboard from './components/admin/UserManagementDashboard';
import AuditManagementDashboard from './components/audit/AuditManagementDashboard';
import ReportsManagementDashboard from './components/reports/ReportsManagementDashboard';
import { Project } from './types';

function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'projects' | 'users' | 'audits' | 'reports'>('projects');
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'TechCorp Solutions',
      clientName: 'TechCorp Inc.',
      status: 'Active',
      startDate: '2024-01-15',
      duration: '12 months',
      projectType: 'milestone',
      deadline: '2024-12-15',
      upworkProfile: 'SEO Expert Pro',
      businessDeveloper: 'John Smith',
      teamMembers: ['John Doe', 'Sarah Wilson'],
      primaryGoals: ['Increase organic traffic by 150%', 'Rank top 3 for primary keywords'],
      focusKeywords: ['enterprise software', 'business automation', 'cloud solutions'],
      accessGranted: [
        { type: 'Google Search Console', dateGranted: '2024-01-16', status: 'Active' },
        { type: 'Google Analytics 4', dateGranted: '2024-01-16', status: 'Active' }
      ],
      progressReports: [
        {
          id: '1',
          title: 'January 2024 Progress Report',
          reportUrl: 'https://docs.google.com/presentation/d/example-january-report',
          timestamp: '2024-01-20T10:30:00Z',
          month: 'January 2024',
          notes: 'Initial audit completed and sent to client'
        }
      ],
      documents: [
        {
          id: '1',
          name: 'Client Analytics Dashboard',
          type: 'google-sheet',
          url: 'https://docs.google.com/spreadsheets/d/example-analytics',
          category: 'Analytics',
          uploadDate: '2024-01-16',
          description: 'Real-time analytics tracking sheet'
        }
      ],
      queries: [
        {
          id: '1',
          title: 'Content Strategy Clarification',
          qaItems: [
            {
              id: '1',
              question: 'Need clarification on target market for content strategy',
              answer: 'Our primary target market is small to medium businesses in the tech sector, focusing on B2B services.'
            }
          ],
          assignedTo: 'John Doe',
          status: 'Open',
          linkedSheet: 'Content Strategy Sheet',
          createdAt: '2024-01-18T10:30:00Z'
        }
      ]
    },
    {
      id: '2',
      name: 'GreenLeaf Organics',
      clientName: 'GreenLeaf Foods LLC',
      status: 'Active',
      startDate: '2024-02-01',
      duration: '6 months',
      projectType: 'timer',
      weeklyHours: 15,
      upworkProfile: 'SEO Content Specialist',
      businessDeveloper: 'Sarah Wilson',
      teamMembers: ['Mike Chen', 'Lisa Rodriguez'],
      primaryGoals: ['Local SEO dominance', 'E-commerce traffic growth'],
      focusKeywords: ['organic food delivery', 'healthy meal plans', 'sustainable farming'],
      accessGranted: [
        { type: 'Google My Business', dateGranted: '2024-02-02', status: 'Active' }
      ],
      progressReports: [],
      documents: [],
      queries: []
    }
  ]);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleBackToDashboard = () => {
    setSelectedProject(null);
  };

  const handleProjectUpdate = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
  };

  const handleProjectAdd = (newProject: Omit<Project, 'id'>) => {
    const project: Project = {
      ...newProject,
      id: Date.now().toString(),
      accessGranted: [],
      progressReports: [],
      documents: [],
      queries: []
    };
    setProjects([...projects, project]);
  };

  const handleProjectDelete = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(null);
    }
  };

  const handleViewChange = (view: 'dashboard' | 'projects' | 'users') => {
    setCurrentView(view);
    setSelectedProject(null); // Clear selected project when changing views
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