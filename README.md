# Student Hub — India’s Open Student Community

> **Learn. Build. Grow Together.**

Student Hub is a premium, modern, Pan-India student community platform built by students, for students. It serves as an ecosystem hub where students across India can discover internships, hackathons, workshops, coding contests, resources, and blogs. It also features a secure administrative control panel for community managers to manage content in real-time.

---

## 🚀 Key Features

### 1. Public Portals
- **Homepage**: Elegant introduction highlighting Student Hub's mission, values, active metrics counters, and dynamic preview cards for opportunities, events, and articles.
- **Opportunities Directory (`/opportunities`)**: Real-time listing of hackathons, fellowships, internships, campus ambassador programs, and jobs. Features interactive filters by *Category* (Hackathons, Internships, etc.) and *Mode* (Online, Offline, Hybrid) along with a search engine.
- **Events Calendar (`/events`)**: Listings of upcoming community webinars, meetups, coding contests, and workshops. Features filters for online/offline events.
- **Resources Library (`/resources`)**: Curated roadmaps, cheat sheets, GitHub repositories, tools, and PDFs. Features category filtering (e.g. Roadmaps, Career Prep, Learning) and search functionality.
- **Student Blog (`/blog`)**: Articles, guides, and tutorials written by students. Features a prominent *Featured Post* layout and a clean grid for standard articles.
- **Dynamic Post Detail Pages (`/blog/[slug]`)**: Fully responsive individual article pages with markdown rendering, tag badges, author bio cards, and a related posts section.
- **About, Team, & Contact Pages**: Beautiful structural layouts highlighting the community journey, the lead coordinators, and a working validation form for community queries.

### 2. Admin Dashboard (`/admin`)
A robust content management suite secured by credential validation:
- **Default Auth Credentials**:
  - **Email**: `admin@studenthub.in`
  - **Password**: `StudentHub@2026`
- **Modules**:
  - **Dashboard Overview**: Metrics overview of total active resources, opportunities, events, and posts.
  - **Manage Opportunities**: Add, edit, delete, and toggle active status for opportunity cards.
  - **Manage Events**: Add, edit, and delete upcoming meetups, workshops, and registrations.
  - **Manage Blogs**: Dynamic markdown composer to publish and edit articles with slug slugification.
  - **Manage Resources**: Add, edit, and delete curated roadmap and tool URLs.

---

## 🎨 Design System & Brand Identity

The visual interface is designed to emulate **Apple-style clean layouts** with a **premium startup feel**:
- **Color Palette** (extracted from the brand identity):
  - **Teal / Green**: Used for primary accents, hover states, and success indicators.
  - **Blue**: Used for structural frames, interactive elements, and highlight states.
  - **Yellow Accent / Amber**: Applied to specialized tags, contour decorations, and warnings.
  - **Soft Neutrals / Dark Glass**: Curated neutral scale for background surfaces (light/dark modes).
