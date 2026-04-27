-- Complete replacement with ONLY SaaS examples
DELETE FROM guidelines;

-- =====================================================
-- 1. GETTING STARTED
-- =====================================================

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('best-practices',
 'What Designers Need From You',
 '## The 3 Essential Documents

Every SaaS project needs:

### 1. Project Brief
• **What** are we building?
• **Why** are we building it?
• **Who** will use it?

### 2. Site-Map
• What pages/screens exist?
• How are they connected?

### 3. User Journey
• How do users complete tasks?
• Step-by-step flows

---

## SaaS Example: Task Management Tool

**Brief:**
"Build a task management tool where teams can create boards, add tasks, assign members, and track progress in real-time."

**Site-Map:**
```
Dashboard
├── Boards (All Boards, Create Board, Board View)
├── Tasks (My Tasks, All Tasks, Create Task)
├── Team (Members, Invite, Permissions)
└── Settings (Profile, Notifications, Integrations)
```

**User Journey (Create Task):**
1. User clicks "New Task"
2. User enters task title
3. User assigns to team member
4. User sets due date
5. User clicks "Create"
6. Task appears in board
7. Assignee gets notification',
 '[
   {
     "title": "CRM System",
     "description": "Dashboard → Contacts (List, Add, Detail) → Deals (Pipeline, Create) → Activities (Tasks, Calendar) → Reports → Settings"
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

A **visual structure** showing all pages in your SaaS application.

---

## How to Build It

### Step 1: Main Dashboard
Start with the main view users see after login:
```
Dashboard (home screen)
```

### Step 2: Add Main Features
What are the core features?
```
Dashboard
├── Projects
├── Tasks
├── Team
└── Reports
```

### Step 3: Add Sub-Pages
What pages exist under each feature?
```
Dashboard
├── Projects
│   ├── All Projects
│   ├── Create New
│   └── Project Detail (single project view)
├── Tasks
│   ├── My Tasks
│   ├── All Tasks
│   └── Create Task
└── Team
    ├── Team Members
    └── Invite Member
```

---

## Real SaaS Examples

**Analytics Dashboard:**
```
Dashboard (overview + charts)
├── Reports (All Reports, Create, Report View)
├── Data Sources (Connected, Add New, Configure)
├── Widgets (Library, Create Custom)
├── Team (Users, Roles, Invitations)
└── Settings (Account, API Keys, Billing, Integrations)
```

**Customer Support Tool:**
```
Dashboard (tickets overview)
├── Tickets (All, Assigned to Me, Create, Ticket Detail)
├── Customers (List, Customer Profile, Add New)
├── Knowledge Base (Articles, Create, Edit)
├── Team (Agents, Departments, Permissions)
└── Settings (Profile, Notifications, Automations)
```',
 '[
   {
     "title": "Video Conferencing SaaS",
     "description": "Dashboard → Meetings (Upcoming, Past, Schedule New) → Recordings (All, Watch, Share) → Rooms (Personal Room, Settings) → Contacts → Settings (Profile, Audio/Video)"
   }
 ]'::jsonb,
 1);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('site-maps',
 'SaaS Site-Map Patterns',
 '## Common SaaS Structures

### Pattern 1: Resource Management
```
Dashboard
├── [Resources] (Projects, Contacts, Documents, etc.)
│   ├── List View (all items)
│   ├── Create New
│   ├── Single Item View (detail page)
│   └── Edit/Delete
```

### Pattern 2: Collaboration Tools
```
Dashboard
├── Workspace/Board
├── Items/Tasks
├── Team Members
├── Chat/Comments
└── Activity Feed
```

### Pattern 3: Analytics/Reporting
```
Dashboard (metrics overview)
├── Reports/Analytics
├── Data Management
├── Export/Share
└── Settings
```

---

## Tips

✅ **Start simple** - Dashboard + 3-5 main sections
✅ **Group by function** - Keep related pages together
✅ **Max 3 levels deep** - Don''t over-nest
✅ **Include utilities** - Settings, Help, Profile

❌ **Don''t** create flat lists without hierarchy
❌ **Don''t** forget empty states
❌ **Don''t** mix admin and user views',
 '[
   {
     "title": "Email Marketing SaaS",
     "description": "Dashboard → Campaigns (All, Create, Analytics) → Subscribers (Lists, Import, Segments) → Templates (Library, Create) → Automations → Reports → Settings"
   }
 ]'::jsonb,
 2);

