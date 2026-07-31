# Meddit — Complete UI/UX Architecture & Design System Specification

Welcome to the comprehensive UI/UX architecture and database design specification for **Meddit (`m/meddit.ai`)**, a clinical healthcare platform combining verified practitioner consultations, AI pre-visit symptom triage, a moderated medical community (`m/meddit`), end-to-end encrypted direct messaging, and dynamic patient record management.

---

## 🎨 Apple-Style Refined Design System

Meddit's UI is designed using an **Apple-style design philosophy**: restrained, confident, precise, and simple. Quality is expressed through typography, spacing, single accent focus, hairline 1px borders, and Lucide React icons, rather than multi-color fills or decorative glassmorphism.

### 📐 1. Color Palette & Restrained Token System
- **Neutral Surface Scale**:
  - **Light Mode**: Canvas (`bg-slate-50`), cards & containers (`bg-white`), borders (`border-slate-200`), primary text (`text-slate-900`), muted text (`text-slate-500`).
  - **Dark Mode**: Canvas (`bg-slate-950`), cards & containers (`bg-slate-900`), borders (`border-slate-800`), primary text (`text-slate-100`), muted text (`text-slate-400`).
- **Single Primary Accent**: **Teal** (`#0d9488` / `teal-600` in light, `teal-400` in dark) used exclusively for primary CTAs, active channel highlights, and key brand marks.
- **Desaturated Status Indicators**:
  - Verified badges, online indicators, and positive trends use desaturated dots or thin outline badges (`w-2 h-2 rounded-full bg-emerald-500` or `text-teal-400 bg-slate-800 border-slate-700`), avoiding full saturated background fills.

### 🧱 2. Surfaces & Hairline Borders (No Glassmorphism)
- **Solid Background Surfaces**: Removed all decorative `backdrop-blur-md` blobs and glassmorphic opacity overlays.
- **Hairline 1px Borders**: Containers feature clean `1px` borders (`border-slate-200` in light, `border-slate-800` in dark).
- **Imperceptible Shadows**: Micro-shadows (`shadow-xs` / `shadow-sm`) provide subtle elevation without floating-card drama.

### ⭕ 3. Border-Radius System
- **Button & Input Standard**: `8px` (`rounded-lg`) for buttons, form text inputs, select dropdowns, and search bars.
- **Card & Panel Standard**: `12px - 16px` (`rounded-xl` / `rounded-2xl`) for content cards, stat cards, and modal dialogues.
- **Eliminated Bloat**: Removed `rounded-3xl` card shapes and `rounded-full` buttons (reserved pill shapes strictly for tags and user avatars).

### 🔤 4. Typography Scale & Hierarchy
- **Type Family**: Clean sans-serif with disciplined weight hierarchy:
  - `Hero Headline`: 40px - 60px (`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white`).
  - `Section Header`: 20px - 28px (`text-2xl sm:text-3xl font-bold text-white tracking-tight`).
  - `Card Header`: 14px - 16px (`text-sm font-bold text-slate-900 dark:text-white`).
  - `Body Text`: 12px - 14px (`text-xs sm:text-sm font-normal text-slate-600 dark:text-slate-400`).
  - `Micro Labels`: 10px - 12px (`text-xs font-semibold uppercase tracking-wider text-slate-500`).

### 📦 5. Lucide Iconography (No Emoji-as-Icons)
- Replaced emoji icons (`🩺`, `🤖`, `💬`, `📅`, `👥`, `🚫`, `👨‍⚕️`, `👤`) with Lucide React icons at consistent stroke width and size (`w-4 h-4` or `w-5 h-5`):
  - `Calendar` — Scheduled consultations & agenda timeline.
  - `Users` — Active patients & patient vault.
  - `Bot` — AI symptom triage & draft generator.
  - `MessageSquare` — Community posts & messaging.
  - `ShieldCheck` — Medical verification & security.
  - `Stethoscope` — Clinical context & physician details.
  - `Clock` — Time & schedule indicators.
  - `Lock` — Cryptographic E2EE session badge.
  - `ArrowRight` / `ChevronDown` — Interactive triggers & accordions.