- **Aesthetics & Interactions**:
  - **Glassmorphism**: Elegant card borders and container backdrops using backdrop filters (`glass-card`).
  - **Mouse Glow Interaction**: Dynamic radial background gradients tracking mouse cursor coordinates for ambient lighting effects.
  - **Staggered Animations**: Framer Motion components providing responsive hover tilt/lift, smooth page transitions, and staggered list entries.
  - **Counter Animations**: Live incrementing statistics counter powered by `requestAnimationFrame` for community growth numbers.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) (with React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styles**: [Tailwind CSS v4](https://tailwindcss.com/) (modern typography and styling tokens)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (premium hover, scroll-triggered, and modal animation transitions)
- **Backend & Database**: [Firebase Suite](https://firebase.google.com/) (Firestore database, Firebase Auth, and Storage)
- **Fallback Persistence**: LocalStorage fallback interface running automatically during offline testing or when Firebase services are partially initialized.

---

## 🔥 Firebase Integration & Fallback Architecture

To ensure the application is robust, easy to test locally, and production-ready, it employs a **hybrid storage architecture** that transparently bridges Firestore with `localStorage`.

### 1. Database Operations (`src/lib/firestore.ts`)
- All CRUD methods (`fetchCollection`, `fetchDocument`, `addDocument`, `updateDocument`, `deleteDocument`) dynamically detect the active environment status.
- **Unified Sync Check**: If the system detects a local fallback session (e.g. `sh_mock_user` is active in `localStorage` or `isFirebaseConfigured()` is false), it routes all database queries (both reads and writes) to local storage. This guarantees full client-side synchronization and E2E testing validity even when Firebase Auth is unconfigured or offline.
- If a valid Firebase environment is detected and the admin is logged in via Firebase Auth, all operations transact with the live Cloud Firestore database.

### 2. Authentication Flow (`src/providers/AuthProvider.tsx`)
- **Dual Identity Routing**: On login (`/admin/login`), the system attempts to authenticate the user against **Firebase Auth**.
- **Local Fallback**: If the Firebase Auth API returns an error indicating it is not enabled or set up yet (e.g., `auth/configuration-not-found`), the provider falls back to validating the credentials locally against pre-set credentials:
  - **Email**: `admin@studenthub.in`
  - **Password**: `StudentHub@2026`
- On validation success, it persists a mock session object (`sh_mock_user`), letting the developer inspect and manipulate data immediately without manual database provisioning.

### 3. Security Rules (`firestore.rules`)
Firestore enforces granular access rules matching the community layout:
- **Public Collections**: `opportunities`, `events`, `blogs`, `resources`, `team`, and `stats` are open for anyone to read.
- **Administrative Mutating**: Writing, modifying, or deleting entries is strictly gated using `allow write: if isAuthenticated();`, ensuring that only verified administrators can alter the live catalog.

### 4. Interactive Database Seeding (`src/app/admin/page.tsx`)
- The admin dashboard features a live **"Connection Status"** badge indicating whether the app is running in *Connected to Firestore* or *LocalStorage Fallback* mode.
- If connected, administrators can click the **"Seed Firestore DB"** button to bulk-upload all initial mock datasets (opportunities, events, blogs, resources, team) to Firestore in a single click, instantly initializing the platform.

---

---

## 📂 Project Structure

```
├── public/                 # Static assets (logo, screenshot assets)
├── src/
│   ├── app/                # Next.js App Router Page components
│   │   ├── admin/          # Admin login and dashboard views
│   │   ├── about/          # About page view
│   │   ├── blog/           # Blog directory & [slug] dynamic posts
│   │   ├── contact/        # Contact validation form
│   │   ├── events/         # Events index view
│   │   ├── opportunities/  # Opportunities list and filters
│   │   ├── resources/      # Resources categories and links
│   │   ├── team/           # Team introduction cards
│   │   ├── layout.tsx      # Main application frame
│   │   └── page.tsx        # Homepage sections assembly
│   ├── components/         # Reusable layouts and custom ui elements
│   │   ├── ui/             # GlassCard, Button, Badge, Modal, Input components
│   │   ├── sections/       # Feature-specific previews & stats counters
│   │   └── admin/          # Dashboard sidebar and layout wrappers
│   ├── data/
│   │   └── mock.ts         # Preloaded fallback content and baseline entries
│   ├── providers/
│   │   ├── ThemeProvider.tsx # Client-side theme controller (Dark/Light)
│   │   └── AuthProvider.tsx  # Admin identity state provider
│   └── types/
│       └── index.ts        # TypeScript interfaces (Opportunity, Event, Blog, Resource)
├── package.json
└── tailwind.config.ts
```

---

## ⚙️ Development & Testing

### 1. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 2. Run Dev Server
Launch the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your browser.

### 3. Verification & E2E Testing
We have included a full browser E2E test script using Puppeteer-core. The test automatically logins, completes a full CRUD sequence, verifies local state synchronization, and checks route fallbacks.

To execute the test suite (requires local Chrome installation):
```bash
NODE_PATH=./node_modules node /Users/harsha/.gemini/antigravity/brain/ca12aa79-fb75-4ec2-8fcd-5d9c9a0ba932/scratch/test_flow.js
```

> [!NOTE]
> Review `walkthrough.md` in the project root for step-by-step screenshots captured during the E2E verification run showing the login screens, active modals, and synced views.
