-- Clear existing guidelines
DELETE FROM guidelines;

-- =====================================================
-- SECTION 1: SITE-MAPS
-- =====================================================

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('site-maps',
 'Understanding Site-Maps: The Foundation of Your Product',
 'A site-map is the architectural blueprint of your application. It''s the FIRST thing designers need before starting any work. Think of it as the floor plan of a house – without it, you can''t design the interior.

**What is a Site-Map?**
A visual diagram showing:
• All pages/screens in your application
• How they''re organized hierarchically
• How they connect to each other
• Navigation relationships between pages

**Why Designers Need This FIRST:**
1. **Understand Scope**: See the full picture before diving into details
2. **Plan Navigation**: Design menus, breadcrumbs, and linking strategies
3. **Ensure Consistency**: Keep similar pages visually aligned
4. **Estimate Effort**: Know how many screens to design
5. **Identify Patterns**: Spot reusable components early

**The PM''s Role:**
As a PM, you should provide the site-map BEFORE asking for designs. This is NOT the designer''s job – you know the business requirements, features, and priorities. The designer''s job is to make it beautiful and usable.',
 '[
   {
     "title": "E-commerce Site-Map Example",
     "description": "Homepage → Shop (Categories, Products, Product Detail) → Cart → Checkout (Shipping, Payment, Confirmation) → Account (Profile, Orders, Wishlist, Settings)"
   },
   {
     "title": "SaaS Dashboard Example",
     "description": "Login → Dashboard → Projects (List, Create, Edit, Delete) → Team (Members, Roles, Invites) → Settings (Profile, Billing, Integrations) → Help (Docs, Support)"
   }
 ]'::jsonb,
 1);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('site-maps',
 'Site-Map Best Practices: How to Structure Information',
 '**Start with These Questions:**
1. What is the main goal of the application?
2. What are the primary user tasks?
3. What pages are absolutely necessary?
4. How will users navigate between them?

**Structuring Your Site-Map:**

**1. Homepage (The Entry Point)**
This is where everyone starts. From here, users should be able to:
• Understand what your product does
• Access main features quickly
• Navigate to any primary section

**2. Main Sections (Top-Level Navigation)**
These appear in your main menu/navigation bar:
• Keep it to 5-7 items maximum
• Use clear, simple labels (avoid jargon)
• Group related functionality together

**3. Sub-Pages (Nested Content)**
Pages within main sections:
• Show hierarchy clearly (Parent → Child)
• Don''t go more than 3-4 levels deep
• Use consistent naming conventions

**4. Utility Pages (Supporting Pages)**
Often not in main navigation:
• Login/Signup
• Settings/Preferences
• Help/Support
• Terms/Privacy
• 404/Error pages

**Common Mistakes to Avoid:**
❌ Creating a flat list of pages (no hierarchy)
❌ Using vague labels like "Content" or "Data"
❌ Forgetting error states and empty states
❌ Omitting utility pages
❌ Not showing how pages connect',
 '[
   {
     "title": "Bad Site-Map",
     "description": "Home, About, Products, Services, Contact, Blog, Login, Settings, Profile, Cart, Checkout, Orders... (just a flat list with no structure or relationships)"
   },
   {
     "title": "Good Site-Map",
     "description": "Home → About → Products (Category 1, Category 2, Product Detail) → Services (Service A, Service B, Booking) → Account (Profile, Orders, Settings) → Support (Help, Contact)"
   }
 ]'::jsonb,
 2);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('site-maps',
 'How to Communicate Your Site-Map to Designers',
 '**Format Options (Choose One):**

**1. Visual Diagram (BEST)**
Use tools like:
• Figma/Sketch/Adobe XD
• Miro/Mural/FigJam
• Lucidchart/Draw.io
• Even PowerPoint/Google Slides!

Show boxes connected with lines/arrows.

**2. Indented Outline (GOOD)**
If you can''t create a diagram:
```
Home
├── Shop
│   ├── All Products
│   ├── Category: Electronics
│   │   └── Product Detail
│   └── Category: Clothing
│       └── Product Detail
├── Cart
├── Checkout
│   ├── Shipping Info
│   ├── Payment
│   └── Confirmation
└── Account
    ├── Profile
    ├── Order History
    └── Settings
```

**3. Numbered List (ACCEPTABLE)**
Least preferred but better than nothing:
1. Homepage
  1.1 Shop
    1.1.1 All Products
    1.1.2 Product Detail
  1.2 Cart
  1.3 Checkout
2. Account
  2.1 Profile
  2.2 Orders

**What to Include:**
✅ Page names (clear labels)
✅ Hierarchy (parent-child relationships)
✅ Navigation paths (how users move between pages)
✅ Special states (empty, error, loading)
✅ User types if different (admin vs. user views)

**Pro Tip:** Annotate your site-map!
Add notes like:
• "This page requires login"
• "Admins only"
• "External link to documentation"
• "Generated dynamically based on data"',
 '[
   {
     "title": "Annotated Site-Map",
     "description": "Homepage → Dashboard (login required) → Projects (List, Create, Edit [author only], Delete [admin only]) → Settings (Profile, Team [admin only])"
   }
 ]'::jsonb,
 3);

