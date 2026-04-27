# PM Toolkit - Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Install Node.js
Download and install from [nodejs.org](https://nodejs.org) (v18 or higher)

### Step 2: Set Up Supabase
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" (free account)
3. Create a new project
4. Wait 2 minutes for database setup
5. Go to **Settings** → **API**
6. Copy these three values:
   - Project URL
   - Anon public key
   - Service role key

### Step 3: Create Database Tables
1. In Supabase, go to **SQL Editor**
2. Copy the entire contents of `/database/schema.sql`
3. Paste and click "Run"
4. Wait for "Database schema created successfully! 🎉"

### Step 4: Configure Environment Variables

#### Frontend
```bash
cd client
cp .env.example .env
```

Edit `client/.env` and add your Supabase values:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

#### Backend
```bash
cd ../server
cp .env.example .env
```

Edit `server/.env` and add:
```
PORT=5000
NODE_ENV=development

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_KEY=eyJhbG... (different from anon key!)

JWT_SECRET=any_random_long_string_here_make_it_secure

# For email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=PM Toolkit <noreply@pmtoolkit.com>

FRONTEND_URL=http://localhost:3000
```

**Gmail App Password Setup:**
1. Go to Google Account settings
2. Enable 2-factor authentication
3. Search for "App Passwords"
4. Generate new app password
5. Copy and paste into EMAIL_PASSWORD

### Step 5: Install Dependencies

Open two terminal windows:

**Terminal 1 - Frontend:**
```bash
cd client
npm install
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd server
npm install
npm run dev
```

### Step 6: Open the App
Go to [http://localhost:3000](http://localhost:3000)

### Step 7: Create Admin Account
1. Sign up with your email
2. Check your inbox and verify email
3. Go to Supabase → **Authentication** → **Users**
4. Click on your user
5. In "Raw User Meta Data", add:
   ```json
   {
     "role": "admin",
     "full_name": "Your Name"
   }
   ```
6. Save

Now you're an admin! Access the admin panel at [http://localhost:3000/admin](http://localhost:3000/admin)

## 🎯 What You Can Do Now

### As a User:
- ✅ Learn PM best practices in **Guidelines**
- ✅ Browse 100+ AI prompts in **Prompt Library**
- ✅ Create project briefs with **Brief Creator**
- ✅ Build visual site-maps with **Site-Map Builder**
- ✅ Design user flows with **User Journey Builder**

### As an Admin:
- ✅ Add/edit/delete prompts
- ✅ Manage guidelines
- ✅ View all users (coming soon)
- ✅ See platform analytics (coming soon)

## 📁 Project Structure

```
PMs project/
├── client/              # React frontend (port 3000)
│   ├── src/
│   │   ├── components/  # All React components
│   │   ├── pages/       # Page components
│   │   └── utils/       # Helper functions
│   └── public/          # Static files
│
├── server/              # Express backend (port 5000)
│   ├── config/          # Configuration files
│   ├── routes/          # API endpoints
│   └── services/        # Business logic
│
└── database/            # SQL schema
```

## 🔧 Common Issues

### "Cannot connect to database"
- Check your SUPABASE_URL and keys
- Make sure you ran the schema.sql script
- Verify your Supabase project is active

### "Email not sending"
- For Gmail: Make sure 2FA is enabled
- Use an App Password, not your regular password
- Check the email isn't in spam

### "Module not found"
- Run `npm install` in both client and server folders
- Delete `node_modules` and run `npm install` again

### "Port already in use"
- Frontend (3000): `lsof -ti:3000 | xargs kill -9`
- Backend (5000): `lsof -ti:5000 | xargs kill -9`

## 🎨 Customization

### Change Colors
Edit `client/tailwind.config.js`:
```javascript
colors: {
  primary: '#102542',    // Your primary color
  secondary: '#CDD7D6',  // Your secondary color
  accent: '#f87060',     // Your accent color
}
```

### Add More Prompts
1. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Click "Prompt Library"
3. Add new prompts with categories

### Customize Guidelines
1. Edit directly in Supabase → **Table Editor** → **guidelines**
2. Or add via the admin panel (coming soon)

## 📚 Next Steps

1. **Explore the App**: Click around and try all features
2. **Add Your Prompts**: Customize the prompt library for your needs
3. **Create Your First Brief**: Use the Brief Creator
4. **Build a Site-Map**: Try the visual builder
5. **Map a User Journey**: Design a flow with decision logic

## 🆘 Need Help?

- 📖 Full documentation: See `README.md`
- 🐛 Issues: Create an issue on GitHub
- 💬 Questions: Email support@pmtoolkit.com

## 🚀 Deployment (Optional)

### Deploy Frontend (Vercel)
```bash
cd client
npm run build
# Upload 'dist' folder to Vercel
```

### Deploy Backend (Railway)
```bash
cd server
# Connect to Railway and deploy
```

Set all environment variables in your hosting platform!

---

**You're all set!** 🎉

Enjoy building with PM Toolkit!
