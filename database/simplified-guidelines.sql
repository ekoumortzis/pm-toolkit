-- Clear existing guidelines and create simplified, visual content
DELETE FROM guidelines;

-- =====================================================
-- QUICK START GUIDE
-- =====================================================

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('best-practices',
 'Getting Started: What Designers Need From You',
 '## The Basics

When starting a new project, designers need **3 essential documents** from you:

### 1. 📋 **The Project Brief**
• **What** are we building?
• **Why** are we building it?
• **Who** is it for?

### 2. 🗺️ **Site-Map** (Page Structure)
• What pages exist?
• How are they connected?

### 3. 🚶 **User Journey** (How It Works)
• Step-by-step: What does the user do?
• What happens next?

---

## Why This Matters

**Without these docs:**
❌ Designers guess (and guess wrong)
❌ Multiple revision rounds needed
❌ Delays and frustration
❌ Final product doesn''t match your vision

**With these docs:**
✅ Designers nail it the first time
✅ Faster development
✅ Better end result
✅ Happy team!

---

## Example: Simple E-Commerce App

**Project Brief:**
"Build an online store for selling handmade crafts. Users should easily browse, add to cart, and checkout."

**Site-Map:**
```
Home → Shop → Product Detail → Cart → Checkout → Thank You
```

**User Journey:**
1. User lands on homepage
2. Clicks "Shop Now"
3. Browses products
4. Clicks product to see details
5. Clicks "Add to Cart"
6. Views cart
7. Clicks "Checkout"
8. Enters shipping + payment
9. Confirms order
10. Sees thank you page

**That''s it!** With this info, designers can start working.',
 '[
   {
     "title": "Quick Checklist",
     "description": "✅ Project description (what & why) | ✅ Site-map (all pages) | ✅ User journey (step-by-step flow) → Ready to design!"
   }
 ]'::jsonb,
 1);

-- =====================================================
-- SITE-MAPS SIMPLIFIED
-- =====================================================

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('site-maps',
 'Site-Maps Made Simple',
 '## What is a Site-Map?

A **visual list** of all pages in your app, showing how they connect.

Think of it like a **table of contents** for your website.

---

## How to Create One

**Step 1:** List all the pages you need

Example:
• Homepage
• About Us
• Products
• Product Detail
• Cart
• Checkout
• Contact

**Step 2:** Organize them by hierarchy

```
Homepage (top level)
├── About Us
├── Products (main section)
│   └── Product Detail (sub-page)
├── Cart
└── Checkout
```

**Step 3:** Share it with your designer!

You can use:
• A diagram (Figma, Miro, draw.io)
• A simple outline (like above)
• Even a sketch on paper!

---

## Real Example

**Bad:** "We need a shopping site"

**Good:**
```
Home
├── Shop
│   ├── All Products
│   ├── Category: Electronics
│   └── Category: Clothing
├── Product Detail
├── Cart
├── Checkout
└── Account
    ├── My Orders
    └── Settings
```

See the difference? The second one shows **exactly** what pages exist and how they''re organized!',
 '[
   {
     "title": "Simple SaaS App Site-Map",
     "description": "Dashboard → Projects (List, Create, Edit) → Team (Members, Invite) → Settings (Profile, Billing) → Help"
   },
   {
     "title": "Blog Site-Map",
     "description": "Home → Blog (All Posts, Single Post, Search) → About → Contact → Subscribe"
   }
 ]'::jsonb,
 1);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('site-maps',
 'Site-Map Tips & Tricks',
 '## Common Questions

### "How many pages should I have?"

As many as needed, but keep it simple:
• Small app: 5-10 pages
• Medium app: 10-20 pages
• Large app: 20+ pages (organize into sections)

### "What if I''m not sure about all pages yet?"

Start with the core pages (must-haves), then add more later:
• **Phase 1:** Homepage, Main Feature, Login
• **Phase 2:** Settings, Profile, Help
• **Phase 3:** Advanced features

### "Can pages have different versions?"

Yes! Note this in your site-map:
• Product Detail *(logged in)*
• Product Detail *(guest)* - limited features

---

## Pro Tips

✅ **Use clear names:** "Products" not "Content"
✅ **Show relationships:** Use arrows or indentation
✅ **Include utility pages:** Login, 404, Settings
✅ **Mark special pages:** *(admin only)*, *(requires login)*

❌ **Don''t:** Just list pages randomly
❌ **Don''t:** Use vague names like "Page 1"
❌ **Don''t:** Forget about error/empty states

---

## Quick Template

Copy this and fill in your pages:

```
[YOUR APP NAME]

Main Navigation:
├── Page 1
├── Page 2
│   ├── Sub-page A
│   └── Sub-page B
└── Page 3

Utility Pages:
├── Login
├── Settings
└── Help
```',
 '[
   {
     "title": "Before & After",
     "description": "❌ Before: products, about, contact, form, page, settings (random list) → ✅ After: Home → About → Products (List, Detail) → Contact → Account (Profile, Settings)"
   }
 ]'::jsonb,
 2);