---

## 🔗 21st.dev Reference Components Map

| Surface Area | Reference Component | 21st.dev ID | Reference Link |
| :--- | :--- | :---: | :--- |
| **Sticky Header** | `Simple Header` by sshahaider | `7991` | [https://21st.dev/r/sshahaider/simple-header](https://21st.dev/r/sshahaider/simple-header) |
| **Stat Cards** | `Statistics Card 1` by sean0205 | `4220` | [https://21st.dev/r/sean0205/statistics-card-1](https://21st.dev/r/sean0205/statistics-card-1) |
| **Feed / Post Cards** | `SocialPostCard` by ruixen.ui | `2652` | [https://21st.dev/r/ruixen.ui/social-post-card](https://21st.dev/r/ruixen.ui/social-post-card) |
| **Chat / Speech Bubbles** | `AI Message Bubble` by elements- | `20125` | [https://21st.dev/r/elements-/message-bubble](https://21st.dev/r/elements-/message-bubble) |
| **Doctor / Profile Cards** | `DoctorLiveChatCard` by ruixen.ui | `2650` | [https://21st.dev/r/ruixen.ui/doctor-live-chat-card](https://21st.dev/r/ruixen.ui/doctor-live-chat-card) |
| **Modals & Alert Dialogs**| `Alert Dialog` by originui | `1144` | [https://21st.dev/r/originui/alert-dialog](https://21st.dev/r/originui/alert-dialog) |

---

## 🗄️ Database Schema & UI Form Audit (`public.profiles`)

Every column in the live `public.profiles` Supabase table is mapped to a dedicated, role-bounded UI section with strict validation.

### Complete Schema Gap Audit Table

| Column Name | In UI? (Y/N) | Form / Section Owner | Description & Validation Constraint |
| :--- | :---: | :--- | :--- |
| `id` | Y (Read-Only) | System / Metadata | Auth User UUID (Primary Key) |
| `name` | Y | Basic Info | Full display name (string, non-empty) |
| `username` | Y | Basic Info | Unique handle prefixed with `dr_` or `pt_` |
| `role` | Y (Read-Only) | Basic Info | Role constraint (`doctor` \| `patient`) |
| `gender` | Y | Basic Info | Gender identity select |
| `date_of_birth` | Y | Basic Info / Medical | Birth date picker (YYYY-MM-DD) |
| `phone` | Y | Basic Info | Contact phone number |
| `location` | Y | Basic Info | Primary city / clinic location |
| `about` | Y | Basic Info | Bio / Clinical practice summary |
| `avatar_initials` | Y (Derived) | Basic Info | Derived uppercase initials (e.g. "AV") |
| `preferred_language` | Y | Basic Info | Preferred consultation language |
| `languages` | Y | Basic Info / Doctor | Spoken languages comma-separated list |
| `specialization` | Y (Doctor Only) | Doctor Info | Medical specialty area |
| `hospital` | Y (Doctor Only) | Doctor Info | Clinic / Hospital affiliation |
| `professional_email` | Y (Doctor Only) | Doctor Info | Professional work email |
| `consulting_fee` | Y (Doctor Only) | Doctor Info | Consultation fee in INR (positive float) |
| `experience_years` | Y (Doctor Only) | Doctor Info | Years of clinical practice (integer) |
| `mci_number` | Y (Doctor Only) | Doctor Info | MCI / NMC License registration number |
| `cv_url` | Y (Doctor Only) | Doctor Verification | Supabase Storage path for CV/Resume PDF |
| `aadhaar_url` | Y (Doctor Only) | Doctor Verification | Supabase Storage path for Aadhaar ID |
| `availability` | Y (Doctor Only) | Doctor Schedule | Schedule summary & `doctor_availability` slots |
| `blood_group` | Y (Patient Only) | Patient Medical Info | ABO Blood type select |
| `allergies` | Y (Patient Only) | Patient Medical Info | Known drug & food allergies text |
| `current_medications` | Y (Patient Only) | Patient Medical Info | Active prescriptions text |
| `medical_conditions` | Y (Patient Only) | Patient Medical Info | Chronic diagnoses & medical history |
| `family_history` | Y (Patient Only) | Patient Medical Info | Hereditary medical conditions text |
| `past_surgeries` | Y (Patient Only) | Patient Medical Info | Previous surgical procedures text |
| `height_cm` | Y (Patient Only) | Patient Medical Info | Height in cm (positive float, calculates BMI) |
| `weight_kg` | Y (Patient Only) | Patient Medical Info | Weight in kg (positive float, calculates BMI) |
| `abha_number` | Y (Patient Only) | Patient Medical Info | Ayushman Bharat Health Account ID |
| `insurance_provider` | Y (Patient Only) | Patient Medical Info | Health insurance company name |
| `insurance_policy` | Y (Patient Only) | Patient Medical Info | Health insurance policy number |
| `see_doctor_mode` | Y (Patient Only) | Patient Medical Info | Doctor visibility toggle boolean |
| `emergency_contact_name` | Y | Emergency Contact | Emergency contact full name |
| `emergency_contact_phone` | Y | Emergency Contact | Emergency contact phone number |
| `emergency_contact_relation` | Y | Emergency Contact | Relationship to patient |
| `is_verified` | Y (Read-Only) | System / Admin | Physician verification badge boolean |
| `aadhaar_verified` | Y (Read-Only) | System / Admin | Aadhaar identity verification boolean |
| `verification_status` | Y (Read-Only) | System / Admin | Enum (`pending`, `approved`, `rejected`) |
| `verification_notes` | Y (Read-Only) | System / Admin | Admin approval notes text |
| `account_status` | Y (Read-Only) | System / Admin | Enum (`active`, `suspended`, `deactivated`) |
| `profile_completed` | Y (Saved) | System / Progress | Derived percentage (0 - 100%) |
| `reliability_rating` | Y (Read-Only) | System / Admin | Community rating score |
| `consulting_count` | Y (Read-Only) | System / Metrics | Completed consultation count |
| `success_count` | Y (Read-Only) | System / Metrics | Successful consultation count |
| `total_count` | Y (Read-Only) | System / Metrics | Total interaction count |
| `created_at` | Y (Read-Only) | System / Metadata | Profile creation ISO timestamp |

### Form Grouping & Role Constraints
In [app/settings/page.tsx](file:///c:/Users/pande/OneDrive/Desktop/rest/meddit/app/settings/page.tsx):
1. **Basic Info Group**: Name, Username, Phone, Gender, Location, Language, Bio.
2. **Doctor-Only Group** (`role === 'doctor'`): Specialization, Hospital, Fee, Experience, MCI Number, CV PDF, Aadhaar ID, Practice Schedule.
3. **Patient Medical Info Group** (`role === 'patient'`): Blood Group, Height, Weight, BMI, Allergies, Active Medications, Chronic Conditions, Family History, Past Surgeries, ABHA ID, Insurance Provider & Policy, Record Visibility Toggle.
4. **Emergency Contact Group**: Contact Name, Phone, Relationship.
5. **System / Admin Metadata**: Read-only display card showing Account Status, Verification Status, Verification Notes, Reliability Rating, and Profile Completion progress bar.

### Derived `profile_completed` Percentage
Calculated dynamically on profile save:
$$\text{profile\_completed} = \left\lfloor \frac{\text{Filled Applicable Fields}}{\text{Total Applicable Fields for Role}} \times 100 \right\rfloor$$
Saved directly to `public.profiles.profile_completed` in Supabase upon every update.

---

## 💬 Chat System Architecture & Messaging Engine Overhaul

### Schema Migration & Data Model
- **`public.messages` Schema Updates**: Added `file_name` (text), `file_size` (bigint), `delivered_at` (timestamptz), `read_at` (timestamptz) columns.
- **Supabase Storage Integration (`chat-attachments`)**: Uploads attachments to `chat-attachments` bucket (max 10MB limit enforced with client-side validation for `image/*` and `application/pdf`). Stores `file_url`, `file_type`, `file_name`, and `file_size` in DB. Fallback text filename stored in `content` — raw base64 data strings are never stored.

### Attachment Rendering & Lightbox
- **Bounded Inline Image Thumbnails**: Bounded to `max-w-[240px]` with `rounded-xl` corners. Clickable thumbnail opens full-screen image lightbox preview modal.
- **Compact Document Cards (PDFs)**: Renders Lucide `FileText` icon, filename, human-formatted file size (e.g. `1.4 MB`), and download action button.
- **Upload States**: Displays inline loading spinner placeholder during upload, with user-facing error banners for files >10MB or unsupported mime formats.

### Date Dividers & Local Timestamps
- **Centered Date Separator Pills**: Computes date transitions dynamically (`Today`, `Yesterday`, `Mon, Jul 28`).
- **Local Timestamps & Message Grouping**: Derives local time from message `created_at`. Groups consecutive messages from the same sender sent within 3 minutes (`180,000 ms`) under a single header.

### 3-State Ticks & Realtime Receipts
- **Sender-Side Ticks**:
  - `✓` Single Check (Gray): Sent to DB (`delivered_at` & `read_at` null).
  - `✓✓` Double Check (Gray): Delivered to recipient's client (`delivered_at` set).
  - `✓✓` Double Check (Blue): Read by recipient (`read_at` set or `is_read = true`).
- **Atomic Conversation Previews**: Updates `conversations.last_message` (`"📷 Photo"`, `"📄 Document"`, or truncated text) and `last_message_at` on every insert.

---

## 📱 Page-by-Page Design & Progress Status

### Phase A: Landing Page (`/` - `app/page.tsx`) — COMPLETED
- **Header**: Solid `bg-slate-950 border-b border-slate-800` header with `m/meddit.ai` mark, Lucide icons, and theme toggle.
- **Hero Section**: Refined dark slate canvas, Lucide `ShieldCheck` status badge, single `teal-600` primary CTA, and 12px rounded clinical preview card.
- **Features & FAQ**: Refined 12px rounded cards (`rounded-xl border border-slate-800 bg-slate-900`), chevron accordions, and footer.

### Phase B: Operational Dashboard (`/dashboard` - `app/dashboard/page.tsx`) — COMPLETED
- **StatCard Grid (`StatCard.tsx`)**: Refined solid 12px cards (`rounded-xl border border-slate-200 dark:border-slate-800`), Lucide `Calendar`, `Users`, `Bot`, `MessageSquare` icons, desaturated trend badges.
- **Today's Consultation Schedule**: Priority agenda timeline with Lucide `Clock` and `Calendar` icons, refined typography, and `View Appointment` action buttons.
- **AI Symptom Triage Brief Card**: Minimal assessment summary card with Lucide `Bot` icon and risk badges.

### Phase C: Community Feed (`/community`) — PENDING SIGN-OFF
- 3-column feed with `PostCard.tsx` theme support, Lucide upvote/comment icons, Gemini 2.5 Vision moderation modal.

### Phase D: Messages & Chat Thread (`/messages`) — PENDING SIGN-OFF
- 2-column chat workspace with Lucide icons, clinical context drawer, and Groq-powered AI draft assistant modal.

### Phase E: Doctor Discovery & Patient Vault (`/doctors` & `/patients`) — PENDING SIGN-OFF
- Natural language AI specialist matcher, verified doctor cards, and Card View Only patient vault.

### Phase F: Settings & Verification (`/settings`) — PENDING SIGN-OFF
- 5-group profile form mapping all 47 schema columns with role-based constraints and dynamic profile completion bar.

---

## 🏁 Phase Implementation Checkpoint

> [!IMPORTANT]
> **Current Status**: Phases **(a) Landing Page** and **(b) Dashboard** have been completely rebuilt according to the Apple-style design system and verified with `npx tsc --noEmit` (0 errors).
> Execution is currently paused at this checkpoint awaiting user sign-off before proceeding to phases (c) through (f).
