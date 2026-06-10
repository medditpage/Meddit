# Medit Project Documentation

## 1. Project Summary

Medit is a healthcare-focused Next.js application designed to support a modern medical platform with:

- doctor and patient authentication
- doctor discovery and profile browsing
- appointment and consultation workflows
- community / forum-style medical discussions
- patient and doctor messaging
- dashboard analytics for practice management

The project is currently in an early-to-mid implementation stage: the core app shell, authentication, dashboard, doctor/community flows, and Supabase-backed pages exist, while some data is still mocked or partially wired for demonstration.

---

## 2. What This Project Is Meant to Do

The product vision appears to be a healthcare dashboard for both:

- doctors who want to manage patients, appointments, and visibility
- patients who want to find doctors, communicate, and browse medical community content

In practical terms, Medit combines:

- patient management UI
- doctor marketplace / directory UI
- clinical community discussion space
- messaging and consultation support
- secure authentication and session handling via Supabase

---

## 3. Current Implementation Status

### Implemented / Working in the current codebase

1. Next.js App Router project setup
2. Global layout and dashboard layout shell
3. Supabase-based authentication flow
4. Protected-route middleware
5. Dashboard with stat cards and recent activity
6. Doctor directory / search / filter UI
7. Community feed and post-detail experience
8. Messaging page with conversations and message loading
9. Appointment-related pages
10. Reusable UI components and shared layout components
11. Mock API endpoints for doctors and community data
12. Zustand-based user state store

### Partially implemented / demo-oriented

1. Some pages rely on mock data in `lib/mockDb.ts`
2. Some APIs simulate delays and return static sample data
3. Some database tables are expected by the UI (for example `patients`, `profiles`, `community_posts`, `comments`, `conversations`) but may still require real Supabase schema setup
4. Some components are present but not yet fully connected to production-ready backend logic

### Important note for LLM understanding

This repository is a hybrid project:

- real frontend structure and UI are present
- Supabase integration is present
- some sample/mock content exists for demo purposes
- production data integrity still depends on the actual Supabase database schema and environment variables

---

## 4. Core Tech Stack

### Frontend

- Next.js 16.2.7
- React 19.2.4
- TypeScript 5
- Tailwind CSS 4

### UI / UX

- Tailwind-based components
- reusable UI primitives in `components/ui/`
- custom layout wrappers in `components/layout/`

### State & Data

- Zustand for app state (`lib/store.ts`)
- Supabase SSR / browser clients
- SWR available in dependencies, likely for future data fetching
- React Hook Form + Zod for validation

### Backend / Services

- Supabase Auth
- Supabase database access through SSR/browser clients
- custom API routes in `app/api/`

---

## 5. Main User Flows

### A. Authentication Flow

The login page supports:

- sign in
- sign up
- OTP verification for new signups
- role selection between doctor and patient

This is implemented with Supabase auth and uses a custom `LoginPage` form.

### B. Dashboard Flow

The dashboard page is the main landing screen after login. It shows:

- total patient statistics
- community post counts
- doctor counts
- comment activity
- recent patient activity
- recent community posts
- quick-action cards

### C. Doctor Discovery Flow

The doctor directory page lets users:

- search by name, specialization, or hospital
- filter doctors by specialty
- open doctor profiles
- start chat/message a doctor

### D. Community Flow

The community section includes:

- trending topic views
- post cards
- detailed post view
- upvote / comments UI
- medical-relevance classification logic in the community page

### E. Messaging Flow

The messaging page loads:

- conversation list
- message history
- realtime message subscription logic (via Supabase channels)

---

## 6. Repository Structure Guide

### Root files

- `package.json` — project scripts and dependencies
- `tsconfig.json` — TypeScript config
- `next.config.ts` — Next.js config
- `tailwind.config.ts` — Tailwind config
- `middleware.ts` — protected-route middleware for auth redirects
- `README.md` — default Next.js starter README (needs project-specific expansion)
- `AGENTS.md` and `CLAUDE.md` — repository guidance files

### App Router structure

The `app/` directory is the main route layer of the project.

#### Core routes

- `app/page.tsx` — redirects the root path to `/dashboard`
- `app/dashboard/page.tsx` — main dashboard UI
- `app/login/page.tsx` — login / sign-up / OTP verification UI
- `app/doctors/page.tsx` — doctor listing/search UI
- `app/doctors/[id]/page.tsx` — doctor detail page
- `app/community/page.tsx` — community page with medical classification logic
- `app/community/[id]/page.tsx` — individual post detail page
- `app/messages/page.tsx` — messaging interface
- `app/appointments/page.tsx` — patient appointment flow
- `app/appointments/doctor/page.tsx` — doctor-side appointment flow
- `app/patients/page.tsx` — patient management UI
- `app/patients/[id]/page.tsx` — patient detail UI
- `app/settings/page.tsx` — settings page
- `app/marketing/about/` — marketing/about section