-- =====================================================
-- USER JOURNEYS SIMPLIFIED
-- =====================================================

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('user-journeys',
 'User Journeys Explained Simply',
 '## What is a User Journey?

A **step-by-step story** of how a user accomplishes a goal in your app.

It answers: **"What happens when a user does X?"**

---

## How to Write One

**Format:** Number each step

**Example: User Signs Up**

1. User clicks "Sign Up" button
2. User enters email and password
3. User clicks "Create Account"
4. → Is email valid? *(if no: show error)*
5. System creates account
6. System sends welcome email
7. User sees success message
8. User redirected to dashboard

**That''s it!** Just write what happens, step by step.

---

## Key Components

Every journey should include:

### 📍 **Start Point**
Where does it begin?
• "User lands on homepage"
• "User clicks login button"

### 👆 **Actions**
What does the user do?
• "User enters name"
• "User clicks submit"

### 🔀 **Decisions**
What choices exist?
• "Is password correct?"
• "Does user have an account?"

### ✅ **End Point**
What''s the result?
• "User logged in successfully"
• "Order placed, confirmation sent"

---

## Real Example

**Bad:** "User buys a product"

**Good:**
1. User views product
2. User clicks "Add to Cart"
3. Cart icon updates (+1)
4. User clicks cart icon
5. User sees cart page with product
6. User clicks "Checkout"
7. → User logged in? *(yes: skip to step 10)*
8. User enters email
9. User creates account
10. User enters shipping address
11. User enters credit card
12. User clicks "Place Order"
13. Payment processes
14. → Payment successful? *(no: show error, retry)*
15. Order confirmed
16. Email sent
17. User sees "Thank You" page',
 '[
   {
     "title": "Simple Login Journey",
     "description": "1. Click Login → 2. Enter email/password → 3. Click Submit → 4. Valid? (Yes: Go to dashboard | No: Show error)"
   },
   {
     "title": "Add to Favorites",
     "description": "1. User clicks ♡ icon → 2. Logged in? (Yes: Add to favorites + show ♥ | No: Show \"Login to save\")"
   }
 ]'::jsonb,
 1);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('user-journeys',
 'What to Include in Your Journey',
 '## The Happy Path First

Start with the **ideal scenario** where everything works perfectly:
• No errors
• User has all required info
• All systems working

**Example: Successful Checkout**
• User has items in cart
• Payment goes through
• Order confirmed ✓

---

## Then Add "What If..." Scenarios

### What if something goes wrong?

**Error scenarios:**
• "What if credit card is declined?"
• "What if email already exists?"
• "What if internet disconnects?"

**For each error, specify:**
1. What error message to show
2. What user can do next
3. How to recover

### What if user does something unexpected?

**Alternative paths:**
• "What if user clicks Back?"
• "What if user abandons cart?"
• "What if user wants to edit?"

---

## Format: IF-THEN

Use simple **IF-THEN** statements:

```
Step 5: User clicks Submit
→ IF password is too short
  THEN show error: "Password must be 8+ characters"
  THEN keep user on same page
→ IF password is valid
  THEN save data
  THEN go to next step
```

---

## Keep It Simple

✅ **Write clearly:** "User clicks blue Submit button"
✅ **Be specific:** "Show error: ''Email required''"
✅ **Number steps:** Makes it easy to follow

❌ **Don''t assume:** Designers don''t know your business rules
❌ **Don''t skip steps:** Include EVERYTHING
❌ **Don''t be vague:** "User does stuff" ← BAD',
 '[
   {
     "title": "Password Reset Journey with Errors",
     "description": "1. User clicks \"Forgot Password\" → 2. Enter email → 3. Valid? (No: \"Please enter valid email\" | Yes: continue) → 4. In database? (No: \"Check your email\" for security | Yes: send reset link) → 5. User clicks link → 6. Link expired? (Yes: \"Link expired, request new one\" | No: show reset form) → 7. Enter new password → 8. Valid? (No: show requirements | Yes: save) → 9. Success: \"Password updated!\""
   }
 ]'::jsonb,
 2);

