# AldoDent

Website and appointment system for AldoDent, a dental clinic in Gjilan, Kosovo.

**Live:** https://aldodent.netlify.app

## Overview

AldoDent is a dental clinic in Gjilan, Kosovo. Designed and built by Art Halimi, the project pairs an Albanian-language marketing site, built around scroll-driven animation, with an online booking flow and a clinic dashboard. Patients book a treatment with a specific doctor; staff manage the daily schedule, the monthly calendar, breaks, patients and the service list from one admin area.

## Features

**Public site**

- Home, services, about, gallery, contact and booking pages, each with its own title, description and canonical URL (react-helmet-async), plus a sitemap, robots.txt and web manifest
- Four-step booking wizard (service, date and time with doctor, patient details, confirmation) with animated step transitions; Sundays are hidden, and past times or slots running past closing time are blocked
- Patient sign-up (name, surname, phone, email) and login with JWT; booking details are pre-filled for signed-in patients
- Emails through Resend: welcome, booking confirmation, cancellation, and a daily 08:00 reminder for the next day's appointments

**Clinic dashboard** (admin and doctor roles)

- Overview with an area chart of bookings (week, month, year or all time) and a service-popularity donut chart (Recharts)
- Daily schedule per doctor, monthly calendar and a patient list
- Manual bookings for phone or walk-in patients, and time-off blocks per doctor
- Confirm or delete appointments (deleting one emails the patient a cancellation)
- Create, edit and delete services with duration and price
- Polls for new bookings every 10 seconds and shows a notification panel with a sound alert

## Tech stack

- **Frontend:** React 19, Vite 7, React Router 7, Tailwind CSS 4, Framer Motion, Recharts, lucide-react and Material Design Icons
- **Backend:** Node.js, Express 4 (ES modules), jsonwebtoken, bcrypt, node-cron
- **Database:** PostgreSQL through the `postgres` client over SSL
- **Services:** Resend (email); frontend on Netlify, API on Render

## Technical highlights

- **Code splitting.** Every page is lazy-loaded with `React.lazy` and `Suspense`, and Rollup splits vendor code into separate React, animation and UI chunks. See [src/App.jsx](src/App.jsx) and [vite.config.js](vite.config.js).
- **Slot-based availability.** The booking wizard expands each appointment (by service length) and each blocked time range into 30-minute `date_doctor_time` keys, then checks the full length of the chosen treatment against them and against closing time before letting the patient continue. See [src/pages/Booking.jsx](src/pages/Booking.jsx).
- **Scroll-driven animation.** A horizontal parallax section maps vertical scroll to horizontal movement with Framer Motion `useScroll`, `useTransform` and `useSpring`, measuring the track width at runtime; the process section stacks sticky full-screen panels; a page loader covers route changes with a wipe transition. See [src/components/HorizontalParallax.jsx](src/components/HorizontalParallax.jsx), [SignatureProcess.jsx](src/components/SignatureProcess.jsx) and [PageLoader.jsx](src/components/PageLoader.jsx).
- **Role-aware auth on both ends.** An auth context restores the session from `/api/auth/me`, a protected route guards the dashboard, and matching Express middleware checks roles server-side, with doctors allowed into admin views. See [src/context/AuthContext.jsx](src/context/AuthContext.jsx) and [backend/authMiddleware.js](backend/authMiddleware.js).
- **Schema bootstrap with env-seeded admin.** On boot the API creates its tables with tagged-template SQL (parameterised by construction), seeds the services and doctors when empty, and creates the first admin from environment variables, so no credentials live in code. See [backend/db.js](backend/db.js).

## Getting started

**Prerequisites:** Node.js 20.19+ (required by Vite 7), a PostgreSQL database that accepts SSL connections (the client connects with `ssl: 'require'`), and a Resend API key for email.

```bash
# Frontend (repo root)
npm install
npm run dev          # http://localhost:5173

# Backend
cd backend
npm install
npm run dev          # node --watch, http://localhost:5000
```

| Location | Script | Purpose |
| --- | --- | --- |
| root | `npm run dev` / `build` / `preview` / `lint` | Vite dev server, production build, preview, ESLint |
| backend | `npm start` | Start the API |
| backend | `npm run dev` | Start the API with Node's built-in watch mode |

**Database.** Point `DATABASE_URL` at an empty database. On start the API creates the `users`, `appointments`, `blocked_times`, `services` and `doctors` tables, seeds the service list and two doctors, and creates the first admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD` when there are no users yet. `backend/update_db.js` and `backend/update_users_doctor.js` add columns to databases created by older versions.

**Backend environment variables** (`backend/.env`)

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing login tokens (if unset, a random one is used and sessions reset on restart) |
| `ADMIN_EMAIL` | Email of the first admin account, created only when the users table is empty |
| `ADMIN_PASSWORD` | Password for that first admin (stored as a bcrypt hash) |
| `RESEND_API_KEY` | Resend API key for outgoing email |
| `SENDER_EMAIL` | Sender address for outgoing email |
| `PORT` | API port (default 5000) |

**Frontend environment variables** (`.env` in the repo root)

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | API base URL (defaults to `http://localhost:5000`) |

The API's CORS settings allow the production site and `http://localhost:5173`.

## Project structure

```
AldoDent/
├── src/
│   ├── pages/            # Home, Services, About, Gallery, Contact, Booking, Login, Signup, Admin
│   ├── components/       # Navbar, Hero, HorizontalParallax, SignatureProcess, Testimonials, PageLoader
│   │   └── admin/        # Dashboard tabs (overview, schedule, calendar, patients, services, time off) and modals
│   └── context/          # AuthContext (JWT session)
├── public/               # Icons, manifest, sitemap, robots.txt, SPA redirects
└── backend/
    ├── index.js          # Express app and route mounting
    ├── db.js             # Postgres client, schema bootstrap and seeding
    ├── routes/           # auth, appointments, blocked-times, services, doctors
    ├── emailService.js   # Resend email templates
    └── cronJobs.js       # Daily reminder job
```

## Author

Designed and built by [Art Halimi](https://arthalimi.com) · [GitHub](https://github.com/ArtHalimi7)
