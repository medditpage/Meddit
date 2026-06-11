# Medit — Current Project Documentation

## 1. Project Purpose

Medit is a healthcare-oriented Next.js application that combines:

- doctor and patient authentication
- doctor discovery and profile browsing
- appointment booking and management
- community/forum-style medical discussions
- messaging and consultation workflows
- dashboard-style practice oversight

The current repository already contains a working app shell, protected routing, Supabase authentication, and multiple healthcare-facing screens connected to real Supabase tables and demo data paths.

---

## 2. What the Product Looks Like Today

The app is structured as a healthcare platform prototype with these main areas:

- root redirect to the main dashboard
- login / sign-up / OTP verification flow
- doctor directory and doctor detail views
- appointment booking and management pages
- patient management and medical-history style screens
- community feed and post detail pages
- messaging interface with real-time-style table interactions
- settings page for profile, availability, and storage workflows

The main entry experience for signed-in users is /dashboard.

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
12. API routes under app/api/ for community, doctors, file proxy, and video-related utilities

### Partially implemented or demo-dependent

1. Some pages still rely on mock or demo data for API responses
2. app/api/community/route.ts uses mock database data from lib/mockDb.ts
3. Several UI flows depend on Supabase schema tables that must exist in the real project database
4. The app is a strong prototype, but not yet fully production-hardened

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

### Supporting libraries

- lucide-react
- @react-three/fiber and @react-three/drei
- clsx / tailwind-merge
- three

---

## 5. Main Application Areas

### A. Authentication and session flow

The main login experience is in app/login/page.tsx.

It supports:

- sign in
- sign up
- OTP verification for registration
- role selection between doctor and patient

The global auth context is handled by components/providers/AuthProvider.tsx, which loads the current Supabase session and stores the user profile in Zustand.

### B. Dashboard flow

The main dashboard page is app/dashboard/page.tsx.

It displays:

- patient counts
- community post counts
- verified doctor counts
- comment totals
- recent patient activity
- recent community posts
- quick action cards

### C. Doctor discovery and booking flow

The doctor pages are implemented in:

- app/doctors/page.tsx
- app/doctors/[id]/page.tsx

These screens provide:

- search by name, specialization, or hospital
- specialization filtering
- doctor profile details
- appointment booking with date/time slot selection
- doctor availability lookup

### D. Community / forum flow

The community pages are implemented in:

- app/community/page.tsx
- app/community/[id]/page.tsx

They support:

- community feed UI
- post creation and reporting
- comment and discussion interactions
- post filtering and medical relevance-oriented presentation

### E. Messaging flow

The messaging system lives in app/messages/page.tsx.

It uses Supabase-backed tables for:

- conversations
- messages
- user public key storage

This area depends on the correct schema being present in Supabase.

### F. Patient / appointment / settings flow

Additional healthcare workflows are present in:

- app/patients/page.tsx
- app/appointments/page.tsx
- app/settings/page.tsx

These pages support patient management, appointment handling, and profile / availability configuration.

---

## 6. Repository Structure Overview

### Root files

- package.json — scripts and dependencies
- next.config.ts — app configuration
- middleware.ts — protected route middleware
- tailwind.config.ts — Tailwind setup
- tsconfig.json — TypeScript configuration
- README.md — default starter README, not yet project-specific
- AGENTS.md / CLAUDE.md — repository guidance files

### Main application folders

- app/ — route-level pages and API endpoints
- components/ — reusable UI, layout, medical, chat, and provider components
- hooks/ — auth and UI hooks
- lib/ — app state, helper logic, and mock data
- utils/supabase/ — Supabase browser and server clients
- types/ — Supabase and project type definitions

---

## 7. Key Files and Their Current Purpose

### app/layout.tsx

Wraps the app in AuthProvider and sets the global shell.

### middleware.ts

Protects routes by checking for a valid Supabase session.

### components/providers/AuthProvider.tsx

Loads the user session and populates the Zustand store.

### lib/store.ts

Stores global app state such as the active user, notifications, and unread message count.

### lib/mockDb.ts

Contains static mock data used by demo API routes and early UI development.

### utils/supabase/client.ts

Browser-side Supabase client helper.

### utils/supabase/server.ts

Server-side Supabase client helper for route logic and SSR access.

### app/dashboard/page.tsx

Main dashboard UI and summary experience.

### app/doctors/page.tsx

Doctor search, filtering, and listing experience.

### app/doctors/[id]/page.tsx

Doctor profile and appointment booking screen.

### app/community/page.tsx

Community feed, moderation-like interactions, and post management.

### app/messages/page.tsx

Messaging page with conversation and message data handling.

---

## 8. Current Data and Integration Notes

The project currently uses a mix of:

- live Supabase queries for dashboards, profiles, appointments, and messaging
- demo/mock data for some API responses and early UI support

This means the repository is already a real application skeleton, but full production behavior depends on the correct Supabase database schema and environment variables being configured.

Important tables expected by the current UI include:

- profiles
- patients
- doctors
- appointments
- doctor_availability
- community_posts
- comments
- post_reports
- conversations
- messages
- user_public_keys

If these tables are not present or correctly configured in the Supabase project, some pages may fail or show incomplete data.

---

## 9. Architectural Strengths

The current version already has several strong foundations:

- modern App Router structure
- real Supabase authentication integration
- reusable layout and component system
- clear separation between route pages, UI components, and utilities
- healthcare-specific flows for doctors, patients, appointments, and community

---

## 10. Current Gaps and Risks

The main caveats are:

1. some features still use mock data instead of production data
2. the full database schema must be wired correctly for live usage
3. production validation, error handling, and data integrity checks still need tightening
4. the default README is not yet customized for this healthcare product

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

Production build:

```bash
npm run build
```

---

## 12. Short Summary for Future AI Agents

Medit is a Next.js 16 + TypeScript healthcare application with Supabase authentication, doctor and patient workflows, appointment booking, community/forum pages, messaging, and dashboard analytics. The UI and route structure are already implemented, and the project currently uses a combination of real Supabase-backed pages and demo/mock data for some early-stage features.

---

## 13. Recommended Next Improvements

1. replace mock/demo data with real production datasets
2. complete appointment and consultation workflow validation
3. wire messaging and notification tables to production data
4. harden role-based permissions and profile management
5. add automated tests and deployment checks
6. replace the default README with a product-specific developer guide
