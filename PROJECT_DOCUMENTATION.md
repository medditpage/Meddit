# Medit — Current Project Documentation

## 1. Project Purpose

Medit is a healthcare-oriented Next.js application that combines:

- doctor and patient authentication
- doctor discovery and profile browsing
- appointment booking and management with AI-assisted symptom triage
- community/forum-style medical discussions with pre-publish AI moderation
- messaging and consultation workflows with doctor-assisted AI reply drafting
- dashboard-style practice oversight

The current repository already contains a working app shell, protected routing, Supabase authentication, multi-tenant doctor/patient views, and an integrated Groq AI inference layer.

---

## 2. What the Product Looks Like Today

The app is structured as a healthcare platform prototype with these main areas:

- root redirect to the main dashboard
- login / sign-up / OTP verification flow
- doctor directory with symptom-to-specialization search and doctor detail views
- appointment booking and management pages with structured pre-visit intake summaries
- patient management and medical-history style screens
- community feed and post detail pages with proactive AI moderation scanning
- messaging interface with doctor-side AI reply drafting and end-to-end security options
- settings page for profile, availability, and storage workflows

The main entry experience for signed-in users is `/dashboard`.

---

## 3. Current Implementation Status

### Implemented and active in the codebase

1. Next.js 16 App Router project setup
2. Global layout and dashboard shell
3. Supabase Auth sign-in, sign-up, and OTP verification flow
4. Protected route middleware for authenticated navigation
5. Zustand-based session/user state store
6. Dashboard with stats, recent activity, and quick actions
7. Doctor discovery and detail pages
8. Appointment booking UI and appointment management workflows
9. Community forum page and post detail page
10. Messaging page with conversation/message table access and key handling
11. Settings page with profile, availability, file upload, and sign-out logic
12. Groq AI Inference Client (`lib/ai/client.ts`) supporting free models (`llama-3.3-70b-versatile`)
13. API routes under `app/api/` for symptom triage, content moderation, doctor reply drafting, community, doctors, file proxy, and video utilities

### Partially implemented or demo-dependent

1. Some pages still rely on mock or demo data for API responses
2. `app/api/community/route.ts` uses mock database data from `lib/mockDb.ts`
3. AI inference routes fallback to deterministic engines if `GROQ_API_KEY` is not present
4. Full production deployment requires database migration scripts for `pre_visit_summaries` and `moderation_flags`

---

## 4. Core Tech Stack

### Frontend

- Next.js 16.2.7
- React 19.2.4
- TypeScript 5
- Tailwind CSS 4

### UI / Form / State

- Tailwind-based UI components
- React Hook Form for forms
- Zod for validation
- Zustand for global app state

### Backend / Data

- Supabase Auth
- Supabase SSR + browser clients
- Supabase Realtime-style subscriptions used in messaging and community views
- SWR available in dependencies for future fetch patterns

### AI / Inference Layer

- Groq API (`llama-3.3-70b-versatile` / `llama-3.1-8b-instant`) via `GROQ_API_KEY` for symptom triage, pre-publish moderation, and doctor reply drafting.

### Supporting libraries

- lucide-react
- @react-three/fiber and @react-three/drei
- clsx / tailwind-merge
- three

---

## 5. Main Application Areas

### A. Authentication and session flow

The main login experience is in `app/login/page.tsx`.

It supports:

- sign in
- sign up
- OTP verification for registration
- role selection between doctor and patient

Auth/session logic remains 100% deterministic with no AI dependencies.

### B. Dashboard flow

The main dashboard page is `app/dashboard/page.tsx`.

It displays:

- patient counts
- community post counts
- verified doctor counts
- comment totals
- recent patient activity
- recent community posts
- quick action cards

*Optional Future AI*: Weekly narrative summary of stats (e.g. "12 patients this week, 4 with recurring complaints about respiratory issues"). Low priority / nice-to-have.

### C. Doctor discovery and booking flow — Primary AI Location #1

The doctor pages are implemented in:

- `app/doctors/page.tsx`
- `app/doctors/[id]/page.tsx`

These screens provide:

- **Symptom-to-specialization matching**: patient types free-text symptoms, AI maps to the right specialization and ranks doctor results, instead of requiring the patient to already know what kind of doctor they need.
- **Pre-appointment triage**: before the booking is confirmed, AI turns a free-text patient description into a structured pre-visit summary (`likely_symptoms`, `duration`, `relevant_history`, `urgency_level`) attached to the appointment, so the doctor isn't starting from zero.

### D. Community / forum flow — Primary AI Location #2

The community pages are implemented in:

- `app/community/page.tsx`
- `app/community/[id]/page.tsx`

They support:

- **Pre-publish moderation classifier**: every post/comment gets scanned before going live for:
  - (a) medical misinformation
  - (b) content that should defer to a real doctor rather than peer answers
  - (c) emergency-signal language (self-harm, chest pain, stroke symptoms) that triggers a warning banner instead of waiting for replies.
- Sits alongside the existing `post_reports` table as a proactive layer, not a replacement for reactive reporting.