-- =====================================================
-- SECTION 2: USER JOURNEYS
-- =====================================================

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('user-journeys',
 'User Journeys: Mapping the User''s Path to Success',
 'A User Journey is a step-by-step map of how a user accomplishes a specific goal in your application. While site-maps show WHAT pages exist, user journeys show HOW users move through them to complete tasks.

**What is a User Journey?**
A linear or branching path that includes:
• Starting point (where user begins)
• Actions taken (clicks, inputs, selections)
• Decision points (if/then branching)
• System responses (what happens next)
• End state (success or failure)

**Why Designers Need User Journeys:**
1. **Understand Context**: See the full task flow, not isolated screens
2. **Design Transitions**: Know what comes before/after each screen
3. **Handle Edge Cases**: Plan for errors, back buttons, interruptions
4. **Create Intuitive UX**: Guide users naturally through the process
5. **Validate Completeness**: Ensure nothing is missing

**The Difference:**
• **Site-Map**: "Our app has a checkout page"
• **User Journey**: "User adds item to cart → views cart → enters shipping → enters payment → sees confirmation"

**When to Create User Journeys:**
• For any multi-step process (checkout, onboarding, booking)
• For complex features (search, filters, comparisons)
• For decision-heavy flows (choose plan, configure product)
• When there are multiple paths to the same goal',
 '[
   {
     "title": "Simple Login Journey",
     "description": "User clicks Login → Enters email & password → Clicks Submit → System validates → Success: Dashboard OR Error: Try again"
   },
   {
     "title": "Complex Checkout Journey",
     "description": "View Cart → Apply Promo Code? → Enter Shipping → Choose Shipping Method → Enter Payment → Review Order → Submit → Processing → Success: Confirmation OR Error: Payment Failed (retry)"
   }
 ]'::jsonb,
 1);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('user-journeys',
 'Creating Effective User Journeys: The Step-by-Step Guide',
 '**Step 1: Define the Goal**
What is the user trying to accomplish?
• "User wants to purchase a product"
• "User wants to create an account"
• "User wants to reset their password"

**Step 2: Map the Happy Path (Success Scenario)**
Document the ideal flow when everything works:
1. User starts here
2. User does this
3. System responds like this
4. User continues...
5. Goal achieved!

**Step 3: Add Decision Points**
Where do users make choices?
• "Does user have an account? → Yes/No"
• "Is payment successful? → Yes/No"
• "Does user want to save info? → Yes/No"

**Step 4: Document Alternative Paths**
What if the user takes a different route?
• "User clicks Back button"
• "User chooses Guest checkout instead of Login"
• "User abandons cart"

**Step 5: Add Error Scenarios**
What can go wrong?
• "Email already exists"
• "Credit card declined"
• "Server timeout"
• "Required field empty"

**Step 6: Define System Responses**
For each action, what happens?
• Show success message
• Display error alert
• Navigate to next page
• Save data to database
• Send email confirmation

**Key Components to Include:**
📍 **Entry Point**: Where does this journey start?
👆 **User Actions**: What does the user do?
🤖 **System Actions**: What does the app do in response?
🔀 **Decision Points**: Where do paths branch?
✅ **Success State**: What does success look like?
❌ **Error States**: What if something fails?
⏮️ **Back/Cancel**: What if user wants to exit?',
 '[
   {
     "title": "Password Reset Journey (Complete)",
     "description": "1. User clicks Forgot Password → 2. Enters email → 3. Clicks Submit → 4. Is email valid? (No: show error | Yes: continue) → 5. Is email in database? (No: show generic message for security | Yes: send email) → 6. User receives email → 7. Clicks reset link → 8. Link valid & not expired? (No: show error + resend option | Yes: show form) → 9. User enters new password → 10. Password meets requirements? (No: show requirements | Yes: save) → 11. Success: Password updated, redirect to login"
   }
 ]'::jsonb,
 2);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('user-journeys',
 'User Journey Documentation Formats',
 '**Format 1: Written Steps (Easiest for PMs)**
Number each step sequentially:

**Example: Book Appointment**
1. User selects service type
2. User chooses date from calendar
3. User selects available time slot
4. → Is user logged in?
   a. YES: Pre-fill user info (skip to step 6)
   b. NO: Continue to step 5
5. User enters contact info (name, email, phone)
6. User reviews booking details
7. User clicks Confirm
8. → Payment required?
   a. YES: User enters payment info
   b. NO: Skip to step 10
9. System processes payment
   → Success? (Yes: continue | No: show error, return to step 8)
10. System saves booking
11. System sends confirmation email
12. Show success message with booking details

**Format 2: Flowchart Diagram (Best for Complex Flows)**
Create a visual diagram with:
• Rectangles for actions/steps
• Diamonds for decision points
• Arrows showing flow direction
• Different colors for different states

**Format 3: Table Format (Good for Comparison)**
| Step | User Action | System Response | Next Step |
|------|-------------|-----------------|-----------|
| 1 | Clicks Add to Cart | Adds item, updates cart count | Go to step 2 |
| 2 | Views cart | Shows all items + total | User decides next |

**Pro Tips:**
✅ Use clear, simple language
✅ Be specific ("Click Save button" not "Save")
✅ Include timing if relevant ("Wait 2 seconds for animation")
✅ Note any loading/processing states
✅ Specify error messages to display
✅ Show what data is saved/sent

❌ Don''t skip obvious steps (designers need EVERYTHING)
❌ Don''t assume designers know business logic
❌ Don''t mix multiple journeys in one document',
 '[
   {
     "title": "Two-Factor Authentication Journey",
     "description": "Login → Enter email/password → Submit → Credentials valid? (No: error | Yes: send code) → User receives SMS/email with 6-digit code → Enter code → Submit → Code valid & not expired? (No: error + resend option | Yes: create session) → Redirect to dashboard"
   }
 ]'::jsonb,
 3);

