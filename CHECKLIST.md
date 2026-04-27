# PM Toolkit - Setup Checklist

Use this checklist to ensure everything is properly configured before running the application.

## ☐ Prerequisites

- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (optional, for version control)
- [ ] Code editor (VS Code recommended)

## ☐ Supabase Setup

- [ ] Created Supabase account at [supabase.com](https://supabase.com)
- [ ] Created new project
- [ ] Waited for database provisioning (takes ~2 minutes)
- [ ] Copied Project URL from Settings → API
- [ ] Copied Anon/Public Key from Settings → API
- [ ] Copied Service Role Key from Settings → API (keep secret!)
- [ ] Ran `/database/schema.sql` in SQL Editor
- [ ] Confirmed "Database schema created successfully! 🎉" message

## ☐ Email Service (for verification emails)

### Option 1: Gmail
- [ ] Enabled 2-factor authentication on Gmail
- [ ] Generated App Password in Google Account → Security → App Passwords
- [ ] Copied app password for use in server .env

### Option 2: Other SMTP
- [ ] Have SMTP host address
- [ ] Have SMTP port number
- [ ] Have email credentials
- [ ] Tested SMTP connection

## ☐ Environment Variables

### Frontend (.env)
- [ ] Created `client/.env` file (copy from `.env.example`)
- [ ] Added `VITE_SUPABASE_URL`
- [ ] Added `VITE_SUPABASE_ANON_KEY`
- [ ] Values match Supabase project

### Backend (.env)
- [ ] Created `server/.env` file (copy from `.env.example`)
- [ ] Set `PORT=5000`
- [ ] Set `NODE_ENV=development`
- [ ] Added `SUPABASE_URL`
- [ ] Added `SUPABASE_ANON_KEY`
- [ ] Added `SUPABASE_SERVICE_KEY` (different from anon!)
- [ ] Generated random `JWT_SECRET` (long random string)
- [ ] Configured email settings:
  - [ ] `EMAIL_HOST`
  - [ ] `EMAIL_PORT`
  - [ ] `EMAIL_USER`
  - [ ] `EMAIL_PASSWORD` (app password for Gmail)
  - [ ] `EMAIL_FROM`
- [ ] Set `FRONTEND_URL=http://localhost:3000`

## ☐ Dependencies

- [ ] Ran `cd client && npm install`
- [ ] No errors during client install
- [ ] Ran `cd ../server && npm install`
- [ ] No errors during server install

## ☐ Running the Application

- [ ] Started backend: `cd server && npm run dev`
- [ ] Backend running on port 5000
- [ ] Saw "Server running on port 5000" message
- [ ] Saw "Email server is ready" message
- [ ] Started frontend: `cd client && npm run dev`
- [ ] Frontend running on port 3000
- [ ] Opened [http://localhost:3000](http://localhost:3000)
- [ ] Website loads without errors

## ☐ Testing Authentication

- [ ] Clicked "Sign Up" on homepage
- [ ] Filled out signup form
- [ ] Submitted form successfully
- [ ] Received "Check Your Email" message
- [ ] Found verification email in inbox (check spam!)
- [ ] Clicked verification link
- [ ] Saw "Email Verified!" success message
- [ ] Redirected to dashboard
- [ ] Able to see dashboard tools

## ☐ Creating Admin User

- [ ] Logged in with verified account
- [ ] Opened Supabase Dashboard
- [ ] Went to Authentication → Users
- [ ] Found your user in the list
- [ ] Clicked to edit user
- [ ] Scrolled to "Raw User Meta Data"
- [ ] Added admin role:
  ```json
  {
    "role": "admin",
    "full_name": "Your Name"
  }
  ```
- [ ] Saved changes
- [ ] Refreshed PM Toolkit page
- [ ] "Admin" link now appears in header
- [ ] Can access `/admin` page

## ☐ Testing Core Features

### Guidelines
- [ ] Clicked "Guidelines & Best Practices" on dashboard
- [ ] Can see sample guidelines
- [ ] Search functionality works
- [ ] Section filtering works
- [ ] Can read guideline content

### Prompt Library
- [ ] Clicked "Prompt Library" on dashboard
- [ ] Can see sample prompts
- [ ] Search works
- [ ] Category filter works
- [ ] Difficulty filter works
- [ ] Can copy prompt to clipboard
- [ ] Modal opens when clicking prompt card

### Brief Creator
- [ ] Clicked "Brief Creator" on dashboard
- [ ] Multi-step form loads
- [ ] Can fill out project basics (Step 1)
- [ ] Can add features (Step 2)
- [ ] Can set design preferences (Step 3)
- [ ] Can review brief (Step 4)
- [ ] Can save draft
- [ ] Draft appears in "Saved Briefs" sidebar
- [ ] Can load saved brief

### Site-Map Builder
- [ ] Clicked "Site-Map Builder" on dashboard
- [ ] Canvas loads with React Flow
- [ ] Can select page type
- [ ] Can add new page node
- [ ] Node appears on canvas
- [ ] Can drag nodes around
- [ ] Can connect nodes (drag from edge)
- [ ] Connection appears with arrow
- [ ] Zoom controls work
- [ ] MiniMap shows overview
- [ ] Template buttons work

### User Journey Builder
- [ ] Clicked "User Journey Builder" on dashboard
- [ ] Canvas loads
- [ ] Can add different step types
- [ ] Can add edge labels
- [ ] Decision nodes display differently
- [ ] Can create flow with multiple paths
- [ ] Template buttons work

## ☐ Admin Features (If Admin)

- [ ] Can access `/admin` page
- [ ] See admin dashboard with tools
- [ ] All admin sections load

## ☐ Optional Improvements

- [ ] Added more sample prompts to database
- [ ] Added more guidelines content
- [ ] Customized colors in tailwind.config.js
- [ ] Added your own branding/logo
- [ ] Configured custom domain

## ☐ Production Readiness (Before Deploying)

- [ ] Changed all default passwords
- [ ] Set strong JWT_SECRET
- [ ] Configured production email service
- [ ] Set NODE_ENV=production
- [ ] Updated FRONTEND_URL to production URL
- [ ] Tested on multiple browsers
- [ ] Tested on mobile devices
- [ ] Checked all forms validate correctly
- [ ] Verified email delivery works
- [ ] Backed up database
- [ ] Set up error logging
- [ ] Configured analytics (optional)

## 🎉 Success!

If all boxes are checked, your PM Toolkit is fully operational!

### What to do next:

1. **Customize Content**
   - Add your own prompts via Admin panel
   - Update guidelines with your best practices
   - Create templates for your team

2. **Invite Users**
   - Share the platform with your PM team
   - Create admin accounts for team leads
   - Gather feedback

3. **Deploy to Production**
   - See README.md for deployment instructions
   - Use Vercel/Netlify for frontend
   - Use Railway/Render for backend

4. **Monitor & Improve**
   - Track usage
   - Collect user feedback
   - Add requested features

---

**Need Help?**
- 📖 See README.md for detailed documentation
- 🚀 See SETUP_GUIDE.md for quick start
- 📧 Email: support@pmtoolkit.com
