# Local Development Guide for Reforge AI Sessions

## Prerequisites

### Required Software
- Docker Desktop (running)
- Node.js (latest LTS version)
- Supabase CLI (latest version)
- Git

### Required Accounts
- Google Cloud Platform account (for OAuth credentials)
- Supabase account (for reference only, not needed for local development)

## Local Environment Setup

### 1. Docker Setup
- Ensure Docker Desktop is running
- Verify Docker is accessible via CLI:
  ```bash
  docker --version
  docker ps
  ```

### 2. Supabase Local Configuration

#### Project Structure
```
reforge-sessions/
├── supabase/
│   ├── config.toml        # Local Supabase configuration
│   ├── migrations/        # Database migrations
│   └── seed.sql          # Seed data for local development
├── src/
│   └── lib/
│       └── supabase.js   # Supabase client configuration
└── .env.local            # Local environment variables
```

#### Port Configuration
Local Supabase services run on these ports:
- API: `localhost:54321`
- Database: `localhost:54322`
- Studio: `localhost:54323`
- Inbucket (email): `localhost:54324`
- Analytics: `localhost:54327`

### 3. Environment Variables

Create a `.env.local` file in the project root:
```env
# Local Supabase Configuration
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# Google OAuth Configuration for Local Development
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=your-google-client-id
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=your-google-client-secret
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:54321/auth/v1/callback`
5. Copy credentials to `.env.local`

### 5. Database Schema

#### Key Tables
1. `sessions`
   - `id` (uuid, primary key)
   - `title` (text)
   - `description` (text)
   - `date` (timestamptz)
   - `speaker` (text)
   - `recording_link` (text, nullable)
   - `summary_link` (text, nullable)
   - `calendar_link` (text, nullable)
   - `created_at` (timestamptz)
   - `is_past` (boolean)

2. `topics`
   - `id` (uuid, primary key)
   - `title` (text)
   - `description` (text)
   - `votes` (integer)
   - `created_at` (timestamptz)
   - `user_id` (uuid, references auth.users)
   - `user_email` (text, NOT NULL)
   - `user_name` (text, NOT NULL)

3. `votes`
   - `id` (uuid, primary key)
   - `topic_id` (uuid, references topics)
   - `user_id` (uuid, references auth.users)
   - `created_at` (timestamptz)

### 6. Starting the Local Environment

1. Start Supabase:
   ```bash
   supabase start
   ```

2. Reset database (if needed):
   ```bash
   supabase db reset
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Important Notes

### Production Safety
- Local Supabase runs in Docker containers, completely isolated from production
- All data stays on your machine
- Uses separate environment variables
- No connection to production database

### Authentication
- Google OAuth is configured for local development
- Auth state is managed by Supabase Auth
- Test users can be created through the app's UI
- Admin access requires @reforge.com email

### Database Management
- Migrations are in `supabase/migrations/`
- Seed data is in `supabase/seed.sql`
- Current seed only includes sessions (no topics)
- Topics require valid user references

### Common Issues

1. **Docker Not Running**
   - Error: "supabase start is not running"
   - Solution: Start Docker Desktop

2. **Port Conflicts**
   - Error: "port already in use"
   - Solution: Check if other services are using required ports

3. **Google OAuth Issues**
   - Error: "invalid redirect URI"
   - Solution: Verify redirect URI in Google Cloud Console matches Supabase config

4. **Database Reset Failures**
   - Error: "violates foreign key constraint"
   - Solution: Ensure seed data respects table relationships

### Development Workflow

1. **Making Schema Changes**
   - Create new migration in `supabase/migrations/`
   - Test locally with `supabase db reset`
   - Never modify production schema directly

2. **Testing Authentication**
   - Use Google OAuth for login
   - Test admin features with @reforge.com email
   - Check auth state in Supabase Studio

3. **Data Management**
   - Use Supabase Studio (`localhost:54323`) for database inspection
   - Monitor real-time updates in browser console
   - Check email testing in Inbucket (`localhost:54324`)

## Troubleshooting

### Reset Everything
```bash
# Stop Supabase
supabase stop

# Remove all containers and volumes
docker rm -f $(docker ps -aq)
docker volume rm $(docker volume ls -q)

# Start fresh
supabase start
```

### View Logs
```bash
# Supabase logs
supabase logs

# Docker logs
docker logs supabase_db_reforge-sessions
```

### Database Access
```bash
# Connect to database
supabase db connect

# Reset database
supabase db reset
```

## Best Practices

1. **Never commit sensitive data**
   - Keep `.env.local` out of version control
   - Use environment variables for secrets

2. **Regular updates**
   - Keep Supabase CLI updated
   - Update Docker images regularly

3. **Testing**
   - Test all features locally before deployment
   - Verify Google OAuth flow
   - Check admin functionality

4. **Documentation**
   - Update this guide when making changes
   - Document any new environment requirements
   - Keep migration history clear

## Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Docker Documentation](https://docs.docker.com/)
- [Vite Documentation](https://vitejs.dev/guide/) 