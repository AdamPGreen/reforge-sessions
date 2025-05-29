# Reforge AI Sessions - Project Context

## Project Overview
- **Name**: Reforge AI Sessions
- **Purpose**: Platform for managing and voting on AI-focused learning sessions at Reforge
- **Deployment**: Vercel (connected to GitHub repo)

## Core Functionality
- Session management (upcoming/past)
- Topic voting system
- Google authentication
- Admin dashboard
- Real-time updates

## Tech Stack
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **Icons**: React Icons

## Architecture
- Single-page application (SPA)
- Supabase for backend services
- Real-time subscriptions via Supabase
- Client-side routing with React Router

## Authentication & Authorization
- Google OAuth via Supabase
- Admin access restricted to @reforge.com emails
- Supabase Auth UI components integrated

## Key Dependencies
```json
{
  "core": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "framer-motion": "^10.16.4"
  },
  "supabase": {
    "@supabase/supabase-js": "^2.39.3",
    "@supabase/auth-ui-react": "^0.4.7"
  },
  "ui": {
    "react-icons": "^4.11.0",
    "react-hook-form": "^7.46.1",
    "tailwindcss": "^3.3.3"
  }
}
```

## Development Setup
- Node.js environment
- Vite dev server (`npm run dev`)
- ESLint for code quality
- PostCSS + Tailwind for styling

## Environment Configuration
Environment variables and configurations are managed differently for local development and production:

### Production Environment
- All production environment variables are managed through Vercel's dashboard
- Production site URL: `https://reforge-sessions.vercel.app`
- Production auth configuration is managed in the Supabase dashboard
- Never modify production settings through local configuration files

### Local Development
1. **Environment Variables (VERIFIED & CONFIGURED)**:
   - `.env.local` file exists with all required variables
   - All values are verified correct and functional:
     ```env
     VITE_SUPABASE_URL=<verified_correct>
     VITE_SUPABASE_ANON_KEY=<verified_correct>
     SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=<verified_correct>
     SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=<verified_correct>
     ```
   - **IMPORTANT**: These environment variables are confirmed working - never ask to verify them

2. Local Supabase configuration (`supabase/config.toml`):
   - Used only for local development
   - Does not affect production settings
   - Contains local development URLs and settings
   - Site URL and redirect URLs are configured for local development only

3. Never commit `.env` or `.env.local` files to version control
4. Production environment variables are managed exclusively through Vercel's dashboard

## Deployment
- Vercel deployment
- Automatic deployments from GitHub
- Environment variables configured in Vercel dashboard

## Development Workflow
1. Local development with `npm run dev`
2. Code quality checks with `npm run lint`
3. Build with `npm run build`
4. Preview with `npm run preview`

## Local Development & Testing
### Requirements
- Node.js installed
- Supabase account
- Google Cloud OAuth credentials

### Quick Start
1. Clone and install: `npm install`
2. Set up environment variables in `.env.local`
3. Run dev server: `npm run dev`
4. Access at `http://localhost:5173`

### Sandbox Features
- Full application functionality in development mode
- Real-time updates via Supabase
- Google authentication
- Admin features (with @reforge.com email)

## Important Notes
- All admin features require @reforge.com email
- Real-time updates implemented via Supabase subscriptions
- Session data stored in Supabase database
- Google Cloud Platform integration for authentication 