-- =====================================================
-- DECISION TREES SIMPLIFIED
-- =====================================================

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('decision-trees',
 'Decision Trees: The "IF-THEN" Guide',
 '## What is a Decision Tree?

Shows **different outcomes** based on **different conditions**.

Think: **"IF this happens, THEN do that"**

---

## Why Designers Need This

Designers need to know:
• What to show logged-in users vs. guests
• What happens when data is missing
• Different views for different user types
• What to do when things go wrong

---

## Simple Format

```
IF [condition]
  THEN [outcome A]
ELSE
  THEN [outcome B]
```

---

## Real Examples

### Example 1: Shopping Cart

```
IF cart is empty
  THEN show "Your cart is empty" message
  THEN show "Browse Products" button
ELSE (cart has items)
  THEN show cart items
  THEN show "Checkout" button
```

### Example 2: User Access

```
IF user is logged in
  THEN show "My Account" link
  THEN show "Sign Out" button
ELSE (user is guest)
  THEN show "Login" button
  THEN show "Sign Up" button
```

### Example 3: Premium Features

```
IF user has free plan
  THEN show feature with lock icon
  THEN show "Upgrade to Pro" button
ELSE IF user has pro plan
  THEN allow full access to feature
```

---

## Common Decisions You''ll Make

• **Authentication:** Logged in vs. guest
• **Permissions:** Admin vs. regular user
• **Data:** Has data vs. empty state
• **Validation:** Valid input vs. invalid
• **Status:** Loading vs. success vs. error',
 '[
   {
     "title": "Simple Dashboard Decision",
     "description": "IF user has projects → Show project list | ELSE → Show \"Create your first project\" with + button"
   },
   {
     "title": "Download Feature",
     "description": "IF user is premium → Allow download | ELSE → Show \"Premium feature\" popup with upgrade link"
   }
 ]'::jsonb,
 1);

INSERT INTO guidelines (section, title, content, examples, "order") VALUES
('decision-trees',
 'Common Decision Patterns',
 '## Pattern 1: Authentication

**Most common decision in any app**

```
IF user is logged in
  THEN show personalized content
  THEN show user menu with name
ELSE
  THEN show generic content
  THEN show "Login" button
```

---

## Pattern 2: Data States

**Handle all possible states**

```
IF loading data
  THEN show spinner
ELSE IF data exists
  THEN show data in table
ELSE IF no data (empty)
  THEN show "No items yet" message
  THEN show "Add First Item" button
ELSE IF error loading
  THEN show "Something went wrong"
  THEN show "Try Again" button
```

---

## Pattern 3: Form Validation

**Real-time feedback**

```
User types in email field:

IF email is empty
  THEN show nothing (don''t annoy)
ELSE IF email format is wrong
  THEN show red border
  THEN show "Invalid email" error
ELSE IF email is valid
  THEN show green checkmark
```

---

## Pattern 4: Permissions

**Different users see different things**

```
IF user is admin
  THEN show all controls
  THEN show "Delete" button
ELSE IF user is editor
  THEN show edit controls
  THEN hide "Delete" button
ELSE IF user is viewer
  THEN show read-only view
  THEN disable all editing
```

---

## Pattern 5: Feature Availability

**Freemium model**

```
User clicks on Premium Feature:

IF user has free account
  THEN show modal: "This is a premium feature"
  THEN show "Upgrade" button
  THEN show pricing
ELSE IF user has premium account
  THEN open feature normally
```',
 '[
   {
     "title": "Search Results",
     "description": "User searches: Loading... → Found 10 results: Show results + filters | Found 0 results: \"No results\" + suggestions | Error: \"Search failed\" + retry button"
   }
 ]'::jsonb,
 2);

-- Success message
SELECT 'Simplified guidelines created! 🎨' AS message;
