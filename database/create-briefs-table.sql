-- Create briefs table
CREATE TABLE IF NOT EXISTS briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  project_name TEXT NOT NULL,
  what_building TEXT,
  why_building TEXT,
  who_using TEXT,
  success_goals TEXT,
  site_map JSONB DEFAULT '{"pages": []}'::jsonb,
  user_journeys JSONB DEFAULT '[]'::jsonb,
  page_content JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_briefs_user_id ON briefs(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_briefs_created_at ON briefs(created_at DESC);