### E. Messaging flow — Primary AI Location #3

The messaging system lives in `app/messages/page.tsx`.

It supports:

- **Doctor-side reply drafts**: AI drafts a response based on conversation history; doctor edits/approves before sending. No auto-send — human always confirms.
- **No AI on patient side of messaging** (avoids AI giving unverified medical advice directly to patients in 1:1 chat).

### F. Patient / appointment / settings flow

Additional healthcare workflows are present in:

- `app/patients/page.tsx`
- `app/appointments/page.tsx`
- `app/settings/page.tsx`

No AI in settings/profile/availability logic (remains deterministic/config-driven).

---

## 6. Repository Structure Overview

### Root files

- `package.json` — scripts and dependencies
- `next.config.ts` — app configuration
- `middleware.ts` — protected route middleware
- `tailwind.config.ts` — Tailwind setup
- `tsconfig.json` — TypeScript configuration
- `README.md` — project README
- `AGENTS.md` / `CLAUDE.md` — repository guidance files
- `PROJECT_DOCUMENTATION.md` — master project architecture reference

### Main application folders

- `app/` — route-level pages and API endpoints (including `triage`, `moderate`, `draft`)
- `components/` — reusable UI, layout, medical, chat, and provider components
- `hooks/` — auth and UI hooks
- `lib/` — app state, helper logic, mock data, and `lib/ai/` client wrapper
- `utils/supabase/` — Supabase browser and server clients
- `types/` — Supabase and project type definitions (including `types/ai.ts`)

---

## 7. Key Files and Their Current Purpose

### app/layout.tsx

Wraps the app in AuthProvider and sets the global shell.

### middleware.ts

Protects routes by checking for a valid Supabase session.

### lib/ai/client.ts — NEW

Centralized Groq LLM API calls (`llama-3.3-70b-versatile`), prompt templates, structured JSON parsing, error handling, and deterministic fallback engines.

### app/api/appointments/triage/route.ts — NEW

Handles pre-visit AI summary generation and symptom-to-specialization mapping.

### app/api/community/moderate/route.ts — NEW

Handles pre-publish AI content classification, misinformation scanning, and emergency warning detection.

### app/api/messages/draft/route.ts — NEW

Handles AI reply draft generation for doctor-side messaging review.

### app/dashboard/page.tsx

Main dashboard UI and summary experience.

### app/doctors/page.tsx

Doctor search, symptom matching filter, and listing experience.

### app/doctors/[id]/page.tsx

Doctor profile and appointment booking screen.

### app/community/page.tsx

Community feed, moderation-like interactions, and post management.

### app/messages/page.tsx

Messaging page with conversation and message data handling.

---

## 8. Current Data and Integration Notes

Additions to support AI features:

- `pre_visit_summaries` (linked to appointments) — stores structured AI-generated intake data (`likely_symptoms`, `duration`, `relevant_history`, `urgency_level`).
- `moderation_flags` (linked to community posts/comments) — logs AI classifier decisions before/alongside `post_reports`.

Standard core tables (remain deterministic without AI changes):

- profiles
- patients
- doctors
- doctor_availability
- appointments
- community_posts
- comments
- post_reports
- conversations
- messages
- user_public_keys

---

## 9. Architectural Strengths

The current version has several strong foundations:

- modern Next.js 16 App Router structure
- real Supabase authentication integration
- reusable layout and component system
- clear separation between route pages, UI components, and utilities
- healthcare-specific flows for doctors, patients, appointments, and community
- **AI-assisted triage, proactive moderation, and doctor-side reply drafting** powered by Groq high-speed LLM inference

---

## 10. Current Gaps and Risks

The main caveats are:

1. **Human-in-the-loop requirement**: AI outputs (triage summaries, moderation flags, reply drafts) are advisory only and must never auto-send or auto-publish without human review — especially in a healthcare context where AI errors could mean missed emergency signals or bad medical suggestions.
2. some features still use mock data instead of production data
3. the full database schema must be wired correctly for live usage
4. production validation, error handling, and data integrity checks still need tightening

---

## 11. How to Run the Project

From the project root:

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

### AI Configuration (Groq API)

Add your Groq API Key to `.env.local`:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Production build:

```bash
npm run build
```

---

## 12. Short Summary for Future AI Agents

Medit is a Next.js 16 + TypeScript healthcare application with Supabase authentication, doctor and patient workflows, appointment booking with AI-assisted symptom triage, community/forum pages with AI pre-publish moderation, messaging with AI-drafted doctor replies, and dashboard analytics.

---

## 13. Recommended Next Improvements

1. replace mock/demo data with real production datasets
2. complete appointment and consultation workflow validation
3. wire messaging and notification tables to production data
4. harden role-based permissions and profile management
5. add automated tests and deployment checks
6. Build pre-visit AI triage (symptom-to-specialization matching + structured intake summary)
7. Build AI pre-publish moderation classifier for community posts/comments
8. Build AI-assisted reply drafting for doctor-side messaging (human-approved only)
9. Add safeguards/logging so all AI outputs are auditable and reviewable, given the healthcare context
