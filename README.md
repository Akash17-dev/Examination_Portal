# LeapStart Examination Portal

A role-based examination portal prototype for LeapStart School of Technology. It gives students a focused assessment experience, faculty an assessment-management workspace, and admins visibility into users, cohorts, and audit activity.

## Highlights

- Role-specific student, faculty, and admin dashboards
- Exam browsing, readiness checks, confirmation flow, and fullscreen exam attempts
- Faculty tools for exam control, question banks, quiz creation, and cohort performance
- MongoDB-backed exam and quiz storage, with starter exams seeded on first read
- Gemini-powered portal assistant and AI quiz-question generation, with usable local fallbacks when Gemini is unavailable
- Shared portal layout, search, notifications, profiles, timelines, leaderboards, and audit views

## Stack

- React 19 and Vite
- Express 5 API
- MongoDB Node.js driver
- Google Gemini API (optional for AI features)

## Prerequisites

- Node.js 18 or later
- A MongoDB database connection
- A Gemini API key if you want live assistant and quiz-generation responses

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your local environment file from the example:

   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your MongoDB connection details. `GEMINI_API_KEY` is optional; the app returns fallback content when it is not set or Gemini is unreachable.

   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/
   MONGODB_DB=examination_portal
   PORT=4000
   GEMINI_API_KEY=<your-gemini-api-key>
   GEMINI_MODEL=gemini-2.5-flash
   ```

4. Start the client and API server together:

   ```bash
   npm run dev
   ```

   The Vite client is served at `http://localhost:5173` by default and proxies `/api` requests to the Express server at `http://localhost:4000`.

## Demo access

These credentials are mock data for local development only. Authentication is client-side and must not be used as production authentication.

| Role | Email | Password |
| --- | --- | --- |
| Student | `student@leapstart.in` | `student123` |
| Faculty | `faculty@leapstart.in` | `faculty123` |
| Admin | `admin@leapstart.in` | `admin123` |

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run the Express API and Vite client concurrently. |
| `npm run server` | Run only the Express API. |
| `npm run client` | Run only the Vite development client. |
| `npm run build` | Create a production client build in `dist/`. |
| `npm run preview` | Serve the built client locally. |

## API overview

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Check MongoDB connectivity and list collections. |
| `GET` | `/api/exams` | List exams; seeds default exams when the collection is empty. |
| `POST` | `/api/exams` | Save an exam. |
| `DELETE` | `/api/exams?id=<id>` | Delete an exam. |
| `POST` | `/api/exams/seed` | Replace stored exams with the default seed data. |
| `GET` | `/api/quizzes` | List saved quizzes. |
| `POST` | `/api/quizzes` | Save a quiz. |
| `DELETE` | `/api/quizzes?id=<id>` | Delete a quiz. |
| `POST` | `/api/agent/chat` | Send a portal-support question to Gemini. |
| `POST` | `/api/agent/create-quiz` | Generate quiz questions with Gemini. |

## Project structure

```text
src/
  components/     # Dashboards, exam UI, layout, panels, and chat tools
  hooks/          # Authentication, dashboard, theme, toast, and data hooks
  utils/          # Browser storage and API helpers
  data/           # Development mock users and dashboard data
server/
  index.js        # Express routes and application startup
  db.js           # MongoDB connection lifecycle
  gemini.js       # Gemini request and JSON-extraction helpers
  defaultData.js  # Default exam seed data
```

## Production notes

This is a prototype. Before deploying it, replace mock client-side authentication with secure server-side authentication and authorization, restrict CORS to your production origin, validate API input, add per-user access controls, and keep all secrets out of source control.