-- =====================================================
-- SECTION 3: DECISION TREES
-- =====================================================

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('decision-trees',
 'Decision Trees: Documenting Conditional Logic',
 'Decision Trees show branching paths based on conditions. They answer "What happens IF the user does X?" - critical for designers to understand all possible scenarios.

**What is a Decision Tree?**
A branching diagram that shows:
• Conditions/Questions ("Is user logged in?")
• Possible answers (Yes/No, Option A/B/C)
• Different outcomes for each answer
• Nested decisions (decisions within decisions)

**Why Designers Need Decision Trees:**
1. **Design All States**: Account for every possibility
2. **Show Right Content**: Display appropriate options per scenario
3. **Handle Edge Cases**: Know what to do when things are unusual
4. **Create Intuitive UX**: Guide users down the right path
5. **Avoid Dead Ends**: Ensure every path leads somewhere

**Common Decision Points:**
• User authentication (logged in vs. guest)
• User permissions (admin vs. regular user)
• Data availability (has data vs. empty state)
• Form validation (valid vs. invalid input)
• Feature access (free vs. premium user)
• Business rules (eligible vs. ineligible)

**When to Use Decision Trees:**
✅ Complex conditional logic
✅ Multiple user types/roles
✅ Feature toggles or A/B tests
✅ Eligibility requirements
✅ Multi-step forms with dependencies
✅ Pricing tiers with different features',
 '[
   {
     "title": "Simple Checkout Decision",
     "description": "Is user logged in? → YES: Show saved addresses → NO: Show guest checkout option OR login prompt"
   },
   {
     "title": "Complex Feature Access",
     "description": "Can user access this feature? → Check subscription tier: (Free: Show upgrade prompt | Pro: Allow access | Enterprise: Allow access + admin features) → Check permissions: (Read-only: View only | Editor: View + edit | Admin: Full access)"
   }
 ]'::jsonb,
 1);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('decision-trees',
 'How to Document Decision Logic for Designers',
 '**The IF-THEN Format (Simple & Clear)**

Structure your decisions like this:

**IF** [condition]
**THEN** [outcome A]
**ELSE** [outcome B]

**Example: Discount Eligibility**
```
IF user is first-time customer
  THEN show 20% discount code
ELSE IF user has placed order in last 30 days
  THEN show 10% discount code
ELSE
  THEN no discount, show regular price
```

**Nested Decisions:**
```
IF user clicks Delete button
  THEN show confirmation dialog
    IF user clicks Confirm
      THEN delete item permanently
      THEN show success message
      THEN remove from list
    ELSE IF user clicks Cancel
      THEN close dialog
      THEN return to previous view
```

**Multiple Conditions (AND/OR Logic):**
```
IF user is logged in AND user is premium member
  THEN show advanced features
ELSE IF user is logged in AND user is free member
  THEN show basic features with upgrade prompts
ELSE
  THEN show login prompt
```

**Decision Table Format (For Many Options):**

| User Type | Has Data | Show What |
|-----------|----------|-----------|
| Guest | N/A | Login prompt + preview |
| Free User | Yes | Basic dashboard |
| Free User | No | Empty state + tutorial |
| Pro User | Yes | Full dashboard + analytics |
| Pro User | No | Empty state + import option |
| Admin | Any | Admin dashboard + all features |

**Key Questions to Answer:**
1. What triggers this decision? (User action? System event?)
2. What are ALL possible conditions?
3. What happens for EACH condition?
4. Are there dependencies? (One condition requires another?)
5. What''s the default/fallback case?
6. Can conditions change during the session?',
 '[
   {
     "title": "Shopping Cart Logic",
     "description": "IF cart is empty → Show empty state with Browse button | ELSE IF cart has items → Is user logged in? (Yes: Show checkout button | No: Show \"Login to checkout\" or \"Guest checkout\") → Is shipping required? (Yes: Collect address | No: Skip to payment)"
   }
 ]'::jsonb,
 2);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('decision-trees',
 'Common Decision Tree Patterns in Product Design',
 '**Pattern 1: Authentication Gates**
```
IF user is logged in
  THEN show user content
ELSE
  THEN show login/signup options
```

Use for: Dashboards, saved items, personalized content

**Pattern 2: Permission Levels**
```
IF user is admin
  THEN show all controls
ELSE IF user is editor
  THEN show edit controls (no delete)
ELSE IF user is viewer
  THEN show read-only view
ELSE
  THEN show access denied message
```

Use for: Team tools, CMS, admin panels

**Pattern 3: Feature Gating (Freemium)**
```
IF feature is available in user''s plan
  THEN allow access
ELSE
  THEN show feature with lock icon
  THEN show upgrade prompt on click
```

Use for: SaaS products, subscription services

**Pattern 4: Progressive Disclosure**
```
IF user is new (first visit)
  THEN show simplified interface
  THEN show onboarding tooltips
ELSE IF user is intermediate
  THEN show full interface
  THEN hide advanced options
ELSE IF user is power user
  THEN show all features
  THEN show keyboard shortcuts
```

Use for: Complex tools, productivity apps

**Pattern 5: Data States**
```
IF loading data
  THEN show skeleton/spinner
ELSE IF data exists
  THEN show data in table/cards
ELSE IF no data (empty)
  THEN show empty state
  THEN show "Add first item" button
ELSE IF error loading
  THEN show error message
  THEN show retry button
```

Use for: All data-driven interfaces

**Pattern 6: Multi-Step Forms**
```
Step 1: Basic Info
  → Validate Step 1
    IF invalid: Show errors, stay on Step 1
    IF valid: Save data, go to Step 2

Step 2: Additional Details
  IF required fields filled
    THEN allow next
  ELSE
    THEN disable next button

Step 3: Review & Submit
  IF user clicks Edit
    THEN go back to relevant step
  IF user clicks Submit
    THEN show loading
    THEN IF success: Show confirmation
    THEN IF error: Show error, allow retry
```

Use for: Checkouts, registrations, bookings',
 '[
   {
     "title": "Search Results Decision Tree",
     "description": "User enters search → Searching... (loading) → Found results? (Yes: Display results with count + filters | No results: Show \"No results found\" + suggestions + \"Try different search\") → User applies filter → Rerun search with filters → Update results"
   }
 ]'::jsonb,
 3);

