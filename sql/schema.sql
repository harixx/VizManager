
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Active', 'On Pause', 'Ended')) DEFAULT 'Active',
    start_date DATE NOT NULL,
    duration VARCHAR(100) NOT NULL,
    project_type VARCHAR(20) CHECK (project_type IN ('milestone', 'timer', 'fixed', 'direct-client')) NOT NULL,
    deadline DATE,
    weekly_hours INTEGER,
    upwork_profile VARCHAR(255),
    business_developer VARCHAR(255),
    equivalent_hours INTEGER,
    team_members TEXT[] DEFAULT '{}',
    primary_goals TEXT[] DEFAULT '{}',
    focus_keywords TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'manager', 'viewer')) NOT NULL,
    project_assignments JSONB DEFAULT '[]',
    has_all_projects BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    avatar VARCHAR(10)
);

-- Audits table
CREATE TABLE IF NOT EXISTS audits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_website VARCHAR(255) NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    business_developer VARCHAR(255) NOT NULL,
    auditor VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    audit_sheet_links JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    upwork_profile VARCHAR(255) NOT NULL,
    business_developer VARCHAR(255) NOT NULL,
    reporting_person VARCHAR(255) NOT NULL,
    report_day VARCHAR(10) CHECK (report_day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')) NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    completion_history JSONB DEFAULT '[]'
);

-- Access items table (for project access)
CREATE TABLE IF NOT EXISTS access_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    type VARCHAR(255) NOT NULL,
    date_granted DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Active', 'Pending', 'Revoked')) DEFAULT 'Active',
    email VARCHAR(255),
    website_credentials JSONB,
    client_email JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Progress reports table
CREATE TABLE IF NOT EXISTS progress_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    report_url TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    month VARCHAR(255) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project documents table
CREATE TABLE IF NOT EXISTS project_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('progress-report', 'google-sheet', 'looker-studio', 'internal-doc')) NOT NULL,
    url TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    upload_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Queries table
CREATE TABLE IF NOT EXISTS queries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    qa_items JSONB DEFAULT '[]',
    assigned_to VARCHAR(255),
    status VARCHAR(20) CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')) DEFAULT 'Open',
    linked_sheet VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_client_name ON projects(client_name);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_audits_date ON audits(date);
CREATE INDEX IF NOT EXISTS idx_audits_month ON audits(month);
CREATE INDEX IF NOT EXISTS idx_reports_report_day ON reports(report_day);
CREATE INDEX IF NOT EXISTS idx_reports_is_active ON reports(is_active);

-- Row Level Security (RLS) policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (you can customize these based on your authentication needs)
CREATE POLICY "Enable read access for all users" ON projects FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON projects FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON users FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON users FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON users FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON audits FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON audits FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON audits FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON audits FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON reports FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON reports FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON reports FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON reports FOR DELETE USING (auth.role() = 'authenticated');

-- Similar policies for related tables
CREATE POLICY "Enable all access for authenticated users" ON access_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON progress_reports FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON project_documents FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON queries FOR ALL USING (auth.role() = 'authenticated');
