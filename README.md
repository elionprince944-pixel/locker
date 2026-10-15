# LOCKER

A responsive React + Vite personal locker prototype with optional Supabase authentication and a database schema.

## Current features

- Responsive dashboard and mobile navigation
- Search, starred items, recent items, and demo trash view
- Create placeholder folders/items in the current browser session
- Supabase email/password sign-up, sign-in, and sign-out when environment variables are configured
- SQL schema for user profiles and private per-user item metadata with Row Level Security
- Optional private Storage bucket policies for files

## Connect Supabase

1. Open your Supabase project dashboard.
2. Go to **SQL Editor**, create a new query, paste all of `supabase/schema.sql`, and run it.
3. In **Project Settings → API** (the exact menu label may vary), copy your Project URL and the publishable/anon client key. Never use a service-role key in browser code.
4. In your deployment provider's environment-variable settings, add:
   - `VITE_SUPABASE_URL` = your Project URL
   - `VITE_SUPABASE_ANON_KEY` = your publishable/anon key
5. Redeploy the app after adding the variables.
6. In **Authentication → URL Configuration**, set the Site URL to your deployed website and add its URL to the allowed redirect URLs.
7. If you want file uploads later, create a **private** Storage bucket named `locker-files`. The SQL file includes owner-folder policies for it.

For local development, copy `.env.example` to `.env.local` and fill in those values. Do not commit real environment values.

## Run locally

Requires a current Node.js version compatible with Vite 6.

```bash
npm install
npm run dev
```

For a production bundle:

```bash
npm run build
```

## Important current limitations

The dashboard items are still demo state and are not yet loaded from or saved to Supabase. Authentication is real only after valid Supabase URL/key values are configured and the database project is set up. The app does not yet upload files, encrypt file contents itself, or have a tested deployment. Do not store sensitive documents until those parts are implemented and tested.
