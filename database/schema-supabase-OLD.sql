-- PM Toolkit Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users table (extends Supabase auth.users)
-- Note: Supabase auth.users is automatically created
-- We'll use the built-in auth system and extend with metadata

-- 2. Prompt Categories
CREATE TABLE prompt_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Prompts
CREATE TABLE prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES prompt_categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    prompt_text TEXT NOT NULL,
    ai_tool TEXT NOT NULL DEFAULT 'any', -- 'claude', 'bolt.ai', 'chatgpt', 'any'
    difficulty TEXT NOT NULL DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Briefs
CREATE TABLE briefs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT,
    project_description TEXT,
    target_audience TEXT,
    key_features JSONB DEFAULT '[]',
    design_preferences JSONB DEFAULT '{}',
    sitemap_data JSONB,
    user_journey_data JSONB,
    status TEXT DEFAULT 'draft', -- 'draft', 'completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Guidelines
CREATE TABLE guidelines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section TEXT NOT NULL, -- 'site-maps', 'user-journeys', 'decision-trees', 'best-practices'
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    examples JSONB DEFAULT '[]',
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_prompts_category ON prompts(category_id);
CREATE INDEX idx_prompts_difficulty ON prompts(difficulty);
CREATE INDEX idx_prompts_ai_tool ON prompts(ai_tool);
CREATE INDEX idx_briefs_user ON briefs(user_id);
CREATE INDEX idx_briefs_status ON briefs(status);
CREATE INDEX idx_guidelines_section ON guidelines(section);

-- Enable Row Level Security (RLS)
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidelines ENABLE ROW LEVEL SECURITY;

-- RLS Policies for prompt_categories (everyone can read, only admins can modify)
CREATE POLICY "Anyone can view prompt categories"
    ON prompt_categories FOR SELECT
    USING (true);

CREATE POLICY "Only admins can insert prompt categories"
    ON prompt_categories FOR INSERT
    WITH CHECK (
        (auth.jwt() ->> 'role')::text = 'admin'
    );

CREATE POLICY "Only admins can update prompt categories"
    ON prompt_categories FOR UPDATE
    USING (
        (auth.jwt() ->> 'role')::text = 'admin'
    );

CREATE POLICY "Only admins can delete prompt categories"
    ON prompt_categories FOR DELETE
    USING (
        (auth.jwt() ->> 'role')::text = 'admin'
    );

-- RLS Policies for prompts (everyone can read, only admins can modify)
CREATE POLICY "Anyone can view prompts"
    ON prompts FOR SELECT
    USING (true);

CREATE POLICY "Only admins can insert prompts"
    ON prompts FOR INSERT
    WITH CHECK (
        (auth.jwt() ->> 'role')::text = 'admin'
    );

CREATE POLICY "Only admins can update prompts"
    ON prompts FOR UPDATE
    USING (
        (auth.jwt() ->> 'role')::text = 'admin'
    );

CREATE POLICY "Only admins can delete prompts"
    ON prompts FOR DELETE
    USING (
        (auth.jwt() ->> 'role')::text = 'admin'
    );

-- RLS Policies for briefs (users can only access their own)
CREATE POLICY "Users can view their own briefs"
    ON briefs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own briefs"
    ON briefs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own briefs"
    ON briefs FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own briefs"
    ON briefs FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for guidelines (everyone can read, only admins can modify)
CREATE POLICY "Anyone can view guidelines"
    ON guidelines FOR SELECT
    USING (true);

CREATE POLICY "Only admins can insert guidelines"
    ON guidelines FOR INSERT
    WITH CHECK (
        (auth.jwt() ->> 'role')::text = 'admin'
    );

CREATE POLICY "Only admins can update guidelines"
    ON guidelines FOR UPDATE
    USING (
        (auth.jwt() ->> 'role')::text = 'admin'
    );

CREATE POLICY "Only admins can delete guidelines"
    ON guidelines FOR DELETE
    USING (
        (auth.jwt() ->> 'role')::text = 'admin'
    );

-- Seed initial data

-- Insert Prompt Categories
INSERT INTO prompt_categories (name, description, icon, "order") VALUES
('Getting Started', 'Basic setup and initialization prompts', 'Rocket', 1),
('Backend', 'Server, API, and database prompts', 'Server', 2),
('Authentication', 'User login, signup, and security', 'Lock', 3),
('UI Components', 'Headers, footers, forms, and buttons', 'Layout', 4),
('Data Management', 'CRUD operations and state management', 'Database', 5),
('Integrations', 'Payment, email, and third-party services', 'Plug', 6),
('Admin Features', 'Dashboards and management interfaces', 'Shield', 7),
('E-commerce', 'Shopping carts, products, and checkout', 'ShoppingCart', 8);

-- Insert Sample Prompts
INSERT INTO prompts (category_id, title, description, prompt_text, ai_tool, difficulty, tags)
SELECT
    (SELECT id FROM prompt_categories WHERE name = 'Getting Started'),
    'Create a Basic React App',
    'Set up a complete React application with routing, basic pages, and modern styling using Tailwind CSS.',
    'Create a React application using Vite with the following requirements:
