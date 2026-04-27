-- Clear and create SaaS-focused guidelines in correct order
DELETE FROM guidelines;

-- =====================================================
-- 1. GETTING STARTED (Best Practices)
-- =====================================================

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('best-practices',
 'What Designers Need: The 3 Essential Documents',
 '## The Simple Formula

Every project starts with **3 documents** from you (the PM):

### 1. **Project Brief** 📋
• What are we building?
• Why are we building it?
• Who will use it?

### 2. **Site-Map** 🗺️
• What pages/screens exist?
• How do they connect?

### 3. **User Journey** 🚶
• How do users complete tasks?
• Step-by-step flows

---

## SaaS Example: Project Management Tool

**Brief:**
"Build a project management tool where teams can create projects, assign tasks, and track progress."

**Site-Map:**
```
Dashboard
├── Projects (List, Create, Single Project View)
├── Tasks (All Tasks, My Tasks, Create Task)
├── Team (Members, Invite, Roles)
└── Settings (Profile, Notifications, Billing)
```

**User Journey (Create Project):**
1. User clicks "New Project" button
2. User enters project name
3. User selects team members
4. User clicks "Create"
5. System creates project
6. User redirected to project view

**That''s it!** With these 3 docs, designers can start.',
 '[
   {
     "title": "Quick Checklist",
     "description": "✅ Brief (what & why) → ✅ Site-map (structure) → ✅ User journey (flows) = Ready to design!"
   }
 ]'::jsonb,
 1);

-- =====================================================
-- 2. SITE-MAPS
-- =====================================================

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('site-maps',
 'Creating Your SaaS Site-Map',
 '## What is a Site-Map?

A **visual structure** of all pages in your SaaS product.

---

## How to Create One (3 Steps)

### Step 1: List Your Main Sections

For most SaaS products:
• Dashboard (home/overview)
• Main Feature Pages
• Settings/Profile
• Help/Support

### Step 2: Add Sub-Pages

Under each main section, what pages exist?

Example:
```
Dashboard
├── Projects
│   ├── All Projects
│   ├── Create New
│   └── Project Detail
├── Team
│   ├── Team Members
│   └── Invite Member
└── Settings
    ├── Account
    └── Billing
```

### Step 3: Show Connections

How do users navigate?
• Dashboard → Projects → Project Detail
• Team → Invite Member → Email Sent

---

## SaaS Examples

**CRM Tool:**
```
Dashboard
├── Contacts (List, Add, Contact Detail)
├── Deals (Pipeline, Add Deal, Deal Detail)
├── Activities (Calendar, Tasks, Notes)
└── Settings (Profile, Team, Integrations)
```

**Analytics Platform:**
```
Dashboard
├── Reports (All Reports, Create, Report View)
├── Data Sources (Connected, Add New)
├── Team (Users, Permissions)
└── Account (Profile, API Keys, Billing)
```',
 '[
   {
     "title": "Task Management SaaS",
     "description": "Dashboard → Projects (List, Create, Edit, Delete) → Tasks (All, My Tasks, Create) → Team (Members, Invite) → Settings (Profile, Notifications)"
   }
 ]'::jsonb,
 1);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('site-maps',
 'Site-Map Best Practices for SaaS',
 '## Common SaaS Patterns

### Pattern 1: Dashboard First
Every SaaS starts here:
```
Dashboard (main view)
└── Quick actions + overview
```

### Pattern 2: Resource Management
Most SaaS apps manage "things":
```
Resources (Projects, Clients, Reports, etc.)
├── List View (see all)
├── Create New
├── Single Item View (details)
└── Edit/Delete
```

### Pattern 3: Team/Settings
Usually at the top level:
```
├── Team (Members, Roles, Invite)
└── Settings (Account, Billing, Preferences)
```

---

## Tips for SaaS Products

✅ **Start with Dashboard** - Central hub
✅ **Group by feature** - Projects, Team, Reports
✅ **Include empty states** - "No projects yet"
✅ **Show user types** - Admin vs. User views
✅ **Mark permissions** - *(admin only)*

❌ **Don''t** create deep hierarchies (3 levels max)
❌ **Don''t** forget utility pages (login, 404, settings)
❌ **Don''t** mix navigation paradigms

---

## Quick Template

```
[Your SaaS Name]

Main App:
├── Dashboard (overview + quick actions)
├── [Main Feature 1]
│   ├── List View
│   ├── Create New
│   └── Detail View
├── [Main Feature 2]
├── Team
│   ├── Members
│   └── Invite
└── Settings
    ├── Profile
    ├── Billing
    └── Integrations
```',
 '[
   {
     "title": "Calendar SaaS",
     "description": "Dashboard → Calendar (Month/Week/Day views) → Events (Create, Edit, Delete) → Integrations (Google Calendar, Outlook) → Team (Share calendars) → Settings"
   }
 ]'::jsonb,
 2);