-- =====================================================
-- 3. USER JOURNEYS
-- =====================================================

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('user-journeys',
 'User Journeys for SaaS',
 '## What is a User Journey?

A **step-by-step flow** showing how users complete specific tasks.

---

## Format: Numbered Steps

### Example: Inviting a Team Member

1. User clicks "Invite Team Member" button
2. Modal opens with form
3. User enters email address
4. User selects role from dropdown (Admin/Member/Viewer)
5. User clicks "Send Invitation"
6. System validates email format
7. → Valid? *(No: show error)*
8. System checks if user already exists
9. → Already member? *(Yes: show "Already on team")*
10. System sends invitation email
11. Success message: "Invitation sent!"
12. User sees pending invite in team list

---

## Components

### Start Point
"User on Dashboard"
"User viewing Project #123"

### Actions
"User clicks button"
"User enters text"
"User selects option"

### Decisions
"Is form valid?"
"Does user have permission?"

### End State
"Success: Item created"
"Error: Try again"

---

## SaaS Example: Creating a Report

**Dashboard → Reports → Create New**

1. User clicks "Create Report" button
2. Page opens with report builder
3. User enters report name
4. User selects data source (dropdown with connected sources)
5. User chooses metrics (checkboxes: Revenue, Users, Conversions)
6. User sets date range (calendar picker: Last 30 days)
7. User clicks "Preview"
8. System generates preview
9. → Data available? *(No: show "No data for this period")*
10. User reviews preview
11. User clicks "Save Report"
12. Report saved to Reports list
13. Success: "Report created successfully!"',
 '[
   {
     "title": "Schedule Meeting",
     "description": "Calendar → Click time slot → Enter title → Add participants (search + select) → Set duration → Add video link → Click \"Create\" → Meeting created → Invites sent"
   }
 ]'::jsonb,
 1);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('user-journeys',
 'Handling Scenarios',
 '## Happy Path First

Start with the ideal flow:
• No errors
• User has permissions
• Everything works

---

## Then Add Edge Cases

### Error Handling

**Example: Create Project**
```
Step 5: User clicks "Create Project"
→ IF project name is empty
  THEN show error: "Project name required"
  THEN keep form open
→ IF name is valid
  THEN create project
  THEN redirect to project page
```

### Permission Checks

**Example: Edit Settings**
```
User opens Settings
→ IF user is Admin
  THEN show all settings
  THEN enable editing
→ IF user is Member
  THEN show limited settings
  THEN some fields read-only
```

### Empty States

**Example: View Analytics**
```
User opens Analytics Dashboard
→ IF data exists
  THEN show charts and metrics
→ IF no data yet
  THEN show "No data collected yet"
  THEN show "Connect your first data source" button
```

---

## Common SaaS Journeys

### Onboarding
1. Sign up
2. Verify email
3. Complete profile
4. Take tour
5. Create first workspace/project

### Upgrade Plan
1. Click "Upgrade"
2. View plan comparison
3. Select plan
4. Enter payment details
5. Confirm upgrade
6. Access unlocked features

### Export Data
1. Select items to export
2. Choose format (CSV/PDF/Excel)
3. Click "Export"
4. Processing...
5. Download ready',
 '[
   {
     "title": "Connect Integration",
     "description": "Settings → Integrations → Find \"Slack\" → Click \"Connect\" → Authorize in Slack → Redirect back → Success notification → Integration active"
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

Format: **IF-THEN**

---

## Common SaaS Decisions

### Authentication
```
IF user is logged in
  THEN show dashboard
ELSE
  THEN redirect to login
```

### Feature Access (Plans)
```
IF user has Free plan
  THEN show basic features
  THEN show upgrade prompts
ELSE IF user has Pro plan
  THEN show all features
```

### Permissions (Roles)
```
IF user is Admin
  THEN full access
  THEN can delete anything
ELSE IF user is Member
  THEN limited access
  THEN can edit own items only
ELSE IF user is Viewer
  THEN read-only
```

### Data States
```
IF loading
  THEN show spinner
ELSE IF has data
  THEN show content
ELSE IF empty
  THEN show "No items yet" + create button
ELSE IF error
  THEN show error + retry button
```

---

## SaaS Example: View Project

**User clicks on Project #123**

```
IF user not logged in
  THEN redirect to login page

ELSE IF user logged in
  → IF user is project owner
    THEN show full project
    THEN show edit/delete buttons

  → ELSE IF user is team member
    THEN show project details
    THEN hide delete button

  → ELSE IF user not on team
    THEN show "Access Denied"
    THEN show "Request Access" button
```',
 '[
   {
     "title": "Dashboard View",
     "description": "IF user has workspaces → Show workspace list | ELSE → Show \"Create your first workspace\" with tutorial"
   }
 ]'::jsonb,
 1);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('decision-trees',
 'SaaS Decision Patterns',
 '## Pattern 1: Freemium

```
User clicks Premium Feature:

IF Free account
  THEN show feature with lock icon
  THEN show "Upgrade to Pro" modal
  THEN display pricing table

ELSE IF Pro account
  THEN allow full access
```

---

## Pattern 2: Team Roles

```
IF Owner
  THEN manage billing
  THEN delete workspace
  THEN manage all users

ELSE IF Admin
  THEN invite users
  THEN edit settings
  THEN cannot manage billing

ELSE IF Member
  THEN view/edit content
  THEN cannot manage team
```

---

## Pattern 3: Usage Limits

```
User creates new item:

IF count < plan_limit
  THEN create item
  THEN show success

ELSE IF count >= limit
  THEN block creation
  THEN show "Limit reached"
  THEN show upgrade option
```

---

## Pattern 4: Collaboration

```
User edits document:

IF another user is editing
  THEN read-only mode
  THEN show "John is editing"
  THEN show live changes

ELSE IF no one editing
  THEN allow editing
```

---

## Pattern 5: Integration Status

```
View Integration:

IF not connected
  THEN show "Connect" button
  THEN hide integration settings

ELSE IF connected
  THEN show "Connected" status
  THEN show "Disconnect" button
  THEN show integration settings

ELSE IF connection error
  THEN show "Reconnect" button
  THEN show error message
```',
 '[
   {
     "title": "Team Member Status",
     "description": "View Team → IF invited (pending): Show \"Resend\" | IF active: Show role + \"Remove\" option | IF removed: Show \"Reinvite\""
   }
 ]'::jsonb,
 2);

-- Success
SELECT '✅ Pure SaaS guidelines - NO e-commerce!' AS message;
