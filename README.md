# Reforge AI Sessions

A platform for managing and voting on AI-focused learning sessions at Reforge.

## Features

- Upcoming and past session management
- Topic voting system
- Google authentication
- Admin dashboard for session creation
- Real-time updates with Supabase

## Tech Stack

- React
- Vite
- Tailwind CSS
- Supabase
- Framer Motion

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your Supabase credentials
4. Run the development server: `npm run dev`

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Authentication

The application uses Google OAuth through Supabase for authentication. Admin features are only available to users with @reforge.com email addresses.