-- =====================================================
-- 3. USER JOURNEYS
-- =====================================================

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('user-journeys',
 'User Journeys for SaaS Products',
 '## What is a User Journey?

A **step-by-step flow** showing how users complete tasks in your SaaS.

---

## How to Write One

**Format:** Number each step

### Example: Creating a Project

1. User clicks "New Project" button
2. Modal/page opens with form
3. User enters project name
4. User selects team members (dropdown)
5. User sets due date (calendar picker)
6. User clicks "Create Project"
7. System validates input
8. → Valid? *(No: show errors)*
9. System saves project to database
10. User sees success message
11. User redirected to project detail page

---

## Key Components

Every journey needs:

### 📍 Start Point
Where does it begin?
• "User on dashboard"
• "User clicks button"

### 👆 User Actions
What do they do?
• "User enters text"
• "User selects option"

### 🔀 Decisions
What choices exist?
• "Is form valid?"
• "Has permission?"

### ✅ End State
What''s the result?
• "Project created"
• "Email sent"

---

## SaaS Example: Invite Team Member

1. User clicks "Invite Member"
2. Form appears
3. User enters email address
4. User selects role (dropdown: Admin/Member/Viewer)
5. User clicks "Send Invite"
6. → Email valid? *(No: show error)*
7. → User already exists? *(Yes: show "Already on team")*
8. System sends invitation email
9. Success message: "Invitation sent to [email]"
10. User sees pending invite in team list',
 '[
   {
     "title": "Create Report Journey",
     "description": "Dashboard → Click \"New Report\" → Select data source → Choose metrics → Set date range → Preview → Click \"Save\" → Enter report name → Click \"Create\" → Success: \"Report created!\""
   }
 ]'::jsonb,
 1);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('user-journeys',
 'Handling Different Scenarios',
 '## The Happy Path First

Start with when **everything works**:
• No errors
• User has permissions
• All data available

---

## Then Add Edge Cases

### Error Scenarios

**Example: Create Task**
```
Step 5: User clicks "Create Task"
→ IF title is empty
  THEN show error: "Task title required"
  THEN keep form open
→ IF title is valid
  THEN create task
  THEN show success
```

### Permission Checks

**Example: Delete Project**
```
Step 3: User clicks "Delete"
→ IF user is not admin
  THEN show: "Only admins can delete projects"
  THEN hide delete button
→ IF user is admin
  THEN show confirmation dialog
```

### Empty States

**Example: View Projects**
```
Dashboard → Projects
→ IF user has projects
  THEN show project list
→ IF no projects yet
  THEN show "No projects yet"
  THEN show "Create your first project" button
```

---

## Common SaaS Journeys

### 1. Onboarding New User
1. User signs up
2. Email verification
3. Complete profile
4. Take product tour
5. Create first [item]

### 2. Upgrading Plan
1. User clicks "Upgrade"
2. View plans comparison
3. Select plan
4. Enter payment
5. Confirm
6. Plan upgraded

### 3. Inviting Team
1. Click "Invite"
2. Enter emails
3. Set permissions
4. Send invites
5. Track pending

### 4. Exporting Data
1. Select items
2. Choose format
3. Click export
4. Processing...
5. Download ready',
 '[
   {
     "title": "Adding Integration",
     "description": "Settings → Integrations → Find \"Slack\" → Click \"Connect\" → Authorize in Slack → Redirect back → Success: \"Slack connected\" → See connected status"
   }
 ]'::jsonb,
 2);

