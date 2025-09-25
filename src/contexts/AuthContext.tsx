import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, PERMISSION_LEVELS } from '../types/user';
import { authService, usersService } from '../services/database';
import { supabase } from '../lib/supabase';

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

  // Check for existing Supabase session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        if (!supabase) {
          setIsLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get user profile from database
          const userProfile = await usersService.getById(session.user.id);
          if (userProfile && userProfile.isActive) {
            setUser(userProfile);
          }
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();

    // Listen for auth state changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            const userProfile = await usersService.getById(session.user.id);
            if (userProfile && userProfile.isActive) {
              setUser(userProfile);
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        }
      );

      return () => subscription.unsubscribe();
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (!supabase) {
        throw new Error('Authentication service not available');
      }

      const { user: authUser } = await authService.signIn(email, password);
      if (authUser) {
        // Get user profile from database
        const userProfile = await usersService.getById(authUser.id);
        if (userProfile && userProfile.isActive) {
          // Update last login
          const updatedUser = await usersService.update(userProfile.id, {
            lastLogin: new Date().toISOString()
          });
          setUser(updatedUser);
          return true;
        } else {
          throw new Error('User profile not found or inactive');
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      if (supabase) {
        await authService.signOut();
      }
    } catch (error) {
      console.error('Error signing out from Supabase:', error);
    }
    
    setUser(null);
  };

  const hasPermission = (section: string, action: string): boolean => {
    if (!user || !user.isActive) return false;
    
    // Admin has all permissions
    if (user.role === 'admin') return true;
    
    // Check specific permissions based on role
    const rolePermissions = PERMISSION_LEVELS[user.role].permissions;
    return rolePermissions.some(permission => {
      const hasSection = permission.section === section || (permission.section as string) === 'all';
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