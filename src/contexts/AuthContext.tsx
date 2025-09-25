import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, MOCK_USERS, MOCK_CREDENTIALS, PERMISSION_LEVELS } from '../types/user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const savedUser = localStorage.getItem('viz-manager-user');
        const sessionExpiry = localStorage.getItem('viz-manager-session-expiry');
        
        if (savedUser && sessionExpiry) {
          const now = new Date().getTime();
          const expiryTime = new Date(sessionExpiry).getTime();

          if (now < expiryTime) {
            const userData = JSON.parse(savedUser);
            setUser(userData);
          } else {
            localStorage.removeItem('viz-manager-user');
            localStorage.removeItem('viz-manager-session-expiry');
          }
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
        localStorage.removeItem('viz-manager-user');
        localStorage.removeItem('viz-manager-session-expiry');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    
    try {
      // Check mock credentials
      const validPassword = MOCK_CREDENTIALS[email as keyof typeof MOCK_CREDENTIALS];
      
      if (!validPassword || validPassword !== password) {
        return false;
      }
      
      // Find user by email
      const foundUser = MOCK_USERS.find(u => u.email === email && u.isActive);
      
      if (!foundUser) {
        return false;
      }
      
      // Update last login
      const updatedUser = {
        ...foundUser,
        lastLogin: new Date().toISOString()
      };
      
      // Set session expiry (24 hours)
      const sessionExpiry = new Date();
      sessionExpiry.setHours(sessionExpiry.getHours() + 24);
      
      // Save to localStorage
      localStorage.setItem('viz-manager-user', JSON.stringify(updatedUser));
      localStorage.setItem('viz-manager-session-expiry', sessionExpiry.toISOString());
      
      setUser(updatedUser);
      return true;
      
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('viz-manager-user');
    localStorage.removeItem('viz-manager-session-expiry');
  };

  const hasPermission = (section: string, action: string): boolean => {
    if (!user || !user.isActive) return false;
    
    // Admin has all permissions
    if (user.role === 'admin') return true;
    
    // Check specific permissions based on role
    const rolePermissions = PERMISSION_LEVELS[user.role].permissions;
    return rolePermissions.some(permission => {
      const hasSection = permission.section === 'all' || permission.section === section;
      const hasAction = permission.actions.includes(action as any);
      return hasSection && hasAction;
    });
  };

  const canAccessProject = (projectId: string): boolean => {
    if (!user || !user.isActive) return false;
    
    // Admin can access all projects
    if (user.role === 'admin' || user.hasAllProjects) return true;
    
    // Check if user has specific project assignment
    return user.projectAssignments.some(assignment => 
      assignment.projectId === projectId && assignment.permissions.canView
    );
  };

  const canEditProjectSection = (projectId: string, section: string): boolean => {
    if (!user || !user.isActive) return false;
    
    // Admin can edit everything
    if (user.role === 'admin') return true;
    
    // Check project-specific permissions
    const projectAssignment = user.projectAssignments.find(
      assignment => assignment.projectId === projectId
    );
    
    if (!projectAssignment || !projectAssignment.permissions.canEdit) {
      return false;
    }
    
    // Check if user can edit this specific section
    return projectAssignment.permissions.editableSections.includes(section as any);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
    canAccessProject,
    canEditProjectSection,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};