-- =====================================================
-- 4. DECISION TREES
-- =====================================================

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('decision-trees',
 'Decision Logic for SaaS',
 '## What Are Decision Trees?

Shows **different outcomes** based on **conditions**.

**Format:** IF-THEN statements

---

## Common SaaS Decisions

### 1. User Authentication

```
IF user is logged in
  THEN show dashboard
ELSE
  THEN redirect to login page
```

### 2. Feature Access (Plans)

```
IF user has Free plan
  THEN show limited features
  THEN show "Upgrade" prompts
ELSE IF user has Pro plan
  THEN show all features
```

### 3. Permissions (Roles)

```
IF user is Admin
  THEN show all controls
  THEN can delete anything
ELSE IF user is Member
  THEN show limited controls
  THEN can only edit own items
ELSE IF user is Viewer
  THEN read-only access
```

### 4. Data States

```
IF loading data
  THEN show spinner
ELSE IF data exists
  THEN show data table
ELSE IF no data
  THEN show "No items yet" + create button
ELSE IF error
  THEN show error message + retry
```

---

## SaaS Example: Project Access

```
User tries to view Project #123:

IF user is not logged in
  THEN redirect to login

ELSE IF user is logged in
  → IF user is project owner
    THEN show full project details
    THEN show edit/delete buttons

  → ELSE IF user is team member
    THEN show project details
    THEN hide delete button

  → ELSE IF user is not on team
    THEN show "Access denied"
    THEN show "Request access" button
```',
 '[
   {
     "title": "Dashboard View",
     "description": "IF user has projects → Show project cards | ELSE → Show \"Create your first project\" with tutorial"
   }
 ]'::jsonb,
 1);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('decision-trees',
 'Common SaaS Patterns',
 '## Pattern 1: Freemium Features

```
User clicks Premium Feature:

IF user has Free account
  THEN show feature with lock icon
  THEN show upgrade modal
  THEN display pricing

ELSE IF user has Premium account
  THEN allow full access
```

---

## Pattern 2: Team Roles

```
IF user is Owner
  THEN can manage billing
  THEN can delete workspace
  THEN can manage all users

ELSE IF user is Admin
  THEN can invite users
  THEN can edit settings
  THEN cannot manage billing

ELSE IF user is Member
  THEN can view/edit content
  THEN cannot manage team
```

---

## Pattern 3: Quota Limits

```
User tries to create new Project:

IF projects_count < plan_limit
  THEN create project
  THEN show success

ELSE IF projects_count >= plan_limit
  THEN show: "Limit reached"
  THEN show: "Upgrade to create more"
  THEN show upgrade button
```

---

## Pattern 4: Multi-Step Forms

```
Step 1: Basic Info
→ IF fields complete
  THEN enable "Next" button
  THEN save draft

Step 2: Advanced Options
→ IF optional
  THEN allow skip

Step 3: Review
→ IF user clicks "Edit"
  THEN go back to relevant step
```

---

## Pattern 5: Collaborative Features

```
User edits document:

IF another user is editing
  THEN show: "John is editing"
  THEN enable read-only mode
  THEN show changes in real-time

ELSE IF no one else editing
  THEN allow full editing
```',
 '[
   {
     "title": "Invitation Status",
     "description": "View Team Members → IF invited (pending): Show \"Resend\" button | IF active: Show role + \"Remove\" | IF removed: Show \"Reinvite\""
   }
 ]'::jsonb,
 2);

-- Success message
SELECT '✅ SaaS-focused guidelines created with proper order!' AS message;
