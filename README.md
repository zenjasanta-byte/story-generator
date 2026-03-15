# Kids Story Generator

A simple and responsive MVP web app that generates personalized children's stories using the OpenAI Responses API.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Server API route (`app/api/story/route.ts`)
- OpenAI API (Responses API)

## 1) Install

```bash
npm install
```

## 2) Environment Setup

Create `.env.local` in the project root:

```bash
OPENAI_API_KEY=your_key_here
```

You can copy from `.env.example`.

## 3) Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000`.

## 4) Where to Change Prompts

- System prompt: `lib/prompts.ts` (`storytellerSystemPrompt`)
- User prompt builder: `lib/prompts.ts` (`buildStoryUserPrompt`)

## 5) Where to Integrate Database Later

Planned extension points:

- `lib/integrations/` for Supabase/Firebase adapters
- Add story persistence call in `app/api/story/route.ts` after generation
- Add user/profile tables or collections once auth is introduced

## 6) Stripe Integration Later

Recommended path:

- Add `app/api/billing/*` routes for checkout/session/webhook
- Add subscription checks in API route before generation
- Add plan UI in a new `app/pricing/page.tsx`

## MVP Features Included

- Friendly, colorful, responsive UI
- SaaS-style homepage with improved spacing and subtle motion
- Story form with all requested fields
- Quick presets: bedtime, friendship, educational
- Loading state + disabled submit to prevent double click
- Structured JSON generation output
- Error handling for validation and API failures
- Empty state before first story
- Sample data pre-filled for easy testing
- Copy story, download TXT, and generate another story actions
- Story history page (`/history`) backed by localStorage
- Last 10 generated stories saved locally

## Project Structure

- `app/` Next.js pages and server API routes
- `components/` reusable UI components
- `lib/` prompt logic, OpenAI integration, validation, local history
- `types/` TypeScript types
- `api/` reserved for future shared API wrappers
- `styles/` reserved for future style modules

## Stripe Launch Checklist

Before launch, set your real public domain in `NEXT_PUBLIC_APP_URL` and copy these public URLs into Stripe Dashboard:

- Privacy Policy: `https://YOUR-DOMAIN/en/privacy`
- Terms of Service: `https://YOUR-DOMAIN/en/terms`
- Refund / Cancellation Policy: `https://YOUR-DOMAIN/en/refunds`
- Support / Contact: `https://YOUR-DOMAIN/en/support`

Localized versions also exist under the same pattern:

- `/{locale}/privacy`
- `/{locale}/terms`
- `/{locale}/refunds`
- `/{locale}/support`

Manual placeholders to replace before launch:

- Support email: `support@example.com`
- Privacy email: `privacy@example.com`
- Company / legal entity name: `[Your Company / Legal Entity Name]`
- Business address: `[Your business address, if required]`
- Governing law / jurisdiction: `[Your governing law / jurisdiction]`

## Minimal auth setup

This project now includes a file-backed email/password auth system for localized login and signup pages.

Required environment variable:

- `AUTH_SECRET`
  - use a long random secret
  - required for signing the authenticated session cookie

Public auth routes:

- `/{locale}/login`
- `/{locale}/signup`

Auth API routes:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`

Behavior:

- anonymous guest flow remains active through `storybook_user_id`
- authenticated users additionally receive `storybook_auth_session`
- the server can now distinguish guest visitors from authenticated users without changing free story generation