#### API routes

- `app/api/community/route.ts` — returns community mock data
- `app/api/doctors/[id]/route.ts` — returns a mock doctor record by id

### Components

The `components/` folder contains reusable UI blocks.

#### Main subfolders

- `components/layout/` — dashboard shell, sidebar, navbar, footer, page container
- `components/doctor/` — doctor cards, profile hero, booking modal, metrics
- `components/community/` — community cards, post cards, trending topics, comments
- `components/chat/` — chat UI elements
- `components/patient/` — patient-related cards
- `components/pharmacy/` — pharmacy/product components
- `components/shared/` — shared banners and badges
- `components/ui/` — base UI building blocks
- `components/providers/` — `AuthProvider.tsx`

### Hooks and utilities

- `hooks/` — hooks like `useAuth.ts`, `useChat.ts`, `useDebounce.ts`, `useMediaQuery.ts`
- `lib/` — app logic, store, mock data, utilities
- `utils/supabase/` — browser and server Supabase client helpers

### Types and data models

- `types/` — component and database typings
- `types/database.types.ts` — generated Supabase schema typing support
- `types/supabase.ts` — additional Supabase-related typings

---

## 7. Key Files and Their Purpose

### `app/layout.tsx`

Sets the global application shell and wraps children with `AuthProvider`.

### `middleware.ts`

Protects routes using Supabase session verification.

### `components/providers/AuthProvider.tsx`

Loads the current Supabase session, fetches the user profile, and stores the user in Zustand.

### `lib/store.ts`

Global app state for user info, notifications, and unread messages.

### `lib/mockDb.ts`

Static mock dataset used by API routes and demo pages.

### `utils/supabase/client.ts`

Browser-side Supabase client initializer.

### `utils/supabase/server.ts`

Server-side Supabase client initializer for server components and routes.

### `app/dashboard/page.tsx`

The core dashboard page showing summary cards and recent activity.

### `app/doctors/page.tsx`

Doctor discovery screen with search and specialization filtering.

### `app/community/page.tsx`

Community forum page with content classification and medical relevance rules.

---

## 8. Data Flow Overview

### Authentication flow

1. User opens `/login`
2. Supabase auth handles sign-in or sign-up
3. OTP step is used for signup verification
4. `AuthProvider` loads session and fetches profile data
5. Zustand store saves the current user

### Dashboard flow

1. Dashboard page uses `createClient()`
2. It fetches patient, post, doctor, and comment counts
3. It retrieves recent patients and recent posts
4. UI renders cards and activity lists

### Community flow

1. Community page fetches posts from Supabase or mock data
2. Post cards render and link to detail pages
3. The detail page supports comments, upvotes, and realtime-like interactions

### Doctor flow

1. `app/doctors/page.tsx` fetches doctor profiles from Supabase
2. Search filters narrow the list
3. Clicking a doctor opens detail or messaging actions

---

## 9. Important Architectural Notes

### Strong points

- App Router architecture is modern and scalable
- Auth + session handling are already integrated
- Reusable layout system reduces duplication
- Clear separation between presentation (`components/`) and data logic (`lib/`, `utils/`)

### Current limitations / caveats

- Some pages depend on Supabase tables that must exist in the actual project database
- Some demo data is mocked and may not reflect live production data
- The product is not yet fully production-hardened; some features are still scaffolding or placeholder screens
- The `README.md` is still the default Next.js template and should be replaced with a project-specific manual

---

## 10. How to Run This Project

From the project root:

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

If you want a production build:

```bash
npm run build
```

---

## 11. What Has Been Done So Far

At a high level, the project currently includes:

- full app shell and route structure
- authentication and protected access
- dashboard analytics and navigation
- doctor discovery and messaging hooks
- community feed and detail pages
- reusable UI components and layout building blocks
- Supabase integration for real data access
- mock/demo data for early UI development and testing

This means the project is already beyond a pure starter template and is moving toward a functional healthcare platform prototype.

---

## 12. LLM-Friendly Summary

If another LLM needs to understand this repository quickly, the shortest possible summary is:

> Medit is a Next.js 16 + TypeScript healthcare app with Supabase authentication, a doctor/patient dashboard, doctor directory/search, community/forum pages, messaging, and appointment workflows. The frontend is mostly implemented, and some parts still use mock data or require real Supabase schema wiring for full production behavior.

---

## 13. Recommended Next Improvements

For future development, the most valuable next steps are:

1. replace mock data with real production database entities
2. finish appointment booking and consultation logic
3. wire messaging and notices to real conversation tables
4. strengthen profile management and doctor verification workflows
5. expand tests and production validation
6. replace the default README with real project documentation

---

This file exists to make the repository easy for another AI agent or human developer to understand the project structure, current implementation status, and main technical architecture.
