-- Clean content - NO emojis, just text
DELETE FROM guidelines;

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('best-practices',
 'What Designers Need From You',
 '## The 3 Essential Documents

Every SaaS project needs:

### 1. Project Brief
• What are we building?
• Why are we building it?
• Who will use it?

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
 '[{"title": "CRM System", "description": "Dashboard → Contacts (List, Add, Detail) → Deals (Pipeline, Create) → Activities (Tasks, Calendar) → Reports → Settings"}]'::jsonb,
 1);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('site-maps',
 'Creating Your SaaS Site-Map',
 '## What is a Site-Map?

A visual structure showing all pages in your SaaS application.

---

## How to Build It

### Step 1: Main Dashboard
Start with the main view users see after login

### Step 2: Add Main Features
```
Dashboard
├── Projects
├── Tasks
├── Team
└── Reports
```

### Step 3: Add Sub-Pages
```
Dashboard
├── Projects
│   ├── All Projects
│   ├── Create New
│   └── Project Detail
├── Tasks
│   ├── My Tasks
│   └── Create Task
└── Team
    ├── Members
    └── Invite
```

---

## Real SaaS Examples

**Analytics Dashboard:**
```
Dashboard (overview + charts)
├── Reports (All Reports, Create, Report View)
├── Data Sources (Connected, Add New, Configure)
├── Team (Users, Roles, Invitations)
└── Settings (Account, API Keys, Billing)
```',
 '[{"title": "Video Conferencing SaaS", "description": "Dashboard → Meetings (Upcoming, Past, Schedule New) → Recordings (All, Watch, Share) → Rooms (Personal Room, Settings) → Contacts → Settings"}]'::jsonb,
 1);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('site-maps',
 'SaaS Site-Map Patterns',
 '## Common SaaS Structures

### Pattern 1: Resource Management
```
Dashboard
├── Resources (Projects, Contacts, Documents)
│   ├── List View
│   ├── Create New
│   ├── Single Item View
│   └── Edit/Delete
```

### Pattern 2: Collaboration Tools
```
Dashboard
├── Workspace/Board
├── Items/Tasks
├── Team Members
└── Activity Feed
```

---

## Tips

**Do:**
• Start simple - Dashboard + 3-5 main sections
• Group by function
• Max 3 levels deep

**Don''t:**
• Create flat lists without hierarchy
• Forget empty states
• Mix admin and user views',
 '[{"title": "Email Marketing SaaS", "description": "Dashboard → Campaigns (All, Create, Analytics) → Subscribers (Lists, Import, Segments) → Templates (Library, Create) → Automations → Reports"}]'::jsonb,
 2);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('user-journeys',
 'User Journeys for SaaS',
 '## What is a User Journey?

A step-by-step flow showing how users complete specific tasks.

---

## Format: Numbered Steps

### Example: Inviting a Team Member

1. User clicks "Invite Team Member" button
2. Modal opens with form
3. User enters email address
4. User selects role from dropdown
5. User clicks "Send Invitation"
6. System validates email format
7. Valid? (No: show error)
8. System checks if user already exists
9. Already member? (Yes: show "Already on team")
10. System sends invitation email
11. Success message: "Invitation sent!"
12. User sees pending invite in team list

---

## Components

**Start Point**
"User on Dashboard"
"User viewing Project"

**Actions**
"User clicks button"
"User enters text"

**Decisions**
"Is form valid?"
"Does user have permission?"

**End State**
"Success: Item created"
"Error: Try again"',
 '[{"title": "Schedule Meeting", "description": "Calendar → Click time slot → Enter title → Add participants → Set duration → Add video link → Click Create → Meeting created → Invites sent"}]'::jsonb,
 1);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('user-journeys',
 'Handling Scenarios',
 '## Happy Path First

Start with the ideal flow where everything works.

---

## Then Add Edge Cases

### Error Handling

**Example: Create Project**
```
Step 5: User clicks "Create Project"
→ IF project name is empty
  THEN show error: "Project name required"
→ IF name is valid
  THEN create project
  THEN redirect to project page
```

### Permission Checks

**Example: Edit Settings**
```
→ IF user is Admin
  THEN show all settings
→ IF user is Member
  THEN show limited settings
```

### Empty States

**Example: View Analytics**
```
→ IF data exists
  THEN show charts
→ IF no data yet
  THEN show "No data collected yet"
  THEN show "Connect data source" button
```',
 '[{"title": "Connect Integration", "description": "Settings → Integrations → Find Slack → Click Connect → Authorize → Redirect back → Success notification → Integration active"}]'::jsonb,
 2);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('decision-trees',
 'Decision Logic for SaaS',
 '## What Are Decision Trees?

Shows different outcomes based on conditions.

Format: IF-THEN

---

## Common SaaS Decisions

### Authentication
```
IF user is logged in
  THEN show dashboard
ELSE
  THEN redirect to login
```

### Feature Access
```
IF user has Free plan
  THEN show basic features
ELSE IF user has Pro plan
  THEN show all features
```

### Permissions
```
IF user is Admin
  THEN full access
ELSE IF user is Member
  THEN limited access
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
```',
 '[{"title": "Dashboard View", "description": "IF user has workspaces → Show workspace list | ELSE → Show Create your first workspace with tutorial"}]'::jsonb,
 1);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('decision-trees',
 'SaaS Decision Patterns',
 '## Pattern 1: Freemium

```
User clicks Premium Feature:

IF Free account
  THEN show feature with lock
  THEN show Upgrade to Pro modal

ELSE IF Pro account
  THEN allow full access
```

---

## Pattern 2: Team Roles

```
IF Owner
  THEN manage billing
  THEN delete workspace

ELSE IF Admin
  THEN invite users
  THEN edit settings

ELSE IF Member
  THEN view/edit content
```

---

## Pattern 3: Usage Limits

```
User creates new item:

IF count < plan_limit
  THEN create item

ELSE IF count >= limit
  THEN show "Limit reached"
  THEN show upgrade option
```

---

## Pattern 4: Collaboration

```
User edits document:

IF another user is editing
  THEN read-only mode
  THEN show "User is editing"

ELSE IF no one editing
  THEN allow editing
```',
 '[{"title": "Team Member Status", "description": "View Team → IF invited: Show Resend | IF active: Show role + Remove option | IF removed: Show Reinvite"}]'::jsonb,
 2);

SELECT 'Clean content - NO emojis!' AS message;
