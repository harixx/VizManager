
-- Insert mock users
INSERT INTO users (id, email, name, role, project_assignments, has_all_projects, created_at, last_login, is_active, avatar) VALUES
('admin-1', 'admin@vizmanager.com', 'Admin User', 'admin', '[]', true, '2024-01-01T00:00:00Z', NOW(), true, 'AU'),
('manager-1', 'manager@vizmanager.com', 'Project Manager', 'manager', '[
  {
    "projectId": "1",
    "permissions": {
      "canView": true,
      "canEdit": true,
      "editableSections": ["goals", "queries", "documents"]
    }
  },
  {
    "projectId": "2", 
    "permissions": {
      "canView": true,
      "canEdit": true,
      "editableSections": ["queries", "documents"]
    }
  }
]', false, '2024-01-02T00:00:00Z', NOW() - INTERVAL '1 day', true, 'PM'),
('viewer-1', 'viewer@vizmanager.com', 'Client Viewer', 'viewer', '[
  {
    "projectId": "2",
    "permissions": {
      "canView": true,
      "canEdit": false,
      "editableSections": []
    }
  }
]', false, '2024-01-04T00:00:00Z', null, true, 'CV');

-- Insert mock projects
INSERT INTO projects (id, name, client_name, status, start_date, duration, project_type, deadline, upwork_profile, business_developer, team_members, primary_goals, focus_keywords, created_at) VALUES
('1', 'TechCorp Solutions', 'TechCorp Inc.', 'Active', '2024-01-15', '12 months', 'milestone', '2024-12-15', 'SEO Expert Pro', 'John Smith', 
 '["John Doe", "Sarah Wilson"]', 
 '["Increase organic traffic by 150%", "Rank top 3 for primary keywords"]', 
 '["enterprise software", "business automation", "cloud solutions"]',
 '2024-01-15T10:30:00Z'),
('2', 'GreenLeaf Organics', 'GreenLeaf Foods LLC', 'Active', '2024-02-01', '6 months', 'timer', null, 'SEO Content Specialist', 'Sarah Wilson',
 '["Mike Chen", "Lisa Rodriguez"]',
 '["Local SEO dominance", "E-commerce traffic growth"]',
 '["organic food delivery", "healthy meal plans", "sustainable farming"]',
 '2024-02-01T09:15:00Z');

-- Insert mock access items
INSERT INTO access_items (project_id, type, date_granted, status) VALUES
('1', 'Google Search Console', '2024-01-16', 'Active'),
('1', 'Google Analytics 4', '2024-01-16', 'Active'),
('2', 'Google My Business', '2024-02-02', 'Active');

-- Insert mock progress reports
INSERT INTO progress_reports (project_id, title, report_url, timestamp, month, notes) VALUES
('1', 'January 2024 Progress Report', 'https://docs.google.com/presentation/d/example-january-report', '2024-01-20T10:30:00Z', 'January 2024', 'Initial audit completed and sent to client');

-- Insert mock documents
INSERT INTO project_documents (project_id, name, type, url, category, upload_date, description) VALUES
('1', 'Client Analytics Dashboard', 'google-sheet', 'https://docs.google.com/spreadsheets/d/example-analytics', 'Analytics', '2024-01-16', 'Real-time analytics tracking sheet');

-- Insert mock queries
INSERT INTO queries (project_id, title, qa_items, assigned_to, status, linked_sheet, created_at) VALUES
('1', 'Content Strategy Clarification', '[
  {
    "id": "1",
    "question": "Need clarification on target market for content strategy",
    "answer": "Our primary target market is small to medium businesses in the tech sector, focusing on B2B services."
  }
]', 'John Doe', 'Open', 'Content Strategy Sheet', '2024-01-18T10:30:00Z');

-- Insert mock audits
INSERT INTO audits (id, client_website, project_name, business_developer, auditor, date, month, audit_sheet_links, created_at, updated_at) VALUES
('1', 'techcorp.com', 'TechCorp SEO Audit', 'John Smith', 'Alex Johnson', '2024-01-15', '2024-01', '[
  {
    "id": "1",
    "name": "Technical SEO Audit",
    "url": "https://docs.google.com/spreadsheets/d/example-technical-audit",
    "type": "technical",
    "description": "Complete technical SEO analysis including site speed, crawlability, and indexation"
  },
  {
    "id": "2", 
    "name": "Content Gap Analysis",
    "url": "https://docs.google.com/spreadsheets/d/example-content-audit",
    "type": "content",
    "description": "Content audit and gap analysis for improved rankings"
  }
]', '2024-01-15T10:30:00Z', '2024-01-16T14:20:00Z'),
('2', 'greenleaf.com', 'GreenLeaf Organic Foods Audit', 'Sarah Wilson', 'Sarah Chen', '2024-02-01', '2024-02', '[
  {
    "id": "3",
    "name": "Local SEO Audit", 
    "url": "https://docs.google.com/spreadsheets/d/example-local-audit",
    "type": "technical",
    "description": "Local SEO audit for organic food delivery service"
  },
  {
    "id": "4",
    "name": "Competitor Analysis",
    "url": "https://docs.google.com/spreadsheets/d/example-competitor-analysis", 
    "type": "competitor",
    "description": "Analysis of top 10 competitors in organic food space"
  }
]', '2024-02-01T09:15:00Z', null);

-- Insert mock reports
INSERT INTO reports (id, project_name, client_name, upwork_profile, business_developer, reporting_person, report_day, department_name, created_at, is_active, completion_history) VALUES
('1', 'TechCorp Solutions', 'TechCorp Inc.', 'SEO Expert Pro', 'John Smith', 'Alex Johnson', 'Monday', 'SEO Department', '2024-01-15T10:30:00Z', true, '[]'),
('2', 'GreenLeaf Organics', 'GreenLeaf Foods LLC', 'Digital Marketing Specialist', 'Sarah Wilson', 'Maria Garcia', 'Wednesday', 'Content Marketing', '2024-02-01T09:15:00Z', true, '[]'),
('3', 'Digital Marketing Pro', 'DMP Agency', 'PPC Campaign Manager', 'Mike Chen', 'David Wilson', 'Friday', 'PPC Department', '2024-02-15T11:45:00Z', true, '[]'),
('4', 'E-commerce Boost', 'Online Retail Co.', 'SEO Expert Pro', 'Lisa Rodriguez', 'Emily Davis', 'Tuesday', 'SEO Department', '2024-03-01T14:20:00Z', true, '[]');