- Use React Router for navigation
- Set up Tailwind CSS for styling
- Create a homepage, about page, and contact page
- Include a responsive navigation header
- Add a footer component
- Use modern React practices (hooks, functional components)
- Include basic error handling',
    'any',
    'beginner',
    ARRAY['react', 'vite', 'tailwind', 'routing'];

INSERT INTO prompts (category_id, title, description, prompt_text, ai_tool, difficulty, tags)
SELECT
    (SELECT id FROM prompt_categories WHERE name = 'Authentication'),
    'Complete User Authentication System',
    'Build a full authentication system with signup, login, email verification, and password reset using Supabase.',
    'Create a complete authentication system with the following:
- User signup with email and password
- Email verification flow
- Login with remember me option
- Password reset functionality
- Protected routes that require authentication
- User profile page
- Logout functionality
- Use Supabase for backend
- Add proper error handling and loading states
- Make it secure and production-ready',
    'bolt.ai',
    'intermediate',
    ARRAY['auth', 'supabase', 'security', 'email'];

INSERT INTO prompts (category_id, title, description, prompt_text, ai_tool, difficulty, tags)
SELECT
    (SELECT id FROM prompt_categories WHERE name = 'Backend'),
    'REST API with Node.js and Express',
    'Create a RESTful API with CRUD operations, authentication, and database integration.',
    'Build a REST API using Node.js and Express with:
- CRUD endpoints for a resource (e.g., products, users, posts)
- JWT-based authentication middleware
- Input validation
- Error handling
- Database integration (PostgreSQL or MongoDB)
- API documentation
- Rate limiting
- CORS configuration
- Environment variables for configuration
- Proper status codes and responses',
    'claude',
    'intermediate',
    ARRAY['nodejs', 'express', 'api', 'backend'];

-- Insert Sample Guidelines
INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('best-practices',
 'Why Designers Need Proper Requirements',
 'Designers work best when they receive clear, structured requirements from Project Managers. This means:

1. **Visual Hierarchy**: Show how pages connect, not just list them
2. **User Flows**: Explain what happens when users take actions
3. **Decision Logic**: Clarify "if this, then that" scenarios
4. **Edge Cases**: Document error states and alternative paths

When PMs provide unclear requirements:
- Designers make assumptions that may not match your vision
- Development takes longer due to clarifications
- More revision rounds are needed
- Final product may not meet user needs

When PMs provide clear requirements:
- Designers can focus on creating great experiences
- Development is faster and more accurate
- Fewer revisions needed
- Better end product for users',
 '[]'::jsonb,
 1);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('site-maps',
 'Creating Effective Site-Maps',
 'A site-map shows the structure and hierarchy of your application. It answers:
- What pages exist?
- How are they organized?
- How do users navigate between them?

**Best Practices:**

1. **Start with the Homepage**: This is your entry point
2. **Group Related Pages**: Show main sections and sub-sections
3. **Show Navigation Paths**: How do users move through the app?
4. **Label Clearly**: Use simple, descriptive page names
5. **Keep it Visual**: A diagram is better than a list

**Common Page Types:**
- Homepage (entry point)
- Main Pages (top-level navigation)
- Sub-Pages (nested content)
- External Links (to other sites)
- Utility Pages (login, settings, help)

**Example Structure:**
Homepage
├── About Us
├── Products
│   ├── Category A
│   ├── Category B
│   └── Product Detail
├── Cart
│   └── Checkout
└── Account
    ├── Profile
    ├── Orders
    └── Settings',
 '[{"title": "E-commerce Site-Map", "description": "Home → Products → Product Detail → Cart → Checkout"}]'::jsonb,
 1);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('user-journeys',
 'Mapping User Journeys',
 'User journeys show the path a user takes to complete a task. They include:
- Starting point (where the user begins)
- Actions (what the user does)
- Decisions (choices the user makes)
- Outcomes (success or error states)

**Why User Journeys Matter:**
- They reveal potential problems before design begins
- They ensure all scenarios are covered
- They help designers create intuitive flows
- They serve as documentation for developers

**Key Components:**

1. **Start Point**: Where does the journey begin?
   Example: "User lands on homepage"

2. **Actions**: What does the user do?
   Example: "User clicks Sign Up button"

3. **Decisions**: What choices appear?
   Example: "Is the email valid?" → Yes/No paths

4. **Success State**: What happens when all goes well?
   Example: "Account created, welcome email sent"

5. **Error States**: What if something goes wrong?
   Example: "Email already exists, show error message"

**Pro Tips:**
- Always document the happy path first
- Then add error scenarios
- Include edge cases (what if user clicks back?)
- Show decision points clearly
- Label all paths (Yes/No, If/Then)

**Example: Signup Journey**
1. User lands on signup page
2. User fills form
3. User clicks submit
4. → Is data valid?
   - No → Show error, let user correct
   - Yes → Create account
5. Send verification email
6. User verifies email
7. → Success: User logged in

This level of detail helps designers create the right UI for each step!',
 '[{"title": "Signup Flow", "description": "Complete user registration with validation and error handling"}]'::jsonb,
 1);

-- Success message
SELECT 'Database schema created successfully! 🎉' AS message;
