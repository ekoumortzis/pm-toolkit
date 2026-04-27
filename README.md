# PM Toolkit

A comprehensive web application for Project Managers to learn design best practices, create better briefs, and build applications using AI without writing code.

## Features

### 1. **Guidelines & Documentation**
- Learn how designers want requirements
- Understand site-maps, user journeys, and decision trees
- Best practices for PM-designer collaboration

### 2. **Prompt Library**
- 100+ copy-paste ready AI prompts
- Categorized by functionality (Backend, Frontend, Auth, etc.)
- Filter by difficulty and AI tool compatibility
- Build complete applications without coding

### 3. **Brief Creator**
- Guided questionnaire for complete requirements
- Save drafts and export briefs
- Professional deliverables for designers

### 4. **Visual Site-Map Builder**
- Drag-and-drop page hierarchy builder
- Pre-built templates (E-commerce, SaaS, etc.)
- Export as image or shareable link

### 5. **User Journey Builder**
- Map user flows with decision logic
- Visual if/then conditions
- Success and error path visualization

## Tech Stack

### Frontend
- **React** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Flow** for visual builders
- **Lucide React** for icons
- **Supabase Client** for authentication

### Backend
- **Node.js** + **Express**
- **Supabase** for database and auth
- **Nodemailer** for email services

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- A **Supabase** account (free tier works)
- An **email account** for Nodemailer (Gmail recommended)

## Setup Instructions

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd "PMs project"
\`\`\`

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Go to **Settings** → **API** and copy:
   - Project URL
   - Anon/Public Key
   - Service Role Key (keep this secret!)

4. Go to **SQL Editor** and run the database migration script (see `/database/schema.sql`)

### 3. Configure Environment Variables

#### Frontend (.env)

\`\`\`bash
cd client
cp .env.example .env
\`\`\`

Edit `client/.env`:
\`\`\`
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

#### Backend (.env)

\`\`\`bash
cd ../server
cp .env.example .env
\`\`\`

Edit `server/.env`:
\`\`\`
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# JWT
JWT_SECRET=your_random_secret_key_here

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=PM Toolkit <noreply@pmtoolkit.com>

# Frontend URL
FRONTEND_URL=http://localhost:3000
\`\`\`

**Note:** For Gmail, you need to:
- Enable 2-factor authentication
- Generate an "App Password" in your Google Account settings
- Use the app password in `EMAIL_PASSWORD`

### 4. Install Dependencies

#### Frontend

\`\`\`bash
cd client
npm install
\`\`\`

#### Backend

\`\`\`bash
cd ../server
npm install
\`\`\`

### 5. Run the Application

You need to run both frontend and backend in separate terminals:

#### Terminal 1 - Frontend

\`\`\`bash
cd client
npm run dev
\`\`\`

The frontend will run on [http://localhost:3000](http://localhost:3000)

#### Terminal 2 - Backend

\`\`\`bash
cd server
npm run dev
\`\`\`

The backend API will run on [http://localhost:5000](http://localhost:5000)

### 6. Create Your First Admin User

After signing up, you need to manually set your user as admin in Supabase:

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Find your user and click to edit
3. Go to **Raw User Meta Data** and add:
   \`\`\`json
   {
     "role": "admin"
   }
   \`\`\`
4. Save changes

Now you can access the Admin Dashboard at `/admin`

## Project Structure

\`\`\`
/
├── client/                     # Frontend React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # Reusable components
│   │   │   ├── home/          # Homepage components
│   │   │   ├── auth/          # Authentication
│   │   │   ├── dashboard/     # PM Dashboard tools
│   │   │   └── admin/         # Admin components
│   │   ├── pages/             # Page components
│   │   ├── context/           # React Context
│   │   └── utils/             # Utilities
│   └── public/                # Static assets
│
└── server/                     # Backend API
    ├── config/                # Configuration
    ├── middleware/            # Express middleware
    ├── routes/                # API routes
    ├── services/              # Business logic
    └── utils/                 # Utilities
\`\`\`

## Database Schema

The application uses the following main tables:

- **users** - User accounts and profiles
- **prompt_categories** - Categories for the prompt library
- **prompts** - AI prompts for building apps
- **briefs** - User-created project briefs
- **guidelines** - Documentation and best practices
- **email_verifications** - Email verification tokens
- **password_resets** - Password reset tokens

See `/database/schema.sql` for the complete schema.

## Key Features Implementation

### Authentication
- Email/password signup with verification
- Password reset functionality
- JWT-based authentication
- Protected routes

### Prompt Library
- Categorized prompts for different use cases
- Search and filter functionality
- Copy-to-clipboard for easy use
- Difficulty levels (Beginner, Intermediate, Advanced)

### Visual Builders
- React Flow for drag-and-drop
- Pre-built templates
- Export functionality
- Save/load from database

## Design System

- **Primary Color:** #102542 (Dark Blue)
- **Secondary Color:** #CDD7D6 (Light Gray)
- **Accent Color:** #f87060 (Coral)
- **Font:** Geologica (Google Fonts)

## API Endpoints

### Authentication (via Supabase)
- User signup, login, email verification
- Password reset

### Prompts
- `GET /api/prompts` - Get all prompts
- `GET /api/prompts/:id` - Get single prompt
- `POST /api/prompts` - Create prompt (admin)
- `PUT /api/prompts/:id` - Update prompt (admin)
- `DELETE /api/prompts/:id` - Delete prompt (admin)

### Briefs
- `GET /api/briefs` - Get user's briefs
- `POST /api/briefs` - Create brief
- `PUT /api/briefs/:id` - Update brief
- `DELETE /api/briefs/:id` - Delete brief

### Site-Maps & Journeys
- `GET /api/sitemaps` - Get saved site-maps
- `POST /api/sitemaps` - Save site-map
- `GET /api/user-journeys` - Get saved journeys
- `POST /api/user-journeys` - Save journey

### Guidelines
- `GET /api/guidelines` - Get all guidelines

## Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `cd client && npm run build`
2. Deploy the `dist` folder to Vercel or Netlify
3. Set environment variables in the hosting platform

### Backend (Railway/Render/Heroku)
1. Deploy the `server` folder
2. Set all environment variables
3. Ensure NODE_ENV is set to `production`

### Database
Supabase handles hosting automatically. Just ensure your connection strings are correct.

## Seeding Initial Data

To populate the database with initial prompts and guidelines, run:

\`\`\`bash
cd server
npm run seed
\`\`\`

(Note: Seed script needs to be created separately)

## Troubleshooting

### Email Verification Not Working
- Check that EMAIL_HOST, EMAIL_USER, and EMAIL_PASSWORD are correct
- For Gmail, ensure you're using an App Password, not your regular password
- Check spam folder for verification emails

### Supabase Connection Errors
- Verify your SUPABASE_URL and keys are correct
- Check that your Supabase project is active
- Ensure database tables are created correctly

### Frontend Can't Connect to Backend
- Ensure backend is running on port 5000
- Check CORS settings in server.js
- Verify proxy settings in vite.config.js

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this for your own projects!

## Support

For issues or questions:
- Create an issue on GitHub
- Email: support@pmtoolkit.com

## Roadmap

- [ ] PDF export for briefs
- [ ] Image export for site-maps and journeys
- [ ] Collaborative editing
- [ ] More AI prompt categories
- [ ] Integration with design tools (Figma, etc.)
- [ ] Mobile app version

---

Built with ❤️ for Project Managers

**Proudly made in the EU** 🇪🇺