-- =====================================================
-- SECTION 4: BEST PRACTICES
-- =====================================================

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('best-practices',
 'Why Proper Requirements Matter: The PM-Designer Relationship',
 '**The Problem:**
Many projects fail or require multiple revisions because PMs provide incomplete or unclear requirements to designers. This creates:
• Wasted time on clarification meetings
• Design delays and missed deadlines
• Misaligned expectations
• Frustrated designers and PMs
• Poor user experience in the final product

**The Solution:**
Provide designers with THREE essential documents:
1. **Site-Map** (What pages exist and how they connect)
2. **User Journeys** (How users accomplish goals)
3. **Decision Trees** (What happens in different scenarios)

**The Impact of Good Requirements:**

**When PMs Provide Unclear Requirements:**
❌ "We need a dashboard"
• Designer asks: What goes on the dashboard?
• PM: I''ll know it when I see it
• Result: 5 revision rounds, frustration, delays

❌ "Users can book appointments"
• Designer asks: What''s the booking flow?
• PM: Just make it simple
• Result: Designer guesses, PM doesn''t like it

**When PMs Provide Clear Requirements:**
✅ "Dashboard shows: Welcome message, 3 quick action cards (Create Project, View Team, Settings), Recent projects table (5 rows), Activity feed (right sidebar)"
• Designer knows exactly what to design
• First version is 90% complete
• Minor tweaks only

✅ "Booking flow: 1. Select service (dropdown, 8 options) → 2. Choose date (calendar, 30 days ahead) → 3. Select time (30-min slots, 9am-5pm) → 4. Enter details (name, email, phone) → 5. Review (show all info) → 6. Confirm (submit, send email)"
• Designer creates perfect flow
• No ambiguity, no guesswork

**Your Role as a PM:**
You are the BRIDGE between business requirements and design execution. Your job is to:
1. ✅ Understand business goals and user needs
2. ✅ Define what features are needed
3. ✅ Document how they should work
4. ✅ Provide this info to designers BEFORE they start
5. ✅ Be available for clarifications

**The Designer''s Role:**
Designers should NOT have to:
❌ Guess what features are needed
❌ Define business logic or rules
❌ Decide which pages to create
❌ Figure out user flows on their own

Designers SHOULD:
✅ Make your requirements beautiful and usable
✅ Suggest UX improvements
✅ Design intuitive interfaces
✅ Create consistent visual systems',
 '[
   {
     "title": "Before: Unclear Brief",
     "description": "\"We need an e-commerce site with products and checkout\" → Designer confused, asks 20 questions, creates wrong thing"
   },
   {
     "title": "After: Clear Brief",
     "description": "Site-map showing all pages + User journey for complete purchase flow + Decision tree for cart, login, payment → Designer creates exactly what you need"
   }
 ]'::jsonb,
 1);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('best-practices',
 'The Golden Rules of PM-Designer Collaboration',
 '**Rule 1: Documentation First, Design Second**
NEVER ask a designer to start working without providing:
• Site-map (structure)
• User journeys (flows)
• Decision logic (conditions)

Think of it like building a house:
• You wouldn''t ask an architect to design without knowing how many rooms
• You wouldn''t ask a contractor to build without blueprints
• Same applies to design!

**Rule 2: Be Specific, Not Vague**

❌ Vague: "Make it user-friendly"
✅ Specific: "User should complete signup in under 2 minutes with maximum 3 steps"

❌ Vague: "Add social features"
✅ Specific: "Users can share projects via link, invite team members by email, and comment on tasks"

❌ Vague: "We need filters"
✅ Specific: "Filter products by: Price range (slider), Category (checkboxes, 8 options), Rating (dropdown, 1-5 stars), Availability (toggle)"

**Rule 3: Document Edge Cases**
Don''t just describe the happy path. Include:
• What if the user has no data yet?
• What if the API call fails?
• What if the user clicks Back?
• What if the user is on mobile vs. desktop?
• What if the user''s session expires?

**Rule 4: Provide Context, Not Just Features**

❌ Feature List: "Dashboard, Projects, Team, Settings"
✅ With Context: "Dashboard is first screen after login. Users primarily check project status (main focus) and quickly access team members (secondary). Settings used rarely."

This helps designers prioritize layout and information hierarchy.

**Rule 5: Define Success Metrics**
Help designers understand goals:
• "Goal: Increase signups" → Designer makes signup flow prominent
• "Goal: Reduce support tickets" → Designer adds inline help and clear error messages
• "Goal: Increase time on site" → Designer creates engaging, easy-to-navigate interface

**Rule 6: Be Available for Questions**
Even with great documentation, designers will have questions:
• What should this button say?
• What happens if both conditions are true?
• Should this open in a new window or same window?

Set clear communication channels and response times.

**Rule 7: Iterate Together**
Design is collaborative:
• Review early wireframes before full designs
• Provide feedback on one batch before designer does more
• Explain WHY you want changes, not just WHAT to change
• Be open to designer suggestions (they''re UX experts!)

**Rule 8: Use the Right Tools**
For documentation, use:
• Visual diagrams (Figma, Miro, Lucidchart)
• Shared documents (Google Docs, Notion)
• Screen recordings for complex flows
• Screenshots with annotations

NOT:
• Long email chains
• Verbal explanations only
• Scattered Slack messages',
 '[
   {
     "title": "Great PM Brief Checklist",
     "description": "✅ Site-map provided | ✅ User journeys documented | ✅ Decision logic explained | ✅ Edge cases covered | ✅ Success metrics defined | ✅ PM available for questions | ✅ Examples or references included"
   }
 ]'::jsonb,
 2);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('best-practices',
 'Common Mistakes PMs Make (And How to Avoid Them)',
 '**Mistake 1: "Just Make It Like [Competitor]"**
❌ Problem: Every product has different goals, users, and context
✅ Solution: Use competitors as inspiration, but define YOUR specific requirements

**Mistake 2: Design by Committee**
❌ Problem: "Everyone on the team should approve the design"
✅ Solution: Designate one decision-maker (you!) and gather feedback efficiently

**Mistake 3: Pixel-Perfect Specs Too Early**
❌ Problem: Telling designers exact pixel sizes, colors, etc. before concept is approved
✅ Solution: Let designers create concepts first, then refine details together

**Mistake 4: Changing Requirements Mid-Design**
❌ Problem: "Actually, let''s add this feature" after design is 80% done
✅ Solution: Finalize requirements BEFORE design starts. New ideas? Next phase.

**Mistake 5: Assuming Designers Know Your Domain**
❌ Problem: Using industry jargon without explanation
✅ Solution: Explain domain-specific concepts, business rules, and terminology

**Mistake 6: No Prioritization**
❌ Problem: "Everything is important and urgent"
✅ Solution: Must-have vs. Nice-to-have. Phase 1 vs. Phase 2.

**Mistake 7: Designing in Meetings**
❌ Problem: Trying to design the interface live in a meeting
✅ Solution: Document requirements first, let designer work, then review

**Mistake 8: Providing Solutions Instead of Problems**
❌ Problem: "Add a blue button in the top right that says Submit"
✅ Solution: "Users need a clear way to submit their form after completing all fields"

Let designers solve HOW. You define WHAT and WHY.

**Mistake 9: Incomplete User Journeys**
❌ Problem: Only documenting the happy path
✅ Solution: Include errors, edge cases, alternative paths, and recovery flows

**Mistake 10: No Mobile Consideration**
❌ Problem: Only thinking about desktop experience
✅ Solution: Specify mobile requirements or responsive behavior

**Mistake 11: Last-Minute Content Changes**
❌ Problem: "Change all the headings and copy" after designs are done
✅ Solution: Provide final content copy early, or at least realistic placeholders

**Mistake 12: Unrealistic Timelines**
❌ Problem: "Can you design 50 screens by end of week?"
✅ Solution: Discuss scope and timeline with designer before committing

**Red Flags in Your Brief:**
🚩 "You''ll figure it out as you go"
🚩 "Make it like this but different"
🚩 "I''ll know what I want when I see it"
🚩 "Just use your creativity"
🚩 "This should be quick and easy"

**Green Flags in Your Brief:**
✅ Clear site-map diagram
✅ Step-by-step user journeys
✅ Documented decision logic
✅ Edge cases covered
✅ Content/copy provided
✅ Success metrics defined
✅ Timeline discussed
✅ Examples referenced',
 '[
   {
     "title": "Bad Request",
     "description": "\"Design a modern, clean dashboard that shows data. Make it look professional.\" → Designer has no idea what data, what actions, what structure"
   },
   {
     "title": "Good Request",
     "description": "\"Dashboard shows: 1) Welcome banner with user name, 2) 4 metric cards (Revenue, Users, Conversions, Avg Order Value) with numbers + trend arrows, 3) Line chart showing 30-day revenue trend, 4) Recent orders table (5 rows, columns: Order#, Customer, Amount, Status, Action button)\""
   }
 ]'::jsonb,
 3);

-- Success message
SELECT 'Guidelines updated successfully! 🎉' AS message;
