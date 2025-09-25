# VIZ Manager - Project Management Dashboard

## Overview
This is a React TypeScript application built with Vite that provides a comprehensive project management dashboard. The application manages VIZ (SEO) projects, client information, team assignments, and progress tracking.

## Project Structure
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Development Server**: Vite dev server on port 5000
- **Build Tool**: Vite bundler

## Recent Changes (2025-09-25)
- Successfully imported GitHub repository to Replit environment
- Configured Vite to work with Replit proxy (host: 0.0.0.0:5000, HMR clientPort: 443)
- Set up development workflow and deployment configuration
- Fixed TypeScript warnings in App.tsx
- Installed dependencies and verified application functionality

## Key Features
- Project dashboard with filtering and search
- Detailed project views with tabs (Overview, Goals, Access, Documents, Queries)
- User management with role-based access control
- Audit management system
- Reports management
- Authentication context with protected routes
- Dark/light theme support
- Responsive design with Tailwind CSS

## Project Architecture
- **Context Providers**: AuthContext, ThemeContext
- **Components**: Organized by feature (admin, audit, auth, reports, tabs, ui)
- **State Management**: React hooks with local state
- **Routing**: Hash-based navigation for different views
- **Data**: Sample data structure for projects, users, audits, and reports

## Development Setup
1. Dependencies installed via npm
2. Vite dev server configured for Replit environment
3. Workflow set up to run `npm run dev` on port 5000
4. Production deployment configured with `serve` package

## Deployment Configuration
- **Target**: Autoscale (for static website)
- **Build**: `npm run build`
- **Run**: `npx serve -s dist -p 5000`